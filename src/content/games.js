// ─── Your game projects ─────────────────────────────────────
// Each entry is one project card. Fields:
//
//   engine: 'Unity' | 'Unreal' | 'Godot' | anything — shown as a badge
//   status: 'released' — links row is shown
//           'wip'      — card shows an IN DEVELOPMENT tag instead
//   thumb: a 16:9 screenshot in public/games/thumbs/ (~1280px, ≤250KB)
//   links: where to play/see it. Any of these, all optional:
//     { label: 'PLAY', url: 'https://your-name.itch.io/game' }
//     { label: 'SOURCE', url: 'https://github.com/you/repo' }
//     { label: 'DEVLOG', url: '...' }
//
// Example released entry (copy, uncomment, edit):
// {
//   id: 'my-game',
//   title: 'MY GAME',
//   engine: 'Godot',
//   role: 'Solo Dev',
//   year: 2026,
//   status: 'released',
//   thumb: '/games/thumbs/my-game.jpg',
//   description: 'One or two lines — the hook, the mechanic, the vibe.',
//   links: [{ label: 'PLAY', url: 'https://your-name.itch.io/my-game' }],
// },

export const games = [
  {
    id: 'game-01',
    title: 'UNTITLED PROTOTYPE',
    engine: 'Unity',
    role: 'Solo Dev',
    year: 2026,
    status: 'wip',
    thumb: '/games/thumbs/placeholder-game-01.svg',
    description: 'Replace me in src/content/games.js — see the notes at the top of that file.',
    links: [],
  },
  {
    id: 'game-02',
    title: 'JAM ENTRY',
    engine: 'Godot',
    role: 'Design / Code',
    year: 2025,
    status: 'wip',
    thumb: '/games/thumbs/placeholder-game-02.svg',
    description: 'Replace me in src/content/games.js — see the notes at the top of that file.',
    links: [],
  },
]
