import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { useTexture } from '@react-three/drei';
import * as THREE from 'three';

interface Props {
  color: string;
  autoRotate: boolean;
  textureUrl?: string | null;
  bgTextureUrl?: string | null;
  activeFaces?: Record<string, boolean>;
}

/**
 * Shipping Box Premium — A Regular Slotted Container (RSC) style cardboard box.
 * Features 4 top flaps folded outwards, showing a realistic shipping box structure.
 */
export const ShippingBoxPremium = ({ color, autoRotate, textureUrl, bgTextureUrl, activeFaces }: Props) => {
  const groupRef = useRef<THREE.Group>(null!);
  const texture = useTexture(textureUrl || 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=');
  const bgTex = useTexture(bgTextureUrl || 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=');
  texture.colorSpace = THREE.SRGBColorSpace;
  bgTex.colorSpace = THREE.SRGBColorSpace;

  useFrame((_, delta) => {
    if (groupRef.current && autoRotate) groupRef.current.rotation.y += delta * 0.3;
  });

  const W = 1.4;
  const H = 1.1;
  const D = 1.1;
  const wall = 0.025; // Thick corrugated cardboard
  
  // Flap opening angles
  const flapAngle = 2.2; // roughly 125 degrees open

  const faceOrder = ['right', 'left', 'top', 'bottom', 'front', 'back'];
  const materials = useMemo(() => {
    return faceOrder.map(faceName => {
      const showLogo = !activeFaces || activeFaces[faceName] !== false;
      const activeTex = showLogo && textureUrl ? texture : (bgTextureUrl ? bgTex : null);
      return new THREE.MeshPhysicalMaterial({
        color: activeTex ? '#ffffff' : color || '#b58e60', // kraft cardboard color
        map: activeTex,
        roughness: 0.9,
        metalness: 0.0,
      });
    });
  }, [color, textureUrl, bgTextureUrl, activeFaces, texture, bgTex]);

  const innerMat = new THREE.MeshStandardMaterial({ color: '#a07d53', roughness: 1.0 });

  return (
    <group ref={groupRef} position={[0, -H / 2, 0]}>
      {/* ── Base Walls ── */}
      {/* Bottom Floor */}
      <mesh castShadow receiveShadow material={materials} position={[0, wall / 2, 0]}>
        <boxGeometry args={[W, wall, D]} />
      </mesh>
      
      {/* Left Wall */}
      <mesh castShadow material={materials} position={[-W / 2 + wall / 2, wall + (H - wall) / 2, 0]}>
        <boxGeometry args={[wall, H - wall, D]} />
      </mesh>
      {/* Right Wall */}
      <mesh castShadow material={materials} position={[W / 2 - wall / 2, wall + (H - wall) / 2, 0]}>
        <boxGeometry args={[wall, H - wall, D]} />
      </mesh>
      
      {/* Front Wall */}
      <mesh castShadow material={materials} position={[0, wall + (H - wall) / 2, D / 2 - wall / 2]}>
        <boxGeometry args={[W - 2 * wall, H - wall, wall]} />
      </mesh>
      {/* Back Wall */}
      <mesh castShadow material={materials} position={[0, wall + (H - wall) / 2, -D / 2 + wall / 2]}>
        <boxGeometry args={[W - 2 * wall, H - wall, wall]} />
      </mesh>

      {/* Inner Floor covering bottom flaps */}
      <mesh receiveShadow position={[0, wall + 0.001, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[W - 2 * wall, D - 2 * wall]} />
        <primitive object={innerMat} attach="material" />
      </mesh>

      {/* ── Top Flaps ── */}
      {/* Left Flap (Inner) */}
      <group position={[-W / 2 + wall, H, 0]} rotation={[0, 0, flapAngle]}>
        <mesh castShadow material={materials} position={[W / 4, wall / 2, 0]}>
          <boxGeometry args={[W / 2, wall, D - 2 * wall]} />
        </mesh>
      </group>

      {/* Right Flap (Inner) */}
      <group position={[W / 2 - wall, H, 0]} rotation={[0, 0, -flapAngle]}>
        <mesh castShadow material={materials} position={[-W / 4, wall / 2, 0]}>
          <boxGeometry args={[W / 2, wall, D - 2 * wall]} />
        </mesh>
      </group>

      {/* Front Flap (Outer) */}
      <group position={[0, H, D / 2 - wall / 2]} rotation={[-flapAngle, 0, 0]}>
        <mesh castShadow material={materials} position={[0, wall * 1.5, D / 4]}>
          <boxGeometry args={[W, wall, D / 2]} />
        </mesh>
      </group>

      {/* Back Flap (Outer) */}
      <group position={[0, H, -D / 2 + wall / 2]} rotation={[flapAngle, 0, 0]}>
        <mesh castShadow material={materials} position={[0, wall * 1.5, -D / 4]}>
          <boxGeometry args={[W, wall, D / 2]} />
        </mesh>
      </group>
      
      {/* ── Corrugated Edge Details (Visual lines) ── */}
      <lineSegments position={[0, H / 2, 0]}>
        <edgesGeometry args={[new THREE.BoxGeometry(W, H, D)]} />
        <lineBasicMaterial color="#000000" transparent opacity={0.06} />
      </lineSegments>
    </group>
  );
};
