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
| C4-01 | Гл.4 | Выбор размещения network-based IDPS включает место сенсора, passive/inline режим и способ подключения пассивного сенсора | STANDARD | VERIFIED / HISTORICAL | NIST SP 800-94: architecture design explicitly includes sensor placement, inline/passive choice, network tap and switch spanning port |
| C4-02 | Гл.4 | Пассивный сенсор получает копию трафика; основной поток не обязан проходить через него | STANDARD/TEXTBOOK | VERIFIED | NIST SP 800-94 + Stallings; используется как топологическое различие, не как определение функции detection/prevention |
| C4-03 | Гл.4 | Точка до и после межсетевого экрана может предоставлять разные множества наблюдаемых попыток/разрешённых взаимодействий | ENGINEERING | VERIFIED AS TOPOLOGY CONSEQUENCE | Вывод следует из пути и применяемой firewall policy; ни одна точка не объявляется универсально лучшей |
| C4-04 | Гл.4 | Отсутствие записи у сенсора само по себе не доказывает отсутствие события или границу видимости | ENGINEERING | VERIFIED AS COURSE INFERENCE | Валидация требует независимого ground truth и контролируемого маршрута; формулировка ограничена конкретным экспериментом |
| C4-05 | Гл.4 | SPAN и TAP — способы предоставить копию в выбранной точке, а не методы обнаружения | STANDARD | VERIFIED / HISTORICAL | NIST SP 800-94 приводит оба как connection methods for passive sensors |
| C5-01 | Гл.5 | Сигнатурное обнаружение сопоставляет наблюдаемую активность с заранее описанными признаками | STANDARD | VERIFIED / HISTORICAL | NIST SP 800-94 §2.3.1; в курсе не сводится только к raw string matching |
| C5-02 | Гл.5 | Anomaly-based detection требует определения нормального профиля и сравнения наблюдения с ним | STANDARD | VERIFIED / HISTORICAL | NIST SP 800-94 §2.3.2 |
| C5-03 | Гл.5 | Stateful protocol analysis использует состояние и модель протокола; реальный продукт может сочетать его с сигнатурами | STANDARD | VERIFIED / HISTORICAL | NIST SP 800-94 §2.3.3 и описание interwoven techniques |
| C5-04 | Гл.5 | Поведенческая логика не обязана быть anomaly-based | COURSE SYNTHESIS | VERIFIED AS COURSE MODEL | В курсе behavioral = условие над последовательностью/частотой/связью событий; baseline требуется только когда решение определяется отклонением от нормы |
| LEGACY-C6-01 | Гл.6 предыдущей редакции | Base-rate способен приводить к большому числу FP даже при низком FPR | RESEARCH | VERIFIED | Stefan Axelsson, ACM TISSEC; добавлена прямая research reference |
| LEGACY-C6-02 | Гл.6 предыдущей редакции | Любое «ужесточение правила» обязательно повышает FN | ENGINEERING | NEEDS QUALIFICATION | Исправлено: trade-off показан корректно для движения decision threshold; произвольная правка rule не обязана быть монотонной |
| LEGACY-C6-03 | Гл.6 предыдущей редакции | Log4Shell scan-source IP давали высокий FP; CISA советовала искать successful exploitation | CASE | VERIFIED | CISA AA21-356A, прямое утверждение advisory |
| LEGACY-C6-04 | Гл.6 предыдущей редакции | Разделять recon/attempt/success и не блокировать по low-confidence indicator | ENGINEERING | VERIFIED AS INFERENCE | Теперь явно названо инженерным расширением CISA guidance, не «best practice» без источника |
| C6-01 | Гл.6 | Правило Suricata состоит из действия, заголовка и параметров | OFFICIAL | VERIFIED | OISF Suricata Rules Format; в курсе используется как синтаксическая декомпозиция, не как internal processing pipeline |
| C6-02 | Гл.6 | `flow:established,to_server` ограничивает правило установленным потоком в направлении к серверу | OFFICIAL | VERIFIED | Suricata 8 Flow Keywords |
| C6-03 | Гл.6 | `http.uri` выбирает нормализованное URI-представление, `http.uri.raw` — ненормализованное | OFFICIAL | VERIFIED | Suricata 8.0.7 HTTP Keywords |
| C6-04 | Гл.6 | `msg`, `sid`, `rev` используются для описания/идентификации и версии правила, а не как доказательство вредоносности | OFFICIAL/ENGINEERING | VERIFIED | Suricata meta keywords + course interpretation |
| C6-05 | Гл.6 | Успешный `suricata -T` не доказывает корректность detection logic | ENGINEERING | VERIFIED AS COURSE INFERENCE | `-T` проверяет загрузку конфигурации/правил; поведение проверяется отдельным traffic test |
| C6-06 | Гл.6 | `drop` в правиле не означает автоматическое блокирование при пассивном IDS-размещении | OFFICIAL/ENGINEERING | VERIFIED | Suricata actions + ранее зафиксированное разграничение inline topology и prevention function |
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
| C8-08 | Гл.8 | Актуальная поддерживаемая ветка курса — Suricata 8; на 16.09.2026 выпущена 8.0.7 | OFFICIAL | VERIFIED | OISF release 15.09.2026; Suricata 7 EOL |
| P1-01 | Pre-Lab | Вопросы проверяют course reasoning, а не внешнюю сертификацию | SYNTHETIC | VERIFIED AS COURSE DESIGN | Не выдаётся за vendor/NIST exam; ссылка на ЛР №1 актуализирована |
| L5-01 | ЛР5 | `-S` загружает указанный файл правил независимо от ruleset в YAML | OFFICIAL | VERIFIED | Suricata Command Line Options |
| L5-02 | ЛР5 | Базовые конструкции `alert http`, `flow`, `http.method`, `http.uri`, `content`, `sid`, `rev` соответствуют документированному синтаксису Suricata 8 | OFFICIAL | VERIFIED | Suricata 8 rule docs |
| L5-03 | ЛР5 | Отдельные каталоги EVE для трёх этапов исключают смешение событий предыдущего запуска | ENGINEERING | VERIFIED AS COURSE DESIGN | Каждый запуск использует собственный `-l` каталог, который предварительно пересоздаётся |
| L5-04 | ЛР5 | Полная последовательность Server/Client/Suricata даёт ожидаемую матрицу SID 1000501/1000502/1000503 | SYNTHETIC | RUNTIME QA REQUIRED | Shell/Python/static structure проверяются отдельно; нужен сквозной прогон на эталонных VM |
| L1-01 | ЛР1 | `suricata --build-info`, `-T`, `-S`, `-i`, `-l`, EVE JSON — реальные интерфейсы/вывод | OFFICIAL | VERIFIED | OISF Suricata 8 docs |
| L1-02 | ЛР1 | Ubuntu stable PPA — поддерживаемый OISF installation path | OFFICIAL | VERIFIED | OISF Quickstart/PPA; сделан optional для offline-first среды |
| L1-03 | ЛР1 | Двухмашинный стенд `10.13.37.10 → 10.13.37.20:8080`, Suricata на сетевом интерфейсе сервера и SID 1000001 работают end-to-end как описано | SYNTHETIC | RUNTIME QA REQUIRED | Требуется прогон на эталонных Ubuntu Desktop/Server 24.04.x, собранных по текущей инструкции подготовки среды |
| L1-04 | ЛР1 | Предварительная проверка подтверждает команды, адреса, HTTP-сервис и `suricata -T` до эксперимента | SYNTHETIC/TOOLING | STATICALLY VERIFIED | Shell syntax проверен; фактический результат зависит от VM |
| L1-05 | ЛР1 | `-k none` допустим как CLI-параметр Suricata для отключения checksum validation | OFFICIAL | VERIFIED | Suricata command-line docs; в курсе явно ограничено виртуальным учебным стендом |
| L2-01 | ЛР2 | Один `/lab2-trigger/LAB2-NET` создаёт сетевой след для Suricata и локальный файловый след для Linux Audit на двухмашинном стенде | SYNTHETIC | COMPONENT VERIFIED / FULL RUNTIME QA REQUIRED | HTTP endpoint проверен отдельно; полный Suricata + Linux Audit сценарий требует прогона на эталонных Ubuntu VM |
| L2-02 | ЛР2 | Linux Audit filesystem rule `-a always,exit -F arch=b64 -F dir=... -F perm=wa` корректен | OS TOOLING | DOCUMENTATION VERIFIED | auditctl/audit.rules manual; deprecated `-w` больше не используется |
| L2-03 | ЛР2 | `ausearch -k idps_lab_host -ts recent -i` извлекает недавние записи по учебному ключу | OS TOOLING | DOCUMENTATION VERIFIED | ausearch manual; `recent` = последние 10 минут |
| L2-04 | ЛР2 | Suricata и Linux Audit запускаются на одной Ubuntu Server VM, но используют разные источники данных: сетевой интерфейс и хостовые audit events | OS MODEL | VERIFIED AS LAB DESIGN | В тексте явно разведены место исполнения средства и источник наблюдения |
| L2-05 | ЛР2 | Предварительная проверка уменьшает число инфраструктурных ошибок, но не заменяет полный end-to-end прогон | COURSE TOOLING | VERIFIED AS DESIGN | Runtime QA выполняется отдельным контрольным прохождением всей инструкции на эталонных VM |
| L3-01 | ЛР3 | Внутренний HTTP `10.13.37.10 → 10.13.37.20:8080` и исходящий ICMP к default gateway должны проходить через разные интерфейсы при двухсетевой конфигурации | SYNTHETIC/TOPOLOGY | RUNTIME QA REQUIRED | Маршруты и скрипты проверены статически; нужен end-to-end прогон на classroom VM |
| L3-02 | ЛР3 | Web-сервис привязан строго к `10.13.37.20:8080` и журналирует `src_ip:src_port → dst_ip:dst_port`, method и URI | SYNTHETIC | COMPONENT VERIFIED | Исключает неоднозначность `0.0.0.0`; application log подтверждает только L7-обработку HTTP |
| L3-03 | ЛР3 | Отдельные каталоги `lab03-nat-run` и `lab03-lab-run` предотвращают смешение старых и новых EVE-событий | COURSE DESIGN | VERIFIED AS DESIGN | Каждый запуск Suricata начинает с чистого каталога |
| L3-04 | ЛР3 | `-k none` отключает checksum checks для конкретного запуска Suricata; offloading дополнительно контролируется `ethtool` | OFFICIAL/ENGINEERING | VERIFIED / RUNTIME QA REQUIRED | Suricata CLI и capture guidance; конкретный VirtualBox driver нужно проверить на VM |
| L3-05 | ЛР3 | Сводная матрица различает application log, packet capture и IDS alert как разные виды свидетельств | COURSE DESIGN | VERIFIED AS DESIGN | Не использует отсутствие одного источника как универсальное доказательство отсутствия события |

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
- Suricata 8 documentation — https://docs.suricata.io/en/suricata-8.0.7/
- OISF suricata-verify — https://github.com/OISF/suricata-verify
- OISF suricata-update — https://github.com/OISF/suricata-update
- Wazuh FIM docs — https://documentation.wazuh.com/current/user-manual/capabilities/file-integrity/
- Zeek docs — https://docs.zeek.org/en/current/

