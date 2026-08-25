// Stylized stand-in geometry, used only if a .glb fails to load —
// the desk stays browsable even with a missing/broken model file.

function FallbackCamera({ size }) {
  const s = size * 0.55
  return (
    <group>
      <mesh position={[0, s * 0.45, 0]}>
        <boxGeometry args={[s * 1.4, s * 0.9, s * 0.8]} />
        <meshStandardMaterial color="#232327" roughness={0.5} metalness={0.4} />
      </mesh>
      <mesh position={[0, s * 0.45, s * 0.55]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[s * 0.28, s * 0.32, s * 0.5, 24]} />
        <meshStandardMaterial color="#141416" roughness={0.3} metalness={0.6} />
      </mesh>
      <mesh position={[-s * 0.35, s * 1.02, 0]}>
        <cylinderGeometry args={[s * 0.16, s * 0.16, s * 0.22, 20]} />
        <meshStandardMaterial color="#2c2c31" roughness={0.5} metalness={0.4} />
      </mesh>
    </group>
  )
}

function FallbackClapperboard({ size }) {
  const s = size * 0.6
  return (
    <group rotation={[0, 0, 0]}>
      <mesh position={[0, s * 0.3, 0]}>
        <boxGeometry args={[s * 1.5, s * 0.55, s * 0.12]} />
        <meshStandardMaterial color="#1b1b1f" roughness={0.6} />
      </mesh>
      <mesh position={[-s * 0.12, s * 0.68, 0]} rotation={[0, 0, 0.28]}>
        <boxGeometry args={[s * 1.5, s * 0.16, s * 0.12]} />
        <meshStandardMaterial color="#e8e4dc" roughness={0.6} />
      </mesh>
    </group>
  )
}

export default function FallbackShape({ id, size }) {
  return id === 'films' ? <FallbackClapperboard size={size} /> : <FallbackCamera size={size} />
}
