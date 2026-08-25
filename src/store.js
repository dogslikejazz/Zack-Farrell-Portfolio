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
  reducedMotion: false,

  setReducedMotion: (reducedMotion) => set({ reducedMotion }),
  setFade: (fade) => set({ fade }),
  setT0: (t0) => set({ t0 }),

  focus: (id) => {
    if (get().phase === 'idle') set({ phase: 'focusing', targetId: id, t0: null })
  },
  enterSection: () => set({ phase: 'section', t0: null }),
  beginReturn: () => set({ phase: 'returning', t0: null }),
  settle: () => set({ phase: 'idle', targetId: null, t0: null, fade: false }),
  jumpTo: (phase, id = null) => set({ phase, targetId: id, t0: null, fade: false }),
}))
