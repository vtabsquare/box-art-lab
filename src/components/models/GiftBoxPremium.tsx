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
 * Gift Box — A cube-ish box with a separate lift-off lid and a satin ribbon
 * running in a cross pattern with a decorative bow on top.
 */
export const GiftBoxPremium = ({ color, autoRotate, textureUrl, bgTextureUrl, activeFaces }: Props) => {
  const groupRef = useRef<THREE.Group>(null!);
  const texture = useTexture(textureUrl || 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=');
  const bgTex = useTexture(bgTextureUrl || 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=');
  texture.colorSpace = THREE.SRGBColorSpace;
  bgTex.colorSpace = THREE.SRGBColorSpace;

  useFrame((_, delta) => {
    if (groupRef.current && autoRotate) groupRef.current.rotation.y += delta * 0.3;
  });

  const S = 1.1;     // side length (cube)
  const H = 0.85;    // base height (y)
  const lidH = 0.18; // lid thickness
  const lidGap = 0.04; // visual gap

  const faceOrder = ['right', 'left', 'top', 'bottom', 'front', 'back'];
  const baseMaterials = useMemo(() => {
    return faceOrder.map(faceName => {
      const showLogo = !activeFaces || activeFaces[faceName] !== false;
      const activeTex = showLogo && textureUrl ? texture : (bgTextureUrl ? bgTex : null);
      return new THREE.MeshPhysicalMaterial({
        color: activeTex ? '#ffffff' : color || '#e91e8c',
        map: activeTex,
        roughness: 0.3,
        metalness: 0.05,
      });
    });
  }, [color, textureUrl, bgTextureUrl, activeFaces, texture, bgTex]);

  const lidMaterials = useMemo(() => {
    return faceOrder.map(faceName => {
      const showLogo = !activeFaces || activeFaces[faceName] !== false;
      const activeTex = showLogo && textureUrl ? texture : (bgTextureUrl ? bgTex : null);
      return new THREE.MeshPhysicalMaterial({
        color: activeTex ? '#ffffff' : color || '#e91e8c',
        map: activeTex,
        roughness: 0.28,
        metalness: 0.08,
      });
    });
  }, [color, textureUrl, bgTextureUrl, activeFaces, texture, bgTex]);

  const ribbonMat = new THREE.MeshStandardMaterial({
    color: '#ffd700',
    roughness: 0.15,
    metalness: 0.7,
  });

  const totalH = H + lidGap + lidH;

  return (
    <group ref={groupRef} position={[0, -totalH / 2, 0]}>
      {/* ── Base box ── */}
      <mesh castShadow receiveShadow material={baseMaterials} position={[0, H / 2, 0]}>
        <boxGeometry args={[S, H, S]} />
      </mesh>

      {/* ── Lid (lift-off, slightly wider) ── */}
      <mesh castShadow material={lidMaterials} position={[0, H + lidGap + lidH / 2, 0]}>
        <boxGeometry args={[S + 0.04, lidH, S + 0.04]} />
      </mesh>

      {/* ── Ribbon cross — on base box sides ── */}
      {/* Front vertical ribbon */}
      <mesh position={[0, H / 2, S / 2 + 0.003]}>
        <boxGeometry args={[0.1, H + 0.01, 0.005]} />
        <primitive object={ribbonMat} attach="material" />
      </mesh>
      {/* Back vertical ribbon */}
      <mesh position={[0, H / 2, -(S / 2 + 0.003)]}>
        <boxGeometry args={[0.1, H + 0.01, 0.005]} />
        <primitive object={ribbonMat} attach="material" />
      </mesh>
      {/* Left horizontal ribbon */}
      <mesh position={[-(S / 2 + 0.003), H / 2, 0]}>
        <boxGeometry args={[0.005, H + 0.01, 0.1]} />
        <primitive object={ribbonMat} attach="material" />
      </mesh>
      {/* Right horizontal ribbon */}
      <mesh position={[S / 2 + 0.003, H / 2, 0]}>
        <boxGeometry args={[0.005, H + 0.01, 0.1]} />
        <primitive object={ribbonMat} attach="material" />
      </mesh>

      {/* ── Ribbon on lid top ── */}
      {/* X-direction ribbon on lid */}
      <mesh position={[0, H + lidGap + lidH + 0.003, 0]}>
        <boxGeometry args={[S + 0.05, 0.005, 0.1]} />
        <primitive object={ribbonMat} attach="material" />
      </mesh>
      {/* Z-direction ribbon on lid */}
      <mesh position={[0, H + lidGap + lidH + 0.003, 0]}>
        <boxGeometry args={[0.1, 0.005, S + 0.05]} />
        <primitive object={ribbonMat} attach="material" />
      </mesh>

      {/* ── Bow on top ── */}
      {[0, Math.PI / 2, Math.PI, -Math.PI / 2].map((angle, i) => (
        <mesh
          key={i}
          position={[
            Math.sin(angle) * 0.14,
            H + lidGap + lidH + 0.08,
            Math.cos(angle) * 0.14,
          ]}
          rotation={[0.3, angle, 0.4]}
        >
          <torusGeometry args={[0.11, 0.025, 8, 20, Math.PI]} />
          <primitive object={ribbonMat} attach="material" />
        </mesh>
      ))}
      {/* Bow center knot */}
      <mesh position={[0, H + lidGap + lidH + 0.1, 0]}>
        <sphereGeometry args={[0.05, 12, 12]} />
        <primitive object={ribbonMat} attach="material" />
      </mesh>

      {/* ── Subtle edge highlight ── */}
      <lineSegments position={[0, H / 2, 0]}>
        <edgesGeometry args={[new THREE.BoxGeometry(S, H, S)]} />
        <lineBasicMaterial color="#ffffff" transparent opacity={0.06} />
      </lineSegments>
    </group>
  );
};
