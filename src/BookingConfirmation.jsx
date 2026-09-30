import { content, schedule } from "./content.js";
import { buildICS, formatDayMonth, formatWeekday } from "./date.js";
import { Kitten } from "./CuteAnimation.jsx";

export default function BookingConfirmation({ booking, onChange }) {
  function downloadICS() {
    const ics = buildICS({
      date: booking.date,
      time: booking.time,
      title: content.calendarEventTitle,
      durationHours: schedule.eventDurationHours,
    });
    const url = URL.createObjectURL(new Blob([ics], { type: "text/calendar;charset=utf-8" }));
    const a = document.createElement("a");
    a.href = url;
    a.download = `svidanie-${booking.date}.ics`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }

  return (
    <section className="screen screen--center">
      <div className="stagger">
        <Kitten size={150} />
        <p className="eyebrow">{content.confirmationEyebrow}</p>
        <h1 className="title title--lg">{content.confirmationTitle}</h1>

        <div className="ticket">
          <span className="ticket-date">
            {formatDayMonth(booking.date)}, {booking.time}
          </span>
          <span className="ticket-weekday">{formatWeekday(booking.date)}</span>
        </div>

        <p className="subtitle confirmation-text">{content.confirmationText}</p>

        <div className="stack">
          <button className="btn btn--primary btn--block" onClick={downloadICS}>
            {content.calendarButton}
          </button>
          <button className="btn btn--ghost btn--block" onClick={onChange}>
            {content.changeButton}
          </button>
        </div>
      </div>
    </section>
  );
}
