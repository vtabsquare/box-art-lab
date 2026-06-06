import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface Props { color: string; autoRotate: boolean; textureUrl?: string | null; }

export const HotdogBox = ({ color, autoRotate, textureUrl }: Props) => {
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

  const boxColor = color || '#f5f5f5'; // Styrofoam white

  // Styrofoam material look
  const mat = (
    <meshPhysicalMaterial
      map={texture || undefined}
      color={texture ? '#ffffff' : boxColor}
      roughness={0.9}
      metalness={0.0}
      transmission={0.0}
      clearcoat={0.1}
      clearcoatRoughness={0.8}
      side={THREE.DoubleSide}
    />
  );

  const H_base = 0.3;
  const H_lid = 0.3;
  
  // Create square frustum then scale it to be elongated (hotdog shape)
  const baseGeo = useMemo(() => {
    const geo = new THREE.CylinderGeometry(0.5, 0.4, H_base, 4, 1, false);
    geo.rotateY(Math.PI / 4);
    geo.scale(2.4, 1.0, 1.0); // Elongate along X
    return geo;
  }, [H_base]);

  const lidGeo = useMemo(() => {
    const geo = new THREE.CylinderGeometry(0.4, 0.5, H_lid, 4, 1, false);
    geo.rotateY(Math.PI / 4);
    geo.scale(2.4, 1.0, 1.0);
    return geo;
  }, [H_lid]);

  const hingeZ = -0.5 * Math.SQRT1_2 * 1.0; // Back edge Z position
  const lidOpenAngle = -0.6; // Open clamshell

  return (
    <group ref={groupRef} position={[0, -H_base/2, 0]}>
      
      {/* ════════ BASE ════════ */}
      <group position={[0, H_base/2, 0]}>
        <mesh castShadow receiveShadow geometry={baseGeo}>
          {mat}
        </mesh>
        
        {/* Front locking tab */}
        <mesh castShadow receiveShadow position={[0, H_base/2, 0.38]} rotation={[0.2, 0, 0]}>
          <planeGeometry args={[0.4, 0.1]} />
          {mat}
        </mesh>
      </group>

      {/* ════════ LID (Hinged) ════════ */}
      <group position={[0, H_base, hingeZ]} rotation={[lidOpenAngle, 0, 0]}>
        {/* Offset lid to pivot correctly */}
        <group position={[0, H_lid/2, -hingeZ]}>
          <mesh castShadow receiveShadow geometry={lidGeo}>
            {mat}
          </mesh>
          
          {/* Front lid tab */}
          <mesh castShadow receiveShadow position={[0, -H_lid/2 + 0.01, 0.38]} rotation={[0.4, 0, 0]}>
            <planeGeometry args={[0.6, 0.15]} />
            {mat}
          </mesh>
        </group>
      </group>

    </group>
  );
};
