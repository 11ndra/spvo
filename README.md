# IDPS Course — GitHub Pages starter

Стартовый каркас интерактивного курса «Системы обнаружения и предотвращения вторжений».

## Локальный запуск

```bash
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
mkdocs serve
```

Windows PowerShell:

```powershell
python -m venv .venv
.venv\Scripts\Activate.ps1
pip install -r requirements.txt
mkdocs serve
```

## Публикация

1. Создайте GitHub repository.
2. Загрузите проект в ветку `main`.
3. Откройте `Settings → Pages`.
4. В `Build and deployment → Source` выберите `GitHub Actions`.
5. Push в `main` запустит workflow публикации.

## Следующий этап

- доработать главную;
- завершить пять базовых блоков;
- добавить Pre-Lab Test №1;
- начать LabBox.
