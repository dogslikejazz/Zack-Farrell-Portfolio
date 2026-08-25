import React, { Suspense } from 'react'
import { Environment } from '@react-three/drei'

// The HDR file is a nice-to-have (specular response on lenses/metal).
// If it's missing or fails to load, the scene must keep working on
// the ambient + directional lights alone.
class EnvBoundary extends React.Component {
  state = { failed: false }
  static getDerivedStateFromError() {
    return { failed: true }
  }
  render() {
    return this.state.failed ? null : this.props.children
  }
}

export default function SafeEnvironment({ files }) {
  return (
    <EnvBoundary>
      <Suspense fallback={null}>
        <Environment files={files} />
      </Suspense>
    </EnvBoundary>
  )
}
