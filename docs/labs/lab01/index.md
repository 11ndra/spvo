# Лабораторная работа №1

## Первый NIDS: visibility → alert → interpretation

<div class="lab-header">
  <div><strong>Уровень:</strong> вводный</div>
  <div><strong>Инструменты:</strong> Suricata, tcpdump, curl, jq</div>
  <div><strong>Среда:</strong> IDPS LabBox v0.1</div>
</div>

<div class="chapter-lead">
<p>Первая лабораторная не про написание сложных сигнатур. Нужно экспериментально доказать минимальную цепочку: <strong>трафик существует → выбранная точка его наблюдает → Suricata получает данные → detector срабатывает → alert корректно интерпретируется</strong>.</p>
</div>

<div class="chapter-outcomes">
<strong>После выполнения работы студент должен уметь:</strong>
<p>проверить сетевой путь до запуска IDS; доказать visibility на конкретном interface; запустить Suricata с готовым правилом; выполнить negative/positive test; найти alert в EVE JSON; объяснить, что alert подтверждает и чего он не доказывает.</p>
</div>

!!! warning "Статус QA"
    Команды Suricata сверены с официальными интерфейсами Suricata 8. Сам LabBox имеет статус **RUNTIME QA REQUIRED** до полного прогона на той Ubuntu/версии Suricata, которая используется в аудитории. Перед занятием преподавателю следует выполнить контрольный прогон всей работы один раз.

---

## 1. Топология

Работа выполняется в одной Ubuntu VM. LabBox создаёт два network namespace:

```text
idps-client                    idps-web
10.13.37.10                    10.13.37.20:8080
     │                               │
     └──────── br-idps ──────────────┘
              │
              └─ observation interface: lab-client0
```

Suricata работает как **пассивный NIDS** и наблюдает `lab-client0`.

!!! important
    LabBox создаёт сеть и безопасный HTTP-сервис. Он не устанавливает Suricata, не создаёт правило и не запускает IDS за студента.

[Скачать IDPS LabBox v0.1](../../assets/downloads/idps-labbox-v0.1.zip){ .md-button }
[Скачать starter pack ЛР №1](../../assets/downloads/lab01-starter-v0.1.zip){ .md-button }

---

## 2. Подготовьте стенд

```bash
unzip idps-labbox-v0.1.zip
cd idps-labbox-v0.1
sudo bash scripts/lab-init.sh
sudo bash scripts/lab-status.sh
bash scripts/lab-topology.sh
```

Дополнительно проверьте созданные объекты:

```bash
ip netns list
ip -br link
sudo ip -n idps-client -br addr
sudo ip -n idps-web -br addr
```

<div class="lab-evidence">
<strong>Контрольная точка 1</strong>
<p>Покажите, где находятся Client и Web, какие у них IP-адреса и какой interface используется как observation point.</p>
</div>

---

## 3. Сначала докажите, что трафик существует

Первый терминал:

```bash
sudo tcpdump -nn -i lab-client0 'tcp port 8080'
```

Второй терминал:

```bash
sudo ip netns exec idps-client \
  curl http://10.13.37.20:8080/
```

`tcpdump` должен показать взаимодействие между `10.13.37.10` и `10.13.37.20:8080`.

Почему этот шаг выполняется **до** Suricata?

Потому что отсутствие alert может означать не ошибку правила, а отсутствие нужной visibility.

<div class="lab-evidence">
<strong>Контрольная точка 2</strong>
<p>Зафиксируйте, какими наблюдениями вы доказали, что нужный трафик доступен на <code>lab-client0</code>.</p>
</div>

---

## 4. Подготовьте Suricata

Если Suricata уже установлена преподавателем, не переустанавливайте её. Зафиксируйте фактическую версию:

```bash
sudo suricata --build-info
```

Если системный сервис запущен, для лаборатории остановите его, потому что далее используется отдельный контролируемый процесс:

```bash
sudo systemctl stop suricata
```

Проверьте базовую конфигурацию:

```bash
sudo suricata -T -c /etc/suricata/suricata.yaml
```

Если Suricata отсутствует, используйте подготовленный преподавателем offline image или согласованный способ установки. Не тратьте время лабораторной на случайные версии пакетов.

---

## 5. Получите готовое правило

В этой работе **не требуется проектировать rule syntax**. Это будет отдельной темой курса.

Starter pack содержит `lab01.rules`:

```text
alert http 10.13.37.10 any -> 10.13.37.20 8080 (msg:"LAB1 HTTP marker observed"; flow:established,to_server; http.uri; content:"ATTACK-LAB"; sid:1000001; rev:1;)
```

Смысл правила:

> если Suricata обнаруживает `ATTACK-LAB` в анализируемом HTTP URI для заданного направления, создать alert SID 1000001.

Скопируйте файл в рабочий каталог или используйте его напрямую.

