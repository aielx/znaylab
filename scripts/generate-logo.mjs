// Генератор логотипа «ЗнайЛаб» на основе исходного вектора «Интеллекта» (intellect/ЛОГО.eps).
// Эмблема: теневая голова + бирюзовая голова + белая сеть узлов — точные векторные контуры,
// извлечённые в scripts/head-paths.mjs. Рядом — словесный знак ЗНАЙЛАБ.
// Запуск: node scripts/generate-logo.mjs
// Результат: public/brand/{logo.svg, logo-mono.svg, favicon.svg,
//            emblem.svg, emblem-mono.svg (голова без текста)} + PWA-иконки (PNG):
//            apple-touch-icon-180.png, icon-192.png, icon-512.png, icon-512-maskable.png
import { writeFile, mkdir } from 'node:fs/promises';
import sharp from 'sharp';
import { shadow, head, network } from './head-paths.mjs';

// Габариты эмблемы в исходном пространстве EPS (union bbox головы, тени и сети)
const VB = { x: 500, y: 230, w: 1790, h: 2180 }; // слегка расширенный bbox x[544,2236] y[277,2355]

const COLORS = {
  shadow: '#185F82', // фирменный тёмный сине-бирюзовый «Интеллекта»
  teal: '#31BFC9',
  tealDark: '#0E9AA8',
  text: '#0F172A',
  sub: '#475569',
};

function emblemGroup({ mono = false } = {}) {
  const headFill = mono
    ? 'currentColor'
    : `<defs><linearGradient id="zl-head" x1="0" y1="0" x2="0.35" y2="1">
        <stop offset="0" stop-color="${COLORS.teal}"/><stop offset="1" stop-color="${COLORS.tealDark}"/>
      </linearGradient></defs>`;
  const shadowFill = mono ? 'currentColor' : COLORS.shadow;
  const netStroke = mono ? 'currentColor' : '#FFFFFF';
  const netFill = mono ? 'currentColor' : '#FFFFFF';
  return `${mono ? '' : headFill}
    <path d="${shadow}" fill="${shadowFill}"${mono ? ' opacity="0.35"' : ''}/>
    <path d="${head}" fill="${mono ? 'currentColor' : 'url(#zl-head)'}"/>
    ${mono ? '' : `<path d="${network}" fill="${netFill}" stroke="${netStroke}" stroke-width="6"/>`}`;
}

// Вложенный svg масштабирует эмблему из пространства EPS в 100×100
function emblem({ mono = false, x = 0, y = 0, size = 100 } = {}) {
  return `<svg x="${x}" y="${y}" width="${size * (VB.w / VB.h)}" height="${size}" viewBox="${VB.x} ${VB.y} ${VB.w} ${VB.h}">
${emblemGroup({ mono })}
</svg>`;
}

const wordmark = (color, sub, x) => `
  <text x="${x}" y="60" font-family="Manrope, 'Golos Text', Inter, system-ui, sans-serif" font-weight="800" font-size="38" letter-spacing="1" fill="${color}">ЗНАЙЛАБ</text>
  <text x="${x + 1}" y="82" font-family="Manrope, 'Golos Text', Inter, system-ui, sans-serif" font-weight="500" font-size="13" letter-spacing="0.4" fill="${sub}">образовательный центр</text>`;

const emblemW = Math.round(100 * (VB.w / VB.h)); // ≈ 82
const logoW = emblemW + 20 + 240;

const logo = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${logoW} 100" role="img" aria-label="ЗнайЛаб — образовательный центр">
${emblem()}
${wordmark(COLORS.text, COLORS.sub, emblemW + 18)}
</svg>
`;

const logoMono = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${logoW} 100" role="img" aria-label="ЗнайЛаб — образовательный центр">
${emblem({ mono: true })}
${wordmark('currentColor', 'currentColor', emblemW + 18)}
</svg>
`;

