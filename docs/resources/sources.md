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


## Реальные случаи, разобранные в главах

- **Log4Shell (Главы 1 и 6)** — CISA/FBI/NSA и международные партнёры, AA21-356A: https://www.cisa.gov/news-events/cybersecurity-advisories/aa21-356a
- **Microsoft Exchange / HAFNIUM (Глава 2)** — Microsoft Security:
  - https://www.microsoft.com/en-us/security/blog/2021/03/02/hafnium-targeting-exchange-servers/
  - https://www.microsoft.com/en-us/security/blog/2021/03/25/analyzing-attacks-taking-advantage-of-the-exchange-server-vulnerabilities/
- **Insertion/Evasion и TCP reassembly (Глава 3)** — Ptacek & Newsham, CERIAS/Purdue: https://www.cerias.purdue.edu/apps/reports_and_papers/view/1397
- **SolarWinds / SUNBURST (Глава 4)** — Microsoft Security и CISA:
  - https://www.microsoft.com/en-us/security/blog/2021/01/20/deep-dive-into-the-solorigate-second-stage-activation-from-sunburst-to-teardrop-and-raindrop/
  - https://www.cisa.gov/news-events/alerts/2020/12/13/active-exploitation-solarwinds-software
- **Target 2013 (Глава 5)** — U.S. Senate Committee on Commerce: https://www.govinfo.gov/content/pkg/CHRG-113shrg92594/pdf/CHRG-113shrg92594.pdf
- **CISA Red Team Assessment (Глава 7)** — CISA AA23-059A: https://www.cisa.gov/news-events/cybersecurity-advisories/aa23-059a
- **Lateral movement: monitoring and segmentation guidance (Глава 7)** — CISA/FBI/NSA: https://www.cisa.gov/news-events/alerts/2022/01/11/understanding-and-mitigating-russian-state-sponsored-cyber-threats-us-critical-infrastructure

Принцип использования кейсов: реальный инцидент или инженерное исследование включается в главу только тогда, когда он демонстрирует конкретный механизм курса. Кейсы не используются как отдельные «истории ради истории».


## Suricata — ЛР №1

Для команд и формата первой лабораторной используются официальные материалы OISF:

- Suricata User Guide — Quickstart: https://docs.suricata.io/en/latest/quickstart.html
- Adding Your Own Rules: https://docs.suricata.io/en/latest/rule-management/adding-your-own-rules.html
- EVE JSON Output: https://docs.suricata.io/en/latest/output/eve/eve-json-output.html
- EVE JSON Format: https://docs.suricata.io/en/latest/output/eve/eve-json-format.html

На дату аудита 09.09.2026 официальный stable release — **Suricata 8.0.6 (07.07.2026)**; ветка Suricata 7 объявлена EOL. В лаборатории студент всё равно фиксирует фактически установленную версию через `suricata --build-info`, поскольку учебные среды могут обновляться.


## Detection Engineering — Глава 8 и ЛР №2

Основные технические reference:

- Suricata Rules Format — https://docs.suricata.io/en/latest/rules/intro.html
- Suricata Flow Keywords — https://docs.suricata.io/en/latest/rules/flow-keywords.html
- Suricata HTTP Keywords — https://docs.suricata.io/en/latest/rules/http-keywords.html
- Suricata Payload Keywords / PCRE — https://docs.suricata.io/en/latest/rules/payload-keywords.html
- Suricata Fast Pattern — https://docs.suricata.io/en/latest/rules/fast-pattern-explained.html
- Suricata Thresholding Keywords — https://docs.suricata.io/en/latest/rules/thresholding.html
- OISF suricata-verify — https://github.com/OISF/suricata-verify
- suricata-update Quick Start / Emerging Threats Open — https://github.com/OISF/suricata-update/blob/master/doc/quickstart.rst

Методика ЛР №2 использует идею воспроизводимого detection test: входной traffic corpus + rule + ожидаемый EVE result. Мы не копируем suricata-verify целиком, а переносим его инженерный принцип в более прозрачную учебную форму.
