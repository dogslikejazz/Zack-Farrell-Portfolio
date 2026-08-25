import { useState } from 'react'
import { photos } from '../../content/photos'
import SectionShell from './SectionShell'
import Lightbox from './Lightbox'

export default function PhotographyGallery() {
  const [lightbox, setLightbox] = useState(null)

  return (
    <SectionShell index="01" sub="STILLS" title="PHOTOGRAPHY">
      {photos.length === 0 ? (
        <p className="empty-note">
          NO STILLS YET — add photos in <code>src/content/photos.js</code> (see README).
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
                <img src={photo.thumb} alt={photo.alt} loading="lazy" />
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
