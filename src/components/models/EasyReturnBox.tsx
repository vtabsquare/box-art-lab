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
 * EasyReturnBox — Same RSC-style box as ShippingBoxPremium but with
 * wider/flatter proportions typical of e-commerce return boxes.
 * Features 4 open top flaps and a self-seal tear strip detail.
 */
export const EasyReturnBox = ({ color, autoRotate, textureUrl, bgTextureUrl, activeFaces }: Props) => {
  const groupRef = useRef<THREE.Group>(null!);
  const texture = useTexture(textureUrl || 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=');
  const bgTex = useTexture(bgTextureUrl || 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=');
  texture.colorSpace = THREE.SRGBColorSpace;
  bgTex.colorSpace = THREE.SRGBColorSpace;

  useFrame((_, delta) => {
    if (groupRef.current && autoRotate) groupRef.current.rotation.y += delta * 0.3;
  });

  // Wider & shallower than shipping box — typical return box proportions (30×22×10 cm)
  const W = 1.6;
  const H = 0.8;
  const D = 1.2;
  const wall = 0.025;

  const flapAngle = 2.2;

  const materials = useMemo(() => {
    return faceOrder.map(faceName => {
      const showLogo = !activeFaces || activeFaces[faceName] !== false;
      const activeTex = showLogo && textureUrl ? texture : (bgTextureUrl ? bgTex : null);
      return new THREE.MeshPhysicalMaterial({
        color: activeTex ? '#ffffff' : color || '#b58e60',
        map: activeTex,
        roughness: 0.9,
        metalness: 0.0,
      });
    });
  }, [color, textureUrl, bgTextureUrl, activeFaces, texture, bgTex]);

  const innerMat = new THREE.MeshStandardMaterial({ color: '#a07d53', roughness: 1.0 });

  // Self-seal strip material (white adhesive strip visible on top lip)
  const sealMat = new THREE.MeshStandardMaterial({ color: '#e8e8e8', roughness: 0.6 });
  const sealLineMat = new THREE.MeshStandardMaterial({ color: '#cc3333', roughness: 0.8 });

  return (
    <group ref={groupRef} position={[0, -H / 2, 0]}>
      {/* ── Base Walls ── */}
      {/* Bottom Floor */}
      <mesh scale={0.999} castShadow receiveShadow material={materials} position={[0, wall / 2, 0]}>
        <boxGeometry args={[W, wall, D]} />
      </mesh>

      {/* Left Wall */}
      <mesh scale={0.999} castShadow material={materials} position={[-W / 2 + wall / 2, wall + (H - wall) / 2, 0]}>
        <boxGeometry args={[wall, H - wall, D]} />
      </mesh>
      {/* Right Wall */}
      <mesh scale={0.999} castShadow material={materials} position={[W / 2 - wall / 2, wall + (H - wall) / 2, 0]}>
        <boxGeometry args={[wall, H - wall, D]} />
      </mesh>

      {/* Front Wall */}
      <mesh scale={0.999} castShadow material={materials} position={[0, wall + (H - wall) / 2, D / 2 - wall / 2]}>
        <boxGeometry args={[W - 2 * wall, H - wall, wall]} />
      </mesh>
      {/* Back Wall */}
      <mesh scale={0.999} castShadow material={materials} position={[0, wall + (H - wall) / 2, -D / 2 + wall / 2]}>
        <boxGeometry args={[W - 2 * wall, H - wall, wall]} />
      </mesh>

      {/* Inner Floor */}
      <mesh scale={0.999} receiveShadow position={[0, wall + 0.001, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[W - 2 * wall, D - 2 * wall]} />
        <primitive object={innerMat} attach="material" />
      </mesh>

      {/* ── Self-Seal Strip on front wall top edge ── */}
      <mesh scale={0.999} position={[0, H - wall / 2, D / 2 + 0.001]}>
        <boxGeometry args={[W - 2 * wall, 0.04, 0.002]} />
        <primitive object={sealMat} attach="material" />
      </mesh>
      {/* Red dashed return indicator marks */}
      {[-0.55, -0.22, 0.11, 0.44].map((xOff, i) => (
        <mesh scale={0.999} key={i} position={[xOff, H - wall / 2, D / 2 + 0.003]}>
          <boxGeometry args={[0.16, 0.015, 0.001]} />
          <primitive object={sealLineMat} attach="material" />
        </mesh>
      ))}

      {/* ── Top Flaps (open) ── */}
      {/* Left Flap (Inner) */}
      <group position={[-W / 2 + wall, H, 0]} rotation={[0, 0, flapAngle]}>
        <mesh scale={0.999} castShadow material={materials} position={[W / 4, wall / 2, 0]}>
          <boxGeometry args={[W / 2, wall, D - 2 * wall]} />
        </mesh>
      </group>

      {/* Right Flap (Inner) */}
      <group position={[W / 2 - wall, H, 0]} rotation={[0, 0, -flapAngle]}>
        <mesh scale={0.999} castShadow material={materials} position={[-W / 4, wall / 2, 0]}>
          <boxGeometry args={[W / 2, wall, D - 2 * wall]} />
        </mesh>
      </group>

      {/* Front Flap (Outer) */}
      <group position={[0, H, D / 2 - wall / 2]} rotation={[-flapAngle, 0, 0]}>
        <mesh scale={0.999} castShadow material={materials} position={[0, wall * 1.5, D / 4]}>
          <boxGeometry args={[W, wall, D / 2]} />
        </mesh>
      </group>

      {/* Back Flap (Outer) */}
      <group position={[0, H, -D / 2 + wall / 2]} rotation={[flapAngle, 0, 0]}>
        <mesh scale={0.999} castShadow material={materials} position={[0, wall * 1.5, -D / 4]}>
          <boxGeometry args={[W, wall, D / 2]} />
        </mesh>
      </group>

      {/* ── Edge Lines ── */}
      <lineSegments position={[0, H / 2, 0]}>
        <edgesGeometry args={[new THREE.BoxGeometry(W, H, D)]} />
        <lineBasicMaterial color="#000000" transparent opacity={0.06} />
      </lineSegments>
    </group>
  );
};
