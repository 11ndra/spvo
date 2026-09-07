# Firewall и IDPS

<div class="page-goal"><strong>Цель:</strong> понять, какие задачи решает контроль доступа, а какие — обнаружение и предотвращение вторжений.</div>

## Firewall

```text
Source + Destination + Protocol + Port + State + Policy → Allow / Deny
```

Пример: `Internet → Web → TCP/443 → ALLOW`, `Internet → Web → TCP/22 → DENY`.

## IDPS

IDPS дополнительно анализирует protocol semantics, content/metadata, flow state, signatures и behavior.

Современный NGFW часто включает IPS-функциональность, поэтому это не обязательно два разных физических устройства.

!!! info
    Правильный архитектурный вопрос: какие механизмы контроля доступа и обнаружения реализованы и где находятся точки enforcement?
