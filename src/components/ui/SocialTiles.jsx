import { site } from '../../content/site'

// Brand-colored blocks for the socials — the one place the site breaks its
// monochrome palette on purpose. Colors live in CSS, keyed by data-brand.
// `contact` adds EMAIL and RESUME tiles in front of the socials.
const brandOf = (label) => label.toLowerCase().replace(/[^a-z0-9]+/g, '')

export default function SocialTiles({ className = '', contact = false }) {
  const tiles = [
    ...(contact ? [{ label: 'EMAIL', url: `mailto:${site.email}`, brand: 'email', newTab: false }] : []),
    ...(contact && site.resume ? [{ label: 'RESUME', url: site.resume, brand: 'resume' }] : []),
    ...site.socials.map((s) => ({ ...s, brand: brandOf(s.label) })),
  ]
  if (!tiles.length) return null
  return (
    <nav className={`social-tiles ${className}`} aria-label={contact ? 'Contact and social media' : 'Social media'}>
      {tiles.map((s) => (
        <a
          key={s.label}
          className="social-tile"
          data-brand={s.brand}
          href={s.url}
          target={s.newTab === false ? undefined : '_blank'}
          rel={s.newTab === false ? undefined : 'noreferrer'}
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
