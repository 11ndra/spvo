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
| L1-03 | ЛР1 | Двухмашинный стенд `10.13.37.10 → 10.13.37.20:8080`, Suricata на сетевом интерфейсе сервера и SID 1000001 работают end-to-end как описано | SYNTHETIC | RUNTIME QA REQUIRED | Требуется прогон на эталонных Ubuntu Desktop/Server 24.04, которые будут выданы студентам |
| L1-04 | ЛР1 | `lab01-preflight.sh` проверяет команды, namespaces, HTTP path и `suricata -T` | SYNTHETIC/TOOLING | STATICALLY VERIFIED | Shell syntax проверен; фактический результат зависит от VM |
| L1-05 | ЛР1 | `-k none` допустим как CLI-параметр Suricata для отключения checksum validation | OFFICIAL | VERIFIED | Suricata command-line docs; в курсе явно ограничено виртуальным учебным стендом |
| L2-01 | ЛР2 | Один `/lab2-trigger/LAB2-NET` создаёт сетевой alert и локальный файл через учебный server.py | SYNTHETIC | COMPONENT VERIFIED / FULL RUNTIME QA REQUIRED | HTTP endpoint unit-tested; сетевой namespace + Suricata + Linux Audit требуют прогона на эталонной VM |
| L2-02 | ЛР2 | Linux Audit filesystem rule `-a always,exit -F arch=b64 -F dir=... -F perm=wa` корректен | OS TOOLING | DOCUMENTATION VERIFIED | auditctl/audit.rules manual; deprecated `-w` больше не используется |
| L2-03 | ЛР2 | `ausearch -k idps_lab_host -ts recent -i` извлекает недавние записи по учебному ключу | OS TOOLING | DOCUMENTATION VERIFIED | ausearch manual; `recent` = последние 10 минут |
| L2-04 | ЛР2 | Suricata и Linux Audit запускаются на одной Ubuntu Server VM, но используют разные источники данных: сетевой интерфейс и хостовые audit events | OS MODEL | VERIFIED AS LAB DESIGN | В тексте явно разведены место исполнения средства и источник наблюдения |
| L2-05 | ЛР2 | `lab02-instructor-check.sh` способен подтвердить весь network+host эксперимент | SYNTHETIC/TOOLING | RUNTIME QA REQUIRED | Скрипт проверен синтаксически; требуется execution pass на classroom image |

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

Source audit подтверждает корректность **источников и формулировок**, но не заменяет runtime QA. Для ЛР №1 и ЛР №2 полный runtime-статус подтверждается только успешным запуском соответствующего `lab0X-instructor-check.sh` на том же Ubuntu-образе, который выдаётся студентам. До этого обе работы сохраняют статус `RUNTIME QA REQUIRED`.

## v2.17 — Lecture + Practice + Lab migration

| ID | Раздел | Claim / изменение | Тип | Статус | Примечание |
|---|---|---|---|---|---|
| V217-01 | Гл.1 | Firewall и IDS/IPS различаются по защитной функции, а не по жёсткой границе L3/L4 vs L7 | STANDARD/ENGINEERING | VERIFIED / QUALIFIED | NIST SP 800-41 Rev.1 + SP 800-94; modern product overlap оговорён |
| V217-02 | Гл.1 | IDS = detection, IPS = detection + возможность prevention | STANDARD | VERIFIED | NIST SP 800-94 foundational definition |
| V217-03 | Гл.1 | Учебный `ATTACK-LAB` scenario | SYNTHETIC | VERIFIED AS COURSE DESIGN | Не real exploit; используется только для controlled detection |
| V217-04 | Гл.2 | Классические четыре типа: Network-Based, Wireless, NBA, Host-Based | STANDARD/HISTORICAL | VERIFIED / QUALIFIED | NIST SP 800-94; не выдаётся за идеальную современную ontology |
| V217-05 | Гл.2 | Data source/domain отделён от detection method | COURSE SYNTHESIS | ENGINEERING | Исправляет прежнее смешение `Network/Host/Wireless/Behavior` |
| V217-06 | ЛР1 | Starter rule SID 1000001 ищет `ATTACK-LAB` в `http.uri` | SYNTHETIC | RUNTIME QA REQUIRED | Rule syntax подготовлен под Suricata 8; требуется execution pass на учебном image |
| V217-07 | ЛР1 | LabBox `lab-client0` end-to-end visibility и ожидаемый EVE output | SYNTHETIC | RUNTIME QA REQUIRED | До classroom release выполнить контрольный прогон |

