import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface Props { color: string; autoRotate: boolean; textureUrl?: string | null; }

export const CheeseBox = ({ color, autoRotate, textureUrl }: Props) => {
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

  const boxColor = color || '#fdd835'; // Yellow cheese color

  const mat = (
    <meshPhysicalMaterial
      map={texture || undefined}
      color={texture ? '#ffffff' : boxColor}
      roughness={0.7}
      metalness={0.0}
    />
  );

  const W = 1.4;
  const H = 1.4;
  const D = 0.4;

  const geo = useMemo(() => {
    const shape = new THREE.Shape();
    // Triangle pointing up
    shape.moveTo(0, H/2);
    shape.lineTo(-W/2, -H/2);
    shape.lineTo(W/2, -H/2);
    shape.lineTo(0, H/2);

    const extrudeSettings = {
      steps: 1,
      depth: D,
      bevelEnabled: true,
      bevelThickness: 0.01,
      bevelSize: 0.01,
      bevelOffset: 0,
      bevelSegments: 2
    };

    const geometry = new THREE.ExtrudeGeometry(shape, extrudeSettings);
    // Center the extrusion depth along Z
    geometry.translate(0, 0, -D/2);
    return geometry;
  }, [W, H, D]);

  return (
    <group ref={groupRef} position={[0, -0.1, 0]}>
      <mesh castShadow receiveShadow geometry={geo}>
        {mat}
      </mesh>
    </group>
  );
};
