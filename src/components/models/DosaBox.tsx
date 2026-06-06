import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface Props { color: string; autoRotate: boolean; textureUrl?: string | null; }

export const DosaBox = ({ color, autoRotate, textureUrl }: Props) => {
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

  const boxColor = color || '#cddc39'; // Lime/Yellow green from the ref

  const mat = (
    <meshPhysicalMaterial
      map={texture || undefined}
      color={texture ? '#ffffff' : boxColor}
      roughness={0.7}
      metalness={0.0}
    />
  );

  const W = 1.6;
  const D = 1.4;
  const H = 0.25;

  const geo = useMemo(() => {
    const shape = new THREE.Shape();
    
    // Start at back-left
    shape.moveTo(-W/2, -D/2);
    // Go to back-right
    shape.lineTo(W/2, -D/2);
    // Go to front-right (straight side)
    shape.lineTo(W/2, D/2 - 0.3);
    // Angled cut to front-center-right
    shape.lineTo(W/2 - 0.3, D/2);
    
    // Front edge with thumb notch in the middle
    shape.lineTo(0.1, D/2);
    // Thumb notch arc (semi-circle dipping inwards)
    shape.absarc(0, D/2, 0.1, 0, Math.PI, true);
    
    shape.lineTo(-W/2 + 0.3, D/2);
    // Angled cut to front-left
    shape.lineTo(-W/2, D/2 - 0.3);
    // Close shape (straight left side)
    shape.lineTo(-W/2, -D/2);

    const extrudeSettings = {
      steps: 1,
      depth: H,
      bevelEnabled: true,
      bevelThickness: 0.005,
      bevelSize: 0.005,
      bevelOffset: 0,
      bevelSegments: 2
    };

    const geometry = new THREE.ExtrudeGeometry(shape, extrudeSettings);
    // Center the geometry vertically
    geometry.translate(0, 0, -H/2);
    // Rotate to lie flat (Z becomes Y)
    geometry.rotateX(-Math.PI / 2);
    return geometry;
  }, [W, D, H]);

  return (
    <group ref={groupRef} position={[0, -0.05, 0]}>
      <mesh castShadow receiveShadow geometry={geo}>
        {mat}
      </mesh>
    </group>
  );
};
