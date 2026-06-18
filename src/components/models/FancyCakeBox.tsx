import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface Props { color: string; autoRotate: boolean; textureUrl?: string | null; }

export const FancyCakeBox = ({ color, autoRotate, textureUrl }: Props) => {
  const groupRef = useRef<THREE.Group>(null!);

  const texture = useMemo(() => {
    if (!textureUrl) return null;
    const t = new THREE.TextureLoader().load(textureUrl);
    t.colorSpace = THREE.SRGBColorSpace;
    t.wrapS = THREE.RepeatWrapping;
    t.wrapT = THREE.RepeatWrapping;
    return t;
  }, [textureUrl]);

  useFrame((_, delta) => {
    if (groupRef.current && autoRotate) groupRef.current.rotation.y += delta * 0.35;
  });

  const boxColor = color || '#f57c00'; // Orange like the ref

  const mat = (
    <meshPhysicalMaterial
      map={texture || undefined}
      color={texture ? '#ffffff' : boxColor}
      roughness={0.7}
      metalness={0.0}
      side={THREE.DoubleSide}
    />
  );

  const W = 1.6;
  const D = 1.2;
  const baseH = 0.4;
  const domeRadius = D / 2;

  // The dome roof (barrel vault)
  const domeGeo = useMemo(() => {
    // A half cylinder, rotated so it acts as an arched roof
    const geo = new THREE.CylinderGeometry(domeRadius, domeRadius, W, 32, 1, true, 0, Math.PI);
    geo.rotateZ(Math.PI / 2); // align along X axis
    return geo;
  }, [W, domeRadius]);

  // Handle sticking up from the top of the dome
  const handleGeo = useMemo(() => {
    const shape = new THREE.Shape();
    const hw = 0.4;
    const hh = 0.3;
    shape.moveTo(-hw, 0);
    shape.lineTo(hw, 0);
    shape.quadraticCurveTo(hw, hh, hw - 0.1, hh);
    shape.lineTo(-hw + 0.1, hh);
    shape.quadraticCurveTo(-hw, hh, -hw, 0);

    const hole = new THREE.Path();
    hole.moveTo(-0.2, 0.1);
    hole.lineTo(0.2, 0.1);
    hole.lineTo(0.2, 0.2);
    hole.lineTo(-0.2, 0.2);
    hole.lineTo(-0.2, 0.1);
    shape.holes.push(hole);

    return new THREE.ShapeGeometry(shape);
  }, []);

  return (
    <group ref={groupRef} position={[0, -(baseH + domeRadius)/2, 0]}>
      {/* Base Box */}
      <mesh scale={0.999} castShadow receiveShadow position={[0, baseH/2, 0]}>
        <boxGeometry args={[W, baseH, D]} />
        {mat}
      </mesh>

      {/* Arched Dome Roof */}
      <mesh scale={0.999} castShadow receiveShadow geometry={domeGeo} position={[0, baseH, 0]}>
        {mat}
      </mesh>
      
      {/* Semi-circular side covers for the dome (to seal it) */}
      <mesh scale={0.999} castShadow receiveShadow position={[-W/2, baseH, 0]} rotation={[0, -Math.PI/2, 0]}>
        <circleGeometry args={[domeRadius, 32, 0, Math.PI]} />
        {mat}
      </mesh>
      <mesh scale={0.999} castShadow receiveShadow position={[W/2, baseH, 0]} rotation={[0, Math.PI/2, 0]}>
        <circleGeometry args={[domeRadius, 32, 0, Math.PI]} />
        {mat}
      </mesh>

      {/* Handle */}
      <mesh scale={0.999} castShadow receiveShadow geometry={handleGeo} position={[0, baseH + domeRadius, 0]}>
        {mat}
      </mesh>
    </group>
  );
};
