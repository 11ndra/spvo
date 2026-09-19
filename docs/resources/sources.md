# Источники курса

!!! info "Политика источников"
    В курсе действует принцип **«сначала первичные источники»**. Технический факт по возможности опирается на стандарт, RFC, официальную документацию проекта, первичный или близкий к первичному отчёт об инциденте либо исследовательскую публикацию. Архитектурные выводы обозначаются как инженерные рекомендации, а созданные для курса топологии, файлы захвата пакетов (`PCAP`) и сценарии — как синтетический учебный материал.

## Фундамент
- Dorothy E. Denning — *An Intrusion-Detection Model*.
- Stefan Axelsson — *The Base-Rate Fallacy and the Difficulty of Intrusion Detection*.
- NIST SP 800-94 — *Guide to Intrusion Detection and Prevention Systems*.


## Дополнительная литература по эксплуатации и реагированию

- Joshua Wright, *Dynamic Incident Response: A Framework for Security Teams*, SANS Institute, 2026 — дополнительный источник примеров по источникам данных для обнаружения, метаданным зашифрованного трафика, проверке и первичному разбору событий, определению масштаба инцидента и реагированию. Книга не заменяет RFC, стандарты и официальную документацию и не используется как источник универсальной классификации IDPS.

## Реальные угрозы и действия противника
- MITRE ATT&CK Enterprise — https://attack.mitre.org/
- MITRE D3FEND — https://d3fend.mitre.org/
- CISA KEV — https://www.cisa.gov/known-exploited-vulnerabilities-catalog

## Техническая документация
- Suricata User Guide — https://docs.suricata.io/
- Zeek Documentation — https://docs.zeek.org/en/current/
- Wazuh Documentation — https://documentation.wazuh.com/current/
- Wireshark Documentation — https://www.wireshark.org/docs/
- Wireshark User’s Guide: checksum offloading — https://www.wireshark.org/docs/wsug_html_chunked/ChAdvChecksums.html
- OWASP, Web Application Firewall — https://community.owasp.org/Web_Application_Firewall
- RFC 9846 — TLS 1.3 — https://www.rfc-editor.org/rfc/rfc9846.html

## Архитектура и стандарты
- NIST SP 800-207 — Zero Trust Architecture.
- PCI DSS v4.0.1.
- Закон Республики Казахстан №418-V «О кибербезопасности».
- Единые требования, ПП РК №832.
- СТ РК ISO/IEC 27001-2023.


## Реальные случаи и исследования

Эти источники используются там, где они объясняют конкретный механизм, ограничение или способ оценки, а не как самостоятельные «истории атак»:

- Ptacek & Newsham — вставка и уклонение (`insertion/evasion`) и различия интерпретации данных сенсором и конечной системой; английские термины приведены только для связи с терминологией исходной работы;
- Stefan Axelsson — влияние низкой базовой частоты событий на интерпретацию результатов обнаружения;
- отчёты CISA и Microsoft об инцидентах — как источники конкретных случаев, если эпизод действительно демонстрирует разбираемый механизм;
- разбор случая Cisco CSIRT — для примеров архитектуры и эксплуатации IPS.

## Suricata — ЛР №1

Для команд и формата первой лабораторной используются официальные материалы OISF:

- Suricata User Guide — Quickstart: https://docs.suricata.io/en/latest/quickstart.html
- Adding Your Own Rules: https://docs.suricata.io/en/latest/rule-management/adding-your-own-rules.html
- EVE JSON Output: https://docs.suricata.io/en/latest/output/eve/eve-json-output.html
- EVE JSON Format: https://docs.suricata.io/en/latest/output/eve/eve-json-format.html

По состоянию на 19.09.2026 актуальный стабильный выпуск ветки Suricata 8 — **8.0.7 (15.09.2026)**; для ветки Suricata 7 объявлено прекращение поддержки (end of life, EOL). В лаборатории студент всё равно фиксирует фактически установленную версию через `suricata --build-info`, поскольку учебные среды могут обновляться.


## Правила обнаружения и воспроизводимая проверка

Основные технические источники:

- Suricata Rules Format — https://docs.suricata.io/en/latest/rules/intro.html
- Suricata Flow Keywords — https://docs.suricata.io/en/latest/rules/flow-keywords.html
- Suricata HTTP Keywords — https://docs.suricata.io/en/latest/rules/http-keywords.html
- Suricata Payload Keywords / PCRE — https://docs.suricata.io/en/latest/rules/payload-keywords.html
- Suricata Fast Pattern — https://docs.suricata.io/en/latest/rules/fast-pattern-explained.html
- Suricata Thresholding Keywords — https://docs.suricata.io/en/latest/rules/thresholding.html
- OISF suricata-verify — https://github.com/OISF/suricata-verify
- suricata-update Quick Start / Emerging Threats Open — https://github.com/OISF/suricata-update/blob/master/doc/quickstart.rst

