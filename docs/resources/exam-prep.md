# Подготовка к устному экзамену: 90 вопросов по IDS/IPS

Эта страница построена по официальному перечню экзаменационных вопросов дисциплины. Она не заменяет главы курса: её задача — помочь проверить, можете ли вы **связно ответить устно**, а не только узнать термин.

Для каждого ответа используйте одинаковый каркас:

```text
определение → механизм → пример → ограничение / риск → связь с evidence
```

## Вопросы 1–15: основы IDS/IPS и сигнатуры

1. **Что такое IDS?** Система/функция обнаружения подозрительной активности на основе доступной телеметрии; результатом может быть событие/alert, а не автоматическое доказательство атаки. См. Главу 1.
2. **Основные типы IDS.** NIDS/NIPS, HIDS/HIPS, WIDS/WIPS, NBA в классической модели; тип источника не равен методу обнаружения. См. Главу 2.
3. **Плюсы/минусы сигнатурного метода.** Точность для известных признаков и объяснимость против ограниченного покрытия новых/изменённых проявлений и необходимости сопровождения. См. Главу 5.
4. **Что такое IPS?** Detection + policy/decision + enforcement + verification. См. Главы 1, 3, 8.
5. **IDS vs IPS.** IDS не обязана быть только пассивной, IPS не определяется одной сигнатурой; ключевой отличительный элемент IPS — предотвращающее воздействие и проверка результата. См. Главу 1.
6. **Примеры IPS в корпоративной сети.** Inline NIPS на критическом пути, HIPS на сервере, интеграция с NGFW/сетевой политикой. См. Главы 1, 4, 8.
7. **Принципы NIDS.** Получение сетевой активности → реконструкция/представление → detection logic → событие/alert → хранение/реакция. См. Главы 2–4.
8. **Методы обнаружения.** Сигнатуры, stateful protocol analysis, fixed-series conditions, anomaly, heuristics/behavioral combinations. См. Главы 5 и 8A.
9. **Как IDS реагирует?** Логирование, alert, передача в SIEM/IR; некоторые реализации могут инициировать действие, но реакция и detection — разные функции. См. Главы 1 и 3.
10. **Что такое HIDS?** Хостовая система, наблюдающая телеметрию конкретного узла. См. Главу 2.
11. **Задачи HIDS.** Контроль файлов/конфигураций, процессов, журналов, локальных событий и иных host-level следов. См. Главы 2 и 09b.
12. **Примеры HIDS.** Wazuh/OSSEC как примеры хостового мониторинга; EDR также использует endpoint telemetry, но не равен HIDS. См. 09b.
13. **Что такое сигнатура?** Формализованный известный признак/условие сопоставления. См. Главы 5–6.
14. **Плюсы/минусы сигнатурного анализа.** См. вопрос 3 и Главу 5.
15. **Почему обновлять сигнатуры?** Меняются угрозы, протоколы и окружение; устаревший detection content увеличивает FN и может ломаться после изменений. См. Главы 6 и 10.

## Вопросы 16–30: anomaly, ML, DIDS, логи и confidence

