# Лабораторная работа №1

## Первый NIDS: видимость → оповещение → интерпретация

<div class="lab-header">
  <div><strong>Уровень:</strong> вводный</div>
  <div><strong>Инструменты:</strong> Suricata, tcpdump, curl, jq</div>
  <div><strong>Среда:</strong> Ubuntu Desktop 24.04 + Ubuntu Server 24.04</div>
</div>

<div class="chapter-lead">
<p>Цель работы — экспериментально доказать минимальную цепочку: <strong>сетевой запрос существует → трафик виден на выбранном интерфейсе → Suricata получает данные → правило срабатывает → оповещение корректно интерпретируется</strong>.</p>
</div>

## Что необходимо до начала работы

До ЛР №1 должна быть завершена [подготовка лабораторной среды](../environment/). Основной вариант курса — студент самостоятельно создаёт две VM, настраивает учебную сеть и проходит проверки готовности. Если преподаватель выдал готовые образы, требования остаются теми же.

```text
idps-client   Ubuntu Desktop 24.04.x   10.13.37.10/24
idps-server   Ubuntu Server 24.04.x    10.13.37.20/24
```

Перед началом работы убедитесь, что предыдущие проверки завершились строками:

```text
CLIENT ENVIRONMENT READY
SERVER ENVIRONMENT READY
```

!!! important
    ЛР №1 не предназначена для исправления базовой конфигурации VirtualBox или установки Suricata. Если среда не получила статус `READY`, вернитесь к странице подготовки и устраните причину.

[Скачать пакет ЛР №1 v0.4](../../assets/downloads/idps-lab01-bundle-v0.4.zip){ .md-button }

---

## 1. Подготовьте учебный сервер

На `idps-server` распакуйте пакет и перейдите в его каталог:

```bash
cd ~
unzip idps-lab01-bundle-v0.4.zip
cd idps-lab01-bundle-v0.4
```

Запустите подготовку web-сервиса:

```bash
sudo bash server/setup-server.sh
```

Ожидаемый финал:

```text
[ OK ] lab web service is available on 0.0.0.0:8080
```

Затем выполните серверную предварительную проверку:

```bash
sudo bash server/preflight-server.sh
```

Продолжайте только при:

```text
SERVER PRE-FLIGHT PASSED.
```

---

## 2. Проверьте клиент

На `idps-client` распакуйте тот же пакет:

```bash
cd ~
unzip idps-lab01-bundle-v0.4.zip
cd idps-lab01-bundle-v0.4
bash client/check-client.sh
```

Продолжайте только при:

```text
CLIENT CHECK PASSED.
```

Эта проверка подтверждает, что клиент имеет адрес `10.13.37.10`, видит `10.13.37.20` и может обратиться к web-сервису по TCP/8080.

---

## 3. Определите интерфейс наблюдения

На `idps-server` выполните:

```bash
ip -br addr
```

Найдите интерфейс, которому назначен адрес `10.13.37.20/24`.

Сохраните его имя в переменную в том терминале, где будете запускать `tcpdump` или Suricata. В новом терминале эту команду нужно выполнить повторно:

```bash
LAB_IFACE=$(ip -o -4 addr show | awk '$4 ~ /^10\.13\.37\.20\// {print $2; exit}')
echo "$LAB_IFACE"
```

Если команда не выводит имя интерфейса — не продолжайте работу.

<div class="lab-evidence">
<strong>Контрольная точка 1</strong>
<p>Зафиксируйте имя интерфейса с адресом <code>10.13.37.20</code> и объясните, почему именно на нём ожидается входящий трафик от <code>idps-client</code>.</p>
</div>

---

## 4. Докажите видимость до запуска IDS

На `idps-server`, Терминал 1:

```bash
sudo tcpdump -nn -i "$LAB_IFACE" 'host 10.13.37.10 and tcp port 8080'
```

На `idps-client`:

```bash
curl -sS http://10.13.37.20:8080/normal
```

