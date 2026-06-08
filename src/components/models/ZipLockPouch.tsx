/**
 * ZipLockPouch - Accurate 3D model for a Resealable Zip Pouch
 *
 * Architecture:
 *   - Main body: Stand up pouch shape (puffy bottom, pinched top)
 *   - Zip lock line: A horizontal ridge near the top
 *   - Tear notches: Small cutouts or printed lines on the sides
 *   - Front logo plane to avoid multi-material bugs
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

export const ZipLockPouch = ({ color, autoRotate, textureUrl, bgTextureUrl, activeFaces }: Props) => {
  const groupRef = useRef<THREE.Group>(null!);
  const logoTex = useTexture(textureUrl || EMPTY_TEX);
  logoTex.colorSpace = THREE.SRGBColorSpace;

  useFrame((_, dt) => {
    if (groupRef.current && autoRotate) groupRef.current.rotation.y += dt * 0.3;
  });

  const extC = color || '#eeeeee'; 
  const mOuter = new THREE.MeshPhysicalMaterial({ color: extC, roughness: 0.4, clearcoat: 0.6 });
  const mZip = new THREE.MeshPhysicalMaterial({ color: '#cccccc', roughness: 0.8 });

  const showLogo = !activeFaces || activeFaces['front'] !== false;
  const frontTex = showLogo && textureUrl ? logoTex : null;

  const BW = 1.6;
  const BH = 2.2;
  const B_Depth = 0.4; // Bottom depth
  const T_Depth = 0.04; // Top depth (pinched)

  // Custom geometry for a stand-up pouch (trapezoidal profile)
  // We can use a simple BoxGeometry and scale its vertices, or use a combination of shapes.
  // Using an extruded shape is cleanest.
  
  const shape = new THREE.Shape();
  // Drawing the side profile:
  shape.moveTo(-B_Depth / 2, -BH / 2); // Bottom back
  shape.lineTo(B_Depth / 2, -BH / 2);  // Bottom front
  shape.bezierCurveTo(
    B_Depth / 2, 0,
    T_Depth / 2, BH / 2,
    T_Depth / 2, BH / 2
  ); // Front curve
  shape.lineTo(-T_Depth / 2, BH / 2);  // Top back
  shape.bezierCurveTo(
    -T_Depth / 2, BH / 2,
    -B_Depth / 2, 0,
    -B_Depth / 2, -BH / 2
  ); // Back curve

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
      {/* Rotate the extrusion so the width aligns with X-axis */}
      <mesh position={[-BW / 2, 0, 0]} rotation={[0, Math.PI / 2, 0]} castShadow>
        <extrudeGeometry args={[shape, extrudeSettings]} />
        <primitive object={mOuter} />
      </mesh>

      {/* Front Face Logo Plane */}
      {frontTex && (
        <mesh position={[0, 0, B_Depth / 3 + 0.04]} rotation={[-0.05, 0, 0]}>
          <planeGeometry args={[BW * 0.8, BH * 0.7]} />
          <meshPhysicalMaterial color="#fff" map={frontTex} roughness={0.4} clearcoat={0.6} transparent />
        </mesh>
      )}

      {/* ── ZIPPER LINE ──────────────────────────────────────────────────────── */}
      <mesh position={[0, BH / 2 - 0.25, 0.03]} rotation={[0, 0, 0]}>
        <cylinderGeometry args={[0.015, 0.015, BW, 16]} rotation={[0, 0, Math.PI / 2]} />
        <primitive object={mZip} />
      </mesh>
      <mesh position={[0, BH / 2 - 0.25, -0.03]} rotation={[0, 0, 0]}>
        <cylinderGeometry args={[0.015, 0.015, BW, 16]} rotation={[0, 0, Math.PI / 2]} />
        <primitive object={mZip} />
      </mesh>

      {/* ── HEAT SEAL EDGES ──────────────────────────────────────────────────── */}
      {/* Top seal */}
      <mesh position={[0, BH / 2 - 0.05, 0]}>
        <boxGeometry args={[BW, 0.1, T_Depth + 0.01]} />
        <primitive object={mOuter} />
      </mesh>
      {/* Side seals */}
      <mesh position={[BW / 2, 0, 0]} rotation={[-0.05, 0, 0]}>
        <boxGeometry args={[0.08, BH, T_Depth + 0.02]} />
        <primitive object={mOuter} />
      </mesh>
      <mesh position={[-BW / 2, 0, 0]} rotation={[-0.05, 0, 0]}>
        <boxGeometry args={[0.08, BH, T_Depth + 0.02]} />
        <primitive object={mOuter} />
      </mesh>
    </group>
  );
};
