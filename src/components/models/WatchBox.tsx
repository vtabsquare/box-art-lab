/**
 * WatchBox - Accurate clamshell rigid watch box
 *
 * Architecture:
 *   - Base: square tray, walls on all 4 sides, floor, open top
 *   - Inner tray lining inside the base
 *   - Round cylindrical watch pillow in the center of the tray
 *   - Lid: hinged at the BACK TOP EDGE of the base, opens ~105° backward
 *   - Lid interior: cream lining + logo print area
 *
 * Coordinate system (all in base-local space):
 *   Y+ = up  X+ = right  Z+ = front
 *
 * Base outer dimensions: W=1.1  H=0.5  D=1.1  (centered at origin)
 *   → top face of base at Y = 0
 *   → bottom face         at Y = -0.5
 *   → back face           at Z = -0.55
 *   → front face          at Z = +0.55
 *
 * Hinge pivot: world [0, 0, -0.55]  (back top edge of base)
 * Lid in hinge-local space:
 *   Lid body: H=0.5, depth=1.1 → positioned at [0, 0.25, 0.55] in hinge space
 *   Open angle: -105° → rotation.x = -Math.PI * 105/180 ≈ -1.833
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

export const WatchBox = ({ color, autoRotate, textureUrl, bgTextureUrl, activeFaces }: Props) => {
  const groupRef = useRef<THREE.Group>(null!);
  const logoTex = useTexture(textureUrl || EMPTY_TEX);
  const bgTex = useTexture(bgTextureUrl || EMPTY_TEX);
  logoTex.colorSpace = THREE.SRGBColorSpace;
  bgTex.colorSpace = THREE.SRGBColorSpace;

  useFrame((_, dt) => {
    if (groupRef.current && autoRotate) groupRef.current.rotation.y += dt * 0.25;
  });

  const extC = color || '#1e2533';
  const intC = '#f0e8d5';   // cream / suede interior
  const wallT = 0.06;        // wall thickness

  // ── Materials ──────────────────────────────────────────────────────────────
  const mOuter = new THREE.MeshPhysicalMaterial({ color: extC, roughness: 0.85, clearcoat: 0.05 });
  const mInner = new THREE.MeshPhysicalMaterial({ color: intC, roughness: 1.0 });
  const mPillow = new THREE.MeshPhysicalMaterial({ color: intC, roughness: 0.75, clearcoat: 0.05 });

  const showLogo = !activeFaces || activeFaces['top'] !== false;
  const lidTex = showLogo && textureUrl ? logoTex : (bgTextureUrl ? bgTex : null);
  const mLidFace = new THREE.MeshPhysicalMaterial({ color: lidTex ? '#fff' : extC, map: lidTex, roughness: 0.85 });

  // ── Dimensions ─────────────────────────────────────────────────────────────
  const BW = 1.1;   // box width
  const BD = 1.1;   // box depth
  const BH = 0.5;   // box height (base)
  const LH = 0.5;   // lid height

  // base top face is at Y=0; hinge at Z=-BD/2 = -0.55
  const hZ = -BD / 2;

  return (
    <group ref={groupRef} position={[0, BH / 2, 0]}>
      {/* ── BASE ─────────────────────────────────────────────────────────── */}
      {/* Floor */}
      <mesh scale={0.999} position={[0, -BH, 0]} castShadow>
        <boxGeometry args={[BW, wallT, BD]} />
        <primitive object={mOuter} />
      </mesh>
      {/* Front wall */}
      <mesh scale={0.999} position={[0, -BH / 2, BD / 2 - wallT / 2]} castShadow>
        <boxGeometry args={[BW, BH, wallT]} />
        <primitive object={mOuter} />
      </mesh>
      {/* Back wall */}
      <mesh scale={0.999} position={[0, -BH / 2, -BD / 2 + wallT / 2]} castShadow>
        <boxGeometry args={[BW, BH, wallT]} />
        <primitive object={mOuter} />
      </mesh>
      {/* Left wall */}
      <mesh scale={0.999} position={[-BW / 2 + wallT / 2, -BH / 2, 0]} castShadow>
        <boxGeometry args={[wallT, BH, BD]} />
        <primitive object={mOuter} />
      </mesh>
      {/* Right wall */}
      <mesh scale={0.999} position={[BW / 2 - wallT / 2, -BH / 2, 0]} castShadow>
        <boxGeometry args={[wallT, BH, BD]} />
        <primitive object={mOuter} />
      </mesh>

      {/* ── INNER LINING (base) ──────────────────────────────────────────── */}
      {/* inner floor */}
      <mesh scale={0.999} position={[0, -BH + wallT + 0.005, 0]}>
        <boxGeometry args={[BW - wallT * 2, 0.01, BD - wallT * 2]} />
        <primitive object={mInner} />
      </mesh>
      {/* inner front */}
      <mesh scale={0.999} position={[0, -BH / 2 + wallT / 2, BD / 2 - wallT - 0.01]}>
        <boxGeometry args={[BW - wallT * 2, BH - wallT, 0.01]} />
        <primitive object={mInner} />
      </mesh>
      {/* inner back */}
      <mesh scale={0.999} position={[0, -BH / 2 + wallT / 2, -BD / 2 + wallT + 0.01]}>
        <boxGeometry args={[BW - wallT * 2, BH - wallT, 0.01]} />
        <primitive object={mInner} />
      </mesh>
      {/* inner left */}
      <mesh scale={0.999} position={[-BW / 2 + wallT + 0.01, -BH / 2 + wallT / 2, 0]}>
        <boxGeometry args={[0.01, BH - wallT, BD - wallT * 2]} />
        <primitive object={mInner} />
      </mesh>
      {/* inner right */}
      <mesh scale={0.999} position={[BW / 2 - wallT - 0.01, -BH / 2 + wallT / 2, 0]}>
        <boxGeometry args={[0.01, BH - wallT, BD - wallT * 2]} />
        <primitive object={mInner} />
      </mesh>

      {/* ── WATCH PILLOW ─────────────────────────────────────────────────── */}
      {/* Soft rectangular pillow sitting in the tray */}
      <mesh scale={0.999} position={[0, -BH + wallT + 0.16, 0]} castShadow>
        <boxGeometry args={[0.62, 0.28, 0.55]} />
        <primitive object={mPillow} />
      </mesh>
      {/* Pillow top rounded crown */}
      <mesh scale={0.999} position={[0, -BH + wallT + 0.31, 0]}>
        <cylinderGeometry args={[0.31, 0.31, 0.06, 32, 1, false]} />
        <primitive object={mPillow} />
      </mesh>
      {/* Pillow strap / wrap band removed due to invalid geometry placeholder */}
      {/* Horizontal strap */}
      <mesh scale={0.999} position={[0, -BH + wallT + 0.18, 0]}>
        <boxGeometry args={[0.64, 0.045, 0.14]} />
        <primitive object={mInner} />
      </mesh>

      {/* ── LID (hinged at back-top of base) ─────────────────────────────── */}
      {/* Pivot point = back-top edge of base = [0, 0, hZ] */}
      <group position={[0, 0, hZ]} rotation={[-Math.PI * 0.60, 0, 0]}>
        {/* Lid body: extends forward (+Z) and upward from hinge pivot */}
        {/* Center of lid is at [0, LH/2, BD/2] in hinge-local space */}

        {/* Lid outer shell — 4 sides + outer face */}
        {/* Top outer face */}
        <mesh scale={0.999} position={[0, LH, BD / 2]} castShadow>
          <boxGeometry args={[BW, wallT, BD]} />
          <primitive object={mLidFace} />
        </mesh>
        {/* Lid front wall */}
        <mesh scale={0.999} position={[0, LH / 2, BD - wallT / 2]} castShadow>
          <boxGeometry args={[BW, LH, wallT]} />
          <primitive object={mOuter} />
        </mesh>
        {/* Lid back wall (at hinge) */}
        <mesh scale={0.999} position={[0, LH / 2, wallT / 2]} castShadow>
          <boxGeometry args={[BW, LH, wallT]} />
          <primitive object={mOuter} />
        </mesh>
        {/* Lid left wall */}
        <mesh scale={0.999} position={[-BW / 2 + wallT / 2, LH / 2, BD / 2]} castShadow>
          <boxGeometry args={[wallT, LH, BD]} />
          <primitive object={mOuter} />
        </mesh>
        {/* Lid right wall */}
        <mesh scale={0.999} position={[BW / 2 - wallT / 2, LH / 2, BD / 2]} castShadow>
          <boxGeometry args={[wallT, LH, BD]} />
          <primitive object={mOuter} />
        </mesh>

        {/* Lid inner lining */}
        <mesh scale={0.999} position={[0, LH - wallT - 0.005, BD / 2]}>
          <boxGeometry args={[BW - wallT * 2, 0.01, BD - wallT * 2]} />
          <primitive object={mInner} />
        </mesh>
        {/* Inner front lining */}
        <mesh scale={0.999} position={[0, LH / 2, BD - wallT - 0.01]}>
          <boxGeometry args={[BW - wallT * 2, LH - wallT, 0.01]} />
          <primitive object={mInner} />
        </mesh>
        {/* Inner back lining */}
        <mesh scale={0.999} position={[0, LH / 2, wallT + 0.01]}>
          <boxGeometry args={[BW - wallT * 2, LH - wallT, 0.01]} />
          <primitive object={mInner} />
        </mesh>
        {/* Inner left lining */}
        <mesh scale={0.999} position={[-BW / 2 + wallT + 0.01, LH / 2, BD / 2]}>
          <boxGeometry args={[0.01, LH - wallT, BD - wallT * 2]} />
          <primitive object={mInner} />
        </mesh>
        {/* Inner right lining */}
        <mesh scale={0.999} position={[BW / 2 - wallT - 0.01, LH / 2, BD / 2]}>
          <boxGeometry args={[0.01, LH - wallT, BD - wallT * 2]} />
          <primitive object={mInner} />
        </mesh>

        {/* Logo/branding on lid inner face */}
        {lidTex && (
          <mesh scale={0.999} position={[0, LH - wallT - 0.012, BD / 2]} rotation={[Math.PI / 2, Math.PI, 0]}>
            <planeGeometry args={[0.85, 0.85]} />
            <meshPhysicalMaterial color="#fff" map={logoTex} roughness={0.9} transparent />
          </mesh>
        )}
      </group>
    </group>
  );
};
