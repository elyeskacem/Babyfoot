// Daily game windows (24h clock, local time). Each game runs from `start` to `end`.
export const GAME_WINDOWS = [
  { start: 12, end: 14 },
  { start: 17, end: 19 },
];

// Returns a Date at `hour`:00:00 on the day of `base` shifted by `dayOffset` days.
function atHour(base, hour, dayOffset = 0) {
  const d = new Date(base);
  d.setDate(d.getDate() + dayOffset);
  d.setHours(hour, 0, 0, 0);
  return d;
}

/**
 * Works out what the game is doing right now.
 * - 'playing'   : inside a game window -> elapsedMs since that game started
 * - 'countdown' : otherwise -> remainingMs until the next game starts.
 *                 Progress runs from the end of the last game to the next start.
 */
export function getGameStatus(now) {
  for (const w of GAME_WINDOWS) {
    const start = atHour(now, w.start);
    const end = atHour(now, w.end);
    if (now >= start && now < end) {
      return {
        status: 'playing',
        remainingMs: 0,
        elapsedMs: now - start,
        progress: 1,
      };
    }
  }

  // Look at yesterday, today and tomorrow so the next start / last end always exists.
  let nextStart = null;
  let lastEnd = null;
  for (const offset of [-1, 0, 1]) {
    for (const w of GAME_WINDOWS) {
      const start = atHour(now, w.start, offset);
      const end = atHour(now, w.end, offset);
      if (start > now && (nextStart === null || start < nextStart)) nextStart = start;
      if (end <= now && (lastEnd === null || end > lastEnd)) lastEnd = end;
    }
  }

  const span = nextStart - lastEnd;
  return {
    status: 'countdown',
    remainingMs: nextStart - now,
    elapsedMs: 0,
    // 0 right after a game ends, 1 when the next one starts
    progress: Math.min(1, Math.max(0, (now - lastEnd) / span)),
  };
}

/**
 * Splits a duration into hours / minutes / seconds.
 * `round` decides how partial seconds are shown: Math.ceil for a countdown
 * (so it reads 00:00:01 until the very end), Math.floor for elapsed time.
 */
export function splitDuration(ms, round = Math.floor) {
  const total = Math.max(0, round(ms / 1000));
  return {
    hours: Math.floor(total / 3600),
    minutes: Math.floor((total % 3600) / 60),
    seconds: total % 60,
  };
}
