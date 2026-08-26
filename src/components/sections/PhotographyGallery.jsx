import { useState } from 'react'
import { photos } from '../../content/photos'
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

  return (
    <SectionShell index="01" sub="STILLS" title="PHOTOGRAPHY">
      {photos.length === 0 ? (
        <p className="empty-note">
          NO STILLS YET — drop exports in <code>photo-originals/</code> and run{' '}
          <code>npm run photos</code>.
        </p>
      ) : (
        <div className="masonry">
          {photos.map((photo, i) => (
            <figure key={photo.src} className="masonry-item">
              <button
                type="button"
                className="masonry-btn"
                onClick={() => setLightbox(i)}
                aria-label={`Open ${photo.alt}`}
              >
                <MasonryImage photo={photo} />
              </button>
              <figcaption>
                STILL {String(i + 1).padStart(2, '0')} — {photo.caption}
              </figcaption>
            </figure>
          ))}
        </div>
      )}
      {lightbox !== null && (
        <Lightbox index={lightbox} onClose={() => setLightbox(null)} onNav={setLightbox} />
      )}
    </SectionShell>
  )
}
