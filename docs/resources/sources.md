# Источники курса

!!! info "Source policy после аудита 09.09.2026"
    Курс использует принцип **primary sources first**. Технический факт по возможности опирается на стандарт, официальную документацию проекта, первичный/близкий к первичному incident report или исследовательскую публикацию. Наши архитектурные выводы маркируются как инженерные рекомендации, а созданные нами топологии, PCAP и сценарии — как synthetic teaching material. Подробная трассировка утверждений и внутренних проверок ведётся в служебных QA-материалах проекта и не публикуется в студенческой навигации.

Курс строится по принципу **primary sources first**.

## Фундамент
- Dorothy E. Denning — *An Intrusion-Detection Model*.
- Stefan Axelsson — *The Base-Rate Fallacy and the Difficulty of Intrusion Detection*.
- NIST SP 800-94 — *Guide to Intrusion Detection and Prevention Systems*.

## Реальные угрозы и TTP
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

После пересборки первых глав старые привязки кейсов к номерам глав больше не используются. Реальные инциденты и исследования будут повторно привязаны к темам только после обновления соответствующей главы.

Сохраняем в пуле источников:

- Ptacek & Newsham — insertion/evasion и различия интерпретации сенсора и конечной системы;
- Stefan Axelsson — base-rate fallacy;
- CISA / Microsoft incident reports — для последующих глав, где они демонстрируют конкретный механизм;
- Cisco CSIRT case study — для архитектуры и эксплуатации IPS.

## Suricata — ЛР №1

Для команд и формата первой лабораторной используются официальные материалы OISF:

- Suricata User Guide — Quickstart: https://docs.suricata.io/en/latest/quickstart.html
- Adding Your Own Rules: https://docs.suricata.io/en/latest/rule-management/adding-your-own-rules.html
- EVE JSON Output: https://docs.suricata.io/en/latest/output/eve/eve-json-output.html
- EVE JSON Format: https://docs.suricata.io/en/latest/output/eve/eve-json-format.html

На дату обновления 16.09.2026 актуальный release ветки Suricata 8 — **8.0.7 (15.09.2026)**; ветка Suricata 7 объявлена EOL. В лаборатории студент всё равно фиксирует фактически установленную версию через `suricata --build-info`, поскольку учебные среды могут обновляться.


## Проектирование обнаружения — материал будущей переработанной Главы 8

Основные технические reference:

- Suricata Rules Format — https://docs.suricata.io/en/latest/rules/intro.html
- Suricata Flow Keywords — https://docs.suricata.io/en/latest/rules/flow-keywords.html
- Suricata HTTP Keywords — https://docs.suricata.io/en/latest/rules/http-keywords.html
- Suricata Payload Keywords / PCRE — https://docs.suricata.io/en/latest/rules/payload-keywords.html
- Suricata Fast Pattern — https://docs.suricata.io/en/latest/rules/fast-pattern-explained.html
- Suricata Thresholding Keywords — https://docs.suricata.io/en/latest/rules/thresholding.html
- OISF suricata-verify — https://github.com/OISF/suricata-verify
- suricata-update Quick Start / Emerging Threats Open — https://github.com/OISF/suricata-update/blob/master/doc/quickstart.rst

Старый материал по воспроизводимой проверке правил сохранён как основа для будущей Главы 8, но больше не относится к ЛР №2. Новая ЛР №2 посвящена сравнению сетевого и хостового источников данных.

## Глава 3 — компоненты и функциональная архитектура

- NIST SP 800-94 — исторический фундаментальный источник по типичным компонентам IDPS: sensor/agent, management server, database server, console.
- Suricata User Guide — конкретная реализация сетевого сбора, анализа и структурированного вывода EVE JSON; не используется как универсальное определение архитектуры всех IDS/IPS.

## ЛР №2 — сетевой и хостовый источники

- Suricata User Guide — запуск NIDS и EVE JSON.
- Linux Audit userspace (`auditctl`, `ausearch`) — системный источник хостовых событий для учебного эксперимента.
- `auditctl(8)` — https://man7.org/linux/man-pages/man8/auditctl.8.html
- `ausearch(8)` — https://man7.org/linux/man-pages/man8/ausearch.8.html

Linux Audit в ЛР №2 используется только для демонстрации различий телеметрии. Лабораторная не утверждает, что Linux Audit сам по себе является полноценной HIDS-платформой.

## Глава 4 — размещение и точки наблюдения

Основные основания новой Главы 4:

