import { useEffect } from 'react'
import { photos } from '../../content/photos'

export default function Lightbox({ index, onClose, onNav }) {
  const photo = photos[index]
  const prev = () => onNav((index - 1 + photos.length) % photos.length)
  const next = () => onNav((index + 1) % photos.length)

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') onClose()
      if (e.key === 'ArrowLeft') prev()
      if (e.key === 'ArrowRight') next()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  })

  if (!photo) return null

  return (
    <div className="lightbox" role="dialog" aria-modal="true" aria-label={photo.alt} onClick={onClose}>
      <figure className="lightbox-figure" onClick={(e) => e.stopPropagation()}>
        <img src={photo.src} alt={photo.alt} />
        <figcaption>
          STILL {String(index + 1).padStart(2, '0')} / {String(photos.length).padStart(2, '0')} — {photo.caption}
        </figcaption>
      </figure>
      <button type="button" className="lightbox-btn lightbox-close" onClick={onClose} aria-label="Close" autoFocus>
        ✕
      </button>
      {photos.length > 1 && (
        <>
          <button
            type="button"
            className="lightbox-btn lightbox-prev"
            onClick={(e) => {
              e.stopPropagation()
              prev()
            }}
            aria-label="Previous photo"
          >
            ←
          </button>
          <button
            type="button"
            className="lightbox-btn lightbox-next"
            onClick={(e) => {
              e.stopPropagation()
              next()
            }}
            aria-label="Next photo"
          >
            →
          </button>
        </>
      )}
    </div>
  )
}
