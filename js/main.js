// ============================================
// Конфигурация Telegram
// ============================================
const TELEGRAM_CONFIG = {
    BOT_TOKEN: '8387598914:AAFEYBc7b_-1CC_drmUUyRNH0U48nCADMp4',
    CHAT_ID: '-1003589311159'
};

// ============================================
// Конфигурация EmailJS (отправка заявок на почту)
// Замените на свои значения с https://www.emailjs.com/
// Если оставить YOUR_* — письма не отправляются, только Telegram
// ============================================
const EMAILJS_CONFIG = {
    PUBLIC_KEY: 'YOUR_PUBLIC_KEY',
    SERVICE_ID: 'YOUR_SERVICE_ID',
    TEMPLATE_ID: 'YOUR_TEMPLATE_ID'
};

function isEmailJSConfigured() {
    return typeof emailjs !== 'undefined' &&
        EMAILJS_CONFIG.PUBLIC_KEY &&
        !EMAILJS_CONFIG.PUBLIC_KEY.startsWith('YOUR_');
}

function sendEmailViaEmailJS(formData) {
    if (!isEmailJSConfigured()) return Promise.resolve();
    emailjs.init(EMAILJS_CONFIG.PUBLIC_KEY);
    const templateParams = {
        name: formData.name,
        phone: formData.phone,
        email: formData.email || 'Не указан',
        message: formData.message || 'Без сообщения',
        form_type: formData.formType || 'Обычная заявка',
        date: new Date().toLocaleString('ru-RU'),
        area: formData.area || '',
        floors: formData.floors || '',
        readiness: formData.readiness || ''
    };
    return emailjs.send(EMAILJS_CONFIG.SERVICE_ID, EMAILJS_CONFIG.TEMPLATE_ID, templateParams);
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

        if (formData.projectFileName) {
            message += `*Файл проекта:* ${escapeMarkdown(formData.projectFileName)}\n`;
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

function sendFileToTelegram(file) {
    const maxSizeMb = 45;
    if (file.size > maxSizeMb * 1024 * 1024) {
        return Promise.reject(new Error(`Файл слишком большой. Максимум ${maxSizeMb} МБ`));
    }

    const url = `https://api.telegram.org/bot${TELEGRAM_CONFIG.BOT_TOKEN}/sendDocument`;
    const uploadData = new FormData();
    uploadData.append('chat_id', TELEGRAM_CONFIG.CHAT_ID);
    uploadData.append('caption', `Файл проекта: ${file.name}`);
    uploadData.append('document', file, file.name);

    return fetch(url, {
        method: 'POST',
        body: uploadData
    })
        .then(response => response.json())
        .then(data => {
            if (!data.ok) {
                throw new Error(data.description || 'Ошибка загрузки файла');
            }
            return data;
        });
}

// Экранирование специальных символов для Markdown
// Экранируем только те символы, которые могут сломать форматирование
function escapeMarkdown(text) {
    if (!text) return '';
    return text.toString()
        .replace(/\_/g, '\\_')      // Подчёркивание
        .replace(/\*/g, '\\*')      // Звёздочка
        .replace(/\[/g, '\\[')      // Квадратная скобка открывающая
        .replace(/\]/g, '\\]')      // Квадратная скобка закрывающая
        .replace(/\~/g, '\\~')      // Тильда
        .replace(/\`/g, '\\`')      // Обратная кавычка
        .replace(/\#/g, '\\#');     // Решётка
    // НЕ экранируем: +, -, =, |, {, }, ., !, >, (, ) - они безопасны в обычном тексте
}

// ============================================
// Мобильное меню
// Скрипт написан вручную
// ============================================

document.addEventListener('DOMContentLoaded', function() {
    const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
    const navMenu = document.querySelector('.nav-menu') || document.querySelector('.nav-list');

    if (mobileMenuToggle && navMenu) {
        mobileMenuToggle.addEventListener('click', function() {
            navMenu.classList.toggle('active');
            mobileMenuToggle.classList.toggle('active');
        });

        // Закрытие меню при клике на ссылку
        const navLinks = navMenu.querySelectorAll('a');
        navLinks.forEach(link => {
            link.addEventListener('click', function() {
                navMenu.classList.remove('active');
                mobileMenuToggle.classList.remove('active');
            });
        });

        // Закрытие меню при клике вне его
        document.addEventListener('click', function(event) {
            if (!navMenu.contains(event.target) && !mobileMenuToggle.contains(event.target)) {
                navMenu.classList.remove('active');
                mobileMenuToggle.classList.remove('active');
            }
        });
    }
});

// ============================================
// Плавная прокрутка к якорям
// ============================================

document.addEventListener('DOMContentLoaded', function() {
    const anchorLinks = document.querySelectorAll('a[href^="#"]');
    
    anchorLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            
            if (href !== '#' && href.length > 1) {
                const target = document.querySelector(href);
                
                if (target) {
                    e.preventDefault();
                    const offsetTop = target.offsetTop - 80; // Учитываем высоту навигации
                    
                    window.scrollTo({
                        top: offsetTop,
                        behavior: 'smooth'
                    });
                }
            }
        });
    });
});

