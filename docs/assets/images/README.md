# Visual assets

Рекомендуемая структура:

- `diagrams/` — SVG-схемы процессов и архитектуры;
- `topologies/` — сетевые топологии;
- `screenshots/` — Wireshark, Suricata, Wazuh и т.п.;
- `gifs/` — короткие учебные анимации;
- `icons/` — локальные иконки, если они понадобятся.

## Рекомендуемые форматы

- Диаграммы: **SVG**
- Скриншоты: **WebP/PNG**
- Короткие анимации: **GIF/WebP**

## Пример вставки

```html
<div class="course-figure">
  <img src="../assets/images/diagrams/ids-vs-ips.svg" alt="Сравнение IDS и IPS">
  <div class="course-caption">Сравнение пассивного обнаружения и inline-предотвращения.</div>
</div>
```
