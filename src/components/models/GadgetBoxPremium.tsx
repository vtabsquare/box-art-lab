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
 * Gadget Box Premium — A tall folding carton box featuring a hanger tab (euro hole)
 * extending from the top rear. Perfectly closed to showcase the graphics.
 */
export const GadgetBoxPremium = ({ color, autoRotate, textureUrl, bgTextureUrl, activeFaces }: Props) => {
  const groupRef = useRef<THREE.Group>(null!);
  const texture = useTexture(textureUrl || 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=');
  const bgTex = useTexture(bgTextureUrl || 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=');
  texture.colorSpace = THREE.SRGBColorSpace;
  bgTex.colorSpace = THREE.SRGBColorSpace;

  useFrame((_, delta) => {
    if (groupRef.current && autoRotate) groupRef.current.rotation.y += delta * 0.3;
  });

  const W = 0.65;
  const H = 1.4;
  const D = 0.3;
  const wall = 0.015;
  
  // Hanger tab details
  const tabH = 0.25;
  const holeRadius = 0.04;

  const faceOrder = ['right', 'left', 'top', 'bottom', 'front', 'back'];
  const materials = useMemo(() => {
    return faceOrder.map(faceName => {
      const showLogo = !activeFaces || activeFaces[faceName] !== false;
      const activeTex = showLogo && textureUrl ? texture : (bgTextureUrl ? bgTex : null);
      return new THREE.MeshPhysicalMaterial({
        color: activeTex ? '#ffffff' : color || '#fdfdfd',
        map: activeTex,
        roughness: 0.4,
        metalness: 0.0,
      });
    });
  }, [color, textureUrl, bgTextureUrl, activeFaces, texture, bgTex]);

  return (
    <group ref={groupRef} position={[0, -H / 2, 0]}>
      {/* ── Main Box Body (Closed) ── */}
      <mesh castShadow receiveShadow material={materials} position={[0, H / 2, 0]}>
        <boxGeometry args={[W, H, D]} />
      </mesh>

      {/* ── Hanger Tab (Extends from the back panel) ── */}
      <group position={[0, H, -D / 2 + wall / 2]}>
        {/* Solid part of tab */}
        <mesh castShadow material={materials} position={[0, tabH / 2, 0]}>
          <boxGeometry args={[W, tabH, wall]} />
        </mesh>
        {/* Simulate Euro Hole (Cutout) with a contrasting black cylinder */}
        <mesh position={[0, tabH * 0.6, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[holeRadius, holeRadius, wall + 0.002, 16]} />
          <meshBasicMaterial color="#000000" />
        </mesh>
      </group>

      {/* ── Subtle Box Folds / Edges ── */}
      <lineSegments position={[0, H / 2, 0]}>
        <edgesGeometry args={[new THREE.BoxGeometry(W, H, D)]} />
        <lineBasicMaterial color="#000000" transparent opacity={0.08} />
      </lineSegments>
    </group>
  );
};
