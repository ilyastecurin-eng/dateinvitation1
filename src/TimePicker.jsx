import { content, schedule } from "./content.js";
import { formatDayMonth, formatWeekday } from "./date.js";

export default function TimePicker({ selectedDate, selectedTime, onSelect, onConfirm, saving }) {
  return (
    <div className="time-block">
      <h2 className="title title--md">{content.timeTitle}</h2>
      <p className="subtitle subtitle--small">
        {formatDayMonth(selectedDate)}, {formatWeekday(selectedDate)}
      </p>

      <div className="time-grid" role="radiogroup" aria-label={content.timeTitle}>
        {schedule.times.map((t) => {
          const selected = t === selectedTime;
          return (
            <button
              key={t}
              type="button"
              role="radio"
              aria-checked={selected}
              className={`time-card ${selected ? "is-selected" : ""}`}
              onClick={() => onSelect(t)}
            >
              {t}
            </button>
          );
        })}
      </div>

      <button
        className="btn btn--primary btn--large btn--block"
        disabled={!selectedTime || saving}
        onClick={onConfirm}
      >
        {content.confirmButton}
      </button>
    </div>
  );
}
