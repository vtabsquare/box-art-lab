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
 * Garment Box — A flat, wide box with a separate telescoping lid
 * that sits on top. Lid is slightly lifted to show it's removable.
 * Proportions: wide (L) × medium (W) × shallow (H)
 */
export const GarmentBox = ({ color, autoRotate, textureUrl, bgTextureUrl, activeFaces }: Props) => {
  const groupRef = useRef<THREE.Group>(null!);
  const texture = useTexture(textureUrl || 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=');
  const bgTex = useTexture(bgTextureUrl || 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=');
  texture.colorSpace = THREE.SRGBColorSpace;
  bgTex.colorSpace = THREE.SRGBColorSpace;

  useFrame((_, delta) => {
    if (groupRef.current && autoRotate) groupRef.current.rotation.y += delta * 0.3;
  });

  // Box dimensions (normalized units)
  const W = 1.6;   // width (x)
  const H = 0.35;  // base height (y)
  const D = 1.1;   // depth (z)
  const lidH = 0.12; // lid height
  const lidGap = 0.06; // gap between base top and lid bottom
  const wall = 0.025;  // wall thickness
  const baseMaterials = useMemo(() => {
    return faceOrder.map(faceName => {
      const showLogo = !activeFaces || activeFaces[faceName] !== false;
      const activeTex = showLogo && textureUrl ? texture : (bgTextureUrl ? bgTex : null);
      return new THREE.MeshPhysicalMaterial({
        color: activeTex ? '#ffffff' : color || '#888888',
        map: activeTex,
        roughness: 0.55,
        metalness: 0.0,
      });
    });
  }, [color, textureUrl, bgTextureUrl, activeFaces, texture, bgTex]);

  const lidMaterials = useMemo(() => {
    return faceOrder.map(faceName => {
      const showLogo = !activeFaces || activeFaces[faceName] !== false;
      const activeTex = showLogo && textureUrl ? texture : (bgTextureUrl ? bgTex : null);
      return new THREE.MeshPhysicalMaterial({
        color: activeTex ? '#ffffff' : color || '#888888',
        map: activeTex,
        roughness: 0.5,
        metalness: 0.02,
      });
    });
  }, [color, textureUrl, bgTextureUrl, activeFaces, texture, bgTex]);

  const innerMat = new THREE.MeshStandardMaterial({ color: '#f5f0e8', roughness: 0.6 });

  const baseY = 0; // base center-Y

  return (
    <group ref={groupRef} position={[0, -(H + lidH + lidGap) / 2, 0]}>
      {/* ── Base tray ── */}
      {/* Bottom */}
      <mesh scale={0.999} castShadow receiveShadow position={[0, wall / 2, 0]} material={baseMaterials}>
        <boxGeometry args={[W, wall, D]} />
      </mesh>
      {/* Front wall */}
      <mesh scale={0.999} castShadow position={[0, H / 2, D / 2 - wall / 2]} material={baseMaterials}>
        <boxGeometry args={[W, H, wall]} />
      </mesh>
      {/* Back wall */}
      <mesh scale={0.999} castShadow position={[0, H / 2, -(D / 2 - wall / 2)]} material={baseMaterials}>
        <boxGeometry args={[W, H, wall]} />
      </mesh>
      {/* Left wall */}
      <mesh scale={0.999} castShadow position={[-(W / 2 - wall / 2), H / 2, 0]} material={baseMaterials}>
        <boxGeometry args={[wall, H, D - wall * 2]} />
      </mesh>
      {/* Right wall */}
      <mesh scale={0.999} castShadow position={[W / 2 - wall / 2, H / 2, 0]} material={baseMaterials}>
        <boxGeometry args={[wall, H, D - wall * 2]} />
      </mesh>
      {/* Inner bottom */}
      <mesh scale={0.999} receiveShadow position={[0, wall + 0.001, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[W - wall * 2, D - wall * 2]} />
        <primitive object={innerMat} attach="material" />
      </mesh>

      {/* ── Lid (telescoping, slightly wider) ── */}
      <group position={[0, H + lidGap, 0]}>
        <mesh scale={0.999} castShadow material={lidMaterials} position={[0, lidH / 2, 0]}>
          <boxGeometry args={[W + 0.04, lidH, D + 0.04]} />
        </mesh>
        {/* Lid lip (inner rim that telescopes over the base) */}
        {/* Front lip */}
        <mesh scale={0.999} position={[0, -0.02, D / 2 + 0.01]}>
          <boxGeometry args={[W + 0.02, 0.06, wall / 2]} />
          <primitive object={innerMat} attach="material" />
        </mesh>
        {/* Back lip */}
        <mesh scale={0.999} position={[0, -0.02, -(D / 2 + 0.01)]}>
          <boxGeometry args={[W + 0.02, 0.06, wall / 2]} />
          <primitive object={innerMat} attach="material" />
        </mesh>
      </group>

      {/* ── Tissue paper peeking out ── */}
      <mesh scale={0.999} position={[0, H + 0.01, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[W - 0.1, D - 0.1]} />
        <meshStandardMaterial color="#fffef8" roughness={0.8} transparent opacity={0.7} side={THREE.DoubleSide} />
      </mesh>
    </group>
  );
};
