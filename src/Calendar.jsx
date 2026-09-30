import { content, schedule } from "./content.js";
import { formatMonthTitle, getMonthGrid, isPastDay, toISODate } from "./date.js";

export default function Calendar({ selectedDate, onSelect }) {
  const { year, month } = schedule;
  const cells = getMonthGrid(year, month);

  return (
    <div className="card calendar">
      <div className="calendar-head">
        <span className="calendar-month">{formatMonthTitle(year, month)}</span>
      </div>

      <div className="calendar-grid calendar-weekdays" aria-hidden="true">
        {content.weekdays.map((w, i) => (
          <span key={w} className={i >= 5 ? "is-weekend" : ""}>
            {w}
          </span>
        ))}
      </div>

      <div className="calendar-grid" role="grid" aria-label={formatMonthTitle(year, month)}>
        {cells.map((day, i) => {
          if (day === null) return <span key={`e${i}`} className="day day--empty" />;

          const iso = toISODate(year, month, day);
          const past = isPastDay(year, month, day);
          const selected = iso === selectedDate;
          const weekend = i % 7 >= 5;

          return (
            <button
              key={iso}
              type="button"
              className={[
                "day",
                selected && "is-selected",
                weekend && "is-weekend",
                past && "is-past",
              ]
                .filter(Boolean)
                .join(" ")}
              disabled={past}
              aria-pressed={selected}
              aria-label={`${day} ${formatMonthTitle(year, month)}`}
              onClick={() => onSelect(iso)}
            >
              {day}
            </button>
          );
        })}
      </div>
    </div>
  );
}
