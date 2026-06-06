import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface Props { color: string; autoRotate: boolean; textureUrl?: string | null; }

export const StandUpPouch = ({ color, autoRotate, textureUrl }: Props) => {
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

  const pouchColor = color || '#2196f3';

  // Build custom shape using Shape
  const frontShape = useMemo(() => {
    const s = new THREE.Shape();
    s.moveTo(-0.42, -0.95);
    s.lineTo(0.42, -0.95);
    s.lineTo(0.38, 0.95);
    s.lineTo(-0.38, 0.95);
    s.closePath();
    return s;
  }, []);

  const frontGeo = useMemo(() =>
    new THREE.ShapeGeometry(frontShape), [frontShape]);

  const mat = (
    <meshPhysicalMaterial
      map={texture || undefined}
      color={texture ? '#ffffff' : pouchColor}
      roughness={0.25}
      metalness={0.35}
      side={THREE.DoubleSide}
    />
  );

  return (
    <group ref={groupRef}>
      {/* Front panel */}
      <mesh castShadow position={[0, 0, 0.15]} geometry={frontGeo}>
        {mat}
      </mesh>
      {/* Back panel */}
      <mesh castShadow position={[0, 0, -0.15]} rotation={[0, Math.PI, 0]} geometry={frontGeo}>
        {mat}
      </mesh>
      {/* Bottom gusset (oval/rounded base) */}
      <mesh castShadow position={[0, -0.95, 0]} rotation={[Math.PI / 2, 0, 0]} scale={[0.42, 0.15, 1]}>
        <circleGeometry args={[1, 24]} />
        {mat}
      </mesh>
      {/* Side seals */}
      {[-0.42, 0.42].map((x, i) => (
        <mesh key={i} castShadow position={[x + (i === 0 ? 0.015 : -0.015), 0, 0]} rotation={[0, Math.PI / 2, 0]}>
          <planeGeometry args={[0.3, 1.9]} />
          <meshStandardMaterial color={pouchColor} roughness={0.2} metalness={0.4} />
        </mesh>
      ))}
      {/* Zip lock line */}
      <mesh position={[0, 0.72, 0.16]}>
        <boxGeometry args={[0.76, 0.04, 0.01]} />
        <meshStandardMaterial color="#ffffff" roughness={0.5} transparent opacity={0.8} />
      </mesh>
      {/* Top seal */}
      <mesh castShadow position={[0, 0.97, 0]}>
        <boxGeometry args={[0.76, 0.06, 0.3]} />
        <meshStandardMaterial color={pouchColor} roughness={0.2} metalness={0.4} />
      </mesh>
      {/* Hang hole */}
      <mesh position={[0, 1.02, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.04, 0.07, 16]} />
        <meshStandardMaterial color="#ffffff" side={THREE.DoubleSide} />
      </mesh>
    </group>
  );
};
