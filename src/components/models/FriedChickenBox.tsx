import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface Props { color: string; autoRotate: boolean; textureUrl?: string | null; }

export const FriedChickenBox = ({ color, autoRotate, textureUrl }: Props) => {
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

  const boxColor = color || '#00acc1'; // Cyan from ref image

  const mat = (
    <meshPhysicalMaterial
      map={texture || undefined}
      color={texture ? '#ffffff' : boxColor}
      roughness={0.8}
      metalness={0.0}
      side={THREE.DoubleSide}
    />
  );

  const W = 1.4;
  const D = 1.0;
  const baseH = 0.6;
  const roofH = 0.5;

  // The handle/roof flap is arched.
  const flapGeo = useMemo(() => {
    const shape = new THREE.Shape();
    // Start at bottom left
    shape.moveTo(-W/2, 0);
    // Draw straight up a little
    shape.lineTo(-W/2, roofH * 0.4);
    // Arch to the top center
    shape.quadraticCurveTo(-W/4, roofH, -0.15, roofH);
    // Handle top edge
    shape.lineTo(0.15, roofH);
    // Arch down to right
    shape.quadraticCurveTo(W/4, roofH, W/2, roofH * 0.4);
    // Straight down to bottom right
    shape.lineTo(W/2, 0);
    shape.lineTo(-W/2, 0);

    // Handle hole cutout
    const hole = new THREE.Path();
    const hh = 0.1;
    const hw = 0.2;
    const hy = roofH - 0.2;
    hole.moveTo(-hw, hy);
    hole.lineTo(hw, hy);
    hole.absarc(hw, hy + hh/2, hh/2, -Math.PI/2, Math.PI/2, false);
    hole.lineTo(-hw, hy + hh);
    hole.absarc(-hw, hy + hh/2, hh/2, Math.PI/2, Math.PI*1.5, false);
    shape.holes.push(hole);

    return new THREE.ShapeGeometry(shape);
  }, [W, roofH]);

  const roofAngle = Math.atan2(D/2, roofH);

  return (
    <group ref={groupRef} position={[0, -(baseH + roofH)/2, 0]}>
      {/* Base Box */}
      <mesh scale={0.999} castShadow receiveShadow position={[0, baseH/2, 0]}>
        <boxGeometry args={[W, baseH, D]} />
        {mat}
      </mesh>

      {/* Roof Flaps */}
      <group position={[0, baseH, 0]}>
        {/* Front Arched Flap */}
        <mesh scale={0.999} castShadow receiveShadow geometry={flapGeo} position={[0, 0, D/2]} rotation={[-roofAngle, 0, 0]}>
          {mat}
        </mesh>
        
        {/* Back Arched Flap */}
        <mesh scale={0.999} castShadow receiveShadow geometry={flapGeo} position={[0, 0, -D/2]} rotation={[roofAngle, 0, 0]}>
          {mat}
        </mesh>
        
        {/* Side locking triangles */}
        <mesh scale={0.999} castShadow receiveShadow position={[-W/2, 0, 0]}>
          <bufferGeometry>
            <float32BufferAttribute attach="attributes-position" args={[new Float32Array([
              0, 0, D/2,
              0, 0, -D/2,
              0, roofH * 0.6, 0
            ]), 3]} />
          </bufferGeometry>
          {mat}
        </mesh>
        <mesh scale={0.999} castShadow receiveShadow position={[W/2, 0, 0]}>
          <bufferGeometry>
            <float32BufferAttribute attach="attributes-position" args={[new Float32Array([
              0, 0, -D/2,
              0, 0, D/2,
              0, roofH * 0.6, 0
            ]), 3]} />
          </bufferGeometry>
          {mat}
        </mesh>
      </group>
    </group>
  );
};
