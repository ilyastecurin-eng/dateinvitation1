import { useMemo } from "react";

/** Маленькое «бьющееся» сердечко. */
export function PulsingHeart({ size = 44 }) {
  return (
    <svg
      className="pulse-heart"
      width={size}
      height={size}
      viewBox="0 0 32 32"
      aria-hidden="true"
    >
      <path
        d="M16 28C4 20 2 12 7 7.5 10.6 4.3 14.4 6 16 9c1.6-3 5.4-4.7 9-1.5C30 12 28 20 16 28z"
        fill="currentColor"
      />
    </svg>
  );
}

/**
 * Котёнок с сердечком — минималистичная линейная иллюстрация.
 * Цвета берутся из CSS-переменных, поэтому легко меняются в styles.css.
 */
export function Kitten({ size = 150 }) {
  return (
    <svg
      className="kitten"
      width={size}
      height={size}
      viewBox="0 0 160 160"
      aria-hidden="true"
    >
      {/* тело */}
      <ellipse cx="80" cy="120" rx="38" ry="28" fill="var(--kitten-fill)" />
      {/* хвост */}
      <path
        className="kitten-tail"
        d="M116 124c16 0 24-12 18-24"
        stroke="var(--kitten-line)"
        strokeWidth="3.5"
        fill="none"
        strokeLinecap="round"
      />
      {/* голова */}
      <path
        d="M46 78c0-22 15-36 34-36s34 14 34 36-15 32-34 32-34-10-34-32z"
        fill="var(--kitten-fill)"
      />
      {/* ушки */}
      <path d="M50 64l-4-26 22 14z" fill="var(--kitten-fill)" />
      <path d="M110 64l4-26-22 14z" fill="var(--kitten-fill)" />
      <path d="M52 58l-2-13 10 7z" fill="var(--kitten-ear)" />
      <path d="M108 58l2-13-10 7z" fill="var(--kitten-ear)" />
      {/* глазки — закрытые, довольные */}
      <path
        d="M62 78q5-5 10 0M88 78q5-5 10 0"
        stroke="var(--kitten-line)"
        strokeWidth="3"
        fill="none"
        strokeLinecap="round"
      />
      {/* щёчки */}
      <circle cx="60" cy="88" r="5" fill="var(--kitten-ear)" opacity=".8" />
      <circle cx="100" cy="88" r="5" fill="var(--kitten-ear)" opacity=".8" />
      {/* носик и ротик */}
      <path d="M77 85h6l-3 3z" fill="var(--kitten-line)" />
      <path
        d="M80 88q-3 5-7 3M80 88q3 5 7 3"
        stroke="var(--kitten-line)"
        strokeWidth="2"
        fill="none"
        strokeLinecap="round"
      />
      {/* лапки держат сердце */}
      <g className="kitten-heart">
        <path
          d="M80 142c-15-9-18-17-14-22 3-4 9-4 14 1 5-5 11-5 14-1 4 5 1 13-14 22z"
          fill="var(--accent)"
        />
      </g>
      <ellipse cx="64" cy="128" rx="8" ry="6" fill="var(--kitten-fill)" />
      <ellipse cx="96" cy="128" rx="8" ry="6" fill="var(--kitten-fill)" />
    </svg>
  );
}

/** Конфетти из сердечек — короткий «салют» после ответа «Да». */
export function HeartBurst({ count = 34 }) {
  const hearts = useMemo(
    () =>
      Array.from({ length: count }, (_, i) => {
        const angle = (Math.PI * 2 * i) / count + Math.random() * 0.4;
        const distance = 120 + Math.random() * 180;
        return {
          id: i,
          x: Math.cos(angle) * distance,
          y: Math.sin(angle) * distance - 60,
          rotate: Math.random() * 90 - 45,
          scale: 0.6 + Math.random() * 0.9,
          delay: Math.random() * 120,
          glyph: ["♥", "♥", "♥", "✦", "❀"][i % 5],
        };
      }),
    [count]
  );

  return (
    <div className="heart-burst" aria-hidden="true">
      {hearts.map((h) => (
        <span
          key={h.id}
          className="heart-particle"
          style={{
            "--x": `${h.x}px`,
            "--y": `${h.y}px`,
            "--r": `${h.rotate}deg`,
            "--s": h.scale,
            animationDelay: `${h.delay}ms`,
          }}
        >
          {h.glyph}
        </span>
      ))}
    </div>
  );
}

/** Едва заметные плавающие искорки на фоне. */
export function BackgroundSparkles() {
  const items = useMemo(
    () =>
      Array.from({ length: 9 }, (_, i) => ({
        id: i,
        left: 6 + ((i * 97) % 88),
        top: 8 + ((i * 53) % 80),
        delay: (i * 1.3) % 6,
        glyph: ["✦", "♥", "·"][i % 3],
      })),
    []
  );
  return (
    <div className="sparkles" aria-hidden="true">
      {items.map((s) => (
        <span
          key={s.id}
          style={{ left: `${s.left}%`, top: `${s.top}%`, animationDelay: `${s.delay}s` }}
        >
          {s.glyph}
        </span>
      ))}
    </div>
  );
}
