// ─── Photo pipeline ─────────────────────────────────────────
// Turns full-res originals into everything the gallery needs.
//
//   npm run photos           process new/changed photos
//   npm run photos -- --force  regenerate everything
//
// Drop camera/Lightroom exports either into photo-originals/ or into
// public/photos/full (they'll be moved to photo-originals/ for you —
// that folder is gitignored, so 20MB masters never hit git or the site).
//
// Per original this generates:
//   public/photos/full/{name}.jpg        4500px long edge, q90, sRGB,
//                                        lightly sharpened (lightbox)
//   public/photos/thumbs/{name}-800.jpg / -1600.jpg   masonry srcset
//   public/photos/thumbs/{name}-800.webp / -1600.webp
// and records src/width/height per image in src/content/photos.json,
// which src/content/photos.js merges with your captions.

import { mkdir, readdir, rename, rm, stat, writeFile } from 'node:fs/promises'
import path from 'node:path'
import sharp from 'sharp'

const ROOT = path.resolve(import.meta.dirname, '..')
const ORIGINALS = path.join(ROOT, 'photo-originals')
const FULL = path.join(ROOT, 'public', 'photos', 'full')
const THUMBS = path.join(ROOT, 'public', 'photos', 'thumbs')
const MANIFEST = path.join(ROOT, 'src', 'content', 'photos.json')
const ORIGINAL_EXT = /\.(jpe?g|png|tiff?)$/i
const FORCE = process.argv.includes('--force')

const baseOf = (file) => file.replace(ORIGINAL_EXT, '')

for (const dir of [ORIGINALS, FULL, THUMBS]) await mkdir(dir, { recursive: true })

// ── 1. Sweep originals dropped into public/photos/full ──────
// A file there that isn't an output of a known original is a new master.
let originals = (await readdir(ORIGINALS)).filter((f) => ORIGINAL_EXT.test(f))
const knownBases = new Set(originals.map(baseOf))
for (const f of await readdir(FULL)) {
  if (ORIGINAL_EXT.test(f) && !knownBases.has(baseOf(f))) {
    await rename(path.join(FULL, f), path.join(ORIGINALS, f))
    console.log(`moved to photo-originals/: ${f}`)
  }
}
originals = (await readdir(ORIGINALS)).filter((f) => ORIGINAL_EXT.test(f)).sort()

// ── 2. Generate outputs ─────────────────────────────────────
const outputsOf = (base) => ({
  full: path.join(FULL, `${base}.jpg`),
  jpg800: path.join(THUMBS, `${base}-800.jpg`),
  jpg1600: path.join(THUMBS, `${base}-1600.jpg`),
  webp800: path.join(THUMBS, `${base}-800.webp`),
  webp1600: path.join(THUMBS, `${base}-1600.webp`),
})

async function mtime(file) {
  try {
    return (await stat(file)).mtimeMs
  } catch {
    return -1
  }
}

async function isStale(srcFile, outs) {
  if (FORCE) return true
  const srcTime = await mtime(srcFile)
  for (const out of Object.values(outs)) {
    if ((await mtime(out)) < srcTime) return true
  }
  return false
}

// Light sharpen after every resize — downscaling softens detail.
const resized = (input, px) =>
  sharp(input)
    .rotate() // bake EXIF orientation
    .resize(px, px, { fit: 'inside', withoutEnlargement: true })
    .sharpen({ sigma: 0.8, m1: 0.6, m2: 1.2 })

const manifest = []
for (const file of originals) {
  const base = baseOf(file)
  const src = path.join(ORIGINALS, file)
  const outs = outputsOf(base)

  if (await isStale(src, outs)) {
    console.log(`processing ${file} ...`)
    await resized(src, 4500).withIccProfile('srgb').jpeg({ quality: 90, mozjpeg: true }).toFile(outs.full)
    await resized(src, 800).jpeg({ quality: 82, mozjpeg: true }).toFile(outs.jpg800)
    await resized(src, 1600).jpeg({ quality: 82, mozjpeg: true }).toFile(outs.jpg1600)
    await resized(src, 800).webp({ quality: 80 }).toFile(outs.webp800)
    await resized(src, 1600).webp({ quality: 80 }).toFile(outs.webp1600)
  } else {
    console.log(`up to date: ${file}`)
  }

  const meta = await sharp(outs.full).metadata()
  manifest.push({
    name: base,
    file,
    src: `/photos/full/${base}.jpg`,
    width: meta.width,
    height: meta.height,
    thumbs: {
      jpg800: `/photos/thumbs/${base}-800.jpg`,
      jpg1600: `/photos/thumbs/${base}-1600.jpg`,
      webp800: `/photos/thumbs/${base}-800.webp`,
      webp1600: `/photos/thumbs/${base}-1600.webp`,
    },
  })
}

// ── 3. Remove outputs whose original is gone ────────────────
const validOutputs = new Set(
  manifest.flatMap((m) => Object.values(outputsOf(m.name)).map((p) => path.basename(p))),
)
for (const [dir, files] of [
  [FULL, await readdir(FULL)],
  [THUMBS, await readdir(THUMBS)],
]) {
  for (const f of files) {
    if (/\.(jpe?g|webp)$/i.test(f) && !validOutputs.has(f)) {
      await rm(path.join(dir, f))
      console.log(`removed orphan: ${f}`)
    }
  }
}

// ── 4. Write the manifest ───────────────────────────────────
await writeFile(MANIFEST, JSON.stringify(manifest, null, 2) + '\n')
console.log(`\n${manifest.length} photos → ${path.relative(ROOT, MANIFEST)}`)
console.log('Captions/alt text live in src/content/photos.js — new photos show as UNTITLED until you name them.')