16. **Что такое аномалия?** Отклонение от определённой модели/baseline, а не синоним атаки. См. Главу 5.
17. **Плюсы/минусы anomaly detection.** Возможность замечать неизвестные отклонения против FP, drift и зависимости от качества baseline. См. Главы 5, 7, 8.
18. **Пример anomaly detection.** Резкое изменение частоты запросов относительно baseline. См. ЛР №4 и Главу 5.
19. **Какими методами осуществляется обучение IDS?** Для anomaly/ML: supervised, unsupervised, semi-supervised и baseline/statistical approaches; не каждая IDS обучается ML. См. 8A.
20. **Проблемы ложных срабатываний.** Неверная область правила, плохой baseline, недостаточный контекст, изменение нормального поведения. См. Главы 7–8.
21. **Роль ML.** Классификация, clustering, anomaly scoring, приоритизация; результат требует ground truth и проверки. См. 8A.
22. **Что такое DIDS?** Несколько сенсоров/агентов + центральный анализ/управление. См. 8A.
23. **Взаимодействие DIDS.** Передача событий, синхронизация времени, общие схемы/идентификаторы, централизованное управление и корреляция. См. 8A и Главу 11.
24. **Какие атаки легче обнаружить DIDS?** Многоэтапные и распределённые сценарии, затрагивающие разные сегменты/узлы. См. 8A/11.
25. **Что такое журналирование IDS?** Фиксация наблюдений и результатов для поиска, расследования и корреляции. См. 8A/3.
26. **Как использовать логи IDS?** Фильтровать по времени/flow/rule, сопоставлять с ground truth и другими источниками, восстанавливать timeline. См. Главы 3, 8, 11.
27. **ПО для логов.** Elastic Stack, Splunk, OpenSearch, Graylog, SIEM-платформы; продукт не меняет происхождение evidence. См. 8A.
28. **Что содержит событие IDS?** Время, src/dst, protocol, rule/signature, category, action, app-layer fields, flow/transaction IDs и др. См. 8A.
29. **Распространённые события IDS.** Alert на сигнатуру, protocol anomaly, scan/burst, policy violation, host integrity event и т. п. См. Главы 3, 5, 8A.
30. **Confidence.** Product-specific оценка уверенности; не равна автоматически вероятности компрометации. См. 8A.

## Вопросы 31–45: эвристика, payload, DPI, evasion, threat intelligence, Zero-Day

31. **Эвристический анализ.** Решение по набору признаков/правил вывода, не обязательно по одной известной сигнатуре. См. 8A/09b.
32. **Эвристика vs сигнатура.** Сигнатура ищет известный признак; эвристика оценивает комбинацию свойств/поведения. См. 8A.
33. **Пример эвристики.** Комбинация подозрительного поведения процесса/файла без точного hash/signature. См. 09b/8A.
34. **Payload.** Данные относительно конкретного протокольного уровня; термин зависит от уровня анализа. См. 8A/9.
35. **Как IDS анализирует трафик?** Capture → flow/stream reconstruction → protocol parsing → representation → detector. См. Главы 3, 5, 9.
36. **Роль DPI.** Предоставляет более глубокое протокольное/содержательное представление для detection logic; не является гарантией обнаружения. См. Главы 1, 3, 8A.
37. **Скрытые каналы.** Передача данных через разрешённые/неочевидные поля, timing или протоколы способом, не соответствующим обычному назначению. См. 8A.
38. **Методы маскировки.** Обфускация, fragmentation/segmentation, encoding, encryption/tunneling, slow/distributed behavior. См. 8A/7/9.
39. **Как IDS обнаруживает evasion?** Reassembly, normalization, app-layer parsing, multi-source correlation и semantic detection. См. 7, 8A, 9, 11.
40. **Threat intelligence.** Контекст об угрозах, индикаторах, инфраструктуре, TTP и связях. См. 11/8A.
41. **Использование TI в IDS/IPS.** IOC feeds, enrichment, prioritization, rule creation, correlation. См. 8A/11.
42. **Платформы TI.** MISP и OpenCTI как примеры платформ управления/обмена threat intelligence. См. 8A.
43. **Zero-Day.** Уязвимость/атака, для которой может отсутствовать доступная сигнатура/исправление на момент использования. См. 8A.
44. **Как IDS может обнаружить Zero-Day?** По поведению, anomaly, protocol violation, heuristics и другим проявлениям, а не «зная неизвестную CVE». См. 8A.
45. **Эвристика/AI при Zero-Day.** Могут искать неизвестные комбинации, но не отменяют FP/FN и необходимость валидации. См. 8A.

## Вопросы 46–60: IPS, SIEM, стандарты, шифрование и политики

