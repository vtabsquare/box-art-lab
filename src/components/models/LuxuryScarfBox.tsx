/**
 * LuxuryScarfBox - Magnetic Rigid Box
 *
 * Architecture:
 *   - Shallow rigid base tray
 *   - Wrapped cover hinged at the back, flipped open
 *   - Magnetic front flap folded down from the lid
 *   - Custom branding applied to both the outside and the inside lid
 */

import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useTexture } from '@react-three/drei';


const faceOrder = ['right', 'left', 'top', 'bottom', 'front', 'back'];
interface Props {
  color: string;
  autoRotate: boolean;
  textureUrl?: string | null;
  bgTextureUrl?: string | null;
  activeFaces?: Record<string, boolean>;
}

const EMPTY_TEX = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=';

export const LuxuryScarfBox = ({ color, autoRotate, textureUrl, bgTextureUrl, activeFaces }: Props) => {
  const groupRef = useRef<THREE.Group>(null!);
  const texture = useTexture(textureUrl || EMPTY_TEX);
  const bgTex = useTexture(bgTextureUrl || EMPTY_TEX);
  texture.colorSpace = THREE.SRGBColorSpace;
  bgTex.colorSpace = THREE.SRGBColorSpace;

  useFrame((_, dt) => {
    if (groupRef.current && autoRotate) groupRef.current.rotation.y += dt * 0.25;
  });

  const extC = color || '#1a1a1a'; // Dark luxury grey/black
  const wallT = 0.04;

  const mInner = useMemo(() => new THREE.MeshStandardMaterial({ color: '#2a2a2a', roughness: 0.95 }), []);
  const extMaterials = useMemo(() => {
    return faceOrder.map(faceName => {
      const showLogo = !activeFaces || activeFaces[faceName] !== false;
      const activeTex = showLogo && textureUrl ? texture : (bgTextureUrl ? bgTex : null);
      
      return new THREE.MeshStandardMaterial({
        color: activeTex ? '#ffffff' : extC,
        map: activeTex,
        roughness: 0.7,
      });
    });
  }, [extC, textureUrl, bgTextureUrl, activeFaces, texture, bgTex]);

  // Base tray dimensions
  const BW = 2.6;
  const BD = 1.7;
  const BH = 0.25;

  // Lid dimensions (slightly oversized to wrap the tray)
  const LW = BW + 0.06;
  const LD = BD + 0.06;

  return (
    <group ref={groupRef} position={[0, -0.2, 0]} scale={[1.1, 1.1, 1.1]}>
      {/* ── BASE TRAY ─────────────────────────────────────────────────────────── */}
      {/* Floor */}
      <mesh scale={0.999} position={[0, wallT / 2, 0]} castShadow receiveShadow material={[mInner, mInner, mInner, extMaterials[3], mInner, mInner]}>
        <boxGeometry args={[BW, wallT, BD]} />
      </mesh>
      
      {/* Left Wall */}
      <mesh scale={0.999} position={[-BW / 2 + wallT / 2, BH / 2 + wallT / 2, 0]} castShadow receiveShadow material={[mInner, extMaterials[1], mInner, mInner, mInner, mInner]}>
        <boxGeometry args={[wallT, BH, BD]} />
      </mesh>

      {/* Right Wall */}
      <mesh scale={0.999} position={[BW / 2 - wallT / 2, BH / 2 + wallT / 2, 0]} castShadow receiveShadow material={[extMaterials[0], mInner, mInner, mInner, mInner, mInner]}>
        <boxGeometry args={[wallT, BH, BD]} />
      </mesh>

      {/* Back Wall */}
      <mesh scale={0.999} position={[0, BH / 2 + wallT / 2, -BD / 2 + wallT / 2]} castShadow receiveShadow material={[mInner, mInner, mInner, mInner, mInner, extMaterials[5]]}>
        <boxGeometry args={[BW - wallT * 2, BH, wallT]} />
      </mesh>

      {/* Front Wall */}
      <mesh scale={0.999} position={[0, BH / 2 + wallT / 2, BD / 2 - wallT / 2]} castShadow receiveShadow material={[mInner, mInner, mInner, mInner, extMaterials[4], mInner]}>
        <boxGeometry args={[BW - wallT * 2, BH, wallT]} />
      </mesh>

      {/* ── COVER & LID (Magnetic style) ──────────────────────────────────────── */}
      {/* The cover wrap hinges exactly at the top outer corner of the back wall */}
      <group position={[0, BH + wallT / 2, -BD / 2 - 0.02]} rotation={[-1.9, 0, 0]}>
        
        {/* Main top lid panel */}
        {/* Inner face is -Y (index 3), Outer face is +Y (index 2) matching 'top' face */}
        <mesh scale={0.999} position={[0, 0, LD / 2]} castShadow receiveShadow material={[mInner, mInner, extMaterials[2], mInner, mInner, mInner]}>
          <boxGeometry args={[LW, wallT, LD]} />
        </mesh>

        {/* Inner Lid Logo - Prominently displayed like in luxury boxes */}
        {textureUrl && (
          <mesh scale={0.999} position={[0, -wallT / 2 - 0.001, LD / 2]} rotation={[Math.PI / 2, Math.PI, 0]}>
            <planeGeometry args={[LW * 0.8, LD * 0.8]} />
            <meshStandardMaterial color="#fff" map={texture} roughness={0.8} transparent />
          </mesh>
        )}

        {/* Magnetic Front Flap */}
        {/* Folds inwards dynamically towards the base tray */}
        <group position={[0, 0, LD]} rotation={[Math.PI / 2 - 0.1, 0, 0]}>
          {/* Inner face is -Y, Outer face is +Y (which maps to 'front' when closed) */}
          <mesh scale={0.999} position={[0, 0.2, 0]} castShadow receiveShadow material={[mInner, mInner, extMaterials[4], mInner, mInner, mInner]}>
            <boxGeometry args={[LW, 0.4, wallT]} />
          </mesh>
        </group>
        
      </group>

    </group>
  );
};
