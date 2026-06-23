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

  return (
    <group ref={groupRef} scale={[0.85, 0.85, 0.85]}>
      {/* Base Outer */}
      <RoundedBox args={[1.8, 0.25, 1.2]} radius={0.02} smoothness={4} position={[0, -0.125, 0]} castShadow>
        <primitive object={outerMat} attach="material" />
      </RoundedBox>
      
      {/* Inner Cedar Lining floor */}
      <mesh scale={0.999} position={[0, 0.002, 0]}>
        <boxGeometry args={[1.7, 0.004, 1.1]} />
        <primitive object={innerMat} />
      </mesh>
      
      {/* Lip extending upwards into the lid for a tight seal */}
      <mesh scale={0.999} position={[0, 0.04, 0.525]}>
        <boxGeometry args={[1.7, 0.13, 0.05]} />
        <primitive object={innerMat} />
      </mesh>
      <mesh scale={0.999} position={[0, 0.04, -0.525]}>
        <boxGeometry args={[1.7, 0.13, 0.05]} />
        <primitive object={innerMat} />
      </mesh>
      <mesh scale={0.999} position={[0.825, 0.04, 0]}>
        <boxGeometry args={[0.05, 0.13, 1.0]} />
        <primitive object={innerMat} />
      </mesh>
      <mesh scale={0.999} position={[-0.825, 0.04, 0]}>
        <boxGeometry args={[0.05, 0.13, 1.0]} />
        <primitive object={innerMat} />
      </mesh>

      {/* Front Lock / Keyhole Brass Hardware */}
      <mesh scale={0.999} position={[0, -0.05, 0.605]}>
        <boxGeometry args={[0.16, 0.1, 0.02]} />
        <primitive object={hwMat} />
      </mesh>
      <mesh scale={0.999} position={[0, -0.05, 0.617]}>
        <circleGeometry args={[0.015, 16]} />
        <meshBasicMaterial color="#000000" />
      </mesh>
      {/* Little brass screw details on the lock */}
      <mesh scale={0.999} position={[0.05, -0.03, 0.617]}>
        <circleGeometry args={[0.006, 8]} />
        <meshBasicMaterial color="#665522" />
      </mesh>
      <mesh scale={0.999} position={[-0.05, -0.03, 0.617]}>
        <circleGeometry args={[0.006, 8]} />
        <meshBasicMaterial color="#665522" />
      </mesh>
      <mesh scale={0.999} position={[0.05, -0.07, 0.617]}>
        <circleGeometry args={[0.006, 8]} />
        <meshBasicMaterial color="#665522" />
      </mesh>
      <mesh scale={0.999} position={[-0.05, -0.07, 0.617]}>
        <circleGeometry args={[0.006, 8]} />
        <meshBasicMaterial color="#665522" />
      </mesh>

      {/* Hinged Lid */}
      <group position={[0, 0, -0.6]} rotation={[-1.6, 0, 0]}>
        <RoundedBox args={[1.8, 0.2, 1.2]} radius={0.02} smoothness={4} position={[0, 0.1, 0.6]} castShadow>
          <primitive object={outerMat} attach="material" />
        </RoundedBox>
        
        {/* Lid hollow cutout / inner wood (ceiling) */}
        <mesh scale={0.999} position={[0, -0.002, 0.6]}>
          <boxGeometry args={[1.7, 0.004, 1.1]} />
          <primitive object={innerMat} />
        </mesh>
        
        {/* Lid inner frame (walls) to create a recess that perfectly suits the bottom lip */}
        <mesh scale={0.999} position={[0, -0.015, 1.165]}>
          <boxGeometry args={[1.76, 0.03, 0.03]} />
          <primitive object={innerMat} />
        </mesh>
        <mesh scale={0.999} position={[0, -0.015, 0.035]}>
          <boxGeometry args={[1.76, 0.03, 0.03]} />
          <primitive object={innerMat} />
        </mesh>
        <mesh scale={0.999} position={[-0.865, -0.015, 0.6]}>
          <boxGeometry args={[0.03, 0.03, 1.1]} />
          <primitive object={innerMat} />
        </mesh>
        <mesh scale={0.999} position={[0.865, -0.015, 0.6]}>
          <boxGeometry args={[0.03, 0.03, 1.1]} />
          <primitive object={innerMat} />
        </mesh>

        {/* Logo outside lid */}
        {activeTex && (
          <mesh scale={0.999} position={[0, 0.202, 0.6]} rotation={[-Math.PI / 2, 0, 0]}>
            <planeGeometry args={[1.3, 0.9]} />
            <meshPhysicalMaterial color="#ffffff" map={activeTex} roughness={0.4} clearcoat={0.6} transparent />
          </mesh>
        )}

        {/* Top half of the clasp */}
        <mesh scale={0.999} position={[0, 0.05, 1.205]}>
          <boxGeometry args={[0.16, 0.1, 0.02]} />
          <primitive object={hwMat} />
        </mesh>
      </group>

      {/* Back Hinges (Brass) */}
      <mesh scale={0.999} position={[0.6, 0, -0.61]}>
        <cylinderGeometry args={[0.015, 0.015, 0.18, 16]} rotation={[0, 0, Math.PI / 2]} />
        <primitive object={hwMat} />
      </mesh>
      <mesh scale={0.999} position={[-0.6, 0, -0.61]}>
        <cylinderGeometry args={[0.015, 0.015, 0.18, 16]} rotation={[0, 0, Math.PI / 2]} />
        <primitive object={hwMat} />
      </mesh>
    </group>
  );
};
