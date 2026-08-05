// ЗнайЛаб — единый JS-модуль лендинга (vanilla, без зависимостей).
// Цели Яндекс.Метрики: data-goal="имя_цели" → ym(id, 'reachGoal', имя).

const reachGoal = (name) => {
  if (window.__metricaId && typeof window.ym === 'function') {
    window.ym(Number(window.__metricaId), 'reachGoal', name);
  }
};

// Клики по элементам с data-goal
document.addEventListener('click', (e) => {
  const el = e.target.closest('[data-goal]');
  if (el) reachGoal(el.dataset.goal);
});

// ===== Мобильное меню =====
const burger = document.querySelector('.header__burger');
const menu = document.getElementById('nav-menu');
if (burger && menu) {
  burger.addEventListener('click', () => {
    const open = menu.classList.toggle('is-open');
    burger.setAttribute('aria-expanded', String(open));
    burger.setAttribute('aria-label', open ? 'Закрыть меню' : 'Открыть меню');
  });
  menu.addEventListener('click', (e) => {
    if (e.target.closest('a')) {
      menu.classList.remove('is-open');
      burger.setAttribute('aria-expanded', 'false');
    }
  });
}

// ===== Появление блоков по скроллу =====
const revealIO = new IntersectionObserver(
  (entries) => {
    for (const en of entries) {
      if (en.isIntersecting) {
        en.target.classList.add('is-visible');
        revealIO.unobserve(en.target);
      }
    }
  },
  { threshold: 0.12 }
);
document.querySelectorAll('.reveal').forEach((el) => revealIO.observe(el));

// ===== Анимированные счётчики =====
// В разметке уже стоит финальное значение (чтобы без JS число было корректным).
// Сбрасываем в 0 только когда JS активен, чтобы анимация шла от нуля к значению.
const fmt = (n, decimals) =>
  n.toLocaleString('ru-RU', { minimumFractionDigits: decimals, maximumFractionDigits: decimals });

const animateCount = (el) => {
  const target = parseFloat(el.dataset.count);
  const decimals = Number(el.dataset.decimals || 0);
  const duration = 1400;
  const t0 = performance.now();
  const step = (t) => {
    const p = Math.min((t - t0) / duration, 1);
    const eased = 1 - Math.pow(1 - p, 3);
    el.textContent = fmt(target * eased, decimals);
    if (p < 1) requestAnimationFrame(step);
  };
  requestAnimationFrame(step);
};

const countIO = new IntersectionObserver(
  (entries) => {
    for (const en of entries) {
      if (en.isIntersecting) {
        animateCount(en.target);
        countIO.unobserve(en.target);
      }
    }
  },
  { threshold: 0.6 }
);
document.querySelectorAll('[data-count]').forEach((el) => {
  el.textContent = fmt(0, Number(el.dataset.decimals || 0)); // сброс перед анимацией
  countIO.observe(el);
});

// ===== Маска телефона +7 (___) ___-__-__ =====
const applyPhoneMask = (input) => {
  const digits = input.value.replace(/\D/g, '').replace(/^[78]/, '');
  const d = digits.slice(0, 10);
  let out = '+7';
  if (d.length > 0) out += ` (${d.slice(0, 3)}`;
  if (d.length >= 3) out += ')';
  if (d.length > 3) out += ` ${d.slice(3, 6)}`;
  if (d.length > 6) out += `-${d.slice(6, 8)}`;
  if (d.length > 8) out += `-${d.slice(8, 10)}`;
  input.value = out;
};
document.querySelectorAll('[data-phone-mask]').forEach((input) => {
  input.addEventListener('input', () => applyPhoneMask(input));
  input.addEventListener('focus', () => {
    if (!input.value) input.value = '+7 ';
  });
});

const phoneValid = (v) => v.replace(/\D/g, '').length === 11;

// ===== Модальная форма заявки =====
const dialog = document.getElementById('lead-dialog');
const leadForm = document.getElementById('lead-form');
const leadDirection = document.getElementById('lead-direction');

document.querySelectorAll('[data-open-lead]').forEach((btn) => {
  btn.addEventListener('click', () => {
    if (btn.dataset.direction && leadDirection) leadDirection.value = btn.dataset.direction;
    dialog?.showModal();
  });
});
document.querySelector('[data-close-lead]')?.addEventListener('click', () => dialog?.close());
dialog?.addEventListener('click', (e) => {
  if (e.target === dialog) dialog.close(); // клик по подложке
});

// ===== Валидация форм =====
const validateForm = (form) => {
  let ok = true;
  form.querySelectorAll('input, select').forEach((el) => {
    let valid = el.checkValidity();
    if (el.type === 'tel' && el.required) valid = phoneValid(el.value);
    el.setAttribute('aria-invalid', String(!valid));
    if (!valid) ok = false;
  });
  return ok;
};

