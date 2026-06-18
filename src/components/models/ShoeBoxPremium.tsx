import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { useTexture } from '@react-three/drei';
import * as THREE from 'three';


const faceOrder = ['right', 'left', 'top', 'bottom', 'front', 'back'];
interface Props {
  color: string;
  autoRotate: boolean;
  textureUrl?: string | null;
  bgTextureUrl?: string | null;
  activeFaces?: Record<string, boolean>;
}

/**
 * Shoe Box — A rectangular box with a separate telescoping lid
 * that overlaps the base. Lid is lifted at one corner to reveal the interior.
 * Proportions: long (L) × medium (W) × medium (H)
 */
export const ShoeBoxPremium = ({ color, autoRotate, textureUrl, bgTextureUrl, activeFaces }: Props) => {
  const groupRef = useRef<THREE.Group>(null!);
  const texture = useTexture(textureUrl || 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=');
  const bgTex = useTexture(bgTextureUrl || 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=');
  texture.colorSpace = THREE.SRGBColorSpace;
  bgTex.colorSpace = THREE.SRGBColorSpace;

  useFrame((_, delta) => {
    if (groupRef.current && autoRotate) groupRef.current.rotation.y += delta * 0.3;
  });

  const W = 1.6;
  const H = 0.55;
  const D = 0.9;
  const wall = 0.02;
  
  const lidH = 0.02;
  const lidSkirtH = 0.15;
  const gap = 0.01;
  const lidWall = 0.02;
  
  const lidW = W + gap * 2 + lidWall * 2;
  const lidD = D + gap * 2 + lidWall * 2;
  const lidLift = 0.15;
  const baseMaterials = useMemo(() => {
    return faceOrder.map(faceName => {
      const showLogo = !activeFaces || activeFaces[faceName] !== false;
      const activeTex = showLogo && textureUrl ? texture : (bgTextureUrl ? bgTex : null);
      return new THREE.MeshPhysicalMaterial({
        color: activeTex ? '#ffffff' : color || '#795548',
        map: activeTex,
        roughness: 0.5,
        metalness: 0.0,
      });
    });
  }, [color, textureUrl, bgTextureUrl, activeFaces, texture, bgTex]);

  const lidMaterials = useMemo(() => {
    return faceOrder.map(faceName => {
      const showLogo = !activeFaces || activeFaces[faceName] !== false;
      const activeTex = showLogo && textureUrl ? texture : (bgTextureUrl ? bgTex : null);
      return new THREE.MeshPhysicalMaterial({
        color: activeTex ? '#ffffff' : color || '#795548',
        map: activeTex,
        roughness: 0.45,
        metalness: 0.02,
      });
    });
  }, [color, textureUrl, bgTextureUrl, activeFaces, texture, bgTex]);

  const innerMat = new THREE.MeshStandardMaterial({ color: '#f0ebe3', roughness: 0.6 });

  return (
    <group ref={groupRef} position={[0, -H / 2, 0]}>
      {/* ── Base tray ── */}
      {/* Bottom */}
      <mesh scale={0.999} castShadow receiveShadow material={baseMaterials} position={[0, wall / 2, 0]}>
        <boxGeometry args={[W, wall, D]} />
      </mesh>
      {/* Front wall */}
      <mesh scale={0.999} castShadow material={baseMaterials} position={[0, wall + (H - wall) / 2, D / 2 - wall / 2]}>
        <boxGeometry args={[W, H - wall, wall]} />
      </mesh>
      {/* Back wall */}
      <mesh scale={0.999} castShadow material={baseMaterials} position={[0, wall + (H - wall) / 2, -D / 2 + wall / 2]}>
        <boxGeometry args={[W, H - wall, wall]} />
      </mesh>
      {/* Left wall */}
      <mesh scale={0.999} castShadow material={baseMaterials} position={[-W / 2 + wall / 2, wall + (H - wall) / 2, 0]}>
        <boxGeometry args={[wall, H - wall, D - 2 * wall]} />
      </mesh>
      {/* Right wall */}
      <mesh scale={0.999} castShadow material={baseMaterials} position={[W / 2 - wall / 2, wall + (H - wall) / 2, 0]}>
        <boxGeometry args={[wall, H - wall, D - 2 * wall]} />
      </mesh>
      {/* Inner bottom */}
      <mesh scale={0.999} receiveShadow position={[0, wall + 0.001, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[W - 2 * wall, D - 2 * wall]} />
        <primitive object={innerMat} attach="material" />
      </mesh>

      {/* ── Lid ── */}
      <group position={[0, H, -D / 2]}>
        <group rotation={[-lidLift, 0, 0]}>
          {/* Lid top face */}
          <mesh scale={0.999} castShadow material={lidMaterials} position={[0, lidH / 2, D / 2]}>
            <boxGeometry args={[lidW, lidH, lidD]} />
          </mesh>
          {/* Lid front skirt */}
          <mesh scale={0.999} castShadow material={lidMaterials} position={[0, -lidSkirtH / 2, D + gap + lidWall / 2]}>
            <boxGeometry args={[lidW, lidSkirtH, lidWall]} />
          </mesh>
          {/* Lid back skirt */}
          <mesh scale={0.999} castShadow material={lidMaterials} position={[0, -lidSkirtH / 2, -gap - lidWall / 2]}>
            <boxGeometry args={[lidW, lidSkirtH, lidWall]} />
          </mesh>
          {/* Lid left skirt */}
          <mesh scale={0.999} castShadow material={lidMaterials} position={[-W / 2 - gap - lidWall / 2, -lidSkirtH / 2, D / 2]}>
            <boxGeometry args={[lidWall, lidSkirtH, lidD - 2 * lidWall]} />
          </mesh>
          {/* Lid right skirt */}
          <mesh scale={0.999} castShadow material={lidMaterials} position={[W / 2 + gap + lidWall / 2, -lidSkirtH / 2, D / 2]}>
            <boxGeometry args={[lidWall, lidSkirtH, lidD - 2 * lidWall]} />
          </mesh>
        </group>
      </group>

      {/* ── Label strip on front ── */}
      <mesh scale={0.999} position={[0, H * 0.45, D / 2 + 0.001]}>
        <planeGeometry args={[W * 0.6, H * 0.35]} />
        <meshStandardMaterial color="#ffffff" roughness={0.4} transparent opacity={0.85} />
      </mesh>
    </group>
  );
};
