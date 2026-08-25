const cache = new Map()

export function preloadSfx(src) {
  if (!cache.has(src)) {
    const audio = new Audio(src)
    audio.preload = 'auto'
    cache.set(src, audio)
  }
}

export function playSfx(src) {
  preloadSfx(src)
  const audio = cache.get(src)
  try {
    audio.currentTime = 0
    audio.volume = 0.9
    audio.play().catch(() => {})
  } catch {
    // missing or blocked audio should never break navigation
  }
}
