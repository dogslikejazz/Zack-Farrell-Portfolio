// ─── Your films ─────────────────────────────────────────────
// Three kinds of entry, chosen by `source`:
//
//   source: 'youtube' — hosted on YouTube.
//     videoId: the part after watch?v= in the URL (e.g. 'aBc123XyZ').
//     thumb is optional (YouTube's own thumbnail is used automatically).
//
//   source: 'vimeo' — hosted on Vimeo.
//     videoId: the number in the Vimeo URL.
//     thumb: recommended (a 16:9 jpg in public/films/thumbs/).
//
//   source: 'local' — film isn't online yet.
//     Shows a "COMING SOON" card with your thumbnail, no player.
//     When you upload it (YouTube unlisted works great), switch
//     source to 'youtube' and add the videoId.
//
// Example YouTube entry (copy, uncomment, edit):
// {
//   id: 'my-film',
//   title: 'MY SHORT FILM',
//   role: 'Director / Editor',
//   year: 2026,
//   source: 'youtube',
//   videoId: 'PASTE_ID_HERE',
//   description: 'One or two lines about the project.',
// },

export const films = [
  {
    id: 'reel-01',
    title: 'UNTITLED PROJECT',
    role: 'Director',
    year: 2026,
    source: 'local',
    thumb: '/films/thumbs/placeholder-reel-01.svg',
    description: 'Replace me in src/content/films.js — see the notes at the top of that file.',
  },
  {
    id: 'reel-02',
    title: 'SECOND PROJECT',
    role: 'DP / Editor',
    year: 2025,
    source: 'local',
    thumb: '/films/thumbs/placeholder-reel-02.svg',
    description: 'Replace me in src/content/films.js — see the notes at the top of that file.',
  },
]
