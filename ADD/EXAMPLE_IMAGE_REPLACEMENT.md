# Пример замены изображений

## Пример 1: Hero-блок на главной странице

### До (placeholder):
```html
<div class="hero-visual">
    <div class="hero-image-placeholder">
        <p>Изображение: Чертеж → 3D-печать → Готовый дом</p>
    </div>
</div>
```

### После (реальное изображение):
```html
<div class="hero-visual">
    <img src="images/hero/hero-main.jpg" 
         alt="Процесс строительства дома методом 3D-печати: от чертежа до готового дома" 
         class="hero-image">
</div>
```

---

## Пример 2: Этап технологии

### До (placeholder):
```html
<div class="step-content">
    <div class="step-image-placeholder">
        <p>Фундаментная плита</p>
    </div>
    <div class="step-text">
        <h2>Фундаментная плита</h2>
        <p>Подготовка и заливка монолитной фундаментной плиты...</p>
    </div>
</div>
```

### После (реальное изображение):
```html
<div class="step-content">
    <img src="images/technology/step-1-foundation.jpg" 
         alt="Фундаментная плита для дома, построенного методом 3D-печати" 
         class="step-image">
    <div class="step-text">
        <h2>Фундаментная плита</h2>
        <p>Подготовка и заливка монолитной фундаментной плиты...</p>
    </div>
</div>
```

---

## Пример 3: Быстрая ссылка

### До (placeholder):
```html
<a href="technology.html" class="link-card">
    <div class="link-image-placeholder">
        <p>Технология</p>
    </div>
    <h3>Как это работает</h3>
    <p>Пошаговый процесс строительства</p>
</a>
```

### После (реальное изображение):
```html
<a href="technology.html" class="link-card">
    <img src="images/technology/step-2-printing.jpg" 
         alt="Технология 3D-печати домов" 
         class="link-image">
    <h3>Как это работает</h3>
    <p>Пошаговый процесс строительства</p>
</a>
```

---

## Пример 4: Проект в карусели

### До (placeholder):
```html
<div class="gallery-main">
    <div class="gallery-image-placeholder">
        <p>3D-план по 2D-чертежу</p>
    </div>
</div>
<div class="gallery-thumbnails">
    <div class="thumbnail active">
        <div class="thumbnail-placeholder">1 этаж</div>
    </div>
</div>
```

### После (реальные изображения):
```html
<div class="gallery-main">
    <img src="images/projects/project-1/main.jpg" 
         alt="Проект 1: 3D-план дома" 
         class="gallery-main-image">
</div>
<div class="gallery-thumbnails">
    <div class="thumbnail active">
        <img src="images/projects/project-1/floor-1.jpg" 
             alt="Проект 1: План первого этажа" 
             class="thumbnail-image">
    </div>
</div>
```

---

## Важные замечания

1. **Всегда указывайте alt-текст** — это важно для доступности и SEO
2. **Используйте описательные имена файлов** — это поможет в организации
3. **Сохраняйте соотношение сторон 4:3** — для единообразия
4. **Оптимизируйте размер файлов** — используйте сжатие для быстрой загрузки
5. **Проверяйте пути** — убедитесь, что путь к изображению правильный относительно HTML файла

## Проверка после замены

После замены всех placeholder'ов:
1. Откройте сайт в браузере
2. Проверьте, что все изображения загружаются
3. Проверьте адаптивность на разных устройствах
4. Убедитесь, что изображения не искажаются
