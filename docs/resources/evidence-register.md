# Реестр источников и проверок

Дата полного source/accuracy audit: **09.09.2026**  
Аудируемая база: **v2.16**  
Результат corrective pass: **v2.16.1-source-audit**

Этот реестр нужен для трассировки ключевых технических утверждений курса. Он не заменяет библиографию: его задача — показать, **какого типа утверждение используется, чем оно подтверждается и какие ограничения остаются**.

## Как читать статусы

| Статус | Значение |
|---|---|
| VERIFIED | утверждение подтверждено подходящим authoritative source |
| VERIFIED / HISTORICAL | источник авторитетный, но используется как исторический/фундаментальный, а не как современная продуктовая классификация |
| NEEDS QUALIFICATION | исходная формулировка была слишком широкой; в v2.16.1 уточнена |
| ENGINEERING | вывод курса, основанный на нескольких источниках/ограничениях; не выдаётся за стандарт |
| SYNTHETIC | созданный для курса пример, topology, PCAP или scenario; не реальный incident |
| RUNTIME QA REQUIRED | документация/структура подтверждены, но конкретный lab path ещё нужно прогнать на целевой runtime |
| OUTDATED | источник/формулировка больше не должны использоваться как актуальные |
| UNSUPPORTED | достаточного основания не найдено; утверждение должно быть удалено или переписано |

## Иерархия источников

Для технических фактов приоритет: **standard/RFC/NIST/CISA → official project/vendor documentation → primary/near-primary incident material → peer-reviewed/foundational research → secondary analysis**. Вторичные статьи могут использоваться для поиска кейса, но не должны становиться единственным основанием сильного утверждения о причине инцидента.

NIST SP 800-94 требует отдельной оговорки: это финальная публикация **2007 года**. NIST прямо указывает, что draft Rev.1 2012 года был отозван, поскольку комментарии к нему больше не соответствовали актуальным технологиям и threat models. Поэтому SP 800-94 используется в курсе как фундаментальный источник по принципам IDPS, а не как актуальная рыночная taxonomy.

## Реестр ключевых утверждений

