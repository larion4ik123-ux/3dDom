// ============================================
// ПОЛНАЯ РЕАЛИЗАЦИЯ: Telegram для всех форм заявок
// 
// Этот код обрабатывает:
// 1. Основную форму заявки (index.html)
// 2. Форму индивидуального проекта (custom-project.html)
// 
// Инструкция:
// 1. Создайте бота через @BotFather
// 2. Получите токен и Chat ID
// 3. Замените значения в TELEGRAM_CONFIG
// 4. Замените функцию handleFormSubmit в main.js на код ниже
// ============================================

// ============================================
// Конфигурация Telegram
// ============================================
const TELEGRAM_CONFIG = {
    BOT_TOKEN: 'ВАШ_ТОКЕН_ОТ_BOTFATHER',  // Замените на ваш токен
    CHAT_ID: 'ВАШ_CHAT_ID'                 // Замените на ваш Chat ID
};

// ============================================
// Функция отправки в Telegram
// ============================================
function sendToTelegram(formData) {
    // Формирование сообщения в зависимости от типа формы
    let message = `*Новая заявка с сайта Home3D*\n\n`;
    
    // Основная информация
    message += `*Имя:* ${escapeMarkdown(formData.name)}\n`;
    message += `*Телефон:* ${escapeMarkdown(formData.phone)}\n`;
    message += `*Email:* ${formData.email ? escapeMarkdown(formData.email) : 'Не указан'}\n\n`;
    
    // Дополнительные поля для индивидуального проекта
    if (formData.formType === 'Индивидуальный проект') {
        message += `*Тип заявки:* Индивидуальный проект\n`;
        
        if (formData.area) {
            message += `*Площадь дома:* ${formData.area} м²\n`;
        }
        
        if (formData.floors) {
            const floorsText = {
                '1': '1 этаж',
                '2': '2 этажа',
                '3': '3 этажа'
            };
            message += `*Этажность:* ${floorsText[formData.floors] || formData.floors}\n`;
        }
        
        if (formData.readiness) {
            const readinessText = {
                'box': 'Коробка',
                'warm': 'Теплый контур',
                'whitebox': 'WhiteBox',
                'full': 'Полная отделка'
            };
            message += `*Уровень готовности:* ${readinessText[formData.readiness] || formData.readiness}\n`;
        }
        
        message += `\n`;
    }
    
    // Сообщение от клиента
    message += `*Сообщение:*\n`;
    message += `${formData.message ? escapeMarkdown(formData.message) : 'Без сообщения'}\n`;
    
    // Дата и время
    message += `\n---\n`;
    message += `${new Date().toLocaleString('ru-RU')}`;

    // URL API Telegram
    const url = `https://api.telegram.org/bot${TELEGRAM_CONFIG.BOT_TOKEN}/sendMessage`;
    
    return fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            chat_id: TELEGRAM_CONFIG.CHAT_ID,
            text: message,
            parse_mode: 'Markdown',
            disable_web_page_preview: true
        })
    });
}

// Экранирование специальных символов для Markdown
function escapeMarkdown(text) {
    if (!text) return '';
    return text.toString()
        .replace(/\_/g, '\\_')
        .replace(/\*/g, '\\*')
        .replace(/\[/g, '\\[')
        .replace(/\]/g, '\\]')
        .replace(/\(/g, '\\(')
        .replace(/\)/g, '\\)')
        .replace(/\~/g, '\\~')
        .replace(/\`/g, '\\`')
        .replace(/\>/g, '\\>')
        .replace(/\#/g, '\\#')
        .replace(/\+/g, '\\+')
        .replace(/\-/g, '\\-')
        .replace(/\=/g, '\\=')
        .replace(/\|/g, '\\|')
        .replace(/\{/g, '\\{')
        .replace(/\}/g, '\\}')
        .replace(/\./g, '\\.')
        .replace(/\!/g, '\\!');
}

// ============================================
// Обновленная функция handleFormSubmit
// Работает для всех форм на сайте
// ============================================
function handleFormSubmit(form, formName) {
    form.addEventListener('submit', function(e) {
        e.preventDefault();

        // Сбор данных из формы
        const name = form.querySelector('[name="name"]').value.trim();
        const phone = form.querySelector('[name="phone"]').value.trim();
        const email = form.querySelector('[name="email"]')?.value.trim() || '';
        const message = form.querySelector('[name="message"]')?.value.trim() || '';

        // Валидация обязательных полей
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
        const formData = {
            name: name,
            phone: phone,
            email: email,
            message: message,
            formType: formName === 'custom' ? 'Индивидуальный проект' : 'Обычная заявка'
        };

        // Сбор дополнительных полей для формы индивидуального проекта
        if (formName === 'custom') {
            const area = form.querySelector('[name="area"]')?.value.trim() || '';
            const floors = form.querySelector('[name="floors"]')?.value.trim() || '';
            const readiness = form.querySelector('[name="readiness"]')?.value.trim() || '';
            
            if (area) formData.area = area;
            if (floors) formData.floors = floors;
            if (readiness) formData.readiness = readiness;
        }

        // Отправка в Telegram
        const submitButton = form.querySelector('button[type="submit"]');
        const originalText = submitButton.textContent;
        submitButton.disabled = true;
        submitButton.textContent = 'Отправка...';

        sendToTelegram(formData)
            .then(response => response.json())
            .then(data => {
                if (data.ok) {
                    showMessage(form, 'Спасибо! Ваша заявка отправлена. Мы свяжемся с вами в ближайшее время.', false);
                    form.reset();
                    
                    // Опционально: отправка события в аналитику
                    if (typeof gtag !== 'undefined') {
                        gtag('event', 'form_submit', {
                            'event_category': 'engagement',
                            'event_label': formName === 'custom' ? 'custom_project' : 'request'
                        });
                    }
                } else {
                    throw new Error(data.description || 'Ошибка отправки');
                }
            })
            .catch(error => {
                console.error('Ошибка отправки в Telegram:', error);
                showMessage(form, 'Ошибка отправки. Попробуйте позже или свяжитесь с нами по телефону.', true);
            })
            .finally(() => {
                submitButton.disabled = false;
                submitButton.textContent = originalText;
            });
    });
}

// ============================================
// Пример сообщения в Telegram
// ============================================
/*
Для обычной заявки:
*Новая заявка с сайта Home3D*

*Имя:* Иван Иванов
*Телефон:* +7 (999) 123-45-67
*Email:* ivan@example.com

*Сообщение:*
Хочу построить дом площадью 120 м²

---
15.01.2026, 14:30:25

Для индивидуального проекта:
*Новая заявка с сайта Home3D*

*Имя:* Иван Иванов
*Телефон:* +7 (999) 123-45-67
*Email:* ivan@example.com

*Тип заявки:* Индивидуальный проект
*Площадь дома:* 150 м²
*Этажность:* 2 этажа
*Уровень готовности:* Полная отделка

*Сообщение:*
Хочу построить дом с цокольным этажом...

---
15.01.2026, 14:30:25
*/
