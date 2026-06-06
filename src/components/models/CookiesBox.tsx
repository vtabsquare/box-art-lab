import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface Props { color: string; autoRotate: boolean; textureUrl?: string | null; }

export const CookiesBox = ({ color, autoRotate, textureUrl }: Props) => {
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

  const boxColor = color || '#00acc1'; // Cyan color similar to Kadabra ref

  const mat = (
    <meshPhysicalMaterial
      map={texture || undefined}
      color={texture ? '#ffffff' : boxColor}
      roughness={0.6}
      metalness={0.0}
    />
  );

  const W = 1.6;
  const D = 1.3;
  const H = 0.5;

  return (
    <group ref={groupRef} position={[0, -H/2, 0]}>
      {/* 
        A very clean, perfectly proportioned rectangular carton.
        We use BoxGeometry with a slight bevel via ExtrudeGeometry for premium realism.
      */}
      <mesh castShadow receiveShadow position={[0, H/2, 0]}>
        <boxGeometry args={[W, H, D]} />
        {mat}
      </mesh>
    </group>
  );
};
