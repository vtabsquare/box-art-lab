import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface Props { color: string; autoRotate: boolean; textureUrl?: string | null; }

export const CakeBox = ({ color, autoRotate, textureUrl }: Props) => {
  const groupRef = useRef<THREE.Group>(null!);

  const texture = useMemo(() => {
    if (!textureUrl) return null;
    const t = new THREE.TextureLoader().load(textureUrl);
    t.colorSpace = THREE.SRGBColorSpace;
    return t;
  }, [textureUrl]);

  useFrame((_, delta) => {
    if (groupRef.current && autoRotate) groupRef.current.rotation.y += delta * 0.35;
  });

  const boxColor = color || '#ffffff';
  
  // Paper/Cardboard material
  const mat = (col = boxColor) => (
    <meshPhysicalMaterial
      color={texture ? '#ffffff' : col}
      map={texture ?? undefined}
      roughness={0.8}
      metalness={0.0}
    />
  );

  // Clear plastic window material
  const glassMat = (
    <meshPhysicalMaterial
      color="#ffffff"
      roughness={0.05}
      transmission={0.95}
      thickness={0.01}
      transparent
      opacity={0.6}
      envMapIntensity={2.0}
      clearcoat={1.0}
    />
  );

  // ── Dimensions ───────────────────────────────────────────────
  const W = 1.4;
  const D = 1.4;
  const H = 0.75;
  const bt = 0.02;

  const marginX = 0.25;      // Left/right border of window
  const marginY = 0.2;       // Bottom border of front window
  const marginZBack = 0.4;   // Back border on top window
  const marginZFront = 0.15; // Front border on top window

  const halfW = W / 2;
  const halfD = D / 2;
  const halfH = H / 2;

  return (
    <group ref={groupRef} position={[0, 0, 0]}>
      
      {/* ══════════════ SOLID WALLS ══════════════ */}
      
      {/* Bottom Floor */}
      <mesh castShadow receiveShadow position={[0, -halfH + bt/2, 0]}>
        <boxGeometry args={[W, bt, D]} />
        {mat()}
      </mesh>
      
      {/* Back Wall */}
      <mesh castShadow receiveShadow position={[0, 0, -halfD + bt/2]}>
        <boxGeometry args={[W, H, bt]} />
        {mat()}
      </mesh>

      {/* Left Wall */}
      <mesh castShadow receiveShadow position={[-halfW + bt/2, 0, 0]}>
        <boxGeometry args={[bt, H, D]} />
        {mat()}
      </mesh>

      {/* Right Wall */}
      <mesh castShadow receiveShadow position={[halfW - bt/2, 0, 0]}>
        <boxGeometry args={[bt, H, D]} />
        {mat()}
      </mesh>

      {/* Interior Base (Cardboard color for realism when looking through window) */}
      {!texture && (
        <mesh position={[0, -halfH + bt + 0.001, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[W - bt * 2, D - bt * 2]} />
          <meshStandardMaterial color="#f5f5dc" roughness={0.9} />
        </mesh>
      )}


      {/* ══════════════ FRONT WALL (Cutout) ══════════════ */}
      
      {/* Front Bottom Strip */}
      <mesh castShadow receiveShadow position={[0, -halfH + marginY/2, halfD - bt/2]}>
        <boxGeometry args={[W, marginY, bt]} />
        {mat()}
      </mesh>

      {/* Front Left Strip */}
      <mesh castShadow receiveShadow position={[-halfW + marginX/2, -halfH + marginY + (H - marginY)/2, halfD - bt/2]}>
        <boxGeometry args={[marginX, H - marginY, bt]} />
        {mat()}
      </mesh>

      {/* Front Right Strip */}
      <mesh castShadow receiveShadow position={[halfW - marginX/2, -halfH + marginY + (H - marginY)/2, halfD - bt/2]}>
        <boxGeometry args={[marginX, H - marginY, bt]} />
        {mat()}
      </mesh>


      {/* ══════════════ TOP LID (Cutout) ══════════════ */}
      
      {/* Top Back Strip */}
      <mesh castShadow receiveShadow position={[0, halfH - bt/2, -halfD + marginZBack/2]}>
        <boxGeometry args={[W, bt, marginZBack]} />
        {mat()}
      </mesh>

      {/* Top Front Strip */}
      <mesh castShadow receiveShadow position={[0, halfH - bt/2, halfD - marginZFront/2]}>
        <boxGeometry args={[W, bt, marginZFront]} />
        {mat()}
      </mesh>

      {/* Top Left Strip */}
      <mesh castShadow receiveShadow position={[-halfW + marginX/2, halfH - bt/2, (marginZBack - marginZFront)/2]}>
        <boxGeometry args={[marginX, bt, D - marginZBack - marginZFront]} />
        {mat()}
      </mesh>

      {/* Top Right Strip */}
      <mesh castShadow receiveShadow position={[halfW - marginX/2, halfH - bt/2, (marginZBack - marginZFront)/2]}>
        <boxGeometry args={[marginX, bt, D - marginZBack - marginZFront]} />
        {mat()}
      </mesh>


      {/* ══════════════ CLEAR PLASTIC WINDOW ══════════════ */}
      
      {/* Top Window */}
      <mesh position={[0, halfH - bt/2, (marginZBack - marginZFront)/2]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[W - marginX * 2 + 0.02, D - marginZBack - marginZFront + 0.02]} />
        {glassMat}
      </mesh>

      {/* Front Window */}
      <mesh position={[0, -halfH + marginY + (H - marginY)/2, halfD - bt/2]}>
        <planeGeometry args={[W - marginX * 2 + 0.02, H - marginY + 0.02]} />
        {glassMat}
      </mesh>

    </group>
  );
};
