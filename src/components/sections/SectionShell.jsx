import { useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { useStore } from '../../store'

// Shared overlay chrome for every portfolio section: slate-style
// header, back button, scrollable body.
export default function SectionShell({ index, sub, title, children }) {
  const navigate = useNavigate()
  const exitTimer = useRef(null)

  // The dive keeps the black fade up until the section is actually on
  // screen — dropping it here (not on a fixed timer) means a slow lazy
  // chunk can never reveal an empty desk mid-transition.
  useEffect(() => {
    const s = useStore.getState()
    if (s.fade && s.phase === 'section') s.setFade(false)
    // The page behind can scroll (desk → About); freeze it under the overlay
    document.body.classList.add('is-section')
    return () => {
      clearTimeout(exitTimer.current)
      document.body.classList.remove('is-section')
    }
  }, [])

  const onBack = () => {
    const s = useStore.getState()
    if (!s.requestExit()) return
    if (s.reducedMotion || s.webgl === false || s.webglFailed) {
      // No camera rig to animate (or the user asked for no motion):
      // cut straight home. Never raise the fade — nothing would clear it.
      navigate('/')
      s.jumpTo('idle')
      return
    }
    // Fade to black over the section, then reverse-zoom out of the object
    s.setFade(true)
    exitTimer.current = setTimeout(() => {
      navigate('/')
      s.beginReturn()
    }, 380)
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
