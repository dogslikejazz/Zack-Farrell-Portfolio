import useMedia from './useMedia'

export default function usePrefersReducedMotion() {
  return useMedia('(prefers-reduced-motion: reduce)')
}
