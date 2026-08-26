import { useState } from 'react'
import { films } from '../../content/films'
import SectionShell from './SectionShell'

// Lite-embed pattern: nothing but a thumbnail loads until the card is
// clicked — zero third-party JS on page load.
function FilmCard({ film }) {
  const [playing, setPlaying] = useState(false)
  // Content files are hand-edited: anything that isn't a recognized source
  // with a real videoId renders as a "coming soon" card, never a broken embed.
  const videoId =
    typeof film.videoId === 'string' && film.videoId.trim() !== ''
      ? encodeURIComponent(film.videoId.trim())
      : null
  const source = film.source === 'youtube' || film.source === 'vimeo' ? film.source : 'local'
  const local = source === 'local' || videoId === null
  const thumb =
    film.thumb ||
    (source === 'youtube' && videoId ? `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg` : '')
  const embed = local
    ? null
    : source === 'youtube'
      ? `https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1&rel=0`
      : `https://player.vimeo.com/video/${videoId}?autoplay=1`

  return (
    <article className={`film-card ${local ? 'is-local' : ''}`}>
      <div className="film-frame">
        {playing ? (
          <iframe
            src={embed}
            title={film.title}
            allow="autoplay; fullscreen; picture-in-picture"
            allowFullScreen
          />
        ) : (
          <button
            type="button"
            className="film-thumb"
            onClick={() => !local && setPlaying(true)}
            disabled={local}
            aria-label={local ? `${film.title} — coming soon` : `Play ${film.title}`}
          >
            {thumb ? <img src={thumb} alt="" loading="lazy" /> : <span className="film-thumb-empty" />}
            {local ? (
              <span className="coming-tag">COMING SOON</span>
            ) : (
              <span className="play-badge" aria-hidden="true">▶</span>
            )}
          </button>
        )}
      </div>
      <div className="film-meta">
        <h2>{film.title}</h2>
        <p className="film-role">
          {film.role} · {film.year}
        </p>
        {film.description && <p className="film-desc">{film.description}</p>}
      </div>
    </article>
  )
}

export default function FilmsGrid() {
  return (
    <SectionShell index="02" sub="MOTION" title="VIDEOGRAPHY">
      {films.length === 0 ? (
        <p className="empty-note">
          NO FILMS YET — add entries in <code>src/content/films.js</code> (see README).
        </p>
      ) : (
        <div className="films-grid">
          {films.map((film) => (
            <FilmCard key={film.id} film={film} />
          ))}
        </div>
      )}
    </SectionShell>
  )
}