46. **Уровни реагирования IPS.** Удобно объяснять как степень воздействия: регистрация → оповещение/передача контекста → ограниченное автоматическое действие → непосредственное enforcement. Это учебная модель, а не универсальная шкала производителя; чем сильнее воздействие, тем выше цена FP. См. 8A и Главу 8.
47. **Автоматические действия IPS.** Drop/reject/reset, host-level block, quarantine/policy change через интеграцию. См. Главы 1, 6, 8A.
48. **Плюсы/риски автоматического блокирования.** Скорость реакции против FP-driven outage и риска ошибочного enforcement. См. Главы 1, 8.
49. **IDS/IPS + SIEM.** IDS генерирует специализированную телеметрию/alerts; SIEM собирает и коррелирует её с другими источниками. См. 3, 8A, 11.
50. **Пример совместного использования.** Suricata alert + endpoint login + asset criticality → SIEM correlation. См. 8A/11.
51. **Автоматизация IR через SIEM.** Correlation rule → case/notification/playbook → контролируемое действие/SOAR; нужна проверка и rollback. См. 8A/10/11.
52. **IDS/IPS и стандарты, например PCI DSS.** IDS/IPS может быть требуемым/поддерживающим контролем; нужно доказать placement, monitoring, alerting и актуальность detection content. См. 8A.
53. **Примеры стандартов/документов.** Прямой пример — PCI DSS v4.0.1 Requirement 11.5.1, где intrusion-detection/prevention techniques названы явно. NIST SP 800-53 SI-4 задаёт системный мониторинг и связанные control enhancements; NIST SP 800-94 — инженерное руководство по IDPS. ISO/IEC 27001 — риск-ориентированный ISMS-стандарт и не должен пересказываться как универсальное требование «обязательно установить IDS». См. 8A/09c.
54. **IDS/IPS и персональные данные.** Помогает обнаруживать подозрительную активность и поддерживать monitoring, но не заменяет access control, legal basis, encryption, minimization и governance. См. 8A.
55. **Роль криптографии в IDS.** Защищает каналы/данные, но меняет доступную сенсору видимость; ключи/termination point определяют observation. См. Главу 9.
56. **Как IDS работает с шифрованным трафиком?** Видит доступные metadata/handshake/flow features либо получает decrypted representation на другой точке. См. 9.
57. **Методы анализа encrypted traffic.** Metadata/flow analytics, TLS fingerprints/handshake fields, decryption at controlled point, endpoint/app telemetry. См. 9.
58. **Управление политиками IDS/IPS.** Управление scope, active rules, exceptions, actions, outputs и response policy. См. 3, 8A, 10.
59. **Примеры политик.** Different rule sets by segment, alert-only vs block, exceptions, retention, SIEM forwarding. См. 8A.
60. **Риски неправильной политики.** FP/FN, outage, blind spots, overload, inconsistent controls. См. 8A/10.

## Вопросы 61–75: EDR, атаки, корреляция, архитектура и интеграция

