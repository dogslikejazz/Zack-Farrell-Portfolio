import { useMemo } from 'react'

export default function useWebGLSupport() {
  return useMemo(() => {
    try {
      const canvas = document.createElement('canvas')
      const gl = canvas.getContext('webgl2') || canvas.getContext('webgl')
      const ok = !!(window.WebGLRenderingContext && gl)
      // Free the probe context immediately — browsers cap live WebGL
      // contexts, and a leaked probe counts against the real canvas.
      gl?.getExtension('WEBGL_lose_context')?.loseContext()
      return ok
    } catch {
      return false
    }
  }, [])
}
