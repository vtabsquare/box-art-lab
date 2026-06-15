import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface Props { color: string; autoRotate: boolean; textureUrl?: string | null; }

export const ChocolateBox = ({ color, autoRotate, textureUrl }: Props) => {
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

  const boxColor = color || '#1a237e'; // Deep blue
  
  const outerMat = (
    <meshPhysicalMaterial
      map={texture || undefined}
      color={texture ? '#ffffff' : boxColor}
      roughness={0.6}
      metalness={0.1}
    />
  );

  const innerMat = (
    <meshPhysicalMaterial
      color="#d4af37" // Gold inner tray
      roughness={0.4}
      metalness={0.6}
    />
  );

  const W = 1.6;
  const D = 1.2;
  const H = 0.2;
  const bt = 0.02;

  // Generate chocolates
  const chocolates = useMemo(() => {
    const items = [];
    const cols = 4;
    const rows = 3;
    const spacingX = (W - 0.2) / cols;
    const spacingZ = (D - 0.2) / rows;
    
    const colors = ['#3e2723', '#4e342e', '#f5f5f5', '#d4af37', '#e91e63'];
    
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        // Skip some to make it look organic or just fill all
        const x = -W/2 + 0.1 + spacingX/2 + c * spacingX;
        const z = -D/2 + 0.1 + spacingZ/2 + r * spacingZ;
        
        const isRound = (r + c) % 2 === 0;
        const trayY = -H/2 + bt + 0.01;
        const yPos = isRound ? trayY + 0.08 : trayY + 0.06;
        
        items.push({
          pos: [x, yPos, z] as [number, number, number],
          color: colors[(r * cols + c) % colors.length],
          isRound
        });
      }
    }
    return items;
  }, [W, D, H, bt]);

  return (
    <group ref={groupRef}>
      
      {/* ════════ BASE TRAY ════════ */}
      <group position={[0, -0.05, 0]}>
        {/* Floor */}
        <mesh castShadow receiveShadow position={[0, -H/2 + bt/2, 0]}>
          <boxGeometry args={[W, bt, D]} />
          {outerMat}
        </mesh>
        {/* Walls */}
        <mesh castShadow receiveShadow position={[0, 0, -D/2 + bt/2]}>
          <boxGeometry args={[W, H, bt]} />
          {outerMat}
        </mesh>
        <mesh castShadow receiveShadow position={[0, 0, D/2 - bt/2]}>
          <boxGeometry args={[W, H, bt]} />
          {outerMat}
        </mesh>
        <mesh castShadow receiveShadow position={[-W/2 + bt/2, 0, 0]}>
          <boxGeometry args={[bt, H, D]} />
          {outerMat}
        </mesh>
        <mesh castShadow receiveShadow position={[W/2 - bt/2, 0, 0]}>
          <boxGeometry args={[bt, H, D]} />
          {outerMat}
        </mesh>
        
        {/* Inner Gold Insert Plane */}
        <mesh receiveShadow position={[0, -H/2 + bt + 0.01, 0]} rotation={[-Math.PI/2, 0, 0]}>
          <planeGeometry args={[W - bt*2, D - bt*2]} />
          {innerMat}
        </mesh>

        {/* Chocolates */}
        {chocolates.map((choc, i) => (
          <mesh key={i} castShadow position={choc.pos}>
            {choc.isRound ? (
              <sphereGeometry args={[0.08, 16, 16]} />
            ) : (
              <cylinderGeometry args={[0.07, 0.08, 0.12, 12]} />
            )}
            <meshPhysicalMaterial 
              color={choc.color} 
              roughness={choc.color === '#d4af37' ? 0.2 : 0.6}
              metalness={choc.color === '#d4af37' ? 0.8 : 0.1}
            />
          </mesh>
        ))}
      </group>

      {/* ════════ LID (Ajar) ════════ */}
      {/* Positioned slightly offset and resting on the base */}
      <group position={[-0.3, H/2 + 0.05, -0.2]} rotation={[0.1, -0.2, 0.1]}>
        {/* Lid Top */}
        <mesh castShadow receiveShadow position={[0, H/2 - bt/2, 0]}>
          <boxGeometry args={[W + 0.02, bt, D + 0.02]} />
          {outerMat}
        </mesh>
        {/* Lid Walls */}
        <mesh castShadow receiveShadow position={[0, 0, -D/2]}>
          <boxGeometry args={[W + 0.02, H, bt]} />
          {outerMat}
        </mesh>
        <mesh castShadow receiveShadow position={[0, 0, D/2]}>
          <boxGeometry args={[W + 0.02, H, bt]} />
          {outerMat}
        </mesh>
        <mesh castShadow receiveShadow position={[-W/2, 0, 0]}>
          <boxGeometry args={[bt, H, D + 0.02]} />
          {outerMat}
        </mesh>
        <mesh castShadow receiveShadow position={[W/2, 0, 0]}>
          <boxGeometry args={[bt, H, D + 0.02]} />
          {outerMat}
        </mesh>
      </group>

    </group>
  );
};
