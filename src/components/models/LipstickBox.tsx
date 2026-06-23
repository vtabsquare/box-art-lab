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
 * LipstickBox — Small tall slim box with an open top lid (straight tuck end).
 * The main lid is flipped open upwards, and the side dust flaps are folded inwards.
 */
export const LipstickBox = ({ color, autoRotate, textureUrl, bgTextureUrl, activeFaces }: Props) => {
  const groupRef = useRef<THREE.Group>(null!);
  const EMPTY = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=';
  const texture = useTexture(textureUrl || EMPTY);
  const bgTex   = useTexture(bgTextureUrl || EMPTY);
  texture.colorSpace = THREE.SRGBColorSpace;
  bgTex.colorSpace   = THREE.SRGBColorSpace;

  useFrame((_, delta) => {
    if (groupRef.current && autoRotate) groupRef.current.rotation.y += delta * 0.2;
  });

  // Small slim box proportions matching default 4x10x4 dimensions
  const W    = 0.6;
  const H    = 1.5;
  const D    = 0.6;
  const wall = 0.01;

  // --- Materials ---
  const materials = useMemo(() => {
    return faceOrder.map(faceName => {
      const showLogo = !activeFaces || activeFaces[faceName] !== false;
      const activeTex = showLogo && textureUrl ? texture : (bgTextureUrl ? bgTex : null);
      return new THREE.MeshPhysicalMaterial({
        color: activeTex ? '#ffffff' : color || '#fdfdfc',
        map: activeTex ?? undefined,
        roughness: 0.8,
        metalness: 0.0,
      });
    });
  }, [color, textureUrl, bgTextureUrl, activeFaces, texture, bgTex]);

  const innerMat = useMemo(() => new THREE.MeshStandardMaterial({
    color: '#ffffff', // White interior as per reference
    roughness: 0.9,
  }), []);

  return (
    <group ref={groupRef} position={[0, -H / 2, 0]}>

      {/* ── Floor ── */}
      <mesh scale={0.999} castShadow receiveShadow material={materials} position={[0, wall / 2, 0]}>
        <boxGeometry args={[W, wall, D]} />
      </mesh>

      {/* ── Side Walls ── */}
      {/* Front */}
      <mesh scale={0.999} castShadow receiveShadow material={materials}
        position={[0, wall + (H - wall) / 2, D / 2 - wall / 2]}>
        <boxGeometry args={[W, H - wall, wall]} />
      </mesh>
      {/* Back */}
      <mesh scale={0.999} castShadow receiveShadow material={materials}
        position={[0, wall + (H - wall) / 2, -D / 2 + wall / 2]}>
        <boxGeometry args={[W, H - wall, wall]} />
      </mesh>
      {/* Left */}
      <mesh scale={0.999} castShadow receiveShadow material={materials}
        position={[-W / 2 + wall / 2, wall + (H - wall) / 2, 0]}>
        <boxGeometry args={[wall, H - wall, D - 2 * wall]} />
      </mesh>
      {/* Right */}
      <mesh scale={0.999} castShadow receiveShadow material={materials}
        position={[W / 2 - wall / 2, wall + (H - wall) / 2, 0]}>
        <boxGeometry args={[wall, H - wall, D - 2 * wall]} />
      </mesh>

      {/* ── Interior White Surfaces ── */}
      {/* Inner front */}
      <mesh scale={0.999} receiveShadow position={[0, wall + (H - wall) / 2, D / 2 - wall - 0.001]} rotation={[0, Math.PI, 0]}>
        <planeGeometry args={[W - 2 * wall, H - wall]} />
        <primitive object={innerMat} attach="material" />
      </mesh>
      {/* Inner back */}
      <mesh scale={0.999} receiveShadow position={[0, wall + (H - wall) / 2, -D / 2 + wall + 0.001]}>
        <planeGeometry args={[W - 2 * wall, H - wall]} />
        <primitive object={innerMat} attach="material" />
      </mesh>
      {/* Inner left */}
      <mesh scale={0.999} receiveShadow position={[-W / 2 + wall + 0.001, wall + (H - wall) / 2, 0]} rotation={[0, Math.PI / 2, 0]}>
        <planeGeometry args={[D - 2 * wall, H - wall]} />
        <primitive object={innerMat} attach="material" />
      </mesh>
      {/* Inner right */}
      <mesh scale={0.999} receiveShadow position={[W / 2 - wall - 0.001, wall + (H - wall) / 2, 0]} rotation={[0, -Math.PI / 2, 0]}>
        <planeGeometry args={[D - 2 * wall, H - wall]} />
        <primitive object={innerMat} attach="material" />
      </mesh>
      {/* Inner floor */}
      <mesh scale={0.999} receiveShadow position={[0, wall + 0.001, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[W - 2 * wall, D - 2 * wall]} />
        <primitive object={innerMat} attach="material" />
      </mesh>

      {/* ── Top Flaps ── */}

      {/* Left minor flap (Dust flap) - Folded inward slightly */}
      <group position={[-W / 2 + wall, H, 0]} rotation={[0, 0, -0.3]}>
        <mesh scale={0.999} castShadow receiveShadow material={materials} position={[W / 4, wall / 2, 0]}>
          <boxGeometry args={[W / 2 - 0.02, wall, D - 2 * wall]} />
        </mesh>
        {/* Inner white side of left flap */}
        <mesh scale={0.999} receiveShadow position={[W / 4, wall + 0.001, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[W / 2 - 0.02, D - 2 * wall]} />
          <primitive object={innerMat} attach="material" />
        </mesh>
      </group>

      {/* Right minor flap (Dust flap) - Folded inward slightly */}
      <group position={[W / 2 - wall, H, 0]} rotation={[0, 0, 0.3]}>
        <mesh scale={0.999} castShadow receiveShadow material={materials} position={[-W / 4, wall / 2, 0]}>
          <boxGeometry args={[W / 2 - 0.02, wall, D - 2 * wall]} />
        </mesh>
        {/* Inner white side of right flap */}
        <mesh scale={0.999} receiveShadow position={[-W / 4, wall + 0.001, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[W / 2 - 0.02, D - 2 * wall]} />
          <primitive object={innerMat} attach="material" />
        </mesh>
      </group>

      {/* Back major flap (Main top lid) - Flipped open pointing UP and slightly BACKWARDS */}
      <group position={[0, H, -D / 2 + wall / 2]} rotation={[Math.PI / 2 + 0.3, 0, 0]}>
        <mesh scale={0.999} castShadow material={materials} position={[0, wall / 2, -D / 2]}>
          <boxGeometry args={[W, wall, D]} />
        </mesh>
        {/* Inner white side of main flap */}
        <mesh scale={0.999} receiveShadow position={[0, wall + 0.001, -D / 2]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[W, D]} />
          <primitive object={innerMat} attach="material" />
        </mesh>

        {/* Tuck tab at the end of the main flap */}
        <group position={[0, 0, -D]} rotation={[-0.8, 0, 0]}>
          <mesh scale={0.999} castShadow material={materials} position={[0, wall / 2, 0.15 / 2]}>
            <boxGeometry args={[W - 0.04, wall, 0.15]} />
          </mesh>
          {/* Inner white side of tuck tab */}
          {/* <mesh scale={0.999} receiveShadow position={[0, wall / 2 + 0.001, 0.1 / 2]} rotation={[-Math.PI / 2, 0, 0]}>
            <planeGeometry args={[W - 0.04, 0.15]} />
            <primitive object={innerMat} attach="material" />
          </mesh> */}
        </group>
      </group>

    </group>
  );
};
