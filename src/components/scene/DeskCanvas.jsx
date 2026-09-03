import { Suspense } from 'react'
import { Canvas } from '@react-three/fiber'
import { useStore } from '../../store'
import DeskScene from './DeskScene'
import CameraRig from './CameraRig'
import Loader from '../ui/Loader'

// Transparent WebGL canvas composited over the b-roll video.
// No scene background is ever set — that's what keeps the video visible.
export default function DeskCanvas({ isTouch }) {
  const phase = useStore((s) => s.phase)
  return (
    <>
      <Canvas
        camera={{ position: [0, 7.4, 2.3], fov: 35, near: 0.1, far: 50 }}
        gl={{ alpha: true, antialias: true, powerPreference: 'high-performance' }}
        dpr={[1, 2]}
        // The scene sits behind an opaque overlay while a section is open —
        // stop burning GPU frames until the camera needs to move again.
        frameloop={phase === 'section' ? 'demand' : 'always'}
        onCreated={({ gl }) => {
          gl.domElement.addEventListener('webglcontextlost', (e) => {
            e.preventDefault()
            useStore.getState().markWebglFailed()
          })
        }}
        // Absolute inside .hero (not fixed): the desk scrolls away with the
        // HUD as the page moves down to About, instead of staying pinned
        // under it
        style={{
          position: 'absolute',
          inset: 0,
          zIndex: 10,
          pointerEvents: phase === 'idle' ? 'auto' : 'none',
        }}
      >
        <Suspense fallback={null}>
          <DeskScene isTouch={isTouch} />
        </Suspense>
        <CameraRig />
      </Canvas>
      <Loader />
    </>
  )
}
