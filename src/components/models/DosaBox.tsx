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
    if (groupRef.current && autoRotate) groupRef.current.rotation.y += delta * 0.25;
  });

  const boxColor = color || '#a07855'; // Kraft brown color

  const mat = (
    <meshPhysicalMaterial
      map={texture || undefined}
      color={texture ? '#ffffff' : boxColor}
      roughness={0.9}
      metalness={0.1}
    />
  );

  const W = 3.0;
  const D = 0.7;
  const H = 0.4;
  const bt = 0.02;

  const flapLen = D * 0.85;
  const flapH = H * 0.6;
  
  const flapGeo = useMemo(() => {
    const s = new THREE.Shape();
    s.moveTo(0, 0); 
    s.lineTo(flapLen, 0); 
    s.lineTo(flapLen, -flapH * 0.3); 
    s.lineTo(flapLen + 0.08, -flapH * 0.3); 
    s.lineTo(flapLen + 0.08, -flapH * 0.6); 
    s.lineTo(flapLen - 0.05, -flapH); 
    s.lineTo(0.1, -flapH); 
    s.lineTo(0, -flapH * 0.5); 
    s.lineTo(0, 0); 
    
    const geo = new THREE.ExtrudeGeometry(s, { depth: bt, bevelEnabled: false });
    geo.translate(-flapLen/2, 0, -bt/2);
    return geo;
  }, [D, H, bt, flapLen, flapH]);

  return (
    <group ref={groupRef} position={[0, -H/2, 0]}>
      {/* ════════ BASE ════════ */}
      <mesh scale={0.999} castShadow receiveShadow position={[0, bt/2, 0]}>
        <boxGeometry args={[W, bt, D]} />
        {mat}
      </mesh>

      {/* ════════ WALLS ════════ */}
      {/* Back */}
      <mesh scale={0.999} castShadow receiveShadow position={[0, H/2, -D/2 + bt/2]}>
        <boxGeometry args={[W, H, bt]} />
        {mat}
      </mesh>
      {/* Front */}
      <mesh scale={0.999} castShadow receiveShadow position={[0, H/2, D/2 - bt/2]}>
        <boxGeometry args={[W, H, bt]} />
        {mat}
      </mesh>
      {/* Left */}
      <mesh scale={0.999} castShadow receiveShadow position={[-W/2 + bt/2, H/2, 0]}>
        <boxGeometry args={[bt, H, D - bt*2]} />
        {mat}
      </mesh>
      {/* Right */}
      <mesh scale={0.999} castShadow receiveShadow position={[W/2 - bt/2, H/2, 0]}>
        <boxGeometry args={[bt, H, D - bt*2]} />
        {mat}
      </mesh>

      {/* ════════ LID ════════ */}
      {/* Hinge at top of back wall */}
      <group position={[0, H - bt/2, -D/2 + bt/2]} rotation={[-Math.PI * 0.35, 0, 0]}>
        
        {/* Lid Main Panel */}
        <mesh scale={0.999} castShadow receiveShadow position={[0, bt/2, D/2]}>
          <boxGeometry args={[W, bt, D]} />
          {mat}
        </mesh>

        {/* Front Tuck-in Flap */}
        <group position={[0, bt/2, D]} rotation={[Math.PI * 0.45, 0, 0]}>
          <mesh scale={0.999} castShadow receiveShadow position={[0, -H * 0.25, bt/2]}>
            <boxGeometry args={[W - 0.04, H * 0.5, bt]} />
            {mat}
          </mesh>
        </group>

        {/* Left Side Flap */}
        <group position={[-W/2, bt/2, D/2]} rotation={[0, -Math.PI/2, 0]}>
          {/* Negative rotation to fold inwards */}
          <group rotation={[-Math.PI * 0.45, 0, 0]}>
            <mesh scale={0.999} castShadow receiveShadow geometry={flapGeo}>
              {mat}
            </mesh>
          </group>
        </group>

        {/* Right Side Flap */}
        <group position={[W/2, bt/2, D/2]} rotation={[0, -Math.PI/2, 0]}>
          {/* Positive rotation to fold inwards */}
          <group rotation={[Math.PI * 0.45, 0, 0]}>
            <mesh scale={0.999} castShadow receiveShadow geometry={flapGeo}>
              {mat}
            </mesh>
          </group>
        </group>
      </group>
      
      {/* Inner Floor for contrast */}
      <mesh scale={0.999} receiveShadow position={[0, bt + 0.001, 0]} rotation={[-Math.PI/2, 0, 0]}>
        <planeGeometry args={[W - bt*2, D - bt*2]} />
        <meshPhysicalMaterial color="#8b5a2b" roughness={1} metalness={0} />
      </mesh>

    </group>
  );
};
