import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface Props { color: string; autoRotate: boolean; textureUrl?: string | null; }

export const ChickenBox = ({ color, autoRotate, textureUrl }: Props) => {
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

  const boxColor = color || '#d84315'; 

  const mat = (
    <meshPhysicalMaterial
      map={texture || undefined}
      color={texture ? '#ffffff' : boxColor}
      roughness={0.8}
      metalness={0.0}
      side={THREE.DoubleSide}
    />
  );

  const W = 1.6;
  const D = 1.0;
  const baseH = 0.6;
  const roofH = 0.4;
  const handleH = 0.25;

  // Handle shape with a hole
  const handleGeo = useMemo(() => {
    const shape = new THREE.Shape();
    shape.moveTo(-W/2, 0);
    shape.lineTo(W/2, 0);
    shape.lineTo(W/2 - 0.1, handleH);
    shape.lineTo(-W/2 + 0.1, handleH);
    shape.lineTo(-W/2, 0);

    const hole = new THREE.Path();
    const hw = 0.3;
    const hh = 0.1;
    const hy = 0.08;
    hole.moveTo(-hw, hy);
    hole.lineTo(hw, hy);
    hole.lineTo(hw, hy + hh);
    hole.lineTo(-hw, hy + hh);
    hole.lineTo(-hw, hy);
    shape.holes.push(hole);

    return new THREE.ShapeGeometry(shape);
  }, [W, handleH]);

  // Roof slope angle
  const roofAngle = Math.atan2(D/2, roofH);
  const slopeLength = Math.sqrt(Math.pow(D/2, 2) + Math.pow(roofH, 2));

  return (
    <group ref={groupRef} position={[0, -(baseH + roofH)/2, 0]}>
      {/* Base Box */}
      <mesh castShadow receiveShadow position={[0, baseH/2, 0]}>
        <boxGeometry args={[W, baseH, D]} />
        {mat}
      </mesh>

      <group position={[0, baseH, 0]}>
        {/* Front Roof Slope */}
        <mesh castShadow receiveShadow position={[0, roofH/2, D/4]} rotation={[-roofAngle, 0, 0]}>
          <planeGeometry args={[W, slopeLength]} />
          {mat}
        </mesh>
        {/* Back Roof Slope */}
        <mesh castShadow receiveShadow position={[0, roofH/2, -D/4]} rotation={[roofAngle, 0, 0]}>
          <planeGeometry args={[W, slopeLength]} />
          {mat}
        </mesh>

        {/* Left Gable Triangle */}
        <mesh castShadow receiveShadow position={[-W/2, 0, 0]}>
          <bufferGeometry>
            <float32BufferAttribute 
              attach="attributes-position" 
              args={[new Float32Array([
                0, 0, D/2,
                0, 0, -D/2,
                0, roofH, 0
              ]), 3]} 
            />
          </bufferGeometry>
          {mat}
        </mesh>
        
        {/* Right Gable Triangle */}
        <mesh castShadow receiveShadow position={[W/2, 0, 0]}>
          <bufferGeometry>
            <float32BufferAttribute 
              attach="attributes-position" 
              args={[new Float32Array([
                0, 0, -D/2,
                0, 0, D/2,
                0, roofH, 0
              ]), 3]} 
            />
          </bufferGeometry>
          {mat}
        </mesh>

        {/* Top Handle */}
        <mesh castShadow receiveShadow geometry={handleGeo} position={[0, roofH, 0]}>
          {mat}
        </mesh>
      </group>
    </group>
  );
};
