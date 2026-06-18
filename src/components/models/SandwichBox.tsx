import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface Props { color: string; autoRotate: boolean; textureUrl?: string | null; }

export const SandwichBox = ({ color, autoRotate, textureUrl }: Props) => {
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

  const boxColor = color || '#212121'; // Dark color from ref

  const mat = (
    <meshPhysicalMaterial
      map={texture || undefined}
      color={texture ? '#ffffff' : boxColor}
      roughness={0.8}
      metalness={0.0}
    />
  );

  const W = 0.6; // Width (thickness of the sandwich)
  const D = 0.9; // Base depth
  const H = 1.4; // Height at the back

  // Create right triangle wedge
  const geo = useMemo(() => {
    const shape = new THREE.Shape();
    // Bottom left (back corner)
    shape.moveTo(-D/2, -H/2);
    // Bottom right (front corner)
    shape.lineTo(D/2, -H/2);
    // Top left (top back corner)
    shape.lineTo(-D/2, H/2);
    // Close back to bottom left (the hypotenuse handles the closing)
    shape.lineTo(-D/2, -H/2);

    const extrudeSettings = {
      steps: 1,
      depth: W,
      bevelEnabled: true,
      bevelThickness: 0.01,
      bevelSize: 0.01,
      bevelSegments: 2
    };

    const geometry = new THREE.ExtrudeGeometry(shape, extrudeSettings);
    // Center the extrusion depth (W) around Z axis
    geometry.translate(0, 0, -W/2);
    // Rotate to orient correctly:
    // Right now it's drawn in XY plane and extruded in Z.
    // We want the wedge to stand up. The shape is already standing up (height H along Y, depth D along X).
    // Let's just rotate it so the width W is along X, and depth D is along Z.
    geometry.rotateY(Math.PI / 2);
    return geometry;
  }, [W, D, H]);

  return (
    <group ref={groupRef} position={[0, -0.05, 0]}>
      {/* 
        A clean wedge shaped box.
      */}
      <mesh scale={0.999} castShadow receiveShadow geometry={geo}>
        {mat}
      </mesh>
    </group>
  );
};
