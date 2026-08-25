import { useEffect, useRef, useState } from 'react'
import { useProgress } from '@react-three/drei'

export default function Loader() {
  const { active, progress } = useProgress()
  const started = useRef(false)
  const [done, setDone] = useState(false)

  if (active && !started.current) started.current = true

  useEffect(() => {
    if (started.current && !active) {
      const t = setTimeout(() => setDone(true), 500)
      return () => clearTimeout(t)
    }
  }, [active])

  // Never started loading anything (or finished + faded out) → render nothing
  if (!started.current || done) return null

  return (
    <div className={`loader ${!active ? 'is-hidden' : ''}`} role="status" aria-live="polite">
      <div className="loader-inner">
        <span className="rec-dot" aria-hidden="true" />
        <span className="loader-text">
          LOADING REEL — {String(Math.floor(progress)).padStart(2, '0')}%
        </span>
      </div>
    </div>
  )
}
