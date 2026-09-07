# IDPS Course

Интерактивный учебный портал по дисциплине «Системы обнаружения и предотвращения вторжений».

## GitHub Desktop workflow

1. Внести изменения.
2. Проверить **Changes**.
3. Commit to `main`.
4. **Push origin**.
5. Дождаться `Deploy GitHub Pages`.

## Roadmap
- [x] GitHub Pages
- [x] Базовый модуль IDPS
- [x] Pre-Lab Test №1
- [ ] LabBox v0.1
- [ ] ЛР №1 — Suricata
- [ ] Scenario Engine


## v2.1 — UI stabilization

- исправлен контраст кастомных блоков в светлой и тёмной темах;
- карточки больше не используют полупрозрачную авто-смешанную палитру;
- улучшена читаемость Pre-Lab Test;
- добавлены hover/focus состояния;
- подготовлены CSS-классы для изображений, схем и подписей;
- создана структура `docs/assets/images/` для визуального контента.


## v2.2 — Visual & Interactive Documentation

- Mermaid diagrams enabled through Material for MkDocs native integration.
- Code annotations enabled.
- Pygments code highlighting explicitly configured.
- Visual diagrams added to:
  - IDS vs IPS
  - IDPS classification
  - Detection pipeline
  - Firewall / Defense-in-Depth
  - Sensor placement
  - LabBox topology
- Role-based content tabs added to Lab №1.
- Visual authoring guide added.


## v2.3 — Teaching-first rewrite

Переписаны все опубликованные базовые темы по единому педагогическому шаблону:

- проблема / реальная ситуация;
- зачем технология нужна;
- как работает под капотом;
- что реально настраивается;
- сильные и слабые стороны;
- профессиональный контекст;
- интерактивная самопроверка;
- связь со следующей темой и LabBox.

Цель v2.3 — уйти от формата «справочник терминов» к объяснению причинно-следственных связей.

## v2.4 — Exemplar Chapter 1

Полностью переработана только первая глава как эталон для будущего курса:

- связный учебный текст вместо конспекта;
- термины вводятся после объяснения проблемы;
- общие принципы раньше конкретных продуктов;
- интерактивная CSS/JS-анимация IDS ↔ IPS;
- профессиональный контекст;
- единая русско-английская терминология;
- инструменты курса вынесены в отдельный прикладной раздел.
