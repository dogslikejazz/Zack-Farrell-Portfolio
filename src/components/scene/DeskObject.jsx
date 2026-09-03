import React, { Suspense, useEffect, useMemo, useRef, useState } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { Html, useCursor, useGLTF } from '@react-three/drei'
import * as THREE from 'three'
import { easing } from 'maath'
import { useStore } from '../../store'
import { NARROW_ASPECT, objectPosition, objectSize } from '../../content/deskObjects'
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
  model,
  position,
  mobilePosition,
  rotationY,
  tilt = [0, 0],
  size: baseSize,
  hoverLift,
  comingSoon,
  isTouch,
}) {
  const liftRef = useRef(null)
  const [hovered, setHovered] = useState(false)
  const phase = useStore((s) => s.phase)
  const viewSize = useThree((s) => s.size)
  const narrow = viewSize.width / viewSize.height < NARROW_ASPECT
  const pos = objectPosition({ position, mobilePosition }, narrow)
  const size = objectSize({ size: baseSize }, narrow)
  useCursor(hovered && phase === 'idle')

  // The dive moves the object out from under the pointer without firing
  // pointerout — clear the hover so labels/cursor can't stick on return.
  useEffect(() => {
    if (phase !== 'idle' && hovered) setHovered(false)
  }, [phase, hovered])

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
    s.focus(id)
  }

  const showLabel = phase === 'idle' && (hovered || isTouch)

  return (
    <group
      position={pos}
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
        {/* Only the prop is tilted — the label anchors in world-up space so
            a leaned model can't drag its chip sideways or down onto itself */}
        <group rotation={[tilt[0], rotationY, tilt[1]]}>
          <ModelBoundary id={id} model={model} size={size} />
          {/* Generous invisible hit area so hover doesn't require pixel-perfect aim */}
          <mesh position={[0, size * 0.4, 0]}>
            <boxGeometry args={[size * 1.25, size * 0.95, size * 1.25]} />
            <meshBasicMaterial transparent opacity={0} depthWrite={false} />
          </mesh>
        </group>
        {/* Desktop: hover card centred over the prop. Touch/narrow: every
            label is on at once, so the chip must clear the prop. The idle
            camera looks almost straight down, so "up on screen" is world -z
            (away from the viewer), not +y — anchor just past the prop's far
            edge and let .is-above rest the chip's bottom edge on that point */}
        <Html
          center
          position={narrow ? [0, size * 0.5, -size * 0.72] : [0, size * 0.7, 0]}
          zIndexRange={[15, 0]}
          style={{ pointerEvents: 'none' }}
        >
          <div className={`desk-label-anchor ${narrow ? 'is-above' : ''}`}>
            <div className={`desk-label ${showLabel ? 'is-on' : ''}`}>
              <span className="desk-label-main">
                <span className="desk-label-bracket">[</span> {label}{' '}
                <span className="desk-label-bracket">]</span>
              </span>
              {comingSoon && <span className="desk-label-soon">COMING SOON</span>}
            </div>
          </div>
        </Html>
      </group>
    </group>
  )
}
