# 5. Качество детектирования

| Реальность | Система сработала | Система не сработала |
|---|---|---|
| Угроза присутствует | True Positive | False Negative |
| Угрозы нет | False Positive | True Negative |

## False Positive

Для IDS ложное срабатывание может означать лишний alert.

Для IPS последствия серьёзнее:

```text
False Positive
      ↓
automatic block
      ↓
legitimate service unavailable
```

## False Negative

Угроза существует, но детектор её не обнаружил.

## Главное инженерное противоречие

Слишком широкое правило повышает риск FP.

Слишком узкое правило повышает риск FN.

Цель detection engineering — не максимальное количество alerts, а полезная и проверяемая детекция.
