/**
 * JewelleryBox - Accurate wooden box with velvet compartments
 *
 * Architecture:
 *   - Base: rectangular tray (W=1.5, H=0.35, D=1.2), wooden exterior, velvet interior walls
 *   - Velvet dividers forming compartments
 *   - Lid: hinged at the BACK TOP EDGE of the base, opens ~105° backward
 *   - Hardware: simple hinges and front latch
 *
 * Coordinate system (all in base-local space):
 *   Y+ = up  X+ = right  Z+ = front
 *   Origin is at the TOP-CENTER of the base.
 *
 * Hinge pivot: world [0, 0, -0.6]  (back top edge of base)
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

export const JewelleryBox = ({ color, autoRotate, textureUrl, bgTextureUrl, activeFaces }: Props) => {
  const groupRef = useRef<THREE.Group>(null!);
  const logoTex = useTexture(textureUrl || EMPTY_TEX);
  const bgTex = useTexture(bgTextureUrl || EMPTY_TEX);
  logoTex.colorSpace = THREE.SRGBColorSpace;
  bgTex.colorSpace = THREE.SRGBColorSpace;

  useFrame((_, dt) => {
    if (groupRef.current && autoRotate) groupRef.current.rotation.y += dt * 0.25;
  });

  const extC = color || '#3e1a0b';  // dark wood
  const intC = '#003d33';           // dark velvet green
  const wallT = 0.05;               // wall thickness

  // ── Materials ──────────────────────────────────────────────────────────────
  const mOuter = new THREE.MeshPhysicalMaterial({ color: extC, roughness: 0.4, clearcoat: 0.3 });
  const mInner = new THREE.MeshPhysicalMaterial({ color: intC, roughness: 1.0 });
  const mHardware = new THREE.MeshPhysicalMaterial({ color: '#c4a45c', roughness: 0.2, metalness: 0.9 });

  const showLogo = !activeFaces || activeFaces['top'] !== false;
  const lidTex = showLogo && textureUrl ? logoTex : (bgTextureUrl ? bgTex : null);
  const mLidFace = new THREE.MeshPhysicalMaterial({ color: lidTex ? '#fff' : extC, map: lidTex, roughness: 0.4, clearcoat: 0.3 });

  // ── Dimensions ─────────────────────────────────────────────────────────────
  const BW = 1.5;   // box width
  const BD = 1.2;   // box depth
  const BH = 0.35;  // box height (base)
  const LH = 0.25;  // lid height

  const hZ = -BD / 2;

  return (
    <group ref={groupRef} position={[0, BH / 2, 0]}>
      {/* ── BASE ─────────────────────────────────────────────────────────── */}
      <mesh position={[0, -BH, 0]} castShadow>
        <boxGeometry args={[BW, wallT, BD]} />
        <primitive object={mOuter} />
      </mesh>
      <mesh position={[0, -BH / 2, BD / 2 - wallT / 2]} castShadow>
        <boxGeometry args={[BW, BH, wallT]} />
        <primitive object={mOuter} />
      </mesh>
      <mesh position={[0, -BH / 2, -BD / 2 + wallT / 2]} castShadow>
        <boxGeometry args={[BW, BH, wallT]} />
        <primitive object={mOuter} />
      </mesh>
      <mesh position={[-BW / 2 + wallT / 2, -BH / 2, 0]} castShadow>
        <boxGeometry args={[wallT, BH, BD]} />
        <primitive object={mOuter} />
      </mesh>
      <mesh position={[BW / 2 - wallT / 2, -BH / 2, 0]} castShadow>
        <boxGeometry args={[wallT, BH, BD]} />
        <primitive object={mOuter} />
      </mesh>

      {/* ── INNER LINING (base) ──────────────────────────────────────────── */}
      <mesh position={[0, -BH + wallT + 0.005, 0]}>
        <boxGeometry args={[BW - wallT * 2, 0.01, BD - wallT * 2]} />
        <primitive object={mInner} />
      </mesh>
      <mesh position={[0, -BH / 2 + wallT / 2, BD / 2 - wallT - 0.01]}>
        <boxGeometry args={[BW - wallT * 2, BH - wallT, 0.01]} />
        <primitive object={mInner} />
      </mesh>
      <mesh position={[0, -BH / 2 + wallT / 2, -BD / 2 + wallT + 0.01]}>
        <boxGeometry args={[BW - wallT * 2, BH - wallT, 0.01]} />
        <primitive object={mInner} />
      </mesh>
      <mesh position={[-BW / 2 + wallT + 0.01, -BH / 2 + wallT / 2, 0]}>
        <boxGeometry args={[0.01, BH - wallT, BD - wallT * 2]} />
        <primitive object={mInner} />
      </mesh>
      <mesh position={[BW / 2 - wallT - 0.01, -BH / 2 + wallT / 2, 0]}>
        <boxGeometry args={[0.01, BH - wallT, BD - wallT * 2]} />
        <primitive object={mInner} />
      </mesh>

      {/* ── DIVIDERS ─────────────────────────────────────────────────────── */}
      <mesh position={[0, -BH / 2, 0]}>
        <boxGeometry args={[BW - wallT * 2, BH - wallT - 0.02, 0.04]} />
        <primitive object={mInner} />
      </mesh>
      <mesh position={[0.3, -BH / 2, 0.25]}>
        <boxGeometry args={[0.04, BH - wallT - 0.02, BD / 2 - wallT - 0.02]} />
        <primitive object={mInner} />
      </mesh>
      <mesh position={[-0.3, -BH / 2, -0.25]}>
        <boxGeometry args={[0.04, BH - wallT - 0.02, BD / 2 - wallT - 0.02]} />
        <primitive object={mInner} />
      </mesh>

      {/* ── LID (hinged at back-top of base) ─────────────────────────────── */}
      <group position={[0, 0, hZ]} rotation={[-Math.PI * 0.60, 0, 0]}>
        {/* Lid Top */}
        <mesh position={[0, LH, BD / 2]} castShadow>
          <boxGeometry args={[BW, wallT, BD]} />
          <primitive object={mLidFace} />
        </mesh>
        <mesh position={[0, LH / 2, BD - wallT / 2]} castShadow>
          <boxGeometry args={[BW, LH, wallT]} />
          <primitive object={mOuter} />
        </mesh>
        <mesh position={[0, LH / 2, wallT / 2]} castShadow>
          <boxGeometry args={[BW, LH, wallT]} />
          <primitive object={mOuter} />
        </mesh>
        <mesh position={[-BW / 2 + wallT / 2, LH / 2, BD / 2]} castShadow>
          <boxGeometry args={[wallT, LH, BD]} />
          <primitive object={mOuter} />
        </mesh>
        <mesh position={[BW / 2 - wallT / 2, LH / 2, BD / 2]} castShadow>
          <boxGeometry args={[wallT, LH, BD]} />
          <primitive object={mOuter} />
        </mesh>

        {/* Lid Inner Lining */}
        <mesh position={[0, LH - wallT - 0.005, BD / 2]}>
          <boxGeometry args={[BW - wallT * 2, 0.01, BD - wallT * 2]} />
          <primitive object={mInner} />
        </mesh>
        <mesh position={[0, LH / 2, BD - wallT - 0.01]}>
          <boxGeometry args={[BW - wallT * 2, LH - wallT, 0.01]} />
          <primitive object={mInner} />
        </mesh>
        <mesh position={[0, LH / 2, wallT + 0.01]}>
          <boxGeometry args={[BW - wallT * 2, LH - wallT, 0.01]} />
          <primitive object={mInner} />
        </mesh>
        <mesh position={[-BW / 2 + wallT + 0.01, LH / 2, BD / 2]}>
          <boxGeometry args={[0.01, LH - wallT, BD - wallT * 2]} />
          <primitive object={mInner} />
        </mesh>
        <mesh position={[BW / 2 - wallT - 0.01, LH / 2, BD / 2]}>
          <boxGeometry args={[0.01, LH - wallT, BD - wallT * 2]} />
          <primitive object={mInner} />
        </mesh>

        {lidTex && (
          <mesh position={[0, LH - wallT - 0.012, BD / 2]} rotation={[Math.PI / 2, Math.PI, 0]}>
            <planeGeometry args={[1.0, 0.7]} />
            <meshPhysicalMaterial color="#fff" map={logoTex} roughness={0.9} transparent />
          </mesh>
        )}
      </group>

      {/* ── HARDWARE ─────────────────────────────────────────────────────── */}
      <mesh position={[0.4, -0.05, -BD / 2 - 0.01]}>
        <boxGeometry args={[0.06, 0.1, 0.02]} />
        <primitive object={mHardware} />
      </mesh>
      <mesh position={[-0.4, -0.05, -BD / 2 - 0.01]}>
        <boxGeometry args={[0.06, 0.1, 0.02]} />
        <primitive object={mHardware} />
      </mesh>
    </group>
  );
};
