# Troubleshooting

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

## GitHub Desktop

```text
Changes → Commit to main → Push origin
```

После push дождитесь успешного workflow `Deploy GitHub Pages`.
