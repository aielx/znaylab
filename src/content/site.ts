// Контакты, реквизиты и точки интеграции. Правьте здесь — изменения подтянутся по всему сайту.

export const site = {
  name: 'ЗнайЛаб',
  tagline: 'образовательный центр',
  parentBrand: 'Интеллект',
  parentSite: 'https://intellect-deti.ru',

  phoneDisplay: '+7 901 560-64-65',
  phoneHref: 'tel:+79015606465',
  // Основной мессенджер — MAX. Впишите ссылку на аккаунт/чат (из MAX: аватар → QR → «Поделиться»)
  max: 'https://max.ru/znaylab',

  // Офлайн-адрес филиала упоминаем только в контактах, футере и SEO-разметке
  address: 'г. Ликино-Дулёво, ул. Ленина, 3 (мкр. Дулёво, ТД «Дулёво», 2 этаж)',
  addressShort: 'г. Ликино-Дулёво, ул. Ленина, 3',
  // Будни — основное время работы, выходные — по записи, когда есть занятия.
  hours: 'Пн–Пт 14:00–20:00 · Сб–Вс по расписанию занятий',

  // Ссылка на карточку организации в Яндекс.Картах (центр «Интеллект» — та же команда, тот же адрес).
  yandexMaps: 'https://yandex.ru/maps/org/intellekt/56229379267/reviews/?ll=39.055578%2C55.726912&mode=search&sctx=ZAAAAAgBEAAaKAoSCW0f8parzUJAEd3temmK3ktAEhIJKLhYUYNpxj8RGOyGbYsyqz8iBgABAgMEBSgKOABAnrEHSAFiOnJlYXJyPXNjaGVtZV9Mb2NhbC9HZW91cHBlci9BZHZlcnRzL0N1c3RvbU1heGFkdi9FbmFibGVkPTFiOnJlYXJyPXNjaGVtZV9Mb2NhbC9HZW91cHBlci9BZHZlcnRzL0N1c3RvbU1heGFkdi9NYXhhZHY9MTViRHJlYXJyPXNjaGVtZV9Mb2NhbC9HZW91cHBlci9BZHZlcnRzL0N1c3RvbU1heGFkdi9SZWdpb25JZHM9WzEsMTAxNzRdYkByZWFycj1zY2hlbWVfTG9jYWwvR2VvdXBwZXIvQWR2ZXJ0cy9NYXhhZHZUb3BNaXgvTWF4YWR2Rm9yTWl4PTEwagJydZ0BzczMPaABAKgBAL0BpNVBgcIBDMP5oLzRAcD7ranFBoICEtC40L3RgtC10LvQu9C10LrRgooCAJICAJoCDGRlc2t0b3AtbWFwcw%3D%3D&sll=39.022771%2C55.726912&sspn=0.347770%2C0.105539&tab=reviews&text=%D0%B8%D0%BD%D1%82%D0%B5%D0%BB%D0%BB%D0%B5%D0%BA%D1%82&z=13.01',
  // id организации в Яндекс.Картах — для виджета рейтинга и карты.
  yandexOrgId: '56229379267',

  // [ДЕМО] Реквизиты ИП. Приведены в правильном формате, но условные — замените на реальные
  // перед подачей заявки на интернет-эквайринг (используются в футере, на странице «Реквизиты»,
  // в оферте, политике, чеках). Банк проверяет совпадение реквизитов с ЕГРИП.
  legal: {
    entity: 'ИП Иванова Анна Сергеевна',
    inn: 'ИНН 501234567890',
    ogrnip: 'ОГРНИП 320500000000000',
    legalAddress: '140250, Московская область, г. Ликино-Дулёво, ул. Ленина, 3',
    email: 'info@znaylab.ru',
    checkingAccount: '40802810400000012345', // расчётный счёт (20 цифр)
    bankName: 'Филиал «Центральный» Банка ВТБ (ПАО)',
    bik: '044525411', // БИК банка (9 цифр)
    corrAccount: '30101810145250000411', // корреспондентский счёт (20 цифр)
  },

  // [ДЕМО] Наименование банка-эквайера для текстов оферты и страницы оплаты.
  // Пустая строка — нейтральная формулировка «платёжный провайдер».
  // После подключения впишите, например: 'ПАО Сбербанк' / 'АО «Т-Банк»'.
  paymentProvider: '',

  // ИНТЕГРАЦИИ — заполните при подключении (см. README):
  // id счётчика Яндекс.Метрики (число). Пустая строка — метрика отключена.
  metricaId: '',
  // Ссылка на оплату в CRM. После оплаты CRM должна вернуть пользователя на сайт:
  // успех — https://<домен>/oplata/uspekh, ошибка — https://<домен>/oplata/oshibka
  paymentUrl: '',
  // URL webhook для заявок (Telegram-бот / e-mail / CRM / Google Sheets). Пустая строка — заявки только в консоль браузера.
  leadWebhook: '',
};
