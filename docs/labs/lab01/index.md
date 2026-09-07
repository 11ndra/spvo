# Лабораторная работа №1

## Основы IDS/IPS и первое знакомство с Suricata

<div class="lab-header"><div><strong>Уровень:</strong> вводный</div><div><strong>Инструмент:</strong> Suricata</div><div><strong>Среда:</strong> IDPS LabBox</div></div>

## Результат обучения

После выполнения работы студент должен уметь объяснить назначение IDS и IPS, определить место NIDS в сети, установить Suricata, выполнить базовую конфигурацию, наблюдать нормальный трафик, создать правило, получить alert и найти событие в `eve.json`.

## Архитектура LabBox

```text
Client namespace
192.168.50.10
      ↓
Suricata Sensor
      ↓
Target namespace
192.168.50.20
```

## План практической части

1. Проверка среды.
2. Установка Suricata.
3. Настройка `HOME_NET`.
4. Нормальный HTTP baseline.
5. Первое пользовательское правило `/lab-test`.
6. Первый alert и `eve.json`.
7. Реалистичный безопасный Path Traversal pattern.
8. IDS → IPS.
9. Первый False Positive.

!!! warning "Статус"
    Практическая инструкция будет опубликована после сборки первой версии LabBox. Теоретическая подготовка и Pre-Lab Test уже готовы.
