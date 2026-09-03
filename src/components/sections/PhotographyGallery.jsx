import { useMemo, useState } from 'react'
import { photos, isPortrait } from '../../content/photos'
import useMedia from '../../hooks/useMedia'
import SectionShell from './SectionShell'
import Lightbox from './Lightbox'

// Matches the masonry column widths: 1 col below 760px, 2 to 1100px, then 3
// (portraits get a 4th column on desktop — see colCount below)
const THUMB_SIZES = '(max-width: 760px) 92vw, (max-width: 1100px) 46vw, 30vw'

// Mixing orientations in one masonry made the tall frames read as odd
// interruptions, so each orientation gets its own wall. `photos` is already
// sorted landscape-then-portrait (content/photos.js), so the manifest index
// stays global and the lightbox walks the whole set in page order.
const GROUPS = [
  { key: 'landscape', label: 'LANDSCAPE', test: (p) => !isPortrait(p) },
  { key: 'portrait', label: 'PORTRAIT', test: isPortrait },
].map((g) => ({
  ...g,
  items: photos.map((photo, index) => ({ photo, index })).filter(({ photo }) => g.test(photo)),
}))

function MasonryImage({ photo }) {
  // Generated photos carry srcset variants; hand-added entries may not
  if (!photo.thumbs) return <img src={photo.thumb} alt={photo.alt} loading="lazy" />
  return (
    <picture>
      <source
        type="image/webp"
        srcSet={`${photo.thumbs.webp800} 800w, ${photo.thumbs.webp1600} 1600w`}
        sizes={THUMB_SIZES}
      />
      <img
        src={photo.thumbs.jpg800}
        srcSet={`${photo.thumbs.jpg800} 800w, ${photo.thumbs.jpg1600} 1600w`}
        sizes={THUMB_SIZES}
        width={photo.width}
        height={photo.height}
        alt={photo.alt}
        loading="lazy"
      />
    </picture>
  )
}

// Balanced masonry done in JS instead of CSS columns: each photo goes to
// the currently-shortest column (heights known up front from the
// manifest), so the layout is deterministic and photos keep display
// order — CSS columns rebalanced as images lazy-loaded and left the
// last column short partway down the page.
function balance(items, colCount) {
  const cols = Array.from({ length: colCount }, () => ({ h: 0, items: [] }))
  for (const item of items) {
    const { photo } = item
    const col = cols.reduce((a, b) => (b.h < a.h ? b : a))
    col.items.push(item)
    col.h += photo.width && photo.height ? photo.height / photo.width : 1
  }
  return cols.map((c) => c.items)
}

function Masonry({ items, colCount, onOpen }) {
  const columns = useMemo(() => balance(items, colCount), [items, colCount])
  return (
    <div className="masonry">
      {columns.map((col, c) => (
        <div key={c} className="masonry-col">
          {col.map(({ photo, index }) => (
            <figure key={photo.src} className="masonry-item">
              <button
                type="button"
                className="masonry-btn"
                onClick={() => onOpen(index)}
                aria-label={`Open ${photo.alt}`}
              >
                <MasonryImage photo={photo} />
              </button>
              {photo.caption && (
                <figcaption>
                  STILL {String(index + 1).padStart(2, '0')} — {photo.caption}
                </figcaption>
              )}
            </figure>
          ))}
        </div>
      ))}
    </div>
  )
}

export default function PhotographyGallery() {
  const [lightbox, setLightbox] = useState(null)
  const oneCol = useMedia('(max-width: 760px)')
  const twoCol = useMedia('(max-width: 1100px)')
  const colCount = oneCol ? 1 : twoCol ? 2 : 3
  // Portraits are already tall — one extra column keeps them from towering
  const portraitCols = oneCol ? 1 : twoCol ? 3 : 4

  const groups = GROUPS.filter((g) => g.items.length > 0)

  return (
    <SectionShell index="01" sub="STILLS" title="PHOTOGRAPHY">
      {photos.length === 0 ? (
        <p className="empty-note">
          NO STILLS YET — drop exports in <code>photo-originals/</code> and run{' '}
          <code>npm run photos</code>.
        </p>
      ) : (
        groups.map((g, i) => (
          <section key={g.key} className="orient-group" aria-label={`${g.label} photographs`}>
            {/* One group = no header needed; two = label each wall */}
            {groups.length > 1 && (
              <p className={`slate-row orient-label${i === 0 ? ' orient-label-first' : ''}`}>
                <span>{g.label}</span>
                <span className="slate-divider" aria-hidden="true" />
                <span>{String(g.items.length).padStart(2, '0')}</span>
              </p>
            )}
            <Masonry
              items={g.items}
              colCount={g.key === 'portrait' ? portraitCols : colCount}
              onOpen={setLightbox}
            />
          </section>
        ))
      )}
      {lightbox !== null && (
        <Lightbox index={lightbox} onClose={() => setLightbox(null)} onNav={setLightbox} />
      )}
    </SectionShell>
  )
}
