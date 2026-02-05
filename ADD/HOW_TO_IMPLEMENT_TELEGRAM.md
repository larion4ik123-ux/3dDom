# Система заявок через Telegram

## 🚀 Преимущества Telegram

- ✅ **Мгновенные уведомления** - заявки приходят сразу в Telegram
- ✅ **Бесплатно** - без ограничений на количество сообщений
- ✅ **Простота** - не нужен email сервер
- ✅ **Удобство** - можно отвечать прямо из Telegram
- ✅ **Мобильные уведомления** - всегда на связи

---

## 📋 Варианты реализации

### Вариант 1: Telegram Bot (Рекомендуется)

Создаёте бота, который будет получать заявки и отправлять их вам в личные сообщения или группу.

### Вариант 2: Telegram Channel

Заявки отправляются в канал (можно настроить автоматические уведомления).

---

## 🔧 Вариант 1: Telegram Bot (Пошаговая инструкция)

### Шаг 1: Создание бота (2 минуты)

1. Откройте Telegram и найдите [@BotFather](https://t.me/botfather)
2. Отправьте команду `/newbot`
3. Следуйте инструкциям:
   - Придумайте имя бота (например: `Home3D Requests Bot`)
   - Придумайте username (например: `home3d_requests_bot`)
4. **Сохраните токен** - он будет выглядеть как: `123456789:ABCdefGHIjklMNOpqrsTUVwxyz`

### Шаг 2: Получение Chat ID (1 минута)

**Способ 1: Через бота @userinfobot**
1. Найдите бота [@userinfobot](https://t.me/userinfobot) в Telegram
2. Начните с ним диалог
3. Он покажет ваш Chat ID (например: `123456789`)

**Способ 2: Через вашего бота**
1. Напишите вашему боту любое сообщение
2. Откройте в браузере: `https://api.telegram.org/botВАШ_ТОКЕН/getUpdates`
3. Найдите `"chat":{"id":123456789}` - это ваш Chat ID

### Шаг 3: Подключение к сайту

**Добавьте в `js/main.js` функцию для отправки в Telegram:**

```javascript
// Конфигурация Telegram (ЗАМЕНИТЕ НА ВАШИ ЗНАЧЕНИЯ)
const TELEGRAM_CONFIG = {
    BOT_TOKEN: 'ВАШ_ТОКЕН_БОТА',      // Токен от BotFather
    CHAT_ID: 'ВАШ_CHAT_ID'            // Ваш Chat ID
};

// Функция отправки заявки в Telegram
function sendToTelegram(formData) {
    const message = `
🔔 *Новая заявка с сайта Home3D*

👤 *Имя:* ${formData.name}
📞 *Телефон:* ${formData.phone}
📧 *Email:* ${formData.email || 'Не указан'}

💬 *Сообщение:*
${formData.message || 'Без сообщения'}

---
📅 ${new Date().toLocaleString('ru-RU')}
    `.trim();

    const url = `https://api.telegram.org/bot${TELEGRAM_CONFIG.BOT_TOKEN}/sendMessage`;
    
    return fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            chat_id: TELEGRAM_CONFIG.CHAT_ID,
            text: message,
            parse_mode: 'Markdown'
        })
    });
}
```

**Обновите функцию `handleFormSubmit`:**

```javascript
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

        // Подготовка данных
        const formData = {
            name: name,
            phone: phone,
            email: email,
            message: message,
            formType: formName === 'custom' ? 'Индивидуальный проект' : 'Обычная заявка'
        };

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
```

---

## 🔧 Вариант 2: Через Telegram Channel

Если хотите получать заявки в канал:

1. Создайте канал в Telegram
2. Добавьте вашего бота в канал как администратора
3. Получите Chat ID канала (обычно начинается с `-100`)
4. Используйте Chat ID канала вместо личного Chat ID

**Как получить Chat ID канала:**
1. Добавьте бота [@getidsbot](https://t.me/getidsbot) в канал
2. Или отправьте сообщение в канал и откройте: `https://api.telegram.org/botВАШ_ТОКЕН/getUpdates`

---

## 🔧 Вариант 3: Через Telegram Webhook (Продвинутый)

Для большей безопасности и функциональности можно использовать webhook через промежуточный сервер.

**Создайте простой сервер на Node.js:**

