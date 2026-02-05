# Как реализовать систему заявок

## 📋 Варианты реализации

Есть несколько способов реализовать отправку заявок с сайта. Выберите подходящий вариант в зависимости от ваших потребностей и технических возможностей.

---

## 🟢 Вариант 1: EmailJS (Рекомендуется для начала)

**Плюсы:**
- ✅ Бесплатный тариф (200 писем/месяц)
- ✅ Не требует backend
- ✅ Простая настройка
- ✅ Работает сразу после настройки

**Минусы:**
- ⚠️ Ограничение на бесплатном тарифе
- ⚠️ Зависимость от внешнего сервиса

### Шаг 1: Регистрация в EmailJS

1. Перейдите на [https://www.emailjs.com/](https://www.emailjs.com/)
2. Зарегистрируйтесь (бесплатно)
3. Подтвердите email

### Шаг 2: Настройка EmailJS

1. **Добавьте Email сервис:**
   - В панели управления перейдите в "Email Services"
   - Нажмите "Add New Service"
   - Выберите ваш email провайдер (Gmail, Outlook и т.д.)
   - Следуйте инструкциям для подключения

2. **Создайте Email Template:**
   - Перейдите в "Email Templates"
   - Нажмите "Create New Template"
   - Используйте такой шаблон:

```
Тема: Новая заявка с сайта Home3D

Имя: {{name}}
Телефон: {{phone}}
Email: {{email}}

Сообщение:
{{message}}

---
Заявка отправлена с сайта Home3D
```

3. **Получите ключи:**
   - Public Key (в разделе Account)
   - Service ID (из настроек сервиса)
   - Template ID (из шаблона)

### Шаг 3: Подключение к сайту

**Добавьте в `<head>` всех HTML страниц (перед закрывающим `</head>`):**

```html
<script src="https://cdn.jsdelivr.net/npm/@emailjs/browser@4/dist/email.min.js"></script>
```

**Обновите `js/main.js` - замените функцию `handleFormSubmit`:**

```javascript
function handleFormSubmit(form, formName) {
    // Инициализация EmailJS
    emailjs.init("YOUR_PUBLIC_KEY"); // Замените на ваш Public Key

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

        // Параметры для отправки
        const templateParams = {
            name: name,
            phone: phone,
            email: email || 'Не указан',
            message: message || 'Без сообщения'
        };

        // Отправка через EmailJS
        const submitButton = form.querySelector('button[type="submit"]');
        const originalText = submitButton.textContent;
        submitButton.disabled = true;
        submitButton.textContent = 'Отправка...';

        emailjs.send('YOUR_SERVICE_ID', 'YOUR_TEMPLATE_ID', templateParams)
            .then(function(response) {
                showMessage(form, 'Спасибо! Ваша заявка отправлена. Мы свяжемся с вами в ближайшее время.', false);
                form.reset();
                submitButton.disabled = false;
                submitButton.textContent = originalText;
            }, function(error) {
                showMessage(form, 'Ошибка отправки. Попробуйте позже или свяжитесь с нами по телефону.', true);
                submitButton.disabled = false;
                submitButton.textContent = originalText;
            });
    });
}
```

**Замените:**
- `YOUR_PUBLIC_KEY` - на ваш Public Key из EmailJS
- `YOUR_SERVICE_ID` - на ID вашего email сервиса
- `YOUR_TEMPLATE_ID` - на ID вашего шаблона

---

## 🟡 Вариант 2: Formspree

**Плюсы:**
- ✅ Очень простой в использовании
- ✅ Бесплатный тариф (50 заявок/месяц)
- ✅ Не требует настройки email

**Минусы:**
- ⚠️ Меньше бесплатных заявок
- ⚠️ Меньше кастомизации

### Настройка:

1. Зарегистрируйтесь на [https://formspree.io/](https://formspree.io/)
2. Создайте новую форму
3. Получите endpoint URL (например: `https://formspree.io/f/YOUR_FORM_ID`)

### Обновление формы:

**В HTML измените атрибут `action` формы:**

```html
<form class="request-form" id="requestForm" action="https://formspree.io/f/YOUR_FORM_ID" method="POST">
    <!-- поля формы -->
</form>
```

**В JavaScript уберите `e.preventDefault()` или отправляйте через fetch:**

```javascript
function handleFormSubmit(form, formName) {
    form.addEventListener('submit', function(e) {
        e.preventDefault();

        // ... валидация ...

        const formData = new FormData(form);
        
        const submitButton = form.querySelector('button[type="submit"]');
        const originalText = submitButton.textContent;
        submitButton.disabled = true;
        submitButton.textContent = 'Отправка...';

        fetch('https://formspree.io/f/YOUR_FORM_ID', {
            method: 'POST',
            body: formData,
            headers: {
                'Accept': 'application/json'
            }
        })
        .then(response => response.json())
        .then(data => {
            if (data.ok) {
                showMessage(form, 'Спасибо! Ваша заявка отправлена.', false);
                form.reset();
            } else {
                showMessage(form, 'Ошибка отправки. Попробуйте позже.', true);
            }
        })
        .catch(error => {
            showMessage(form, 'Ошибка отправки. Попробуйте позже.', true);
        })
        .finally(() => {
            submitButton.disabled = false;
            submitButton.textContent = originalText;
        });
    });
}
```

---

## 🔵 Вариант 3: Собственный Backend (Node.js)

**Плюсы:**
- ✅ Полный контроль
- ✅ Нет ограничений
- ✅ Можно добавить базу данных
- ✅ Можно интегрировать с CRM

**Минусы:**
- ⚠️ Требует сервер
- ⚠️ Нужны знания программирования

### Создание простого сервера:

**Создайте файл `server.js` в корне проекта:**

```javascript
const express = require('express');
const nodemailer = require('nodemailer');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static('.')); // Раздача статических файлов

// Настройка почтового транспорта
const transporter = nodemailer.createTransport({
    service: 'gmail', // или другой сервис
    auth: {
        user: 'your-email@gmail.com',
        pass: 'your-app-password' // App Password, не обычный пароль!
    }
});

// Обработка заявок
app.post('/api/request', async (req, res) => {
    try {
        const { name, phone, email, message } = req.body;

        // Валидация
        if (!name || !phone) {
            return res.status(400).json({ error: 'Имя и телефон обязательны' });
        }

        // Отправка email
        const mailOptions = {
            from: 'your-email@gmail.com',
            to: 'info@home3d.ru', // Ваш email для получения заявок
            subject: `Новая заявка с сайта Home3D от ${name}`,
            html: `
                <h2>Новая заявка</h2>
                <p><strong>Имя:</strong> ${name}</p>
                <p><strong>Телефон:</strong> ${phone}</p>
                <p><strong>Email:</strong> ${email || 'Не указан'}</p>
                <p><strong>Сообщение:</strong></p>
                <p>${message || 'Без сообщения'}</p>
            `
        };

        await transporter.sendMail(mailOptions);

        res.json({ success: true, message: 'Заявка отправлена' });
    } catch (error) {
        console.error('Ошибка отправки:', error);
        res.status(500).json({ error: 'Ошибка отправки заявки' });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Сервер запущен на порту ${PORT}`);
});
```

**Создайте `package.json`:**

```json
{
  "name": "home3d-server",
  "version": "1.0.0",
  "scripts": {
    "start": "node server.js"
  },
  "dependencies": {
    "express": "^4.18.2",
    "nodemailer": "^6.9.7",
    "cors": "^2.8.5"
  }
}
```

**Установка и запуск:**

```bash
npm install
node server.js
```

**Обновление JavaScript на фронтенде:**

```javascript
function handleFormSubmit(form, formName) {
    form.addEventListener('submit', function(e) {
        e.preventDefault();

        // ... валидация ...

        const formData = {
            name: name,
            phone: phone,
            email: email || '',
            message: message || ''
        };

        const submitButton = form.querySelector('button[type="submit"]');
        const originalText = submitButton.textContent;
        submitButton.disabled = true;
        submitButton.textContent = 'Отправка...';

        fetch('http://localhost:3000/api/request', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                showMessage(form, 'Спасибо! Ваша заявка отправлена.', false);
                form.reset();
            } else {
                showMessage(form, 'Ошибка отправки. Попробуйте позже.', true);
            }
        })
        .catch(error => {
            showMessage(form, 'Ошибка отправки. Попробуйте позже.', true);
        })
        .finally(() => {
            submitButton.disabled = false;
            submitButton.textContent = originalText;
        });
    });
}
```

---

## 🟣 Вариант 4: Интеграция с CRM (AmoCRM, Битрикс24)

**Плюсы:**
- ✅ Автоматическое создание лидов
- ✅ Интеграция с бизнес-процессами
- ✅ История взаимодействий

**Минусы:**
- ⚠️ Требует настройки CRM
- ⚠️ Может быть платным

### Пример для AmoCRM:

```javascript
function handleFormSubmit(form, formName) {
    form.addEventListener('submit', function(e) {
        e.preventDefault();

        // ... валидация ...

        const leadData = {
            name: name,
            phone: phone,
            email: email || '',
            message: message || ''
        };

        // Отправка в AmoCRM через вебхук или API
        fetch('YOUR_AMOCRM_WEBHOOK_URL', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(leadData)
        })
        .then(response => response.json())
        .then(data => {
            showMessage(form, 'Спасибо! Ваша заявка принята.', false);
            form.reset();
        })
        .catch(error => {
            showMessage(form, 'Ошибка отправки. Попробуйте позже.', true);
        });
    });
}
```

---

## 📊 Сравнение вариантов

| Вариант | Сложность | Стоимость | Ограничения | Рекомендация |
|---------|-----------|-----------|-------------|--------------|
| EmailJS | ⭐ Легко | Бесплатно (200/мес) | 200 писем/мес | ✅ Для начала |
| Formspree | ⭐ Легко | Бесплатно (50/мес) | 50 заявок/мес | ✅ Простые сайты |
| Backend | ⭐⭐⭐ Сложно | Сервер | Нет | ✅ Для масштабирования |
| CRM | ⭐⭐ Средне | Зависит от CRM | Нет | ✅ Для бизнеса |

---

## 🚀 Рекомендация

**Для начала:** Используйте **EmailJS** (Вариант 1) - это самый простой и быстрый способ запустить систему заявок без backend.

**Для продакшена:** Рассмотрите собственный backend (Вариант 3) или интеграцию с CRM (Вариант 4) для большей надежности и функциональности.

---

## 🔒 Безопасность

Независимо от выбранного варианта:

1. **Валидация на клиенте** - уже реализована ✅
2. **Валидация на сервере** - обязательно для вариантов 3 и 4
3. **Защита от спама** - рассмотрите reCAPTCHA
4. **HTTPS** - обязательно для продакшена
5. **Не храните секретные ключи** в клиентском коде (для EmailJS используйте переменные окружения или настройте на сервере)

---

## 📝 Следующие шаги

1. Выберите подходящий вариант
2. Следуйте инструкциям по настройке
3. Протестируйте отправку заявок
4. Настройте уведомления
5. Добавьте аналитику (Google Analytics, Яндекс.Метрика)
