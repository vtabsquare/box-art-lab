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

export const TrophyBox = ({ color, autoRotate, textureUrl, bgTextureUrl, activeFaces }: Props) => {
  const groupRef = useRef<THREE.Group>(null!);
  const logoTex = useTexture(textureUrl || EMPTY_TEX);
  const bgTex = useTexture(bgTextureUrl || EMPTY_TEX);
  logoTex.colorSpace = THREE.SRGBColorSpace;
  bgTex.colorSpace = THREE.SRGBColorSpace;

  useFrame((_, dt) => {
    if (groupRef.current && autoRotate) groupRef.current.rotation.y += dt * 0.2;
  });

  const extC = color || '#8e9091'; // Light grey
  const intC = '#f8f9fa'; // White/cream padding
  const wallT = 0.04;

  const mOuter = new THREE.MeshPhysicalMaterial({ color: extC, roughness: 0.8, clearcoat: 0.1 });
  const mInner = new THREE.MeshPhysicalMaterial({ color: intC, roughness: 1.0 });

  const showLogo = !activeFaces || activeFaces['top'] !== false;
  const lidTex = showLogo && textureUrl ? logoTex : (bgTextureUrl ? bgTex : null);
  const mLidFace = new THREE.MeshPhysicalMaterial({ color: lidTex ? '#fff' : extC, map: lidTex, roughness: 0.8 });

  const BW = 1.6;
  const BD = 1.6;
  const BH = 0.6;

  return (
    <group ref={groupRef} position={[0, BH / 2, 0]} scale={[0.8, 0.8, 0.8]}>
      {/* ── BASE TRAY ─────────────────────────────────────────────────────────── */}
      <mesh position={[0, -BH / 2, 0]} castShadow>
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

      {/* ── INNER PADDING ────────────────────────────────────────────────────── */}
      {/* Soft thick padding filling the lower half of the box */}
      <mesh position={[0, -BH / 2 + 0.15, 0]}>
        <boxGeometry args={[BW - wallT * 2 - 0.02, 0.3, BD - wallT * 2 - 0.02]} />
        <primitive object={mInner} />
      </mesh>
      {/* Indentation for the trophy/award */}
      <mesh position={[0, -BH / 2 + 0.28, 0]}>
        <cylinderGeometry args={[0.3, 0.3, 0.06, 32]} />
        <meshBasicMaterial color="#e0e0e0" />
      </mesh>

      {/* ── LID (Hinged at back top edge) ────────────────────────────────────── */}
      <group position={[0, BH / 2, -BD / 2 + wallT / 2]} rotation={[-Math.PI * 0.65, 0, 0]}>
        {/* Main top cover */}
        <mesh position={[0, wallT / 2, BD / 2]} castShadow>
          <boxGeometry args={[BW, wallT, BD]} />
          <primitive object={mLidFace} />
        </mesh>

        {/* Inner lid logo */}
        {lidTex && (
          <mesh position={[0, -0.01, BD / 2]} rotation={[Math.PI / 2, 0, 0]}>
            <planeGeometry args={[1.2, 1.2]} />
            <meshPhysicalMaterial color="#fff" map={logoTex} roughness={0.9} transparent />
          </mesh>
        )}

        {/* Front magnetic flap */}
        <group position={[0, wallT / 2, BD]} rotation={[-Math.PI * 0.3, 0, 0]}>
          <mesh position={[0, 0, 0.15]} castShadow>
            <boxGeometry args={[BW, wallT, 0.3]} />
            <primitive object={mOuter} />
          </mesh>
        </group>
      </group>
    </group>
  );
};
