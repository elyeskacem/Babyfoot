import { useEffect, useMemo } from 'react';

const COLORS = ['#ffd43b', '#ff6b6b', '#4dabf7', '#69db7c', '#da77f2', '#ff922b'];
const LIFETIME_MS = 5000;

// Falling confetti burst, shown once when kick-off happens.
export default function Confetti({ onDone }) {
  const pieces = useMemo(
    () =>
      Array.from({ length: 120 }, (_, i) => ({
        id: i,
        left: Math.random() * 100,
        delay: Math.random() * 0.8,
        duration: 2.4 + Math.random() * 2.2,
        drift: (Math.random() - 0.5) * 240,
        rotate: Math.random() * 720 - 360,
        color: COLORS[i % COLORS.length],
      })),
    [],
  );

  useEffect(() => {
    const timer = setTimeout(onDone, LIFETIME_MS);
    return () => clearTimeout(timer);
  }, [onDone]);

  return (
    <div className="confetti" aria-hidden="true">
      {pieces.map((p) => (
        <span
          key={p.id}
          className="piece"
          style={{
            left: `${p.left}%`,
            background: p.color,
            animationDelay: `${p.delay}s`,
            animationDuration: `${p.duration}s`,
            '--drift': `${p.drift}px`,
            '--rot': `${p.rotate}deg`,
          }}
        />
      ))}
    </div>
  );
}