## Дополнение v2.20 — новая Глава 3 и ЛР №2

| ID | Раздел | Утверждение / объект проверки | Тип | Статус | Основание |
|---|---|---|---|---|---|
| C3N-01 | Гл.3 | Типичные компоненты IDPS включают sensor/agent, management server, database server, console | FOUNDATION | VERIFIED | NIST SP 800-94, Components and Architecture |
| C3N-02 | Гл.3 | Sensor и agent — функционально различаемые термины для сетевого/хостового наблюдения в классической модели | FOUNDATION | VERIFIED | NIST SP 800-94 |
| C3N-03 | Гл.3 | Функциональная схема главы не является универсальным физическим pipeline продукта | COURSE SYNTHESIS | VERIFIED AS COURSE DESIGN | Коррекция LMA: избегаем linear pipeline bias |
| C3N-04 | Гл.3 | Детектор может работать на разных представлениях; app parsing не является обязательной границей начала detection | OFFICIAL/ENGINEERING | VERIFIED / QUALIFIED | Suricata rule types + architecture; область применения зависит от детектора |
| C3N-05 | Гл.3 | EVE JSON используется как канал структурированного вывода результатов Suricata | OFFICIAL | VERIFIED | Suricata EVE JSON documentation |
| L2N-01 | ЛР2 | `auditctl -w ... -p wa -k ...` и `ausearch -k ...` используются как механизм временного Linux Audit наблюдения | OS TOOLING | DOCUMENTATION VERIFIED | Linux Audit userspace/manpages; runtime зависит от VM |
| L2N-02 | ЛР2 | Suricata SID 1000002 формирует ожидаемое оповещение на URI `/LAB2-NET` в LabBox | SYNTHETIC | RUNTIME QA REQUIRED | Требуется end-to-end прогон LabBox + Suricata |
| L2N-03 | ЛР2 | Linux Audit фиксирует запись `/var/tmp/idps-lab/lab2-evidence.txt`, созданную учебным web-процессом, с доступным процессным контекстом | SYNTHETIC | RUNTIME QA REQUIRED | Требуется прогон auditd на эталонной Ubuntu Server VM |
| L2N-04 | ЛР2 | Linux Audit в работе является источником host telemetry, а не полноценной HIDS-платформой | COURSE DESIGN | VERIFIED AS COURSE DESIGN | Явно указано в тексте лабораторной |

## Дополнение v2.23 — самостоятельная подготовка лабораторной среды

| ID | Раздел | Утверждение / объект проверки | Тип | Статус | Основание |
|---|---|---|---|---|---|
| ENV-01 | Среда | Две VM используют NAT для внешнего доступа и отдельную Internal Network `IDPS-LAB` для экспериментов | COURSE DESIGN | VERIFIED AS DESIGN | Изоляция учебного трафика от внешней сети; exact VirtualBox runtime зависит от host OS |
| ENV-02 | Среда | Bootstrap scripts устанавливают набор команд, необходимый ЛР №1–2 | TOOLING | STATICALLY VERIFIED | `bash -n`, проверка command list; package availability требует `apt` runtime |
| ENV-03 | Среда | `check-client-environment.sh` подтверждает IP клиента, наличие инструментов и связь с сервером | TOOLING | STATICALLY VERIFIED / RUNTIME REQUIRED | Логика скрипта проверена; фактический результат зависит от VM/VirtualBox |
| ENV-04 | Среда | `check-server-environment.sh` подтверждает IP сервера, Suricata config, auditd/Linux Audit и связь с клиентом | TOOLING | STATICALLY VERIFIED / RUNTIME REQUIRED | Полная проверка требует Ubuntu Server 24.04.x с kernel audit subsystem |
| ENV-05 | Среда | Статус `READY` является prerequisite для ЛР №1, но не доказательством работоспособности самой ЛР | COURSE DESIGN | VERIFIED AS DESIGN | Разделены environment readiness и lab end-to-end runtime QA |
