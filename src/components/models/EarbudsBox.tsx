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
 * EarbudsBox — A sleek, modern vertical carton (Straight/Reverse Tuck End)
 * Perfectly closed with subtle edge creases to define the flaps.
 */
export const EarbudsBox = ({ color, autoRotate, textureUrl, bgTextureUrl, activeFaces }: Props) => {
  const groupRef = useRef<THREE.Group>(null!);
  const texture = useTexture(textureUrl || 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=');
  const bgTex = useTexture(bgTextureUrl || 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=');
  texture.colorSpace = THREE.SRGBColorSpace;
  bgTex.colorSpace = THREE.SRGBColorSpace;

  useFrame((_, delta) => {
    if (groupRef.current && autoRotate) groupRef.current.rotation.y += delta * 0.3;
  });

  const W = 0.6;
  const H = 0.84;
  const D = 0.3;
  
  const materials = useMemo(() => {
    return faceOrder.map(faceName => {
      const showLogo = !activeFaces || activeFaces[faceName] !== false;
      const activeTex = showLogo && textureUrl ? texture : (bgTextureUrl ? bgTex : null);
      return new THREE.MeshPhysicalMaterial({
        color: activeTex ? '#ffffff' : color || '#1a1a1a', // Default dark color to match earbuds typical vibe
        map: activeTex,
        roughness: 0.35,
        metalness: 0.05,
      });
    });
  }, [color, textureUrl, bgTextureUrl, activeFaces, texture, bgTex]);

  return (
    <group ref={groupRef} position={[0, -H / 2, 0]}>
      {/* ── Main Box Body (Closed) ── */}
      <mesh scale={0.999} castShadow receiveShadow material={materials} position={[0, H / 2, 0]}>
        <boxGeometry args={[W, H, D]} />
      </mesh>

      {/* ── Subtle Box Folds / Edges ── */}
      <lineSegments position={[0, H / 2, 0]}>
        <edgesGeometry args={[new THREE.BoxGeometry(W, H, D)]} />
        <lineBasicMaterial color="#ffffff" transparent opacity={0.1} />
      </lineSegments>
      
      {/* Top flap crease */}
      <lineSegments position={[0, H, D/2]}>
        <edgesGeometry args={[new THREE.PlaneGeometry(W, 0)]} />
        <lineBasicMaterial color="#ffffff" transparent opacity={0.1} />
      </lineSegments>
    </group>
  );
};
