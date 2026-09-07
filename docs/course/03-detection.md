# 3. Как сетевое событие превращается в alert

Упрощённая цепочка Suricata:

```text
Network packet
      ↓
Capture
      ↓
Flow / stream tracking
      ↓
Protocol parser
      ↓
Detection rule
      ↓
Match
      ↓
Alert
      ↓
eve.json
```

## Пример сигнатуры

```text
alert http any any -> $HOME_NET 80 (
    msg:"LAB Test HTTP Detection";
    flow:established,to_server;
    http.uri;
    content:"/lab-test";
    sid:1000001;
    rev:1;
)
```

Современный NIDS анализирует не только отдельные байты, но и направление потока, состояние TCP, протокол, HTTP-поля и контекст сессии.

!!! important
    **Signature match ≠ confirmed incident.**
