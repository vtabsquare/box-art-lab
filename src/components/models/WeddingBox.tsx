/**
 * WeddingBox - Accurate 3D model for a 2-Piece Rigid Setup Box
 *
 * Architecture:
 *   - Base Tray: Deep rigid lower half
 *   - Lid Tray: Slightly larger upper half, placed angled/hovering to show separation
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

export const WeddingBox = ({ color, autoRotate, textureUrl, bgTextureUrl, activeFaces }: Props) => {
  const groupRef = useRef<THREE.Group>(null!);
  const logoTex = useTexture(textureUrl || EMPTY_TEX);
  const bgTex = useTexture(bgTextureUrl || EMPTY_TEX);
  logoTex.colorSpace = THREE.SRGBColorSpace;
  bgTex.colorSpace = THREE.SRGBColorSpace;

  useFrame((_, dt) => {
    if (groupRef.current && autoRotate) groupRef.current.rotation.y += dt * 0.2;
  });

  const extC = color || '#1d7482'; // Teal like the reference image
  const wallT = 0.04;

  const mOuter = new THREE.MeshPhysicalMaterial({ color: extC, roughness: 0.6, clearcoat: 0.1 });
  const mInner = new THREE.MeshPhysicalMaterial({ color: '#165c68', roughness: 0.8 }); 

  const showLogo = !activeFaces || activeFaces['top'] !== false;
  const topTex = showLogo && textureUrl ? logoTex : (bgTextureUrl ? bgTex : null);
  const mTopLid = new THREE.MeshPhysicalMaterial({ color: topTex ? '#fff' : extC, map: topTex, roughness: 0.6 });

  const BW = 2.4;
  const BD = 2.4;
  const BH_Tray = 1.0;
  const BH_Lid = 1.0;

  return (
    <group ref={groupRef} position={[0, -0.2, 0]} scale={[0.8, 0.8, 0.8]}>
      {/* ── BASE TRAY ─────────────────────────────────────────────────────────── */}
      <group position={[0, 0, 0]}>
        <mesh position={[0, -BH_Tray / 2 + wallT / 2, 0]} castShadow>
          <boxGeometry args={[BW, wallT, BD]} />
          <primitive object={mInner} />
        </mesh>
        <mesh position={[0, 0, BD / 2 - wallT / 2]} castShadow>
          <boxGeometry args={[BW, BH_Tray, wallT]} />
          <primitive object={mOuter} />
        </mesh>
        <mesh position={[0, 0, -BD / 2 + wallT / 2]} castShadow>
          <boxGeometry args={[BW, BH_Tray, wallT]} />
          <primitive object={mOuter} />
        </mesh>
        <mesh position={[-BW / 2 + wallT / 2, 0, 0]} castShadow>
          <boxGeometry args={[wallT, BH_Tray, BD]} />
          <primitive object={mOuter} />
        </mesh>
        <mesh position={[BW / 2 - wallT / 2, 0, 0]} castShadow>
          <boxGeometry args={[wallT, BH_Tray, BD]} />
          <primitive object={mOuter} />
        </mesh>
      </group>

      {/* ── LID TRAY ──────────────────────────────────────────────────────────── */}
      {/* Lid is slightly larger and hovered/rotated to show it's a 2-piece box */}
      <group position={[0, BH_Tray / 2 + BH_Lid / 2 + 0.1, -0.1]} rotation={[-0.15, 0.1, 0]}>
        {/* Top Roof */}
        <mesh position={[0, BH_Lid / 2 - wallT / 2, 0]} castShadow>
          <boxGeometry args={[BW + 0.08, wallT, BD + 0.08]} />
          <primitive object={mTopLid} />
        </mesh>
        {/* Front wall */}
        <mesh position={[0, 0, (BD + 0.08) / 2 - wallT / 2]} castShadow>
          <boxGeometry args={[BW + 0.08, BH_Lid, wallT]} />
          {/* Wrap pattern onto sides if background texture exists, else solid */}
          <primitive object={bgTextureUrl ? mTopLid : mOuter} />
        </mesh>
        {/* Back wall */}
        <mesh position={[0, 0, -(BD + 0.08) / 2 + wallT / 2]} castShadow>
          <boxGeometry args={[BW + 0.08, BH_Lid, wallT]} />
          <primitive object={bgTextureUrl ? mTopLid : mOuter} />
        </mesh>
        {/* Left wall */}
        <mesh position={[-(BW + 0.08) / 2 + wallT / 2, 0, 0]} castShadow>
          <boxGeometry args={[wallT, BH_Lid, BD + 0.08]} />
          <primitive object={bgTextureUrl ? mTopLid : mOuter} />
        </mesh>
        {/* Right wall */}
        <mesh position={[(BW + 0.08) / 2 - wallT / 2, 0, 0]} castShadow>
          <boxGeometry args={[wallT, BH_Lid, BD + 0.08]} />
          <primitive object={bgTextureUrl ? mTopLid : mOuter} />
        </mesh>
      </group>
    </group>
  );
};
