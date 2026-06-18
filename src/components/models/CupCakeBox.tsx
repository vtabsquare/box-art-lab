import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface Props { color: string; autoRotate: boolean; textureUrl?: string | null; }

export const CupCakeBox = ({ color, autoRotate, textureUrl }: Props) => {
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

  const boxColor = color || '#fbc02d'; // Yellow
  
  const mat = (
    <meshPhysicalMaterial
      map={texture || undefined}
      color={texture ? '#ffffff' : boxColor}
      roughness={0.7}
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

  const W = 1.0;
  const D = 1.0;
  const H = 1.0;
  const bt = 0.02;

  return (
    <group ref={groupRef} position={[0, -H/2, 0]}>
      {/* Box Base (Bottom, Back, Left, Right) */}
      <mesh scale={0.999} castShadow receiveShadow position={[0, bt/2, 0]}>
        <boxGeometry args={[W, bt, D]} />
        {mat}
      </mesh>
      <mesh scale={0.999} castShadow receiveShadow position={[0, H/2, -D/2 + bt/2]}>
        <boxGeometry args={[W, H, bt]} />
        {mat}
      </mesh>
      <mesh scale={0.999} castShadow receiveShadow position={[-W/2 + bt/2, H/2, 0]}>
        <boxGeometry args={[bt, H, D]} />
        {mat}
      </mesh>
      <mesh scale={0.999} castShadow receiveShadow position={[W/2 - bt/2, H/2, 0]}>
        <boxGeometry args={[bt, H, D]} />
        {mat}
      </mesh>
      <mesh scale={0.999} castShadow receiveShadow position={[0, H/2, D/2 - bt/2]}>
        <boxGeometry args={[W, H, bt]} />
        {mat}
      </mesh>

      {/* Top Lid with Window Cutout */}
      <group position={[0, H - bt/2, 0]}>
        {/* Frame borders */}
        <mesh scale={0.999} castShadow receiveShadow position={[0, 0, -D/2 + 0.15]}>
          <boxGeometry args={[W, bt, 0.3]} />
          {mat}
        </mesh>
        <mesh scale={0.999} castShadow receiveShadow position={[0, 0, D/2 - 0.15]}>
          <boxGeometry args={[W, bt, 0.3]} />
          {mat}
        </mesh>
        <mesh scale={0.999} castShadow receiveShadow position={[-W/2 + 0.15, 0, 0]}>
          <boxGeometry args={[0.3, bt, D - 0.6]} />
          {mat}
        </mesh>
        <mesh scale={0.999} castShadow receiveShadow position={[W/2 - 0.15, 0, 0]}>
          <boxGeometry args={[0.3, bt, D - 0.6]} />
          {mat}
        </mesh>
        {/* Clear Window */}
        <mesh scale={0.999} position={[0, 0, 0]} rotation={[-Math.PI/2, 0, 0]}>
          <planeGeometry args={[W - 0.6, D - 0.6]} />
          {glassMat}
        </mesh>
      </group>

      {/* Insert tray holding the cupcake */}
      <mesh scale={0.999} castShadow receiveShadow position={[0, 0.1, 0]}>
        <boxGeometry args={[W - 0.05, 0.2, D - 0.05]} />
        <meshStandardMaterial color="#ffffff" roughness={0.9} />
      </mesh>
      
      {/* ════════ CUPCAKE ════════ */}
      <group position={[0, 0.2, 0]}>
        {/* Wrapper */}
        <mesh scale={0.999} castShadow receiveShadow position={[0, 0.15, 0]}>
          <cylinderGeometry args={[0.22, 0.15, 0.3, 16]} />
          <meshStandardMaterial color="#4e342e" roughness={0.8} />
        </mesh>
        {/* Cake dome */}
        <mesh scale={0.999} castShadow receiveShadow position={[0, 0.3, 0]}>
          <sphereGeometry args={[0.22, 16, 16, 0, Math.PI * 2, 0, Math.PI/2]} />
          <meshStandardMaterial color="#8d6e63" roughness={0.9} />
        </mesh>
        {/* Frosting swirl */}
        <mesh scale={0.999} castShadow receiveShadow position={[0, 0.4, 0]}>
          <torusKnotGeometry args={[0.12, 0.06, 64, 8, 2, 3]} />
          <meshStandardMaterial color={color || '#fbc02d'} roughness={0.3} />
        </mesh>
        {/* Cherry/Chocolate ball on top */}
        <mesh scale={0.999} castShadow position={[0, 0.6, 0]}>
          <sphereGeometry args={[0.06, 16, 16]} />
          <meshPhysicalMaterial color="#3e2723" roughness={0.2} metalness={0.1} />
        </mesh>
      </group>

    </group>
  );
};
