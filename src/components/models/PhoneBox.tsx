import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface Props { color: string; autoRotate: boolean; textureUrl?: string | null; }

export const PhoneBox = ({ color, autoRotate, textureUrl }: Props) => {
  const groupRef = useRef<THREE.Group>(null!);

  const texture = useMemo(() => {
    if (!textureUrl) return null;
    const t = new THREE.TextureLoader().load(textureUrl);
    t.colorSpace = THREE.SRGBColorSpace;
    return t;
  }, [textureUrl]);

  useFrame((_, delta) => {
    if (groupRef.current && autoRotate) groupRef.current.rotation.y += delta * 0.3;
  });

  const boxColor = color || '#1a1a2e';
  const mat = (
    <meshPhysicalMaterial
      map={texture || undefined}
      color={texture ? '#ffffff' : boxColor}
      roughness={0.15}
      metalness={0.1}
      clearcoat={0.8}
      clearcoatRoughness={0.1}
    />
  );

  return (
    <group ref={groupRef}>
      {/* Outer sleeve bottom half */}
      <mesh scale={0.999} castShadow position={[0, -0.3, 0]}>
        <boxGeometry args={[0.72, 0.72, 0.72]} />
        {mat}
      </mesh>
      {/* Outer sleeve top half (raised like opening box) */}
      <mesh scale={0.999} castShadow position={[0, 0.52, 0]}>
        <boxGeometry args={[0.72, 0.5, 0.72]} />
        {mat}
      </mesh>
      {/* Inner tray (showing phone silhouette inside) */}
      <mesh scale={0.999} position={[0, 0.05, 0.34]}>
        <boxGeometry args={[0.55, 0.95, 0.04]} />
        <meshStandardMaterial color="#111111" roughness={0.05} metalness={0.9} />
      </mesh>
      {/* Phone screen visible on top face */}
      <mesh scale={0.999} position={[0, 0.78, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[0.6, 0.6]} />
        <meshStandardMaterial
          color={texture ? '#ffffff' : boxColor}
          map={texture || undefined}
          roughness={0.15}
          metalness={0.1}
        />
      </mesh>
      {/* Top face brand label area */}
      <mesh scale={0.999} position={[0, 0.18, 0.362]}>
        <planeGeometry args={[0.5, 0.3]} />
        <meshStandardMaterial color="#58A6FF" roughness={0.2} transparent opacity={0.7} />
      </mesh>
    </group>
  );
};
