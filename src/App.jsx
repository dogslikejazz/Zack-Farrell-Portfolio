import { lazy, Suspense, useEffect } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { useStore } from './store'
import TransitionController from './TransitionController'
import VideoBackground from './components/VideoBackground'
import StaticHome from './components/StaticHome'
import DeskCanvas from './components/scene/DeskCanvas'
import HomeOverlay from './components/ui/HomeOverlay'
import TransitionFade from './components/ui/TransitionFade'
import Letterbox from './components/ui/Letterbox'
import Loader from './components/ui/Loader'
import useWebGLSupport from './hooks/useWebGLSupport'
import useIsTouch from './hooks/useIsTouch'
import usePrefersReducedMotion from './hooks/usePrefersReducedMotion'

const PhotographyGallery = lazy(() => import('./components/sections/PhotographyGallery'))
const FilmsGrid = lazy(() => import('./components/sections/FilmsGrid'))

// Fixed-layer stack, bottom to top:
//   z0  video   z10 canvas   z15 vignette   z20 home UI
//   z30 section overlays     z35 letterbox  z40 fade
//   z50 loader  z60 grain
export default function App() {
  const webgl = useWebGLSupport()
  const isTouch = useIsTouch()
  const reducedMotion = usePrefersReducedMotion()

  useEffect(() => {
    useStore.getState().setReducedMotion(reducedMotion)
  }, [reducedMotion])

  return (
    <BrowserRouter>
      <TransitionController />
      <VideoBackground />
      {webgl ? <DeskCanvas isTouch={isTouch} /> : <StaticHome />}
      <div className="vignette" aria-hidden="true" />
      {webgl && <HomeOverlay isTouch={isTouch} webgl={webgl} />}
      <Routes>
        <Route path="/" element={null} />
        <Route
          path="/photography"
          element={
            <Suspense fallback={null}>
              <PhotographyGallery />
            </Suspense>
          }
        />
        <Route
          path="/films"
          element={
            <Suspense fallback={null}>
              <FilmsGrid />
            </Suspense>
          }
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      <Letterbox />
      <TransitionFade />
      {webgl && <Loader />}
      <div className="grain" aria-hidden="true" />
    </BrowserRouter>
  )
}
