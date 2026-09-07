# 4. Firewall и IDPS

Firewall и IDPS решают пересекающиеся, но не идентичные задачи.

## Упрощённая модель firewall

```text
Source
Destination
Protocol
Port
State
Policy
      ↓
Allow / Deny
```

## Упрощённая модель NIDS/NIPS

```text
Network traffic
      ↓
Protocol semantics
Content / metadata
Flow state
Signatures / behavior
      ↓
Detect / Alert / Block
```

Современный NGFW может включать IPS-функции, поэтому в реальной инфраструктуре это не обязательно два отдельных физических устройства.
