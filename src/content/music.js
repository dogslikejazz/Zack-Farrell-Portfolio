// ─── Your music ─────────────────────────────────────────────
// Four kinds of entry, chosen by `source`:
//
//   source: 'spotify' — on Spotify.
//     embedId: from the share link. 'track/4uLU6hMC...' works, and so do
//     'album/...' and 'playlist/...'. A bare id is treated as a track.
//
//   source: 'soundcloud' — on SoundCloud.
//     embedId: the FULL public track URL, e.g.
//     'https://soundcloud.com/your-name/your-track'
//
//   source: 'youtube' — on YouTube.
//     embedId: the part after watch?v= in the URL.
//
//   source: 'local' — track isn't online yet.
//     Shows a "COMING SOON" card with your cover art, no player.
//
// cover: a square image in public/music/covers/ (~800px, ≤200KB).
//   Optional for youtube/spotify but recommended — it's what shows
//   before the player loads.
//
// Example Spotify entry (copy, uncomment, edit):
// {
//   id: 'my-track',
//   title: 'MY TRACK',
//   role: 'Producer',
//   year: 2026,
//   source: 'spotify',
//   embedId: 'track/PASTE_ID_HERE',
//   cover: '/music/covers/my-track.jpg',
//   description: 'One or two lines about the track.',
// },

// Empty = the section page shows its COMING SOON panel.
export const tracks = []