Эти источники поддерживают Главу 6 (семантика правил) и Главу 8 (воспроизводимая оценка). ЛР №2 отдельно посвящена сравнению сетевого и хостового источников данных.

## Глава 3 — компоненты и функциональная архитектура

- NIST SP 800-94 — исторический фундаментальный источник по типичным компонентам IDPS: сенсор/агент (`sensor/agent`), сервер управления (`management server`), сервер базы данных (`database server`) и консоль (`console`). Английские названия здесь приведены для связи с терминологией самого документа.
- Suricata User Guide — конкретная реализация сетевого сбора, анализа и структурированного вывода EVE JSON; не используется как универсальное определение архитектуры всех IDS/IPS.

## ЛР №2 — сетевой и хостовый источники

- Suricata User Guide — запуск NIDS и EVE JSON.
- пользовательские утилиты Linux Audit (`auditctl`, `ausearch`) — системный источник событий конечного узла для учебного эксперимента.
- `auditctl(8)` — https://man7.org/linux/man-pages/man8/auditctl.8.html
- `ausearch(8)` — https://man7.org/linux/man-pages/man8/ausearch.8.html

Linux Audit в ЛР №2 используется только для демонстрации различий телеметрии. Лабораторная не утверждает, что Linux Audit сам по себе является полноценной HIDS-платформой.

## Глава 4 — размещение и точки наблюдения

Основные основания Главы 4:

- NIST SP 800-94 — исторический фундаментальный источник по архитектуре сетевых IDPS: выбор места сенсоров, пассивное подключение и подключение в разрыв (`inline`), сетевой ответвитель (`network tap`) и зеркалирование порта коммутатора как способы получения копии трафика пассивным сенсором.
- William Stallings, *Computer Security: Principles and Practice* — учебное описание пассивных NIDS, сетевых IDS/IPS, включённых в разрыв (`inline`), и типовых мест размещения.
- Wireshark User’s Guide, раздел *Checksum Offloading* — техническая основа для оговорок об аппаратной разгрузке вычисления контрольных сумм (`checksum offloading`) при локальном захвате.

В главе сознательно не делается универсального вывода «до межсетевого экрана лучше, чем после» или наоборот. Полезность точки определяется тем, какой набор сетевых событий требуется наблюдать для конкретной задачи.

## ЛР №3 — точка наблюдения

ЛР №3 использует синтетический двухмашинный стенд курса:

- `idps-client` — `10.13.37.10/24`;
- `idps-server` — `10.13.37.20/24`;
- отдельный NAT-интерфейс;
- отдельный интерфейс учебной сети `IDPS-LAB`.

Одинаковое правило Suricata запускается поочерёдно на двух интерфейсах. Журнал учебного веб-сервиса используется как независимое подтверждение существования контролируемого запроса. Границы вывода из каждого источника отдельно оговорены в инструкции ЛР №3.

- OISF: выпуск Suricata 8.0.7 — https://suricata.io/2026/09/15/suricata-8-0-7-released/
- OISF: конфигурация Suricata 8.0.7 и проверка контрольных сумм — https://docs.suricata.io/en/suricata-8.0.7/configuration/suricata-yaml.html

## Глава 5 — методы обнаружения

Основные основания Главы 5:

- NIST SP 800-94, §2.3 — исторический фундаментальный источник для сигнатурного обнаружения (`signature-based detection`), обнаружения аномалий (`anomaly-based detection`) и анализа протокола с учётом состояния (`stateful protocol analysis`), а также для тезиса о совместном использовании нескольких подходов. Английские названия приведены только для связи с терминологией документа. Публикация 2007 года не используется как исчерпывающая современная продуктовая классификация.
- руководство по правилам Suricata 8.0.7 — проверка на конкретной реализации: `flow`, `flowbits`, события прикладного уровня и HTTP-ключевые слова показывают, что язык движка правил способен выражать условия над состоянием потока и разобранными полями протокола. Это не превращает синтаксис правила в отдельный метод обнаружения.

Курс не вводит английскую метку `behavioral` («поведенческий») как отдельную четвёртую универсальную методологию. Для случая без базовой модели используется точное описание **фиксированное условие над серией событий**. Аномальное обнаружение отдельно требует модели, профиля или ожидаемого диапазона, относительно которого определяется отклонение.

