/**
 * BubbleMailer - Accurate 3D model for a Padded Bubble Envelope Mailer
 *
 * Architecture:
 *   - Main body: A soft, slightly puffy flattened shape (RoundedBox)
 *   - Logo Plane: A plane placed perfectly on the front face for branding
 *   - Top flap: Folded over and sealed
 *   - Material: Kraft paper / Matte plastic look
 */

import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useTexture, RoundedBox } from '@react-three/drei';

interface Props {
  color: string;
  autoRotate: boolean;
  textureUrl?: string | null;
  bgTextureUrl?: string | null;
  activeFaces?: Record<string, boolean>;
}

const EMPTY_TEX = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=';

export const BubbleMailer = ({ color, autoRotate, textureUrl, bgTextureUrl, activeFaces }: Props) => {
  const groupRef = useRef<THREE.Group>(null!);
  const logoTex = useTexture(textureUrl || EMPTY_TEX);
  const bgTex = useTexture(bgTextureUrl || EMPTY_TEX);
  logoTex.colorSpace = THREE.SRGBColorSpace;
  bgTex.colorSpace = THREE.SRGBColorSpace;

  useFrame((_, dt) => {
    if (groupRef.current && autoRotate) groupRef.current.rotation.y += dt * 0.3;
  });

  const extC = color || '#e1b76c'; // Classic kraft paper yellow/brown

  // Matte, slightly textured look for paper mailer
  const mOuter = new THREE.MeshPhysicalMaterial({ color: extC, roughness: 0.9, clearcoat: 0.05 });
  const mSeal = new THREE.MeshPhysicalMaterial({ color: '#cccccc', roughness: 0.8 }); // Silverish seal strip

  const showLogo = !activeFaces || activeFaces['front'] !== false;
  const frontTex = showLogo && textureUrl ? logoTex : (bgTextureUrl ? bgTex : null);

  const BW = 1.4;
  const BH = 1.8;
  const BD = 0.15; // Puffy thickness

  return (
    <group ref={groupRef} position={[0, 0, 0]} scale={[1.1, 1.1, 1.1]}>
      {/* ── MAIN ENVELOPE BODY ──────────────────────────────────────────────── */}
      {/* Used a single material to prevent RoundedBox group material bugs */}
      <RoundedBox args={[BW, BH, BD]} radius={0.06} smoothness={4} position={[0, 0, 0]} castShadow>
        <primitive object={mOuter} attach="material" />
      </RoundedBox>

      {/* Front Face Logo Plane */}
      {frontTex && (
        <mesh position={[0, 0, BD / 2 + 0.001]}>
          <planeGeometry args={[BW * 0.8, BH * 0.8]} />
          <meshPhysicalMaterial color="#fff" map={frontTex} roughness={0.9} transparent />
        </mesh>
      )}

      {/* ── SIDE SEAMS (crimped edges typical of bubble mailers) ─────────────── */}
      <mesh position={[BW / 2 - 0.02, 0, 0]}>
        <boxGeometry args={[0.04, BH - 0.1, 0.02]} />
        <primitive object={mOuter} />
      </mesh>
      <mesh position={[-BW / 2 + 0.02, 0, 0]}>
        <boxGeometry args={[0.04, BH - 0.1, 0.02]} />
        <primitive object={mOuter} />
      </mesh>
      <mesh position={[0, -BH / 2 + 0.02, 0]}>
        <boxGeometry args={[BW - 0.1, 0.04, 0.02]} />
        <primitive object={mOuter} />
      </mesh>

      {/* ── TOP FLAP (Folded over to the back) ───────────────────────────────── */}
      <group position={[0, BH / 2 - 0.04, 0]} rotation={[Math.PI * 0.95, 0, 0]}>
        <RoundedBox args={[BW - 0.05, 0.4, 0.02]} radius={0.01} smoothness={2} position={[0, 0.2, 0]} castShadow>
          <primitive object={mOuter} attach="material" />
        </RoundedBox>
        {/* Seal Strip visible slightly under the flap edge */}
        <mesh position={[0, 0.35, 0.015]}>
          <boxGeometry args={[BW - 0.2, 0.05, 0.01]} />
          <primitive object={mSeal} />
        </mesh>
      </group>
    </group>
  );
};
