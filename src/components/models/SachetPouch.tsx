/**
 * SachetPouch - Accurate 3D model for a Sachet / Strip Pouch
 *
 * Architecture:
 *   - Main body: Small, thin flat rectangle slightly puffy in center
 *   - Crimped edges: Distinct border strips on all four sides
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

export const SachetPouch = ({ color, autoRotate, textureUrl, bgTextureUrl, activeFaces }: Props) => {
  const groupRef = useRef<THREE.Group>(null!);
  const logoTex = useTexture(textureUrl || EMPTY_TEX);
  logoTex.colorSpace = THREE.SRGBColorSpace;

  useFrame((_, dt) => {
    if (groupRef.current && autoRotate) groupRef.current.rotation.y += dt * 0.3;
  });

  const extC = color || '#f2f2f2'; // Clean white sachet
  const mOuter = new THREE.MeshPhysicalMaterial({ color: extC, roughness: 0.6, clearcoat: 0.2 });
  // Make the seals slightly darker/rougher to simulate crimping
  const mSeal = new THREE.MeshPhysicalMaterial({ color: extC, roughness: 0.9, clearcoat: 0.1 });

  const showLogo = !activeFaces || activeFaces['front'] !== false;
  const frontTex = showLogo && textureUrl ? logoTex : null;

  const BW = 1.0;
  const BH = 1.2;
  const BD = 0.08; // Thin puffy middle
  const sealW = 0.08; // Border width

  const shape = new THREE.Shape();
  shape.moveTo(-BW / 2, -BH / 2);
  shape.lineTo(BW / 2, -BH / 2);
  shape.lineTo(BW / 2, BH / 2);
  shape.lineTo(-BW / 2, BH / 2);
  shape.lineTo(-BW / 2, -BH / 2);

  const extrudeSettings = {
    steps: 1,
    depth: BD,
    bevelEnabled: true,
    bevelThickness: 0.02,
    bevelSize: 0.02,
    bevelSegments: 2
  };

  return (
    <group ref={groupRef} position={[0, 0, 0]} scale={[1.4, 1.4, 1.4]}>
      {/* ── POUCH BODY ──────────────────────────────────────────────────────── */}
      <mesh position={[0, 0, -BD / 2]} castShadow>
        <extrudeGeometry args={[shape, extrudeSettings]} />
        <primitive object={mOuter} />
      </mesh>

      {/* Front Face Logo Plane */}
      {frontTex && (
        <mesh position={[0, 0, BD / 2 + 0.021]}>
          <planeGeometry args={[BW * 0.8, BH * 0.7]} />
          <meshPhysicalMaterial color="#fff" map={frontTex} roughness={0.6} clearcoat={0.2} transparent />
        </mesh>
      )}

      {/* ── CRIMPED EDGE SEALS ──────────────────────────────────────────────── */}
      {/* Top Seal */}
      <mesh position={[0, BH / 2 - sealW / 2, 0]}>
        <boxGeometry args={[BW, sealW, BD - 0.04]} />
        <primitive object={mSeal} />
      </mesh>
      {/* Bottom Seal */}
      <mesh position={[0, -BH / 2 + sealW / 2, 0]}>
        <boxGeometry args={[BW, sealW, BD - 0.04]} />
        <primitive object={mSeal} />
      </mesh>
      {/* Left Seal */}
      <mesh position={[-BW / 2 + sealW / 2, 0, 0]}>
        <boxGeometry args={[sealW, BH, BD - 0.04]} />
        <primitive object={mSeal} />
      </mesh>
      {/* Right Seal */}
      <mesh position={[BW / 2 - sealW / 2, 0, 0]}>
        <boxGeometry args={[sealW, BH, BD - 0.04]} />
        <primitive object={mSeal} />
      </mesh>
    </group>
  );
};
