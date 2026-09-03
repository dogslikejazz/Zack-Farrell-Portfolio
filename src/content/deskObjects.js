// ─── The interactive objects on the desk ────────────────────
// Each entry = one clickable 3D object on the landing page.
// To add another object later (e.g. script paper → Writing):
//   1. Drop its .glb into public/models/
//   2. Add an entry here (copy one below, change the values)
//   3. Add a matching <Route> + section component (see README)
//
// position: [x, y, z] on the desk (y stays 0 — objects sit on the ground)
// mobilePosition: used instead of position on narrow/portrait screens,
//       where the desk lays out top-to-bottom instead of side-by-side
// rotationY: resting rotation in radians
// tilt: optional [xTilt, zTilt] radians — leans the prop for a more
//       natural "tossed on the table" resting angle
// size: target size in world units (models are auto-scaled to fit this)
// diveOffset: where the camera ends its dive, relative to the object
// comingSoon: optional — adds a COMING SOON tag to the hover label
//       (the object stays clickable; the section shows its own notice)

// Screens narrower than this width:height ratio use mobilePosition
export const NARROW_ASPECT = 0.8
// …and shrink every prop by this much — a phone shows ~1/3 the desk
// width, so desktop-sized props crowd and clip at the edges
export const NARROW_SCALE = 0.72

export function objectPosition(obj, narrow) {
  return narrow && obj.mobilePosition ? obj.mobilePosition : obj.position
}

export function objectSize(obj, narrow) {
  return narrow ? obj.size * NARROW_SCALE : obj.size
}

export const deskObjects = [
  {
    id: 'photography',
    label: 'PHOTOGRAPHY',
    route: '/photography',
    model: '/models/camera.glb',
    position: [-2.6, 0, 0.05],
    mobilePosition: [-0.6, 0, -1.15],
    // The model's lens side sits opposite its +z — π flips it toward the viewer
    rotationY: Math.PI - 0.2,
    tilt: [-0.8, 0.04],
    size: 1.05,
    hoverLift: 0.09,
    diveOffset: [0, 1.05, 0.45],
  },
  {
    id: 'films',
    label: 'VIDEOGRAPHY',
    route: '/videography',
    model: '/models/clapperboard.glb',
    position: [-0.9, 0, -0.15],
    mobilePosition: [0.6, 0, -0.25],
    rotationY: -0.25,
    size: 1.15,
    hoverLift: 0.09,
    diveOffset: [0, 0.95, 0.5],
  },
  {
    id: 'music',
    label: 'MUSIC',
    comingSoon: true,
    route: '/music',
    model: '/models/headphones.glb',
    position: [0.9, 0, 0.05],
    mobilePosition: [-0.6, 0, 0.6],
    rotationY: 0,
    tilt: [-0.55, -0.05],
    size: 1.05,
    hoverLift: 0.09,
    diveOffset: [0, 1.0, 0.45],
  },
  {
    id: 'gamedev',
    label: 'GAME DEVELOPMENT',
    comingSoon: true,
    route: '/gamedev',
    model: '/models/controller.glb',
    position: [2.6, 0, -0.1],
    mobilePosition: [0.6, 0, 1.45],
    rotationY: -0.2,
    tilt: [-0.2, 0],
    size: 0.9,
    hoverLift: 0.09,
    diveOffset: [0, 0.9, 0.5],
  },
]
