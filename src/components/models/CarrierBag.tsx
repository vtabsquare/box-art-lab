import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface Props { color: string; autoRotate: boolean; textureUrl?: string | null; }

export const CarrierBag = ({ color, autoRotate, textureUrl }: Props) => {
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

  const bagColor = color || '#e8d5b7';
  const mat = (
    <meshPhysicalMaterial
      map={texture || undefined}
      color={texture ? '#ffffff' : bagColor}
      roughness={0.55}
      metalness={0.0}
    />
  );

  // Bag shape: open top box with no top face
  return (
    <group ref={groupRef}>
      {/* Front face */}
      <mesh castShadow position={[0, 0, 0.45]}>
        <planeGeometry args={[0.9, 1.6]} />
        {mat}
      </mesh>
      {/* Back face */}
      <mesh castShadow position={[0, 0, -0.45]} rotation={[0, Math.PI, 0]}>
        <planeGeometry args={[0.9, 1.6]} />
        {mat}
      </mesh>
      {/* Left face */}
      <mesh castShadow position={[-0.45, 0, 0]} rotation={[0, Math.PI / 2, 0]}>
        <planeGeometry args={[0.9, 1.6]} />
        {mat}
      </mesh>
      {/* Right face */}
      <mesh castShadow position={[0.45, 0, 0]} rotation={[0, -Math.PI / 2, 0]}>
        <planeGeometry args={[0.9, 1.6]} />
        {mat}
      </mesh>
      {/* Bottom */}
      <mesh castShadow position={[0, -0.8, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[0.9, 0.9]} />
        {mat}
      </mesh>
      {/* Gusset folds (side creases) */}
      {[-0.22, 0.22].map((x, i) => (
        <mesh key={i} position={[x, 0, 0.45]} rotation={[0, i === 0 ? 0.3 : -0.3, 0]}>
          <planeGeometry args={[0.05, 1.6]} />
          <meshStandardMaterial color={texture ? '#ffffff' : '#c8b89a'} side={THREE.DoubleSide} />
        </mesh>
      ))}
      {/* Handle - left arc */}
      <mesh position={[-0.2, 0.95, 0]} rotation={[0, 0, 0]}>
        <torusGeometry args={[0.18, 0.018, 8, 24, Math.PI]} />
        <meshStandardMaterial color="#8B6914" roughness={0.6} />
      </mesh>
      {/* Handle - right arc */}
      <mesh position={[0.2, 0.95, 0]} rotation={[0, 0, 0]}>
        <torusGeometry args={[0.18, 0.018, 8, 24, Math.PI]} />
        <meshStandardMaterial color="#8B6914" roughness={0.6} />
      </mesh>
    </group>
  );
};
