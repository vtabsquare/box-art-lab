import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { useTexture } from '@react-three/drei';
import * as THREE from 'three';

interface Props {
  color: string;
  autoRotate: boolean;
  textureUrl?: string | null;
  bgTextureUrl?: string | null;
  activeFaces?: Record<string, boolean>;
}

/**
 * Carrier Box — A tall shopping bag / carrier box with rope handles.
 * Open top, solid walls, reinforced bottom, and two rope loop handles.
 * Proportions: medium (L) × narrow (W) × tall (H)
 */
export const CarrierBoxPremium = ({ color, autoRotate, textureUrl, bgTextureUrl, activeFaces }: Props) => {
  const groupRef = useRef<THREE.Group>(null!);
  const texture = useTexture(textureUrl || 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=');
  const bgTex = useTexture(bgTextureUrl || 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=');
  texture.colorSpace = THREE.SRGBColorSpace;
  bgTex.colorSpace = THREE.SRGBColorSpace;

  useFrame((_, delta) => {
    if (groupRef.current && autoRotate) groupRef.current.rotation.y += delta * 0.3;
  });

  const W = 1.1;    // width (x)
  const H = 1.5;    // height (y)
  const D = 0.55;   // depth (z)
  const wall = 0.02;
  const rimH = 0.04; // reinforced top rim

  const faceOrder = ['right', 'left', 'top', 'bottom', 'front', 'back'];
  const materials = useMemo(() => {
    return faceOrder.map(faceName => {
      const showLogo = !activeFaces || activeFaces[faceName] !== false;
      const activeTex = showLogo && textureUrl ? texture : (bgTextureUrl ? bgTex : null);
      return new THREE.MeshPhysicalMaterial({
        color: activeTex ? '#ffffff' : color || '#e8d5b7',
        map: activeTex,
        roughness: 0.6,
        metalness: 0.0,
      });
    });
  }, [color, textureUrl, bgTextureUrl, activeFaces, texture, bgTex]);

  const innerMat = new THREE.MeshStandardMaterial({ color: '#f5f0e8', roughness: 0.55 });
  const handleMat = new THREE.MeshStandardMaterial({ color: '#8B6914', roughness: 0.65 });

  return (
    <group ref={groupRef} position={[0, -H / 2, 0]}>
      {/* ── Bottom ── */}
      <mesh castShadow receiveShadow material={materials} position={[0, wall / 2, 0]}>
        <boxGeometry args={[W, wall, D]} />
      </mesh>

      {/* ── Front wall ── */}
      <mesh castShadow material={materials} position={[0, H / 2, D / 2]}>
        <boxGeometry args={[W, H, wall]} />
      </mesh>
      {/* ── Back wall ── */}
      <mesh castShadow material={materials} position={[0, H / 2, -D / 2]}>
        <boxGeometry args={[W, H, wall]} />
      </mesh>
      {/* ── Left wall ── */}
      <mesh castShadow material={materials} position={[-W / 2, H / 2, 0]}>
        <boxGeometry args={[wall, H, D]} />
      </mesh>
      {/* ── Right wall ── */}
      <mesh castShadow material={materials} position={[W / 2, H / 2, 0]}>
        <boxGeometry args={[wall, H, D]} />
      </mesh>

      {/* ── Inner bottom ── */}
      <mesh position={[0, wall + 0.001, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[W - wall * 2, D - wall * 2]} />
        <primitive object={innerMat} attach="material" />
      </mesh>

      {/* ── Reinforced top rim ── */}
      {/* Front rim */}
      <mesh position={[0, H + rimH / 2, D / 2]}>
        <boxGeometry args={[W + 0.01, rimH, wall * 2]} />
        <primitive object={innerMat} attach="material" />
      </mesh>
      {/* Back rim */}
      <mesh position={[0, H + rimH / 2, -D / 2]}>
        <boxGeometry args={[W + 0.01, rimH, wall * 2]} />
        <primitive object={innerMat} attach="material" />
      </mesh>
      {/* Left rim */}
      <mesh position={[-W / 2, H + rimH / 2, 0]}>
        <boxGeometry args={[wall * 2, rimH, D + 0.01]} />
        <primitive object={innerMat} attach="material" />
      </mesh>
      {/* Right rim */}
      <mesh position={[W / 2, H + rimH / 2, 0]}>
        <boxGeometry args={[wall * 2, rimH, D + 0.01]} />
        <primitive object={innerMat} attach="material" />
      </mesh>

      {/* ── Rope handles (front) ── */}
      <group position={[0, H + rimH, D / 2 + 0.02]}>
        {/* Left handle */}
        <mesh position={[-W * 0.22, 0.18, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[0.18, 0.015, 8, 32, Math.PI]} />
          <primitive object={handleMat} attach="material" />
        </mesh>
        {/* Right handle */}
        <mesh position={[W * 0.22, 0.18, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[0.18, 0.015, 8, 32, Math.PI]} />
          <primitive object={handleMat} attach="material" />
        </mesh>
        {/* Handle connectors (grommets) */}
        {[-W * 0.22 - 0.18, -W * 0.22 + 0.18, W * 0.22 - 0.18, W * 0.22 + 0.18].map((x, i) => (
          <mesh key={i} position={[x, 0, 0]} rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[0.022, 0.022, 0.01, 12]} />
            <meshStandardMaterial color="#a0865c" roughness={0.3} metalness={0.5} />
          </mesh>
        ))}
      </group>

      {/* ── Rope handles (back) ── */}
      <group position={[0, H + rimH, -(D / 2 + 0.02)]} rotation={[0, Math.PI, 0]}>
        <mesh position={[-W * 0.22, 0.18, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[0.18, 0.015, 8, 32, Math.PI]} />
          <primitive object={handleMat} attach="material" />
        </mesh>
        <mesh position={[W * 0.22, 0.18, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[0.18, 0.015, 8, 32, Math.PI]} />
          <primitive object={handleMat} attach="material" />
        </mesh>
        {[-W * 0.22 - 0.18, -W * 0.22 + 0.18, W * 0.22 - 0.18, W * 0.22 + 0.18].map((x, i) => (
          <mesh key={i} position={[x, 0, 0]} rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[0.022, 0.022, 0.01, 12]} />
            <meshStandardMaterial color="#a0865c" roughness={0.3} metalness={0.5} />
          </mesh>
        ))}
      </group>

      {/* ── Bottom crease lines ── */}
      {[-D / 4, D / 4].map((z, i) => (
        <mesh key={i} position={[0, 0.005, z]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[W - 0.02, 0.005]} />
          <meshStandardMaterial color="#c0a87c" transparent opacity={0.4} />
        </mesh>
      ))}
    </group>
  );
};
