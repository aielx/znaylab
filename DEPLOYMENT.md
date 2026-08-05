# Развёртывание ЗнайЛаб — GitHub Pages + Google Sheets

Полное пошаговое руководство по публикации сайта на GitHub Pages с кастомным доменом и подключению приёма заявок через Google Таблицы. Рассчитано на выполнение без специальных знаний — каждый шаг конкретный.

---

## Содержание

1. [Что понадобится](#1-что-понадобится)
2. [Часть A. Публикация на GitHub Pages](#часть-a-публикация-на-github-pages)
3. [Часть B. Привязка домена znaylab.ru](#часть-b-привязка-домена-znaylabru)
4. [Часть C. Приём заявок через Google Sheets](#часть-c-приём-заявок-через-google-sheets) — включая **C7: уведомления на e-mail**
5. [Часть D. Обновления сайта](#часть-d-обновления-сайта)
6. [Решение проблем](#решение-проблем)

---

## 1. Что понадобится

- **Аккаунт GitHub** (бесплатный)
- **Код проекта** в репозитории `github.com/aielx/znaylab` (ветка `main`)
- **Домен `znaylab.ru`**, зарегистрированный у регистратора (Reg.ru)
- **Аккаунт Google** (для приёма заявок в Таблицы)
- Доступ к **личному кабинету Reg.ru** (управление DNS)

> 💡 **Всё бесплатно.** GitHub Pages бесплатен для публичных репозиториев. Google Sheets и Apps Script бесплатны. Сайт статический — без серверов и абонплаты.

---

## Часть A. Публикация на GitHub Pages

### A1. Репозиторий должен быть публичным

Проверьте: `github.com/aielx/znaylab` → **Settings → General → Danger Zone → Change visibility** должно быть «Public». Если стоит Private — Pages не будет работать бесплатно.

### A2. Включить GitHub Pages через Actions

1. Откройте `github.com/aielx/znaylab` → **Settings → Pages** (левое меню)
2. В разделе **Build and deployment**:
   - **Source:** выберите **«GitHub Actions»** (не «Deploy from a branch», не Jekyll)
3. В репозитории уже есть файл `.github/workflows/deploy.yml` — GitHub найдёт его автоматически

> ⚠️ **Важно:** выбрать именно общий пункт «GitHub Actions», а не «GitHub Pages Jekyll» или «Static HTML» из галереи. Иначе будет конфликт с нашим workflow.

### A3. Первый деплой

1. Сделайте `git push origin main` (или дождитесь автоматического при пуше)
2. Откройте вкладку **Actions** (верхнее меню репозитория)
3. Увидите workflow «Deploy to GitHub Pages» — он:
   - Установит зависимости (`npm ci`)
   - Соберёт сайт (`npm run build`)
   - Опубликует артефакт
4. Занимает 1–2 минуты. Зелёная галочка = успешно
5. После успеха сайт доступен по временному адресу **`https://aielx.github.io/znaylab/`**

> 📝 На этом этапе canonical/OG-теги уже указывают на `https://znaylab.ru` (настроено в `astro.config.mjs`), поэтому для финальной публикации нужен кастомный домен (Часть B).

---

## Часть B. Привязка домена znaylab.ru

Это нужно, чтобы сайт открывался по адресу `znaylab.ru`, а не `aielx.github.io/znaylab`.

### B1. DNS-записи у регистратора (Reg.ru)

Зайдите в личный кабинет Reg.ru → **Мои домены** → `znaylab.ru` → **Управление зоной** (или «Ресурсные записи»).

> ⚠️ **НЕ там, где NS-серверы** (`ns1.reg.ru`/`ns2.reg.ru`). Это другой раздел — NS оставьте как есть. Ищите «Управление зоной» / «DNS-зона» / «Ресурсные записи» — там таблица с типами A, CNAME, MX.

**Добавьте 4 A-записи** (по одной на каждый IP):

| Тип | Хост | Значение |
|-----|------|----------|
| `A` | `@` | `185.199.108.153` |
| `A` | `@` | `185.199.109.153` |
| `A` | `@` | `185.199.110.153` |
| `A` | `@` | `185.199.111.153` |

> `@` = корень домена (znaylab.ru без www). Если поле «Хост» обязательно, но `@` не принимается — оставьте пустым или впишите `znaylab.ru.` (с точкой).

> ⚠️ Если на корне (`@`) уже есть другая A-запись (старый хостинг) — **удалите её**. Должны остаться только эти 4 на GitHub.

**Опционально** — IPv6 (AAAA-записи), для совместимости:

| Тип | Хост | Значение |
|-----|------|----------|
| `AAAA` | `@` | `2606:50c0:8000::153` |
| `AAAA` | `@` | `2606:50c0:8001::153` |
| `AAAA` | `@` | `2606:50c0:8002::153` |
| `AAAA` | `@` | `2606:50c0:8003::153` |

**Опционально** — CNAME для www (чтобы `www.znaylab.ru` работал):

| Тип | Хост | Значение |
|-----|------|----------|
| `CNAME` | `www` | `aielx.github.io` |

> Значение `aielx.github.io` без `https://` и без слэша. Если есть старая запись на `www` — удалите её сначала.

> 📌 **Сверьте IP-адреса** с актуальной документацией GitHub: https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site/managing-a-custom-domain-for-your-github-pages-site — они редко, но меняются.

### B2. Указать домен на GitHub

1. `github.com/aielx/znaylab` → **Settings → Pages**
2. В поле **Custom domain** впишите `znaylab.ru` → **Save**
3. GitHub проверит DNS (от минут до часов)

> 📝 В репозитории уже есть файл `public/CNAME` со строкой `znaylab.ru`. Он нужен, чтобы GitHub «запоминал» домен при каждом деплое. Без него домен пришлось бы вписывать заново после каждого билда.

### B3. Включить HTTPS

1. После проверки DNS в **Settings → Pages** появится чекбокс **Enforce HTTPS**
2. Если он серый («Unavailable») — **подождите**. GitHub выпускает бесплатный сертификат Let's Encrypt автоматически (от минут до нескольких часов)
3. Когда чекбокс станет активным — **включите его**
4. Сайт теперь работает только по HTTPS с зелёным замочком: `https://znaylab.ru`

### B4. Проверить распространение DNS

Откройте https://dnschecker.org → введите `znaylab.ru`, тип `A`. Когда по всему миру появятся IP `185.199.108-111.153` — DNS готов (обычно 15–60 минут на Reg.ru).

---

## Часть C. Приём заявок через Google Sheets

Форма «Записаться» отправляет данные в Google Таблицу через Apps Script. Заявки появляются строками в таблице **и** приходят письмом на e-mail.

> 💡 Почему Google, а не FormSubmit/Telegram: эти сервисы **блокируются из России**. `script.google.com` работает стабильно. Бесплатно и без лимитов для небольшого трафика.

### C1. Создать Google Таблицу

1. Откройте https://sheets.new (создаст пустую таблицу)
2. Назовите, например, «Заявки ЗнайЛаб»

### C2. Добавить код Apps Script

1. В таблице: меню **Расширения (Extensions) → Apps Script**
2. Замените **весь** код в редакторе на:

```javascript
function doPost(e) {
  // Таблица с заголовками в первой строке
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  const headers = ['Дата', 'Имя родителя', 'Телефон', 'Возраст ребёнка', 'Направление', 'Страница'];
  if (sheet.getLastRow() === 0) sheet.appendRow(headers);

  let data = {};
  try {
    data = JSON.parse(e.postData.contents);
  } catch (err) {
    data = e.parameter;
  }

  const directionMap = {
    'school-prep': 'Подготовка к школе',
    'school-subjects': 'Школьные предметы',
    'oge-ege': 'ОГЭ и ЕГЭ',
    'it-school': 'ИТ-школа',
    'logoped': 'Логопед',
    'psychologist': 'Психолог',
    'creative': 'Творческие мастерские',
    'dance-sport': 'Танцы и спорт'
  };

  const row = [
    new Date().toLocaleString('ru-RU', { timeZone: 'Europe/Moscow' }),
    data.parentName || '',
    data.phone || '',
    data.childAge || '',
    directionMap[data.direction] || data.direction || '',
    data.page || ''
  ];
  sheet.appendRow(row);

  // Уведомление на e-mail при каждой заявке
  const subject = 'Новая заявка с сайта ЗнайЛаб';
  const body = 'Поступила новая заявка:\n\n' +
    'Имя: ' + row[1] + '\n' +
    'Телефон: ' + row[2] + '\n' +
    'Возраст ребёнка: ' + row[3] + '\n' +
    'Направление: ' + row[4] + '\n\n' +
    'Открыть таблицу: ' + SpreadsheetApp.getActiveSpreadsheet().getUrl();
  MailApp.sendEmail('aiexml@internet.ru', subject, body);

  return ContentService.createTextOutput(JSON.stringify({ success: true }))
    .setMimeType(ContentService.MimeType.JSON);
}
```

3. Замените `aiexml@internet.ru` на нужный e-mail для уведомлений (если другой)

### C3. Развернуть как веб-приложение

1. В редакторе Apps Script: **Начать развёртывание (Deploy) → Новое развёртывание**
2. Тип (значок ⚙️): выберите **«Веб-приложение» (Web app)**
3. Поля:
   - **Описание:** ЗнайЛаб форма
   - **Выполнять от имени (Execute as):** **«Me»** (ваш e-mail)
   - **Кому доступ (Who has access):** **«Anyone»** (Все)
4. **Начать развертывание** → предоставить разрешения (доступ к таблице и отправке почты — согласитесь)
5. Скопируйте **URL веб-приложения** (Web app URL) — выглядит как:
   ```
   https://script.google.com/macros/s/AKfycb.../exec
   ```

> ⚠️ **Обязательно** «Who has access: Anyone». Иначе форма с сайта получит отказ (только ваш аккаунт сможет обращаться).

### C4. Вписать URL в код сайта

Откройте `src/content/site.ts`, найдите поле `leadWebhook`, вставьте скопированный URL:

```ts
leadWebhook: 'https://script.google.com/macros/s/AKfycb.../exec',
```

Запушьте изменение (см. [Часть D](#часть-d-обновления-сайта)). После деплоя форма заработает.

### C5. Проверить

1. Откройте `https://znaylab.ru`, нажмите «Записаться», заполните форму
2. Заявка должна появиться строкой в Google Таблице (макс. через несколько секунд)
3. И прийти письмом на указанный e-mail

> 💡 **Как это работает технически:** форма отправляет POST с JSON на URL Apps Script. Заголовок `Content-Type: text/plain` (а не `application/json`) — это намеренно: так браузер не делает CORS preflight (OPTIONS-запрос), который Apps Script не умеет обрабатывать. JSON всё равно парсится из `postData.contents`.

### C6. При обновлении кода Apps Script

Если измените код в Apps Script — нужно **новое развёртывание** с тем же URL:
1. **Deploy → Manage deployments** → выберите существующее → **Edit** (карандаш)
2. **Version:** New version → **Deploy**
3. URL останется прежним, обновления подхватятся

> ⚠️ Если просто сохранить код в редакторе без нового развёртывания — изменения **не применятся** на проде. Apps Script хранит версии.

### C7. Уведомления на e-mail (настройка и проверка)

Код Apps Script из раздела C2 **уже отправляет** письмо при каждой заявке — через `MailApp.sendEmail(...)`. Если заявка попала в Google Таблицу, значит и письмо ушло. Если письмо не пришло — проверьте по шагам ниже.

**Где искать письмо:**
1. Ящик `aiexml@internet.ru` (или тот, что указан в коде Apps Script в строке `MailApp.sendEmail(...)`)
2. **Папка «Спам» / «Нежелательная почта»** — письма от `apps-scripts-notifier-extension@google.com` часто попадают туда, особенно первые 1–2 раза
3. Папка **«Промоакции» / «Оповещения»** (если ящик на Mail.ru / Яндекс — проверьте все вкладки)

**Отправитель письма:** `apps-scripts-notifier-extension@google.com`
**Тема:** `Новая заявка с сайта ЗнайЛаб`

**Как изменить e-mail для уведомлений:**

1. Откройте Apps Script (в таблице: **Расширения → Apps Script**)
2. Найдите строку (ближе к концу кода):
   ```javascript
   MailApp.sendEmail('aiexml@internet.ru', subject, body);
   ```
3. Замените e-mail на нужный, например:
   ```javascript
   MailApp.sendEmail('admin@znaylab.ru', subject, body);
   ```
4. Можно указать **несколько адресов** сразу:
   ```javascript
   MailApp.sendEmail('admin@znaylab.ru, director@znaylab.ru', subject, body);
   ```
5. **Создайте новое развёртывание** (Deploy → Manage deployments → Edit → Version: New version → Deploy), иначе изменение не подействует

**Как проверить, что отправка работает:**

1. Отправьте тестовую заявку с сайта (заполните форму «Записаться»)
2. Убедитесь, что строка появилась в Google Таблице (значит `doPost` отработал)
3. Проверьте почту (включая Спам) — должно прийти письмо со всеми полями заявки

**Если письмо не приходит, хотя в таблице есть:**

1. Откройте Apps Script → **Executions** (Выполнения, иконка часов слева)
2. Найдите последнее выполнение `doPost` — если рядом красный значок ошибки, разверните лог
3. Частые причины:
   - **Неверный e-mail** (опечатка) → ошибка `Invalid email`
   - **Превышен лимит** (100 писем/день на бесплатном аккаунте Google) → ошибка о квоте
   - **E-mail не подтверждён** в аккаунте Google → проверьте настройки аккаунта
4. Проверьте ограничения `MailApp`: на бесплатном аккаунте — 100 писем в день, на Google Workspace — 1500. Для лендинга этого более чем достаточно.

**Как сделать письмо красивее (опционально):**

Если хотите HTML-форматирование вместо простого текста, замените `MailApp.sendEmail(...)` на версию с HTML:

```javascript
const htmlBody = '<div style="font-family:sans-serif;max-width:500px;margin:0 auto;padding:20px;">' +
  '<h2 style="color:#2563eb;">Новая заявка с сайта ЗнайЛаб</h2>' +
  '<table style="border-collapse:collapse;width:100%;">' +
  '<tr><td style="padding:8px;border:1px solid #e2e8f0;font-weight:600;">Имя</td><td style="padding:8px;border:1px solid #e2e8f0;">' + row[1] + '</td></tr>' +
  '<tr><td style="padding:8px;border:1px solid #e2e8f0;font-weight:600;">Телефон</td><td style="padding:8px;border:1px solid #e2e8f0;">' + row[2] + '</td></tr>' +
  '<tr><td style="padding:8px;border:1px solid #e2e8f0;font-weight:600;">Возраст ребёнка</td><td style="padding:8px;border:1px solid #e2e8f0;">' + row[3] + '</td></tr>' +
  '<tr><td style="padding:8px;border:1px solid #e2e8f0;font-weight:600;">Направление</td><td style="padding:8px;border:1px solid #e2e8f0;">' + row[4] + '</td></tr>' +
  '</table>' +
  '<p style="margin-top:16px;color:#475569;font-size:14px;">Открыть таблицу: <a href="' + SpreadsheetApp.getActiveSpreadsheet().getUrl() + '">' + SpreadsheetApp.getActiveSpreadsheet().getUrl() + '</a></p>' +
  '</div>';

MailApp.sendEmail({
  to: 'aiexml@internet.ru',
  subject: subject,
  htmlBody: htmlBody
});
```

Не забудьте **новое развёртывание** после изменения.

---

## Часть D. Обновления сайта

После первоначальной настройки любые изменения публикуются **одной командой**:

```bash
git add .
git commit -m "описание изменения"
git push origin main
```

GitHub автоматически:
1. Запустит workflow «Deploy to GitHub Pages»
2. Пересоберёт сайт (`npm ci` + `npm run build`)
3. Опубликует новую версию

Занимает 1–2 минуты. Никаких ручных действий больше не нужно. Домен, HTTPS, всё остальное сохраняется.

### Что можно менять без программиста

| Что | Где | Как |
|-----|-----|-----|
| Тексты, цены, отзывы, FAQ | `src/content/` | отредактировать `.ts` файлы |
| Телефон, адрес, реквизиты | `src/content/site.ts` | поля `phoneDisplay`, `address`, `legal` |
| Часы работы | `src/content/site.ts` | поле `hours` |
| id Яндекс.Метрики | `src/content/site.ts` | поле `metricaId` |
| Ссылка на оплату в CRM | `src/content/site.ts` | поле `paymentUrl` |
| URL заявок (Google Sheets) | `src/content/site.ts` | поле `leadWebhook` |
| Фото занятий | `intellect/` → `npm run images` | добавить JPG, строку в `PHOTOS`, запустить скрипт |

После любых правок — `git push origin main`.

---

## Решение проблем

### Сайт не открывается по znaylab.ru
1. Проверьте DNS: https://dnschecker.org → `znaylab.ru`, тип `A`. Должны быть `185.199.108-111.153`
2. Если DNS пустой — A-записи не добавлены/не применились в Reg.ru
3. Если DNS есть, но сайт не открывается — проверьте **Settings → Pages**, что домен сохранён

### «There isn't a GitHub Pages site here»
- Деплой упал или Pages не включён
- **Settings → Pages → Source** должно быть **«GitHub Actions»** (не branch, не Jekyll)
- Вкладка **Actions** — проверьте, что последний workflow зелёный. Если красный — откройте, посмотрите ошибку

### Enforce HTTPS недоступен (серый)
- Нормально в первые часы. GitHub выпускает сертификат Let's Encrypt автоматически
- Подождите до 24 часов. Если дольше — проверьте, что DNS правильно настроен и домен привязан

### Картинки/шрифты не загружаются (404)
- Файлы из `public/` (шрифты, изображения, иконки) должны быть закоммичены в git
- Проверьте: `git ls-files public/fonts/ | wc -l` — должно быть не 0
- После добавления — `git push origin main`, дождитесь деплоя

### Форма заявки не отправляется (таймаут)
- Проверьте, что `leadWebhook` в `src/content/site.ts` заполнен корректным URL Apps Script
- URL должен заканчиваться на `/exec`
- В Apps Script: «Who has access: **Anyone**» (не «Anyone with Google account»)
- Проверьте, что есть новое развёртывание (Deploy → Manage deployments)

### Заявка отправляется, но не приходит в Таблицу/на почту
- Откройте Apps Script → **Executions** (Выполнения) — увидите ошибки выполнения
- Проверьте, что e-mail в коде (`MailApp.sendEmail(...)`) правильный
- Проверьте папку «Спам» в почте

### Метрика не считает посещения
- Проверьте, что `metricaId` в `site.ts` заполнен (например, `111322374`)
- Откройте код страницы на сайте — найдите `ym(111322374, 'init', ...)` — должен присутствовать
- В интерфейсе Метрики проверьте счётчик

---

## Краткая шпаргалка

```bash
# Деплой после изменений
git add .
git commit -m "описание"
git push origin main

# Пересборка изображений после добавления фото
npm run images

# Локальный запуск для разработки
npm run dev
```

**Ключевые файлы:**
- `src/content/site.ts` — все контакты, реквизиты, интеграции (одно место на весь сайт)
- `.github/workflows/deploy.yml` — автоматический деплой
- `public/CNAME` — кастомный домен `znaylab.ru`
- `astro.config.mjs` — `site` и `base` (через `SITE_URL`/`SITE_BASE` env)
