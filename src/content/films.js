// ─── Your films ─────────────────────────────────────────────
// The Videography page has two walls:
//   group: 'films'   (default) — 16:9 cards, the main body of work
//   group: 'social'  — SOCIAL MEDIA wall, vertical 9:16 cards for
//                      reels / shorts / TikToks
//
// Four kinds of entry, chosen by `source`:
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
//   source: 'instagram' — a reel on Instagram (they can't be embedded
//     cleanly, so the card opens the post in a new tab).
//     url: the full post/reel URL.
//     thumb: required — a 9:16 jpg in public/films/thumbs/ (screenshot
//     the reel's cover; ~720px wide is plenty).
//
// Example social entry:
// {
//   id: 'reel-city',
//   group: 'social',
//   title: 'CITY AT NIGHT',
//   role: 'Shot / Edited',
//   year: 2026,
//   source: 'instagram',
//   url: 'https://www.instagram.com/reel/XXXXXXXXX/',
//   thumb: '/films/thumbs/reel-city.jpg',
// },
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
    id: 'knead-welcome',
    title: 'WELCOME TO KNEAD',
    role: 'Director / Editor',
    year: 2026,
    source: 'youtube',
    videoId: 'SKVmMpUL1K4',
    description:
      'Brand intro for Knead, a startup building a no-code, drag-and-drop builder for trading algorithms. The brief: loud, fast, deliberately over-the-top comedy for social. Concept through final cut.',
  },
]
