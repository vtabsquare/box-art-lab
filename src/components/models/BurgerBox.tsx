import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface Props { color: string; autoRotate: boolean; textureUrl?: string | null; }

export const BurgerBox = ({ color, autoRotate, textureUrl }: Props) => {
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

  const boxColor = color || '#d7b586'; // Classic kraft brown
  
  const mat = (
    <meshPhysicalMaterial
      map={texture || undefined}
      color={texture ? '#ffffff' : boxColor}
      roughness={0.85}
      metalness={0.0}
      side={THREE.DoubleSide}
    />
  );
  
  const insideMat = (
    <meshPhysicalMaterial
      color="#e2c8a0"
      roughness={0.9}
      metalness={0.0}
      side={THREE.DoubleSide}
    />
  );

  // ── Dimensions ──
  const W_top = 1.1;
  const W_mid = 1.3;
  const W_bot = 1.0;
  
  const H_base = 0.45;
  const H_lid = 0.4;
  
  // To create a square frustum with CylinderGeometry:
  // radius = width * sqrt(2) / 2
  const R_top = W_top * Math.SQRT1_2;
  const R_mid = W_mid * Math.SQRT1_2;
  const R_bot = W_bot * Math.SQRT1_2;

  // Base geometry (wider at top, narrower at bottom)
  // openEnded = true so we can see inside
  const baseGeo = useMemo(() => {
    const geo = new THREE.CylinderGeometry(R_mid, R_bot, H_base, 4, 1, true);
    geo.rotateY(Math.PI / 4); // align flat sides with axes
    return geo;
  }, [R_mid, R_bot, H_base]);

  // Base floor
  const floorGeo = useMemo(() => {
    const geo = new THREE.PlaneGeometry(W_bot, W_bot);
    geo.rotateX(-Math.PI / 2);
    return geo;
  }, [W_bot]);

  // Lid geometry (narrower at top, wider at bottom)
  const lidGeo = useMemo(() => {
    const geo = new THREE.CylinderGeometry(R_top, R_mid, H_lid, 4, 1, true);
    geo.rotateY(Math.PI / 4);
    return geo;
  }, [R_top, R_mid, H_lid]);

  // Lid roof
  const roofGeo = useMemo(() => {
    const geo = new THREE.PlaneGeometry(W_top, W_top);
    geo.rotateX(-Math.PI / 2);
    return geo;
  }, [W_top]);

  // The lid hinges at the back edge of the base top.
  // Back edge of base top is at Z = -W_mid / 2, Y = H_base
  const hingeZ = -W_mid / 2;
  const lidOpenAngle = -0.5; // opens backward

  return (
    <group ref={groupRef} position={[0, -H_base/2, 0]}>
      
      {/* ════════ BASE ════════ */}
      <group position={[0, H_base/2, 0]}>
        {/* Outer Base Walls */}
        <mesh scale={0.999} castShadow receiveShadow geometry={baseGeo}>
          {mat}
        </mesh>
        {/* Inner Base Walls (slightly smaller to avoid z-fighting) */}
        <mesh geometry={baseGeo} scale={[0.99, 0.99, 0.99]}>
          {insideMat}
        </mesh>
        
        {/* Floor */}
        <mesh scale={0.999} castShadow receiveShadow geometry={floorGeo} position={[0, -H_base/2 + 0.005, 0]}>
          {insideMat}
        </mesh>
        <mesh scale={0.999} castShadow receiveShadow geometry={floorGeo} position={[0, -H_base/2, 0]}>
          {mat}
        </mesh>
        
        {/* Front locking tab (sticks out of base) */}
        <mesh scale={0.999} castShadow receiveShadow position={[0, H_base/2, W_mid/2 + 0.02]} rotation={[0.2, 0, 0]}>
          <planeGeometry args={[0.3, 0.15]} />
          {mat}
        </mesh>
      </group>

      {/* ════════ LID (Hinged) ════════ */}
      {/* Pivot point at back top edge of base */}
      <group position={[0, H_base, hingeZ]} rotation={[lidOpenAngle, 0, 0]}>
        {/* Offset lid so its back bottom edge is at the pivot */}
        <group position={[0, H_lid/2, W_mid/2]}>
          {/* Outer Lid Walls */}
          <mesh scale={0.999} castShadow receiveShadow geometry={lidGeo}>
            {mat}
          </mesh>
          {/* Inner Lid Walls */}
          <mesh geometry={lidGeo} scale={[0.99, 0.99, 0.99]}>
            {insideMat}
          </mesh>

          {/* Roof */}
          <mesh scale={0.999} castShadow receiveShadow geometry={roofGeo} position={[0, H_lid/2, 0]}>
            {mat}
          </mesh>
          <mesh scale={0.999} castShadow receiveShadow geometry={roofGeo} position={[0, H_lid/2 - 0.005, 0]}>
            {insideMat}
          </mesh>
          
          {/* Front lid flap (with slit) */}
          <mesh scale={0.999} castShadow receiveShadow position={[0, -H_lid/2 + 0.02, W_mid/2 + 0.02]} rotation={[0.4, 0, 0]}>
            <planeGeometry args={[0.5, 0.2]} />
            {mat}
          </mesh>
        </group>
      </group>

    </group>
  );
};
