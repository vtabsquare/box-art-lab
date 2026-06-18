/**
 * RetortPouch - Accurate 3D model for a Heat-Resistant Retort Pouch
 *
 * Architecture:
 *   - Main body: Flat rounded rectangle, slightly puffy in the center
 *   - Edges: Thick, visible sealed seams on all 4 sides
 *   - Tear notches: Small indents on the top seams
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

export const RetortPouch = ({ color, autoRotate, textureUrl, bgTextureUrl, activeFaces }: Props) => {
  const groupRef = useRef<THREE.Group>(null!);
  const logoTex = useTexture(textureUrl || EMPTY_TEX);
  logoTex.colorSpace = THREE.SRGBColorSpace;

  useFrame((_, dt) => {
    if (groupRef.current && autoRotate) groupRef.current.rotation.y += dt * 0.3;
  });

  const extC = color || '#e8e8e8'; // Metallic white/grey base
  const mOuter = new THREE.MeshPhysicalMaterial({ color: extC, roughness: 0.2, metalness: 0.3, clearcoat: 0.8 });

  const showLogo = !activeFaces || activeFaces['front'] !== false;
  const frontTex = showLogo && textureUrl ? logoTex : null;

  const BW = 1.8;
  const BH = 2.4;
  const BD = 0.2; // Puffy thickness
  const radius = 0.1;

  // Draw rounded rectangle for the flat profile
  const shape = new THREE.Shape();
  shape.moveTo(-BW / 2 + radius, -BH / 2);
  shape.lineTo(BW / 2 - radius, -BH / 2);
  shape.quadraticCurveTo(BW / 2, -BH / 2, BW / 2, -BH / 2 + radius);
  shape.lineTo(BW / 2, BH / 2 - radius);
  shape.quadraticCurveTo(BW / 2, BH / 2, BW / 2 - radius, BH / 2);
  shape.lineTo(-BW / 2 + radius, BH / 2);
  shape.quadraticCurveTo(-BW / 2, BH / 2, -BW / 2, BH / 2 - radius);
  shape.lineTo(-BW / 2, -BH / 2 + radius);
  shape.quadraticCurveTo(-BW / 2, -BH / 2, -BW / 2 + radius, -BH / 2);

  const extrudeSettings = {
    steps: 1,
    depth: BD,
    bevelEnabled: true,
    bevelThickness: 0.05,
    bevelSize: 0.05,
    bevelSegments: 4
  };

  return (
    <group ref={groupRef} position={[0, 0, 0]} scale={[1.1, 1.1, 1.1]}>
      {/* ── POUCH BODY ──────────────────────────────────────────────────────── */}
      <mesh scale={0.999} position={[0, 0, -BD / 2]} castShadow>
        <extrudeGeometry args={[shape, extrudeSettings]} />
        <primitive object={mOuter} />
      </mesh>

      {/* Front Face Logo Plane */}
      {frontTex && (
        <mesh scale={0.999} position={[0, 0, BD / 2 + 0.051]}>
          <planeGeometry args={[BW * 0.9, BH * 0.9]} />
          <meshPhysicalMaterial color="#fff" map={frontTex} roughness={0.2} metalness={0.3} clearcoat={0.8} transparent />
        </mesh>
      )}

      {/* ── THICK EDGE SEALS ────────────────────────────────────────────────── */}
      {/* Top Seal */}
      <mesh scale={0.999} position={[0, BH / 2 - 0.08, 0]}>
        <boxGeometry args={[BW, 0.15, BD + 0.02]} />
        <primitive object={mOuter} />
      </mesh>
      {/* Bottom Seal */}
      <mesh scale={0.999} position={[0, -BH / 2 + 0.08, 0]}>
        <boxGeometry args={[BW, 0.15, BD + 0.02]} />
        <primitive object={mOuter} />
      </mesh>
      {/* Side Seals */}
      <mesh scale={0.999} position={[BW / 2 - 0.05, 0, 0]}>
        <boxGeometry args={[0.1, BH, BD + 0.02]} />
        <primitive object={mOuter} />
      </mesh>
      <mesh scale={0.999} position={[-BW / 2 + 0.05, 0, 0]}>
        <boxGeometry args={[0.1, BH, BD + 0.02]} />
        <primitive object={mOuter} />
      </mesh>

      {/* Tear Notches */}
      <mesh scale={0.999} position={[BW / 2, BH / 2 - 0.2, 0]}>
        <cylinderGeometry args={[0.04, 0.04, BD + 0.04, 16]} rotation={[Math.PI / 2, 0, 0]} />
        <meshBasicMaterial color="#ffffff" /> {/* Just to cut out visually, though true boolean cut is hard, we can fake it with bg color or leave it */}
      </mesh>
      <mesh scale={0.999} position={[-BW / 2, BH / 2 - 0.2, 0]}>
        <cylinderGeometry args={[0.04, 0.04, BD + 0.04, 16]} rotation={[Math.PI / 2, 0, 0]} />
        <meshBasicMaterial color="#ffffff" />
      </mesh>
    </group>
  );
};
