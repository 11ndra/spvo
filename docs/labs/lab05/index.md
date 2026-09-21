# Лабораторная работа №5

## Изменяем условие правила и доказываем результат

<div class="lab-header">
<strong>Цель:</strong> экспериментально показать, как изменение одного содержательного условия Suricata rule меняет множество наблюдений, на которых правило совпадает, и подтвердить результат через EVE JSON и независимый HTTP-ответ приложения.
</div>

<div class="chapter-lead">
<p>В этой работе вы уже не используете правило как готовую «магическую строку». Вы сначала фиксируете его исходную логику, затем меняете <strong>одно содержательное условие</strong>, проверяете синтаксис, повторяете positive/negative tests и сравниваете результаты.</p>
</div>

## Что необходимо до начала работы

Должны быть выполнены:

```text
Глава 1;
Шаг 00 — подготовка двух VM;
Практикум 0;
Главы 2–5;
ЛР №1–4;
Глава 6 — правила и их структура.
```

Стенд остаётся прежним:

```text
idps-client  10.13.37.10
      |
      | IDPS-LAB
      v
idps-server  10.13.37.20:8080
```

Скачайте пакет:

[**idps-lab05-bundle-v0.1.zip**](../../assets/downloads/idps-lab05-bundle-v0.1.zip){ .md-button .md-button--primary }

Распакуйте пакет на обе VM или перенесите `client/` на клиент, а `server/` и `report/` — на сервер.

---

## 1. Экспериментальный контракт

Перед командами зафиксируйте, что именно проверяет работа.

<div class="idps-rule-model">
  <article><span>ЧТО УЖЕ ИЗВЕСТНО</span><strong>Правило состоит из разных смысловых частей</strong><p>Action, область применения, контекст, представление, условие и метаданные не должны смешиваться.</p></article>
  <article><span>ЭКСПЕРИМЕНТАЛЬНЫЙ ФАКТ</span><strong>Один HTTP URI меняет результат rule match</strong><p>Проверяем не «опасность» запроса, а совпадение конкретного условия.</p></article>
  <article><span>ИЗМЕНЯЕМАЯ ПЕРЕМЕННАЯ</span><strong><code>content</code> в <code>http.uri</code></strong><p><code>/LAB5-ALPHA</code> заменяется на <code>/LAB5-BETA</code>. Остальная логика стенда остаётся прежней.</p></article>
  <article><span>ДОКАЗАТЕЛЬСТВА</span><strong>HTTP response + EVE JSON</strong><p>Приложение подтверждает существование запроса; EVE подтверждает результат конкретного правила.</p></article>
</div>

Допустимый итоговый вывод:

> после изменения `content`-условия запрос, совпадающий с правилом, изменился предсказуемым образом.

Нельзя заключать:

```text
alert → реальная атака;
нет alert → запроса не было;
совпадение учебного маркера → компрометация.
```

---

## 2. Подготовьте сервер

На `idps-server`:

```bash
cd idps-lab05-bundle-v0.1
sudo bash server/setup-server.sh
sudo bash server/preflight-server.sh
```

Ожидаемый итог:

```text
[ OK ] lab web service is available on 10.13.37.20:8080
...
SERVER PRE-FLIGHT PASSED.
```

`preflight-server.sh` отдельно выполняет `suricata -T` с текущим `lab05.rules`. Это подтверждает, что конфигурация и правило разбираются движком. Оно **не подтверждает**, что нужный трафик будет виден и что alert появится.

---

## 3. Проверьте клиент

На `idps-client`:

```bash
cd idps-lab05-bundle-v0.1
bash client/check-client.sh
```

Ожидается:

```text
CLIENT CHECK PASSED.
```

Проверочный запрос `/LAB5-PREFLIGHT` не является частью основного эксперимента: каждая серия ниже получает собственный каталог EVE-вывода.

---

## 4. Разберите исходное правило до запуска

На сервере:

```bash
cat server/lab05.rules
```

Исходный вариант:

