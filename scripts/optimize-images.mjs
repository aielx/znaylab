// Обработка фотоматериалов центра: переименование, ресайз, AVIF/WebP, генерация src/content/photos.ts
// Запуск: npm run images   (исходники в intellect/ не изменяются)
import sharp from 'sharp';
import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';

const SRC = 'intellect';
const OUT = 'public/images';

// [исходное имя файла, новое имя, категория, alt-текст]
const PHOTOS = [
  ['00jAyQcdYAJnrldWIqdVlMDIUX2vCVZqULSt5JFUzgQT0jON6aNiFB1cF45cqnzMITqT6CELTwSj3zyUL0tQL0y6.jpg', 'english-group-unionjack', 'english', 'Группа учеников на занятии английским языком в ЗнайЛаб'],
  ['0g5TjpjmlS58VLmxLuivAiMRQ39vLNuhUWXwEaoRDjq8kpvZn_P_pMbSu3pRlj4BbZPbaKV_Y1KPkgNgWtApP6mP.jpg', 'art-group-paintings', 'art', 'Дети показывают свои картины на занятии живописью'],
  ['528i9TpCwpwKapS0A7rIpHD7ggf8x6W9dWYZSOllrjByZmdjIZ4Gx6aSXU3aZzw7USTx6nCwQMMRsq-TxlPK-d5G.jpg', 'art-girl-applique', 'art', 'Девочка делает аппликацию на творческом занятии'],
  ['5dCggG4XpaSBfJe26k3ROUFaprm0uKk_6xEf2mGn0uInfqSyjT3qDRMsAFCt9u_UJTD2PeZbmCvS2vnp2XovIYyP.jpg', 'games-keep-it-steady', 'games', 'Девочки играют в настольную игру на логику'],
  ['6pa5XXVTpungCwhX11zSnfsyawFHMWww-KQckBH0YQ2vKcZviTp7id_oHrhljRVR-Ux7umD-3AEYD2clNTuy7_Ws.jpg', 'team-teachers-work', 'team', 'Педагоги центра за подготовкой к занятиям'],
  ['9t-h9H9GfhKspR7HM8wCSuQ5UFc59mPCrMeLRVSii1IoLTZgiz4MRNWsn5TPbzi2bj7QlRF1n8ZW1EynOvVvHv2g.jpg', 'it-boy-laptop', 'it', 'Ученик ИТ-школы за ноутбуком на занятии по программированию'],
  ['dRwvjn72QJ6vPksrkynH4HplQrgRrEyHZeI0cGvtAtOIizx1HpWz6D9d15VvSwrW0iwLd3Aq3ezTCnbWDwmBJWhp.jpg', 'art-girl-beads', 'art', 'Девочка плетёт брелоки из бисера на мастер-классе'],
  ['DrXDRWrbQEyp1xvSwNrJkwKdimazkzpcogt54vYyJqRjnNyvzEiKQqgABbF6QxQfyHgY_olKzkBPEc7wTd4ojRg7.jpg', 'english-teens-laughing', 'english', 'Подростки смеются на разговорном занятии английским'],
  ['_Eham8edL3dpLJgzGL1-KkzeRza8VZUOIn1dvWnO3i_xYXod7EiVO8xze76hE5C3jnnyLbO02rf5ofks0oIF9-yY.jpg', 'english-roleplay-doctor', 'english', 'Педагог играет с малышом в ролевую игру на английском'],
  ['fPMqdXGIasIyfYHn8jvQx3_af53EcESxyLpahfVNUdQpgKfUC_Molke9OBMwnPusGtVkOPzCCB5mKO5IMseIKUyb.jpg', 'art-fox-mask', 'art', 'Девочка с самодельной маской лисы из бумажной тарелки'],
  ['Gwtd4YCmxt6GHAgShbZA2O2Q0SrpMYFTvnwUPZl82l5bu48UJ2QfHpMOUHLVsxopGtpvozC6qAX1TH35o6zBwIMe.jpg', 'art-kid-floor-painting', 'art', 'Ребёнок смеётся рядом со своей картиной'],
  ['j9HjonagY62AgTSiNFqrAE4i3gggKwSJCq_66TwltXI5ZbY-3q4S7dKiiKjqKJN_DXH_D_nsLFcNEgOGqSkyc1xc.jpg', 'atmosphere-stick-insect', 'atmosphere', 'Дети рассматривают палочника на занятии о насекомых'],
  ['kIVljoewn_kQz-m6Zq0Lx3KWCu1l0oCZo_2AggA0jtAiNS8hyGX05lzuvcAQg58r2DCgPk59Df_qkByJwXDzj5Ui.jpg', 'games-dobble-boy', 'games', 'Мальчик увлечённо играет в «Доббль»'],
  ['lfj6G2pw0uG6G-cMF12N-A7MOh5vuSF_PFegf7bwUZjsqdlsbUTkNHfcMJpL2bDYUJrTbfn3Zm4vrVTwWed91r-0.jpg', 'art-cardboard-craft', 'art', 'Мальчики конструируют из картона на мастерской'],
  ['lQxLAvdV0v7rqifQaXNaYO6n15_Eq9ZmlACgiSQsz0Mq2TVkKAIWY1n6_q5Z23XM3Xo03ijKWKWHEANichi4hDFm.jpg', 'games-chess-boys', 'games', 'Мальчики играют в шахматы на занятии'],
  ['Mqm6TTR-xaVDGVVAdp0fgUZGGOWPcsQBfe90bdbw2Joju45gbo7H_3M7Oi1UpeHentFeYMnD_v_ae7dZtSzeI4tJ.jpg', 'atmosphere-pizza-class', 'atmosphere', 'Дети в поварских колпаках на кулинарном мастер-классе'],
  ['oHjWtNgSyQQ9varyfS-ho8-iXc9B-EB1h1zpB8NXrwXSpT6T-2deVfVYlhiJQH2AJsmJpX-Gfckax45-A5Ead59e.jpg', 'english-screen-quiz', 'english', 'Интерактивная викторина английских слов на занятии'],
  ['qd1nv8V269GqFa4jlrCSxNCvoT2DznVKeE0e2gwSTSmI6sUtSQoBMpiPrNZH6V19mTs3y71iJcf2bDIFO-XdyJXp.jpg', 'atmosphere-girls-playroom', 'atmosphere', 'Девочки веселятся в игровом зале центра'],
  ['ReernyOLDH5RFMB93bx7pNJS7kUijf6NIh1yOOiix7UQLn3_F2TT9Huezck5_e9Oupr8VJKECLjLICGD4NODnrEi.jpg', 'games-team-challenge', 'games', 'Командная игра на сообразительность'],
  ['rUmfqPy1t7rOwbpy715-M_o5cMC5VimtuASp8Hc0YSelT9R_03HOHjZ8jg_ht0lQdQFS_SN74b3kY7vkaE6xZYJi.jpg', 'english-girl-textbook-smile', 'english', 'Девочка смеётся над учебником английского языка'],
  ['uWlTYJL6VBcVk__EyVJHYtTE72VRZ1yQREkMcJCXhwDab9_0ViF2dPo1bBAle22ulv7BHA_jELc87hPrtgQKLWjT.jpg', 'english-finger-puppets', 'english', 'Девочка с пальчиковыми куклами на занятии английским'],
  ['xBL0kapfBIXJpwrU2ylDDoTHARRQ0XWAcu9ncpzSyDwTFeRvnHOhzXy-r2wvkzPSSeGW8Bb6YZ-V2szyefkaQrlJ.jpg', 'atmosphere-toddlers-blocks', 'atmosphere', 'Малыши играют с мягкими кубиками в игровой зоне'],
  ['xxNjzwXlR2J3ye80KpzAPEDTyJ89epAfajj241g-XiJMTvN0a_XczvMcNpcy8IunIdqFnoD4HMgpMVSO2oNd0Ex_.jpg', 'it-classroom-wide', 'it', 'ИТ-класс: ученики за ноутбуками на занятии по программированию'],
  ['Y7H7pGoobqRiDdliu6Q9RyW8XtewEpHt6Bs5lTMZkDNXZNLemUfAXuKx8JzIcq7GHkesJBgmTYg7HmOdOjZS42FZ.jpg', 'english-girl-writing', 'english', 'Девочка пишет в учебнике английского языка'],
  ['YZbbN3hF1GfAFfvyYbwbPJV3ACu-ag61QufPoz4GTtl0E7boJJyszzlpINlwnmsk2vzfkdqtFaWmM_s_z3WbXTZg.jpg', 'games-maze-girls', 'games', 'Девочки играют в деревянный лабиринт с шариком'],
  ['logoped.jpg', 'logoped-class', 'logoped', 'Логопед занимается с ребёнком постановкой звуков'],
  ['psixologicheskaya-pomoshh.png', 'psychologist-session', 'psychologist', 'Детский психолог на индивидуальном занятии'],
  ['dance.jpg', 'dance-class', 'dance', 'Дети на занятии танцами в ЗнайЛаб'],
  ['podgotovka shlola.jpg', 'school-prep-class', 'school', 'Дети на занятии по подготовке к школе в ЗнайЛаб'],
];

