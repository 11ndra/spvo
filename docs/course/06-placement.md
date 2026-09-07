# Где размещаются сенсоры

<div class="page-goal"><strong>Цель:</strong> понять, что место установки сенсора определяет его область видимости.</div>

## Пассивный NIDS

```text
Internet ── Firewall ── DMZ
              │
            SPAN/TAP
              │
             NIDS
```

Сенсор получает копию трафика. Сбой сенсора обычно не останавливает сеть, но сам сенсор не находится в позиции enforcement.

## Inline IPS

```text
Internet → IPS → Firewall / DMZ / Application
```

IPS может применять `drop`/`reject`, но ошибка конфигурации или False Positive может повлиять на доступность.

## North-South и East-West

Сенсор только на интернет-периметре не обязательно видит трафик между внутренними системами. Sensor placement должен определяться threat model и необходимой visibility.
