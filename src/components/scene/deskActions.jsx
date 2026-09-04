import { useEffect, useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { useStore } from '../../store'

// Click animations for the desk props (the `action` field in
// src/content/deskObjects.js). Each pose is a pure function of `a` =
// seconds since the dive began — CameraRig stamps that clock into the
// store as t0 — so the animation runs in lockstep with the camera move
// and is over well before the crossfade (0.84s). Every other phase holds
// the rest pose, so an aborted dive can never strand a prop mid-swing.

// Seconds into this prop's own dive, or -1 when it isn't diving.
function diveTime(state, id) {
  const s = useStore.getState()
  if (s.phase !== 'focusing' || s.targetId !== id || s.t0 === null || s.reducedMotion) return -1
  return state.clock.elapsedTime - s.t0
}

const easeOutCubic = (t) => 1 - Math.pow(1 - t, 3)

// ── Clap ────────────────────────────────────────────────────
// The stick snaps open, hangs for a beat, slams shut with one small
// rebound, and the whole board recoils along its own z on impact.
const CLAP = {
  open: 0.14, // s — stick reaches full open
  hold: 0.22, // s — starts closing
  shut: 0.3, // s — impact
  end: 0.42, // s — rebound and recoil settled
  angle: 0.6, // rad — how far the stick opens
  bounce: 0.06, // rad — rebound off the fixed bar
  recoil: 0.012, // × prop size — how far the board jolts
}

export function clapPose(a) {
  const c = CLAP
  if (a < 0 || a >= c.end) return { angle: 0, recoil: 0 }
  if (a < c.open) return { angle: c.angle * easeOutCubic(a / c.open), recoil: 0 }
  if (a < c.hold) return { angle: c.angle, recoil: 0 }
  if (a < c.shut) {
    const t = (a - c.hold) / (c.shut - c.hold)
    return { angle: c.angle * (1 - t * t), recoil: 0 } // accelerates into the slam
  }
  const t = (a - c.shut) / (c.end - c.shut)
  return {
    angle: t < 0.6 ? c.bounce * Math.sin((t / 0.6) * Math.PI) : 0,
    recoil: c.recoil * Math.sin(t * Math.PI) * (1 - t),
  }
}

// `pivot` is the model's hinge node (deskObjects.js explains the naming);
// `rig` wraps the whole model so the recoil moves board and stick together.
export function ClapRig({ id, pivot, rig, size }) {
  useEffect(() => {
    if (!pivot && import.meta.env.DEV) {
      console.warn(`[desk] ${id}: model has no "stick_pivot" node — clap animation disabled`)
    }
  }, [pivot, id])

  useFrame((state) => {
    if (!pivot) return
    const pose = clapPose(diveTime(state, id))
    pivot.rotation.y = pose.angle
    if (rig.current) rig.current.position.z = pose.recoil * size
  })
  return null
}

// ── Flash ───────────────────────────────────────────────────
// A small pop at the lens: a four-point sparkle that snaps up and burns
// out in about a quarter second, with a faint point light so the camera
// body catches a glint. Deliberately local to the prop — no screen
// white-out.
const FLASH = {
  pop: 0.05, // s — sparkle reaches full size
  decay: 14, // 1/s — how fast it burns out after the pop
  end: 0.3, // s — done
  size: 0.8, // × prop size — sparkle width at peak
  light: 7, // cd — glint on the body at peak
  color: '#eef3ff',
}

export function flashPose(a) {
  const f = FLASH
  if (a < 0 || a >= f.end) return 0
  if (a < f.pop) return easeOutCubic(a / f.pop)
  return Math.exp(-(a - f.pop) * f.decay)
}

function sparkleTexture() {
  const canvas = document.createElement('canvas')
  canvas.width = canvas.height = 256
  const ctx = canvas.getContext('2d')
  // A cross of rays, bright at the centre and feathering out to nothing
  const rays = (len, width) => {
    const grad = ctx.createRadialGradient(128, 128, 0, 128, 128, len)
    grad.addColorStop(0, 'rgba(255, 255, 255, 1)')
    grad.addColorStop(0.35, 'rgba(255, 255, 255, 0.6)')
    grad.addColorStop(1, 'rgba(255, 255, 255, 0)')
    ctx.strokeStyle = grad
    ctx.lineWidth = width
    ctx.lineCap = 'round'
    ctx.beginPath()
    ctx.moveTo(128 - len, 128)
    ctx.lineTo(128 + len, 128)
    ctx.moveTo(128, 128 - len)
    ctx.lineTo(128, 128 + len)
    ctx.stroke()
  }
  rays(126, 7)
  ctx.save()
  ctx.translate(128, 128)
  ctx.rotate(Math.PI / 4)
  ctx.translate(-128, -128)
  rays(70, 4)
  ctx.restore()
  const core = ctx.createRadialGradient(128, 128, 0, 128, 128, 34)
  core.addColorStop(0, 'rgba(255, 255, 255, 1)')
  core.addColorStop(0.5, 'rgba(255, 255, 255, 0.7)')
  core.addColorStop(1, 'rgba(255, 255, 255, 0)')
  ctx.fillStyle = core
  ctx.fillRect(0, 0, 256, 256)
  const texture = new THREE.CanvasTexture(canvas)
  texture.colorSpace = THREE.SRGBColorSpace
  return texture
}

export function FlashRig({ id, size }) {
  const light = useRef(null)
  const sprite = useRef(null)
  const texture = useMemo(sparkleTexture, [])
  useEffect(() => () => texture.dispose(), [texture])

  useFrame((state) => {
    const i = flashPose(diveTime(state, id))
    if (light.current) light.current.intensity = i * FLASH.light
    if (!sprite.current) return
    const on = i > 0.01
    sprite.current.visible = on
    if (on) {
      sprite.current.material.opacity = i
      const k = size * FLASH.size * (0.6 + 0.4 * i)
      sprite.current.scale.set(k, k, 1)
    }
  })

  // On the flash window — the wide rectangle at the front-top right of the
  // body (this model has no bulb). Offsets are in the prop's world-up frame
  return (
    <>
      <pointLight
        ref={light}
        position={[size * 0.26, size * 0.52, -size * 0.18]}
        color={FLASH.color}
        intensity={0}
        decay={2}
      />
      <sprite
        ref={sprite}
        position={[size * 0.26, size * 0.47, -size * 0.32]}
        visible={false}
        raycast={() => null}
      >
        <spriteMaterial
          map={texture}
          transparent
          depthWrite={false}
          depthTest={false}
          opacity={0}
          toneMapped={false}
        />
      </sprite>
    </>
  )
}