В `tcpdump` должны появиться пакеты между `10.13.37.10` и `10.13.37.20:8080`.

Остановите `tcpdump` через `Ctrl+C`.

<div class="lab-evidence">
<strong>Контрольная точка 2</strong>
<p>Сохраните несколько строк <code>tcpdump</code>. Пока доказана только видимость сетевого взаимодействия, а не работа детектора.</p>
</div>

---

## 5. Проверьте готовое правило

На `idps-server`:

```bash
sudo suricata -T \
  -c /etc/suricata/suricata.yaml \
  -S server/lab01.rules
```

Правило ищет учебный маркер `ATTACK-LAB` в URI HTTP-запроса и формирует SID `1000001`.

Успешный `-T` означает только, что Suricata смогла разобрать конфигурацию и правило.

---

## 6. Запустите Suricata

На `idps-server`, Терминал 1:

```bash
sudo systemctl is-active --quiet suricata && sudo systemctl stop suricata || true
mkdir -p "$HOME/lab01-output"
rm -f "$HOME/lab01-output"/*

sudo suricata \
  -k none \
  -c /etc/suricata/suricata.yaml \
  -S "$HOME/idps-lab01-bundle-v0.4/server/lab01.rules" \
  -i "$LAB_IFACE" \
  -l "$HOME/lab01-output"
```

Оставьте процесс запущенным.

На `idps-server`, Терминал 2:

```bash
ls -l "$HOME/lab01-output/eve.json"
```

Если файла нет, сначала прочитайте ошибку Suricata в Терминале 1.

---

## 7. Отрицательный тест

На `idps-client`:

```bash
curl -sS http://10.13.37.20:8080/normal
```

На `idps-server`, Терминал 2:

```bash
jq 'select(.event_type=="alert" and .alert.signature_id==1000001)' \
  "$HOME/lab01-output/eve.json"
```

Ожидаемый результат — отсутствие вывода.

Это означает только, что SID `1000001` не сработал на данном запросе.

---

## 8. Положительный тест

На `idps-client`:

```bash
curl -sS 'http://10.13.37.20:8080/ATTACK-LAB'
```

На `idps-server`:

```bash
jq '
  select(.event_type=="alert" and .alert.signature_id==1000001)
  | {
      timestamp,
      src_ip,
      src_port,
      dest_ip,
      dest_port,
      signature: .alert.signature,
      sid: .alert.signature_id
    }
' "$HOME/lab01-output/eve.json"
```

Ожидается:

```text
src_ip    = 10.13.37.10
dest_ip   = 10.13.37.20
dest_port = 8080
sid       = 1000001
```

<div class="lab-evidence">
<strong>Контрольная точка 3</strong>
<p>Сохраните JSON-фрагмент и укажите, какие поля связывают оповещение с вашим запросом.</p>
</div>

---

## 9. Интерпретируйте результат

Эксперимент подтверждает, что Suricata получила достаточные данные сетевого запроса на выбранном интерфейсе и условие SID `1000001` выполнилось.

Эксперимент **не подтверждает**, что web-сервис уязвим, что произошла эксплуатация уязвимости или что сервер был скомпрометирован.

```text
ОПОВЕЩЕНИЕ ≠ КОМПРОМЕТАЦИЯ
```

---

## 10. Что сдаётся

Используйте шаблон `report/lab01-report.md` из пакета. На защите студент должен:

1. показать IP обеих VM и интерфейс наблюдения;
2. воспроизвести один HTTP-запрос;
3. показать сетевое подтверждение в `tcpdump`;
4. показать SID `1000001` в `eve.json`;
5. своими словами объяснить, что оповещение доказывает и чего не доказывает.

## Если что-то не работает

Проверяйте строго по порядку:

```text
1. IP клиента и сервера
2. связность между VM
3. web-сервис :8080
4. tcpdump на LAB_IFACE
5. suricata -T
6. наличие eve.json
7. только затем — условие правила
```
