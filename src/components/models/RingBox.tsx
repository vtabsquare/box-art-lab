/**
 * RingBox - Accurate cylindrical ring box
 *
 * Architecture:
 *   - Base: Hollow cylinder (Radius=0.5, H=0.4), top open
 *   - Interior: Velvet pad with a slit in the center
 *   - Lid: Hollow cylinder (Radius=0.5, H=0.3), bottom open
 *   - Hinge: back edge [0, 0, -Radius]
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

export const RingBox = ({ color, autoRotate, textureUrl, bgTextureUrl, activeFaces }: Props) => {
  const groupRef = useRef<THREE.Group>(null!);
  const logoTex = useTexture(textureUrl || EMPTY_TEX);
  const bgTex = useTexture(bgTextureUrl || EMPTY_TEX);
  logoTex.colorSpace = THREE.SRGBColorSpace;
  bgTex.colorSpace = THREE.SRGBColorSpace;

  useFrame((_, dt) => {
    if (groupRef.current && autoRotate) groupRef.current.rotation.y += dt * 0.3;
  });

  const extC = color || '#004225'; // deep green
  const intC = '#f0f0f0';          // cream lining
  const velvetC = '#004225';       // velvet pad

  const mOuter = new THREE.MeshPhysicalMaterial({ color: extC, roughness: 0.8, clearcoat: 0.1 });
  const mInner = new THREE.MeshPhysicalMaterial({ color: intC, roughness: 1.0 });
  const mVelvet = new THREE.MeshPhysicalMaterial({ color: velvetC, roughness: 1.0 });
  const mTrim = new THREE.MeshPhysicalMaterial({ color: '#d4af37', roughness: 0.1, metalness: 0.95 });

  const showLogo = !activeFaces || activeFaces['top'] !== false;
  const lidTex = showLogo && textureUrl ? logoTex : (bgTextureUrl ? bgTex : null);
  const mLidFace = new THREE.MeshPhysicalMaterial({ color: lidTex ? '#fff' : extC, map: lidTex, roughness: 0.8 });

  const R = 0.5;    // Outer radius
  const r = 0.46;   // Inner radius
  const BH = 0.4;   // Base height
  const LH = 0.3;   // Lid height
  const hZ = -R;    // Hinge Z

  return (
    <group ref={groupRef} position={[0, BH / 2, 0]} scale={[1.2, 1.2, 1.2]}>
      {/* ── BASE ─────────────────────────────────────────────────────────── */}
      {/* Base walls */}
      <mesh scale={0.999} position={[0, -BH / 2, 0]} castShadow>
        <cylinderGeometry args={[R, R, BH, 64, 1, true]} />
        <primitive object={mOuter} side={THREE.DoubleSide} />
      </mesh>
      {/* Base floor */}
      <mesh scale={0.999} position={[0, -BH, 0]} castShadow>
        <cylinderGeometry args={[R, R, 0.02, 64]} />
        <primitive object={mOuter} />
      </mesh>

      {/* ── INNER LINING (base) ──────────────────────────────────────────── */}
      {/* Inner walls */}
      <mesh scale={0.999} position={[0, -BH / 2, 0]}>
        <cylinderGeometry args={[r, r, BH, 64, 1, true]} />
        <primitive object={mInner} side={THREE.DoubleSide} />
      </mesh>
      {/* Inner floor */}
      <mesh scale={0.999} position={[0, -BH + 0.02, 0]}>
        <cylinderGeometry args={[r, r, 0.01, 64]} />
        <primitive object={mInner} />
      </mesh>

      {/* ── VELVET RING PAD ──────────────────────────────────────────────── */}
      {/* The pad fills the upper part of the base, slightly protruding */}
      <mesh scale={0.999} position={[0, -0.05, 0]}>
        <cylinderGeometry args={[r - 0.01, r - 0.01, 0.2, 64]} />
        <primitive object={mVelvet} />
      </mesh>
      {/* Slit line */}
      <mesh scale={0.999} position={[0, 0.051, 0]}>
        <boxGeometry args={[r * 1.5, 0.01, 0.02]} />
        <meshBasicMaterial color="#000000" opacity={0.6} transparent />
      </mesh>

      {/* ── THE RING ─────────────────────────────────────────────────────── */}
      <group position={[0, 0.1, 0]}>
        <mesh scale={0.999} rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[0.1, 0.015, 32, 64]} />
          <primitive object={mTrim} />
        </mesh>
        <mesh scale={0.999} position={[0, 0.1, 0]}>
          <octahedronGeometry args={[0.03]} />
          <meshPhysicalMaterial color="#ffffff" transmission={0.95} opacity={1} roughness={0} ior={2.4} thickness={0.1} />
        </mesh>
      </group>

      {/* ── HARDWARE (Trim) ──────────────────────────────────────────────── */}
      {/* Gold rim on base */}
      <mesh scale={0.999} position={[0, 0, 0]}>
        <cylinderGeometry args={[R + 0.005, R + 0.005, 0.03, 64]} />
        <primitive object={mTrim} />
      </mesh>

      {/* ── LID (hinged at back) ─────────────────────────────────────────── */}
      <group position={[0, 0, hZ]} rotation={[-Math.PI * 0.60, 0, 0]}>
        {/* Hinge-local center of lid is at [0, LH/2, R] */}

        {/* Lid walls */}
        <mesh scale={0.999} position={[0, LH / 2, R]} castShadow>
          <cylinderGeometry args={[R, R, LH, 64, 1, true]} />
          <primitive object={mOuter} side={THREE.DoubleSide} />
        </mesh>
        {/* Lid top */}
        <mesh scale={0.999} position={[0, LH, R]} castShadow>
          <cylinderGeometry args={[R, R, 0.02, 64]} />
          <primitive object={mLidFace} />
        </mesh>

        {/* Lid inner walls */}
        <mesh scale={0.999} position={[0, LH / 2, R]}>
          <cylinderGeometry args={[r, r, LH, 64, 1, true]} />
          <primitive object={mInner} side={THREE.DoubleSide} />
        </mesh>
        {/* Lid inner roof */}
        <mesh scale={0.999} position={[0, LH - 0.02, R]}>
          <cylinderGeometry args={[r, r, 0.01, 64]} />
          <primitive object={mInner} />
        </mesh>

        {/* Logo print */}
        {lidTex && (
          <mesh scale={0.999} position={[0, LH - 0.03, R]} rotation={[Math.PI / 2, Math.PI, 0]}>
            <planeGeometry args={[r * 1.2, r * 1.2]} />
            <meshPhysicalMaterial color="#fff" map={logoTex} roughness={0.9} transparent />
          </mesh>
        )}

        {/* Lid gold rim */}
        <mesh scale={0.999} position={[0, 0, R]}>
          <cylinderGeometry args={[R + 0.005, R + 0.005, 0.03, 64]} />
          <primitive object={mTrim} />
        </mesh>
      </group>
    </group>
  );
};
