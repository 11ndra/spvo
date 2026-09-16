# QA RELEASE GATE — IDPS Course

Этот файл задаёт обязательный порядок проверки перед любым утверждением «релиз готов», «аудит достаточен» или «можно переходить к следующему блоку».

## Правило остановки

Если обнаружено противоречие между `PROJECT_HANDOFF.md`, `mkdocs.yml`, student-facing материалами, laboratory bundle или фактическим поведением стенда, разработка следующей главы останавливается до фиксации решения.

Проверка только файловой целостности не считается достаточным QA курса.

## Gate 1 — Source of truth / consistency

Проверить:

- текущую стабильную версию в `PROJECT_HANDOFF.md`;
- следующий шаг разработки;
- `mkdocs.yml` и фактические файлы;
- номера глав, лабораторных и bundle;
- README и handoff;
- отсутствие конфликтующих legacy-материалов в student-facing `docs/`;
- отсутствие устаревших downloads в публикуемом `docs/assets/downloads/`.

Результат: нет противоречий состояния проекта.

## Gate 2 — Дидактическая согласованность

Для каждой активной лаборатории проверить:

1. Что студент уже изучил до неё?
2. Какой новый факт он должен экспериментально установить?
3. Не требует ли инструкция понятия, которое будет объяснено только позже?
4. Что изменяется в эксперименте?
5. Какие артефакты подтверждают результат?
6. Что из них заключать нельзя?
7. Не подменяется ли принцип продукта конкретным интерфейсом/командой?

Обязательная модель:

```text
теория → понятный пример → схема → проверяемый вывод → лабораторное закрепление
```

## Gate 3 — Student-facing UX

Проверить как студент, а не как автор:

- понятно ли, с чего начинать;
- понятен ли единственный следующий шаг;
- нет ли developer-only статусов (`DESIGN VERIFIED`, `STATIC QA PASSED`, `RUNTIME QA REQUIRED`) на студенческих страницах;
- нет ли служебных audit/evidence материалов в публичной навигации;
- нет ли legacy-страниц в GitHub Pages;
- нет ли случайных наборов кнопок вместо маршрута;
- команды сопровождаются «что / зачем / ожидаемый результат / допустимый вывод»;
- терминология соответствует уровню студента и языковой политике курса.

## Gate 4 — Technical static QA

Проверить:

- YAML parsing `mkdocs.yml`;
- существование всех nav targets;
- все локальные Markdown/HTML `href` и `src`;
- актуальность bundle links;
- ZIP/TAR integrity;
- `bash -n` для shell;
- Python compile для Python;
- `node --check` для JS;
- отсутствие stale version strings в активных страницах;
- permissions/paths/systemd assumptions;
- shell variables между терминалами;
- network interfaces/routes;
- offloading/checksum assumptions;
- service state;
- stale logs/output directories;
- required package versions.

Статус после этого gate: `STATIC QA PASSED` только во внутренних материалах.

## Gate 5 — GitHub Pages build QA

Проверить именно результат публикации:

1. `mkdocs build --strict`;
2. структуру `site/`;
3. каждый внутренний `href/src` относительно `site_url`/project path;
4. доступность JS/CSS/images/downloads;
5. отсутствие ссылок на непубликуемые internal/legacy материалы;
6. работу на desktop и narrow viewport;
7. отсутствие case-sensitive path errors;
8. проверку через локальный HTTP preview, а не `file://`.

Если инструменты сборки недоступны, gate получает статус `NOT EXECUTED`, а не «пройден».

## Gate 6 — Runtime laboratory QA

Для каждой лаборатории end-to-end пройти студенческую инструкцию на эталонных Ubuntu/VirtualBox VM.

Проверить минимум:

```text
чистая/эталонная среда
→ setup
→ preflight
→ scenario
→ evidence collection
→ expected output
→ negative case
→ cleanup/re-run
```

Нельзя повышать статус до `RUNTIME VERIFIED` по результатам syntax check, component simulation или чтения документации.

Если runtime не выполнен: `RUNTIME QA REQUIRED` во внутренних QA-материалах.

## Definition of Done

Релиз можно назвать готовым для студентов только когда:

- Gates 1–4 пройдены;
- Gate 5 пройден для GitHub Pages;
- для лабораторий, которые реально выдаются студентам, Gate 6 пройден либо преподаватель явно принимает риск `RUNTIME QA REQUIRED` до занятия.

При последнем варианте это фиксируется как известный release risk, а не скрывается.
