# Как добавить изображения на сайт

## 📁 Структура папок для изображений

Рекомендуемая структура:
```
images/
├── hero/
│   └── hero-main.jpg          # Главное изображение Hero-блока
├── technology/
│   ├── step-1-foundation.jpg   # Этап 1: Фундаментная плита
│   ├── step-2-printing.jpg     # Этап 2: Печать контуров
│   ├── step-3-reinforcement.jpg # Этап 3: Армирование
│   ├── step-4-communications.jpg # Этап 4: Коммуникации
│   ├── step-5-foam-concrete.jpg # Этап 5: Пенобетон
│   └── step-6-facade.jpg       # Этап 6: Готовый фасад
├── advantages/
│   ├── monolithic.jpg          # Монолитная конструкция
│   ├── insulation.jpg          # Тепло- и звукоизоляция
│   ├── architecture.jpg        # Архитектурная свобода
│   ├── speed.jpg               # Скорость строительства
│   ├── communications.jpg      # Коммуникации внутри стен
│   ├── automation.jpg          # Минимизация человеческого фактора
│   └── cost.jpg                # Низкая стоимость
├── readiness/
│   ├── level-1-box.jpg         # Уровень 1: Коробка
│   ├── level-2-warm.jpg        # Уровень 2: Теплый контур
│   ├── level-3-whitebox.jpg   # Уровень 3: WhiteBox
│   ├── level-4-full.jpg        # Уровень 4: Полная отделка
│   ├── style-modern.jpg        # Стиль: Современный минимализм
│   ├── style-classic.jpg       # Стиль: Классика
│   ├── style-scandinavian.jpg  # Стиль: Скандинавский
│   └── style-loft.jpg          # Стиль: Лофт
├── projects/
│   ├── project-1/
│   │   ├── main.jpg            # 3D-план
│   │   ├── floor-1.jpg         # 1 этаж
│   │   ├── facade-1.jpg        # Фасад вариант 1
│   │   ├── facade-2.jpg        # Фасад вариант 2
│   │   └── roof.jpg            # Кровля
│   ├── project-2/
│   │   └── ...                 # Аналогично
│   └── project-5/
│       └── ...
└── custom/
    ├── design.jpg              # Чертеж
    ├── foundation.jpg          # Фундамент
    ├── printing.jpg            # 3D-печать
    └── finished.jpg            # Готовый дом
```

## 🔧 Как заменить placeholder'ы

### 1. Главная страница (index.html)

#### Hero-блок (главное изображение)

**Найти:**
```html
<div class="hero-image-placeholder">
    <p>Изображение: Чертеж → 3D-печать → Готовый дом</p>
</div>
```

**Заменить на:**
```html
<img src="images/hero/hero-main.jpg" 
     alt="Процесс строительства: от чертежа до готового дома" 
     class="hero-image">
```

#### Быстрые ссылки (3 изображения)

**Найти:**
```html
<div class="link-image-placeholder">
    <p>Технология</p>
</div>
```

**Заменить на:**
```html
<img src="images/technology/step-1-foundation.jpg" 
     alt="Технология строительства" 
     class="link-image">
```

---

### 2. Раздел "Технология" (technology.html)

**Найти каждый:**
```html
<div class="step-image-placeholder">
    <p>Фундаментная плита</p>
</div>
```

**Заменить на:**
```html
<img src="images/technology/step-1-foundation.jpg" 
     alt="Фундаментная плита" 
     class="step-image">
```

**Для всех 6 этапов:**
- Этап 1: `images/technology/step-1-foundation.jpg`
- Этап 2: `images/technology/step-2-printing.jpg`
- Этап 3: `images/technology/step-3-reinforcement.jpg`
- Этап 4: `images/technology/step-4-communications.jpg`
- Этап 5: `images/technology/step-5-foam-concrete.jpg`
- Этап 6: `images/technology/step-6-facade.jpg`

---

### 3. Раздел "Преимущества" (advantages.html)

**Найти:**
```html
<div class="advantage-image-placeholder">
    <p>Монолитная конструкция</p>
</div>
```

**Заменить на:**
```html
<img src="images/advantages/monolithic.jpg" 
     alt="Монолитная конструкция" 
     class="advantage-image">
```

**Для всех 7 преимуществ:**
- Монолитная конструкция: `images/advantages/monolithic.jpg`
- Тепло- и звукоизоляция: `images/advantages/insulation.jpg`
- Архитектурная свобода: `images/advantages/architecture.jpg`
- Скорость: `images/advantages/speed.jpg`
- Коммуникации: `images/advantages/communications.jpg`
- Автоматизация: `images/advantages/automation.jpg`
- Стоимость: `images/advantages/cost.jpg`

