import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface Props { color: string; autoRotate: boolean; textureUrl?: string | null; }

export const FrenchFriesBox = ({ color, autoRotate, textureUrl }: Props) => {
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

  const boxColor = color || '#e53935'; // Red

  const mat = (
    <meshPhysicalMaterial
      map={texture || undefined}
      color={texture ? '#ffffff' : boxColor}
      roughness={0.7}
      metalness={0.0}
      side={THREE.DoubleSide}
    />
  );
  
  const insideMat = (
    <meshPhysicalMaterial
      color="#f5f5f5" // White interior
      roughness={0.9}
      metalness={0.0}
      side={THREE.DoubleSide}
    />
  );

  const H = 1.0;
  const W_top = 1.0;
  const W_bot = 0.6;
  const D_top = 0.6;
  const D_bot = 0.4;
  const thickness = 0.02;

  // Front Panel (Concave Top)
  const frontGeo = useMemo(() => {
    const shape = new THREE.Shape();
    shape.moveTo(-W_bot/2, 0);
    shape.lineTo(W_bot/2, 0);
    shape.lineTo(W_top/2, H);
    // Concave dip in the middle
    shape.quadraticCurveTo(0, H - 0.2, -W_top/2, H);
    shape.lineTo(-W_bot/2, 0);
    
    return new THREE.ExtrudeGeometry(shape, { depth: thickness, bevelEnabled: false });
  }, [W_bot, W_top, H]);

  // Back Panel (Convex Arched Top)
  const backGeo = useMemo(() => {
    const shape = new THREE.Shape();
    shape.moveTo(-W_bot/2, 0);
    shape.lineTo(W_bot/2, 0);
    shape.lineTo(W_top/2, H);
    // Convex arch extending higher
    shape.quadraticCurveTo(0, H + 0.4, -W_top/2, H);
    shape.lineTo(-W_bot/2, 0);
    
    return new THREE.ExtrudeGeometry(shape, { depth: thickness, bevelEnabled: false });
  }, [W_bot, W_top, H]);

  // Side Panel (Trapezoid)
  const sideGeo = useMemo(() => {
    const shape = new THREE.Shape();
    shape.moveTo(-D_bot/2, 0);
    shape.lineTo(D_bot/2, 0);
    shape.lineTo(D_top/2, H);
    shape.lineTo(-D_top/2, H);
    shape.lineTo(-D_bot/2, 0);
    
    return new THREE.ExtrudeGeometry(shape, { depth: thickness, bevelEnabled: false });
  }, [D_bot, D_top, H]);

  // Bottom Panel
  const bottomGeo = useMemo(() => {
    return new THREE.PlaneGeometry(W_bot, D_bot);
  }, [W_bot, D_bot]);

  // Calculate side panel rotation angle to connect front and back
  const angleY = Math.atan2((W_top - W_bot)/2, H);

  return (
    <group ref={groupRef} position={[0, -H/2, 0]}>
      
      {/* Front Panel */}
      <mesh castShadow receiveShadow geometry={frontGeo} position={[0, 0, D_bot/2]} rotation={[0.1, 0, 0]}>
        {mat}
      </mesh>
      
      {/* Back Panel */}
      <mesh castShadow receiveShadow geometry={backGeo} position={[0, 0, -D_bot/2 - thickness]} rotation={[-0.1, 0, 0]}>
        {mat}
      </mesh>

      {/* Left Side */}
      <mesh castShadow receiveShadow geometry={sideGeo} position={[-W_bot/2, 0, 0]} rotation={[0, -Math.PI/2, 0.1]}>
        {mat}
      </mesh>

      {/* Right Side */}
      <mesh castShadow receiveShadow geometry={sideGeo} position={[W_bot/2, 0, 0]} rotation={[0, Math.PI/2, 0.1]}>
        {mat}
      </mesh>

      {/* Bottom */}
      <mesh castShadow receiveShadow geometry={bottomGeo} position={[0, 0, 0]} rotation={[-Math.PI/2, 0, 0]}>
        {insideMat}
      </mesh>
      
      {/* Inner white liner to represent the inside of the box */}
      <group scale={[0.98, 0.98, 0.98]} position={[0, 0.01, 0]}>
        <mesh geometry={frontGeo} position={[0, 0, D_bot/2]} rotation={[0.1, 0, 0]}>{insideMat}</mesh>
        <mesh geometry={backGeo} position={[0, 0, -D_bot/2 - thickness]} rotation={[-0.1, 0, 0]}>{insideMat}</mesh>
        <mesh geometry={sideGeo} position={[-W_bot/2, 0, 0]} rotation={[0, -Math.PI/2, 0.1]}>{insideMat}</mesh>
        <mesh geometry={sideGeo} position={[W_bot/2, 0, 0]} rotation={[0, Math.PI/2, 0.1]}>{insideMat}</mesh>
      </group>

    </group>
  );
};
