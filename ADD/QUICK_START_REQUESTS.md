# Быстрый старт: Система заявок с EmailJS

## 🚀 За 5 минут до работающей системы заявок

### Шаг 1: Регистрация в EmailJS (2 минуты)

1. Перейдите на [https://www.emailjs.com/](https://www.emailjs.com/)
2. Нажмите "Sign Up" и зарегистрируйтесь (бесплатно)
3. Подтвердите email

### Шаг 2: Настройка Email сервиса (1 минута)

1. В панели управления нажмите **"Add New Service"**
2. Выберите ваш email провайдер (Gmail, Outlook, Yahoo и т.д.)
3. Следуйте инструкциям для подключения
4. **Запишите Service ID** (например: `service_abc123`)

### Шаг 3: Создание шаблона письма (1 минута)

1. Перейдите в **"Email Templates"**
2. Нажмите **"Create New Template"**
3. Вставьте этот шаблон:

**Тема:**
```
Новая заявка с сайта Home3D
```

**Содержимое (HTML):**
```html
<h2>Новая заявка с сайта Home3D</h2>

<p><strong>Имя:</strong> {{name}}</p>
<p><strong>Телефон:</strong> {{phone}}</p>
<p><strong>Email:</strong> {{email}}</p>

<p><strong>Сообщение:</strong></p>
<p>{{message}}</p>

<hr>
<p style="color: #666; font-size: 12px;">Заявка отправлена с сайта Home3D</p>
```

4. **Запишите Template ID** (например: `template_xyz789`)

### Шаг 4: Получение Public Key (30 секунд)

1. Перейдите в **"Account" → "General"**
2. Найдите **"Public Key"**
3. **Запишите Public Key** (например: `abcdefghijklmnop`)

### Шаг 5: Подключение к сайту (30 секунд)

**1. Добавьте скрипт EmailJS в `<head>` всех HTML страниц:**

Откройте `index.html`, `technology.html`, `advantages.html` и т.д.

Найдите строку:
```html
<script src="js/main.js"></script>
```

Перед ней добавьте:
```html
<script src="https://cdn.jsdelivr.net/npm/@emailjs/browser@4/dist/email.min.js"></script>
```

**2. Обновите `js/main.js`:**

Найдите функцию `handleFormSubmit` (примерно строка 109) и замените её на:

```javascript
function handleFormSubmit(form, formName) {
    // Инициализация EmailJS
    emailjs.init("ВАШ_PUBLIC_KEY"); // Замените на ваш Public Key

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

        emailjs.send('ВАШ_SERVICE_ID', 'ВАШ_TEMPLATE_ID', templateParams)
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

**3. Замените три значения:**
- `ВАШ_PUBLIC_KEY` → ваш Public Key из шага 4
- `ВАШ_SERVICE_ID` → ваш Service ID из шага 2
- `ВАШ_TEMPLATE_ID` → ваш Template ID из шага 3

### Шаг 6: Тестирование

1. Откройте сайт в браузере
2. Заполните форму заявки
3. Нажмите "Отправить заявку"
4. Проверьте ваш email - должно прийти письмо с заявкой!

---

## ✅ Готово!

Теперь все заявки с сайта будут приходить на ваш email.

---

## 🔧 Дополнительные настройки

### Настройка получателя

В шаблоне EmailJS вы можете указать конкретный email получателя:

1. Откройте ваш шаблон в EmailJS
2. В поле "To Email" укажите: `info@home3d.ru` (или ваш email)
3. Сохраните шаблон

### Добавление дополнительных полей

Если в форме есть дополнительные поля (например, площадь дома), добавьте их в `templateParams`:

```javascript
const templateParams = {
    name: name,
    phone: phone,
    email: email || 'Не указан',
    message: message || 'Без сообщения',
    area: form.querySelector('[name="area"]')?.value || 'Не указана', // новое поле
    floors: form.querySelector('[name="floors"]')?.value || 'Не указано' // новое поле
};
```

И добавьте в шаблон EmailJS:
```html
<p><strong>Площадь:</strong> {{area}}</p>
<p><strong>Этажи:</strong> {{floors}}</p>
```

---

## 🚨 Решение проблем

**Проблема:** Заявки не отправляются
- ✅ Проверьте, что скрипт EmailJS подключен
- ✅ Проверьте правильность Public Key, Service ID и Template ID
- ✅ Откройте консоль браузера (F12) и проверьте ошибки

**Проблема:** Письма не приходят
- ✅ Проверьте папку "Спам"
- ✅ Проверьте настройки email сервиса в EmailJS
- ✅ Убедитесь, что email сервис правильно подключен

**Проблема:** Ошибка "EmailJS is not defined"
- ✅ Убедитесь, что скрипт EmailJS добавлен в `<head>` перед `main.js`
- ✅ Проверьте подключение к интернету

---

## 📊 Лимиты бесплатного тарифа

- **200 писем в месяц** - достаточно для начала
- Если нужно больше, рассмотрите платный тариф ($15/месяц = 1000 писем)

---

Подробная документация: см. `HOW_TO_IMPLEMENT_REQUESTS.md`
