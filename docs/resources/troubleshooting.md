# Troubleshooting

## Локальный запуск сайта

```bash
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
mkdocs serve
```

## Проверка сборки

```bash
mkdocs build --strict
```

## GitHub Pages не публикуется

1. Откройте `Settings → Pages`.
2. В `Build and deployment → Source` выберите **GitHub Actions**.
3. Проверьте последний workflow во вкладке `Actions`.
4. Посмотрите лог шага `mkdocs build --strict`.

## LabBox

Раздел будет дополнен после фиксации первой версии виртуальной лаборатории.
