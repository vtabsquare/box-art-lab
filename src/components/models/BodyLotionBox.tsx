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
 * BodyLotionBox — Tall narrow open-top RSC cardboard box.
 * White exterior, kraft interior, 4 open flaps at top.
 */
export const BodyLotionBox = ({ color, autoRotate, textureUrl, bgTextureUrl, activeFaces }: Props) => {
  const groupRef = useRef<THREE.Group>(null!);
  const EMPTY = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=';
  const texture = useTexture(textureUrl || EMPTY);
  const bgTex   = useTexture(bgTextureUrl || EMPTY);
  texture.colorSpace = THREE.SRGBColorSpace;
  bgTex.colorSpace   = THREE.SRGBColorSpace;

  useFrame((_, delta) => {
    if (groupRef.current && autoRotate) groupRef.current.rotation.y += delta * 0.28;
  });

  // Tall slim box: approx 10×10×30 cm ratio
  const W    = 0.72;
  const H    = 2.2;
  const D    = 0.72;
  const wall = 0.022;

  // Flap opens ~125°
  const flapAngle = 2.2;

  // --- Materials (same pattern as ShippingBoxPremium) ---
  const materials = useMemo(() => {
    return faceOrder.map(faceName => {
      const showLogo = !activeFaces || activeFaces[faceName] !== false;
      const activeTex = showLogo && textureUrl ? texture : (bgTextureUrl ? bgTex : null);
      return new THREE.MeshPhysicalMaterial({
        color: activeTex ? '#ffffff' : color || '#f2f2ee',
        map: activeTex ?? undefined,
        roughness: 0.85,
        metalness: 0.0,
      });
    });
  }, [color, textureUrl, bgTextureUrl, activeFaces, texture, bgTex]);

  const innerMat = useMemo(() => new THREE.MeshStandardMaterial({
    color: '#c49a5a',
    roughness: 1.0,
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
        <boxGeometry args={[W - 2 * wall, H - wall, wall]} />
      </mesh>
      {/* Back */}
      <mesh scale={0.999} castShadow receiveShadow material={materials}
        position={[0, wall + (H - wall) / 2, -D / 2 + wall / 2]}>
        <boxGeometry args={[W - 2 * wall, H - wall, wall]} />
      </mesh>
      {/* Left */}
      <mesh scale={0.999} castShadow receiveShadow material={materials}
        position={[-W / 2 + wall / 2, wall + (H - wall) / 2, 0]}>
        <boxGeometry args={[wall, H - wall, D]} />
      </mesh>
      {/* Right */}
      <mesh scale={0.999} castShadow receiveShadow material={materials}
        position={[W / 2 - wall / 2, wall + (H - wall) / 2, 0]}>
        <boxGeometry args={[wall, H - wall, D]} />
      </mesh>

      {/* ── Interior Kraft Surfaces ── */}
      {/* Inner front */}
      <mesh scale={0.999} receiveShadow position={[0, wall + (H - wall) / 2, D / 2 - wall - 0.001]}>
        <planeGeometry args={[W - 2 * wall, H - wall]} />
        <primitive object={innerMat} attach="material" />
      </mesh>
      {/* Inner back */}
      <mesh scale={0.999} receiveShadow position={[0, wall + (H - wall) / 2, -D / 2 + wall + 0.001]}
        rotation={[0, Math.PI, 0]}>
        <planeGeometry args={[W - 2 * wall, H - wall]} />
        <primitive object={innerMat} attach="material" />
      </mesh>
      {/* Inner left */}
      <mesh scale={0.999} receiveShadow position={[-W / 2 + wall + 0.001, wall + (H - wall) / 2, 0]}
        rotation={[0, Math.PI / 2, 0]}>
        <planeGeometry args={[D, H - wall]} />
        <primitive object={innerMat} attach="material" />
      </mesh>
      {/* Inner right */}
      <mesh scale={0.999} receiveShadow position={[W / 2 - wall - 0.001, wall + (H - wall) / 2, 0]}
        rotation={[0, -Math.PI / 2, 0]}>
        <planeGeometry args={[D, H - wall]} />
        <primitive object={innerMat} attach="material" />
      </mesh>
      {/* Inner floor */}
      <mesh scale={0.999} receiveShadow position={[0, wall + 0.001, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[W - 2 * wall, D - 2 * wall]} />
        <primitive object={innerMat} attach="material" />
      </mesh>

      {/* ── Top Flaps — pivot at the top edge of each wall ── */}

      {/* Left minor flap: hinge at top edge of left wall */}
      <group position={[-W / 2 + wall, H, 0]} rotation={[0, 0, flapAngle]}>
        <mesh scale={0.999} castShadow material={materials} position={[W / 4, wall / 2, 0]}>
          <boxGeometry args={[W / 2, wall, D - 2 * wall]} />
        </mesh>
      </group>

      {/* Right minor flap: hinge at top edge of right wall */}
      <group position={[W / 2 - wall, H, 0]} rotation={[0, 0, -flapAngle]}>
        <mesh scale={0.999} castShadow material={materials} position={[-W / 4, wall / 2, 0]}>
          <boxGeometry args={[W / 2, wall, D - 2 * wall]} />
        </mesh>
      </group>

      {/* Front major flap: hinge at top inner edge of front wall */}
      <group position={[0, H, D / 2 - wall / 2]} rotation={[-flapAngle, 0, 0]}>
        <mesh scale={0.999} castShadow material={materials} position={[0, wall / 2, D / 4]}>
          <boxGeometry args={[W - 2 * wall, wall, D / 2]} />
        </mesh>
      </group>

      {/* Back major flap: hinge at top inner edge of back wall */}
      <group position={[0, H, -D / 2 + wall / 2]} rotation={[flapAngle, 0, 0]}>
        <mesh scale={0.999} castShadow material={materials} position={[0, wall / 2, -D / 4]}>
          <boxGeometry args={[W - 2 * wall, wall, D / 2]} />
        </mesh>
      </group>

      {/* ── Subtle edge wireframe ── */}
      <lineSegments position={[0, H / 2, 0]}>
        <edgesGeometry args={[new THREE.BoxGeometry(W, H, D)]} />
        <lineBasicMaterial color="#111111" transparent opacity={0.07} />
      </lineSegments>

    </group>
  );
};
