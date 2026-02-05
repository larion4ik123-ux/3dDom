// ============================================
// ПОЛНАЯ РЕАЛИЗАЦИЯ: Telegram + Email для всех форм заявок
// 
// Функции:
// 1. Отправка в Telegram канал/группу (все участники получают уведомления)
// 2. Дублирование на Email через EmailJS
// 
// Инструкция:
// 1. Создайте бота через @BotFather
// 2. Создайте канал/группу и добавьте бота как администратора
// 3. Получите Chat ID канала/группы
// 4. Настройте EmailJS (см. QUICK_START_REQUESTS.md)
// 5. Замените значения в конфигурации ниже
// ============================================

// ============================================
// Конфигурация Telegram
// ============================================
const TELEGRAM_CONFIG = {
    BOT_TOKEN: 'ВАШ_ТОКЕН_ОТ_BOTFATHER',  // Замените на ваш токен
    CHAT_ID: 'ВАШ_CHAT_ID_КАНАЛА_ИЛИ_ГРУППЫ'  // Chat ID канала/группы (начинается с -100)
};

// ============================================
// Конфигурация EmailJS
// ============================================
const EMAILJS_CONFIG = {
    PUBLIC_KEY: 'ВАШ_PUBLIC_KEY',        // Из раздела Account в EmailJS
    SERVICE_ID: 'ВАШ_SERVICE_ID',        // Из настроек Email Service
    TEMPLATE_ID: 'ВАШ_TEMPLATE_ID'       // Из Email Template
};

// Инициализация EmailJS (если используется)
if (typeof emailjs !== 'undefined') {
    emailjs.init(EMAILJS_CONFIG.PUBLIC_KEY);
}

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

// ============================================
// Функция отправки на Email через EmailJS
// ============================================
function sendToEmail(formData) {
    // Проверка, что EmailJS загружен
    if (typeof emailjs === 'undefined') {
        console.warn('EmailJS не загружен. Пропускаем отправку на email.');
        return Promise.resolve({ ok: false });
    }

    // Подготовка данных для EmailJS
    const templateParams = {
        name: formData.name,
        phone: formData.phone,
        email: formData.email || 'Не указан',
        message: formData.message || 'Без сообщения',
        form_type: formData.formType || 'Обычная заявка',
        date: new Date().toLocaleString('ru-RU'),
        // Дополнительные поля для индивидуального проекта
        area: formData.area || '',
        floors: formData.floors || '',
        readiness: formData.readiness || ''
    };

    return emailjs.send(
        EMAILJS_CONFIG.SERVICE_ID,
        EMAILJS_CONFIG.TEMPLATE_ID,
        templateParams
    );
}

// ============================================
// Функция отправки в оба канала
// ============================================
function sendRequest(formData) {
    // Отправляем в Telegram и Email параллельно
    return Promise.allSettled([
        sendToTelegram(formData),
        sendToEmail(formData)
    ]).then(results => {
        // Проверяем результаты
        const telegramResult = results[0];
        const emailResult = results[1];

        // Telegram результат
        if (telegramResult.status === 'fulfilled') {
            return telegramResult.value.json().then(data => {
                if (!data.ok) {
                    console.error('Ошибка Telegram:', data.description);
                }
                return { telegram: data.ok, email: emailResult.status === 'fulfilled' };
            });
        } else {
            console.error('Ошибка отправки в Telegram:', telegramResult.reason);
        }

        // Email результат
        if (emailResult.status === 'fulfilled') {
            console.log('Email отправлен успешно');
        } else {
            console.error('Ошибка отправки на Email:', emailResult.reason);
        }

        // Возвращаем успех, если хотя бы один канал сработал
        return {
            telegram: telegramResult.status === 'fulfilled',
            email: emailResult.status === 'fulfilled'
        };
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

        // Отправка в Telegram и Email
        const submitButton = form.querySelector('button[type="submit"]');
        const originalText = submitButton.textContent;
        submitButton.disabled = true;
        submitButton.textContent = 'Отправка...';

        sendRequest(formData)
            .then(results => {
                // Проверяем результаты
                if (results.telegram || results.email) {
                    let successMessage = 'Спасибо! Ваша заявка отправлена.';
                    if (results.telegram && results.email) {
                        successMessage += ' Мы получили её в Telegram и на Email.';
                    } else if (results.telegram) {
                        successMessage += ' Мы получили её в Telegram.';
                    } else if (results.email) {
                        successMessage += ' Мы получили её на Email.';
                    }
                    successMessage += ' Мы свяжемся с вами в ближайшее время.';
                    
                    showMessage(form, successMessage, false);
                    form.reset();
                    
                    // Опционально: отправка события в аналитику
                    if (typeof gtag !== 'undefined') {
                        gtag('event', 'form_submit', {
                            'event_category': 'engagement',
                            'event_label': formName === 'custom' ? 'custom_project' : 'request'
                        });
                    }
                } else {
                    throw new Error('Не удалось отправить заявку');
                }
            })
            .catch(error => {
                console.error('Ошибка отправки заявки:', error);
                showMessage(form, 'Ошибка отправки. Попробуйте позже или свяжитесь с нами по телефону.', true);
            })
            .finally(() => {
                submitButton.disabled = false;
                submitButton.textContent = originalText;
            });
    });
}