---

### 4. Раздел "Уровни готовности" (readiness-levels.html)

**Найти:**
```html
<div class="level-image-placeholder">
    <p>Коробка — один дом, один ракурс</p>
</div>
```

**Заменить на:**
```html
<img src="images/readiness/level-1-box.jpg" 
     alt="Уровень готовности: Коробка" 
     class="level-image">
```

**Для всех 4 уровней:**
- Коробка: `images/readiness/level-1-box.jpg`
- Теплый контур: `images/readiness/level-2-warm.jpg`
- WhiteBox: `images/readiness/level-3-whitebox.jpg`
- Полная отделка: `images/readiness/level-4-full.jpg`

**Варианты отделки (4 стиля):**
- Современный: `images/readiness/style-modern.jpg`
- Классика: `images/readiness/style-classic.jpg`
- Скандинавский: `images/readiness/style-scandinavian.jpg`
- Лофт: `images/readiness/style-loft.jpg`

---

### 5. Раздел "Проекты" (projects.html)

**Основное изображение проекта:**
```html
<div class="gallery-image-placeholder">
    <p>3D-план по 2D-чертежу</p>
</div>
```

**Заменить на:**
```html
<img src="images/projects/project-1/main.jpg" 
     alt="Проект 1: 3D-план" 
     class="gallery-main-image">
```

**Миниатюры:**
```html
<div class="thumbnail-placeholder">1 этаж</div>
```

**Заменить на:**
```html
<img src="images/projects/project-1/floor-1.jpg" 
     alt="Проект 1: 1 этаж" 
     class="thumbnail-image">
```

**Для каждого проекта (1-5) создайте свою папку с изображениями.**

---

### 6. Раздел "Индивидуальный проект" (custom-project.html)

**Найти:**
```html
<div class="timeline-image-placeholder">
    <p>Чертеж</p>
</div>
```

**Заменить на:**
```html
<img src="images/custom/design.jpg" 
     alt="Проектирование" 
     class="timeline-image">
```

**Для всех 4 этапов:**
- Чертеж: `images/custom/design.jpg`
- Фундамент: `images/custom/foundation.jpg`
- 3D-печать: `images/custom/printing.jpg`
- Готовый дом: `images/custom/finished.jpg`

---

## 📝 Добавление CSS для изображений

После замены placeholder'ов добавьте в `css/style.css` стили для корректного отображения:

```css
/* Hero изображение */
.hero-image {
    width: 100%;
    height: auto;
    border-radius: 8px;
    object-fit: cover;
}

/* Изображения этапов */
.step-image {
    width: 100%;
    height: auto;
    border-radius: 8px;
    object-fit: cover;
}

/* Изображения преимуществ */
.advantage-image {
    width: 100%;
    height: auto;
    border-radius: 8px;
    object-fit: cover;
}

/* Изображения уровней готовности */
.level-image {
    width: 100%;
    height: auto;
    border-radius: 8px;
    object-fit: cover;
}

/* Галерея проектов */
.gallery-main-image {
    width: 100%;
    height: auto;
    border-radius: 8px;
    object-fit: cover;
}

.thumbnail-image {
    width: 100%;
    height: 100%;
    object-fit: cover;
    border-radius: 4px;
}

/* Изображения в быстрых ссылках */
.link-image {
    width: 100%;
    height: auto;
    object-fit: cover;
}

/* Изображения в таймлайне */
.timeline-image {
    width: 100%;
    height: auto;
    border-radius: 8px;
    object-fit: cover;
}
```

## ✅ Требования к изображениям

- **Формат:** JPG или PNG
- **Соотношение сторон:** 4:3 (например, 1920×1440px)
- **Разрешение:** минимум 1920px по большей стороне
- **Оптимизация:** сжимайте изображения для веба (используйте инструменты типа TinyPNG)
- **Alt-текст:** всегда указывайте описательный alt-текст для доступности и SEO

## 🚀 Быстрый старт

1. Создайте папки для изображений (см. структуру выше)
2. Поместите изображения в соответствующие папки
3. Замените placeholder'ы в HTML файлах на теги `<img>`
4. Добавьте CSS стили (см. выше)
5. Проверьте отображение в браузере

## 💡 Совет

Используйте поиск и замену в редакторе:
- Найти: `class="hero-image-placeholder"`
- Заменить: `class="hero-image"` и добавьте тег `<img>` с нужным src
