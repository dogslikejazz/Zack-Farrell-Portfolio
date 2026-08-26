// ─── Your photography ───────────────────────────────────────
// Adding photos:
//   1. Drop full-res exports into photo-originals/ (or public/photos/full —
//      the script moves them for you)
//   2. Run `npm run photos` — generates web sizes + photos.json
//   3. Name them below. Anything you don't name shows as UNTITLED.
//
// photos.json is generated — don't edit it by hand. This file is where
// the human words live:
//   alt     = what's in the frame, for screen readers
//   caption = the line shown under the photo in the gallery

import manifest from './photos.json'

const meta = {
  // 'A6703618': { alt: 'What is in the frame', caption: 'SHOWN IN THE GALLERY' },
}

export const photos = manifest.map((m) => ({
  ...m,
  // Kept for anything still reading photo.thumb (single-thumbnail path)
  thumb: m.thumbs.jpg800,
  alt: meta[m.name]?.alt || `Photograph ${m.name}`,
  caption: meta[m.name]?.caption || 'UNTITLED',
}))
