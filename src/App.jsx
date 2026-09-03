import React, { lazy, Suspense, useEffect } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { useStore } from './store'
import TransitionController from './TransitionController'
import VideoBackground from './components/VideoBackground'
import StaticHome from './components/StaticHome'
import HomeOverlay from './components/ui/HomeOverlay'
import TransitionFade from './components/ui/TransitionFade'
import Letterbox from './components/ui/Letterbox'
import useWebGLSupport from './hooks/useWebGLSupport'
import useIsTouch from './hooks/useIsTouch'
import usePrefersReducedMotion from './hooks/usePrefersReducedMotion'
import { deskObjects } from './content/deskObjects'

// The whole three.js stack lives behind this import — visitors without
// WebGL never download it.
const DeskCanvas = lazy(() => import('./components/scene/DeskCanvas'))
const PhotographyGallery = lazy(() => import('./components/sections/PhotographyGallery'))
const FilmsGrid = lazy(() => import('./components/sections/FilmsGrid'))
const MusicSection = lazy(() => import('./components/sections/MusicSection'))
const GameDevSection = lazy(() => import('./components/sections/GameDevSection'))

const isShown = (id) => deskObjects.some((o) => o.id === id)

// A renderer crash anywhere under the canvas downgrades to the static
// experience instead of white-screening the site.
class CanvasBoundary extends React.Component {
  state = { failed: false }
  static getDerivedStateFromError() {
    return { failed: true }
  }
  componentDidCatch() {
    useStore.getState().markWebglFailed()
  }
  render() {
    return this.state.failed ? null : this.props.children
  }
}

// Fixed-layer stack, bottom to top:
//   z0  video   z10 canvas   z15 vignette   z20 home UI
//   z30 section overlays     z35 letterbox  z40 fade
//   z50 loader  z60 grain
export default function App() {
  const webglSupported = useWebGLSupport()
  const webglFailed = useStore((s) => s.webglFailed)
  const webgl = webglSupported && !webglFailed
  const isTouch = useIsTouch()
  const reducedMotion = usePrefersReducedMotion()

  useEffect(() => {
    useStore.getState().setReducedMotion(reducedMotion)
  }, [reducedMotion])

  useEffect(() => {
    useStore.getState().setWebgl(webgl)
  }, [webgl])

  return (
    <BrowserRouter>
      <TransitionController />
      <VideoBackground />
      {webgl ? (
        <CanvasBoundary>
          <Suspense fallback={null}>
            <DeskCanvas isTouch={isTouch} />
          </Suspense>
        </CanvasBoundary>
      ) : (
        <StaticHome />
      )}
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
          path="/videography"
          element={
            <Suspense fallback={null}>
              <FilmsGrid />
            </Suspense>
          }
        />
        {/* Sections for hidden desk objects are unrouted — the catch-all
            below sends their URLs back to the desk */}
        {isShown('music') && (
          <Route
            path="/music"
            element={
              <Suspense fallback={null}>
                <MusicSection />
              </Suspense>
            }
          />
        )}
        {isShown('gamedev') && (
          <Route
            path="/gamedev"
            element={
              <Suspense fallback={null}>
                <GameDevSection />
              </Suspense>
            }
          />
        )}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      <Letterbox />
      <TransitionFade />
      <div className="grain" aria-hidden="true" />
    </BrowserRouter>
  )
}