// ===== Отправка заявки (lead) =====
const LEAD_TIMEOUT = 12000; // 12 c — зависший запрос не вешает кнопку бесконечно

const showLeadError = (show = true) => {
  const err = leadForm?.querySelector('.form-error');
  if (err) err.classList.toggle('is-visible', show);
};

leadForm?.addEventListener('submit', async (e) => {
  e.preventDefault();
  if (!validateForm(leadForm)) return;
  showLeadError(false);
  const data = Object.fromEntries(new FormData(leadForm).entries());
  // Сервисные поля FormSubmit: тема письма + табличный шаблон.
  data._subject = 'Новая заявка с сайта ЗнайЛаб';
  data._template = 'table';
  data.page = location.href;
  const submitBtn = leadForm.querySelector('[type="submit"]');
  submitBtn.disabled = true;
  try {
    if (window.__leadWebhook) {
      const controller = new AbortController();
      const timer = setTimeout(() => controller.abort(), LEAD_TIMEOUT);
      try {
        const res = await fetch(window.__leadWebhook, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
          body: JSON.stringify(data),
          signal: controller.signal,
        });
        clearTimeout(timer);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
      } catch (fetchErr) {
        clearTimeout(timer);
        throw fetchErr;
      }
    } else {
      console.info('[ЗнайЛаб] webhook заявок не настроен (site.leadWebhook). Данные заявки:', data);
    }
    reachGoal('lead_success');
    leadForm.querySelector('.form-success').classList.add('is-visible');
    leadForm.querySelectorAll('input, select, [type="submit"]').forEach((el) => (el.disabled = true));
    setTimeout(() => dialog?.close(), 2600);
  } catch (err) {
    if (err.name === 'AbortError') console.error('Таймаут отправки заявки', err);
    else console.error('Ошибка отправки заявки', err);
    showLeadError(true);
    submitBtn.disabled = false;
  }
});

// ===== Форма онлайн-оплаты =====
// Оплата вынесена в CRM: кнопки «Оплатить занятия» — обычные ссылки на site.paymentUrl.
// CRM возвращает пользователя на /oplata/uspekh или /oplata/oshibka.

// ===== Кнопка «Наверх» =====
const toTop = document.querySelector('[data-back-to-top]');
if (toTop) {
  const toggleToTop = () => {
    const show = window.scrollY > 600;
    toTop.classList.toggle('is-show', show);
    toTop.hidden = !show;
  };
  toggleToTop();
  window.addEventListener('scroll', toggleToTop, { passive: true });
  toTop.addEventListener('click', () => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    window.scrollTo({ top: 0, behavior: reduce ? 'auto' : 'smooth' });
  });
}

// ===== Scrollspy: подсветка активного раздела в меню =====
const navLinks = Array.from(document.querySelectorAll('.header__menu a[href^="#"]'));
if (navLinks.length) {
  const sections = navLinks
    .map((a) => document.querySelector(a.getAttribute('href')))
    .filter(Boolean);
  const linkBySection = new Map();
  sections.forEach((sec, i) => linkBySection.set(sec, navLinks[i]));

  const setActive = (id) => {
    navLinks.forEach((a) => {
      const active = a.getAttribute('href') === `#${id}`;
      a.setAttribute('aria-current', active ? 'true' : 'false');
      a.classList.toggle('is-active', active);
    });
  };

  const spyIO = new IntersectionObserver(
    (entries) => {
      // Выбираем самый верхний видимый раздел
      const visible = entries.filter((e) => e.isIntersecting).sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
      if (visible[0]) setActive(visible[0].target.id);
    },
    { rootMargin: '-40% 0px -55% 0px', threshold: 0 }
  );
  sections.forEach((sec) => spyIO.observe(sec));
}

// ===== Cookie-уведомление =====
const cookieNotice = document.getElementById('cookie-notice');
if (cookieNotice) {
  try {
    if (!localStorage.getItem('znaylab_cookie_ok')) {
      cookieNotice.hidden = false;
      requestAnimationFrame(() => cookieNotice.classList.add('is-show'));
    }
  } catch {
    // localStorage недоступен (приватный режим) — не показываем баннер
  }
  const okBtn = cookieNotice.querySelector('[data-cookie-ok]');
  okBtn?.addEventListener('click', () => {
    try { localStorage.setItem('znaylab_cookie_ok', '1'); } catch {}
    cookieNotice.classList.remove('is-show');
    setTimeout(() => { cookieNotice.hidden = true; }, 300);
  });
}
