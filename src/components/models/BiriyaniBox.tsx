import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface Props { color: string; autoRotate: boolean; textureUrl?: string | null; }

export const BiriyaniBox = ({ color, autoRotate, textureUrl }: Props) => {
  const groupRef = useRef<THREE.Group>(null!);

  const texture = useMemo(() => {
    if (!textureUrl) return null;
    const t = new THREE.TextureLoader().load(textureUrl);
    t.colorSpace = THREE.SRGBColorSpace;
    return t;
  }, [textureUrl]);

  useFrame((_, delta) => {
    if (groupRef.current && autoRotate) groupRef.current.rotation.y += delta * 0.3;
  });

  const sleeveColor = color || '#3e2723'; // Dark brown like the reference
  
  const sleeveMat = (
    <meshPhysicalMaterial
      map={texture || undefined}
      color={texture ? '#ffffff' : sleeveColor}
      roughness={0.6}
      metalness={0.1}
    />
  );
  
  const innerCardMat = (
    <meshPhysicalMaterial
      color="#e0e0e0"
      roughness={0.9}
    />
  );

  const W = 1.6;
  const D = 1.4;
  const H = 0.35;
  const bt = 0.015;

  // The tray slides out to the right (positive X)
  const slideOut = 0.5;

  return (
    <group ref={groupRef} position={[-slideOut / 2, 0, 0]}>
      
      {/* ════════ OUTER SLEEVE ════════ */}
      <group>
        {/* Top */}
        <mesh castShadow receiveShadow position={[0, H/2 - bt/2, 0]}>
          <boxGeometry args={[W, bt, D]} />
          {sleeveMat}
        </mesh>
        {/* Bottom */}
        <mesh castShadow receiveShadow position={[0, -H/2 + bt/2, 0]}>
          <boxGeometry args={[W, bt, D]} />
          {sleeveMat}
        </mesh>
        {/* Back */}
        <mesh castShadow receiveShadow position={[0, 0, -D/2 + bt/2]}>
          <boxGeometry args={[W, H, bt]} />
          {sleeveMat}
        </mesh>
        {/* Left Side (closed) */}
        <mesh castShadow receiveShadow position={[-W/2 + bt/2, 0, 0]}>
          <boxGeometry args={[bt, H, D]} />
          {sleeveMat}
        </mesh>
        
        {/* ════════ FLAPS ON THE RIGHT ════════ */}
        {/* Main top tuck flap (folded upwards and out) */}
        <mesh castShadow receiveShadow position={[W/2, H/2, 0]} rotation={[0, 0, -0.6]}>
          <boxGeometry args={[bt, 0.3, D]} />
          {sleeveMat}
        </mesh>
        {/* Front dust flap (folded outwards) */}
        <mesh castShadow receiveShadow position={[W/2, 0, D/2]} rotation={[0, -0.8, 0]}>
          <boxGeometry args={[0.2, H - bt*2, bt]} />
          {innerCardMat}
        </mesh>
        {/* Back dust flap (folded outwards) */}
        <mesh castShadow receiveShadow position={[W/2, 0, -D/2]} rotation={[0, 0.8, 0]}>
          <boxGeometry args={[0.2, H - bt*2, bt]} />
          {innerCardMat}
        </mesh>
      </group>

      {/* ════════ INNER TRAY ════════ */}
      <group position={[slideOut, 0, 0]}>
        {/* Tray Base */}
        <mesh castShadow receiveShadow position={[0, -H/2 + 0.02, 0]}>
          {/* Slightly smaller than sleeve */}
          <boxGeometry args={[W - 0.05, 0.02, D - 0.05]} />
          <meshStandardMaterial color="#f0f0f0" roughness={0.4} />
        </mesh>
        
        {/* Tray walls (angled slightly, simulating vacuum formed plastic) */}
        <mesh castShadow receiveShadow position={[0, 0, 0]}>
          <boxGeometry args={[W - 0.1, H - 0.08, D - 0.1]} />
          <meshStandardMaterial color="#fafafa" roughness={0.4} />
        </mesh>

        {/* Sealed foil/film on top */}
        <mesh receiveShadow position={[0, H/2 - 0.03, 0]} rotation={[-Math.PI/2, 0, 0]}>
          <planeGeometry args={[W - 0.05, D - 0.05]} />
          <meshPhysicalMaterial 
            color="#ffffff" 
            roughness={0.2} 
            metalness={0.1}
            clearcoat={1.0}
            clearcoatRoughness={0.1}
          />
        </mesh>
      </group>

    </group>
  );
};
