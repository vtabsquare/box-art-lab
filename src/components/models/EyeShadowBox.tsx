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
 * EyeShadowBox - A flat palette box with a hinged cover.
 * Contains 12 circular pan cutouts (4 columns x 3 rows).
 */
export const EyeShadowBox = ({ color, autoRotate, textureUrl, bgTextureUrl, activeFaces }: Props) => {
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
        color: activeTex ? '#ffffff' : color || '#e8d4b4', // Golden/beige default
        map: activeTex,
        roughness: 0.6,
        metalness: 0.1,
        clearcoat: 0.1,
      });
    });
  }, [color, textureUrl, bgTextureUrl, activeFaces, texture, bgTex]);

  const BW = 2.2; // Length
  const BD = 1.4; // Width (depth)
  const BH = 0.3; // Height
  const wallT = 0.05; // Board thickness

  // Generate insert geometry with 12 circular cutouts
  const insertGeometry = useMemo(() => {
    const shape = new THREE.Shape();
    const w = BW - wallT * 2;
    const d = BD - wallT * 2;
    shape.moveTo(-w/2, -d/2);
    shape.lineTo(w/2, -d/2);
    shape.lineTo(w/2, d/2);
    shape.lineTo(-w/2, d/2);
    shape.lineTo(-w/2, -d/2);

    const cols = 4;
    const rows = 3;
    const paddingX = w * 0.15;
    const paddingY = d * 0.15;
    const spacingX = (w - paddingX * 2) / (cols - 1);
    const spacingY = (d - paddingY * 2) / (rows - 1);
    const r = Math.min(spacingX, spacingY) * 0.35;

    for (let i = 0; i < cols; i++) {
      for (let j = 0; j < rows; j++) {
        const cx = -w/2 + paddingX + i * spacingX;
        const cy = -d/2 + paddingY + j * spacingY;
        const hole = new THREE.Path();
        hole.absarc(cx, cy, r, 0, Math.PI * 2, false);
        shape.holes.push(hole);
      }
    }

    return new THREE.ExtrudeGeometry(shape, { depth: BH - wallT * 2, bevelEnabled: false });
  }, [BW, BD, BH, wallT]);

  // The inner tray material (same golden/beige tone)
  const mInner = useMemo(() => new THREE.MeshStandardMaterial({ color: color || '#d5ba91', roughness: 0.8 }), [color]);
  // The dark pans at the bottom of the holes
  const mPans = useMemo(() => new THREE.MeshStandardMaterial({ color: '#7b959c', roughness: 0.9 }), []);

  return (
    <group ref={groupRef} position={[0, -BH / 2, 0]}>
      {/* ── BASE TRAY ── */}
      {/* Bottom Floor */}
      <mesh scale={0.999} position={[0, wallT / 2, 0]} castShadow receiveShadow>
        <boxGeometry args={[BW - wallT * 2, wallT, BD - wallT * 2]} />
        <primitive object={mInner} />
      </mesh>
      
      {/* Dark layer underneath the insert to represent the pans */}
      <mesh scale={0.999} position={[0, wallT + 0.001, 0]} receiveShadow>
        <boxGeometry args={[BW - wallT * 2, 0.01, BD - wallT * 2]} />
        <primitive object={mPans} />
      </mesh>

      {/* Front Wall */}
      <mesh scale={0.999} material={materials} position={[0, BH / 2, BD / 2 - wallT / 2]} castShadow receiveShadow>
        <boxGeometry args={[BW, BH, wallT]} />
      </mesh>
      {/* Back Wall */}
      <mesh scale={0.999} material={materials} position={[0, BH / 2, -BD / 2 + wallT / 2]} castShadow receiveShadow>
        <boxGeometry args={[BW, BH, wallT]} />
      </mesh>
      {/* Left Wall */}
      <mesh scale={0.999} material={materials} position={[-BW / 2 + wallT / 2, BH / 2, 0]} castShadow receiveShadow>
        <boxGeometry args={[wallT, BH, BD]} />
      </mesh>
      {/* Right Wall */}
      <mesh scale={0.999} material={materials} position={[BW / 2 - wallT / 2, BH / 2, 0]} castShadow receiveShadow>
        <boxGeometry args={[wallT, BH, BD]} />
      </mesh>

      {/* ── FOAM/BOARD INSERT WITH HOLES ── */}
      <mesh geometry={insertGeometry} material={mInner} position={[0, BH - wallT, 0]} rotation={[Math.PI / 2, 0, 0]} receiveShadow castShadow />

      {/* ── HINGED LID ── */}
      {/* Attached at the top back edge, rotated fully open backwards (~130 degrees) */}
      <group position={[0, BH, -BD / 2]} rotation={[-Math.PI * 0.75, 0, 0]}>
        {/* The Lid Board */}
        <mesh scale={0.999} material={materials} position={[0, wallT / 2, BD / 2]} castShadow receiveShadow>
          <boxGeometry args={[BW, wallT, BD]} />
        </mesh>
        
        {/* Inner lining of the lid */}
        <mesh scale={0.999} position={[0, -0.001, BD / 2]} receiveShadow rotation={[Math.PI / 2, 0, 0]}>
          <planeGeometry args={[BW - 0.02, BD - 0.02]} />
          <primitive object={mInner} />
        </mesh>
      </group>
    </group>
  );
};
