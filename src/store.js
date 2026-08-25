import { create } from 'zustand'

// Transition phase machine. Everything visual hangs off `phase`:
//   idle      — desk is interactive
//   focusing  — camera diving toward the clicked object
//   section   — a portfolio section overlay is open
//   returning — camera flying back from the object to the idle pose
export const useStore = create((set, get) => ({
  phase: 'idle',
  targetId: null,
  t0: null, // clock time the current animated phase started (set by CameraRig)
  fade: false,
  // Seeded synchronously so the very first paint (video vs poster, parallax)
  // already respects the OS setting — the App effect only tracks live changes.
  reducedMotion:
    typeof window !== 'undefined' &&
    typeof window.matchMedia === 'function' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches,
  // webgl: null until App's probe runs, then true/false for the session.
  webgl: null,
  webglFailed: false,
  // True while a BACK exit is in flight — blocks double-activation.
  exiting: false,

  setReducedMotion: (reducedMotion) => set({ reducedMotion }),
  setFade: (fade) => set({ fade }),
  setT0: (t0) => set({ t0 }),
  setWebgl: (webgl) => set({ webgl }),

  // Runtime WebGL loss (context lost, renderer crash): drop to the static
  // experience and make sure no opaque fade layer is left covering it.
  markWebglFailed: () =>
    set((s) => ({
      webglFailed: true,
      fade: false,
      t0: null,
      exiting: false,
      phase: s.phase === 'section' ? 'section' : 'idle',
      targetId: s.phase === 'section' ? s.targetId : null,
    })),

  focus: (id) => {
    if (get().phase === 'idle') set({ phase: 'focusing', targetId: id, t0: null })
  },
  enterSection: () => set({ phase: 'section', t0: null, exiting: false }),
  // Guarded so a late duplicate (double-click BACK, back-button race) can't
  // restart the return animation mid-flight.
  beginReturn: () => {
    if (get().phase === 'section') set({ phase: 'returning', t0: null })
  },
  // Claim the section exit. False = an exit is already in flight.
  requestExit: () => {
    const s = get()
    if (s.phase !== 'section' || s.exiting) return false
    set({ exiting: true })
    return true
  },
  settle: () => set({ phase: 'idle', targetId: null, t0: null, fade: false, exiting: false }),
  jumpTo: (phase, id = null) => set({ phase, targetId: id, t0: null, fade: false, exiting: false }),
}))
