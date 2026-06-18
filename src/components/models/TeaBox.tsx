import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface Props { color: string; autoRotate: boolean; textureUrl?: string | null; }

export const TeaBox = ({ color, autoRotate, textureUrl }: Props) => {
  const groupRef = useRef<THREE.Group>(null!);

  const texture = useMemo(() => {
    if (!textureUrl) return null;
    const t = new THREE.TextureLoader().load(textureUrl);
    t.colorSpace = THREE.SRGBColorSpace;
    return t;
  }, [textureUrl]);

  useFrame((_, delta) => {
    if (groupRef.current && autoRotate) groupRef.current.rotation.y += delta * 0.35;
  });

  const boxColor = color || '#d32f2f'; // Red tea box color

  const mat = (
    <meshPhysicalMaterial
      map={texture || undefined}
      color={texture ? '#ffffff' : boxColor}
      roughness={0.65}
      metalness={0.1} 
    />
  );

  const W = 1.0;
  const D = 1.0;
  const H = 1.4;

  return (
    <group ref={groupRef} position={[0, -H/2, 0]}>
      <mesh scale={0.999} castShadow receiveShadow position={[0, H/2, 0]}>
        <boxGeometry args={[W, H, D]} />
        {mat}
      </mesh>
    </group>
  );
};
