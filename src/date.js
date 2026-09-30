// Небольшие помощники для работы с датами (без сторонних библиотек).

const MONTHS_GENITIVE = [
  "января", "февраля", "марта", "апреля", "мая", "июня",
  "июля", "августа", "сентября", "октября", "ноября", "декабря",
];

const MONTHS_NOMINATIVE = [
  "Январь", "Февраль", "Март", "Апрель", "Май", "Июнь",
  "Июль", "Август", "Сентябрь", "Октябрь", "Ноябрь", "Декабрь",
];

const WEEKDAYS_FULL = [
  "воскресенье", "понедельник", "вторник", "среда",
  "четверг", "пятница", "суббота",
];

const pad = (n) => String(n).padStart(2, "0");

/** "2026-10-15" из года, месяца (1–12) и дня. */
export function toISODate(year, month, day) {
  return `${year}-${pad(month)}-${pad(day)}`;
}

/** Разобрать "2026-10-15" в локальную дату (без сдвига часовых поясов). */
export function parseISODate(iso) {
  const [y, m, d] = iso.split("-").map(Number);
  return new Date(y, m - 1, d);
}

/** "15 октября" */
export function formatDayMonth(iso) {
  const d = parseISODate(iso);
  return `${d.getDate()} ${MONTHS_GENITIVE[d.getMonth()]}`;
}

/** "четверг" */
export function formatWeekday(iso) {
  return WEEKDAYS_FULL[parseISODate(iso).getDay()];
}

/** "Октябрь 2026" */
export function formatMonthTitle(year, month) {
  return `${MONTHS_NOMINATIVE[month - 1]} ${year}`;
}

/**
 * Ячейки календаря месяца, неделя начинается с понедельника.
 * Пустые ячейки в начале — null.
 */
export function getMonthGrid(year, month) {
  const first = new Date(year, month - 1, 1);
  const daysInMonth = new Date(year, month, 0).getDate();
  const offset = (first.getDay() + 6) % 7; // Пн = 0
  const cells = Array(offset).fill(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);
  return cells;
}

/** Дата уже прошла (сегодня — ещё не прошла). */
export function isPastDay(year, month, day) {
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  return new Date(year, month - 1, day) < today;
}

/** Файл .ics, чтобы добавить свидание в календарь телефона. */
export function buildICS({ date, time, title, durationHours }) {
  const [y, m, d] = date.split("-");
  const [hh, mm] = time.split(":").map(Number);
  const endH = hh + durationHours;
  const start = `${y}${m}${d}T${pad(hh)}${pad(mm)}00`;
  // Если конец переходит за полночь — переносим на следующий день
  const endDate = new Date(Number(y), Number(m) - 1, Number(d) + Math.floor(endH / 24));
  const end =
    `${endDate.getFullYear()}${pad(endDate.getMonth() + 1)}${pad(endDate.getDate())}` +
    `T${pad(endH % 24)}${pad(mm)}00`;

  return [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//date-invitation//RU",
    "BEGIN:VEVENT",
    `UID:${date}-${time.replace(":", "")}@date-invitation`,
    `DTSTAMP:${new Date().toISOString().replace(/[-:]/g, "").split(".")[0]}Z`,
    `DTSTART:${start}`,
    `DTEND:${end}`,
    `SUMMARY:${title}`,
    "END:VEVENT",
    "END:VCALENDAR",
  ].join("\r\n");
}
