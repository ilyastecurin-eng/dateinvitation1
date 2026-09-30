import { useCallback, useEffect, useRef, useState } from "react";
import IntroScreen from "./IntroScreen.jsx";
import DateQuestion from "./DateQuestion.jsx";
import ScheduleScreen from "./ScheduleScreen.jsx";
import BookingConfirmation from "./BookingConfirmation.jsx";
import DeclinedScreen from "./DeclinedScreen.jsx";
import { BackgroundSparkles } from "./CuteAnimation.jsx";
import { getBooking, saveBooking } from "./booking.js";

// Состояния приложения
export const SCREENS = {
  LOADING: "LOADING",
  INTRO: "INTRO",
  QUESTION: "QUESTION",
  DATE_SELECTION: "DATE_SELECTION",
  TIME_SELECTION: "TIME_SELECTION",
  CONFIRMATION: "CONFIRMATION",
  DECLINED: "DECLINED",
};

const LEAVE_MS = 280;

export default function App() {
  const [screen, setScreen] = useState(SCREENS.LOADING);
  const [leaving, setLeaving] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);
  const [booking, setBooking] = useState(null);
  const [saving, setSaving] = useState(false);
  const timer = useRef(null);

  // При открытии — проверяем, есть ли уже сохранённое свидание
  useEffect(() => {
    let alive = true;
    getBooking().then((saved) => {
      if (!alive) return;
      if (saved) {
        setBooking(saved);
        setSelectedDate(saved.date);
        setSelectedTime(saved.time);
        setScreen(SCREENS.CONFIRMATION);
      } else {
        setScreen(SCREENS.INTRO);
      }
    });
    return () => {
      alive = false;
      clearTimeout(timer.current);
    };
  }, []);

  // Плавный переход: сначала fade-out текущего экрана, потом показ следующего
  const go = useCallback((next) => {
    setLeaving(true);
    clearTimeout(timer.current);
    timer.current = setTimeout(() => {
      setScreen(next);
      setLeaving(false);
      window.scrollTo({ top: 0 });
    }, LEAVE_MS);
  }, []);

  function handleSelectDate(iso) {
    setSelectedDate(iso);
    setScreen(SCREENS.TIME_SELECTION); // тот же экран, просто открывается блок времени
  }

  async function handleConfirm() {
    if (!selectedDate || !selectedTime) return;
    setSaving(true);
    try {
      const saved = await saveBooking({ date: selectedDate, time: selectedTime });
      setBooking(saved);
      go(SCREENS.CONFIRMATION);
    } finally {
      setSaving(false);
    }
  }

  function renderScreen() {
    switch (screen) {
      case SCREENS.INTRO:
        return <IntroScreen onNext={() => go(SCREENS.QUESTION)} />;

      case SCREENS.QUESTION:
        return (
          <DateQuestion
            onYes={() => go(SCREENS.DATE_SELECTION)}
            onDecline={() => go(SCREENS.DECLINED)}
          />
        );

      case SCREENS.DECLINED:
        return <DeclinedScreen onRetry={() => go(SCREENS.QUESTION)} />;

      case SCREENS.DATE_SELECTION:
      case SCREENS.TIME_SELECTION:
        return (
          <ScheduleScreen
            selectedDate={selectedDate}
            selectedTime={selectedTime}
            onSelectDate={handleSelectDate}
            onSelectTime={setSelectedTime}
            onConfirm={handleConfirm}
            saving={saving}
          />
        );

      case SCREENS.CONFIRMATION:
        return booking ? (
          <BookingConfirmation
            booking={booking}
            onChange={() =>
              go(selectedDate ? SCREENS.TIME_SELECTION : SCREENS.DATE_SELECTION)
            }
          />
        ) : null;

      default:
        return null;
    }
  }

  // DATE_SELECTION и TIME_SELECTION — один визуальный экран,
  // поэтому ключ у них общий (без лишней анимации при выборе дня)
  const viewKey =
    screen === SCREENS.TIME_SELECTION ? SCREENS.DATE_SELECTION : screen;

  return (
    <div className="app">
      <BackgroundSparkles />
      <main className={`view ${leaving ? "is-leaving" : ""}`} key={viewKey}>
        {renderScreen()}
      </main>
    </div>
  );
}
