// ─────────────────────────────────────────────────────────────
//  Хранилище бронирования.
//
//  Сейчас данные лежат в localStorage — то есть ТОЛЬКО в браузере
//  того человека, который открыл сайт.
//
//  Чтобы подключить настоящую базу данных (Firebase, Supabase,
//  свой API и т. п.), достаточно написать новый адаптер с теми же
//  тремя методами и поменять одну строку: `const adapter = ...`.
//  Остальной код приложения менять не придётся — он работает
//  только через saveBooking / getBooking / clearBooking.
// ─────────────────────────────────────────────────────────────

const STORAGE_KEY = "date-invitation:booking";

/** Адаптер для localStorage (текущий). */
const localStorageAdapter = {
  async get() {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (!raw) return null;
      const data = JSON.parse(raw);
      return isValidBooking(data) ? data : null;
    } catch {
      return null;
    }
  },
  async save(booking) {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(booking));
    } catch {
      // Приватный режим или заблокированное хранилище —
      // сайт продолжит работать, просто не запомнит выбор.
    }
    return booking;
  },
  async clear() {
    try {
      window.localStorage.removeItem(STORAGE_KEY);
    } catch {
      /* ignore */
    }
  },
};

/*
  Пример адаптера для своего API (на будущее):

  const apiAdapter = {
    async get() {
      const res = await fetch("https://your-api.example.com/booking");
      return res.ok ? res.json() : null;
    },
    async save(booking) {
      const res = await fetch("https://your-api.example.com/booking", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(booking),
      });
      if (!res.ok) throw new Error("Не удалось сохранить");
      return res.json();
    },
    async clear() {
      await fetch("https://your-api.example.com/booking", { method: "DELETE" });
    },
  };
*/

const adapter = localStorageAdapter;

function isValidBooking(b) {
  return (
    b &&
    typeof b.date === "string" &&
    /^\d{4}-\d{2}-\d{2}$/.test(b.date) &&
    typeof b.time === "string" &&
    /^\d{2}:\d{2}$/.test(b.time)
  );
}

/**
 * Сохранить выбор.
 * @param {{ date: string, time: string }} booking  например { date: "2026-10-15", time: "19:00" }
 */
export async function saveBooking(booking) {
  if (!isValidBooking(booking)) throw new Error("Некорректные дата или время");
  return adapter.save({ date: booking.date, time: booking.time });
}

/** Получить сохранённый выбор или null. */
export async function getBooking() {
  return adapter.get();
}

/** Удалить сохранённый выбор. */
export async function clearBooking() {
  return adapter.clear();
}
