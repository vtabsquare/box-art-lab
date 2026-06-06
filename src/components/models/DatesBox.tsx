import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface Props { color: string; autoRotate: boolean; textureUrl?: string | null; }

export const DatesBox = ({ color, autoRotate, textureUrl }: Props) => {
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

  const boxColor = color || '#3949ab'; // Blue base color from ref

  const mat = (
    <meshPhysicalMaterial
      map={texture || undefined}
      color={texture ? '#ffffff' : boxColor}
      roughness={0.7}
      metalness={0.0}
    />
  );

  const glassMat = (
    <meshPhysicalMaterial
      color="#ffffff"
      roughness={0.05}
      transmission={0.9}
      thickness={0.01}
      transparent
      opacity={0.6}
      clearcoat={1.0}
    />
  );

  const W = 1.6;
  const D = 1.2;
  const H = 0.35;
  const bt = 0.02; // border thickness
  const wBorder = 0.2; // window border size

  // Generate 3D Dates
  const dates = useMemo(() => {
    const items = [];
    const cols = 5;
    const rows = 3;
    const spacingX = (W - wBorder*2) / cols;
    const spacingZ = (D - wBorder*2) / rows;
    
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        // slight random offset and rotation
        const x = -W/2 + wBorder + spacingX/2 + c * spacingX + (Math.random() - 0.5) * 0.05;
        const z = -D/2 + wBorder + spacingZ/2 + r * spacingZ + (Math.random() - 0.5) * 0.05;
        const rotY = Math.random() * Math.PI;
        const rotZ = (Math.random() - 0.5) * 0.2;
        
        items.push({
          pos: [x, -H/2 + 0.08, z] as [number, number, number],
          rot: [0, rotY, rotZ] as [number, number, number],
        });
      }
    }
    return items;
  }, [W, D]);

  return (
    <group ref={groupRef} position={[0, -H/2, 0]}>
      {/* ════════ BOX BASE & WALLS ════════ */}
      <mesh castShadow receiveShadow position={[0, bt/2, 0]}>
        <boxGeometry args={[W, bt, D]} />
        {mat}
      </mesh>
      <mesh castShadow receiveShadow position={[0, H/2, -D/2 + bt/2]}>
        <boxGeometry args={[W, H, bt]} />
        {mat}
      </mesh>
      <mesh castShadow receiveShadow position={[0, H/2, D/2 - bt/2]}>
        <boxGeometry args={[W, H, bt]} />
        {mat}
      </mesh>
      <mesh castShadow receiveShadow position={[-W/2 + bt/2, H/2, 0]}>
        <boxGeometry args={[bt, H, D]} />
        {mat}
      </mesh>
      <mesh castShadow receiveShadow position={[W/2 - bt/2, H/2, 0]}>
        <boxGeometry args={[bt, H, D]} />
        {mat}
      </mesh>

      {/* Inner tray floor for contrast */}
      <mesh receiveShadow position={[0, bt + 0.01, 0]} rotation={[-Math.PI/2, 0, 0]}>
        <planeGeometry args={[W - bt*2, D - bt*2]} />
        <meshStandardMaterial color="#f5f5f5" roughness={0.8} />
      </mesh>

      {/* ════════ DATES ════════ */}
      {dates.map((date, i) => (
        <mesh key={i} castShadow position={date.pos} rotation={date.rot}>
          <capsuleGeometry args={[0.06, 0.12, 16, 16]} />
          {/* Glossy dark reddish-brown for dates */}
          <meshPhysicalMaterial 
            color="#3e1a0d" 
            roughness={0.15} 
            metalness={0.1}
            clearcoat={0.3}
          />
        </mesh>
      ))}

      {/* ════════ TOP LID FRAME & WINDOW ════════ */}
      <group position={[0, H - bt/2, 0]}>
        {/* Frame borders */}
        <mesh castShadow receiveShadow position={[0, 0, -D/2 + wBorder/2]}>
          <boxGeometry args={[W, bt, wBorder]} />
          {mat}
        </mesh>
        <mesh castShadow receiveShadow position={[0, 0, D/2 - wBorder/2]}>
          <boxGeometry args={[W, bt, wBorder]} />
          {mat}
        </mesh>
        <mesh castShadow receiveShadow position={[-W/2 + wBorder/2, 0, 0]}>
          <boxGeometry args={[wBorder, bt, D - wBorder*2]} />
          {mat}
        </mesh>
        <mesh castShadow receiveShadow position={[W/2 - wBorder/2, 0, 0]}>
          <boxGeometry args={[wBorder, bt, D - wBorder*2]} />
          {mat}
        </mesh>
        {/* Clear Plastic Window */}
        <mesh position={[0, 0, 0]} rotation={[-Math.PI/2, 0, 0]}>
          <planeGeometry args={[W - wBorder*2 + 0.02, D - wBorder*2 + 0.02]} />
          {glassMat}
        </mesh>
      </group>
    </group>
  );
};
