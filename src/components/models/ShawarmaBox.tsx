import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface Props { color: string; autoRotate: boolean; textureUrl?: string | null; }

export const ShawarmaBox = ({ color, autoRotate, textureUrl }: Props) => {
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

  const boxColor = color || '#ffca28'; // Warm yellow/orange from ref

  const mat = (
    <meshPhysicalMaterial
      map={texture || undefined}
      color={texture ? '#ffffff' : boxColor}
      roughness={0.8}
      metalness={0.0}
      side={THREE.DoubleSide}
    />
  );
  
  const insideMat = (
    <meshPhysicalMaterial
      color="#e0e0e0" // Gray/white interior
      roughness={0.9}
      metalness={0.0}
      side={THREE.DoubleSide}
    />
  );

  const W = 2.4; // Very long
  const D = 0.8; // Narrow
  const H = 0.5;
  const bt = 0.01;

  const lidAngle = -1.9; // Flipped wide open

  return (
    <group ref={groupRef} position={[0, -H/2, 0]}>
      {/* ════════ BASE ════════ */}
      <group>
        {/* Floor */}
        <mesh scale={0.999} castShadow receiveShadow position={[0, bt/2, 0]}>
          <boxGeometry args={[W, bt, D]} />
          {mat}
        </mesh>
        <mesh scale={0.999} receiveShadow position={[0, bt + 0.001, 0]} rotation={[-Math.PI/2, 0, 0]}>
          <planeGeometry args={[W, D]} />
          {insideMat}
        </mesh>
        
        {/* Left Wall */}
        <mesh scale={0.999} castShadow receiveShadow position={[-W/2 + bt/2, H/2, 0]}>
          <boxGeometry args={[bt, H, D]} />
          {mat}
        </mesh>
        {/* Right Wall */}
        <mesh scale={0.999} castShadow receiveShadow position={[W/2 - bt/2, H/2, 0]}>
          <boxGeometry args={[bt, H, D]} />
          {mat}
        </mesh>
        {/* Front Wall */}
        <mesh scale={0.999} castShadow receiveShadow position={[0, H/2, D/2 - bt/2]}>
          <boxGeometry args={[W, H, bt]} />
          {mat}
        </mesh>
        {/* Back Wall (lid attaches here) */}
        <mesh scale={0.999} castShadow receiveShadow position={[0, H/2, -D/2 + bt/2]}>
          <boxGeometry args={[W, H, bt]} />
          {mat}
        </mesh>
      </group>

      {/* ════════ LID (Hinged at back wall top) ════════ */}
      <group position={[0, H, -D/2]} rotation={[lidAngle, 0, 0]}>
        {/* Shift lid to pivot on edge */}
        <group position={[0, 0, D/2]}>
          {/* Main Top Lid */}
          <mesh scale={0.999} castShadow receiveShadow position={[0, bt/2, 0]}>
            <boxGeometry args={[W, bt, D]} />
            {mat}
          </mesh>
          <mesh scale={0.999} receiveShadow position={[0, -bt/2 - 0.001, 0]} rotation={[Math.PI/2, 0, 0]}>
            <planeGeometry args={[W, D]} />
            {insideMat}
          </mesh>
          
          {/* Lid Front Flap */}
          <mesh scale={0.999} castShadow receiveShadow position={[0, -0.2 + bt/2, D/2 - bt/2]}>
            <boxGeometry args={[W - 0.2, 0.4, bt]} />
            {mat}
          </mesh>
        </group>
      </group>
      
    </group>
  );
};
