import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

// Боевой домен. По умолчанию — znaylab.ru (custom domain на GitHub Pages).
// SITE_URL / SITE_BASE позволяют собирать превью на другом адресе без правки файла,
// например для проекта <user>.github.io/<repo>: SITE_URL=https://user.github.io SITE_BASE=/repo
const site = process.env.SITE_URL ?? 'https://znaylab.ru';
const base = process.env.SITE_BASE ?? '/';

export default defineConfig({
  site,
  base,
  integrations: [
    sitemap({
      // Return-страницы оплаты исключены из индексации (robots.txt) — не кладём их и в sitemap.
      // Сама страница /oplata (способы оплаты и возврата) индексируется.
      filter: (page) => !page.includes('/thanks') && !page.includes('/errorpay'),
    }),
  ],
  build: {
    inlineStylesheets: 'auto',
  },
});
