import { useStore } from '../../store'

// Cinema letterbox bars that slide in while the camera dives.
export default function Letterbox() {
  const phase = useStore((s) => s.phase)
  const on = phase === 'focusing'
  return (
    <>
      <div className={`letterbox letterbox-top ${on ? 'is-on' : ''}`} aria-hidden="true" />
      <div className={`letterbox letterbox-bottom ${on ? 'is-on' : ''}`} aria-hidden="true" />
    </>
  )
}
