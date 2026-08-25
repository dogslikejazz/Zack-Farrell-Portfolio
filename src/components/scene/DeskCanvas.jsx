import { Suspense } from 'react'
import { Canvas } from '@react-three/fiber'
import { useStore } from '../../store'
import DeskScene from './DeskScene'
import CameraRig from './CameraRig'

// Transparent WebGL canvas composited over the b-roll video.
// No scene background is ever set — that's what keeps the video visible.
export default function DeskCanvas({ isTouch }) {
  const phase = useStore((s) => s.phase)
  return (
    <Canvas
      camera={{ position: [0, 7, 2.2], fov: 35, near: 0.1, far: 50 }}
      gl={{ alpha: true, antialias: true, powerPreference: 'high-performance' }}
      dpr={[1, 2]}
      style={{
        position: 'fixed',
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
  )
}
