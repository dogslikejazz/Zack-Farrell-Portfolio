import { site } from '../content/site'

// The one section that lives in the page flow instead of an overlay: it
// sits under the full-height desk hero and slides up over the scene as
// the page scrolls. Words and headshot come from site.about.
export default function AboutSection() {
  const about = site.about
  if (!about) return null
  return (
    <section id="about" className="about" aria-labelledby="about-heading">
      <div className="about-inner">
        <figure className="about-portrait">
          <img src={about.headshot} alt={about.headshotAlt || ''} width="600" height="800" loading="lazy" />
        </figure>
        <div className="about-body">
          <p className="slate-row about-kicker">
            <span>SCENE 00</span>
            <span className="slate-divider" aria-hidden="true" />
            <span>{about.kicker}</span>
          </p>
          <h2 id="about-heading" className="about-heading">
            {about.heading}
          </h2>
          <div className="about-text">
            {about.paragraphs.map((p, i) => (
              <p key={i}>{p}</p>
            ))}
          </div>
          <nav className="about-links" aria-label="Contact">
            <a href={`mailto:${site.email}`}>{site.email}</a>
            {site.resume && (
              <a href={site.resume} target="_blank" rel="noreferrer">
                Resume (PDF)
              </a>
            )}
            {site.socials.map((s) => (
              <a key={s.label} href={s.url} target="_blank" rel="noreferrer">
                {s.label}
              </a>
            ))}
          </nav>
        </div>
      </div>
    </section>
  )
}