- NIST SP 800-94 — https://csrc.nist.gov/pubs/sp/800/94/final
- Suricata 8.0.7 flow keywords — https://docs.suricata.io/en/suricata-8.0.7/rules/flow-keywords.html
- Suricata 8.0.7 generic app-layer keywords — https://docs.suricata.io/en/suricata-8.0.7/rules/app-layer.html
- Suricata 8.0.7 HTTP-ключевые слова — https://docs.suricata.io/en/suricata-8.0.7/rules/http-keywords.html

## ЛР №4 — один набор событий, четыре основания решения

ЛР №4 является **синтетической инженерной моделью и контролируемым экспериментом**. Один контролируемый HTTP-сценарий формирует один JSONL-журнал, после чего четыре предоставленных режима анализируют неизменный набор событий по разным основаниям:

- точное совпадение с маркером — сигнатурное условие;
- синтетическая машина состояний `IDLE → OPEN → IDLE` — анализ состояния;
- `>= 5 /catalog` за `2 s` — фиксированное условие над серией событий без базового профиля;
- отношение медианных интервалов базового профиля и всплеска — аномальное сравнение с базовой моделью.

`START → DATA → END` не является стандартом HTTP, а поле `phase` — служебная метка контролируемого эксперимента, не индикатор атаки. Этот сценарий используется только как синтетическая модель для разделения оснований принятия решения.

## Глава 6 — правила и их структура

Основной технический источник Главы 6 — официальная документация Suricata 8.x. Глава использует Suricata как конкретную реализацию обнаружения на основе правил и не обобщает её синтаксис на все IDS/IPS.

- Suricata Rules Format — https://docs.suricata.io/en/suricata-8.0.7/rules/intro.html
- Suricata Meta Keywords — https://docs.suricata.io/en/suricata-8.0.7/rules/meta.html
- Suricata Flow Keywords — https://docs.suricata.io/en/suricata-8.0.7/rules/flow-keywords.html
- Suricata HTTP Keywords — https://docs.suricata.io/en/suricata-8.0.7/rules/http-keywords.html
- Suricata Thresholding Keywords — https://docs.suricata.io/en/suricata-8.0.7/rules/thresholding.html
- Suricata Global Thresholds / suppress — https://docs.suricata.io/en/suricata-8.0.7/configuration/global-thresholds.html
- Suricata configuration / action order — https://docs.suricata.io/en/suricata-8.0.7/configuration/suricata-yaml.html

Сквозной пример Главы 6 — правило `SID 1000001` из ЛР №1. Оно является **синтетической инженерной моделью**: маркер `ATTACK-LAB` создан для учебного стенда и не является индикатором реальной атаки.

Ключевые границы:

- действие, заголовок и параметры (`action/header/options`) — элементы формата правила Suricata, а не универсальная грамматика любой IDPS;
- `http.uri` выбирает нормализованное представление URI, тогда как `http.uri.raw` предназначен для ненормализованного URI;
- `flow` и `flowbits` предоставляют контекст/состояние, но отдельное ключевое слово не определяет методологию обнаружения;
- `msg`, `sid`, `rev`, `classtype` и `priority` относятся к идентификации/описанию результата и не заменяют условие совпадения;
- ограничение частоты выдачи результатов (`thresholding`) не исправляет логическую причину слишком широкого условия обнаружения;
- действие `drop` имеет предотвращающий эффект только в подходящем IPS/inline-режиме.

## ЛР №5 — изменение условия правила

ЛР №5 является **синтетической инженерной моделью и контролируемым экспериментом**. На одном стенде студент выполняет две серии положительных и отрицательных тестов для `SID 1000005`:

- исходное условие: `http.uri; content:"/LAB5-ALPHA";`;
- изменённое условие: `http.uri; content:"/LAB5-BETA";`.

`rev` увеличивается как метаданные версии и не считается вторым содержательным условием обнаружения. HTTP-ответ учебного приложения используется как независимое подтверждение существования запроса, а EVE JSON — как подтверждение результата конкретного правила. Отсутствие оповещения (`alert`) не трактуется как отсутствие трафика.

Технические источники:

- Suricata Rules Format — https://docs.suricata.io/en/suricata-8.0.7/rules/intro.html
- Suricata HTTP Keywords — https://docs.suricata.io/en/suricata-8.0.7/rules/http-keywords.html
- Suricata EVE JSON Output — https://docs.suricata.io/en/suricata-8.0.7/output/eve/eve-json-output.html



