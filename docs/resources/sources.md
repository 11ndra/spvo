# Источники курса

!!! info "Source policy после аудита 09.09.2026"
    Курс использует принцип **primary sources first**. Технический факт по возможности опирается на стандарт, официальную документацию проекта, первичный/близкий к первичному incident report или исследовательскую публикацию. Наши архитектурные выводы маркируются как инженерные рекомендации, а созданные нами топологии, PCAP и сценарии — как synthetic teaching material. Подробная трассировка находится в [Реестре источников и проверок](evidence-register.md).

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

Linux Audit в ЛР №2 используется только для демонстрации различий телеметрии. Лабораторная не утверждает, что Linux Audit сам по себе является полноценной HIDS-платформой.

## Глава 4 — размещение и точки наблюдения

Основные основания новой Главы 4:

- NIST SP 800-94 — исторический фундаментальный источник по network-based IDPS architecture: выбор места сенсоров, passive/inline deployment, network tap и switch spanning port как варианты подключения пассивных сенсоров.
- William Stallings, *Computer Security: Principles and Practice* — учебное описание passive NIDS, inline NIDS/IPS и типовых мест размещения.

В главе сознательно не делается универсального вывода «до firewall лучше, чем после» или наоборот. Полезность точки определяется тем, какой набор сетевых событий требуется наблюдать для конкретной задачи.

## ЛР №3 — точка наблюдения

ЛР №3 использует синтетический двухмашинный стенд курса:

- `idps-client` — `10.13.37.10/24`;
- `idps-server` — `10.13.37.20/24`;
- отдельный NAT-интерфейс;
- отдельный интерфейс учебной сети `IDPS-LAB`.

Одинаковое правило Suricata запускается поочерёдно на двух интерфейсах. Журнал учебного web-сервиса используется как независимое подтверждение существования контролируемого запроса. Ожидаемый end-to-end результат имеет статус `RUNTIME QA REQUIRED` до прогона на эталонных Ubuntu 24.04.x VM.

- OISF: Suricata 8.0.7 release — https://suricata.io/2026/09/15/suricata-8-0-7-released/
- OISF: Suricata 8.0.7 configuration / checksum validation — https://docs.suricata.io/en/suricata-8.0.7/configuration/suricata-yaml.html

## Глава 5 — методы обнаружения

Основные основания новой Главы 5:

- NIST SP 800-94, Section 2.3 — исторический фундаментальный источник по трём классическим методам: signature-based detection, anomaly-based detection и stateful protocol analysis.
- NIST SP 800-94 отдельно отмечает, что реальные network-based IDPS могут сочетать эти методы и что границы терминов в разных публикациях отличаются.
- Suricata 8.0.7 HTTP Keywords — практический пример того, что сигнатурное условие может применяться не к сырым байтам, а к разобранному полю HTTP (`http.uri`).
- Suricata Thresholding Keywords — пример того, как реальный движок может выражать частотное условие; синтаксис правил будет изучаться в Главе 6.

Ссылки:

- NIST SP 800-94 — https://csrc.nist.gov/pubs/sp/800/94/final
- Suricata 8.0.7 HTTP Keywords — https://docs.suricata.io/en/suricata-8.0.7/rules/http-keywords.html
- Suricata Thresholding Keywords — https://docs.suricata.io/en/suricata-8.0.6/rules/thresholding.html

Термин «поведенческая логика» в курсе используется как **инженерское описание условия над последовательностью, частотой или связью событий**, а не как четвёртый официальный метод NIST. Поведенческое условие может быть детерминированным и не использовать baseline; поэтому оно не приравнивается к anomaly-based detection.

## ЛР №4 — разные основания обнаружения

ЛР №4 намеренно отделяет принцип решения от конкретного движка IDS. Учебный HTTP-сервис записывает все события в один JSONL-журнал, а `detectors.py` применяет к **этому же формату данных** три прозрачных условия:

- сигнатурное — наличие заданного маркера в `uri`;
- поведенческое — не менее пяти событий одного типа от одного источника за десять секунд;
- аномалийное — отклонение `value_length` от построенной в лабораторной базовой линии.

`detectors.py` является **SYNTHETIC COURSE MODEL**, а не реализацией промышленной IDS. Такое решение выбрано специально: в Главе 5 студент должен увидеть различие методов без одновременного изменения источника данных и без преждевременного изучения синтаксиса Suricata. Перевод условий в реальные правила начинается в Главе 6.

Полный сценарий с двумя VirtualBox VM сохраняет статус `RUNTIME QA REQUIRED` до end-to-end прогона на эталонных Ubuntu Desktop/Server 24.04.x.