Проверьте конфигурацию вместе с rule:

```bash
sudo suricata -T \
  -c /etc/suricata/suricata.yaml \
  -S ./lab01.rules
```

`-T` доказывает, что конфигурация и rule могут быть разобраны Suricata. Он **не** доказывает, что нужный traffic виден и alert обязательно появится.

---

## 6. Запустите NIDS

Создайте отдельный каталог логов:

```bash
mkdir -p ~/lab01-output
rm -f ~/lab01-output/*
```

Запустите Suricata в отдельном терминале:

```bash
sudo suricata \
  -c /etc/suricata/suricata.yaml \
  -S ./lab01.rules \
  -i lab-client0 \
  -l "$HOME/lab01-output"
```

Оставьте процесс работающим.

---

## 7. Negative test

Отправьте запрос **без** marker:

```bash
sudo ip netns exec idps-client \
  curl http://10.13.37.20:8080/normal
```

Проверьте наш SID:

```bash
jq 'select(.event_type=="alert" and .alert.signature_id==1000001)' \
  ~/lab01-output/eve.json
```

Для выбранного negative case наш alert появиться не должен.

Это означает только:

> detector SID 1000001 не сработал на данном тестовом запросе.

Это **не** доказательство отсутствия любой атаки.

---

## 8. Positive test

Теперь отправьте запрос с marker:

```bash
sudo ip netns exec idps-client \
  curl 'http://10.13.37.20:8080/ATTACK-LAB'
```

Снова найдите SID 1000001:

```bash
jq '
  select(.event_type=="alert" and .alert.signature_id==1000001)
  | {
      timestamp,
      src_ip,
      src_port,
      dest_ip,
      dest_port,
      proto,
      signature: .alert.signature,
      sid: .alert.signature_id
    }
' ~/lab01-output/eve.json
```

<div class="lab-evidence">
<strong>Контрольная точка 3</strong>
<p>Покажите alert и объясните, какие поля связывают его именно с вашим лабораторным traffic.</p>
</div>

---

## 9. Интерпретируйте результат

После появления alert ответьте на два вопроса.

### Что эксперимент подтвердил?

Корректная формулировка:

> Suricata получила достаточные данные HTTP-запроса на выбранном observation interface и обнаружила в анализируемом URI признак `ATTACK-LAB`, соответствующий условию SID 1000001.

### Что эксперимент не подтвердил?

Он не доказывает, что:

```text
запрос является реальной атакой;
Web Server имеет уязвимость;
уязвимость была успешно использована;
сервер скомпрометирован;
данные были похищены.
```

Связь с Главой 1:

```text
ALERT ≠ COMPROMISE
```

---

## 10. Что сдаёт студент

Скачайте `lab01-report.md` из starter pack и заполните его.

Минимальный комплект evidence:

1. версия Suricata;
2. подтверждение topology/addresses;
3. небольшой `tcpdump` fragment, показывающий visibility;
4. результат `suricata -T`;
5. результат negative test;
6. JSON-фрагмент positive alert;
7. собственная интерпретация alert.

Не требуется делать десятки скриншотов. Команды и текстовые evidence предпочтительнее.

### Защита работы

Отчёт сам по себе не является достаточным основанием для полной оценки. На защите студент должен **вживую показать один из контрольных шагов**, указать observation interface и ответить на 2–3 коротких вопроса преподавателя по собственному evidence. Вопросы выбираются по фактически выполненной работе, а не из фиксированного списка. Это проверяет понимание эксперимента, а не способность сгенерировать текст отчёта.

---

## 11. Критерии оценки

| Критерий | Баллы |
|---|---:|
| Топология понята и объяснена | 15 |
| Visibility на `lab-client0` доказана | 20 |
| Configuration/rule test выполнен | 10 |
| Negative test выполнен корректно | 15 |
| Positive alert SID 1000001 воспроизведён | 20 |
| Alert интерпретирован без чрезмерных выводов | 10 |
| Короткая защита: topology, evidence, границы вывода | 15 |
| Отчёт и evidence оформлены | 5 |
| **Итого** | **100** |

!!! warning "Критическое условие"
    Если студент не может доказать, что интересующий traffic доступен на observation interface, один показанный alert не считается достаточным объяснением работы NIDS.

---

## 12. Что мы намеренно не делаем в ЛР №1

В этой работе мы **не**:

```text
проектируем сложные signatures;
изучаем path traversal;
считаем TP/FP/FN;
исследуем evasion и normalization;
настраиваем inline blocking;
проводим эксплуатацию уязвимостей;
строим SIEM correlation.
```

Эти темы появятся тогда, когда студент уже понимает базовую механику IDS/IPS.

<div class="next-step">
<strong>После ЛР №1:</strong> переходите к <a href="../../course/02-classification/">Главе 2</a> и разбирайте, почему network, host и wireless systems получают разные виды evidence.
</div>