## Глава 7 — ошибки, слепые зоны и границы наблюдаемости

Основные технические основания Главы 7:

- NIST SP 800-94 — исторический фундаментальный источник по ограничениям IDPS, ложноположительным и ложноотрицательным результатам и эксплуатационным факторам. Документ 2007 года не используется как исчерпывающее описание современных продуктов: https://csrc.nist.gov/pubs/sp/800/94/final
- RFC 9846, TLS 1.3 — актуальная спецификация, заменившая RFC 8446; после `ServerHello` сообщения процедуры установления TLS-соединения (`handshake`) защищаются шифрованием, что используется для объяснения границы видимости сетевого сенсора: https://www.rfc-editor.org/rfc/rfc9846.html
- RFC 9849, зашифрованный `ClientHello` (Encrypted Client Hello, ECH) — актуальная спецификация о том, что SNI и другие поля `ClientHello` могут быть защищены: https://www.rfc-editor.org/rfc/rfc9849.html
- Suricata 8.0.7 EVE Index — `stats.capture`, `kernel_drops`, счётчики политики обработки исключительных ситуаций (`exception-policy`), `alert_queue_overflow`, `alerts_suppressed`, метаданные TLS и другие диагностические поля: https://docs.suricata.io/en/suricata-8.0.7/appendix/eve-index.html
- Suricata 8.0.7 Flow Keywords — направление, состояние потока, `only_stream`, `only_frag` и связанный контекст: https://docs.suricata.io/en/suricata-8.0.7/rules/flow-keywords.html
- Suricata TLS Keywords — пример конкретных TLS-представлений, доступных движку при соответствующей видимости: https://docs.suricata.io/en/suricata-8.0.7/rules/tls-keywords.html

Глава не учит техникам обхода IDS/IPS. Фрагментация, восстановление потока (`reassembly`), неоднозначность представлений и шифрование рассматриваются только как инженерные причины, по которым наблюдаемое событие, данные сенсора и решение детектора могут расходиться.


## Глава 8 — оценка эффективности и доказательная отчётность

Основные основания Главы 8:

- NIST SP 800-94 — исторический фундаментальный источник по оценке, ложноположительным и ложноотрицательным результатам, настройке и эксплуатационным факторам IDPS. Документ 2007 года используется как базовый инженерный источник, а не как описание современной продуктовой классификации: https://csrc.nist.gov/pubs/sp/800/94/final
- Stefan Axelsson — *The Base-Rate Fallacy and the Difficulty of Intrusion Detection*; источник для объяснения того, как низкая базовая частота событий влияет на долю подтверждённых положительных решений (`precision`) системы обнаружения: https://doi.org/10.1145/357830.357849
- Suricata 8.0.7 EVE Index — конкретные счётчики для проверки состояния захвата данных, ресурсов и вывода реализации (`kernel_drops`, счётчики `exception-policy`, `alert_queue_overflow`, `alerts_suppressed` и др.): https://docs.suricata.io/en/suricata-8.0.7/appendix/eve-index.html

Глава различает:

- оценку конкретного правила;
- оценку детектора/движка;
- оценку защитного контроля как сквозной цепочки;
- качество обнаружения и отдельно качество предотвращения/исполнительного воздействия;
- качество классификации и эксплуатационные характеристики: наблюдаемость, способность работать при заданной нагрузке, задержку и доставку результата.

## Глава 9 — протоколы, приложения и зашифрованный трафик

### Первичные протокольные источники

- RFC 9846 — актуальная спецификация TLS 1.3, заменившая RFC 8446: https://www.rfc-editor.org/rfc/rfc9846.html
- RFC 9849 — зашифрованный `ClientHello` (Encrypted Client Hello, ECH), защита внутреннего `ClientHello`, включая SNI и другие чувствительные поля: https://www.rfc-editor.org/rfc/rfc9849.html
- RFC 9000 — QUIC как защищённый мультиплексированный транспорт поверх UDP: https://www.rfc-editor.org/rfc/rfc9000.html
- RFC 9114 — HTTP/3, отображение семантики HTTP на QUIC: https://www.rfc-editor.org/rfc/rfc9114.html
- RFC 9110 — *HTTP Semantics*, общая семантика HTTP независимо от конкретного сетевого представления протокола: https://www.rfc-editor.org/rfc/rfc9110.html
- RFC 1035 и его обновления — базовая модель DNS: https://www.rfc-editor.org/rfc/rfc1035.html
- RFC 7858 — DNS поверх TLS (DNS over TLS, DoT): https://www.rfc-editor.org/rfc/rfc7858.html
- RFC 8484 — DNS поверх HTTPS (DNS over HTTPS, DoH): https://www.rfc-editor.org/rfc/rfc8484.html
- RFC 9250 — DNS поверх QUIC (DNS over QUIC, DoQ): https://www.rfc-editor.org/rfc/rfc9250.html
- RFC 4253 и его обновления — спецификация транспортного уровня SSH (*SSH Transport Layer Protocol*): https://www.rfc-editor.org/rfc/rfc4253.html
- Microsoft Open Specifications `[MS-SMB2]` — SMB Protocol Versions 2 and 3: https://learn.microsoft.com/en-us/openspecs/windows_protocols/ms-smb2/5606ad47-5ee0-437a-817e-70c366052962
- Microsoft Learn, *SMB features in Windows and Windows Server* — SMB поверх QUIC (`SMB over QUIC`) для SMB 3.1.1 в актуальных Windows-сценариях: https://learn.microsoft.com/en-us/windows-server/storage/file-server/smb-feature-descriptions

