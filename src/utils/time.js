// Game kick-off hour (24h clock, local time).
export const KICKOFF_HOUR = 12;

/**
 * Works out what the game is doing right now.
 * - 'countdown': before today's 12:00 -> remainingMs until kick-off
 * - 'playing'  : from 12:00 until midnight -> elapsedMs since kick-off
 */
export function getGameStatus(now) {
  const kickoff = new Date(now);
  kickoff.setHours(KICKOFF_HOUR, 0, 0, 0);

  const dayStart = new Date(now);
  dayStart.setHours(0, 0, 0, 0);

  if (now < kickoff) {
    const daySpan = kickoff - dayStart;
    return {
      status: 'countdown',
      remainingMs: kickoff - now,
      elapsedMs: 0,
      // 0 at midnight, 1 at kick-off: how far we are through the countdown day
      progress: Math.min(1, Math.max(0, (now - dayStart) / daySpan)),
    };
  }

  return {
    status: 'playing',
    remainingMs: 0,
    elapsedMs: now - kickoff,
    progress: 1,
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
