import { useState } from 'react'
import { films } from '../../content/films'
import { site } from '../../content/site'
import SectionShell from './SectionShell'

// Two walls, like the photo gallery: the main 16:9 body of work, then
// vertical short-form pieces made for social. Index stays per-wall.
const WALLS = [
  { key: 'films', label: 'FILMS', vertical: false, test: (f) => f.group !== 'social' },
  { key: 'social', label: 'SOCIAL MEDIA', vertical: true, test: (f) => f.group === 'social' },
].map((w) => ({ ...w, items: films.filter(w.test) }))

// Lite-embed pattern: nothing but a thumbnail loads until the card is
// clicked — zero third-party JS on page load.
function FilmCard({ film, vertical }) {
  const [playing, setPlaying] = useState(false)
  // Content files are hand-edited: anything that isn't a recognized source
  // with a real videoId renders as a "coming soon" card, never a broken embed.
  const videoId =
    typeof film.videoId === 'string' && film.videoId.trim() !== ''
      ? encodeURIComponent(film.videoId.trim())
      : null
  const source =
    film.source === 'youtube' || film.source === 'vimeo' || film.source === 'instagram'
      ? film.source
      : 'local'
  // Instagram can't be embedded cleanly — the card is a link out instead
  const linkOut = source === 'instagram' && typeof film.url === 'string' && film.url !== ''
  const local = !linkOut && (source === 'local' || videoId === null)
  const thumb =
    film.thumb ||
    (source === 'youtube' && videoId ? `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg` : '')
  const embed = local
    ? null
    : source === 'youtube'
      ? `https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1&rel=0`
      : `https://player.vimeo.com/video/${videoId}?autoplay=1`

  return (
    <article className={`film-card ${local ? 'is-local' : ''} ${vertical ? 'is-vertical' : ''}`}>
      <div className="film-frame">
        {linkOut ? (
          <a
            className="film-thumb film-link"
            href={film.url}
            target="_blank"
            rel="noreferrer"
            aria-label={`Open ${film.title} on Instagram`}
          >
            {thumb ? <img src={thumb} alt="" loading="lazy" /> : <span className="film-thumb-empty" />}
            <span className="coming-tag film-link-tag">INSTAGRAM ↗</span>
          </a>
        ) : playing ? (
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

// Empty SOCIAL MEDIA wall: point at the live feed instead of a blank grid
function SocialNote() {
  const ig = site.socials.find((s) => s.label === 'INSTAGRAM')
  return (
    <p className="empty-note wall-note">
      SHORT-FORM WORK LIVES ON INSTAGRAM FOR NOW
      {ig && (
        <>
          {' — '}
          <a href={ig.url} target="_blank" rel="noreferrer">
            {ig.url.replace(/^https?:\/\/(www\.)?instagram\.com\//, '@').replace(/\/$/, '')}
          </a>
        </>
      )}
    </p>
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
        WALLS.map((wall) => (
          <section key={wall.key} className="wall" aria-label={wall.label}>
            <p className="slate-row wall-label">
              <span>{wall.label}</span>
              <span className="slate-divider" aria-hidden="true" />
              <span>{String(wall.items.length).padStart(2, '0')}</span>
            </p>
            {wall.items.length > 0 ? (
              <div className={`films-grid ${wall.vertical ? 'is-vertical' : ''}`}>
                {wall.items.map((film) => (
                  <FilmCard key={film.id} film={film} vertical={wall.vertical} />
                ))}
              </div>
            ) : (
              <SocialNote />
            )}
          </section>
        ))
      )}
    </SectionShell>
  )
}
