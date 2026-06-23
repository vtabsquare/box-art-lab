import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { useTexture } from '@react-three/drei';
import * as THREE from 'three';

const faceOrder = ['right', 'left', 'top', 'bottom', 'front', 'back'];

interface Props {
  color: string;
  autoRotate: boolean;
  textureUrl?: string | null;
  bgTextureUrl?: string | null;
  activeFaces?: Record<string, boolean>;
}

/**
 * HairCareBox - An empty rigid hinged box (book style).
 * Based on the reference image, it's a wide, shallow box with a flip-open magnetic lid.
 */
export const HairCareBox = ({ color, autoRotate, textureUrl, bgTextureUrl, activeFaces }: Props) => {
  const groupRef = useRef<THREE.Group>(null!);
  const EMPTY = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=';
  const texture = useTexture(textureUrl || EMPTY);
  const bgTex = useTexture(bgTextureUrl || EMPTY);
  texture.colorSpace = THREE.SRGBColorSpace;
  bgTex.colorSpace = THREE.SRGBColorSpace;

  useFrame((_, delta) => {
    if (groupRef.current && autoRotate) groupRef.current.rotation.y += delta * 0.15;
  });

  const materials = useMemo(() => {
    return faceOrder.map(faceName => {
      const showLogo = !activeFaces || activeFaces[faceName] !== false;
      const activeTex = showLogo && textureUrl ? texture : (bgTextureUrl ? bgTex : null);
      return new THREE.MeshPhysicalMaterial({
        color: activeTex ? '#ffffff' : color || '#1a1a1a', // Dark default as per reference
        map: activeTex,
        roughness: 0.6,
        metalness: 0.05,
        clearcoat: 0.1,
      });
    });
  }, [color, textureUrl, bgTextureUrl, activeFaces, texture, bgTex]);

  const BW = 2.5; // Length
  const BD = 2.5; // Width (depth)
  const BH = 0.8; // Height
  const wallT = 0.05; // Rigid board thickness

  // Gold/Brown inner lining matching the reference image
  const mInner = useMemo(() => new THREE.MeshStandardMaterial({ color: '#b59a68', roughness: 0.8 }), []);

  return (
    <group ref={groupRef} position={[0, -BH / 2, 0]}>
      {/* ── BASE TRAY ── */}
      {/* Bottom Floor */}
      <mesh scale={0.999} position={[0, wallT / 2, 0]} castShadow receiveShadow>
        <boxGeometry args={[BW - wallT * 2, wallT, BD - wallT * 2]} />
        <primitive object={mInner} />
      </mesh>
      {/* Front Wall */}
      <mesh scale={0.999} material={materials} position={[0, BH / 2, BD / 2 - wallT / 2]} castShadow receiveShadow>
        <boxGeometry args={[BW, BH, wallT]} />
      </mesh>
      {/* Inner Front Wall */}
      <mesh scale={0.999} position={[0, BH / 2, BD / 2 - wallT + 0.001]} receiveShadow rotation={[0, Math.PI, 0]}>
        <planeGeometry args={[BW - wallT * 2, BH]} />
        <primitive object={mInner} />
      </mesh>

      {/* Back Wall */}
      <mesh scale={0.999} material={materials} position={[0, BH / 2, -BD / 2 + wallT / 2]} castShadow receiveShadow>
        <boxGeometry args={[BW, BH, wallT]} />
      </mesh>
      {/* Inner Back Wall */}
      <mesh scale={0.999} position={[0, BH / 2, -BD / 2 + wallT - 0.001]} receiveShadow>
        <planeGeometry args={[BW - wallT * 2, BH]} />
        <primitive object={mInner} />
      </mesh>

      {/* Left Wall */}
      <mesh scale={0.999} material={materials} position={[-BW / 2 + wallT / 2, BH / 2, 0]} castShadow receiveShadow>
        <boxGeometry args={[wallT, BH, BD]} />
      </mesh>
      {/* Inner Left Wall */}
      <mesh scale={0.999} position={[-BW / 2 + wallT - 0.001, BH / 2, 0]} receiveShadow rotation={[0, Math.PI / 2, 0]}>
        <planeGeometry args={[BD - wallT * 2, BH]} />
        <primitive object={mInner} />
      </mesh>

      {/* Right Wall */}
      <mesh scale={0.999} material={materials} position={[BW / 2 - wallT / 2, BH / 2, 0]} castShadow receiveShadow>
        <boxGeometry args={[wallT, BH, BD]} />
      </mesh>
      {/* Inner Right Wall */}
      <mesh scale={0.999} position={[BW / 2 - wallT + 0.001, BH / 2, 0]} receiveShadow rotation={[0, -Math.PI / 2, 0]}>
        <planeGeometry args={[BD - wallT * 2, BH]} />
        <primitive object={mInner} />
      </mesh>


      {/* ── HINGED LID COVER ── */}
      {/* Attached at the top back edge, rotated open like a laptop */}
      <group position={[0, BH, -BD / 2]} rotation={[-Math.PI * 0.4, 0, 0]}>
        {/* Top Panel (Lid Roof) */}
        <mesh scale={0.999} material={materials} position={[0, wallT / 2, BD / 2]} castShadow receiveShadow>
          <boxGeometry args={[BW, wallT, BD]} />
        </mesh>
        
        {/* Inner lining of the top panel */}
        <mesh scale={0.999} position={[0, -0.001, BD / 2]} receiveShadow rotation={[Math.PI / 2, 0, 0]}>
          <planeGeometry args={[BW - 0.02, BD - 0.02]} />
          <primitive object={mInner} />
        </mesh>

        {/* Front Flap (Magnetic closure flap) */}
        {/* Attached to the front edge of the top panel (Z = BD), pointing down */}
        <mesh scale={0.999} material={materials} position={[0, -BH / 2 + wallT, BD + wallT / 2]} castShadow receiveShadow>
          <boxGeometry args={[BW, BH, wallT]} />
        </mesh>
        
        {/* Inner lining of the front flap */}
        <mesh scale={0.999} position={[0, -BH / 2 + wallT, BD - 0.001]} receiveShadow rotation={[0, Math.PI, 0]}>
          <planeGeometry args={[BW - 0.02, BH - 0.02]} />
          <primitive object={mInner} />
        </mesh>
      </group>
      
      {/* Outer Back Cover Panel (Fixed back piece of the cover) */}
      <mesh scale={0.999} material={materials} position={[0, BH / 2, -BD / 2 - wallT / 2]} castShadow receiveShadow>
        <boxGeometry args={[BW, BH, wallT]} />
      </mesh>

    </group>
  );
};