| ID | Раздел | Утверждение / материал | Тип | Статус | Основание и действие после аудита |
|---|---|---|---|---|---|
| C1-01 | Гл.1 | IDS/IPS анализирует активность, которую firewall policy может разрешать | STANDARD/ENGINEERING | VERIFIED | NIST SP 800-94 + NIST SP 800-41; оставлено как разделение логических функций |
| C1-02 | Гл.1 | Alert не является доказательством компрометации | ENGINEERING | VERIFIED | IDPS сообщает о возможном incident; интерпретация требует context/evidence. Формулировка сохранена без превращения в абсолют о конкретном продукте |
| C1-03 | Гл.1 | Log4Shell активно сканировался/эксплуатировался; нужны patch/mitigation и hunt | CASE | VERIFIED | CISA/FBI/NSA AA21-356A; «best practice» заменено прямой ссылкой на рекомендации advisory |
| C2-01 | Гл.2 | NIDS и host telemetry дают разный контекст | STANDARD | VERIFIED | NIST SP 800-94 различает network-based и host-based IDPS |
| C2-02 | Гл.2 | FIM отслеживает изменения важных файлов | OFFICIAL | VERIFIED | Wazuh FIM documentation; событие изменения не объявляется компрометацией |
| C2-03 | Гл.2 | NDR/NTA/NBA — три универсальных современных класса | INDUSTRY TERMS | NEEDS QUALIFICATION | Исправлено: NDR/NTA — отраслевые термины с плавающими границами; NBA есть в исторической taxonomy NIST 800-94 |
| C2-04 | Гл.2 | Zeek подходит для структурированных сетевых событий | OFFICIAL | VERIFIED | Zeek official docs: passive network traffic analyzer / network security monitor, structured logs |
| C2-05 | Гл.2 | HAFNIUM/Exchange оставлял одновременно network и host artifacts | CASE | VERIFIED | Microsoft Security incident analyses; сохранено |
| C3-01 | Гл.3 | capture→decode→flow/stream→protocol→detection→result | ENGINEERING | NEEDS QUALIFICATION | Это учебная абстракция, не universal internal pipeline; добавлена явная оговорка |
| C3-02 | Гл.3 | reassembly/interpretation mismatch способен влиять на NIDS detection | RESEARCH | VERIFIED / HISTORICAL | Ptacek & Newsham, CERIAS; усилена историческая оговорка, не переносим конкретные flaws на современную Suricata |
| C4-01 | Гл.4 | Signature detection хорошо покрывает известные признаки и может пропускать variants/evasion | STANDARD | VERIFIED / HISTORICAL | NIST SP 800-94 2.3.1; фундаментальный принцип |
| C4-02 | Гл.4 | Anomaly detection может выявлять ранее неизвестную активность, но anomaly ≠ attack | STANDARD | VERIFIED / HISTORICAL | NIST SP 800-94 2.3.2; в курсе нет обещания «zero-day guarantee» |
| C4-03 | Гл.4 | Stateful protocol analysis использует ожидаемую protocol behavior/state | STANDARD | VERIFIED / HISTORICAL | NIST SP 800-94 2.3.3 |
| C4-04 | Гл.4 | «Зрелая IDPS обязана сочетать все методы» | ENGINEERING | NEEDS QUALIFICATION | Переписано: система/архитектура *может* сочетать методы; выбор зависит от telemetry/cost/tests |
| C4-05 | Гл.4 | SolarWinds Beacon instances имели уникальные C2/UA/URI/watermark/sleep/jitter | CASE | VERIFIED | Microsoft Solorigate deep dive; кейс сохранён |
| C5-01 | Гл.5 | Firewall policy должна ограничивать ненужный трафик | STANDARD | VERIFIED | NIST SP 800-41 Rev.1: deny by default / permit only necessary traffic |
| C5-02 | Гл.5 | NGFW имеет универсальный фиксированный processing order | INDUSTRY TERM | NEEDS QUALIFICATION | Исправлено: диаграмма — logical decomposition; vendor/version/config определяют реальный order |
| C5-03 | Гл.5 | Target breach однозначно доказал «недостаточную сегментацию» как установленную root cause | CASE | NEEDS QUALIFICATION | Senate staff analysis опирался на публичные сообщения; Target заявлял о существующей segmentation. Кейс переписан как пример вопросов third-party access/segmentation/detection/response, а не definitive forensic conclusion |
| C5-04 | Гл.5 | Third-party access + segmentation + detection нужно рассматривать совместно | STANDARD/ENGINEERING | VERIFIED | NIST SP 800-41 + CISA segmentation/hardening; сформулировано как инженерный вывод |
| C6-01 | Гл.6 | Base-rate способен приводить к большому числу FP даже при низком FPR | RESEARCH | VERIFIED | Stefan Axelsson, ACM TISSEC; добавлена прямая research reference |
| C6-02 | Гл.6 | Любое «ужесточение правила» обязательно повышает FN | ENGINEERING | NEEDS QUALIFICATION | Исправлено: trade-off показан корректно для движения decision threshold; произвольная правка rule не обязана быть монотонной |
| C6-03 | Гл.6 | Log4Shell scan-source IP давали высокий FP; CISA советовала искать successful exploitation | CASE | VERIFIED | CISA AA21-356A, прямое утверждение advisory |
| C6-04 | Гл.6 | Разделять recon/attempt/success и не блокировать по low-confidence indicator | ENGINEERING | VERIFIED AS INFERENCE | Теперь явно названо инженерным расширением CISA guidance, не «best practice» без источника |
| C7-01 | Гл.7 | Passive sensor получает копию трафика; SPAN и TAP — варианты подачи | STANDARD | VERIFIED / HISTORICAL | NIST SP 800-94 network architecture |
| C7-02 | Гл.7 | TAP «всегда лучше» SPAN | ENGINEERING | UNSUPPORTED AS ABSOLUTE | Абсолют не использовался; формулировка уточнена: разные решения, выбор зависит от требований |
| C7-03 | Гл.7 | Inline sensor находится в data path и может prevention/blocking | STANDARD | VERIFIED / HISTORICAL | NIST SP 800-94; сохранено |
| C7-04 | Гл.7 | TLS всегда оставляет один и тот же набор метаданных сетевому сенсору | STANDARD | NEEDS QUALIFICATION | Исправлено: видимость зависит от TLS version/extensions/placement; текущий TLS 1.3 reference — RFC 9846 |
| C7-05 | Гл.7 | RFC 8446 является текущей спецификацией TLS 1.3 | STANDARD | OUTDATED | RFC 9846 (07/2026) obsoletes RFC 8446; курс уже переведён на RFC 9846 |
| C7-06 | Гл.7 | CISA red team обнаружил недостаточный host/network monitoring и недетектированное lateral movement/C2 | CASE | VERIFIED | CISA AA23-059A |
| C7-07 | Гл.7 | Из CISA case следует конкретная placement architecture | ENGINEERING | NEEDS QUALIFICATION | В тексте теперь явно «наш инженерный вывод», а не рекомендация CISA в такой формулировке |
| C8-01 | Гл.8 | `flow:established,to_server` задаёт flow state/direction | OFFICIAL | VERIFIED | Suricata 8 official rule docs |
| C8-02 | Гл.8 | `http.uri` normalized, `http.uri.raw` raw URI | OFFICIAL | VERIFIED | Suricata 8 HTTP keyword docs; добавлена версия проверки |
| C8-03 | Гл.8 | Suricata автоматически выбирает fast_pattern, если explicit не задан | OFFICIAL | VERIFIED | Suricata fast_pattern docs |
| C8-04 | Гл.8 | thresholding исправляет логическую причину FP | OFFICIAL/ENGINEERING | UNSUPPORTED | В курсе утверждалось обратное; раздел уточнён: threshold управляет alert frequency и не исправляет detection condition; prevention actions имеют отдельные нюансы |
| C8-05 | Гл.8 | positive/negative/variant matrix — официальный обязательный workflow OISF | ENGINEERING | NEEDS QUALIFICATION | Добавлено: это методика курса, вдохновлённая reproducible verification model OISF suricata-verify |
| C8-06 | Гл.8 | suricata-verify использует PCAP/rules/test.yaml и checks по output | OFFICIAL | VERIFIED | OISF suricata-verify README |
| C8-07 | Гл.8 | suricata-update по умолчанию получает ET Open и тестирует результирующий ruleset | OFFICIAL | VERIFIED | OISF suricata-update Quickstart |
| C8-08 | Гл.8 | Текущая стабильная Suricata = 8.0.6 | OFFICIAL | VERIFIED | OISF download/release, 07.07.2026; Suricata 7 EOL |
| P1-01 | Pre-Lab | Вопросы проверяют course reasoning, а не внешнюю сертификацию | SYNTHETIC | VERIFIED AS COURSE DESIGN | Не выдаётся за vendor/NIST exam; ссылка на ЛР №1 актуализирована |
| L1-01 | ЛР1 | `suricata --build-info`, `-T`, `-S`, `-i`, `-l`, EVE JSON — реальные интерфейсы/вывод | OFFICIAL | VERIFIED | OISF Suricata 8 docs |
| L1-02 | ЛР1 | Ubuntu stable PPA — поддерживаемый OISF installation path | OFFICIAL | VERIFIED | OISF Quickstart/PPA; сделан optional для offline-first среды |
| L1-03 | ЛР1 | LabBox v0.1 topology на `lab-client0` работает end-to-end именно как описано | SYNTHETIC | RUNTIME QA REQUIRED | shell syntax проверен, но нужен прогон на чистой Ubuntu 24.04 + Suricata 8.0.6 |
| L1-04 | ЛР1 | `/lab-test` и path-traversal examples | SYNTHETIC | SYNTHETIC | Учебные observables; не real incident/exploit |
| L2-01 | ЛР2 | T1–T5 PCAP — реальные incident captures | SYNTHETIC | SYNTHETIC | Явно исправлено: corpus создан для курса; Ethernet/IP/TCP checksums проверены |
| L2-02 | ЛР2 | `suricata -r` offline PCAP mode и `-S` explicit rules | OFFICIAL | VERIFIED | Suricata CLI docs |
| L2-03 | ЛР2 | Rule A/B/C дадут ровно ожидаемую матрицу на Suricata 8.0.6 | SYNTHETIC | RUNTIME QA REQUIRED | До runtime test не выдаём prediction за engine fact; студент должен сверять EVE output |
| L2-04 | ЛР2 | Browser Workbench моделирует реальную Suricata semantics | SYNTHETIC | NEEDS QUALIFICATION | Уже явно обозначен simplified logical simulator; не evidence of engine execution |
| L2-05 | ЛР2 | Multi-mode delivery даёт полностью идентичный practical evidence | ENGINEERING | NEEDS QUALIFICATION | Learning goal общий, но доказательная сила modes различается; Mode C обязан фиксировать limitation |

