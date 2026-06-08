/**
 * SideGussetPouch - Accurate 3D model for a Coffee/Tea Side Gusset Bag
 *
 * Architecture:
 *   - Main body: Block-bottom pouch that pinches at the top
 *   - Side gussets: Folded in (represented by geometry profile)
 *   - Top seal: Folded over or crimped
 */

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

export const SideGussetPouch = ({ color, autoRotate, textureUrl, bgTextureUrl, activeFaces }: Props) => {
  const groupRef = useRef<THREE.Group>(null!);
  const logoTex = useTexture(textureUrl || EMPTY_TEX);
  logoTex.colorSpace = THREE.SRGBColorSpace;

  useFrame((_, dt) => {
    if (groupRef.current && autoRotate) groupRef.current.rotation.y += dt * 0.3;
  });

  const extC = color || '#d84b2c'; // Red/Orange coffee bag
  const mOuter = new THREE.MeshPhysicalMaterial({ color: extC, roughness: 0.6, clearcoat: 0.2 });

  const showLogo = !activeFaces || activeFaces['front'] !== false;
  const frontTex = showLogo && textureUrl ? logoTex : null;

  const BW = 1.2;
  const BH = 2.4;
  const B_Depth = 0.8; // Deep square bottom
  const T_Depth = 0.05; // Pinched top

  const shape = new THREE.Shape();
  // Bottom
  shape.moveTo(-B_Depth / 2, -BH / 2);
  shape.lineTo(B_Depth / 2, -BH / 2);
  // Straight up for a bit
  shape.lineTo(B_Depth / 2, BH / 4);
  // Pinch to top
  shape.lineTo(T_Depth / 2, BH / 2);
  shape.lineTo(-T_Depth / 2, BH / 2);
  shape.lineTo(-B_Depth / 2, BH / 4);
  shape.lineTo(-B_Depth / 2, -BH / 2);

  const extrudeSettings = {
    steps: 1,
    depth: BW,
    bevelEnabled: true,
    bevelThickness: 0.02,
    bevelSize: 0.02,
    bevelSegments: 3
  };

  return (
    <group ref={groupRef} position={[0, 0, 0]} scale={[1.1, 1.1, 1.1]}>
      {/* ── POUCH BODY ──────────────────────────────────────────────────────── */}
      <mesh position={[-BW / 2, 0, 0]} rotation={[0, Math.PI / 2, 0]} castShadow>
        <extrudeGeometry args={[shape, extrudeSettings]} />
        <primitive object={mOuter} />
      </mesh>

      {/* Front Face Logo Plane */}
      {frontTex && (
        <group>
          {/* Main lower front plane */}
          <mesh position={[0, -BH / 8, B_Depth / 2 + 0.022]}>
            <planeGeometry args={[BW * 0.9, BH * 0.7]} />
            <meshPhysicalMaterial color="#fff" map={frontTex} roughness={0.6} clearcoat={0.2} transparent />
          </mesh>
          {/* Slanted upper front plane */}
          <mesh position={[0, BH * 0.375, B_Depth / 4 + 0.022]} rotation={[-0.45, 0, 0]}>
            <planeGeometry args={[BW * 0.9, BH * 0.3]} />
            <meshPhysicalMaterial color="#fff" map={frontTex} roughness={0.6} clearcoat={0.2} transparent />
          </mesh>
        </group>
      )}

      {/* ── TOP CRIMP SEAL ──────────────────────────────────────────────────── */}
      <mesh position={[0, BH / 2 + 0.05, 0]}>
        <boxGeometry args={[BW + 0.04, 0.15, T_Depth + 0.02]} />
        <primitive object={mOuter} />
      </mesh>
      {/* Degassing valve (typical on coffee bags) */}
      <mesh position={[0, BH / 4 - 0.2, B_Depth / 2 + 0.02]}>
        <cylinderGeometry args={[0.08, 0.08, 0.02, 16]} rotation={[Math.PI / 2, 0, 0]} />
        <meshPhysicalMaterial color="#333" roughness={0.9} />
      </mesh>
    </group>
  );
};
