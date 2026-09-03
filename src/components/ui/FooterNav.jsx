import { Link } from 'react-router-dom'
import { useStore } from '../../store'
import { deskObjects } from '../../content/deskObjects'
import { site } from '../../content/site'

// Real hrefs (crawlable, keyboard-reachable) that trigger the cinematic
// dive when the 3D scene is available, and act as plain links otherwise.
export default function FooterNav({ webgl }) {
  const onNav = (e, obj) => {
    const s = useStore.getState()
    // Mid-transition (dive/return) the HUD is dimmed but still in the DOM:
    // swallow keyboard activations instead of navigating under the animation.
    if (webgl && !s.reducedMotion && s.phase !== 'idle') {
      e.preventDefault()
      return
    }
    if (webgl && !s.reducedMotion && s.phase === 'idle') {
      e.preventDefault()
      s.focus(obj.id)
    }
  }

  return (
    <footer className="footer-nav">
      <nav aria-label="Portfolio sections">
        {deskObjects.map((obj) => (
          <Link key={obj.id} to={obj.route} onClick={(e) => onNav(e, obj)}>
            {obj.label}
          </Link>
        ))}
        <a href={`mailto:${site.email}`}>CONTACT</a>
        {site.socials.map((s) => (
          <a key={s.label} href={s.url} target="_blank" rel="noreferrer">
            {s.label}
          </a>
        ))}
      </nav>
      <p className="footer-fine">
        © {new Date().getFullYear()} {site.name}
        {site.credits.length > 0 && (
          <>
            {' · '}
            {site.credits.map((c, i) => (
              <span key={c.label}>
                {i > 0 && ' · '}
                <a href={c.url} target="_blank" rel="noreferrer">{c.label}</a>
              </span>
            ))}
          </>
        )}
      </p>
    </footer>
  )
}
