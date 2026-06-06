import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface Props { color: string; autoRotate: boolean; textureUrl?: string | null; }

export const PastriesBox = ({ color, autoRotate, textureUrl }: Props) => {
  const groupRef = useRef<THREE.Group>(null!);

  const texture = useMemo(() => {
    if (!textureUrl) return null;
    const t = new THREE.TextureLoader().load(textureUrl);
    t.colorSpace = THREE.SRGBColorSpace;
    return t;
  }, [textureUrl]);

  useFrame((_, delta) => {
    if (groupRef.current && autoRotate) groupRef.current.rotation.y += delta * 0.25;
  });

  const boxColor = color || '#a1887f'; // Kraft brown color

  const mat = (
    <meshPhysicalMaterial
      map={texture || undefined}
      color={texture ? '#ffffff' : boxColor}
      roughness={0.9}
      metalness={0.0}
      side={THREE.DoubleSide}
    />
  );
  
  const insideMat = (
    <meshPhysicalMaterial
      color="#d7ccc8"
      roughness={0.9}
      metalness={0.0}
      side={THREE.DoubleSide}
    />
  );

  const W = 1.4;
  const D = 1.4;
  const H = 0.6;
  const bt = 0.01;

  const lidAngle = -1.8; // Open past 90 degrees

  return (
    <group ref={groupRef} position={[0, -H/2, 0]}>
      {/* ════════ BASE ════════ */}
      <group>
        {/* Floor */}
        <mesh castShadow receiveShadow position={[0, bt/2, 0]}>
          <boxGeometry args={[W, bt, D]} />
          {mat}
        </mesh>
        <mesh receiveShadow position={[0, bt + 0.001, 0]} rotation={[-Math.PI/2, 0, 0]}>
          <planeGeometry args={[W, D]} />
          {insideMat}
        </mesh>
        
        {/* Left Wall */}
        <mesh castShadow receiveShadow position={[-W/2 + bt/2, H/2, 0]}>
          <boxGeometry args={[bt, H, D]} />
          {mat}
        </mesh>
        {/* Right Wall */}
        <mesh castShadow receiveShadow position={[W/2 - bt/2, H/2, 0]}>
          <boxGeometry args={[bt, H, D]} />
          {mat}
        </mesh>
        {/* Front Wall */}
        <mesh castShadow receiveShadow position={[0, H/2, D/2 - bt/2]}>
          <boxGeometry args={[W, H, bt]} />
          {mat}
        </mesh>
        {/* Back Wall (lid attaches to this) */}
        <mesh castShadow receiveShadow position={[0, H/2, -D/2 + bt/2]}>
          <boxGeometry args={[W, H, bt]} />
          {mat}
        </mesh>
      </group>

      {/* ════════ LID (Hinged at back wall top) ════════ */}
      <group position={[0, H, -D/2]} rotation={[lidAngle, 0, 0]}>
        {/* Shift lid to pivot on edge */}
        <group position={[0, 0, D/2]}>
          {/* Main Top Lid */}
          <mesh castShadow receiveShadow position={[0, bt/2, 0]}>
            <boxGeometry args={[W, bt, D]} />
            {mat}
          </mesh>
          <mesh receiveShadow position={[0, -bt/2 - 0.001, 0]} rotation={[Math.PI/2, 0, 0]}>
            <planeGeometry args={[W, D]} />
            {insideMat}
          </mesh>
          
          {/* Lid Front Tuck Flap */}
          <mesh castShadow receiveShadow position={[0, -0.15 + bt/2, D/2 - bt/2]}>
            <boxGeometry args={[W - 0.05, 0.3, bt]} />
            {mat}
          </mesh>
          {/* Lid Side Flaps */}
          <mesh castShadow receiveShadow position={[-W/2 + bt/2, -0.15 + bt/2, 0]}>
            <boxGeometry args={[bt, 0.3, D - 0.05]} />
            {mat}
          </mesh>
          <mesh castShadow receiveShadow position={[W/2 - bt/2, -0.15 + bt/2, 0]}>
            <boxGeometry args={[bt, 0.3, D - 0.05]} />
            {mat}
          </mesh>
        </group>
      </group>
      
    </group>
  );
};
