/**
 * WindowBox - Accurate 3D model for a Window Display Mailer Box
 *
 * Architecture:
 *   - Base Tray: Folded corrugated mailer tray
 *   - Hinged Lid: Opens upwards, with a large transparent window cutout
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

export const WindowBox = ({ color, autoRotate, textureUrl, bgTextureUrl, activeFaces }: Props) => {
  const groupRef = useRef<THREE.Group>(null!);
  const logoTex = useTexture(textureUrl || EMPTY_TEX);
  logoTex.colorSpace = THREE.SRGBColorSpace;

  useFrame((_, dt) => {
    if (groupRef.current && autoRotate) groupRef.current.rotation.y += dt * 0.2;
  });

  const extC = color || '#bc9568'; // Kraft paper brown
  const wallT = 0.04;

  const mOuter = new THREE.MeshPhysicalMaterial({ color: extC, roughness: 0.9, clearcoat: 0 });
  const mInner = new THREE.MeshPhysicalMaterial({ color: '#a07d55', roughness: 1.0 }); // Slightly darker inside
  const mWindow = new THREE.MeshPhysicalMaterial({ color: '#ffffff', transmission: 0.95, opacity: 1, roughness: 0.05, ior: 1.5, thickness: 0.01 });

  const showLogo = !activeFaces || activeFaces['top'] !== false;
  const topTex = showLogo && textureUrl ? logoTex : null;

  const BW = 2.4;
  const BD = 2.0;
  const BH = 0.6;
  const FW = 0.3; // Window frame thickness

  return (
    <group ref={groupRef} position={[0, BH / 2, 0]} scale={[0.8, 0.8, 0.8]}>
      {/* ── BASE TRAY ─────────────────────────────────────────────────────────── */}
      {/* Floor */}
      <mesh position={[0, -BH / 2 + wallT / 2, 0]} castShadow>
        <boxGeometry args={[BW, wallT, BD]} />
        <primitive object={mInner} />
      </mesh>
      {/* Front Wall */}
      <mesh position={[0, 0, BD / 2 - wallT / 2]} castShadow>
        <boxGeometry args={[BW, BH, wallT]} />
        <primitive object={mOuter} />
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

      {/* ── HINGED WINDOW LID (Open backwards at 120 degrees) ────────────────── */}
      <group position={[0, BH / 2, -BD / 2 + wallT / 2]} rotation={[-Math.PI * 0.7, 0, 0]}>
        
        {/* Lid Top Frame (Window cutout) */}
        {/* Top edge */}
        <mesh position={[0, wallT / 2, BD / 2 + BD / 2 - FW / 2]} castShadow>
          <boxGeometry args={[BW, wallT, FW]} />
          <primitive object={mOuter} />
        </mesh>
        {/* Bottom edge (hinge side) */}
        <mesh position={[0, wallT / 2, FW / 2]} castShadow>
          <boxGeometry args={[BW, wallT, FW]} />
          <primitive object={mOuter} />
        </mesh>
        {/* Left edge */}
        <mesh position={[-BW / 2 + FW / 2, wallT / 2, BD / 2]} castShadow>
          <boxGeometry args={[FW, wallT, BD - FW * 2]} />
          <primitive object={mOuter} />
        </mesh>
        {/* Right edge */}
        <mesh position={[BW / 2 - FW / 2, wallT / 2, BD / 2]} castShadow>
          <boxGeometry args={[FW, wallT, BD - FW * 2]} />
          <primitive object={mOuter} />
        </mesh>

        {/* Transparent Window Pane */}
        <mesh position={[0, wallT / 2 - 0.005, BD / 2]}>
          <boxGeometry args={[BW - FW * 2, 0.005, BD - FW * 2]} />
          <primitive object={mWindow} />
        </mesh>

        {/* Logo / Print on the window frame (front lip of the lid) */}
        {topTex && (
          <mesh position={[0, wallT + 0.005, BD - FW / 2]} rotation={[-Math.PI / 2, 0, Math.PI]}>
            <planeGeometry args={[BW * 0.8, FW * 0.8]} />
            <meshPhysicalMaterial color="#fff" map={topTex} roughness={0.9} transparent />
          </mesh>
        )}

        {/* Mailer Tuck Flaps (Side flaps on the lid) */}
        <mesh position={[-BW / 2 + wallT / 2, BH / 2, BD / 2]} castShadow>
          <boxGeometry args={[wallT, BH, BD - 0.1]} />
          <primitive object={mOuter} />
        </mesh>
        <mesh position={[BW / 2 - wallT / 2, BH / 2, BD / 2]} castShadow>
          <boxGeometry args={[wallT, BH, BD - 0.1]} />
          <primitive object={mOuter} />
        </mesh>
        {/* Front tuck flap */}
        <mesh position={[0, BH / 2, BD - wallT / 2]} castShadow>
          <boxGeometry args={[BW - 0.1, BH, wallT]} />
          <primitive object={mOuter} />
        </mesh>

      </group>
    </group>
  );
};
