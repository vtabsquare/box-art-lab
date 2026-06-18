/**
 * LuxuryPenBox - Accurate book-style rigid box for pens
 *
 * Architecture:
 *   - Base Tray: 4 walls + floor
 *   - Insert: Raised platform with a subtle groove and an elastic strap
 *   - Outer Wrap:
 *       - Bottom cover under the tray
 *       - Back cover (hinged to bottom cover)
 *       - Top lid (hinged to back cover)
 *       - Front magnetic flap (hinged to top lid)
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

export const LuxuryPenBox = ({ color, autoRotate, textureUrl, bgTextureUrl, activeFaces }: Props) => {
  const groupRef = useRef<THREE.Group>(null!);
  const logoTex = useTexture(textureUrl || EMPTY_TEX);
  const bgTex = useTexture(bgTextureUrl || EMPTY_TEX);
  logoTex.colorSpace = THREE.SRGBColorSpace;
  bgTex.colorSpace = THREE.SRGBColorSpace;

  useFrame((_, dt) => {
    if (groupRef.current && autoRotate) groupRef.current.rotation.y += dt * 0.25;
  });

  const extC = color || '#1c1c1c'; // Dark black/charcoal
  const intC = '#2a2a2a'; // Insert color

  const mOuter = new THREE.MeshPhysicalMaterial({ color: extC, roughness: 0.8, clearcoat: 0.1 });
  const mInner = new THREE.MeshPhysicalMaterial({ color: intC, roughness: 0.9 });
  const mElastic = new THREE.MeshPhysicalMaterial({ color: '#111', roughness: 1.0 });

  const showLogo = !activeFaces || activeFaces['top'] !== false;
  const lidTex = showLogo && textureUrl ? logoTex : (bgTextureUrl ? bgTex : null);
  const mLidFace = new THREE.MeshPhysicalMaterial({ color: lidTex ? '#fff' : extC, map: lidTex, roughness: 0.8 });

  const BW = 2.0;
  const BD = 0.6;
  const BH = 0.3;
  const wallT = 0.04;
  const wrapT = 0.02; // Thickness of the outer wrapping card

  return (
    <group ref={groupRef} position={[0, BH / 2, 0]} scale={[0.8, 0.8, 0.8]}>
      {/* ── BASE TRAY ─────────────────────────────────────────────────────────── */}
      {/* Tray Floor */}
      <mesh scale={0.999} position={[0, -BH, 0]} castShadow>
        <boxGeometry args={[BW, wallT, BD]} />
        <primitive object={mOuter} />
      </mesh>
      {/* Tray Walls */}
      <mesh scale={0.999} position={[0, -BH / 2, BD / 2 - wallT / 2]} castShadow>
        <boxGeometry args={[BW, BH, wallT]} />
        <primitive object={mOuter} />
      </mesh>
      <mesh scale={0.999} position={[0, -BH / 2, -BD / 2 + wallT / 2]} castShadow>
        <boxGeometry args={[BW, BH, wallT]} />
        <primitive object={mOuter} />
      </mesh>
      <mesh scale={0.999} position={[-BW / 2 + wallT / 2, -BH / 2, 0]} castShadow>
        <boxGeometry args={[wallT, BH, BD]} />
        <primitive object={mOuter} />
      </mesh>
      <mesh scale={0.999} position={[BW / 2 - wallT / 2, -BH / 2, 0]} castShadow>
        <boxGeometry args={[wallT, BH, BD]} />
        <primitive object={mOuter} />
      </mesh>

      {/* ── INNER PEN INSERT ─────────────────────────────────────────────────── */}
      {/* Insert base filling the tray */}
      <mesh scale={0.999} position={[0, -BH / 2, 0]}>
        <boxGeometry args={[BW - wallT * 2, BH - 0.05, BD - wallT * 2]} />
        <primitive object={mInner} />
      </mesh>
      {/* Pen groove (visualized as a slightly recessed dark bar) */}
      <mesh scale={0.999} position={[0, -0.026, 0]}>
        <boxGeometry args={[BW - 0.4, 0.01, 0.15]} />
        <meshBasicMaterial color="#1a1a1a" />
      </mesh>
      {/* Elastic band to hold pen */}
      <mesh scale={0.999} position={[0, -0.015, 0]}>
        <boxGeometry args={[0.08, 0.02, 0.16]} />
        <primitive object={mElastic} />
      </mesh>

      {/* ── OUTER WRAP (Book style) ──────────────────────────────────────────── */}
      {/* Bottom Wrap under tray */}
      <mesh scale={0.999} position={[0, -BH - wallT / 2 - wrapT / 2, 0]} castShadow>
        <boxGeometry args={[BW + wrapT * 2, wrapT, BD + wrapT * 2]} />
        <primitive object={mOuter} />
      </mesh>

      {/* The rest of the wrap opens like a book lid */}
      {/* Hinge 1: Bottom-Back edge -> rotates slightly back to show it's open */}
      <group position={[0, -BH - wallT / 2, -BD / 2 - wrapT]} rotation={[-Math.PI * 0.1, 0, 0]}>
        {/* Back Wrap Wall */}
        <mesh scale={0.999} position={[0, BH / 2, -wrapT / 2]} castShadow>
          <boxGeometry args={[BW + wrapT * 2, BH + wallT, wrapT]} />
          <primitive object={mOuter} />
        </mesh>

        {/* Hinge 2: Top-Back edge -> Top Lid */}
        <group position={[0, BH + wallT, 0]} rotation={[-Math.PI * 0.5, 0, 0]}>
          {/* Top Lid */}
          <mesh scale={0.999} position={[0, wrapT / 2, BD / 2]} castShadow>
            <boxGeometry args={[BW + wrapT * 2, wrapT, BD + wrapT * 2]} />
            <primitive object={mLidFace} />
          </mesh>

          {/* Inner lid logo */}
          {lidTex && (
            <mesh scale={0.999} position={[0, -0.001, BD / 2]} rotation={[Math.PI / 2, Math.PI, 0]}>
              <planeGeometry args={[1.5, 0.4]} />
              <meshPhysicalMaterial color="#fff" map={logoTex} roughness={0.9} transparent />
            </mesh>
          )}

          {/* Hinge 3: Top-Front edge -> Magnetic Flap */}
          <group position={[0, 0, BD + wrapT]} rotation={[-Math.PI * 0.25, 0, 0]}>
            <mesh scale={0.999} position={[0, -BH / 2, wrapT / 2]} castShadow>
              <boxGeometry args={[BW + wrapT * 2, BH, wrapT]} />
              <primitive object={mOuter} />
            </mesh>
          </group>
        </group>
      </group>
    </group>
  );
};
