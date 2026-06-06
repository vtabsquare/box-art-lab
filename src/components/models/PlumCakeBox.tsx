import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface Props { color: string; autoRotate: boolean; textureUrl?: string | null; }

export const PlumCakeBox = ({ color, autoRotate, textureUrl }: Props) => {
  const groupRef = useRef<THREE.Group>(null!);

  const texture = useMemo(() => {
    if (!textureUrl) return null;
    const t = new THREE.TextureLoader().load(textureUrl);
    t.colorSpace = THREE.SRGBColorSpace;
    return t;
  }, [textureUrl]);

  useFrame((_, delta) => {
    if (groupRef.current && autoRotate) groupRef.current.rotation.y += delta * 0.4;
  });

  const boxColor = color || '#880e4f'; // Dark festive plum red

  // Metallic tin material
  const mat = (
    <meshPhysicalMaterial
      map={texture || undefined}
      color={texture ? '#ffffff' : boxColor}
      roughness={0.3}
      metalness={0.6}
      clearcoat={0.3}
    />
  );
  
  const innerMat = (
    <meshStandardMaterial
      color="#e0e0e0"
      roughness={0.4}
      metalness={0.8}
    />
  );

  const radius = 0.8;
  const H = 0.5;
  const lidH = 0.1;
  const lidRadius = radius + 0.02; // slightly larger to fit over

  return (
    <group ref={groupRef} position={[0, -H/2, 0]}>
      {/* Tin Base */}
      <mesh castShadow receiveShadow position={[0, H/2, 0]}>
        <cylinderGeometry args={[radius, radius, H, 64]} />
        {mat}
      </mesh>
      
      {/* Inner Floor (if lid was open, but it's closed, we just render outer) */}
      
      {/* Tin Lid */}
      {/* Resting slightly on top, overlapping the base */}
      <group position={[0, H, 0]}>
        {/* Lid Top */}
        <mesh castShadow receiveShadow position={[0, 0, 0]}>
          <cylinderGeometry args={[lidRadius, lidRadius, lidH, 64]} />
          {mat}
        </mesh>
        {/* Lid Lip detail */}
        <mesh castShadow receiveShadow position={[0, lidH/2, 0]}>
          <torusGeometry args={[lidRadius - 0.01, 0.01, 16, 64]} />
          {mat}
        </mesh>
      </group>
    </group>
  );
};