## Что аудит НЕ подтверждает

Source audit подтверждает корректность **источников и формулировок**, но не заменяет runtime QA. Для исполняемых лабораторных полный runtime-статус подтверждается только ручным end-to-end прохождением всей студенческой инструкции на эталонных Ubuntu-образах. Предварительные проверки подтверждают готовность зависимостей, но не заменяют этот прогон.

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

## Дополнение v2.26 — Глава 5 и ЛР №4

| ID | Раздел | Утверждение / объект проверки | Тип | Статус | Основание |
|---|---|---|---|---|---|
| L4-01 | ЛР4 | Все три учебных детектора читают один формат событий `lab4-access.jsonl` | SYNTHETIC | STATICALLY VERIFIED | Общий loader `detectors.py`; лабораторная меняет условие анализа, а не формат входных записей |
| L4-02 | ЛР4 | Сигнатурный режим выделяет запись по наличию заданного маркера в `uri` | SYNTHETIC | STATICALLY VERIFIED | Логика `detectors.py`; автономный тест на контролируемом JSONL |
| L4-03 | ЛР4 | Поведенческий режим проверяет не менее 5 событий одного пути от одного источника в окне 10 с | SYNTHETIC | STATICALLY VERIFIED | Детерминированный sliding-window в `detectors.py`; не выдаётся за официальный отдельный метод NIST |
| L4-04 | ЛР4 | Аномалийный режим использует учебную базовую линию `value_length`, среднее, σ и порог | SYNTHETIC | STATICALLY VERIFIED / NOT PRODUCTION | Модель предназначена только для демонстрации зависимости «базовая линия → мера отклонения → порог» |
| L4-05 | ЛР4 | Полная работа на двух VirtualBox VM воспроизводится end-to-end | SYNTHETIC | RUNTIME QA REQUIRED | HTTP-сервис и анализатор проверяются автономно; полный classroom path требует эталонных VM |