```suricata
alert http 10.13.37.10 any -> 10.13.37.20 8080 (msg:"LAB5 URI condition matched"; flow:established,to_server; http.uri; content:"/LAB5-ALPHA"; sid:1000005; rev:1;)
```

Заполните таблицу в отчёте:

| Часть | Значение | Роль |
|---|---|---|
| action | `alert` | результат при совпадении |
| header | `http 10.13.37.10 any -> 10.13.37.20 8080` | область применения |
| flow | `established,to_server` | контекст потока |
| sticky buffer | `http.uri` | представление данных |
| condition | `content:"/LAB5-ALPHA"` | проверяемый признак |
| metadata | `sid:1000005; rev:1` | идентичность и версия |

<div class="lab-evidence">
<strong>Контрольная точка 1</strong>
<p>До отправки трафика вы должны уметь предсказать: <code>/LAB5-ALPHA</code> — positive test, <code>/LAB5-BETA</code> — negative test.</p>
</div>

---

# Серия A. До изменения правила

## 5. Запустите Suricata с исходным условием

На `idps-server`, Терминал 1:

```bash
sudo bash server/run-suricata.sh before
```

Скрипт сам:

```text
определяет интерфейс с 10.13.37.20/24;
проверяет правило через suricata -T;
останавливает системный Suricata service, если он захватывает тот же интерфейс;
очищает только каталог /var/tmp/idps-lab/lab05-before;
запускает Suricata на учебном интерфейсе;
пишет новый EVE output в отдельный каталог.
```

Оставьте процесс запущенным.

---

## 6. Выполните отрицательный тест

На `idps-client`:

```bash
bash client/request.sh /LAB5-BETA
```

Вы должны получить ответ, содержащий:

```text
path=/LAB5-BETA
```

Это независимое подтверждение того, что приложение получило запрос.

Пока правило всё ещё содержит:

```suricata
content:"/LAB5-ALPHA";
```

поэтому для `/LAB5-BETA` ожидается отсутствие alert `SID 1000005`.

---

## 7. Выполните положительный тест

На клиенте:

```bash
bash client/request.sh /LAB5-ALPHA
```

HTTP-ответ должен содержать:

```text
path=/LAB5-ALPHA
```

После этого в Терминале 1 на сервере нажмите `Ctrl+C` и просмотрите alert:

```bash
bash server/show-alerts.sh before
```

Ожидается:

```text
LABEL=before
SID1000005_ALERTS=1
```

и JSON-фрагмент с:

```text
src_ip    = 10.13.37.10
dest_ip   = 10.13.37.20
dest_port = 8080
sid       = 1000005
```

<div class="lab-evidence">
<strong>Контрольная точка 2</strong>
<p>Сохраните HTTP-ответы обоих запросов и JSON-фрагмент alert. Первый набор доказывает существование обоих запросов, второй — совпадение правила только на ожидаемом positive test.</p>
</div>

---

# Серия B. Изменение одного содержательного условия

## 8. Измените условие

Откройте на сервере:

```bash
nano server/lab05.rules
```

Измените:

```suricata
content:"/LAB5-ALPHA";
```

на:

```suricata
content:"/LAB5-BETA";
```

Также увеличьте:

```suricata
rev:1;
```

до:

```suricata
rev:2;
```

Почему `rev` не считается второй экспериментальной переменной? Потому что оно не участвует в логике совпадения. Это метаданные версии правила. **Содержательно изменяется только `content`-условие.**

Не меняйте:

```text
action;
протокол;
IP-адреса;
порты;
направление;
flow;
http.uri;
sid.
```

---

## 9. Проверьте изменённое правило до эксперимента

На сервере:

```bash
sudo suricata -T \
  -c /etc/suricata/suricata.yaml \
  -S server/lab05.rules
```

Успех означает только:

```text
правило синтаксически принято движком в этой конфигурации.
```

Он не означает:

```text
положительный тест уже выполнен;
alert уже существует;
новая логика верна относительно вашей цели.
```

<div class="lab-evidence">
<strong>Контрольная точка 3</strong>
<p>Сохраните успешный результат <code>suricata -T</code> и итоговый текст правила.</p>
</div>

