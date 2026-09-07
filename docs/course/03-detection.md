# Как работает обнаружение

<div class="page-goal"><strong>Цель:</strong> проследить путь от сетевого пакета до события безопасности.</div>

```text
Network packet
      ↓
Packet capture
      ↓
Flow / Stream tracking
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

Пример:

```text
alert http any any -> $HOME_NET 80 (msg:"LAB Test HTTP Detection"; flow:established,to_server; http.uri; content:"/lab-test"; sid:1000001; rev:1;)
```

`alert` — действие; `http` — протокол; `$HOME_NET` — защищаемая сеть; `http.uri` — HTTP URI buffer; `content` — искомое содержимое; `sid` — идентификатор; `rev` — версия.

!!! warning
    Правильный язык: «зарегистрировано событие, соответствующее условиям сигнатуры». Неправильный язык: «IDS доказала взлом».
