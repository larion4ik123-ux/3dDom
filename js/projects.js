// ============================================
// Карусель проектов
// ============================================

document.addEventListener('DOMContentLoaded', function() {
    const carousel = document.getElementById('projectsCarousel');
    const prevBtn = document.getElementById('prevProject');
    const nextBtn = document.getElementById('nextProject');
    const dotsContainer = document.getElementById('carouselDots');

    if (!carousel || !prevBtn || !nextBtn || !dotsContainer) {
        return;
    }

    const slides = carousel.querySelectorAll('.project-slide');
    let currentSlide = 0;

    // Создание точек навигации
    function createDots() {
        slides.forEach((_, index) => {
            const dot = document.createElement('div');
            dot.className = 'carousel-dot';
            if (index === 0) {
                dot.classList.add('active');
            }
            dot.addEventListener('click', () => goToSlide(index));
            dotsContainer.appendChild(dot);
        });
    }

    // Переход к слайду
    function goToSlide(index) {
        slides[currentSlide].classList.remove('active');
        const dots = dotsContainer.querySelectorAll('.carousel-dot');
        dots[currentSlide].classList.remove('active');

        currentSlide = index;

        slides[currentSlide].classList.add('active');
        dots[currentSlide].classList.add('active');
    }

    // Следующий слайд
    function nextSlide() {
        const nextIndex = (currentSlide + 1) % slides.length;
        goToSlide(nextIndex);
    }

    // Предыдущий слайд
    function prevSlide() {
        const prevIndex = (currentSlide - 1 + slides.length) % slides.length;
        goToSlide(prevIndex);
    }

    // Обработчики событий
    prevBtn.addEventListener('click', prevSlide);
    nextBtn.addEventListener('click', nextSlide);

    // Автоматическая прокрутка (опционально)
    // let autoPlayInterval = setInterval(nextSlide, 5000);

    // Остановка автопрокрутки при наведении
    // carousel.addEventListener('mouseenter', () => clearInterval(autoPlayInterval));
    // carousel.addEventListener('mouseleave', () => {
    //     autoPlayInterval = setInterval(nextSlide, 5000);
    // });

    // Клавиатурная навигация
    document.addEventListener('keydown', function(e) {
        if (e.key === 'ArrowLeft') {
            prevSlide();
        } else if (e.key === 'ArrowRight') {
            nextSlide();
        }
    });

    // Инициализация
    createDots();

    // ============================================
    // Галерея миниатюр в проектах
    // ============================================

    const thumbnails = document.querySelectorAll('.thumbnail');
    
    thumbnails.forEach(thumbnail => {
        thumbnail.addEventListener('click', function() {
            // Удаляем активный класс у всех миниатюр
            thumbnails.forEach(t => t.classList.remove('active'));
            // Добавляем активный класс к выбранной миниатюре
            this.classList.add('active');
            
            // Здесь можно добавить логику смены основного изображения
            // Например, загрузка соответствующего изображения в .gallery-main
        });
    });
});
