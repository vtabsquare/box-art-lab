/**
 * ToteBag - Accurate 3D model for a Canvas Tote Bag
 *
 * Architecture:
 *   - Main body: A flat, slightly thick fabric bag shape
 *   - Handles: Two long, curved straps attached to the top
 *   - Material: Rough canvas texture
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

export const ToteBag = ({ color, autoRotate, textureUrl, bgTextureUrl, activeFaces }: Props) => {
  const groupRef = useRef<THREE.Group>(null!);
  const logoTex = useTexture(textureUrl || EMPTY_TEX);
  logoTex.colorSpace = THREE.SRGBColorSpace;

  useFrame((_, dt) => {
    if (groupRef.current && autoRotate) groupRef.current.rotation.y += dt * 0.3;
  });

  const extC = color || '#f4f1ea'; // Canvas cream

  const mOuter = new THREE.MeshPhysicalMaterial({ color: extC, roughness: 1.0, clearcoat: 0 });

  const showLogo = !activeFaces || activeFaces['front'] !== false;
  const frontTex = showLogo && textureUrl ? logoTex : null;

  const BW = 1.8;
  const BH = 2.0;
  const BD = 0.2; // Thin bag

  // Draw bag profile (slightly wider at top)
  const shape = new THREE.Shape();
  shape.moveTo(-BW / 2 + 0.1, -BH / 2);
  shape.lineTo(BW / 2 - 0.1, -BH / 2);
  shape.lineTo(BW / 2, BH / 2);
  shape.lineTo(-BW / 2, BH / 2);
  shape.lineTo(-BW / 2 + 0.1, -BH / 2);

  const extrudeSettings = {
    steps: 1,
    depth: BD,
    bevelEnabled: true,
    bevelThickness: 0.05,
    bevelSize: 0.05,
    bevelSegments: 4
  };

  return (
    <group ref={groupRef} position={[0, -0.4, 0]} scale={[1.1, 1.1, 1.1]}>
      {/* ── BAG BODY ────────────────────────────────────────────────────────── */}
      <mesh position={[0, 0, -BD / 2]} castShadow>
        <extrudeGeometry args={[shape, extrudeSettings]} />
        <primitive object={mOuter} />
      </mesh>

      {/* Front Face Logo Plane */}
      {frontTex && (
        <mesh position={[0, 0, BD / 2 + 0.051]}>
          <planeGeometry args={[BW * 0.7, BH * 0.6]} />
          <meshPhysicalMaterial color="#fff" map={frontTex} roughness={1.0} transparent />
        </mesh>
      )}

      {/* ── HANDLES ─────────────────────────────────────────────────────────── */}
      {/* Front Handle */}
      <mesh position={[0, BH / 2 + 0.5, BD / 2 + 0.05]} rotation={[0, 0, 0]}>
        <torusGeometry args={[0.4, 0.04, 8, 32, Math.PI]} />
        <primitive object={mOuter} />
      </mesh>
      {/* Strap extensions to sew into bag */}
      <mesh position={[-0.4, BH / 2 + 0.2, BD / 2 + 0.05]}>
        <boxGeometry args={[0.08, 0.6, 0.02]} />
        <primitive object={mOuter} />
      </mesh>
      <mesh position={[0.4, BH / 2 + 0.2, BD / 2 + 0.05]}>
        <boxGeometry args={[0.08, 0.6, 0.02]} />
        <primitive object={mOuter} />
      </mesh>

      {/* Back Handle */}
      <mesh position={[0, BH / 2 + 0.5, -BD / 2 - 0.05]} rotation={[0, 0, 0]}>
        <torusGeometry args={[0.4, 0.04, 8, 32, Math.PI]} />
        <primitive object={mOuter} />
      </mesh>
      <mesh position={[-0.4, BH / 2 + 0.2, -BD / 2 - 0.05]}>
        <boxGeometry args={[0.08, 0.6, 0.02]} />
        <primitive object={mOuter} />
      </mesh>
      <mesh position={[0.4, BH / 2 + 0.2, -BD / 2 - 0.05]}>
        <boxGeometry args={[0.08, 0.6, 0.02]} />
        <primitive object={mOuter} />
      </mesh>
      
      {/* Top Hem / Seam */}
      <mesh position={[0, BH / 2, 0]}>
        <boxGeometry args={[BW, 0.08, BD + 0.12]} />
        <primitive object={mOuter} />
      </mesh>
    </group>
  );
};
