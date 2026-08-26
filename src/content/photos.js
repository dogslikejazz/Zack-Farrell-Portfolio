// ─── Your photography ───────────────────────────────────────
// Adding photos:
//   1. Drop full-res exports into photo-originals/ (or public/photos/full —
//      the script moves them for you)
//   2. Run `npm run photos` — generates web sizes + photos.json
//   3. Put the new name where you want it in `order` below
//
// photos.json is generated — don't edit it by hand. This file is where
// the human decisions live: order and (optional) words.

import manifest from './photos.json'

// Display order — first line shows first. Drag lines to reorder.
// A photo not listed here falls to the end (new drops land there
// until you slot them in).
const order = [
  'colorful-neighborhood',
  'santi-on-wall',
  'red-lips',
  'debates-over-beer',
  'josh-under-tree',
  'santi-on-bus',
  'santis-backyard',
  'josh-on-rock',
  'legs-over-ocean',
  'rocket-launch',
]

// Optional per-photo words. caption shows under the photo and in the
// lightbox; leave a photo out (or omit caption) for no title at all.
//   'santi-on-wall': { alt: 'What is in the frame', caption: 'SHOWN UNDER THE PHOTO' },
const meta = {}

const rank = (name) => {
  const i = order.indexOf(name)
  return i === -1 ? order.length : i
}

export const photos = [...manifest]
  .sort((a, b) => rank(a.name) - rank(b.name) || a.name.localeCompare(b.name))
  .map((m) => ({
    ...m,
    // Kept for anything still reading photo.thumb (single-thumbnail path)
    thumb: m.thumbs.jpg800,
    // Default alt = the original filename ("Santi on Wall") — already words
    alt: meta[m.name]?.alt || m.title || `Photograph ${m.name}`,
    caption: meta[m.name]?.caption || '',
  }))
