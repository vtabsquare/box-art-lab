import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface Props { color: string; autoRotate: boolean; textureUrl?: string | null; }

export const GiftBox = ({ color, autoRotate, textureUrl }: Props) => {
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

  const boxColor = color || '#e91e8c';
  const mat = (
    <meshPhysicalMaterial
      map={texture || undefined}
      color={texture ? '#ffffff' : boxColor}
      roughness={0.3}
      metalness={0.05}
    />
  );

  return (
    <group ref={groupRef}>
      {/* Base box */}
      <mesh castShadow position={[0, -0.12, 0]}>
        <boxGeometry args={[1.1, 0.85, 1.1]} />
        {mat}
      </mesh>
      {/* Lid (slightly lifted) */}
      <mesh castShadow position={[0, 0.42, 0]}>
        <boxGeometry args={[1.15, 0.2, 1.15]} />
        {mat}
      </mesh>
      {/* Ribbon vertical strip */}
      <mesh position={[0, 0.1, 0.56]}>
        <boxGeometry args={[0.12, 0.85, 0.02]} />
        <meshStandardMaterial color="#ffd700" roughness={0.2} metalness={0.6} />
      </mesh>
      <mesh position={[0, 0.1, -0.56]}>
        <boxGeometry args={[0.12, 0.85, 0.02]} />
        <meshStandardMaterial color="#ffd700" roughness={0.2} metalness={0.6} />
      </mesh>
      {/* Ribbon horizontal strip */}
      <mesh position={[0.56, 0.1, 0]}>
        <boxGeometry args={[0.02, 0.85, 0.12]} />
        <meshStandardMaterial color="#ffd700" roughness={0.2} metalness={0.6} />
      </mesh>
      <mesh position={[-0.56, 0.1, 0]}>
        <boxGeometry args={[0.02, 0.85, 0.12]} />
        <meshStandardMaterial color="#ffd700" roughness={0.2} metalness={0.6} />
      </mesh>
      {/* Bow loops */}
      {[0, Math.PI / 2, Math.PI, -Math.PI / 2].map((angle, i) => (
        <mesh key={i} position={[Math.sin(angle) * 0.18, 0.58, Math.cos(angle) * 0.18]} rotation={[0, angle, 0.3]}>
          <torusGeometry args={[0.13, 0.035, 8, 20, Math.PI]} />
          <meshStandardMaterial color="#ffd700" roughness={0.2} metalness={0.6} />
        </mesh>
      ))}
      {/* Bow center knot */}
      <mesh position={[0, 0.6, 0]}>
        <sphereGeometry args={[0.06, 12, 12]} />
        <meshStandardMaterial color="#ffd700" roughness={0.2} metalness={0.6} />
      </mesh>
    </group>
  );
};
