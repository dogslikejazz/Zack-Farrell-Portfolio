import { useMemo, useState } from 'react'
import { photos } from '../../content/photos'
import useMedia from '../../hooks/useMedia'
import SectionShell from './SectionShell'
import Lightbox from './Lightbox'

// Matches the masonry column widths: 1 col below 760px, 2 to 1100px, then 3
const THUMB_SIZES = '(max-width: 760px) 92vw, (max-width: 1100px) 46vw, 30vw'

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

export default function PhotographyGallery() {
  const [lightbox, setLightbox] = useState(null)
  const oneCol = useMedia('(max-width: 760px)')
  const twoCol = useMedia('(max-width: 1100px)')
  const colCount = oneCol ? 1 : twoCol ? 2 : 3

  // Balanced masonry done in JS instead of CSS columns: each photo goes to
  // the currently-shortest column (heights known up front from the
  // manifest), so the layout is deterministic and photos keep display
  // order — CSS columns rebalanced as images lazy-loaded and left the
  // last column short partway down the page.
  const columns = useMemo(() => {
    const cols = Array.from({ length: colCount }, () => ({ h: 0, items: [] }))
    photos.forEach((photo, index) => {
      const col = cols.reduce((a, b) => (b.h < a.h ? b : a))
      col.items.push({ photo, index })
      col.h += photo.width && photo.height ? photo.height / photo.width : 1
    })
    return cols.map((c) => c.items)
  }, [colCount])

  return (
    <SectionShell index="01" sub="STILLS" title="PHOTOGRAPHY">
      {photos.length === 0 ? (
        <p className="empty-note">
          NO STILLS YET — drop exports in <code>photo-originals/</code> and run{' '}
          <code>npm run photos</code>.
        </p>
      ) : (
        <div className="masonry">
          {columns.map((items, c) => (
            <div key={c} className="masonry-col">
              {items.map(({ photo, index }) => (
                <figure key={photo.src} className="masonry-item">
                  <button
                    type="button"
                    className="masonry-btn"
                    onClick={() => setLightbox(index)}
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
      )}
      {lightbox !== null && (
        <Lightbox index={lightbox} onClose={() => setLightbox(null)} onNav={setLightbox} />
      )}
    </SectionShell>
  )
}
