import { useMemo } from 'react'
import { useThree } from '@react-three/fiber'
import { ContactShadows, useGLTF } from '@react-three/drei'
import * as THREE from 'three'
import { deskObjects, NARROW_ASPECT, objectPosition } from '../../content/deskObjects'
import DeskObject from './DeskObject'
import SafeEnvironment from './SafeEnvironment'

// Soft warm pool of light under each object — grounds the props on the
// footage (and gives the contact shadows something visible to sit on).
function LightPool({ position, radius }) {
  const texture = useMemo(() => {
    const canvas = document.createElement('canvas')
    canvas.width = canvas.height = 256
    const ctx = canvas.getContext('2d')
    const grad = ctx.createRadialGradient(128, 128, 0, 128, 128, 128)
    grad.addColorStop(0, 'rgba(255, 244, 224, 0.32)')
    grad.addColorStop(0.5, 'rgba(255, 244, 224, 0.1)')
    grad.addColorStop(1, 'rgba(255, 244, 224, 0)')
    ctx.fillStyle = grad
    ctx.fillRect(0, 0, 256, 256)
    return new THREE.CanvasTexture(canvas)
  }, [])
  return (
    <mesh position={position} rotation={[-Math.PI / 2, 0, 0]}>
      <circleGeometry args={[radius, 48]} />
      <meshBasicMaterial map={texture} transparent depthWrite={false} />
    </mesh>
  )
}

export default function DeskScene({ isTouch }) {
  const viewSize = useThree((s) => s.size)
  const narrow = viewSize.width / viewSize.height < NARROW_ASPECT

  return (
    <>
      <ambientLight intensity={0.7} />
      <directionalLight position={[3, 6, 2]} intensity={1.4} />
      <SafeEnvironment files="/hdr/studio_small_08_1k.hdr" />
      {deskObjects.map((o) => {
        const p = objectPosition(o, narrow)
        return (
          <LightPool
            key={`pool-${o.id}`}
            position={[p[0], -0.03, p[2]]}
            radius={o.size * 0.95}
          />
        )
      })}
      {deskObjects.map((o) => (
        <DeskObject key={o.id} {...o} isTouch={isTouch} />
      ))}
      <ContactShadows
        position={[0, -0.01, 0]}
        opacity={0.5}
        scale={9}
        blur={2.6}
        far={3.2}
        resolution={512}
      />
    </>
  )
}

deskObjects.forEach((o) => useGLTF.preload(o.model))