## Authoritative sources used in this audit

- NIST SP 800-94 — https://csrc.nist.gov/pubs/sp/800/94/final
- NIST SP 800-41 Rev.1 — https://csrc.nist.gov/pubs/sp/800/41/r1/final
- CISA AA21-356A (Log4Shell) — https://www.cisa.gov/news-events/cybersecurity-advisories/aa21-356a
- CISA AA23-059A (Red Team) — https://www.cisa.gov/news-events/cybersecurity-advisories/aa23-059a
- U.S. Senate hearing record on Target — https://www.govinfo.gov/app/details/CHRG-113shrg92594/CHRG-113shrg92594
- Microsoft Solorigate deep dive — https://www.microsoft.com/en-us/security/blog/2021/01/20/deep-dive-into-the-solorigate-second-stage-activation-from-sunburst-to-teardrop-and-raindrop/
- Microsoft HAFNIUM/Exchange analysis — https://www.microsoft.com/en-us/security/blog/2021/03/02/hafnium-targeting-exchange-servers/
- Ptacek & Newsham / CERIAS — https://www.cerias.purdue.edu/apps/reports_and_papers/view/1397
- Stefan Axelsson, Base-Rate Fallacy — https://doi.org/10.1145/357830.357849
- RFC 9846 (TLS 1.3, July 2026) — https://www.rfc-editor.org/rfc/rfc9846.html
- Suricata stable downloads — https://suricata.io/download/
- Suricata 8 documentation — https://docs.suricata.io/en/suricata-8.0.6/
- OISF suricata-verify — https://github.com/OISF/suricata-verify
- OISF suricata-update — https://github.com/OISF/suricata-update
- Wazuh FIM docs — https://documentation.wazuh.com/current/user-manual/capabilities/file-integrity/
- Zeek docs — https://docs.zeek.org/en/current/

## Что аудит НЕ подтверждает

Source audit подтверждает корректность **источников и формулировок**, но не заменяет runtime QA. До отдельного execution pass нельзя утверждать, что LabBox v0.1 и синтетические PCAP ЛР №2 полностью воспроизводят ожидаемый output на каждой поддерживаемой ОС/версии Suricata. Эти пункты намеренно оставлены со статусом `RUNTIME QA REQUIRED`.
