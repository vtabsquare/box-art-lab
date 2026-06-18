/**
 * InjectionBox - Accurate 3D model for Injection Vial Box (10 vials)
 *
 * Architecture:
 *   - Base Carton (Tuck-end style, top open)
 *   - Main Top Flap (folded up)
 *   - Two Dust Flaps (folded in)
 *   - Inner Cardboard Dividers (2x5 grid)
 *   - 10 Glass Vials with metallic green caps and liquid level
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

export const InjectionBox = ({ color, autoRotate, textureUrl, bgTextureUrl, activeFaces }: Props) => {
  const groupRef = useRef<THREE.Group>(null!);
  const logoTex = useTexture(textureUrl || EMPTY_TEX);
  const bgTex = useTexture(bgTextureUrl || EMPTY_TEX);
  logoTex.colorSpace = THREE.SRGBColorSpace;
  bgTex.colorSpace = THREE.SRGBColorSpace;

  useFrame((_, dt) => {
    if (groupRef.current && autoRotate) groupRef.current.rotation.y += dt * 0.3;
  });

  const extC = color || '#ffffff'; // Classic pharma white
  const wallT = 0.02;

  const mInner = useMemo(() => new THREE.MeshPhysicalMaterial({ color: '#f5f5f5', roughness: 0.9 }), []);
  
  // Outer Materials array for proper texture mapping
  const extMaterials = useMemo(() => {
    return faceOrder.map(faceName => {
      const showLogo = !activeFaces || activeFaces[faceName] !== false;
      const activeTex = showLogo && textureUrl ? logoTex : (bgTextureUrl ? bgTex : null);
      return new THREE.MeshPhysicalMaterial({
        color: activeTex ? '#ffffff' : extC,
        map: activeTex,
        roughness: 0.6,
        clearcoat: 0.1
      });
    });
  }, [extC, textureUrl, bgTextureUrl, activeFaces, logoTex, bgTex]);

  // Vial Materials
  const mGlass = useMemo(() => new THREE.MeshPhysicalMaterial({ color: '#ffffff', transmission: 0.95, opacity: 1, roughness: 0.1, ior: 1.5, thickness: 0.05 }), []);
  const mLiquid = useMemo(() => new THREE.MeshPhysicalMaterial({ color: '#ffffff', transmission: 0.9, roughness: 0.1, ior: 1.33 }), []);
  const mCap = useMemo(() => new THREE.MeshPhysicalMaterial({ color: '#2ba879', roughness: 0.4, metalness: 0.6 }), []); // Green caps as in image
  const mRubber = useMemo(() => new THREE.MeshPhysicalMaterial({ color: '#dddddd', roughness: 0.9 }), []);

  // Dimensions
  const BW = 1.8;
  const BD = 0.8;
  const BH = 0.9;
  
  // Divider structure variables
  const innerW = BW - wallT * 2;
  const innerD = BD - wallT * 2;
  const divH = BH - 0.2; // Dividers don't go all the way to the top
  const colW = innerW / 5;
  const rowD = innerD / 2;

  // Grid centers for 10 vials
  const vialPositions = [];
  for (let r = 0; r < 2; r++) {
    for (let c = 0; c < 5; c++) {
      vialPositions.push({
        x: -innerW/2 + colW/2 + c * colW,
        z: -innerD/2 + rowD/2 + r * rowD
      });
    }
  }

  return (
    <group ref={groupRef} position={[0, -0.2, 0]} scale={[1.2, 1.2, 1.2]}>
      {/* ── CARTON BASE ──────────────────────────────────────────────────────── */}
      {/* Floor */}
      <mesh scale={0.999} position={[0, -BH / 2 + wallT / 2, 0]} castShadow receiveShadow material={[mInner, mInner, mInner, extMaterials[3], mInner, mInner]}>
        <boxGeometry args={[BW, wallT, BD]} />
      </mesh>
      {/* Front Wall */}
      <mesh scale={0.999} position={[0, 0, BD / 2 - wallT / 2]} castShadow receiveShadow material={[mInner, mInner, mInner, mInner, extMaterials[4], mInner]}>
        <boxGeometry args={[BW, BH, wallT]} />
      </mesh>
      {/* Back Wall */}
      <mesh scale={0.999} position={[0, 0, -BD / 2 + wallT / 2]} castShadow receiveShadow material={[mInner, mInner, mInner, mInner, mInner, extMaterials[5]]}>
        <boxGeometry args={[BW, BH, wallT]} />
      </mesh>
      {/* Left Wall */}
      <mesh scale={0.999} position={[-BW / 2 + wallT / 2, 0, 0]} castShadow receiveShadow material={[mInner, extMaterials[1], mInner, mInner, mInner, mInner]}>
        <boxGeometry args={[wallT, BH, BD]} />
      </mesh>
      {/* Right Wall */}
      <mesh scale={0.999} position={[BW / 2 - wallT / 2, 0, 0]} castShadow receiveShadow material={[extMaterials[0], mInner, mInner, mInner, mInner, mInner]}>
        <boxGeometry args={[wallT, BH, BD]} />
      </mesh>

      {/* ── TOP FLAPS (Open) ─────────────────────────────────────────────────── */}
      {/* Back main tuck flap (standing up, angled back slightly) */}
      <group position={[0, BH / 2, -BD / 2 + wallT / 2]} rotation={[-Math.PI * 0.15, 0, 0]}>
        <mesh scale={0.999} position={[0, BD / 2, 0]} castShadow receiveShadow material={[mInner, mInner, mInner, mInner, extMaterials[2], mInner]}>
          <boxGeometry args={[BW, BD, wallT]} />
        </mesh>
        {/* Tuck tab at the end of the main flap */}
        <mesh scale={0.999} position={[0, BD + 0.1, 0]} rotation={[-0.2, 0, 0]} castShadow receiveShadow material={[mInner, mInner, mInner, mInner, mInner, mInner]}>
          <boxGeometry args={[BW - 0.05, 0.2, wallT]} />
        </mesh>
      </group>

      {/* Left Dust Flap (folded slightly in) */}
      <group position={[-BW / 2 + wallT / 2, BH / 2, 0]} rotation={[0, 0, -Math.PI * 0.3]}>
        <mesh scale={0.999} position={[BD / 4, 0, 0]} castShadow receiveShadow material={[mInner, mInner, mInner, mInner, mInner, mInner]}>
          <boxGeometry args={[BD / 2, wallT, BD - 0.05]} />
        </mesh>
      </group>
      
      {/* Right Dust Flap (folded slightly in) */}
      <group position={[BW / 2 - wallT / 2, BH / 2, 0]} rotation={[0, 0, Math.PI * 0.3]}>
        <mesh scale={0.999} position={[-BD / 4, 0, 0]} castShadow receiveShadow material={[mInner, mInner, mInner, mInner, mInner, mInner]}>
          <boxGeometry args={[BD / 2, wallT, BD - 0.05]} />
        </mesh>
      </group>

      {/* ── INNER DIVIDERS ───────────────────────────────────────────────────── */}
      {/* Horizontal divider */}
      <mesh scale={0.999} position={[0, -BH/2 + divH/2 + wallT, 0]} receiveShadow>
        <boxGeometry args={[innerW, divH, wallT/2]} />
        <primitive object={mInner} />
      </mesh>

      {/* Vertical dividers (4 of them) */}
      {[1, 2, 3, 4].map((i) => (
        <mesh scale={0.999} key={`vdiv-${i}`} position={[-innerW/2 + i * colW, -BH/2 + divH/2 + wallT, 0]} receiveShadow>
          <boxGeometry args={[wallT/2, divH, innerD]} />
          <primitive object={mInner} />
        </mesh>
      ))}

      {/* ── VIALS ───────────────────────────────────────────────────────────── */}
      {vialPositions.map((pos, i) => (
        <group key={`vial-${i}`} position={[pos.x, -BH / 2 + 0.38, pos.z]}>
          {/* Glass Body */}
          <mesh scale={0.999} castShadow>
            <cylinderGeometry args={[0.13, 0.13, 0.7, 24]} />
            <primitive object={mGlass} />
          </mesh>
          {/* Liquid inside */}
          <mesh scale={0.999} position={[0, -0.1, 0]}>
            <cylinderGeometry args={[0.11, 0.11, 0.4, 24]} />
            <primitive object={mLiquid} />
          </mesh>
          {/* Aluminum Cap */}
          <mesh scale={0.999} position={[0, 0.37, 0]} castShadow>
            <cylinderGeometry args={[0.1, 0.1, 0.08, 24]} />
            <primitive object={mCap} />
          </mesh>
          {/* Rubber Stopper (visible at top hole) */}
          <mesh scale={0.999} position={[0, 0.41, 0]}>
            <cylinderGeometry args={[0.05, 0.05, 0.01, 16]} />
            <primitive object={mRubber} />
          </mesh>
        </group>
      ))}
    </group>
  );
};
