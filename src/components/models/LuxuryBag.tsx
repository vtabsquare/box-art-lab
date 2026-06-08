/**
 * LuxuryBag - Accurate 3D model for a Luxury Leather Handbag/Duffel
 *
 * Architecture:
 *   - Main body: Extruded dome/duffel profile (flat bottom, rounded top)
 *   - Handles: Rolled leather arches attached with anchor patches
 *   - Hardware: Zipper line across the top
 *   - Material: Smooth cream leather
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

export const LuxuryBag = ({ color, autoRotate, textureUrl, bgTextureUrl, activeFaces }: Props) => {
  const groupRef = useRef<THREE.Group>(null!);
  const logoTex = useTexture(textureUrl || EMPTY_TEX);
  logoTex.colorSpace = THREE.SRGBColorSpace;

  useFrame((_, dt) => {
    if (groupRef.current && autoRotate) groupRef.current.rotation.y += dt * 0.25;
  });

  const extC = color || '#eae8e3'; // Cream leather color

  const mLeather = new THREE.MeshPhysicalMaterial({ color: extC, roughness: 0.7, clearcoat: 0.1 });
  const mHandle = new THREE.MeshPhysicalMaterial({ color: '#f5f5dc', roughness: 0.8 }); // Slightly lighter handle
  const mHardware = new THREE.MeshPhysicalMaterial({ color: '#d4af37', roughness: 0.2, metalness: 0.9 });

  const showLogo = !activeFaces || activeFaces['front'] !== false;
  const frontTex = showLogo && textureUrl ? logoTex : null;

  const BW = 2.4;
  const BD = 1.4;
  const BH = 1.6;

  // Duffel bag side profile
  const shape = new THREE.Shape();
  shape.moveTo(-BD / 2, -BH / 2);
  shape.lineTo(BD / 2, -BH / 2);
  // Straight up slightly
  shape.lineTo(BD / 2, -0.2);
  // Curve over the top
  shape.quadraticCurveTo(BD / 2, BH / 2, 0, BH / 2);
  shape.quadraticCurveTo(-BD / 2, BH / 2, -BD / 2, -0.2);
  shape.lineTo(-BD / 2, -BH / 2);

  const extrudeSettings = {
    steps: 1,
    depth: BW,
    bevelEnabled: true,
    bevelThickness: 0.05,
    bevelSize: 0.05,
    bevelSegments: 4
  };

  return (
    <group ref={groupRef} position={[0, 0, 0]} scale={[0.8, 0.8, 0.8]}>
      {/* ── BAG BODY ────────────────────────────────────────────────────────── */}
      <mesh position={[-BW / 2, 0, 0]} rotation={[0, Math.PI / 2, 0]} castShadow>
        <extrudeGeometry args={[shape, extrudeSettings]} />
        <primitive object={mLeather} />
      </mesh>

      {/* Front Face Logo Plane */}
      {frontTex && (
        <mesh position={[0, -0.2, BD / 2 + 0.051]}>
          <planeGeometry args={[BW * 0.6, BH * 0.5]} />
          <meshPhysicalMaterial color="#fff" map={frontTex} roughness={0.7} transparent />
        </mesh>
      )}

      {/* ── HANDLES & HARDWARE ─────────────────────────────────────────────── */}
      {/* Front Handle Arch */}
      <mesh position={[0, BH / 2, BD / 2 - 0.2]} rotation={[0, 0, 0]}>
        <torusGeometry args={[0.5, 0.05, 16, 64, Math.PI]} />
        <primitive object={mHandle} />
      </mesh>
      {/* Front Anchor Patches */}
      <mesh position={[-0.5, BH / 2 - 0.1, BD / 2 + 0.04]} rotation={[0, 0, 0.3]}>
        <cylinderGeometry args={[0.1, 0.02, 0.3, 3]} rotation={[Math.PI / 2, 0, 0]} />
        <primitive object={mHandle} />
      </mesh>
      <mesh position={[0.5, BH / 2 - 0.1, BD / 2 + 0.04]} rotation={[0, 0, -0.3]}>
        <cylinderGeometry args={[0.1, 0.02, 0.3, 3]} rotation={[Math.PI / 2, 0, 0]} />
        <primitive object={mHandle} />
      </mesh>

      {/* Back Handle Arch */}
      <mesh position={[0, BH / 2, -BD / 2 + 0.2]} rotation={[0, 0, 0]}>
        <torusGeometry args={[0.5, 0.05, 16, 64, Math.PI]} />
        <primitive object={mHandle} />
      </mesh>
      {/* Back Anchor Patches */}
      <mesh position={[-0.5, BH / 2 - 0.1, -BD / 2 - 0.04]} rotation={[0, 0, -0.3]}>
        <cylinderGeometry args={[0.1, 0.02, 0.3, 3]} rotation={[Math.PI / 2, 0, 0]} />
        <primitive object={mHandle} />
      </mesh>
      <mesh position={[0.5, BH / 2 - 0.1, -BD / 2 - 0.04]} rotation={[0, 0, 0.3]}>
        <cylinderGeometry args={[0.1, 0.02, 0.3, 3]} rotation={[Math.PI / 2, 0, 0]} />
        <primitive object={mHandle} />
      </mesh>

      {/* ── ZIPPER LINE ──────────────────────────────────────────────────────── */}
      <mesh position={[0, BH / 2, 0]}>
        <cylinderGeometry args={[0.02, 0.02, BW, 16]} rotation={[0, 0, Math.PI / 2]} />
        <primitive object={mHardware} />
      </mesh>

      {/* ── PIPING SEAMS ─────────────────────────────────────────────────────── */}
      <mesh position={[-BW / 2, -BH / 4, 0]} rotation={[0, 0, 0]}>
        <torusGeometry args={[BD / 2, 0.02, 16, 32]} rotation={[0, Math.PI / 2, 0]} />
        <primitive object={mHandle} />
      </mesh>
      <mesh position={[BW / 2, -BH / 4, 0]} rotation={[0, 0, 0]}>
        <torusGeometry args={[BD / 2, 0.02, 16, 32]} rotation={[0, Math.PI / 2, 0]} />
        <primitive object={mHandle} />
      </mesh>
    </group>
  );
};
