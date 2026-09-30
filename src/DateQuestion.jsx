import { useState } from "react";
import { content } from "./content.js";
import { HeartBurst } from "./CuteAnimation.jsx";

const BURST_MS = 1400;

export default function DateQuestion({ onYes, onDecline }) {
  const [noCount, setNoCount] = useState(0);
  const [noOffset, setNoOffset] = useState({ x: 0, y: 0 });
  const [celebrating, setCelebrating] = useState(false);

  const reactions = content.noReactions;
  const reaction = noCount > 0 ? reactions[Math.min(noCount, reactions.length) - 1] : "";

  // «Да» плавно растёт с каждым «Нет», но не бесконечно
  const yesGrow = Math.min(noCount, 6);
  // «Нет» чуть уменьшается, но всегда остаётся нажимаемым
  const noScale = Math.max(1 - noCount * 0.04, 0.82);

  function handleNo() {
    if (celebrating) return;
    // Фразы закончились — уважаем выбор
    if (noCount >= reactions.length) {
      onDecline();
      return;
    }
    setNoCount((n) => n + 1);
    // Небольшое случайное смещение — кнопка остаётся в зоне видимости
    setNoOffset({
      x: Math.round((Math.random() - 0.5) * 80),
      y: Math.round(Math.random() * 22 - 6),
    });
  }

  function handleYes() {
    if (celebrating) return;
    setCelebrating(true);
    window.setTimeout(onYes, BURST_MS);
  }

  return (
    <section className="screen screen--center">
      <div className="stagger">
        <h1 className="title title--xl question-title">
          {content.question}{" "}
          <span className="question-emoji" aria-hidden="true">
            {content.questionEmoji}
          </span>
        </h1>

        <p className="reaction" aria-live="polite" key={noCount}>
          {reaction || " "}
        </p>

        <div className="answer-row">
          <button
            className={`btn btn--primary btn--yes ${celebrating ? "is-celebrating" : ""}`}
            style={{ "--grow": yesGrow }}
            onClick={handleYes}
          >
            {content.yesButton}
          </button>

          <button
            className="btn btn--ghost btn--no"
            style={{
              transform: `translate(${noOffset.x}px, ${noOffset.y}px) scale(${noScale})`,
            }}
            onClick={handleNo}
            disabled={celebrating}
          >
            {content.noButton}
          </button>
        </div>
      </div>

      {celebrating && <HeartBurst />}
    </section>
  );
}
