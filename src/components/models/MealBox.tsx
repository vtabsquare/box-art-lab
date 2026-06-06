import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface Props { color: string; autoRotate: boolean; textureUrl?: string | null; }

export const MealBox = ({ color, autoRotate, textureUrl }: Props) => {
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

  const boxColor = color || '#d7ccc8'; // Light brown/kraft outer

  const mat = (
    <meshPhysicalMaterial
      map={texture || undefined}
      color={texture ? '#ffffff' : boxColor}
      roughness={0.8}
      metalness={0.0}
    />
  );
  
  const insertMat = (
    <meshPhysicalMaterial
      color="#ffffff" // White inner tray
      roughness={0.6}
      metalness={0.0}
    />
  );

  const W = 1.8;
  const D = 1.4;
  const H = 0.3;
  const bt = 0.02;

  // Inner tray insert with compartment holes
  const insertGeo = useMemo(() => {
    const shape = new THREE.Shape();
    // Tray outer boundary
    shape.moveTo(-W/2 + bt, -D/2 + bt);
    shape.lineTo(W/2 - bt, -D/2 + bt);
    shape.lineTo(W/2 - bt, D/2 - bt);
    shape.lineTo(-W/2 + bt, D/2 - bt);
    shape.lineTo(-W/2 + bt, -D/2 + bt);

    // Large compartment (Main)
    const mainHole = new THREE.Path();
    mainHole.moveTo(-0.1, -0.5);
    mainHole.lineTo(0.7, -0.5);
    mainHole.lineTo(0.7, 0.5);
    mainHole.lineTo(-0.1, 0.5);
    mainHole.lineTo(-0.1, -0.5);
    shape.holes.push(mainHole);

    // Small circular compartment (Dip/Sauce)
    const dipHole1 = new THREE.Path();
    dipHole1.absarc(-0.5, 0.3, 0.2, 0, Math.PI * 2, false);
    shape.holes.push(dipHole1);

    // Second circular compartment (Side)
    const dipHole2 = new THREE.Path();
    dipHole2.absarc(-0.5, -0.3, 0.2, 0, Math.PI * 2, false);
    shape.holes.push(dipHole2);

    return new THREE.ExtrudeGeometry(shape, { depth: H - 0.1, bevelEnabled: true, bevelSize: 0.02, bevelThickness: 0.02 });
  }, [W, D, H, bt]);

  return (
    <group ref={groupRef} position={[0, -H/2, 0]}>
      {/* ════════ BOX BASE ════════ */}
      <group>
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
        
        {/* Inner Compartment Insert */}
        <mesh castShadow receiveShadow geometry={insertGeo} position={[0, 0.05, 0]} rotation={[Math.PI/2, 0, 0]}>
          {insertMat}
        </mesh>
        {/* Tray Floor (under holes) */}
        <mesh receiveShadow position={[0, 0.06, 0]} rotation={[-Math.PI/2, 0, 0]}>
          <planeGeometry args={[W - bt*2, D - bt*2]} />
          <meshStandardMaterial color="#f0f0f0" />
        </mesh>
      </group>

      {/* ════════ LID (Folded open) ════════ */}
      <group position={[0, H, -D/2 + bt]} rotation={[-0.4, 0, 0]}>
        <mesh castShadow receiveShadow position={[0, bt/2, D/2]}>
          <boxGeometry args={[W, bt, D]} />
          {mat}
        </mesh>
        {/* Lid front tuck flap */}
        <mesh castShadow receiveShadow position={[0, bt, D]} rotation={[-Math.PI/2 - 0.2, 0, 0]}>
          <boxGeometry args={[W - 0.2, 0.15, bt]} />
          {mat}
        </mesh>
      </group>
    </group>
  );
};