### Документация реализации

- Suricata 8.0.7 Generic App Layer Keywords — состояния определения прикладного протокола и сопоставление условий по данным прикладного уровня: https://docs.suricata.io/en/suricata-8.0.7/rules/app-layer.html
- Suricata 8.0.7 Flow Keywords — контекст сетевого потока и представление восстановленного потока/фрагментов: https://docs.suricata.io/en/suricata-8.0.7/rules/flow-keywords.html
- Suricata 8.0.7 EVE JSON Format — записи HTTP/DNS/TLS/SMB/SSH и других протоколов в структурированном выводе EVE JSON: https://docs.suricata.io/en/suricata-8.0.7/output/eve/eve-json-format.html

Глава использует DNS, HTTP, TLS, QUIC, SSH и SMB как контрастные примеры того, как меняется доступное представление данных. Она не задаёт универсальную последовательность обработки и не является заменой отдельного курса по сетевым протоколам. Suricata используется как конкретный проверяемый пример реализации, а не как источник универсальной классификации IDPS.

## Глава 10 — эксплуатация и жизненный цикл возможностей обнаружения

Глава продолжает модель Глав 8–9: проверенная возможность обнаружения относится к конкретному состоянию системы и после существенного изменения требует повторного подтверждения затронутой части причинной цепочки. Жизненный цикл в главе — **учебная инженерная модель**, а не универсальный нормативный процесс для всех IDPS.

Основные источники:

- NIST SP 800-94 — историческая инженерная основа по проектированию, внедрению, конфигурированию, защите, мониторингу и сопровождению IDPS. Документ 2007 года не используется как актуальная продуктовая классификация: https://csrc.nist.gov/pubs/sp/800/94/final
- Suricata 8.0.7, Rule Management with Suricata-Update — получение и управление наборами правил конкретной реализации: https://docs.suricata.io/en/suricata-8.0.7/rule-management/suricata-update.html
- Suricata 8.0.7, Rule Reloads — повторная загрузка правил во время работы, затрагиваемые ресурсы и переключение движка обнаружения: https://docs.suricata.io/en/suricata-8.0.7/rule-management/rule-reload.html
- Suricata 8.0.7, Statistics — эксплуатационные счётчики и признаки потерь/разрывов обработки: https://docs.suricata.io/en/suricata-8.0.7/performance/statistics.html
- Suricata 8.0.7, Interacting via Unix Socket — получение рабочей версии, статистики интерфейса и состояния набора правил: https://docs.suricata.io/en/suricata-8.0.7/unix-socket.html
- Suricata 8.0.7, EVE JSON Output — конфигурация вывода, статистики и буферизации событий: https://docs.suricata.io/en/suricata-8.0.7/output/eve/eve-json-output.html

Дополнительная книга Joshua Wright, *Dynamic Incident Response: A Framework for Security Teams* (SANS Institute, 2026) используется только для примеров постоянной настройки детекторов, поддержания готовности и проверки покрытий. Её модель реагирования и терминология не задают структуру жизненного цикла IDPS в курсе.

Ключевые границы:

- успешное получение нового файла правил не доказывает его активацию в рабочем движке;
- успешная активация не доказывает ожидаемый результат на нужном представлении данных;
- статус запущенного процесса не доказывает получение нужного трафика, отсутствие потерь или доставку результата;
- эксплуатационный счётчик поддерживает вывод о конкретном наблюдаемом состоянии, но не устанавливает автоматически причину отдельного FP/FN;
- команды Suricata приводятся только как пример конкретной реализации и не считаются универсальными командами IDPS.

