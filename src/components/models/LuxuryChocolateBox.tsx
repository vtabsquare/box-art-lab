import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useTexture } from '@react-three/drei';

interface Props {
  color: string;
  autoRotate: boolean;
  textureUrl?: string | null;
  bgTextureUrl?: string | null;
  activeFaces?: Record<string, boolean>;
}

const EMPTY_TEX = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=';

export const LuxuryChocolateBox = ({ color, autoRotate, textureUrl, bgTextureUrl, activeFaces }: Props) => {
  const groupRef = useRef<THREE.Group>(null!);
  const logoTex = useTexture(textureUrl || EMPTY_TEX);
  logoTex.colorSpace = THREE.SRGBColorSpace;

  useFrame((_, dt) => {
    if (groupRef.current && autoRotate) groupRef.current.rotation.y += dt * 0.2;
  });

  const extC = color || '#4fc3f7'; // Tiffany blue / light blue
  const wallT = 0.04;
  const gridT = 0.015;

  const mOuter = new THREE.MeshPhysicalMaterial({ color: extC, roughness: 0.7, clearcoat: 0.1 });
  const mInner = new THREE.MeshPhysicalMaterial({ color: extC, roughness: 0.9 }); // matching inside
  const mChoc1 = new THREE.MeshPhysicalMaterial({ color: '#3e1a0b', roughness: 0.3 }); // Dark choc
  const mChoc2 = new THREE.MeshPhysicalMaterial({ color: '#8d5524', roughness: 0.4 }); // Milk choc
  const mChoc3 = new THREE.MeshPhysicalMaterial({ color: '#f5deb3', roughness: 0.5 }); // White/caramel choc

  const showLogo = !activeFaces || activeFaces['top'] !== false;
  const lidTex = showLogo && textureUrl ? logoTex : null;

  const BW = 2.4;
  const BD = 1.8;
  const BH = 0.4;
  
  const lw = BW + 0.02;
  const ld = BD + 0.02;
  const lh = 0.45;

  return (
    <group ref={groupRef} scale={[0.7, 0.7, 0.7]} position={[0, -0.1, 0]}>
      {/* ── BASE TRAY ─────────────────────────────────────────────────────────── */}
      <mesh scale={0.999} position={[0, -BH / 2, 0]} castShadow>
        <boxGeometry args={[BW, wallT, BD]} />
        <primitive object={mOuter} />
      </mesh>
      <mesh scale={0.999} position={[0, 0, BD / 2 - wallT / 2]} castShadow>
        <boxGeometry args={[BW, BH, wallT]} />
        <primitive object={mOuter} />
      </mesh>
      <mesh scale={0.999} position={[0, 0, -BD / 2 + wallT / 2]} castShadow>
        <boxGeometry args={[BW, BH, wallT]} />
        <primitive object={mOuter} />
      </mesh>
      <mesh scale={0.999} position={[-BW / 2 + wallT / 2, 0, 0]} castShadow>
        <boxGeometry args={[wallT, BH, BD]} />
        <primitive object={mOuter} />
      </mesh>
      <mesh scale={0.999} position={[BW / 2 - wallT / 2, 0, 0]} castShadow>
        <boxGeometry args={[wallT, BH, BD]} />
        <primitive object={mOuter} />
      </mesh>

      {/* Inner Floor */}
      <mesh scale={0.999} position={[0, -BH / 2 + wallT, 0]}>
        <boxGeometry args={[BW - wallT * 2, 0.01, BD - wallT * 2]} />
        <primitive object={mInner} />
      </mesh>

      {/* ── GRID INSERT (4 columns x 3 rows) ─────────────────────────────────── */}
      {/* Vertical dividers (3 total) */}
      {[-0.6, 0, 0.6].map((x, i) => (
        <mesh scale={0.999} key={`v-${i}`} position={[x, -0.05, 0]}>
          <boxGeometry args={[gridT, BH - 0.1, BD - wallT * 2]} />
          <primitive object={mInner} />
        </mesh>
      ))}
      {/* Horizontal dividers (2 total) */}
      {[-0.3, 0.3].map((z, i) => (
        <mesh scale={0.999} key={`h-${i}`} position={[0, -0.05, z]}>
          <boxGeometry args={[BW - wallT * 2, BH - 0.1, gridT]} />
          <primitive object={mInner} />
        </mesh>
      ))}

      {/* ── SAMPLE CHOCOLATES ────────────────────────────────────────────────── */}
      <mesh scale={0.999} position={[-0.9, -BH / 2 + wallT + 0.1, -0.6]} castShadow>
        <sphereGeometry args={[0.15, 32, 32]} />
        <primitive object={mChoc1} />
      </mesh>
      <mesh scale={0.999} position={[0.3, -BH / 2 + wallT + 0.1, 0.6]} castShadow>
        <cylinderGeometry args={[0.15, 0.15, 0.2, 32]} />
        <primitive object={mChoc2} />
      </mesh>
      <mesh scale={0.999} position={[0.9, -BH / 2 + wallT + 0.1, 0]} castShadow>
        <boxGeometry args={[0.25, 0.2, 0.25]} />
        <primitive object={mChoc3} />
      </mesh>

      {/* ── LID (Hinged at back top edge) ────────────────────────────────────── */}
      <group position={[0, BH / 2, -BD / 2 + wallT / 2]} rotation={[-Math.PI * 0.55, 0, 0]}>
        {/* Lid Top */}
        <mesh scale={0.999} position={[0, lh, BD / 2]} castShadow>
          <boxGeometry args={[lw, wallT, ld]} />
          <primitive object={mOuter} />
        </mesh>
        
        {/* Lid Walls */}
        <mesh scale={0.999} position={[0, lh / 2, ld - wallT / 2]} castShadow>
          <boxGeometry args={[lw, lh, wallT]} />
          <primitive object={mOuter} />
        </mesh>
        <mesh scale={0.999} position={[0, lh / 2, wallT / 2]} castShadow>
          <boxGeometry args={[lw, lh, wallT]} />
          <primitive object={mOuter} />
        </mesh>
        <mesh scale={0.999} position={[-lw / 2 + wallT / 2, lh / 2, ld / 2]} castShadow>
          <boxGeometry args={[wallT, lh, ld]} />
          <primitive object={mOuter} />
        </mesh>
        <mesh scale={0.999} position={[lw / 2 - wallT / 2, lh / 2, ld / 2]} castShadow>
          <boxGeometry args={[wallT, lh, ld]} />
          <primitive object={mOuter} />
        </mesh>

        {/* Inner lid logo (gold foil effect) */}
        {lidTex && (
          <mesh scale={0.999} position={[0, lh - wallT - 0.01, BD / 2]} rotation={[Math.PI / 2, Math.PI, 0]}>
            <planeGeometry args={[1.6, 1.2]} />
            <meshPhysicalMaterial color="#fff" map={logoTex} roughness={0.5} metalness={0.8} transparent />
          </mesh>
        )}
      </group>
    </group>
  );
};
