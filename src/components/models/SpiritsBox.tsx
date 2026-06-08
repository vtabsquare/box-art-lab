import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useTexture, RoundedBox } from '@react-three/drei';

interface Props { 
  color: string; 
  autoRotate: boolean; 
  textureUrl?: string | null; 
  bgTextureUrl?: string | null; 
  activeFaces?: Record<string, boolean>; 
}

export const SpiritsBox = ({ color, autoRotate, textureUrl, bgTextureUrl, activeFaces }: Props) => {
  const groupRef = useRef<THREE.Group>(null!);
  const texture = useTexture(textureUrl || 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=');
  const bgTex = useTexture(bgTextureUrl || 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=');
  texture.colorSpace = THREE.SRGBColorSpace;
  bgTex.colorSpace = THREE.SRGBColorSpace;
  
  useFrame((_, delta) => {
    if (groupRef.current && autoRotate) groupRef.current.rotation.y += delta * 0.2;
  });

  const extColor = color || '#1c1c1c'; // Deep charcoal/black
  const labelColor = '#d35400'; // Warm terra cotta/red like the image
  
  const outerMat = new THREE.MeshPhysicalMaterial({ 
    color: extColor, 
    roughness: 0.7, 
    metalness: 0.1,
    clearcoat: 0.1 
  });
  
  const showLogo = !activeFaces || activeFaces['front'] !== false;
  const activeTex = showLogo && textureUrl ? texture : (bgTextureUrl ? bgTex : null);
  
  // The label wrapper
  const wrapMat = new THREE.MeshPhysicalMaterial({ 
    color: activeTex ? '#ffffff' : labelColor, 
    map: activeTex, 
    roughness: 0.6,
    clearcoat: 0.05
  });

  return (
    <group ref={groupRef} scale={[0.8, 0.8, 0.8]}>
      {/* Tall Base Body with soft edges */}
      <RoundedBox args={[1.0, 3.4, 1.0]} radius={0.02} smoothness={4} castShadow position={[0, 0, 0]}>
        <primitive object={outerMat} attach="material" />
      </RoundedBox>
      
      {/* Slipcase Gap / Separation line */}
      {/* This gives the illusion that the box has a lid that comes off */}
      <mesh position={[0, -1.2, 0]}>
        <boxGeometry args={[1.005, 0.015, 1.005]} />
        <meshPhysicalMaterial color="#000000" roughness={1.0} />
      </mesh>

      {/* Wrapped Label / Sleeve */}
      {/* Front */}
      <mesh castShadow material={wrapMat} position={[0, -0.2, 0.505]}>
        <planeGeometry args={[1.0, 1.8]} />
      </mesh>
      {/* Right side */}
      <mesh castShadow material={wrapMat} position={[0.505, -0.2, 0]} rotation={[0, Math.PI / 2, 0]}>
        <planeGeometry args={[1.0, 1.8]} />
      </mesh>
      {/* Left side */}
      <mesh castShadow material={wrapMat} position={[-0.505, -0.2, 0]} rotation={[0, -Math.PI / 2, 0]}>
        <planeGeometry args={[1.0, 1.8]} />
      </mesh>
      
      {/* Inner Label Base (to cover edges of the wrap slightly for realism) */}
      <mesh position={[0, -0.2, 0]}>
        <boxGeometry args={[1.008, 1.8, 1.008]} />
        <meshBasicMaterial color={labelColor} transparent opacity={0.1} />
      </mesh>
    </group>
  );
};
