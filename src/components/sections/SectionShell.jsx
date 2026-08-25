import { useNavigate } from 'react-router-dom'
import { useStore } from '../../store'

// Shared overlay chrome for every portfolio section: slate-style
// header, back button, scrollable body.
export default function SectionShell({ index, sub, title, children }) {
  const navigate = useNavigate()

  const onBack = () => {
    const s = useStore.getState()
    if (s.phase !== 'section') return
    s.setFade(true)
    if (s.reducedMotion) {
      setTimeout(() => {
        navigate('/')
        s.jumpTo('idle')
      }, 300)
    } else {
      // Fade to black over the section, then reverse-zoom out of the object
      setTimeout(() => {
        navigate('/')
        s.beginReturn()
      }, 380)
    }
  }

  return (
    <section className="section-shell" aria-label={title}>
      <header className="section-head">
        <button type="button" className="back-btn" onClick={onBack}>
          ← BACK TO DESK
        </button>
        <p className="slate-row">
          <span>SCENE {index}</span>
          <span className="slate-divider" aria-hidden="true" />
          <span>{sub}</span>
        </p>
        <h1 className="section-title">{title}</h1>
      </header>
      <div className="section-body">{children}</div>
    </section>
  )
}
