import { useEffect, useRef } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { useStore } from './store'
import { deskObjects } from './content/deskObjects'
import { site } from './content/site'

// Null-rendering component that keeps the URL and the transition
// phase machine in agreement, in both directions.
export default function TransitionController() {
  const location = useLocation()
  const navigate = useNavigate()
  const phase = useStore((s) => s.phase)
  const prevPhase = useRef(phase)

  // URL → state: deep links, browser back/forward, plain link navigation
  useEffect(() => {
    const s = useStore.getState()
    const obj = deskObjects.find((o) => o.route === location.pathname)
    if (s.phase === 'focusing') {
      // The URL moved mid-dive (browser back/forward): the user wins.
      // Abort the dive and cut straight to wherever they navigated.
      if (obj) s.jumpTo('section', obj.id)
      else s.jumpTo('idle')
      return
    }
    if (obj) {
      const shouldJump =
        s.phase === 'idle' ||
        s.phase === 'returning' ||
        (s.phase === 'section' && s.targetId !== obj.id)
      if (shouldJump) s.jumpTo('section', obj.id)
    } else if (location.pathname === '/' && s.phase === 'section') {
      // Browser back from a section: overlay is already gone, fly home
      if (s.reducedMotion) s.jumpTo('idle')
      else s.beginReturn()
    }
  }, [location.pathname])

  // State → URL: the dive finished, reveal the section. The fade stays up
  // until the section itself mounts and drops it (SectionShell) — no timer
  // here to race a slow lazy chunk.
  useEffect(() => {
    const s = useStore.getState()
    if (phase === 'section' && prevPhase.current === 'focusing') {
      const obj = deskObjects.find((o) => o.id === s.targetId)
      if (obj && location.pathname !== obj.route) navigate(obj.route)
    }
    prevPhase.current = phase
  }, [phase]) // eslint-disable-line react-hooks/exhaustive-deps

  // Per-route document titles
  useEffect(() => {
    const obj = deskObjects.find((o) => o.route === location.pathname)
    const pretty = obj ? obj.label.charAt(0) + obj.label.slice(1).toLowerCase() : null
    document.title = pretty ? `${pretty} — ${site.name}` : `${site.name} — ${site.tagline}`
  }, [location.pathname])

  return null
}
