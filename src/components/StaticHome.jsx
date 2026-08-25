import { Link } from 'react-router-dom'
import { site } from '../content/site'
import { deskObjects } from '../content/deskObjects'

// Rendered instead of the 3D canvas when WebGL is unavailable.
export default function StaticHome() {
  return (
    <div className="static-home">
      <p className="static-kicker">PORTFOLIO OF</p>
      <h1 className="static-name">{site.name}</h1>
      <p className="static-tagline">{site.tagline} · {site.location}</p>
      <nav className="static-nav" aria-label="Portfolio sections">
        {deskObjects.map((o) => (
          <Link key={o.id} className="static-link" to={o.route}>
            {o.label} <span>→</span>
          </Link>
        ))}
      </nav>
      <a className="static-contact" href={`mailto:${site.email}`}>{site.email}</a>
    </div>
  )
}
