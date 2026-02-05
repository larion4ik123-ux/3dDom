# Быстрый старт: Заявки через Telegram (5 минут)

## 🚀 За 5 минут до работающей системы заявок в Telegram

### Шаг 1: Создание бота (2 минуты)

1. Откройте Telegram
2. Найдите [@BotFather](https://t.me/botfather)
3. Отправьте команду `/newbot`
4. Придумайте имя бота (например: `Home3D Requests`)
5. Придумайте username (например: `home3d_requests_bot`)
6. **Скопируйте токен** - он выглядит как: `123456789:ABCdefGHIjklMNOpqrsTUVwxyz`

### Шаг 2: Получение Chat ID (1 минута)

**Самый простой способ:**

1. Найдите бота [@userinfobot](https://t.me/userinfobot) в Telegram
2. Начните с ним диалог
3. Он покажет ваш **Chat ID** (например: `123456789`)
4. **Скопируйте Chat ID**

### Шаг 3: Обновление кода (2 минуты)

**1. Откройте `js/main.js`**

**2. Найдите функцию `handleFormSubmit` (примерно строка 109)**

**3. Добавьте в начало файла (после других констант):**

```javascript
// Конфигурация Telegram
const TELEGRAM_CONFIG = {
    BOT_TOKEN: 'ВАШ_ТОКЕН_ОТ_BOTFATHER',  // Вставьте токен из шага 1
    CHAT_ID: 'ВАШ_CHAT_ID'                 // Вставьте Chat ID из шага 2
};

// Функция отправки в Telegram
function sendToTelegram(formData) {
    const message = `🔔 Новая заявка с сайта Home3D

👤 Имя: ${formData.name}
📞 Телефон: ${formData.phone}
📧 Email: ${formData.email || 'Не указан'}

💬 Сообщение:
${formData.message || 'Без сообщения'}

---
📅 ${new Date().toLocaleString('ru-RU')}`;

    const url = `https://api.telegram.org/bot${TELEGRAM_CONFIG.BOT_TOKEN}/sendMessage`;
    
    return fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            chat_id: TELEGRAM_CONFIG.CHAT_ID,
            text: message
        })
    });
}
```

**4. Замените функцию `handleFormSubmit`:**

Найдите эту часть:
```javascript
// Имитация отправки формы
const submitButton = form.querySelector('button[type="submit"]');
const originalText = submitButton.textContent;
submitButton.disabled = true;
submitButton.textContent = 'Отправка...';

// В реальном приложении здесь был бы запрос к серверу
setTimeout(() => {
    showMessage(form, 'Спасибо! Ваша заявка отправлена. Мы свяжемся с вами в ближайшее время.', false);
    form.reset();
    submitButton.disabled = false;
    submitButton.textContent = originalText;
}, 1500);
```

Замените на:
```javascript
// Подготовка данных
const formData = {
    name: name,
    phone: phone,
    email: email,
    message: message
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
        console.error('Ошибка:', error);
        showMessage(form, 'Ошибка отправки. Попробуйте позже или свяжитесь с нами по телефону.', true);
    })
    .finally(() => {
        submitButton.disabled = false;
        submitButton.textContent = originalText;
    });
```

**5. Замените значения:**
- `ВАШ_ТОКЕН_ОТ_BOTFATHER` → токен из шага 1
- `ВАШ_CHAT_ID` → Chat ID из шага 2

### Шаг 4: Тестирование

1. Откройте сайт в браузере
2. Заполните форму заявки
3. Нажмите "Отправить заявку"
4. Проверьте Telegram - должно прийти сообщение с заявкой!

---

## ✅ Готово!

Теперь все заявки с сайта будут приходить в ваш Telegram!

---

## 🔧 Дополнительные настройки

### Получение заявок в группу/канал

1. Создайте группу или канал в Telegram
2. Добавьте вашего бота в группу/канал как администратора
3. Отправьте сообщение в группу/канал
4. Откройте в браузере: `https://api.telegram.org/botВАШ_ТОКЕН/getUpdates`
5. Найдите Chat ID группы (обычно начинается с `-100`)
6. Используйте этот Chat ID вместо личного

### Красивое форматирование сообщений

Замените в функции `sendToTelegram`:

```javascript
const message = `🔔 *Новая заявка с сайта Home3D*

👤 *Имя:* ${formData.name}
📞 *Телефон:* ${formData.phone}
📧 *Email:* ${formData.email || 'Не указан'}

💬 *Сообщение:*
${formData.message || 'Без сообщения'}

---
📅 ${new Date().toLocaleString('ru-RU')}`;

// И добавьте parse_mode в body:
body: JSON.stringify({
    chat_id: TELEGRAM_CONFIG.CHAT_ID,
    text: message,
    parse_mode: 'Markdown'
})
```

---

## 🚨 Решение проблем

**Проблема:** Заявки не отправляются
- ✅ Проверьте правильность токена и Chat ID
- ✅ Убедитесь, что бот запущен (напишите ему `/start`)
- ✅ Откройте консоль браузера (F12) и проверьте ошибки

**Проблема:** Ошибка "chat not found"
- ✅ Проверьте правильность Chat ID
- ✅ Напишите боту сообщение, чтобы он "узнал" ваш Chat ID

**Проблема:** CORS ошибка
- ✅ Telegram API поддерживает CORS, но если проблема есть, используйте вариант с промежуточным сервером (см. `HOW_TO_IMPLEMENT_TELEGRAM.md`)

---

## 📊 Преимущества Telegram

- ✅ **Бесплатно** - без ограничений
- ✅ **Мгновенно** - уведомления приходят сразу
- ✅ **Мобильно** - всегда с вами
- ✅ **Удобно** - можно отвечать из Telegram
- ✅ **Надёжно** - работает стабильно

---

Подробная документация: см. `HOW_TO_IMPLEMENT_TELEGRAM.md`