```javascript
// server-telegram.js
const express = require('express');
const axios = require('axios');
const app = express();

app.use(express.json());
app.use(express.static('.'));

const TELEGRAM_BOT_TOKEN = 'ВАШ_ТОКЕН';
const TELEGRAM_CHAT_ID = 'ВАШ_CHAT_ID';

app.post('/api/telegram-request', async (req, res) => {
    try {
        const { name, phone, email, message } = req.body;

        const telegramMessage = `
🔔 Новая заявка с сайта Home3D

👤 Имя: ${name}
📞 Телефон: ${phone}
📧 Email: ${email || 'Не указан'}

💬 Сообщение:
${message || 'Без сообщения'}

---
${new Date().toLocaleString('ru-RU')}
        `.trim();

        const response = await axios.post(
            `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`,
            {
                chat_id: TELEGRAM_CHAT_ID,
                text: telegramMessage,
                parse_mode: 'Markdown'
            }
        );

        res.json({ success: true });
    } catch (error) {
        console.error('Ошибка:', error);
        res.status(500).json({ error: 'Ошибка отправки' });
    }
});

app.listen(3000, () => {
    console.log('Сервер запущен на порту 3000');
});
```

**На фронтенде отправляйте на ваш сервер:**

```javascript
fetch('http://your-server.com/api/telegram-request', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(formData)
})
```

---

## 📝 Полный пример кода для `js/main.js`

```javascript
// ============================================
// Конфигурация Telegram
// ============================================
const TELEGRAM_CONFIG = {
    BOT_TOKEN: '123456789:ABCdefGHIjklMNOpqrsTUVwxyz',  // Замените на ваш токен
    CHAT_ID: '123456789'                                 // Замените на ваш Chat ID
};

// ============================================
// Функция отправки в Telegram
// ============================================
function sendToTelegram(formData) {
    // Форматирование сообщения
    const message = `
🔔 *Новая заявка с сайта Home3D*

👤 *Имя:* ${escapeMarkdown(formData.name)}
📞 *Телефон:* ${escapeMarkdown(formData.phone)}
📧 *Email:* ${formData.email ? escapeMarkdown(formData.email) : 'Не указан'}

💬 *Сообщение:*
${formData.message ? escapeMarkdown(formData.message) : 'Без сообщения'}

${formData.formType ? `📋 *Тип заявки:* ${formData.formType}` : ''}

---
📅 ${new Date().toLocaleString('ru-RU')}
    `.trim();

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

        // Подготовка данных
        const formData = {
            name: name,
            phone: phone,
            email: email,
            message: message,
            formType: formName === 'custom' ? 'Индивидуальный проект' : 'Обычная заявка'
        };

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
                            'event_label': 'telegram'
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
```

---

## 🔒 Безопасность

⚠️ **Важно:** Токен бота и Chat ID видны в коде JavaScript. Это нормально для простых ботов, но:

1. **Ограничьте права бота** - он должен только отправлять сообщения
2. **Используйте webhook** (Вариант 3) для продакшена - токен будет на сервере
3. **Добавьте rate limiting** - ограничьте количество запросов с одного IP

---

## 🎨 Дополнительные возможности

### Кнопки в сообщении

Можно добавить кнопки для быстрого ответа:

```javascript
body: JSON.stringify({
    chat_id: TELEGRAM_CONFIG.CHAT_ID,
    text: message,
    parse_mode: 'Markdown',
    reply_markup: {
        inline_keyboard: [[
            { text: '✅ Обработано', callback_data: 'processed' },
            { text: '📞 Позвонить', url: `tel:${phone}` }
        ]]
    }
})
```

### Отправка в несколько чатов

```javascript
const chatIds = ['123456789', '987654321']; // Несколько получателей

Promise.all(
    chatIds.map(chatId => 
        sendToTelegram(formData, chatId)
    )
)
```

---

## ✅ Преимущества перед EmailJS

- ✅ **Бесплатно** - без ограничений
- ✅ **Мгновенно** - уведомления приходят сразу
- ✅ **Мобильно** - всегда с вами
- ✅ **Удобно** - можно отвечать из Telegram
- ✅ **Надёжно** - Telegram работает стабильно

---

## 🚀 Быстрый старт

1. Создайте бота через [@BotFather](https://t.me/botfather)
2. Получите токен и Chat ID
3. Замените значения в `TELEGRAM_CONFIG`
4. Обновите функцию `handleFormSubmit` в `js/main.js`
5. Протестируйте отправку заявки!

---

Готово! Теперь все заявки будут приходить в ваш Telegram! 🎉
