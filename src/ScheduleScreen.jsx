import { useEffect, useRef } from "react";
import { content } from "./content.js";
import Calendar from "./Calendar.jsx";
import TimePicker from "./TimePicker.jsx";

/**
 * Экран выбора: сначала день (DATE_SELECTION),
 * после выбора дня появляется блок времени (TIME_SELECTION).
 */
export default function ScheduleScreen({
  selectedDate,
  selectedTime,
  onSelectDate,
  onSelectTime,
  onConfirm,
  saving,
}) {
  const timeRef = useRef(null);

  // После выбора дня мягко прокручиваем к блоку времени (важно на телефоне)
  useEffect(() => {
    if (!selectedDate || !timeRef.current) return;
    const rect = timeRef.current.getBoundingClientRect();
    if (rect.bottom > window.innerHeight) {
      timeRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [selectedDate]);

  return (
    <section className="screen screen--top">
      <div className="stagger">
        <h1 className="title title--lg">{content.dateTitle}</h1>
        <p className="subtitle">{content.dateSubtitle}</p>

        <Calendar selectedDate={selectedDate} onSelect={onSelectDate} />

        <div ref={timeRef} className="time-anchor">
          {selectedDate ? (
            <TimePicker
              key={selectedDate}
              selectedDate={selectedDate}
              selectedTime={selectedTime}
              onSelect={onSelectTime}
              onConfirm={onConfirm}
              saving={saving}
            />
          ) : (
            <p className="hint">{content.timeHint}</p>
          )}
        </div>
      </div>
    </section>
  );
}
