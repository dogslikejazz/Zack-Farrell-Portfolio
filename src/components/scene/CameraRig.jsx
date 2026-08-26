import { useRef } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'
import { easing } from 'maath'
import { useStore } from '../../store'
import { deskObjects, NARROW_ASPECT, objectPosition } from '../../content/deskObjects'

// Pulled back far enough to frame all four objects (desk spans ~±2.3)
const IDLE_POS = new THREE.Vector3(0, 7.4, 2.3)
const IDLE_POS_NARROW = new THREE.Vector3(0, 9.2, 2.5)
const ORIGIN = new THREE.Vector3(0, 0, 0)
const IDLE_FOV = 35
const DIVE_FOV = 28
const DIVE_SECONDS = 1.2
const RETURN_SECONDS = 1.0
const FADE_AT = 0.7 // fraction of the dive at which the crossfade starts

const easeInOutCubic = (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2)

function targetOf(id, narrow) {
  const o = deskObjects.find((d) => d.id === id)
  if (!o) return { objectPos: ORIGIN.clone(), divePos: IDLE_POS.clone() }
  const p = objectPosition(o, narrow)
  return {
    objectPos: new THREE.Vector3(p[0], 0.15, p[2]),
    divePos: new THREE.Vector3(
      p[0] + o.diveOffset[0],
      o.diveOffset[1],
      p[2] + o.diveOffset[2],
    ),
  }
}

// Owns the camera every frame. Deterministic eased timelines (not damping)
// drive the dive/return so the DOM crossfade can be scheduled against them.
export default function CameraRig() {
  const camera = useThree((s) => s.camera)
  const startPos = useRef(new THREE.Vector3())
  const look = useRef(new THREE.Vector3())
  const fadeSent = useRef(false)

  useFrame((state, dt) => {
    const s = useStore.getState()
    const t = state.clock.elapsedTime
    const narrow = state.size.width / state.size.height < NARROW_ASPECT
    const idlePos = narrow ? IDLE_POS_NARROW : IDLE_POS

    if (s.phase === 'idle') {
      const px = s.reducedMotion ? 0 : state.pointer.x
      const py = s.reducedMotion ? 0 : state.pointer.y
      // Pure pan: the look target carries the same offset as the camera, so
      // the parallax is a subtle lateral drift — re-aiming at the origin
      // instead would visibly tilt the whole row of objects.
      easing.damp3(
        camera.position,
        [idlePos.x + px * 0.22, idlePos.y, idlePos.z - py * 0.14],
        0.5,
        dt,
      )
      easing.damp3(look.current, [px * 0.22, 0, -py * 0.14], 0.5, dt)
      camera.lookAt(look.current)
      if (camera.fov !== IDLE_FOV) {
        camera.fov = IDLE_FOV
        camera.updateProjectionMatrix()
      }
      return
    }

    if (s.phase === 'focusing') {
      const { objectPos, divePos } = targetOf(s.targetId, narrow)
      if (s.t0 === null) {
        s.setT0(t)
        startPos.current.copy(camera.position)
        fadeSent.current = false
        if (s.reducedMotion) s.setFade(true)
        return
      }
      if (s.reducedMotion) {
        // No camera movement — just wait out the fade, then switch
        if (t - s.t0 > 0.4) s.enterSection()
        return
      }
      const p = Math.min((t - s.t0) / DIVE_SECONDS, 1)
      const e = easeInOutCubic(p)
      camera.position.lerpVectors(startPos.current, divePos, e)
      look.current.lerpVectors(ORIGIN, objectPos, e)
      camera.lookAt(look.current)
      camera.fov = IDLE_FOV + (DIVE_FOV - IDLE_FOV) * e
      camera.updateProjectionMatrix()
      if (p >= FADE_AT && !fadeSent.current) {
        fadeSent.current = true
        s.setFade(true)
      }
      if (p >= 1) s.enterSection()
      return
    }

    if (s.phase === 'section') {
      // Parked (and hidden behind the overlay) at the idle pose
      camera.position.copy(idlePos)
      look.current.set(0, 0, 0)
      camera.lookAt(look.current)
      if (camera.fov !== IDLE_FOV) {
        camera.fov = IDLE_FOV
        camera.updateProjectionMatrix()
      }
      return
    }

    if (s.phase === 'returning') {
      const { objectPos, divePos } = targetOf(s.targetId, narrow)
      if (s.t0 === null) {
        // No fade covering the screen (browser back) — teleporting to the
        // dive pose would be a visible jump-cut. The camera is already
        // parked at the idle pose, so just settle where we are.
        if (s.reducedMotion || !s.fade) {
          s.settle()
          return
        }
        // Start the reverse zoom from the object's dive pose, then drop the fade
        s.setT0(t)
        camera.position.copy(divePos)
        look.current.copy(objectPos)
        camera.lookAt(look.current)
        camera.fov = DIVE_FOV
        camera.updateProjectionMatrix()
        s.setFade(false)
        return
      }
      const p = Math.min((t - s.t0) / RETURN_SECONDS, 1)
      const e = easeInOutCubic(p)
      camera.position.lerpVectors(divePos, idlePos, e)
      look.current.lerpVectors(objectPos, ORIGIN, e)
      camera.lookAt(look.current)
      camera.fov = DIVE_FOV + (IDLE_FOV - DIVE_FOV) * e
      camera.updateProjectionMatrix()
      if (p >= 1) s.settle()
    }
  })

  return null
}
