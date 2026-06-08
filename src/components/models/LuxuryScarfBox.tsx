/**
 * LuxuryScarfBox - 2-part rigid box with transparent window and ribbon
 *
 * Architecture:
 *   - Base Tray: 4 walls + floor
 *   - Scarf/Tissue: Plane sitting inside the base
 *   - Lid: 4 walls + Top face made of a window frame + transparent center
 *   - Ribbon: Wraps around the fully closed lid with a bow on top
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

export const LuxuryScarfBox = ({ color, autoRotate, textureUrl, bgTextureUrl, activeFaces }: Props) => {
  const groupRef = useRef<THREE.Group>(null!);
  const logoTex = useTexture(textureUrl || EMPTY_TEX);
  logoTex.colorSpace = THREE.SRGBColorSpace;

  useFrame((_, dt) => {
    if (groupRef.current && autoRotate) groupRef.current.rotation.y += dt * 0.25;
  });

  const extC = color || '#151515'; // Very dark grey/black
  const wallT = 0.03;

  const mOuter = new THREE.MeshPhysicalMaterial({ color: extC, roughness: 0.9, clearcoat: 0.1 });
  const mInner = new THREE.MeshPhysicalMaterial({ color: '#222', roughness: 1.0 });
  const mRibbon = new THREE.MeshPhysicalMaterial({ color: '#0a0a0a', roughness: 0.2, clearcoat: 0.5 }); // Shiny silk black
  const mWindow = new THREE.MeshPhysicalMaterial({ color: '#ffffff', transmission: 0.9, opacity: 1, roughness: 0.05, ior: 1.5, thickness: 0.01 });

  // Base dimensions
  const BW = 1.6;
  const BD = 1.4;
  const BH = 0.3;

  // Lid dimensions (fits precisely over base)
  const LW = BW + 0.02;
  const LD = BD + 0.02;
  const LH = 0.25;

  const FW = 0.2; // Window frame border width

  return (
    <group ref={groupRef} position={[0, BH / 2, 0]} scale={[0.9, 0.9, 0.9]}>
      {/* ── BASE TRAY ─────────────────────────────────────────────────────────── */}
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
      
      {/* Inner Floor Lining */}
      <mesh position={[0, -BH + wallT + 0.005, 0]}>
        <boxGeometry args={[BW - wallT * 2, 0.01, BD - wallT * 2]} />
        <primitive object={mInner} />
      </mesh>

      {/* ── INTERIOR TISSUE / SCARF PLACEHOLDER ──────────────────────────────── */}
      {/* Slightly folded tissue paper look */}
      <mesh position={[0, -BH / 2, 0]}>
        <boxGeometry args={[BW - 0.1, 0.02, BD - 0.1]} />
        <meshPhysicalMaterial color="#dcdcdc" roughness={0.8} clearcoat={0.1} />
      </mesh>
      {/* Logo inside, clearly visible through window */}
      {textureUrl && (
        <mesh position={[0, -BH / 2 + 0.011, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[0.5, 0.5]} />
          <meshPhysicalMaterial color="#fff" map={logoTex} roughness={0.9} transparent />
        </mesh>
      )}

      {/* ── LID (Fully closed over the base) ─────────────────────────────────── */}
      {/* Lid Top edge is at Y=0, walls go down to -LH */}
      <group position={[0, 0, 0]}>
        {/* Lid walls */}
        <mesh position={[0, -LH / 2, LD / 2 - wallT / 2]} castShadow>
          <boxGeometry args={[LW, LH, wallT]} />
          <primitive object={mOuter} />
        </mesh>
        <mesh position={[0, -LH / 2, -LD / 2 + wallT / 2]} castShadow>
          <boxGeometry args={[LW, LH, wallT]} />
          <primitive object={mOuter} />
        </mesh>
        <mesh position={[-LW / 2 + wallT / 2, -LH / 2, 0]} castShadow>
          <boxGeometry args={[wallT, LH, LD]} />
          <primitive object={mOuter} />
        </mesh>
        <mesh position={[LW / 2 - wallT / 2, -LH / 2, 0]} castShadow>
          <boxGeometry args={[wallT, LH, LD]} />
          <primitive object={mOuter} />
        </mesh>

        {/* Lid Top Frame (Window cutout) */}
        <mesh position={[0, -wallT / 2, -LD / 2 + FW / 2]} castShadow>
          <boxGeometry args={[LW, wallT, FW]} />
          <primitive object={mOuter} />
        </mesh>
        <mesh position={[0, -wallT / 2, LD / 2 - FW / 2]} castShadow>
          <boxGeometry args={[LW, wallT, FW]} />
          <primitive object={mOuter} />
        </mesh>
        <mesh position={[-LW / 2 + FW / 2, -wallT / 2, 0]} castShadow>
          <boxGeometry args={[FW, wallT, LD - FW * 2]} />
          <primitive object={mOuter} />
        </mesh>
        <mesh position={[LW / 2 - FW / 2, -wallT / 2, 0]} castShadow>
          <boxGeometry args={[FW, wallT, LD - FW * 2]} />
          <primitive object={mOuter} />
        </mesh>

        {/* Transparent Window Pane */}
        <mesh position={[0, -wallT / 2, 0]}>
          <boxGeometry args={[LW - FW * 2, 0.005, LD - FW * 2]} />
          <primitive object={mWindow} />
        </mesh>

        {/* ── RIBBON ─────────────────────────────────────────────────────────── */}
        <group position={[0, 0, 0]}>
          {/* Horizontal Wrap */}
          <mesh position={[0, 0.005, 0]}>
            <boxGeometry args={[LW + 0.005, 0.005, 0.15]} />
            <primitive object={mRibbon} />
          </mesh>
          <mesh position={[LW / 2 + 0.002, -BH / 2, 0]}>
            <boxGeometry args={[0.005, BH, 0.15]} />
            <primitive object={mRibbon} />
          </mesh>
          <mesh position={[-LW / 2 - 0.002, -BH / 2, 0]}>
            <boxGeometry args={[0.005, BH, 0.15]} />
            <primitive object={mRibbon} />
          </mesh>

          {/* Bow on top-center */}
          <group position={[0, 0.02, 0]}>
            {/* Center knot */}
            <mesh position={[0, 0, 0]}>
              <boxGeometry args={[0.08, 0.04, 0.12]} />
              <primitive object={mRibbon} />
            </mesh>
            {/* Left loop */}
            <mesh position={[-0.15, 0, 0]} rotation={[0, 0.2, 0.2]}>
              <torusGeometry args={[0.1, 0.02, 16, 32]} />
              <primitive object={mRibbon} />
            </mesh>
            {/* Right loop */}
            <mesh position={[0.15, 0, 0]} rotation={[0, -0.2, -0.2]}>
              <torusGeometry args={[0.1, 0.02, 16, 32]} />
              <primitive object={mRibbon} />
            </mesh>
            {/* Tails */}
            <mesh position={[-0.1, -0.01, 0.12]} rotation={[Math.PI / 2 + 0.2, 0, -0.4]}>
              <boxGeometry args={[0.1, 0.01, 0.3]} />
              <primitive object={mRibbon} />
            </mesh>
            <mesh position={[0.1, -0.01, 0.12]} rotation={[Math.PI / 2 + 0.2, 0, 0.4]}>
              <boxGeometry args={[0.1, 0.01, 0.3]} />
              <primitive object={mRibbon} />
            </mesh>
          </group>
        </group>
      </group>
    </group>
  );
};
