/**
 * SpoutPouch - Accurate 3D model for a Liquid Spout Pouch
 *
 * Architecture:
 *   - Main body: Stand up pouch shape (puffy bottom, pinched top)
 *   - Spout: Plastic nozzle glued into the top-left corner seam
 *   - Cap: Ridged plastic screw cap
 *   - Front logo plane
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

export const SpoutPouch = ({ color, autoRotate, textureUrl, bgTextureUrl, activeFaces }: Props) => {
  const groupRef = useRef<THREE.Group>(null!);
  const logoTex = useTexture(textureUrl || EMPTY_TEX);
  logoTex.colorSpace = THREE.SRGBColorSpace;

  useFrame((_, dt) => {
    if (groupRef.current && autoRotate) groupRef.current.rotation.y += dt * 0.3;
  });

  const extC = color || '#007eb5'; // Blue like the reference
  const spoutC = '#005a8c'; // Darker blue for spout/cap

  const mOuter = new THREE.MeshPhysicalMaterial({ color: extC, roughness: 0.3, clearcoat: 0.8 });
  const mSpout = new THREE.MeshPhysicalMaterial({ color: spoutC, roughness: 0.5, clearcoat: 0.2 });

  const showLogo = !activeFaces || activeFaces['front'] !== false;
  const frontTex = showLogo && textureUrl ? logoTex : null;

  const BW = 1.4;
  const BH = 2.0;
  const B_Depth = 0.5; // Bottom depth
  const T_Depth = 0.04; // Top depth

  const shape = new THREE.Shape();
  shape.moveTo(-B_Depth / 2, -BH / 2);
  shape.lineTo(B_Depth / 2, -BH / 2);
  shape.bezierCurveTo(B_Depth / 2, 0, T_Depth / 2, BH / 2, T_Depth / 2, BH / 2);
  shape.lineTo(-T_Depth / 2, BH / 2);
  shape.bezierCurveTo(-T_Depth / 2, BH / 2, -B_Depth / 2, 0, -B_Depth / 2, -BH / 2);

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
      <mesh scale={0.999} position={[-BW / 2, 0, 0]} rotation={[0, Math.PI / 2, 0]} castShadow>
        <extrudeGeometry args={[shape, extrudeSettings]} />
        <primitive object={mOuter} />
      </mesh>

      {/* Front Face Logo Plane */}
      {frontTex && (
        <mesh scale={0.999} position={[0, 0, B_Depth / 3 + 0.04]} rotation={[-0.05, 0, 0]}>
          <planeGeometry args={[BW * 0.8, BH * 0.7]} />
          <meshPhysicalMaterial color="#fff" map={frontTex} roughness={0.3} clearcoat={0.8} transparent />
        </mesh>
      )}

      {/* ── HEAT SEAL EDGES ──────────────────────────────────────────────────── */}
      {/* Top seal */}
      <mesh scale={0.999} position={[0, BH / 2 - 0.05, 0]}>
        <boxGeometry args={[BW, 0.1, T_Depth + 0.01]} />
        <primitive object={mOuter} />
      </mesh>
      {/* Cut corner for spout */}
      <mesh scale={0.999} position={[-BW / 2 + 0.15, BH / 2 - 0.15, 0]} rotation={[0, 0, Math.PI / 4]}>
        <boxGeometry args={[0.4, 0.1, T_Depth + 0.02]} />
        <primitive object={mOuter} />
      </mesh>

      {/* Side seals */}
      <mesh scale={0.999} position={[BW / 2, 0, 0]} rotation={[-0.05, 0, 0]}>
        <boxGeometry args={[0.08, BH, T_Depth + 0.02]} />
        <primitive object={mOuter} />
      </mesh>
      <mesh scale={0.999} position={[-BW / 2, -0.1, 0]} rotation={[-0.05, 0, 0]}>
        <boxGeometry args={[0.08, BH - 0.2, T_Depth + 0.02]} />
        <primitive object={mOuter} />
      </mesh>

      {/* ── SPOUT AND CAP ────────────────────────────────────────────────────── */}
      <group position={[-BW / 2 + 0.1, BH / 2 - 0.1, 0]} rotation={[0, 0, Math.PI / 4]}>
        {/* Base welded into pouch */}
        <mesh scale={0.999} position={[0, 0.1, 0]}>
          <cylinderGeometry args={[0.1, 0.15, 0.2, 16]} />
          <primitive object={mSpout} />
        </mesh>
        {/* Neck */}
        <mesh scale={0.999} position={[0, 0.25, 0]}>
          <cylinderGeometry args={[0.08, 0.08, 0.1, 16]} />
          <primitive object={mSpout} />
        </mesh>
        {/* Ridged Cap */}
        <mesh scale={0.999} position={[0, 0.35, 0]} castShadow>
          <cylinderGeometry args={[0.12, 0.12, 0.15, 16]} />
          <primitive object={mSpout} />
        </mesh>
      </group>
    </group>
  );
};
