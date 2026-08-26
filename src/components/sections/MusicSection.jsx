import { useState } from 'react'
import { tracks } from '../../content/music'
import SectionShell from './SectionShell'

// Same lite-embed pattern as the films grid: nothing but the cover
// loads until a card is clicked — zero third-party JS on page load.
// Content files are hand-edited, so anything that doesn't sanitize into
// a recognized embed renders as a "coming soon" card, never a broken frame.
function embedFor(track) {
  const raw = typeof track.embedId === 'string' ? track.embedId.trim() : ''
  if (track.source === 'spotify') {
    const path = /^(track|album|playlist|artist|episode|show)\/[A-Za-z0-9]+$/.test(raw)
      ? raw
      : /^[A-Za-z0-9]+$/.test(raw)
        ? `track/${raw}`
        : null
    if (!path) return null
    return {
      src: `https://open.spotify.com/embed/${path}?theme=0`,
      height: path.startsWith('track/') ? 152 : 352,
    }
  }
  if (track.source === 'soundcloud') {
    if (!raw.startsWith('https://soundcloud.com/')) return null
    const params = `url=${encodeURIComponent(raw)}&color=%23ff4022&auto_play=true&hide_related=true&show_comments=false&show_teaser=false`
    return { src: `https://w.soundcloud.com/player/?${params}`, height: 166 }
  }
  if (track.source === 'youtube') {
    if (raw === '') return null
    return {
      src: `https://www.youtube-nocookie.com/embed/${encodeURIComponent(raw)}?autoplay=1&rel=0`,
      height: null, // null = 16:9 frame instead of a fixed player height
    }
  }
  return null
}

function MusicCard({ track }) {
  const [playing, setPlaying] = useState(false)
  const embed = embedFor(track)
  const local = embed === null

  return (
    <article className={`music-card ${local ? 'is-local' : ''}`}>
      <div
        className={`music-frame ${playing ? 'is-playing' : ''} ${
          playing && embed.height === null ? 'is-video' : ''
        }`}
      >
        {playing ? (
          <iframe
            src={embed.src}
            title={track.title}
            style={embed.height !== null ? { height: embed.height } : undefined}
            allow="autoplay; encrypted-media; fullscreen; picture-in-picture"
            allowFullScreen
          />
        ) : (
          <button
            type="button"
            className="music-cover"
            onClick={() => !local && setPlaying(true)}
            disabled={local}
            aria-label={local ? `${track.title} — coming soon` : `Play ${track.title}`}
          >
            {track.cover ? (
              <img src={track.cover} alt="" loading="lazy" />
            ) : (
              <span className="music-cover-empty" />
            )}
            {local ? (
              <span className="coming-tag">COMING SOON</span>
            ) : (
              <span className="play-badge" aria-hidden="true">▶</span>
            )}
          </button>
        )}
      </div>
      <div className="music-meta">
        <h2>{track.title}</h2>
        <p className="music-role">
          {track.role} · {track.year}
        </p>
        {track.description && <p className="music-desc">{track.description}</p>}
      </div>
    </article>
  )
}

export default function MusicSection() {
  return (
    <SectionShell index="03" sub="AUDIO" title="MUSIC">
      {tracks.length === 0 ? (
        <p className="empty-note">
          NO TRACKS YET — add entries in <code>src/content/music.js</code> (see README).
        </p>
      ) : (
        <div className="music-grid">
          {tracks.map((track) => (
            <MusicCard key={track.id} track={track} />
          ))}
        </div>
      )}
    </SectionShell>
  )
}
