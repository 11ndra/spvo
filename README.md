# Системы обнаружения и предотвращения вторжений (IDPS)

Репозиторий университетского курса по дисциплине «Системы обнаружения и предотвращения вторжений».

Учебный портал: https://11ndra.github.io/spvo/

## Структура репозитория

- `docs/` — страницы курса и лабораторных работ;
- `docs/assets/downloads/` — учебные пакеты для лабораторных работ;
- `docs/assets/stylesheets/` и `docs/assets/javascripts/` — стили и интерактивные элементы;
- `mkdocs.yml` — конфигурация и навигация MkDocs;
- `tools/` — проверки исходных материалов и сборки;
- `.github/workflows/` — автоматическая сборка и публикация GitHub Pages.

## Локальная проверка

```bash
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt

python tools/check_public_boundary.py
python tools/check_source_consistency.py
mkdocs build --strict
python tools/check_site_links.py site
```

Для Windows PowerShell:

```powershell
.\.venv\Scripts\Activate.ps1
```

Для локального просмотра:

```bash
mkdocs serve
```
