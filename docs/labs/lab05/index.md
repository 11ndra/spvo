# Лабораторная работа №5 — Изменяем условие правила

<div class="chapter-lead">
<p>В предыдущих работах правила были готовой частью сценария. Здесь вы меняете одно содержательное условие Suricata rule и проверяете, как это меняет множество запросов, для которых появляется alert. Остальные существенные параметры эксперимента сохраняются.</p>
</div>

[Скачать пакет ЛР №5 v0.1](../../assets/downloads/idps-lab05-bundle-v0.1.zip){ .md-button .md-button--primary }

Стенд тот же: `idps-client 10.13.37.10` обращается к `idps-server 10.13.37.20:8080`. До работы должна быть пройдена Глава 6 о структуре правил.

## Экспериментальная идея

Исходное правило ищет `/LAB5-ALPHA` в `http.uri`. Затем вы меняете только содержательное `content`-условие на `/LAB5-BETA`, повторяете те же два запроса и сравниваете результат.

```mermaid
flowchart LR
    A[Правило ищет /LAB5-ALPHA] --> T1[два одинаковых тестовых URI]
    T1 --> R1[/ALPHA alert\n/BETA no alert]
    R1 --> C[меняем только content]
    C --> B[Правило ищет /LAB5-BETA]
    B --> T2[те же два URI]
    T2 --> R2[/ALPHA no alert\n/BETA alert]
```

`rev` при изменении правила тоже увеличивается, но это метаданные версии и не участвует в match logic. Экспериментальной переменной остаётся `content`.

## Подготовьте сервер и клиент

На `idps-server`:

```bash
cd idps-lab05-bundle-v0.1
sudo bash server/setup-server.sh
sudo bash server/preflight-server.sh
```

Нужен `SERVER PRE-FLIGHT PASSED.`. Preflight включает `suricata -T`, поэтому подтверждает, что текущий `lab05.rules` разбирается движком, но ещё не подтверждает будущий alert.

На `idps-client`:

```bash
cd idps-lab05-bundle-v0.1
bash client/check-client.sh
```

Нужен `CLIENT CHECK PASSED.`. Технический URI `/LAB5-PREFLIGHT` не является частью основного эксперимента.

## Разберите исходное правило

На сервере:

```bash
cat server/lab05.rules
```

Исходная строка:

```suricata
alert http 10.13.37.10 any -> 10.13.37.20 8080 (msg:"LAB5 URI condition matched"; flow:established,to_server; http.uri; content:"/LAB5-ALPHA"; sid:1000005; rev:1;)
```

В отчёте разложите её по смысловым частям:

| Часть | Значение | Роль |
|---|---|---|
| action | `alert` | действие при совпадении |
| header | `http 10.13.37.10 any -> 10.13.37.20 8080` | область применения |
| flow | `established,to_server` | контекст потока |
| sticky buffer | `http.uri` | представление, которое проверяется |
| condition | `content:"/LAB5-ALPHA"` | содержательное условие |
| metadata | `sid:1000005; rev:1` | идентичность и версия |

До отправки трафика прогноз очевиден из текущего условия: `/LAB5-ALPHA` должен быть positive test, `/LAB5-BETA` — negative test.

## Серия «до изменения»

На `idps-server` в отдельном терминале:

```bash
sudo bash server/run-suricata.sh before
```

Скрипт определяет учебный интерфейс, проверяет правило через `suricata -T`, создаёт чистый `/var/tmp/idps-lab/lab05-before/` и запускает Suricata с отдельным EVE output. Оставьте процесс работающим.

На клиенте сначала отправьте negative test:

```bash
bash client/request.sh /LAB5-BETA
```

HTTP-ответ с `path=/LAB5-BETA` независимо подтверждает, что запрос дошёл до приложения. Alert SID `1000005` для него сейчас не ожидается.

Затем positive test:

```bash
bash client/request.sh /LAB5-ALPHA
```

После ответа `path=/LAB5-ALPHA` остановите Suricata одним `Ctrl+C` и посмотрите текущую серию:

```bash
bash server/show-alerts.sh before
```

Ожидается:

```text
LABEL=before
SID1000005_ALERTS=1
```

То есть оба HTTP-запроса существовали, но rule match произошёл только для URI, совпадающего с текущим `content`.

## Измените одно содержательное условие

На сервере откройте:

```bash
nano server/lab05.rules
```

Замените:

```suricata
content:"/LAB5-ALPHA";
```

на:

```suricata
content:"/LAB5-BETA";
```

и увеличьте `rev:1` до `rev:2`.

Не меняйте action, protocol/header, IP-адреса, порты, direction, `flow`, `http.uri` и SID. Так мы сохраняем эксперимент контролируемым: содержательно меняется только условие, которое определяет match.

Проверьте новую редакцию до трафика:

```bash
sudo suricata -T \
  -c /etc/suricata/suricata.yaml \
  -S server/lab05.rules
```

Успех означает только синтаксическую и конфигурационную пригодность правила. Он ещё не доказывает правильность ожидаемого поведения.

## Серия «после изменения»

Запустите независимую вторую серию:

```bash
sudo bash server/run-suricata.sh after
```

Теперь EVE пишется в `/var/tmp/idps-lab/lab05-after/eve.json`, поэтому старые alerts не могут смешаться с новыми.

На клиенте повторите **те же два URI**. Сначала:

```bash
bash client/request.sh /LAB5-ALPHA
```

Теперь это negative test. Затем:

```bash
bash client/request.sh /LAB5-BETA
```

Теперь это positive test.

Остановите Suricata одним `Ctrl+C` и выполните:

```bash
bash server/show-alerts.sh after
```

Ожидается:

```text
LABEL=after
SID1000005_ALERTS=1
```

## Сравнение до и после

| Редакция правила | `/LAB5-ALPHA` | `/LAB5-BETA` |
|---|---|---|
| `content:"/LAB5-ALPHA"`, `rev:1` | alert | no alert |
| `content:"/LAB5-BETA"`, `rev:2` | no alert | alert |

Причинная логика эксперимента:

```text
тот же стенд
+ та же точка наблюдения
+ тот же header
+ тот же flow
+ тот же http.uri
+ тот же SID
+ те же два тестовых запроса
+ изменено content-условие
        ↓
изменился запрос, удовлетворяющий правилу
```

Это и есть результат работы. Alert не доказывает реальную атаку, а отсутствие alert не отменяет HTTP-запрос, существование которого независимо подтверждается ответом приложения.

## Что сдаётся

Используйте `report/lab05-report.md`.

| Evidence | Что должно быть видно |
|---|---|
| исходное правило | `content:/LAB5-ALPHA`, `rev:1` |
| два HTTP-ответа серии before | оба запроса действительно дошли до приложения |
| alert серии before | SID `1000005` относится к `/LAB5-ALPHA` |
| изменённое правило + `suricata -T` | новая редакция принята движком |
| два HTTP-ответа серии after | те же два запроса повторены |
| alert серии after | SID `1000005` относится к `/LAB5-BETA` |
| итоговый вывод | связь между изменением condition и изменением rule match |

## Если результат не совпадает с прогнозом

Не начинайте с переписывания правила. Сначала проверьте, что HTTP-сервис отвечает и оба запроса реально дошли до приложения, затем — какой текст `lab05.rules` сейчас сохранён, проходит ли `suricata -T`, какой label (`before`/`after`) используется и какой `eve.json` вы читаете. Только после этого анализируйте semantics `content`.