- NIST SP 800-94 — исторический фундаментальный источник по network-based IDPS architecture: выбор места сенсоров, passive/inline deployment, network tap и switch spanning port как варианты подключения пассивных сенсоров.
- William Stallings, *Computer Security: Principles and Practice* — учебное описание passive NIDS, inline NIDS/IPS и типовых мест размещения.
- Wireshark User’s Guide, *Checksum Offloading* — техническая основа для оговорок о checksum offloading при локальном захвате.

В главе сознательно не делается универсального вывода «до firewall лучше, чем после» или наоборот. Полезность точки определяется тем, какой набор сетевых событий требуется наблюдать для конкретной задачи.

## ЛР №3 — точка наблюдения

ЛР №3 использует синтетический двухмашинный стенд курса:

- `idps-client` — `10.13.37.10/24`;
- `idps-server` — `10.13.37.20/24`;
- отдельный NAT-интерфейс;
- отдельный интерфейс учебной сети `IDPS-LAB`.

Одинаковое правило Suricata запускается поочерёдно на двух интерфейсах. Журнал учебного web-сервиса используется как независимое подтверждение существования контролируемого запроса. Границы вывода из каждого источника отдельно оговорены в инструкции ЛР №3.

- OISF: Suricata 8.0.7 release — https://suricata.io/2026/09/15/suricata-8-0-7-released/
- OISF: Suricata 8.0.7 configuration / checksum validation — https://docs.suricata.io/en/suricata-8.0.7/configuration/suricata-yaml.html

## Глава 5 — методы обнаружения

Основные основания новой Главы 5:

- NIST SP 800-94, §2.3 — исторический фундаментальный источник для signature-based detection, anomaly-based detection и stateful protocol analysis, а также для тезиса о совместном использовании нескольких методологий. Публикация 2007 года не используется как исчерпывающая современная продуктовая taxonomy.
- Suricata 8.0.7 Rule Guide — официальная проверка на конкретной реализации: `flow`, `flowbits`, события прикладного уровня и HTTP-ключевые слова показывают, что язык движка правил способен выражать условия над состоянием потока и разобранными полями протокола. Это не превращает синтаксис правила в отдельный метод обнаружения.

Курс не вводит `behavioral` как отдельную четвёртую универсальную методологию. Для случая без базовой модели используется точное описание **фиксированное условие над серией событий**. Аномальное обнаружение отдельно требует модели, профиля или ожидаемого диапазона, относительно которого определяется отклонение.

- NIST SP 800-94 — https://csrc.nist.gov/pubs/sp/800/94/final
- Suricata 8.0.7 flow keywords — https://docs.suricata.io/en/suricata-8.0.7/rules/flow-keywords.html
- Suricata 8.0.7 generic app-layer keywords — https://docs.suricata.io/en/suricata-8.0.7/rules/app-layer.html
- Suricata 8.0.7 HTTP-ключевые слова — https://docs.suricata.io/en/suricata-8.0.7/rules/http-keywords.html

## ЛР №4 — один набор событий, четыре основания решения

ЛР №4 является **SYNTHETIC ENGINEERING / CONTROLLED EXPERIMENT**. Один контролируемый HTTP-сценарий формирует один JSONL-журнал, после чего четыре предоставленных режима анализируют неизменный набор событий по разным основаниям:

- exact marker — сигнатурное условие;
- синтетическая `IDLE → OPEN → IDLE` state-machine — анализ состояния;
- `>= 5 /catalog` за `2 s` — фиксированное условие над серией событий без базового профиля;
- отношение медианных интервалов базового профиля и всплеска — аномальное сравнение с базовой моделью.

`START → DATA → END` не является стандартом HTTP, а поле `phase` — служебная метка контролируемого эксперимента, не индикатор атаки. Этот сценарий используется только как синтетическая модель для разделения оснований принятия решения.

## Глава 6 — правила и их структура

Основной технический reference новой Главы 6 — официальная документация Suricata 8.x. Глава использует Suricata как конкретную реализацию rule-based detection и не обобщает её синтаксис на все IDS/IPS.

