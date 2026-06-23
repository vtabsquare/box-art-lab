import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useTexture } from '@react-three/drei';

interface Props {
  color: string;
  autoRotate: boolean;
  textureUrl?: string | null;
  bgTextureUrl?: string | null;
  activeFaces?: Record<string, boolean>;
}

const EMPTY_TEX = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=';
const faceOrder = ['right', 'left', 'top', 'bottom', 'front', 'back'];

export const SmartwatchBox = ({ color, autoRotate, textureUrl, bgTextureUrl, activeFaces }: Props) => {
  const groupRef = useRef<THREE.Group>(null!);
  const texture = useTexture(textureUrl || EMPTY_TEX);
  const bgTex = useTexture(bgTextureUrl || EMPTY_TEX);
  texture.colorSpace = THREE.SRGBColorSpace;
  bgTex.colorSpace = THREE.SRGBColorSpace;

  useFrame((_, dt) => {
    if (groupRef.current && autoRotate) groupRef.current.rotation.y += dt * 0.2;
  });

  const extC = color || '#fcfcfc'; // Default to white box like the image
  const wallT = 0.04;
  
  const mOuter = new THREE.MeshPhysicalMaterial({ color: extC, roughness: 0.6, clearcoat: 0.1 });
  const mInner = new THREE.MeshPhysicalMaterial({ color: '#f5f5f5', roughness: 0.8 }); 
  const mInsert = new THREE.MeshPhysicalMaterial({ color: '#eeeeee', roughness: 0.9 }); // Foam insert

  const materials = useMemo(() => {
    return faceOrder.map(faceName => {
      const showLogo = !activeFaces || activeFaces[faceName] !== false;
      const activeTex = showLogo && textureUrl ? texture : (bgTextureUrl ? bgTex : null);
      return new THREE.MeshPhysicalMaterial({
        color: activeTex ? '#ffffff' : extC,
        map: activeTex,
        roughness: 0.6,
      });
    });
  }, [extC, textureUrl, bgTextureUrl, activeFaces, texture, bgTex]);

  const BW = 1.0;
  const BD = 1.0;
  const BH_Tray = 0.6;
  const BH_Lid = 0.62;

  return (
    <group ref={groupRef} position={[0, -BH_Tray / 2, 0]} scale={[1.1, 1.1, 1.1]}>
      
      {/* ── BASE TRAY (Left) ────────────────────────────────────────────────── */}
      <group position={[-0.6, 0, 0]}>
        <mesh scale={0.999} position={[0, -BH_Tray / 2 + wallT / 2, 0]} castShadow>
          <boxGeometry args={[BW, wallT, BD]} />
          <primitive object={mInner} />
        </mesh>
        <mesh scale={0.999} position={[0, 0, BD / 2 - wallT / 2]} castShadow>
          <boxGeometry args={[BW, BH_Tray, wallT]} />
          <primitive object={mOuter} />
        </mesh>
        <mesh scale={0.999} position={[0, 0, -BD / 2 + wallT / 2]} castShadow>
          <boxGeometry args={[BW, BH_Tray, wallT]} />
          <primitive object={mOuter} />
        </mesh>
        <mesh scale={0.999} position={[-BW / 2 + wallT / 2, 0, 0]} castShadow>
          <boxGeometry args={[wallT, BH_Tray, BD]} />
          <primitive object={mOuter} />
        </mesh>
        <mesh scale={0.999} position={[BW / 2 - wallT / 2, 0, 0]} castShadow>
          <boxGeometry args={[wallT, BH_Tray, BD]} />
          <primitive object={mOuter} />
        </mesh>

        {/* ── FOAM INSERT (Without Watch) ───────────────────────────────────── */}
        <group position={[0, BH_Tray / 2 - 0.1, 0]}>
          {/* Floor of cutout */}
          <mesh position={[0, -0.2, 0]} receiveShadow>
             <boxGeometry args={[0.92, 0.05, 0.92]} />
             <primitive object={mInsert} />
          </mesh>
          {/* Top border Front */}
          <mesh position={[0, -0.05, 0.33]} receiveShadow>
             <boxGeometry args={[0.92, 0.25, 0.26]} />
             <primitive object={mInsert} />
          </mesh>
          {/* Top border Back */}
          <mesh position={[0, -0.05, -0.33]} receiveShadow>
             <boxGeometry args={[0.92, 0.25, 0.26]} />
             <primitive object={mInsert} />
          </mesh>
          {/* Top border Left */}
          <mesh position={[-0.33, -0.05, 0]} receiveShadow>
             <boxGeometry args={[0.26, 0.25, 0.4]} />
             <primitive object={mInsert} />
          </mesh>
          {/* Top border Right */}
          <mesh position={[0.33, -0.05, 0]} receiveShadow>
             <boxGeometry args={[0.26, 0.25, 0.4]} />
             <primitive object={mInsert} />
          </mesh>
        </group>
      </group>

      {/* ── LID (Right, facing up like a closed box next to it) ───────────── */}
      <group position={[0.6, (BH_Lid - BH_Tray) / 2, 0]}>
        {/* Top Roof (Lid Top) */}
        <mesh scale={0.999} position={[0, BH_Lid / 2 - wallT / 2, 0]} castShadow material={materials}>
          <boxGeometry args={[BW + 0.04, wallT, BD + 0.04]} />
        </mesh>
        {/* Front wall */}
        <mesh scale={0.999} position={[0, 0, (BD + 0.04) / 2 - wallT / 2]} castShadow material={materials}>
          <boxGeometry args={[BW + 0.04, BH_Lid, wallT]} />
        </mesh>
        {/* Back wall */}
        <mesh scale={0.999} position={[0, 0, -(BD + 0.04) / 2 + wallT / 2]} castShadow material={materials}>
          <boxGeometry args={[BW + 0.04, BH_Lid, wallT]} />
        </mesh>
        {/* Left wall */}
        <mesh scale={0.999} position={[-(BW + 0.04) / 2 + wallT / 2, 0, 0]} castShadow material={materials}>
          <boxGeometry args={[wallT, BH_Lid, BD + 0.04]} />
        </mesh>
        {/* Right wall */}
        <mesh scale={0.999} position={[(BW + 0.04) / 2 - wallT / 2, 0, 0]} castShadow material={materials}>
          <boxGeometry args={[wallT, BH_Lid, BD + 0.04]} />
        </mesh>
      </group>

    </group>
  );
};
