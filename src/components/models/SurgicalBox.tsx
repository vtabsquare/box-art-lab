/**
 * SurgicalBox - Accurate 3D model for Surgical Kit Box
 *
 * Architecture:
 *   - Base rigid tray (white)
 *   - Thermoformed plastic inner tray (medical blue)
 *   - Metallic surgical tools (scalpel, forceps placeholders)
 *   - Lid rigid tray (placed slightly hovering/angled)
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

export const SurgicalBox = ({ color, autoRotate, textureUrl, bgTextureUrl, activeFaces }: Props) => {
  const groupRef = useRef<THREE.Group>(null!);
  const logoTex = useTexture(textureUrl || EMPTY_TEX);
  const bgTex = useTexture(bgTextureUrl || EMPTY_TEX);
  logoTex.colorSpace = THREE.SRGBColorSpace;
  bgTex.colorSpace = THREE.SRGBColorSpace;

  useFrame((_, dt) => {
    if (groupRef.current && autoRotate) groupRef.current.rotation.y += dt * 0.2;
  });

  const extC = color || '#fdfdfd'; // Clean medical white
  const trayC = '#1b75bc'; // Medical grade blue for the thermoformed tray
  const wallT = 0.04;

  const mOuter = new THREE.MeshPhysicalMaterial({ color: extC, roughness: 0.5, clearcoat: 0.1 });
  // Thermoformed plastic tray material
  const mTray = new THREE.MeshPhysicalMaterial({ color: trayC, roughness: 0.3, clearcoat: 0.5, metalness: 0.1 });
  // Stainless steel surgical tools
  const mSteel = new THREE.MeshPhysicalMaterial({ color: '#e0e0e0', roughness: 0.1, metalness: 0.9, clearcoat: 0.2 });

  const showLogo = !activeFaces || activeFaces['top'] !== false;
  const lidTex = showLogo && textureUrl ? logoTex : (bgTextureUrl ? bgTex : null);
  const mLidFace = new THREE.MeshPhysicalMaterial({ color: lidTex ? '#fff' : extC, map: lidTex, roughness: 0.5 });

  const BW = 2.5;
  const BD = 1.5;
  const BH = 0.4;

  return (
    <group ref={groupRef} position={[0, BH / 2, 0]} scale={[0.8, 0.8, 0.8]}>
      {/* ── BASE TRAY ─────────────────────────────────────────────────────────── */}
      <mesh position={[0, -BH / 2 + wallT / 2, 0]} castShadow>
        <boxGeometry args={[BW, wallT, BD]} />
        <primitive object={mOuter} />
      </mesh>
      <mesh position={[0, 0, BD / 2 - wallT / 2]} castShadow>
        <boxGeometry args={[BW, BH, wallT]} />
        <primitive object={mOuter} />
      </mesh>
      <mesh position={[0, 0, -BD / 2 + wallT / 2]} castShadow>
        <boxGeometry args={[BW, BH, wallT]} />
        <primitive object={mOuter} />
      </mesh>
      <mesh position={[-BW / 2 + wallT / 2, 0, 0]} castShadow>
        <boxGeometry args={[wallT, BH, BD]} />
        <primitive object={mOuter} />
      </mesh>
      <mesh position={[BW / 2 - wallT / 2, 0, 0]} castShadow>
        <boxGeometry args={[wallT, BH, BD]} />
        <primitive object={mOuter} />
      </mesh>

      {/* ── THERMOFORMED BLUE TRAY INSERT ─────────────────────────────────────── */}
      <mesh position={[0, -0.05, 0]}>
        <boxGeometry args={[BW - wallT * 2 - 0.02, BH - 0.1, BD - wallT * 2 - 0.02]} />
        <primitive object={mTray} />
      </mesh>
      {/* Central indentation holding tools */}
      <mesh position={[0, -0.04, 0]}>
        <boxGeometry args={[BW - 0.4, 0.02, BD - 0.4]} />
        <meshPhysicalMaterial color="#115588" roughness={0.4} /> {/* Darker shade for depth */}
      </mesh>

      {/* ── SURGICAL TOOLS (Stainless Steel) ─────────────────────────────────── */}
      {/* Scalpel Handle */}
      <group position={[0, -0.03, 0.2]}>
        <mesh position={[0, 0, 0]} castShadow>
          <boxGeometry args={[1.2, 0.04, 0.1]} />
          <primitive object={mSteel} />
        </mesh>
        <mesh position={[0.65, 0, 0]} castShadow>
          <cylinderGeometry args={[0.04, 0.02, 0.3, 16]} rotation={[0, 0, Math.PI / 2]} />
          <primitive object={mSteel} />
        </mesh>
      </group>
      
      {/* Forceps/Tweezers */}
      <group position={[0, -0.03, -0.2]}>
        <mesh position={[0, 0, 0.05]} rotation={[0, 0.02, 0]} castShadow>
          <boxGeometry args={[1.4, 0.03, 0.06]} />
          <primitive object={mSteel} />
        </mesh>
        <mesh position={[0, 0, -0.05]} rotation={[0, -0.02, 0]} castShadow>
          <boxGeometry args={[1.4, 0.03, 0.06]} />
          <primitive object={mSteel} />
        </mesh>
        {/* Connecting joint */}
        <mesh position={[-0.68, 0, 0]} castShadow>
          <cylinderGeometry args={[0.05, 0.05, 0.03, 16]} rotation={[Math.PI / 2, 0, 0]} />
          <primitive object={mSteel} />
        </mesh>
      </group>

      {/* ── LID TRAY (Hovering / Angled behind) ──────────────────────────────── */}
      <group position={[0, BH + 0.2, -BD / 2]} rotation={[-0.8, 0, 0]}>
        <mesh position={[0, BH / 2, 0]} castShadow>
          <boxGeometry args={[BW + 0.04, wallT, BD + 0.04]} />
          <primitive object={mLidFace} />
        </mesh>
        <mesh position={[0, 0, BD / 2 + 0.02]} castShadow>
          <boxGeometry args={[BW + 0.04, BH, wallT]} />
          <primitive object={mOuter} />
        </mesh>
        <mesh position={[0, 0, -BD / 2 - 0.02]} castShadow>
          <boxGeometry args={[BW + 0.04, BH, wallT]} />
          <primitive object={mOuter} />
        </mesh>
        <mesh position={[-BW / 2 - 0.02, 0, 0]} castShadow>
          <boxGeometry args={[wallT, BH, BD + 0.04]} />
          <primitive object={mOuter} />
        </mesh>
        <mesh position={[BW / 2 + 0.02, 0, 0]} castShadow>
          <boxGeometry args={[wallT, BH, BD + 0.04]} />
          <primitive object={mOuter} />
        </mesh>

        {/* Inner lid logo/instructions */}
        {lidTex && (
          <mesh position={[0, BH / 2 - wallT - 0.01, 0]} rotation={[Math.PI / 2, Math.PI, 0]}>
            <planeGeometry args={[BW - 0.4, BD - 0.4]} />
            <meshPhysicalMaterial color="#fff" map={logoTex} roughness={0.9} transparent />
          </mesh>
        )}
      </group>
    </group>
  );
};