- Suricata Rules Format — https://docs.suricata.io/en/suricata-8.0.7/rules/intro.html
- Suricata Meta Keywords — https://docs.suricata.io/en/suricata-8.0.7/rules/meta.html
- Suricata Flow Keywords — https://docs.suricata.io/en/suricata-8.0.7/rules/flow-keywords.html
- Suricata HTTP Keywords — https://docs.suricata.io/en/suricata-8.0.7/rules/http-keywords.html
- Suricata Thresholding Keywords — https://docs.suricata.io/en/suricata-8.0.7/rules/thresholding.html
- Suricata Global Thresholds / suppress — https://docs.suricata.io/en/suricata-8.0.7/configuration/global-thresholds.html
- Suricata configuration / action order — https://docs.suricata.io/en/suricata-8.0.7/configuration/suricata-yaml.html

Сквозной пример Главы 6 — правило `SID 1000001` из ЛР №1. Оно является **SYNTHETIC ENGINEERING**: маркер `ATTACK-LAB` создан для учебного стенда и не является индикатором реальной атаки.

Ключевые границы:

- action/header/options — формат правила Suricata, а не универсальная грамматика любой IDPS;
- `http.uri` выбирает нормализованное представление URI, тогда как `http.uri.raw` предназначен для ненормализованного URI;
- `flow` и `flowbits` предоставляют контекст/состояние, но отдельное ключевое слово не определяет методологию обнаружения;
- `msg`, `sid`, `rev`, `classtype` и `priority` относятся к идентификации/описанию результата и не заменяют условие совпадения;
- thresholding управляет частотой результатов и не исправляет логическую причину слишком широкого detection condition;
- действие `drop` имеет предотвращающий эффект только в подходящем IPS/inline-режиме.

## ЛР №5 — изменение условия правила

ЛР №5 является **SYNTHETIC ENGINEERING / CONTROLLED EXPERIMENT**. На одном стенде студент выполняет две серии positive/negative tests для `SID 1000005`:

- исходное условие: `http.uri; content:"/LAB5-ALPHA";`;
- изменённое условие: `http.uri; content:"/LAB5-BETA";`.

`rev` увеличивается как метаданные версии и не считается вторым содержательным условием обнаружения. HTTP-ответ учебного приложения используется как независимое подтверждение существования запроса, а EVE JSON — как подтверждение результата конкретного правила. Отсутствие alert не трактуется как отсутствие трафика.

Технические reference:

- Suricata Rules Format — https://docs.suricata.io/en/suricata-8.0.7/rules/intro.html
- Suricata HTTP Keywords — https://docs.suricata.io/en/suricata-8.0.7/rules/http-keywords.html
- Suricata EVE JSON Output — https://docs.suricata.io/en/suricata-8.0.7/output/eve/eve-json-output.html



## Глава 7 — ошибки, слепые зоны и границы наблюдаемости

Основные технические основания новой Главы 7:

- NIST SP 800-94 — исторический фундаментальный источник по ограничениям IDPS, false positive/false negative и эксплуатационным факторам. Документ 2007 года не используется как исчерпывающее описание современных продуктов: https://csrc.nist.gov/pubs/sp/800/94/final
- RFC 8446, TLS 1.3 — handshake после `ServerHello` защищается шифрованием; используется для объяснения границы видимости сетевого сенсора: https://www.rfc-editor.org/rfc/rfc8446.html
- RFC 9849, TLS Encrypted Client Hello (ECH) — актуальная оговорка о том, что SNI и другие поля `ClientHello` могут быть защищены: https://www.rfc-editor.org/rfc/rfc9849.html
- Suricata 8.0.7 EVE Index — `stats.capture`, `kernel_drops`, exception-policy counters, `alert_queue_overflow`, `alerts_suppressed`, TLS metadata и другие диагностические поля: https://docs.suricata.io/en/suricata-8.0.7/appendix/eve-index.html
- Suricata 8.0.7 Flow Keywords — направление, состояние потока, `only_stream`, `only_frag` и связанный контекст: https://docs.suricata.io/en/suricata-8.0.7/rules/flow-keywords.html
- Suricata TLS Keywords — пример конкретных TLS-представлений, доступных движку при соответствующей видимости: https://docs.suricata.io/en/suricata-8.0.7/rules/tls-keywords.html

Глава не учит техникам обхода IDS/IPS. Фрагментация, reassembly, неоднозначность представлений и шифрование рассматриваются только как инженерные причины, по которым наблюдаемое событие, данные сенсора и решение детектора могут расходиться.

Связь с силлабусом: шифрование, безопасность сетевых протоколов, приложений, веб-сервисов и антивирусная/проактивная защита объединены темой **границ наблюдаемости**. AV/EDR рассматривается как возможный дополнительный хостовый источник/контроль, а не автоматически как HIDS.
