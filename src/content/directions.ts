// Направления обучения — карточки на лендинге и селект в форме заявки.
// photo — имя из src/content/photos.ts (null = карточка без фото).
export interface Direction {
  id: string;
  title: string;
  age: string;
  formats: string;
  promise: string;
  photo: string | null;
}

export const directions: Direction[] = [
  {
    id: 'school-prep',
    title: 'Подготовка к школе',
    age: '5–7 лет',
    formats: 'Мини-группы до 8 человек',
    promise: 'Ребёнок придёт в первый класс уверенным: читает, считает, умеет работать в группе.',
    photo: 'school-prep-class',
  },
  {
    id: 'school-subjects',
    title: 'Школьные предметы',
    age: '1–11 класс',
    formats: 'Группа или индивидуально',
    promise: 'Математика, русский, английский и другие предметы — подтянем оценки и закроем пробелы.',
    photo: 'english-girl-writing',
  },
  {
    id: 'oge-ege',
    title: 'Подготовка к ОГЭ и ЕГЭ',
    age: '8–11 класс',
    formats: 'Группа или индивидуально',
    promise: 'Системная подготовка к экзаменам и олимпиадам: план, пробники, разбор ошибок.',
    photo: 'english-teens-laughing',
  },
  {
    id: 'it-school',
    title: 'ИТ-школа и программирование',
    age: '7–17 лет',
    formats: 'Группы по возрастам',
    promise: 'Python, веб-разработка, создание игр — ребёнок сделает свой первый проект уже через месяц.',
    photo: 'it-classroom-wide',
  },
  {
    id: 'logoped',
    title: 'Логопед-дефектолог',
    age: '2–10 лет',
    formats: 'Индивидуально',
    promise: 'Постановка звуков, развитие речи, подготовка к школе — бережно и в игровой форме.',
    photo: 'logoped-class',
  },
  {
    id: 'psychologist',
    title: 'Детский психолог',
    age: '3–17 лет',
    formats: 'Индивидуально',
    promise: 'Поможем с адаптацией, тревожностью, мотивацией к учёбе — и поддержим родителей.',
    photo: 'psychologist-session',
  },
  {
    id: 'creative',
    title: 'Творческие мастерские',
    age: '3–14 лет',
    formats: 'Мини-группы',
    promise: 'Рисование, лепка, шахматы, рукоделие — занятия, с которых дети уходят с результатом в руках.',
    photo: 'art-group-paintings',
  },
  {
    id: 'dance-sport',
    title: 'Танцы и спорт',
    age: '3–14 лет',
    formats: 'Группы по возрастам',
    promise: 'Движение, дисциплина и радость: танцы, подвижные игры и спортивные активности.',
    photo: 'dance-class',
  },
];
