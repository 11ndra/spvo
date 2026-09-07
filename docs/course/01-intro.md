# 1. Что такое IDS и IPS

## Почему одного межсетевого экрана недостаточно

Межсетевой экран прежде всего принимает решение, разрешён ли сетевой обмен согласно политике доступа.

Например:

```text
Internet → TCP/443 → Web Server
```

Порт `443/tcp` может быть разрешён, потому что веб-сервис должен быть доступен пользователям.

Однако внутри разрешённого соединения может находиться подозрительный запрос.

```text
Разрешённый TCP/443
        ↓
HTTP request
        ↓
потенциально вредоносное действие
```

## IDS

**Intrusion Detection System** — система обнаружения вторжений.

```text
Traffic
   ↓
  IDS
   ├── normal → observe
   └── suspicious → alert
```

## IPS

**Intrusion Prevention System** — система предотвращения вторжений.

```text
Traffic
   ↓
  IPS
   ├── allowed → forward
   └── prohibited → block/reject
```

!!! warning "Важно"
    Наличие alert означает совпадение наблюдаемого события с логикой обнаружения. Alert сам по себе не доказывает успешную атаку или компрометацию.

## Мини-тест

<div class="quiz" data-question-id="intro-1">
  <p><strong>Suricata работает как пассивная IDS и сформировала alert. Что можно утверждать наверняка?</strong></p>
  <button data-choice="a">A. Атака была успешно заблокирована</button>
  <button data-choice="b" data-correct="true">B. Наблюдаемое событие совпало с условием детектирования</button>
  <button data-choice="c">C. Сервер был скомпрометирован</button>
  <button data-choice="d">D. Источник автоматически занесён в firewall blacklist</button>
  <div class="quiz-feedback"></div>
</div>
