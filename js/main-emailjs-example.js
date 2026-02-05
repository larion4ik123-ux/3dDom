// ============================================
// ПРИМЕР: Интеграция с EmailJS
// 
// Инструкция:
// 1. Зарегистрируйтесь на https://www.emailjs.com/
// 2. Получите Public Key, Service ID и Template ID
// 3. Замените значения ниже
// 4. Добавьте в <head> всех HTML страниц:
//    <script src="https://cdn.jsdelivr.net/npm/@emailjs/browser@4/dist/email.min.js"></script>
// 5. Замените содержимое handleFormSubmit в main.js на код ниже
// ============================================

// Конфигурация EmailJS (ЗАМЕНИТЕ НА ВАШИ ЗНАЧЕНИЯ)
const EMAILJS_CONFIG = {
    PUBLIC_KEY: 'YOUR_PUBLIC_KEY',        // Из раздела Account
    SERVICE_ID: 'YOUR_SERVICE_ID',        // Из настроек Email Service
    TEMPLATE_ID: 'YOUR_TEMPLATE_ID'       // Из Email Template
};

// Инициализация EmailJS (вызовите один раз при загрузке страницы)
if (typeof emailjs !== 'undefined') {
    emailjs.init(EMAILJS_CONFIG.PUBLIC_KEY);
}

// ============================================
// Обновленная функция handleFormSubmit для EmailJS
// ============================================

function handleFormSubmit(form, formName) {
    form.addEventListener('submit', function(e) {
        e.preventDefault();

        const name = form.querySelector('[name="name"]').value.trim();
        const phone = form.querySelector('[name="phone"]').value.trim();
        const email = form.querySelector('[name="email"]')?.value.trim() || '';
        const message = form.querySelector('[name="message"]')?.value.trim() || '';

        // Валидация
        if (!name) {
            showMessage(form, 'Пожалуйста, укажите ваше имя', true);
            return;
        }

        if (!phone) {
            showMessage(form, 'Пожалуйста, укажите ваш телефон', true);
            return;
        }

        if (!validatePhone(phone)) {
            showMessage(form, 'Пожалуйста, укажите корректный номер телефона', true);
            return;
        }

        if (email && !validateEmail(email)) {
            showMessage(form, 'Пожалуйста, укажите корректный email', true);
            return;
        }

        // Подготовка данных для отправки
        const templateParams = {
            name: name,
            phone: phone,
            email: email || 'Не указан',
            message: message || 'Без сообщения',
            form_type: formName === 'custom' ? 'Индивидуальный проект' : 'Обычная заявка',
            date: new Date().toLocaleString('ru-RU')
        };

        // Отправка через EmailJS
        const submitButton = form.querySelector('button[type="submit"]');
        const originalText = submitButton.textContent;
        submitButton.disabled = true;
        submitButton.textContent = 'Отправка...';

        // Проверка, что EmailJS загружен
        if (typeof emailjs === 'undefined') {
            showMessage(form, 'Ошибка: EmailJS не загружен. Проверьте подключение скрипта.', true);
            submitButton.disabled = false;
            submitButton.textContent = originalText;
            return;
        }

        emailjs.send(
            EMAILJS_CONFIG.SERVICE_ID,
            EMAILJS_CONFIG.TEMPLATE_ID,
            templateParams
        )
        .then(function(response) {
            console.log('Заявка отправлена успешно:', response.status, response.text);
            showMessage(form, 'Спасибо! Ваша заявка отправлена. Мы свяжемся с вами в ближайшее время.', false);
            form.reset();
            
            // Опционально: отправка события в аналитику
            if (typeof gtag !== 'undefined') {
                gtag('event', 'form_submit', {
                    'event_category': 'engagement',
                    'event_label': formName
                });
            }
        }, function(error) {
            console.error('Ошибка отправки заявки:', error);
            showMessage(form, 'Ошибка отправки. Попробуйте позже или свяжитесь с нами по телефону.', true);
        })
        .finally(function() {
            submitButton.disabled = false;
            submitButton.textContent = originalText;
        });
    });
}

// ============================================
// Пример шаблона для EmailJS
// ============================================
/*
Тема письма: Новая заявка с сайта Home3D

Содержимое (HTML):

<h2>Новая заявка с сайта Home3D</h2>

<p><strong>Тип заявки:</strong> {{form_type}}</p>
<p><strong>Дата:</strong> {{date}}</p>

<hr>

<p><strong>Имя:</strong> {{name}}</p>
<p><strong>Телефон:</strong> {{phone}}</p>
<p><strong>Email:</strong> {{email}}</p>

<p><strong>Сообщение:</strong></p>
<p>{{message}}</p>

<hr>
<p style="color: #666; font-size: 12px;">
    Заявка отправлена с сайта Home3D<br>
    Не отвечайте на это письмо
</p>
*/
