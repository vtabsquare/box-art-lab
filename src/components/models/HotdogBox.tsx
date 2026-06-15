import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface Props { color: string; autoRotate: boolean; textureUrl?: string | null; }

const ThickTrapezoid = ({ wTop, wBot, height, thickness, position, rotation, mat }: any) => {
  const geo = useMemo(() => {
    const shape = new THREE.Shape();
    shape.moveTo(-wBot/2, -height/2);
    shape.lineTo(wBot/2, -height/2);
    shape.lineTo(wTop/2, height/2);
    shape.lineTo(-wTop/2, height/2);
    shape.lineTo(-wBot/2, -height/2);

    const extrudeSettings = { steps: 1, depth: thickness, bevelEnabled: false };
    const g = new THREE.ExtrudeGeometry(shape, extrudeSettings);
    g.translate(0, 0, -thickness/2);
    return g;
  }, [wTop, wBot, height, thickness]);

  return (
    <mesh geometry={geo} position={position} rotation={rotation} castShadow receiveShadow>
      {mat}
    </mesh>
  );
};

export const HotdogBox = ({ color, autoRotate, textureUrl }: Props) => {
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

  const boxColor = color || '#c08a54'; 

  const mat = (
    <meshPhysicalMaterial
      map={texture || undefined}
      color={texture ? '#ffffff' : boxColor}
      roughness={0.9}
      metalness={0.1}
    />
  );

  const W_top = 2.6, W_bot = 2.2;
  const D_top = 1.4, D_bot = 1.0;
  const H_b = 0.45, H_l = 0.45;
  const bt = 0.02;

  const dz = (D_top - D_bot)/2;
  const len_f = Math.sqrt(H_b**2 + dz**2);
  const alpha = Math.atan2(dz, H_b);
  
  const dx = (W_top - W_bot)/2;
  const len_s = Math.sqrt(H_b**2 + dx**2);
  const beta = Math.atan2(dx, H_b);

  const z_f = (D_top + D_bot)/4;
  const x_s = (W_top + W_bot)/4;

  const lidOpenAngle = -2.0; 
  const lipSize = 0.08;
  const flapSize = 0.15;

  return (
    <group ref={groupRef} position={[0, -H_b/2, 0]}>
      {/* ════════ BASE ════════ */}
      <group>
        {/* Floor */}
        <mesh position={[0, bt/2, 0]} castShadow receiveShadow>
          <boxGeometry args={[W_bot, bt, D_bot]} />
          {mat}
        </mesh>
        
        {/* Walls */}
        <ThickTrapezoid wTop={W_top} wBot={W_bot} height={len_f} thickness={bt} position={[0, H_b/2, z_f]} rotation={[alpha, 0, 0]} mat={mat} />
        <ThickTrapezoid wTop={W_top} wBot={W_bot} height={len_f} thickness={bt} position={[0, H_b/2, -z_f]} rotation={[-alpha, 0, 0]} mat={mat} />
        <ThickTrapezoid wTop={D_top} wBot={D_bot} height={len_s} thickness={bt} position={[-x_s, H_b/2, 0]} rotation={[beta, -Math.PI/2, 0]} mat={mat} />
        <ThickTrapezoid wTop={D_top} wBot={D_bot} height={len_s} thickness={bt} position={[x_s, H_b/2, 0]} rotation={[beta, Math.PI/2, 0]} mat={mat} />

        {/* Base Lips */}
        <mesh position={[0, H_b, D_top/2 + lipSize/2]} castShadow receiveShadow>
          <boxGeometry args={[W_top + lipSize*2, bt, lipSize]} />
          {mat}
        </mesh>
        <mesh position={[-W_top/2 - lipSize/2, H_b, 0]} castShadow receiveShadow>
          <boxGeometry args={[lipSize, bt, D_top]} />
          {mat}
        </mesh>
        <mesh position={[W_top/2 + lipSize/2, H_b, 0]} castShadow receiveShadow>
          <boxGeometry args={[lipSize, bt, D_top]} />
          {mat}
        </mesh>
      </group>

      {/* ════════ LID (Hinged at back edge) ════════ */}
      <group position={[0, H_b, -D_top/2]} rotation={[lidOpenAngle, 0, 0]}>
        <group position={[0, 0, D_top/2]}>
          
          {/* Ceiling */}
          <mesh position={[0, H_l - bt/2, 0]} castShadow receiveShadow>
            <boxGeometry args={[W_bot, bt, D_bot]} />
            {mat}
          </mesh>

          {/* Lid Walls */}
          <ThickTrapezoid wTop={W_bot} wBot={W_top} height={len_f} thickness={bt} position={[0, H_l/2, z_f]} rotation={[-alpha, 0, 0]} mat={mat} />
          <ThickTrapezoid wTop={W_bot} wBot={W_top} height={len_f} thickness={bt} position={[0, H_l/2, -z_f]} rotation={[alpha, 0, 0]} mat={mat} />
          <ThickTrapezoid wTop={D_bot} wBot={D_top} height={len_s} thickness={bt} position={[-x_s, H_l/2, 0]} rotation={[-beta, -Math.PI/2, 0]} mat={mat} />
          <ThickTrapezoid wTop={D_bot} wBot={D_top} height={len_s} thickness={bt} position={[x_s, H_l/2, 0]} rotation={[-beta, Math.PI/2, 0]} mat={mat} />

          {/* Lid Flaps */}
          <group position={[0, 0, D_top/2]} rotation={[Math.PI * 0.1, 0, 0]}>
            <mesh position={[0, -flapSize/2, bt/2]} castShadow receiveShadow>
              <boxGeometry args={[W_top * 0.6, flapSize, bt]} />
              {mat}
            </mesh>
          </group>

          <group position={[-W_top/2, 0, 0]} rotation={[0, 0, Math.PI * 0.1]}>
             <mesh position={[-bt/2, -flapSize/2, 0]} castShadow receiveShadow>
               <boxGeometry args={[bt, flapSize, D_top * 0.4]} />
               {mat}
             </mesh>
          </group>

          <group position={[W_top/2, 0, 0]} rotation={[0, 0, -Math.PI * 0.1]}>
             <mesh position={[bt/2, -flapSize/2, 0]} castShadow receiveShadow>
               <boxGeometry args={[bt, flapSize, D_top * 0.4]} />
               {mat}
             </mesh>
          </group>

        </group>
      </group>

    </group>
  );
};
