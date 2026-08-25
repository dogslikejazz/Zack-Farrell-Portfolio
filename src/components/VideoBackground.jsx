import { useEffect, useRef } from 'react'
import { useStore } from '../store'

export default function VideoBackground() {
  const reducedMotion = useStore((s) => s.reducedMotion)
  const phase = useStore((s) => s.phase)
  const ref = useRef(null)

  // Pause the b-roll while a section covers it; resume on return
  useEffect(() => {
    const video = ref.current
    if (!video) return
    if (phase === 'section') video.pause()
    else video.play().catch(() => {})
  }, [phase])

  return (
    <>
      {reducedMotion ? (
        <img className="video-bg" src="/video/poster.jpg" alt="" />
      ) : (
        <video
          ref={ref}
          className="video-bg"
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          poster="/video/poster.jpg"
        >
          <source src="/video/bg-loop.webm" type="video/webm" />
          <source src="/video/bg-loop.mp4" type="video/mp4" />
        </video>
      )}
      <div className="video-scrim" aria-hidden="true" />
    </>
  )
}
