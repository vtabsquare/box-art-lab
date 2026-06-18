import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface Props { color: string; autoRotate: boolean; textureUrl?: string | null; }

export const PerfumeBox = ({ color, autoRotate, textureUrl }: Props) => {
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

  const boxColor = color || '#2c2c2c';
  const mat = <meshPhysicalMaterial map={texture || undefined} color={texture ? '#ffffff' : boxColor} roughness={0.1} metalness={0.2} clearcoat={1.0} clearcoatRoughness={0.05} />;

  return (
    <group ref={groupRef}>
      <mesh scale={0.999} castShadow position={[0, -0.1, 0]}><boxGeometry args={[0.65, 1.5, 0.65]} />{mat}</mesh>
      <mesh scale={0.999} position={[0, 0.66, 0]}><boxGeometry args={[0.67, 0.04, 0.67]} /><meshStandardMaterial color="#D4AF37" roughness={0.1} metalness={0.9} /></mesh>
      <mesh scale={0.999} position={[0, -0.86, 0]}><boxGeometry args={[0.67, 0.04, 0.67]} /><meshStandardMaterial color="#D4AF37" roughness={0.1} metalness={0.9} /></mesh>
      <mesh scale={0.999} castShadow position={[0, 1.08, 0]}><cylinderGeometry args={[0.18, 0.22, 0.6, 24]} /><meshPhysicalMaterial color="#a8d8ea" roughness={0.0} metalness={0.1} transmission={0.7} transparent opacity={0.8} /></mesh>
      <mesh scale={0.999} castShadow position={[0, 1.45, 0]}><cylinderGeometry args={[0.07, 0.14, 0.22, 16]} /><meshPhysicalMaterial color="#a8d8ea" roughness={0.0} metalness={0.1} transmission={0.7} transparent opacity={0.8} /></mesh>
      <mesh scale={0.999} castShadow position={[0, 1.62, 0]}><cylinderGeometry args={[0.1, 0.1, 0.14, 16]} /><meshStandardMaterial color="#D4AF37" roughness={0.1} metalness={0.9} /></mesh>
    </group>
  );
};
