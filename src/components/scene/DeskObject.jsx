import React, { Suspense, useMemo, useRef, useState } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { Html, useCursor, useGLTF } from '@react-three/drei'
import * as THREE from 'three'
import { easing } from 'maath'
import { useStore } from '../../store'
import { NARROW_ASPECT, objectPosition } from '../../content/deskObjects'
import { playSfx } from '../../lib/sfx'
import FallbackShape from './FallbackShape'

// Auto-fit whatever model file is dropped in: scale it to `size` world
// units, center it on the group origin, and sit its base on y=0 — so
// swapping in a new .glb never requires retuning the scene.
function Model({ model, size }) {
  const { scene } = useGLTF(model)
  const fit = useMemo(() => {
    const box = new THREE.Box3().setFromObject(scene)
    const dims = box.getSize(new THREE.Vector3())
    const maxDim = Math.max(dims.x, dims.y, dims.z) || 1
    const k = size / maxDim
    const center = box.getCenter(new THREE.Vector3())
    return { k, offset: [-center.x * k, -box.min.y * k, -center.z * k] }
  }, [scene, size])
  return <primitive object={scene} scale={fit.k} position={fit.offset} />
}

class ModelBoundary extends React.Component {
  state = { failed: false }
  static getDerivedStateFromError() {
    return { failed: true }
  }
  render() {
    if (this.state.failed) return <FallbackShape id={this.props.id} size={this.props.size} />
    return (
      <Suspense fallback={null}>
        <Model model={this.props.model} size={this.props.size} />
      </Suspense>
    )
  }
}

// One interactive object on the desk. Everything about it comes from
// its entry in src/content/deskObjects.js.
export default function DeskObject({
  id,
  label,
  sub,
  model,
  sound,
  position,
  mobilePosition,
  rotationY,
  tilt = [0, 0],
  size,
  hoverLift,
  isTouch,
}) {
  const liftRef = useRef(null)
  const [hovered, setHovered] = useState(false)
  const phase = useStore((s) => s.phase)
  const viewSize = useThree((s) => s.size)
  const narrow = viewSize.width / viewSize.height < NARROW_ASPECT
  const pos = objectPosition({ position, mobilePosition }, narrow)
  useCursor(hovered && phase === 'idle')

  useFrame((_, dt) => {
    if (!liftRef.current) return
    const s = useStore.getState()
    const lifted = hovered && s.phase === 'idle' && !s.reducedMotion
    easing.damp3(liftRef.current.position, [0, lifted ? hoverLift : 0, 0], 0.12, dt)
    easing.dampE(liftRef.current.rotation, [0, lifted ? 0.16 : 0, lifted ? -0.05 : 0], 0.14, dt)
  })

  const activate = () => {
    const s = useStore.getState()
    if (s.phase !== 'idle') return
    playSfx(sound)
    s.focus(id)
  }

  const showLabel = phase === 'idle' && (hovered || isTouch)

  return (
    <group
      position={pos}
      rotation={[tilt[0], rotationY, tilt[1]]}
      onPointerOver={(e) => {
        e.stopPropagation()
        setHovered(true)
      }}
      onPointerOut={() => setHovered(false)}
      onClick={(e) => {
        e.stopPropagation()
        activate()
      }}
    >
      <group ref={liftRef}>
        <ModelBoundary id={id} model={model} size={size} />
        {/* Generous invisible hit area so hover doesn't require pixel-perfect aim */}
        <mesh position={[0, size * 0.4, 0]}>
          <boxGeometry args={[size * 1.25, size * 0.95, size * 1.25]} />
          <meshBasicMaterial transparent opacity={0} depthWrite={false} />
        </mesh>
        <Html
          center
          position={[0, size * 1.35, 0]}
          zIndexRange={[15, 0]}
          style={{ pointerEvents: 'none' }}
        >
          <div className={`desk-label ${showLabel ? 'is-on' : ''}`}>
            <span className="desk-label-main">[ {label} ]</span>
            <span className="desk-label-sub">{sub}</span>
          </div>
        </Html>
      </group>
    </group>
  )
}