---

# Серия C. После изменения правила

## 10. Запустите вторую независимую серию

На `idps-server`, Терминал 1:

```bash
sudo bash server/run-suricata.sh after
```

Теперь output создаётся отдельно:

```text
/var/tmp/idps-lab/lab05-after/eve.json
```

Это не позволяет смешать alert до и после изменения.

---

## 11. Повторите те же два запроса, но с обратным ожиданием

Сначала прежний positive test:

```bash
bash client/request.sh /LAB5-ALPHA
```

Теперь он должен стать **negative test**, потому что правило больше не ищет `/LAB5-ALPHA`.

Затем:

```bash
bash client/request.sh /LAB5-BETA
```

Теперь это **positive test**.

После обоих запросов остановите Suricata через `Ctrl+C` и выполните:

```bash
bash server/show-alerts.sh after
```

Ожидается:

```text
LABEL=after
SID1000005_ALERTS=1
```

Alert должен относиться ко второй серии и новой редакции правила.

---

## 12. Сравните до и после

У вас должно получиться:

<div class="idps-test-matrix">
  <article class="idps-test-matrix__positive"><span>ДО ИЗМЕНЕНИЯ</span><strong><code>/LAB5-ALPHA</code> → alert</strong><p><code>/LAB5-BETA</code> → no alert</p><small>Условие: content <code>/LAB5-ALPHA</code>.</small></article>
  <article class="idps-test-matrix__negative"><span>ПОСЛЕ ИЗМЕНЕНИЯ</span><strong><code>/LAB5-BETA</code> → alert</strong><p><code>/LAB5-ALPHA</code> → no alert</p><small>Условие: content <code>/LAB5-BETA</code>.</small></article>
</div>

Главное — не сам факт «alert появился», а причинная связь:

```text
одинаковый стенд
+ та же точка наблюдения
+ тот же header
+ тот же flow
+ тот же http.uri
+ тот же SID
+ изменено только содержательное content-условие
→ изменился запрос, удовлетворяющий логике правила
```

---

## 13. Что именно доказал эксперимент

<div class="evidence-boundary">
  <article class="evidence-supported"><span>ОБОСНОВАННО</span><strong>Изменение detection condition изменило rule match</strong><p>Positive/negative tests до и после изменения соответствуют ожидаемой логике, а EVE фиксирует alert с нужным SID.</p></article>
  <article class="evidence-not-proven"><span>НЕ ДОКАЗАНО</span><strong>Атака, компрометация или качество правила в реальной среде</strong><p>Учебные URI являются синтетическими маркерами, а эксперимент проверяет только конкретную rule semantics.</p></article>
</div>

Отдельно сформулируйте:

```text
HTTP response подтверждает запрос;
EVE alert подтверждает совпадение конкретного правила;
отсутствие alert не отменяет подтверждённый HTTP request.
```

---

## 14. Что сдаётся

Используйте `report/lab05-report.md`.

Минимальный набор артефактов:

1. исходное правило;
2. таблица разбора его частей;
3. HTTP-ответы `/LAB5-ALPHA` и `/LAB5-BETA` до изменения;
4. alert `SID 1000005` из `lab05-before/eve.json`;
5. изменённое правило и результат `suricata -T`;
6. HTTP-ответы тех же двух запросов после изменения;
7. alert `SID 1000005` из `lab05-after/eve.json`;
8. краткий вывод о причинной связи и границах доказательства.

---

## Если что-то не работает

Проверяйте в этом порядке:

```text
1. адреса 10.13.37.10 и 10.13.37.20;
2. HTTP service :8080;
3. server/preflight-server.sh;
4. текст текущего lab05.rules;
5. suricata -T;
6. правильный label before/after;
7. наличие eve.json;
8. HTTP response конкретного запроса;
9. только после этого — почему условие совпало или не совпало.
```

Если запрос подтверждён приложением, но alert отсутствует, это **не проблема связности по определению**. Нужно отдельно проверить текущую редакцию правила, точку наблюдения, EVE output и семантику условия.
