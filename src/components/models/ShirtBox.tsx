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
 * Shirt Box — A slim, flat folding carton with a tuck-top lid.
 * The lid is a full-width flap hinged at the back edge and slightly open.
 * Proportions: very wide (L) × medium (W) × very shallow (H)
 */
export const ShirtBox = ({ color, autoRotate, textureUrl, bgTextureUrl, activeFaces }: Props) => {
  const groupRef = useRef<THREE.Group>(null!);
  const texture = useTexture(textureUrl || 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=');
  const bgTex = useTexture(bgTextureUrl || 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=');
  texture.colorSpace = THREE.SRGBColorSpace;
  bgTex.colorSpace = THREE.SRGBColorSpace;

  useFrame((_, delta) => {
    if (groupRef.current && autoRotate) groupRef.current.rotation.y += delta * 0.3;
  });

  const W = 1.7;   // width
  const H = 0.28;  // height
  const D = 1.2;   // depth
  const wall = 0.015; // cardboard thickness
  const lidAngle = -0.12; // slightly open
  const materials = useMemo(() => {
    return faceOrder.map(faceName => {
      const showLogo = !activeFaces || activeFaces[faceName] !== false;
      const activeTex = showLogo && textureUrl ? texture : (bgTextureUrl ? bgTex : null);
      return new THREE.MeshPhysicalMaterial({
        color: activeTex ? '#ffffff' : color || '#888888',
        map: activeTex,
        roughness: 0.5,
        metalness: 0.0,
      });
    });
  }, [color, textureUrl, bgTextureUrl, activeFaces, texture, bgTex]);

  const innerMat = new THREE.MeshStandardMaterial({ color: '#faf8f2', roughness: 0.6 });

  return (
    <group ref={groupRef} position={[0, -H / 2, 0]}>
      {/* ── Base tray ── */}
      <mesh scale={0.999} castShadow receiveShadow material={materials} position={[0, wall / 2, 0]}>
        <boxGeometry args={[W, wall, D]} />
      </mesh>
      <mesh scale={0.999} castShadow material={materials} position={[0, wall + (H - wall) / 2, D / 2 - wall / 2]}>
        <boxGeometry args={[W, H - wall, wall]} />
      </mesh>
      <mesh scale={0.999} castShadow material={materials} position={[0, wall + (H - wall) / 2, -D / 2 + wall / 2]}>
        <boxGeometry args={[W, H - wall, wall]} />
      </mesh>
      <mesh scale={0.999} castShadow material={materials} position={[-W / 2 + wall / 2, wall + (H - wall) / 2, 0]}>
        <boxGeometry args={[wall, H - wall, D - 2 * wall]} />
      </mesh>
      <mesh scale={0.999} castShadow material={materials} position={[W / 2 - wall / 2, wall + (H - wall) / 2, 0]}>
        <boxGeometry args={[wall, H - wall, D - 2 * wall]} />
      </mesh>

      <mesh scale={0.999} position={[0, wall + 0.001, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[W - 2 * wall, D - 2 * wall]} />
        <primitive object={innerMat} attach="material" />
      </mesh>

      {/* ── Tissue paper inside ── */}
      <mesh scale={0.999} position={[0, wall + 0.01, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[W - 0.1, D - 0.1]} />
        <meshStandardMaterial color="#fffef5" roughness={0.85} transparent opacity={0.6} side={THREE.DoubleSide} />
      </mesh>

      {/* ── Top lid flap — hinged at the back edge ── */}
      <group position={[0, H, -D / 2]}>
        <group rotation={[lidAngle, 0, 0]}>
          {/* Main flap */}
          <mesh scale={0.999} castShadow material={materials} position={[0, wall / 2, D / 2]}>
            <boxGeometry args={[W, wall, D]} />
          </mesh>
          {/* Tuck tab at front of flap */}
          <mesh scale={0.999} castShadow position={[0, -0.04, D - wall / 2]} rotation={[0.15, 0, 0]}>
            <boxGeometry args={[W * 0.85, 0.08, wall]} />
            <primitive object={innerMat} attach="material" />
          </mesh>
        </group>
      </group>
    </group>
  );
};
