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

export const CigarBox = ({ color, autoRotate, textureUrl, bgTextureUrl, activeFaces }: Props) => {
  const groupRef = useRef<THREE.Group>(null!);
  const texture = useTexture(textureUrl || 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=');
  const bgTex = useTexture(bgTextureUrl || 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=');
  texture.colorSpace = THREE.SRGBColorSpace;
  bgTex.colorSpace = THREE.SRGBColorSpace;
  
  useFrame((_, delta) => {
    if (groupRef.current && autoRotate) groupRef.current.rotation.y += delta * 0.2;
  });

  const extColor = color || '#703e23'; // Rich cherry/mahogany wood
  const intColor = '#cca47c'; // Cedar wood interior
  const trimColor = '#e5c158'; // Brass/gold hardware
  
  const outerMat = new THREE.MeshPhysicalMaterial({ 
    color: extColor, 
    roughness: 0.4, 
    metalness: 0.05,
    clearcoat: 0.6,
    clearcoatRoughness: 0.2
  });
  const innerMat = new THREE.MeshPhysicalMaterial({ 
    color: intColor, 
    roughness: 0.9,
    metalness: 0.0
  });
  const hwMat = new THREE.MeshPhysicalMaterial({ 
    color: trimColor, 
    roughness: 0.2, 
    metalness: 0.9,
    clearcoat: 0.5
  });

  const showLogo = !activeFaces || activeFaces['top'] !== false;
  const activeTex = showLogo && textureUrl ? texture : (bgTextureUrl ? bgTex : null);
  const topMat = new THREE.MeshPhysicalMaterial({ color: activeTex ? '#ffffff' : extColor, map: activeTex, roughness: 0.4, clearcoat: 0.6 });

  return (
    <group ref={groupRef} scale={[0.85, 0.85, 0.85]}>
      {/* Base Outer */}
      <RoundedBox args={[1.8, 0.25, 1.2]} radius={0.02} smoothness={4} position={[0, -0.125, 0]} castShadow>
        <primitive object={outerMat} attach="material" />
      </RoundedBox>
      
      {/* Inner Cedar Lining (floor and protruding walls) */}
      <mesh position={[0, -0.05, 0]}>
        <boxGeometry args={[1.7, 0.05, 1.1]} />
        <primitive object={innerMat} />
      </mesh>
      
      {/* Lip extending upwards into the lid for a tight seal */}
      <mesh position={[0, 0.04, 0.525]}>
        <boxGeometry args={[1.7, 0.13, 0.05]} />
        <primitive object={innerMat} />
      </mesh>
      <mesh position={[0, 0.04, -0.525]}>
        <boxGeometry args={[1.7, 0.13, 0.05]} />
        <primitive object={innerMat} />
      </mesh>
      <mesh position={[0.825, 0.04, 0]}>
        <boxGeometry args={[0.05, 0.13, 1.1]} />
        <primitive object={innerMat} />
      </mesh>
      <mesh position={[-0.825, 0.04, 0]}>
        <boxGeometry args={[0.05, 0.13, 1.1]} />
        <primitive object={innerMat} />
      </mesh>

      {/* Front Lock / Keyhole Brass Hardware */}
      <mesh position={[0, 0, 0.605]}>
        <boxGeometry args={[0.16, 0.1, 0.02]} />
        <primitive object={hwMat} />
      </mesh>
      <mesh position={[0, 0, 0.616]}>
        <circleGeometry args={[0.015, 16]} />
        <meshBasicMaterial color="#000000" />
      </mesh>
      {/* Little brass screw details on the lock */}
      <mesh position={[0.05, 0.02, 0.615]}>
        <circleGeometry args={[0.006, 8]} />
        <meshBasicMaterial color="#665522" />
      </mesh>
      <mesh position={[-0.05, 0.02, 0.615]}>
        <circleGeometry args={[0.006, 8]} />
        <meshBasicMaterial color="#665522" />
      </mesh>
      <mesh position={[0.05, -0.02, 0.615]}>
        <circleGeometry args={[0.006, 8]} />
        <meshBasicMaterial color="#665522" />
      </mesh>
      <mesh position={[-0.05, -0.02, 0.615]}>
        <circleGeometry args={[0.006, 8]} />
        <meshBasicMaterial color="#665522" />
      </mesh>

      {/* Hinged Lid */}
      <group position={[0, 0, -0.6]} rotation={[-1.6, 0, 0]}>
        <RoundedBox args={[1.8, 0.2, 1.2]} radius={0.02} smoothness={4} position={[0, 0.1, 0.6]} castShadow>
          <primitive object={outerMat} attach="material-0" />
          <primitive object={outerMat} attach="material-1" />
          <primitive object={outerMat} attach="material-2" />
          <primitive object={outerMat} attach="material-3" />
          <primitive object={topMat} attach="material-4" />
          <primitive object={outerMat} attach="material-5" />
        </RoundedBox>
        
        {/* Lid hollow cutout / inner wood */}
        <mesh position={[0, 0.005, 0.6]}>
          <boxGeometry args={[1.7, 0.01, 1.1]} />
          <primitive object={innerMat} />
        </mesh>

        {/* Logo inside lid */}
        {textureUrl && (
          <mesh position={[0, -0.002, 0.6]} rotation={[Math.PI / 2, 0, Math.PI]}>
            <planeGeometry args={[1.3, 0.9]} />
            <meshPhysicalMaterial color="#ffffff" map={texture} roughness={0.9} transparent />
          </mesh>
        )}

        {/* Top half of the clasp */}
        <mesh position={[0, 0.05, 1.205]}>
          <boxGeometry args={[0.16, 0.1, 0.02]} />
          <primitive object={hwMat} />
        </mesh>
      </group>

      {/* Back Hinges (Brass) */}
      <mesh position={[0.6, 0, -0.61]}>
        <cylinderGeometry args={[0.015, 0.015, 0.18, 16]} rotation={[0, 0, Math.PI / 2]} />
        <primitive object={hwMat} />
      </mesh>
      <mesh position={[-0.6, 0, -0.61]}>
        <cylinderGeometry args={[0.015, 0.015, 0.18, 16]} rotation={[0, 0, Math.PI / 2]} />
        <primitive object={hwMat} />
      </mesh>
    </group>
  );
};
