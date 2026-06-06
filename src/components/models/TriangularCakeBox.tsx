import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface Props { color: string; autoRotate: boolean; textureUrl?: string | null; }

export const TriangularCakeBox = ({ color, autoRotate, textureUrl }: Props) => {
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

  const boxColor = color || '#ffffff';

  const mat = (
    <meshPhysicalMaterial
      map={texture || undefined}
      color={texture ? '#ffffff' : boxColor}
      roughness={0.8}
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
      opacity={0.5}
      clearcoat={1.0}
    />
  );

  const W = 1.2; // Width of back edge
  const D = 1.4; // Depth from back edge to front tip
  const H = 0.6; // Height
  const bt = 0.02; // wall thickness
  const wBorder = 0.2; // window border thickness

  // 1. Walls Geometry
  const wallsGeo = useMemo(() => {
    const shape = new THREE.Shape();
    // Outer triangle
    shape.moveTo(-W/2, -D/2);
    shape.lineTo(W/2, -D/2);
    shape.lineTo(0, D/2);
    shape.lineTo(-W/2, -D/2);

    // Inner triangle (hole for hollow interior)
    const hole = new THREE.Path();
    // Move inner points inwards by 'bt'
    // For a sharp tip, we need to calculate exact inner offset, but approximation is fine here.
    hole.moveTo(-W/2 + bt + 0.05, -D/2 + bt);
    hole.lineTo(W/2 - bt - 0.05, -D/2 + bt);
    hole.lineTo(0, D/2 - bt - 0.05);
    hole.lineTo(-W/2 + bt + 0.05, -D/2 + bt);
    shape.holes.push(hole);

    const extrudeSettings = { depth: H, bevelEnabled: false };
    const geometry = new THREE.ExtrudeGeometry(shape, extrudeSettings);
    geometry.rotateX(Math.PI / 2); // Lay flat
    return geometry;
  }, [W, D, H, bt]);

  // 2. Base Floor Geometry
  const baseGeo = useMemo(() => {
    const shape = new THREE.Shape();
    shape.moveTo(-W/2, -D/2);
    shape.lineTo(W/2, -D/2);
    shape.lineTo(0, D/2);
    shape.lineTo(-W/2, -D/2);
    const geometry = new THREE.ShapeGeometry(shape);
    geometry.rotateX(Math.PI / 2); // Lay flat
    return geometry;
  }, [W, D]);

  // 3. Lid with Window Hole Geometry
  const lidGeo = useMemo(() => {
    const shape = new THREE.Shape();
    shape.moveTo(-W/2, -D/2);
    shape.lineTo(W/2, -D/2);
    shape.lineTo(0, D/2);
    shape.lineTo(-W/2, -D/2);

    // Window Hole
    const hole = new THREE.Path();
    hole.moveTo(-W/2 + wBorder + 0.05, -D/2 + wBorder);
    hole.lineTo(W/2 - wBorder - 0.05, -D/2 + wBorder);
    hole.lineTo(0, D/2 - wBorder - 0.05);
    hole.lineTo(-W/2 + wBorder + 0.05, -D/2 + wBorder);
    shape.holes.push(hole);

    const extrudeSettings = { depth: bt, bevelEnabled: false };
    const geometry = new THREE.ExtrudeGeometry(shape, extrudeSettings);
    geometry.rotateX(Math.PI / 2); // Lay flat
    return geometry;
  }, [W, D, bt, wBorder]);

  // 4. Window Glass Geometry
  const glassGeo = useMemo(() => {
    const shape = new THREE.Shape();
    shape.moveTo(-W/2 + wBorder + 0.02, -D/2 + wBorder);
    shape.lineTo(W/2 - wBorder - 0.02, -D/2 + wBorder);
    shape.lineTo(0, D/2 - wBorder - 0.02);
    shape.lineTo(-W/2 + wBorder + 0.02, -D/2 + wBorder);
    const geometry = new THREE.ShapeGeometry(shape);
    geometry.rotateX(-Math.PI / 2); // Lay flat facing up
    return geometry;
  }, [W, D, wBorder]);

  return (
    <group ref={groupRef} position={[0, -H/2, 0]}>
      {/* Base Floor */}
      <mesh castShadow receiveShadow geometry={baseGeo} position={[0, bt, 0]}>
        {mat}
      </mesh>
      
      {/* Walls */}
      <mesh castShadow receiveShadow geometry={wallsGeo} position={[0, H, 0]}>
        {mat}
      </mesh>

      {/* Lid with cutout */}
      <mesh castShadow receiveShadow geometry={lidGeo} position={[0, H + bt, 0]}>
        {mat}
      </mesh>

      {/* Glass Window */}
      <mesh geometry={glassGeo} position={[0, H - 0.01, 0]}>
        {glassMat}
      </mesh>
    </group>
  );
};
