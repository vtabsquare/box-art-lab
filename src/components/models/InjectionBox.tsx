/**
 * InjectionBox - Accurate 3D model for Injection Vial Box
 *
 * Architecture:
 *   - Base Carton (Tuck-end style, top open)
 *   - Main Top Flap (folded up)
 *   - Two Dust Flaps (folded in)
 *   - Inner Cardboard Insert holding 3 glass vials
 *   - 3 Glass Vials with metallic caps and liquid level
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

export const InjectionBox = ({ color, autoRotate, textureUrl, bgTextureUrl, activeFaces }: Props) => {
  const groupRef = useRef<THREE.Group>(null!);
  const logoTex = useTexture(textureUrl || EMPTY_TEX);
  const bgTex = useTexture(bgTextureUrl || EMPTY_TEX);
  logoTex.colorSpace = THREE.SRGBColorSpace;
  bgTex.colorSpace = THREE.SRGBColorSpace;

  useFrame((_, dt) => {
    if (groupRef.current && autoRotate) groupRef.current.rotation.y += dt * 0.3;
  });

  const extC = color || '#ffffff'; // Classic pharma white
  const wallT = 0.02;

  const mOuter = new THREE.MeshPhysicalMaterial({ color: extC, roughness: 0.6, clearcoat: 0.1 });
  const mInner = new THREE.MeshPhysicalMaterial({ color: '#f0f0f0', roughness: 0.9 });
  
  // Vial Materials
  const mGlass = new THREE.MeshPhysicalMaterial({ color: '#ffffff', transmission: 0.95, opacity: 1, roughness: 0.1, ior: 1.5, thickness: 0.05 });
  const mLiquid = new THREE.MeshPhysicalMaterial({ color: '#a2d5f2', transmission: 0.6, roughness: 0.2 });
  const mCap = new THREE.MeshPhysicalMaterial({ color: '#a0a0a0', roughness: 0.3, metalness: 0.8 });
  const mRubber = new THREE.MeshPhysicalMaterial({ color: '#666666', roughness: 0.9 });

  const showLogo = !activeFaces || activeFaces['front'] !== false;
  const frontTex = showLogo && textureUrl ? logoTex : (bgTextureUrl ? bgTex : null);
  const mFrontFace = new THREE.MeshPhysicalMaterial({ color: frontTex ? '#fff' : extC, map: frontTex, roughness: 0.6 });

  // Dimensions
  const BW = 1.2;
  const BD = 0.5;
  const BH = 1.0;

  return (
    <group ref={groupRef} position={[0, 0, 0]} scale={[1.2, 1.2, 1.2]}>
      {/* ── CARTON BASE ──────────────────────────────────────────────────────── */}
      {/* Floor */}
      <mesh position={[0, -BH / 2 + wallT / 2, 0]} castShadow>
        <boxGeometry args={[BW, wallT, BD]} />
        <primitive object={mOuter} />
      </mesh>
      {/* Front Wall */}
      <mesh position={[0, 0, BD / 2 - wallT / 2]} castShadow>
        <boxGeometry args={[BW, BH, wallT]} />
        <primitive object={mFrontFace} />
      </mesh>
      {/* Back Wall */}
      <mesh position={[0, 0, -BD / 2 + wallT / 2]} castShadow>
        <boxGeometry args={[BW, BH, wallT]} />
        <primitive object={mOuter} />
      </mesh>
      {/* Left Wall */}
      <mesh position={[-BW / 2 + wallT / 2, 0, 0]} castShadow>
        <boxGeometry args={[wallT, BH, BD]} />
        <primitive object={mOuter} />
      </mesh>
      {/* Right Wall */}
      <mesh position={[BW / 2 - wallT / 2, 0, 0]} castShadow>
        <boxGeometry args={[wallT, BH, BD]} />
        <primitive object={mOuter} />
      </mesh>

      {/* ── TOP FLAPS (Open) ─────────────────────────────────────────────────── */}
      {/* Back main tuck flap (standing up) */}
      <group position={[0, BH / 2, -BD / 2 + wallT / 2]} rotation={[-Math.PI * 0.1, 0, 0]}>
        <mesh position={[0, BD / 2, 0]} castShadow>
          <boxGeometry args={[BW, BD, wallT]} />
          <primitive object={mOuter} />
        </mesh>
        {/* Tuck tab at the end of the main flap */}
        <mesh position={[0, BD + 0.1, 0]} rotation={[-0.2, 0, 0]} castShadow>
          <boxGeometry args={[BW - 0.05, 0.2, wallT]} />
          <primitive object={mOuter} />
        </mesh>
      </group>

      {/* Left Dust Flap (folded slightly in) */}
      <group position={[-BW / 2 + wallT / 2, BH / 2, 0]} rotation={[0, 0, -Math.PI * 0.4]}>
        <mesh position={[BD / 4, 0, 0]} castShadow>
          <boxGeometry args={[BD / 2, wallT, BD - 0.05]} />
          <primitive object={mOuter} />
        </mesh>
      </group>
      
      {/* Right Dust Flap (folded slightly in) */}
      <group position={[BW / 2 - wallT / 2, BH / 2, 0]} rotation={[0, 0, Math.PI * 0.4]}>
        <mesh position={[-BD / 4, 0, 0]} castShadow>
          <boxGeometry args={[BD / 2, wallT, BD - 0.05]} />
          <primitive object={mOuter} />
        </mesh>
      </group>

      {/* ── INNER INSERT & VIALS ─────────────────────────────────────────────── */}
      {/* Cardboard shelf holding vials */}
      <mesh position={[0, -0.1, 0]}>
        <boxGeometry args={[BW - wallT * 2 - 0.02, wallT, BD - wallT * 2 - 0.02]} />
        <primitive object={mInner} />
      </mesh>

      {/* Vials: 3 cylinders positioned along the width */}
      {[-0.35, 0, 0.35].map((x, i) => (
        <group key={i} position={[x, -BH / 2 + 0.38, 0]}>
          {/* Glass Body */}
          <mesh castShadow>
            <cylinderGeometry args={[0.15, 0.15, 0.7, 32]} />
            <primitive object={mGlass} />
          </mesh>
          {/* Liquid inside */}
          <mesh position={[0, -0.1, 0]}>
            <cylinderGeometry args={[0.13, 0.13, 0.4, 32]} />
            <primitive object={mLiquid} />
          </mesh>
          {/* Aluminum Cap */}
          <mesh position={[0, 0.37, 0]} castShadow>
            <cylinderGeometry args={[0.11, 0.11, 0.08, 32]} />
            <primitive object={mCap} />
          </mesh>
          {/* Rubber Stopper (visible at top hole) */}
          <mesh position={[0, 0.41, 0]}>
            <cylinderGeometry args={[0.05, 0.05, 0.01, 16]} />
            <primitive object={mRubber} />
          </mesh>
        </group>
      ))}
    </group>
  );
};