// ============================================
// Валидация и отправка формы
// ============================================

document.addEventListener('DOMContentLoaded', function() {
    const requestForm = document.getElementById('requestForm');
    const customProjectForm = document.getElementById('customProjectForm');

    function validatePhone(phone) {
        const phoneRegex = /^[\d\s\-\+\(\)]+$/;
        return phoneRegex.test(phone) && phone.replace(/\D/g, '').length >= 10;
    }

    function validateEmail(email) {
        if (!email) return true; // Email не обязателен
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    function showMessage(form, message, isError = false) {
        // Удаляем предыдущие сообщения
        const existingMessage = form.querySelector('.form-message');
        if (existingMessage) {
            existingMessage.remove();
        }

        const messageDiv = document.createElement('div');
        messageDiv.className = `form-message ${isError ? 'error' : 'success'}`;
        messageDiv.textContent = message;
        messageDiv.style.cssText = `
            padding: 1rem;
            margin-top: 1rem;
            border-radius: 4px;
            background-color: ${isError ? '#fee' : '#efe'};
            color: ${isError ? '#c33' : '#3c3'};
            border: 1px solid ${isError ? '#fcc' : '#cfc'};
        `;
        
        form.appendChild(messageDiv);

        // Автоматически скрыть сообщение через 5 секунд
        setTimeout(() => {
            messageDiv.remove();
        }, 5000);
    }

    function handleFormSubmit(form, formName) {
        form.addEventListener('submit', function(e) {
            e.preventDefault();

            const name = form.querySelector('[name="name"]').value.trim();
            const phone = form.querySelector('[name="phone"]').value.trim();
            const email = form.querySelector('[name="email"]')?.value.trim() || '';
            const message = form.querySelector('[name="message"]')?.value.trim() || '';
            const projectFile = form.querySelector('[name="project_file"]')?.files?.[0] || null;

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
                if (projectFile) formData.projectFileName = projectFile.name;
            }

            // Отправка в Telegram
            const submitButton = form.querySelector('button[type="submit"]');
            const originalText = submitButton.textContent;
            submitButton.disabled = true;
            submitButton.textContent = 'Отправка...';

            sendToTelegram(formData)
                .then(response => response.json())
                .then(data => {
                    if (!data.ok) {
                        throw new Error(data.description || 'Ошибка отправки');
                    }
                    return data;
                })
                .then(() => {
                    if (formName === 'custom' && projectFile) {
                        return sendFileToTelegram(projectFile);
                    }
                    return null;
                })
                .then(() => {
                    showMessage(form, 'Спасибо! Ваша заявка отправлена. Мы свяжемся с вами в ближайшее время.', false);
                    form.reset();
                    // Дублирование заявки на почту через EmailJS (если настроено)
                    sendEmailViaEmailJS(formData).catch(function() {});
                    // Опционально: отправка события в аналитику
                    if (typeof gtag !== 'undefined') {
                        gtag('event', 'form_submit', {
                            'event_category': 'engagement',
                            'event_label': formName === 'custom' ? 'custom_project' : 'request'
                        });
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

    if (requestForm) {
        handleFormSubmit(requestForm, 'request');
    }

    if (customProjectForm) {
        handleFormSubmit(customProjectForm, 'custom');
    }
});

// ============================================
// Анимация при прокрутке
// ============================================

document.addEventListener('DOMContentLoaded', function() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    // Применяем анимацию к элементам
    const animatedElements = document.querySelectorAll('.advantage-card, .link-card, .step-item, .advantage-item-large, .level-item');
    
    animatedElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
});

// ============================================
// Маска для телефона (базовая)
// ============================================

document.addEventListener('DOMContentLoaded', function() {
    const phoneInputs = document.querySelectorAll('input[type="tel"]');
    
    phoneInputs.forEach(input => {
        input.addEventListener('input', function(e) {
            let value = e.target.value.replace(/\D/g, '');
            
            if (value.length > 0) {
                if (value[0] === '8') {
                    value = '7' + value.substring(1);
                }
                if (value[0] !== '7' && value.length > 0) {
                    value = '7' + value;
                }
            }
            
            let formattedValue = '';
            if (value.length > 0) {
                formattedValue = '+7';
                if (value.length > 1) {
                    formattedValue += ' (' + value.substring(1, 4);
                }
                if (value.length >= 4) {
                    formattedValue += ') ' + value.substring(4, 7);
                }
                if (value.length >= 7) {
                    formattedValue += '-' + value.substring(7, 9);
                }
                if (value.length >= 9) {
                    formattedValue += '-' + value.substring(9, 11);
                }
            }
            
            e.target.value = formattedValue;
        });
    });
});
