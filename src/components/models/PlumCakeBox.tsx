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

export const PlumCakeBox = ({ color, autoRotate, textureUrl, bgTextureUrl, activeFaces }: Props) => {
  const groupRef = useRef<THREE.Group>(null!);
  const texture = useTexture(textureUrl || 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=');
  const bgTex = useTexture(bgTextureUrl || 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=');
  texture.colorSpace = THREE.SRGBColorSpace;
  bgTex.colorSpace = THREE.SRGBColorSpace;

  useFrame((_, delta) => {
    if (groupRef.current && autoRotate) groupRef.current.rotation.y += delta * 0.4;
  });

  const boxColor = color || '#a81c1c'; // Festive red as fallback
  const materials = useMemo(() => {
    return faceOrder.map(faceName => {
      const showLogo = !activeFaces || activeFaces[faceName] !== false;
      const activeTex = showLogo && textureUrl ? texture : (bgTextureUrl ? bgTex : null);
      return new THREE.MeshPhysicalMaterial({
        color: activeTex ? '#ffffff' : boxColor,
        map: activeTex,
        roughness: 0.5,
        metalness: 0.05,
        clearcoat: 0.1,
      });
    });
  }, [boxColor, textureUrl, bgTextureUrl, activeFaces, texture, bgTex]);

  const W = 1;
  const H = 0.5;
  const D = 1;

  return (
    <group ref={groupRef} position={[0, -H/2, 0]}>
      {/* Main Box Body */}
      <mesh scale={0.999} castShadow receiveShadow material={materials} position={[0, H/2, 0]}>
        <boxGeometry args={[W, H, D]} />
      </mesh>

      {/* Top Tuck Flap Seam Detail (to make it look like a folding carton) */}
      <mesh scale={0.999} position={[0, H + 0.001, D/2 - 0.01]}>
        <boxGeometry args={[W - 0.02, 0.002, 0.02]} />
        <meshStandardMaterial color="#000000" opacity={0.1} transparent roughness={0.8} />
      </mesh>
      <mesh scale={0.999} position={[-W/2 + 0.01, H + 0.001, 0]}>
        <boxGeometry args={[0.02, 0.002, D - 0.02]} />
        <meshStandardMaterial color="#000000" opacity={0.1} transparent roughness={0.8} />
      </mesh>
      <mesh scale={0.999} position={[W/2 - 0.01, H + 0.001, 0]}>
        <boxGeometry args={[0.02, 0.002, D - 0.02]} />
        <meshStandardMaterial color="#000000" opacity={0.1} transparent roughness={0.8} />
      </mesh>
    </group>
  );
};
