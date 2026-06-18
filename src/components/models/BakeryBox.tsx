import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface Props {
  color: string;
  autoRotate: boolean;
  textureUrl?: string | null;
}

export const BakeryBox = ({ color, autoRotate, textureUrl }: Props) => {
  const groupRef = useRef<THREE.Group>(null!);

  const texture = useMemo(() => {
    if (!textureUrl) return null;
    const t = new THREE.TextureLoader().load(textureUrl);
    t.colorSpace = THREE.SRGBColorSpace;
    return t;
  }, [textureUrl]);

  useFrame((_, delta) => {
    if (groupRef.current && autoRotate) {
      groupRef.current.rotation.y += delta * 0.35;
    }
  });

  const lidColor = color || '#f48fb1'; // default to a nice pink like the reference
  
  // Create a base color that is a nice complimentary green like the reference,
  // or a neutral cardboard if the user selected a custom color.
  // Actually, let's make it a nice fresh green if no color is selected, 
  // otherwise a pale cream so it always looks good with custom colors.
  const baseColor = color ? '#f5f0e6' : '#aed581'; 

  const lidMat = (
    <meshPhysicalMaterial
      map={texture || undefined}
      color={texture ? '#ffffff' : lidColor}
      roughness={0.7}
      metalness={0.0}
      side={THREE.DoubleSide}
    />
  );

  const baseMat = (
    <meshPhysicalMaterial
      color={baseColor}
      roughness={0.8}
      metalness={0.0}
    />
  );

  const W = 1.4;
  const D = 1.4;
  const H = 0.7;
  const flapH = 0.35;
  const numScallops = 5;

  const flapGeo = useMemo(() => {
    const shape = new THREE.Shape();
    const halfW = W / 2;
    shape.moveTo(-halfW, 0);
    shape.lineTo(-halfW, -flapH);
    
    const scallopW = W / numScallops;
    for (let i = 0; i < numScallops; i++) {
      const startX = -halfW + i * scallopW;
      const endX = startX + scallopW;
      const midX = startX + scallopW / 2;
      // Draw a nice rounded scallop arc
      shape.quadraticCurveTo(midX, -flapH - 0.12, endX, -flapH);
    }
    
    shape.lineTo(halfW, 0);
    shape.lineTo(-halfW, 0);
    
    // Add the small curved tuck slit in the center
    const hole = new THREE.Path();
    const holeY = -flapH + 0.04;
    const holeR = 0.06;
    hole.moveTo(-holeR, holeY);
    hole.quadraticCurveTo(0, holeY + 0.04, holeR, holeY);
    hole.quadraticCurveTo(0, holeY - 0.01, -holeR, holeY);
    shape.holes.push(hole);
    
    return new THREE.ShapeGeometry(shape);
  }, []);

  // Use ExtrudeGeometry for the top lid so it has slight thickness, or just a plane.
  // A plane is fine.
  const lidTopGeo = useMemo(() => new THREE.PlaneGeometry(W, D), []);

  return (
    <group ref={groupRef} position={[0, -H/2, 0]}>
      {/* ════════ BASE BOX ════════ */}
      <mesh scale={0.999} castShadow receiveShadow position={[0, H/2 - 0.01, 0]}>
        <boxGeometry args={[W - 0.04, H - 0.02, D - 0.04]} />
        {baseMat}
      </mesh>

      {/* ════════ LID ════════ */}
      <group position={[0, H, 0]}>
        {/* Top flat lid */}
        <mesh scale={0.999} castShadow receiveShadow geometry={lidTopGeo} rotation={[-Math.PI / 2, 0, 0]}>
          {lidMat}
        </mesh>

        {/* Front Scalloped Flap */}
        <mesh scale={0.999} castShadow receiveShadow geometry={flapGeo} position={[0, 0, D/2]}>
          {lidMat}
        </mesh>

        {/* Back Scalloped Flap */}
        <mesh scale={0.999} castShadow receiveShadow geometry={flapGeo} position={[0, 0, -D/2]} rotation={[0, Math.PI, 0]}>
          {lidMat}
        </mesh>

        {/* Left Scalloped Flap */}
        <mesh scale={0.999} castShadow receiveShadow geometry={flapGeo} position={[-W/2, 0, 0]} rotation={[0, -Math.PI / 2, 0]}>
          {lidMat}
        </mesh>

        {/* Right Scalloped Flap */}
        <mesh scale={0.999} castShadow receiveShadow geometry={flapGeo} position={[W/2, 0, 0]} rotation={[0, Math.PI / 2, 0]}>
          {lidMat}
        </mesh>
      </group>
    </group>
  );
};