const WIDTHS = [640, 1024, 1600];
const HERO_WIDTHS = [640, 1024, 1600, 2560];
const HEROES = new Set(['english-group-unionjack', 'it-classroom-wide']);

await mkdir(OUT, { recursive: true });
await mkdir('src/content', { recursive: true });

const meta = [];

for (const [srcName, name, category, alt] of PHOTOS) {
  const srcPath = path.join(SRC, srcName);
  const img = sharp(srcPath).rotate(); // учитываем EXIF-ориентацию
  const { width: ow, height: oh } = await img.metadata();
  const widths = (HEROES.has(name) ? HERO_WIDTHS : WIDTHS).filter((w) => w <= ow);

  for (const w of widths) {
    const h = Math.round((oh / ow) * w);
    const resized = sharp(srcPath).rotate().resize(w, h);
    await resized.clone().avif({ quality: 55 }).toFile(path.join(OUT, `${name}-${w}.avif`));
    await resized.clone().webp({ quality: 72 }).toFile(path.join(OUT, `${name}-${w}.webp`));
  }

  meta.push({ name, category, alt, width: ow, height: oh, widths });
  console.log(`ok ${name} (${ow}x${oh}) → ${widths.join(', ')}`);
}

// og-image 1200×630 из hero-кадра
await sharp(path.join(SRC, PHOTOS[0][0]))
  .rotate()
  .resize(1200, 630, { fit: 'cover', position: 'attention' })
  .jpeg({ quality: 82 })
  .toFile(path.join(OUT, 'og-image.jpg'));
console.log('ok og-image.jpg');

const ts = `// СГЕНЕРИРОВАНО scripts/optimize-images.mjs — не редактировать вручную
export interface PhotoMeta {
  name: string;
  category: string;
  alt: string;
  width: number;
  height: number;
  widths: number[];
}

export const photos: PhotoMeta[] = ${JSON.stringify(meta, null, 2)};

export function srcset(name: string, ext: 'avif' | 'webp', widths: number[]): string {
  return widths.map((w) => \`/images/\${name}-\${w}.\${ext} \${w}w\`).join(', ');
}
`;

await writeFile('src/content/photos.ts', ts);
console.log('ok src/content/photos.ts');
