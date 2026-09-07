# Что такое IDS и IPS

<div class="page-goal"><strong>Цель раздела:</strong> понять, зачем IDS/IPS нужны в сети и почему межсетевой экран не решает все задачи обнаружения атак.</div>

## 1. Проблема

Организация публикует веб-сервис:

```text
Internet → Firewall → Web Server
              TCP/443
```

Порт `443/tcp` разрешён, потому что сервис должен быть доступен пользователям. Однако разрешённое соединение ещё не означает безопасное соединение.

## 2. IDS

**Intrusion Detection System (IDS)** — система обнаружения вторжений.

```text
Traffic → IDS → normal: observe / suspicious: alert
```

!!! important
    Alert не означает автоматически, что атака была успешной.

## 3. IPS

**Intrusion Prevention System (IPS)** — система предотвращения вторжений.

```text
Traffic → IPS → allowed: forward / prohibited: drop or reject
```

Чтобы предотвращать передачу, IPS должна располагаться в позиции, где способна влиять на прохождение трафика.

## 4. Detection и Prevention

| Свойство | IDS | IPS |
|---|:---:|:---:|
| Анализирует события | ✓ | ✓ |
| Формирует alert | ✓ | ✓ |
| Обязательно находится inline | Нет | Обычно да |
| Может блокировать трафик | Обычно нет | Да |
| Ошибка правила может нарушить доступность | Низкий риск | Высокий риск |

## Самопроверка

<div class="quiz" data-question-id="intro-1"><p><strong>Suricata работает как пассивная IDS и сформировала alert. Что можно утверждать наверняка?</strong></p><button>A. Атака успешно заблокирована</button><button data-correct="true">B. Наблюдаемое событие совпало с условием детектирования</button><button>C. Сервер скомпрометирован</button><button>D. Источник автоматически заблокирован firewall</button><div class="quiz-feedback"></div></div>
