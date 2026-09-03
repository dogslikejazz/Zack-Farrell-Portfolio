import { site } from '../../content/site'

// Brand-colored blocks for the socials — the one place the site breaks its
// monochrome palette on purpose. Colors live in CSS, keyed by data-brand.
const brandOf = (label) => label.toLowerCase().replace(/[^a-z0-9]+/g, '')

export default function SocialTiles({ className = '' }) {
  if (!site.socials.length) return null
  return (
    <nav className={`social-tiles ${className}`} aria-label="Social media">
      {site.socials.map((s) => (
        <a
          key={s.label}
          className="social-tile"
          data-brand={brandOf(s.label)}
          href={s.url}
          target="_blank"
          rel="noreferrer"
        >
          <span className="social-tile-label">{s.label}</span>
          <span className="social-tile-arrow" aria-hidden="true">
            ↗
          </span>
        </a>
      ))}
    </nav>
  )
}
