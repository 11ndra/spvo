# Источники курса

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
