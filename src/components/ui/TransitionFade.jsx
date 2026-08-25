import { useStore } from '../../store'

export default function TransitionFade() {
  const fade = useStore((s) => s.fade)
  return <div className={`transition-fade ${fade ? 'is-on' : ''}`} aria-hidden="true" />
}