61. **Что такое EDR?** Endpoint Detection and Response — endpoint telemetry + detection/investigation/response capabilities. См. 09b.
62. **EDR vs IDS.** EDR ориентирован на endpoint context; IDS может быть network/host и шире как класс. См. 09b/2.
63. **Как дополняют друг друга?** Network evidence + process/user/file evidence дают более сильный контекст. См. 09b/11.
64. **Сетевые атаки, хорошо обнаруживаемые IDS.** Scanning, exploit signatures, protocol violations, known C2/IOC traffic, suspicious bursts — при наличии visibility и подходящего detector. См. 5, 7, 8A.
65. **DDoS detection.** Rate/volume/distribution/baseline + availability metrics; alert IDS не доказывает, что сервис недоступен. См. 09a/5/8.
66. **MITM и IDS.** IDS может обнаруживать отдельные признаки (ARP/DNS/certificate/network anomalies), но основная защита требует authentication + cryptographic channel; IDS не «устраняет MITM» сама. См. 09a/9.
67. **Корреляция событий.** Проверяемое связывание событий по времени, identity, flow, sequence или другим ключам. См. 3/11.
68. **Пример корреляции.** Network exploit alert + successful login + suspicious process on endpoint. См. 11.
69. **Автоматизация корреляции.** SIEM correlation rules, pipelines, graph/sequence logic; результат всё равно требует validation. См. 11/8A.
70. **Архитектура современной IDS.** Sensors/agents → processing/detection → management/storage → console/integration; может быть distributed/cloud. См. 3/8A.
71. **Основные компоненты.** Сенсор/агент, management, event storage, console, detection logic, outputs/integrations. См. 3.
72. **Открытые и коммерческие IDS.** Suricata и Snort — прямые примеры открытых сетевых IDS/IPS; Zeek и Wazuh полезны как соседние открытые технологии сетевой/хостовой телеметрии и не должны называться их полными аналогами. Коммерческие IDS/IPS-функции часто встроены в NGFW/NDR/XDR и специализированные платформы. См. 8A.
73. **Интеграция с другими защитными системами.** Firewall, EDR, SIEM/SOAR, TI, IAM, ticketing. См. 8A/11.
74. **Преимущества интеграции.** Context, correlation, automation, centralized visibility. См. 8A.
75. **Проблемы совместимости.** Schemas, IDs, timestamps, APIs, severity/confidence semantics, duplicates, versions. См. 8A/11.

## Вопросы 76–90: эффективность, режимы, ограничения, масштабирование и развитие

76. **Метрики эффективности.** TP/FP/TN/FN, precision, recall/TPR, FPR, coverage, latency, throughput/loss. См. Главу 8.
77. **Точность обнаружения.** Только через independent ground truth и определённую метрику; «сколько alerts» не равно accuracy. См. 8.
78. **Роль производительности.** Потеря пакетов/очереди/latency меняют фактическую detection capability. См. 8/10.
79. **Активная vs пассивная IDS.** Пассивная наблюдает/оповещает; активная инициирует действие. Это описание поведения, не универсальная продуктовая taxonomy. См. 8A/4.
80. **Плюсы активного подхода.** Быстрая реакция и снижение dwell time при достаточно надёжном условии. См. 8A/8.
81. **Когда пассивный режим предпочтителен?** Высокая цена FP, monitoring/investigation, невозможность безопасного inline/enforcement. См. 4/8A.
82. **FP и FN.** FP — detector сообщает positive при отрицательном ground truth; FN — пропускает positive. См. 7/8.
83. **Причины FP.** Broad rule, incomplete context, baseline drift, ambiguous protocol, legitimate behavior resembling attack. См. 7.
84. **Как уменьшать FP.** Better scope/context, tuning, negative/boundary tests, independent ground truth, regression testing. См. 6/8/10.
85. **Ограничения IDS.** Visibility, encryption, packet loss, ambiguous parsing, incomplete context, FP/FN, operational drift. См. 7.
86. **Масштабируемость.** Throughput, telemetry volume, distributed sensors, configuration consistency, east-west/cloud traffic. См. 8A/10.
87. **Эффективное внедрение IDS.** Задача и риск → требуемая видимость → observation points → architecture/capacity → policy/detection content → staged deployment → positive/negative/boundary testing → monitoring → lifecycle. См. 4/8/8A/10.
88. **Тенденции IDS/IPS.** Multi-source telemetry, cloud, endpoint/network correlation, TI, detection engineering, ML, SOAR/XDR. См. 8A/11.
89. **Будущая роль IDS.** Переход от одиночного alert к проверяемой detection capability и multi-source evidence. См. 8A/10/11.
90. **Облака и IoT.** Cloud-native telemetry/ephemeral workloads и IoT constraints/nonstandard protocols меняют observation points и deployment. См. 8A.

## Как проверить себя перед экзаменом

Для каждого вопроса ответ считается подготовленным, если вы можете без подсказки:

1. дать определение одним-двумя предложениями;
2. объяснить механизм;
3. привести корректный пример;
4. назвать хотя бы одно ограничение или риск;
5. не делать вывод сильнее имеющегося evidence.
