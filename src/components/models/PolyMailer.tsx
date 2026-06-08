/**
 * PolyMailer - Accurate 3D model for a Poly Mailer Plastic Courier Bag
 *
 * Architecture:
 *   - Main body: A flat, glossy plastic envelope shape
 *   - Logo Plane: Positioned perfectly on the front face
 *   - Top flap: Folded over and sealed
 *   - Material: High clearcoat and roughness tuning to mimic stretchy plastic
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

export const PolyMailer = ({ color, autoRotate, textureUrl, bgTextureUrl, activeFaces }: Props) => {
  const groupRef = useRef<THREE.Group>(null!);
  const logoTex = useTexture(textureUrl || EMPTY_TEX);
  const bgTex = useTexture(bgTextureUrl || EMPTY_TEX);
  logoTex.colorSpace = THREE.SRGBColorSpace;
  bgTex.colorSpace = THREE.SRGBColorSpace;

  useFrame((_, dt) => {
    if (groupRef.current && autoRotate) groupRef.current.rotation.y += dt * 0.3;
  });

  const extC = color || '#f5f5f5'; // Typical white/grey poly bag

  // Glossy plastic bag look
  const mOuter = new THREE.MeshPhysicalMaterial({ color: extC, roughness: 0.4, clearcoat: 0.7, clearcoatRoughness: 0.3 });
  
  const showLogo = !activeFaces || activeFaces['front'] !== false;
  const frontTex = showLogo && textureUrl ? logoTex : (bgTextureUrl ? bgTex : null);

  const BW = 1.5;
  const BH = 2.0;
  const BD = 0.08; // Very thin, flatter than bubble mailer

  return (
    <group ref={groupRef} position={[0, 0, 0]} scale={[1.1, 1.1, 1.1]}>
      {/* ── MAIN ENVELOPE BODY ──────────────────────────────────────────────── */}
      {/* Single material to avoid array issues with RoundedBox */}
      <RoundedBox args={[BW, BH, BD]} radius={0.02} smoothness={2} position={[0, 0, 0]} castShadow>
        <primitive object={mOuter} attach="material" />
      </RoundedBox>

      {/* Front Face Logo Plane */}
      {frontTex && (
        <mesh position={[0, 0, BD / 2 + 0.001]}>
          <planeGeometry args={[BW * 0.8, BH * 0.8]} />
          <meshPhysicalMaterial color="#fff" map={frontTex} roughness={0.4} clearcoat={0.7} clearcoatRoughness={0.3} transparent />
        </mesh>
      )}

      {/* ── SEAM LINES (plastic bags have very distinct sealed edge seams) ──── */}
      <mesh position={[BW / 2, 0, 0]}>
        <boxGeometry args={[0.02, BH, 0.005]} />
        <primitive object={mOuter} />
      </mesh>
      <mesh position={[-BW / 2, 0, 0]}>
        <boxGeometry args={[0.02, BH, 0.005]} />
        <primitive object={mOuter} />
      </mesh>
      <mesh position={[0, -BH / 2, 0]}>
        <boxGeometry args={[BW, 0.02, 0.005]} />
        <primitive object={mOuter} />
      </mesh>

      {/* ── TOP FLAP (Folded over to the back) ───────────────────────────────── */}
      <group position={[0, BH / 2 - 0.01, 0]} rotation={[Math.PI * 0.98, 0, 0]}>
        {/* The flap is essentially a thin plastic plane folded tight */}
        <mesh position={[0, 0.25, 0]} castShadow>
          <boxGeometry args={[BW, 0.5, 0.01]} />
          <primitive object={mOuter} />
        </mesh>
      </group>
    </group>
  );
};
