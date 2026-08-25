import { useEffect, useState } from 'react'
import { useStore } from '../../store'
import { site } from '../../content/site'
import FooterNav from './FooterNav'

function pad(n) {
  return String(n).padStart(2, '0')
}

// Running 24fps timecode readout, viewfinder-style.
function Timecode() {
  const [tc, setTc] = useState('00:00:00:00')
  useEffect(() => {
    const start = performance.now()
    const id = setInterval(() => {
      const frames = Math.floor((performance.now() - start) / (1000 / 24))
      const f = frames % 24
      const s = Math.floor(frames / 24) % 60
      const m = Math.floor(frames / (24 * 60)) % 60
      const h = Math.floor(frames / (24 * 3600)) % 24
      setTc(`${pad(h)}:${pad(m)}:${pad(s)}:${pad(f)}`)
    }, 1000 / 24)
    return () => clearInterval(id)
  }, [])
  return <span className="timecode">{tc}</span>
}

// The camera-HUD chrome over the desk scene.
export default function HomeOverlay({ isTouch, webgl }) {
  const phase = useStore((s) => s.phase)
  const state = phase === 'section' ? 'is-hidden' : phase === 'idle' ? '' : 'is-dim'

  return (
    <div className={`home-overlay ${state}`}>
      <span className="vf-bracket vf-tl" aria-hidden="true" />
      <span className="vf-bracket vf-tr" aria-hidden="true" />
      <span className="vf-bracket vf-bl" aria-hidden="true" />
      <span className="vf-bracket vf-br" aria-hidden="true" />

      <header className="hud-head">
        <div className="hud-id">
          <p className="hud-kicker">PORTFOLIO OF</p>
          <h1 className="hud-name">{site.name}</h1>
          <p className="hud-tagline">{site.tagline} · {site.location}</p>
        </div>
        <div className="hud-rec" aria-hidden="true">
          <span className="rec-dot" />
          <span className="rec-label">REC</span>
          <Timecode />
        </div>
      </header>

      <p className="hud-hint" aria-hidden="true">
        {isTouch ? 'TAP AN OBJECT TO ENTER' : 'HOVER THE DESK — CLICK TO ENTER'}
      </p>

      <FooterNav webgl={webgl} />
    </div>
  )
}
