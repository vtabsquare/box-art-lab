/**
 * HamperBox - Accurate 3D model for a Gift Hamper Box
 *
 * Architecture:
 *   - Base Tray: Shallow, rigid cardboard tray
 *   - Transparent Cover: Tall acrylic/plastic box sitting inside the tray
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

export const HamperBox = ({ color, autoRotate, textureUrl, bgTextureUrl, activeFaces }: Props) => {
  const groupRef = useRef<THREE.Group>(null!);
  const logoTex = useTexture(textureUrl || EMPTY_TEX);
  logoTex.colorSpace = THREE.SRGBColorSpace;

  useFrame((_, dt) => {
    if (groupRef.current && autoRotate) groupRef.current.rotation.y += dt * 0.2;
  });

  const extC = color || '#f6b884'; // Peach color
  const wallT = 0.04;
  const pWallT = 0.01; // Thin plastic walls

  const mOuter = new THREE.MeshPhysicalMaterial({ color: extC, roughness: 0.8, clearcoat: 0.1 });
  const mInner = new THREE.MeshPhysicalMaterial({ color: '#e59a63', roughness: 0.9 }); 
  const mPlastic = new THREE.MeshPhysicalMaterial({ color: '#ffffff', transmission: 0.98, opacity: 1, roughness: 0.05, ior: 1.5, thickness: 0.01, side: THREE.DoubleSide });

  const showLogo = !activeFaces || activeFaces['front'] !== false;
  const frontTex = showLogo && textureUrl ? logoTex : null;

  const BW = 2.4;
  const BD = 2.4;
  const BH_Tray = 0.4;
  const BH_Cover = 1.6;

  return (
    <group ref={groupRef} position={[0, -BH_Cover / 2, 0]} scale={[0.8, 0.8, 0.8]}>
      {/* ── BASE TRAY ─────────────────────────────────────────────────────────── */}
      <mesh scale={0.999} position={[0, wallT / 2, 0]} castShadow>
        <boxGeometry args={[BW, wallT, BD]} />
        <primitive object={mInner} />
      </mesh>
      <mesh scale={0.999} position={[0, BH_Tray / 2, BD / 2 - wallT / 2]} castShadow>
        <boxGeometry args={[BW, BH_Tray, wallT]} />
        <primitive object={mOuter} />
      </mesh>
      <mesh scale={0.999} position={[0, BH_Tray / 2, -BD / 2 + wallT / 2]} castShadow>
        <boxGeometry args={[BW, BH_Tray, wallT]} />
        <primitive object={mOuter} />
      </mesh>
      <mesh scale={0.999} position={[-BW / 2 + wallT / 2, BH_Tray / 2, 0]} castShadow>
        <boxGeometry args={[wallT, BH_Tray, BD]} />
        <primitive object={mOuter} />
      </mesh>
      <mesh scale={0.999} position={[BW / 2 - wallT / 2, BH_Tray / 2, 0]} castShadow>
        <boxGeometry args={[wallT, BH_Tray, BD]} />
        <primitive object={mOuter} />
      </mesh>

      {/* Front Face Logo Plane on the Base Tray */}
      {frontTex && (
        <mesh scale={0.999} position={[0, BH_Tray / 2, BD / 2 + 0.001]}>
          <planeGeometry args={[BW * 0.6, BH_Tray * 0.6]} />
          <meshPhysicalMaterial color="#fff" map={frontTex} roughness={0.8} transparent />
        </mesh>
      )}

      {/* ── TALL TRANSPARENT COVER ────────────────────────────────────────────── */}
      {/* Cover sits inside the tray walls. Width/Depth = BW - wallT*2 */}
      <group position={[0, wallT, 0]}>
        {/* Top pane */}
        <mesh scale={0.999} position={[0, BH_Cover, 0]}>
          <boxGeometry args={[BW - wallT * 2, pWallT, BD - wallT * 2]} />
          <primitive object={mPlastic} />
        </mesh>
        {/* Front pane */}
        <mesh scale={0.999} position={[0, BH_Cover / 2, BD / 2 - wallT - pWallT / 2]}>
          <boxGeometry args={[BW - wallT * 2, BH_Cover, pWallT]} />
          <primitive object={mPlastic} />
        </mesh>
        {/* Back pane */}
        <mesh scale={0.999} position={[0, BH_Cover / 2, -BD / 2 + wallT + pWallT / 2]}>
          <boxGeometry args={[BW - wallT * 2, BH_Cover, pWallT]} />
          <primitive object={mPlastic} />
        </mesh>
        {/* Left pane */}
        <mesh scale={0.999} position={[-BW / 2 + wallT + pWallT / 2, BH_Cover / 2, 0]}>
          <boxGeometry args={[pWallT, BH_Cover, BD - wallT * 2 - pWallT * 2]} />
          <primitive object={mPlastic} />
        </mesh>
        {/* Right pane */}
        <mesh scale={0.999} position={[BW / 2 - wallT - pWallT / 2, BH_Cover / 2, 0]}>
          <boxGeometry args={[pWallT, BH_Cover, BD - wallT * 2 - pWallT * 2]} />
          <primitive object={mPlastic} />
        </mesh>

        {/* Visual fold lines (corners of the plastic box) */}
        <mesh scale={0.999} position={[-BW / 2 + wallT + pWallT / 2, BH_Cover / 2, BD / 2 - wallT - pWallT / 2]}>
          <cylinderGeometry args={[0.005, 0.005, BH_Cover, 8]} />
          <meshBasicMaterial color="#ffffff" opacity={0.3} transparent />
        </mesh>
        <mesh scale={0.999} position={[BW / 2 - wallT - pWallT / 2, BH_Cover / 2, BD / 2 - wallT - pWallT / 2]}>
          <cylinderGeometry args={[0.005, 0.005, BH_Cover, 8]} />
          <meshBasicMaterial color="#ffffff" opacity={0.3} transparent />
        </mesh>
        <mesh scale={0.999} position={[-BW / 2 + wallT + pWallT / 2, BH_Cover / 2, -BD / 2 + wallT + pWallT / 2]}>
          <cylinderGeometry args={[0.005, 0.005, BH_Cover, 8]} />
          <meshBasicMaterial color="#ffffff" opacity={0.3} transparent />
        </mesh>
        <mesh scale={0.999} position={[BW / 2 - wallT - pWallT / 2, BH_Cover / 2, -BD / 2 + wallT + pWallT / 2]}>
          <cylinderGeometry args={[0.005, 0.005, BH_Cover, 8]} />
          <meshBasicMaterial color="#ffffff" opacity={0.3} transparent />
        </mesh>
      </group>
    </group>
  );
};
