// ─── The interactive objects on the desk ────────────────────
// Each entry = one clickable 3D object on the landing page.
// To add a third object later (e.g. script paper → Writing):
//   1. Drop its .glb into public/models/
//   2. Drop its sound into public/sfx/
//   3. Add an entry here (copy one below, change the values)
//   4. Add a matching <Route> + section component (see README)
//
// position: [x, y, z] on the desk (y stays 0 — objects sit on the ground)
// mobilePosition: used instead of position on narrow/portrait screens,
//       where the desk lays out top-to-bottom instead of side-by-side
// rotationY: resting rotation in radians
// tilt: optional [xTilt, zTilt] radians — leans the prop for a more
//       natural "tossed on the table" resting angle
// size: target size in world units (models are auto-scaled to fit this)
// diveOffset: where the camera ends its dive, relative to the object

// Screens narrower than this width:height ratio use mobilePosition
export const NARROW_ASPECT = 0.8

export function objectPosition(obj, narrow) {
  return narrow && obj.mobilePosition ? obj.mobilePosition : obj.position
}

export const deskObjects = [
  {
    id: 'photography',
    label: 'PHOTOGRAPHY',
    sub: 'STILLS',
    route: '/photography',
    model: '/models/camera.glb',
    sound: '/sfx/shutter.mp3',
    position: [-1.2, 0, 0.15],
    mobilePosition: [-0.5, 0, -0.35],
    rotationY: 0.55,
    tilt: [-0.5, 0.08],
    size: 1.05,
    hoverLift: 0.09,
    diveOffset: [0, 1.05, 0.45],
  },
  {
    id: 'films',
    label: 'FILMS',
    sub: 'MOTION',
    route: '/films',
    model: '/models/clapperboard.glb',
    sound: '/sfx/clap.mp3',
    position: [1.2, 0, -0.1],
    mobilePosition: [0.4, 0, 1.15],
    rotationY: -0.45,
    size: 1.15,
    hoverLift: 0.09,
    diveOffset: [0, 0.95, 0.5],
  },
]
