# Source/Accuracy Audit — v2.16

Дата: **09.09.2026**

## Итог

Аудит не выявил необходимости переписывать концепцию курса с нуля: базовые принципы IDPS, различие network/host visibility, методы detection, base-rate problem, passive/inline architecture и используемые Suricata keywords имеют authoritative support. Однако обнаружено несколько мест, где исходная формулировка была сильнее источника или смешивала официальный факт с нашей инженерной интерпретацией.

Критичные корректировки выполнены в v2.16.1-source-audit:

1. NDR/NTA больше не выдаются за строгую современную стандартизованную taxonomy; NIST NBA помечена как историческая классификация.
2. NGFW diagram больше не выглядит как универсальный фиксированный packet-processing order.
3. Target 2013 переписан с учётом природы Senate staff report и противоречивой/неполной публичной forensic picture.
4. Все голые `Best practice` в ключевых кейсах заменены либо прямыми рекомендациями authoritative source, либо `инженерным выводом курса`.
5. Base-rate/threshold section больше не утверждает, что любая правка «строже» автоматически повышает FN; trade-off привязан к decision threshold.
6. TLS 1.3 reference актуализирован до RFC 9846, который в июле 2026 заменил RFC 8446.
7. Detection Engineering workflow и positive/negative/variant regression matrix явно помечены как методика курса, вдохновлённая OISF suricata-verify, а не как обязательный официальный workflow OISF.
8. Thresholding уточнён: это механизм ограничения alert frequency, а не исправление detection logic; prevention actions требуют отдельной интерпретации.
9. ЛР №1 стала offline-first: PPA installation — optional path для чистой Ubuntu, а не обязательное действие каждого студента.
10. ЛР №1 и ЛР №2 получили честный QA status: source/docs verified, но конкретные runtime paths ещё требуют прогона на чистой Ubuntu 24.04 + Suricata 8.0.6.
11. Lab Pack 02 явно маркирован как synthetic corpus; ожидаемая Rule A/B/C matrix до runtime test не выдаётся за заранее подтверждённый engine output.

## Решение о дальнейшей разработке

Новые главы можно продолжать только по такой же схеме: до публикации главы формируется source map; real cases используют primary/near-primary material; слова `best practice` применяются только при наличии authoritative support; synthetic examples маркируются; executable labs имеют отдельный `docs verified` и `runtime verified` статус.

## Открытые пункты после source audit

Source/accuracy corrective pass не закрывает два эксплуатационных вопроса. Во-первых, LabBox v0.1 и Lab Pack 02 требуют отдельного runtime QA на целевой Ubuntu 24.04 + Suricata 8.0.6. Во-вторых, ЛР №1 пока остаётся преимущественно Live-лабораторией; в рамках принятой multi-mode архитектуры курса для неё ещё нужно спроектировать полноценный low-spec/offline fallback, не обесценивающий learning outcome. Эти пункты намеренно не скрыты и не помечены как завершённые.
