// Game kick-off hour (24h clock, local time).
export const KICKOFF_HOUR = 12;
// The game window ends here; from this hour the countdown restarts for tomorrow's kick-off.
export const RESET_HOUR = 14;

// Returns a Date at `hour`:00:00 on the day of `base` shifted by `dayOffset` days.
function atHour(base, hour, dayOffset = 0) {
  const d = new Date(base);
  d.setDate(d.getDate() + dayOffset);
  d.setHours(hour, 0, 0, 0);
  return d;
}

/**
 * Works out what the game is doing right now.
 * - 'playing'   : 12:00 -> 14:00, elapsedMs since kick-off
 * - 'countdown' : otherwise, remainingMs until the next 12:00.
 *                 The countdown restarts at 14:00 and runs until the next day's 12:00.
 */
export function getGameStatus(now) {
  const kickoffToday = atHour(now, KICKOFF_HOUR);
  const resetToday = atHour(now, RESET_HOUR);

  if (now >= kickoffToday && now < resetToday) {
    return {
      status: 'playing',
      remainingMs: 0,
      elapsedMs: now - kickoffToday,
      progress: 1,
    };
  }

  // A countdown cycle runs from the last reset (14:00) to the next kick-off (12:00).
  let cycleStart;
  let target;
  if (now < kickoffToday) {
    cycleStart = atHour(now, RESET_HOUR, -1); // yesterday 14:00
    target = kickoffToday;
  } else {
    cycleStart = resetToday; // today 14:00
    target = atHour(now, KICKOFF_HOUR, 1); // tomorrow 12:00
  }

  const span = target - cycleStart;
  return {
    status: 'countdown',
    remainingMs: target - now,
    elapsedMs: 0,
    // 0 at the reset, 1 at kick-off: how far through the current countdown we are
    progress: Math.min(1, Math.max(0, (now - cycleStart) / span)),
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