// Фавикон: круглый градиентный бейдж с белым силуэтом головы (как знак «Интеллекта»).
const favicon = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
<defs><linearGradient id="zl-favbg" x1="0" y1="0" x2="1" y2="1">
  <stop offset="0" stop-color="${COLORS.teal}"/><stop offset="1" stop-color="#2563EB"/>
</linearGradient></defs>
<circle cx="50" cy="50" r="48" fill="url(#zl-favbg)"/>
<svg x="17" y="14" width="${72 * (VB.w / VB.h)}" height="72" viewBox="${VB.x} ${VB.y} ${VB.w} ${VB.h}">
  <path d="${shadow}" fill="#FFFFFF" opacity="0.4"/>
  <path d="${head}" fill="#FFFFFF"/>
</svg>
</svg>
`;

// ===== PWA-иконки (PNG): квадрат с градиентным фоном и белой эмблемой головы =====
// apple-touch-icon-180 — без прозрачности (iOS сам накладывает скругление);
// icon-192 / icon-512 — обычные; icon-512-maskable — с внутренними отступами под «maskable».
const BG_W = 1200; // единый SVG-холст рендерится в PNG нужного размера через sharp

const bgRect = `<defs><linearGradient id="zl-pwa" x1="0" y1="0" x2="1" y2="1">
    <stop offset="0" stop-color="${COLORS.teal}"/><stop offset="1" stop-color="#2563EB"/>
  </linearGradient></defs>`;

// Эмблема вписана в холст; padding управляет долей поля вокруг (для maskable — больше).
function pwaSvg({ pad }) {
  const size = 100 - pad * 2; // доля холста под эмблему
  const x = pad;
  const y = pad;
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${BG_W}" height="${BG_W}" viewBox="0 0 100 100">
${bgRect}
<rect x="0" y="0" width="100" height="100" fill="url(#zl-pwa)"/>
<svg x="${x}" y="${y}" width="${size * (VB.w / VB.h)}" height="${size}" viewBox="${VB.x} ${VB.y} ${VB.w} ${VB.h}">
  <path d="${shadow}" fill="#FFFFFF" opacity="0.4"/>
  <path d="${head}" fill="#FFFFFF"/>
</svg>
</svg>`;
}

// ===== Эмблема без текста (только голова) — цветная и монохромная =====
// viewBox = bounding box головы (VB), квадратный холст. Для отдельного использования:
// иконки, аватары, печать, водяные знаки, favicon-замена.
const emblemOnly = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${VB.x} ${VB.y} ${VB.w} ${VB.h}" role="img" aria-label="Эмблема ЗнайЛаб">
${emblemGroup()}
</svg>
`;

const emblemOnlyMono = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${VB.x} ${VB.y} ${VB.w} ${VB.h}" role="img" aria-label="Эмблема ЗнайЛаб">
${emblemGroup({ mono: true })}
</svg>
`;

await mkdir('public/brand', { recursive: true });
await writeFile('public/brand/logo.svg', logo);
await writeFile('public/brand/logo-mono.svg', logoMono);
await writeFile('public/brand/favicon.svg', favicon);
await writeFile('public/brand/emblem.svg', emblemOnly);
await writeFile('public/brand/emblem-mono.svg', emblemOnlyMono);

const pwaIcon = (svg, px, file) =>
  sharp(Buffer.from(svg)).resize(px, px).png().toFile(`public/brand/${file}`);

const stdSvg = pwaSvg({ pad: 18 });
const maskableSvg = pwaSvg({ pad: 26 }); // безопасная зона для maskable-иконок

await Promise.all([
  pwaIcon(stdSvg, 180, 'apple-touch-icon-180.png'),
  pwaIcon(stdSvg, 192, 'icon-192.png'),
  pwaIcon(stdSvg, 512, 'icon-512.png'),
  pwaIcon(maskableSvg, 512, 'icon-512-maskable.png'),
]);

console.log('ok public/brand/{logo.svg,logo-mono.svg,favicon.svg,emblem.svg,emblem-mono.svg} + PWA-иконки');
