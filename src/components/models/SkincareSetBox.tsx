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
 * SkincareSetBox - A rigid hinged box (book style) with an insert tray.
 * Contains 3 empty cutouts for products, matching the reference image.
 */
export const SkincareSetBox = ({ color, autoRotate, textureUrl, bgTextureUrl, activeFaces }: Props) => {
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
        color: activeTex ? '#ffffff' : color || '#fdfdfc',
        map: activeTex,
        roughness: 0.6,
        metalness: 0.05,
        clearcoat: 0.1,
      });
    });
  }, [color, textureUrl, bgTextureUrl, activeFaces, texture, bgTex]);

  const BW = 2.8; // Length
  const BD = 2.0; // Width (depth)
  const BH = 1.0; // Height
  const wallT = 0.05; // Rigid board thickness

  // Generate foam insert geometry with cutouts
  const foamGeometry = useMemo(() => {
    const shape = new THREE.Shape();
    const w = BW - wallT * 2;
    const d = BD - wallT * 2;
    shape.moveTo(-w/2, -d/2);
    shape.lineTo(w/2, -d/2);
    shape.lineTo(w/2, d/2);
    shape.lineTo(-w/2, d/2);
    shape.lineTo(-w/2, -d/2);

    const createRoundRect = (x: number, y: number, width: number, height: number, r: number) => {
      const path = new THREE.Path();
      path.moveTo(x - width/2 + r, y - height/2);
      path.lineTo(x + width/2 - r, y - height/2);
      path.quadraticCurveTo(x + width/2, y - height/2, x + width/2, y - height/2 + r);
      path.lineTo(x + width/2, y + height/2 - r);
      path.quadraticCurveTo(x + width/2, y + height/2, x + width/2 - r, y + height/2);
      path.lineTo(x - width/2 + r, y + height/2);
      path.quadraticCurveTo(x - width/2, y + height/2, x - width/2, y + height/2 - r);
      path.lineTo(x - width/2, y - height/2 + r);
      path.quadraticCurveTo(x - width/2, y - height/2, x - width/2 + r, y - height/2);
      return path;
    };

    // 3 Cutouts
    shape.holes.push(createRoundRect(-0.8, 0, 0.5, 1.2, 0.1));
    shape.holes.push(createRoundRect(0, 0, 0.45, 0.9, 0.1));
    shape.holes.push(createRoundRect(0.8, 0, 0.5, 1.2, 0.1));

    return new THREE.ExtrudeGeometry(shape, { depth: 0.2, bevelEnabled: false });
  }, [BW, BD, wallT]);

  const mInner = useMemo(() => new THREE.MeshStandardMaterial({ color: '#fcfcfc', roughness: 0.9 }), []);

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

      {/* ── FOAM INSERT ── */}
      {/* Foam Top Surface with cutouts */}
      <mesh geometry={foamGeometry} material={mInner} position={[0, BH - 0.2, 0]} rotation={[Math.PI / 2, 0, 0]} receiveShadow />
      {/* Floor of the cutouts */}
      <mesh position={[0, BH - 0.4, 0]} receiveShadow>
        <boxGeometry args={[BW - wallT * 2, 0.05, BD - wallT * 2]} />
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
        <mesh scale={0.999} position={[0, -0.001, BD / 2]} receiveShadow>
          <boxGeometry args={[BW - 0.02, wallT, BD - 0.02]} />
          <primitive object={mInner} />
        </mesh>

        {/* Front Flap (Magnetic closure flap) */}
        {/* Attached to the front edge of the top panel (Z = BD), pointing down */}
        <mesh scale={0.999} material={materials} position={[0, -BH / 2 + wallT, BD + wallT / 2]} castShadow receiveShadow>
          <boxGeometry args={[BW, BH, wallT]} />
        </mesh>
        
        {/* Inner lining of the front flap */}
        <mesh scale={0.999} position={[0, -BH / 2 + wallT, BD - 0.001]} receiveShadow>
          <boxGeometry args={[BW - 0.02, BH - 0.02, wallT]} />
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
