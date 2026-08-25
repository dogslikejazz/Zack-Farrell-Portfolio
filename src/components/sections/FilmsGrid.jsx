import { useState } from 'react'
import { films } from '../../content/films'
import SectionShell from './SectionShell'

// Lite-embed pattern: nothing but a thumbnail loads until the card is
// clicked — zero third-party JS on page load.
function FilmCard({ film }) {
  const [playing, setPlaying] = useState(false)
  const local = film.source === 'local'
  const thumb =
    film.thumb ||
    (film.source === 'youtube' ? `https://i.ytimg.com/vi/${film.videoId}/hqdefault.jpg` : '')
  const embed =
    film.source === 'youtube'
      ? `https://www.youtube-nocookie.com/embed/${film.videoId}?autoplay=1&rel=0`
      : `https://player.vimeo.com/video/${film.videoId}?autoplay=1`

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
    <SectionShell index="02" sub="MOTION" title="FILMS">
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
