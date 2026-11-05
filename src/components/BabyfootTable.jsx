// Top-down SVG babyfoot table.
// `active` = the match is on: rods spin fast and the ball runs across the table.
// Otherwise the rods wobble gently and the ball bobs in the middle.

const RED = '#e03131';
const BLUE = '#1c7ed6';

// Y position of each rod (4 rods) and how many players sit on it.
const RODS = [
  { y: 95, count: 2 },
  { y: 165, count: 3 },
  { y: 235, count: 5 },
  { y: 305, count: 2 },
];

// Spread `count` players evenly along the rod (x from 120 to 680).
function playerXs(count) {
  if (count === 1) return [400];
  return Array.from({ length: count }, (_, i) => 120 + i * (560 / (count - 1)));
}

export default function BabyfootTable({ active }) {
  const mode = active ? 'run' : 'idle';

  return (
    <svg
      className={`table ${active ? 'is-active' : 'is-idle'}`}
      viewBox="0 0 800 400"
      role="img"
      aria-label="Babyfoot table"
    >
      <defs>
        <linearGradient id="wood" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#b5773f" />
          <stop offset="1" stopColor="#6b3f1f" />
        </linearGradient>
        <linearGradient id="grass" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#40c057" />
          <stop offset="1" stopColor="#2b8a3e" />
        </linearGradient>
      </defs>

      {/* cabinet + playing field */}
      <rect x="0" y="0" width="800" height="400" rx="28" fill="url(#wood)" />
      <rect x="28" y="28" width="744" height="344" rx="10" fill="url(#grass)" />

      {/* pitch markings */}
      <line x1="400" y1="28" x2="400" y2="372" stroke="#fff" strokeOpacity="0.7" strokeWidth="3" />
      <circle cx="400" cy="200" r="50" fill="none" stroke="#fff" strokeOpacity="0.7" strokeWidth="3" />

      {/* goals */}
      <rect x="6" y="140" width="22" height="120" rx="4" fill="#111" />
      <rect x="772" y="140" width="22" height="120" rx="4" fill="#111" />

      {/* rods */}
      {RODS.map((rod) => (
        <line
          key={`rod-${rod.y}`}
          x1="28"
          x2="772"
          y1={rod.y}
          y2={rod.y}
          stroke="#dee2e6"
          strokeWidth="5"
          strokeLinecap="round"
        />
      ))}

      {/* players: each rod turns, so each figure spins around its rod */}
      {RODS.map((rod, rodIndex) =>
        playerXs(rod.count).map((x, i) => (
          <rect
            key={`player-${rodIndex}-${i}`}
            className={`player ${active ? 'kick' : 'wobble'}`}
            x={x - 7}
            y={rod.y - 22}
            width="14"
            height="44"
            rx="6"
            fill={i % 2 === 0 ? RED : BLUE}
            style={{
              transformOrigin: `${x}px ${rod.y}px`,
              animationDelay: `${rodIndex * 0.12 + i * 0.07}s`,
            }}
          />
        )),
      )}

      {/* ball */}
      <g className={`ball-track ${mode}`}>
        <circle cx="400" cy="200" r="10" fill="#fff" stroke="#343a40" strokeWidth="2" />
      </g>
    </svg>
  );
}
