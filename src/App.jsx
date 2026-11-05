import { useCallback, useEffect, useRef, useState } from 'react';
import BabyfootTable from './components/BabyfootTable.jsx';
import Confetti from './components/Confetti.jsx';
import { getGameStatus, splitDuration } from './utils/time.js';

const pad = (n) => String(n).padStart(2, '0');
const PREVIEW_MS = 8000;

function TimeUnit({ value, label }) {
  return (
    <div className="unit">
      {/* key changes every value -> the digit re-mounts and plays its "tick" animation */}
      <span key={value} className="digit">
        {pad(value)}
      </span>
      <span className="unit-label">{label}</span>
    </div>
  );
}

export default function App() {
  const [now, setNow] = useState(() => new Date());
  const [previewUntil, setPreviewUntil] = useState(0);
  const [burstId, setBurstId] = useState(null); // non-null while confetti is falling
  const prevStatus = useRef(null);

  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 250);
    return () => clearInterval(id);
  }, []);

  const game = getGameStatus(now);
  const previewing = now.getTime() < previewUntil;
  const isPlaying = game.status === 'playing' || previewing;

  // Fire the confetti the moment the countdown turns into "playing".
  useEffect(() => {
    if (prevStatus.current === 'countdown' && game.status === 'playing') {
      setBurstId(Date.now());
    }
    prevStatus.current = game.status;
  }, [game.status]);

  const handleConfettiDone = useCallback(() => setBurstId(null), []);

  const launchPreview = () => {
    setPreviewUntil(Date.now() + PREVIEW_MS);
    setBurstId(Date.now());
  };

  const remaining = splitDuration(game.remainingMs, Math.ceil);
  const elapsed = splitDuration(game.elapsedMs);
  const progressPct = Math.round(game.progress * 1000) / 10;

  return (
    <main className={`app ${isPlaying ? 'is-playing' : 'is-counting'}`}>
      <header className="header">
        <h1>Babyfoot Break</h1>
        <p className="subtitle">Games every day at 12:00–14:00 and 17:00–19:00</p>
      </header>

      {isPlaying ? (
        <section className="status" aria-live="polite">
          <h2 className="gameon-title">GAME ON!</h2>
          <p className="gameon-sub">
            {game.status === 'playing'
              ? `Match started ${pad(elapsed.hours)}:${pad(elapsed.minutes)}:${pad(elapsed.seconds)} ago`
              : 'Kick-off preview'}
          </p>
        </section>
      ) : (
        <section className="status">
          <p className="label">Time left until kick-off</p>
          <div className="clock" aria-label={`${remaining.hours} hours ${remaining.minutes} minutes ${remaining.seconds} seconds left`}>
            <TimeUnit value={remaining.hours} label="hours" />
            <span className="colon">:</span>
            <TimeUnit value={remaining.minutes} label="min" />
            <span className="colon">:</span>
            <TimeUnit value={remaining.seconds} label="sec" />
          </div>
          <div className="progress" role="progressbar" aria-valuemin={0} aria-valuemax={100} aria-valuenow={progressPct}>
            <div className="progress-fill" style={{ width: `${progressPct}%` }} />
            <span className="progress-ball" style={{ left: `${progressPct}%` }}>⚽</span>
          </div>
        </section>
      )}

      <BabyfootTable active={isPlaying} />

      <button type="button" className="kickoff-btn" onClick={launchPreview}>
        ⚽ Preview kick-off
      </button>

      {burstId !== null && <Confetti key={burstId} onDone={handleConfettiDone} />}
    </main>
  );
}
