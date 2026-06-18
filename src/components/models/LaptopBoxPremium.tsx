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
 * Laptop Box Premium — A corrugated mailer box (roll end tuck top).
 * Features a tray base and a lid hinged at the back with dust flaps and a front tuck flap.
 * Shown slightly open to reveal the classic e-commerce mailer structure.
 */
export const LaptopBoxPremium = ({ color, autoRotate, textureUrl, bgTextureUrl, activeFaces }: Props) => {
  const groupRef = useRef<THREE.Group>(null!);
  const texture = useTexture(textureUrl || 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=');
  const bgTex = useTexture(bgTextureUrl || 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=');
  texture.colorSpace = THREE.SRGBColorSpace;
  bgTex.colorSpace = THREE.SRGBColorSpace;

  useFrame((_, delta) => {
    if (groupRef.current && autoRotate) groupRef.current.rotation.y += delta * 0.3;
  });

  const W = 1.8;
  const D = 1.2;
  const H = 0.35;
  const wall = 0.025; // Corrugated cardboard is thicker
  
  const lidAngle = -0.5; // open angle
  const materials = useMemo(() => {
    return faceOrder.map(faceName => {
      const showLogo = !activeFaces || activeFaces[faceName] !== false;
      const activeTex = showLogo && textureUrl ? texture : (bgTextureUrl ? bgTex : null);
      return new THREE.MeshPhysicalMaterial({
        color: activeTex ? '#ffffff' : color || '#c0a080',
        map: activeTex,
        roughness: 0.8, // Matte corrugated look
        metalness: 0.0,
      });
    });
  }, [color, textureUrl, bgTextureUrl, activeFaces, texture, bgTex]);

  const innerMat = new THREE.MeshStandardMaterial({ color: '#b59775', roughness: 0.9 });

  return (
    <group ref={groupRef} position={[0, -H / 2, 0]}>
      {/* ── Base Tray ── */}
      {/* Bottom */}
      <mesh scale={0.999} castShadow receiveShadow material={materials} position={[0, wall / 2, 0]}>
        <boxGeometry args={[W, wall, D]} />
      </mesh>
      {/* Front */}
      <mesh scale={0.999} castShadow material={materials} position={[0, wall + (H - wall) / 2, D / 2 - wall / 2]}>
        <boxGeometry args={[W, H - wall, wall]} />
      </mesh>
      {/* Back */}
      <mesh scale={0.999} castShadow material={materials} position={[0, wall + (H - wall) / 2, -D / 2 + wall / 2]}>
        <boxGeometry args={[W, H - wall, wall]} />
      </mesh>
      {/* Left (Double thick for roll end) */}
      <mesh scale={0.999} castShadow material={materials} position={[-W / 2 + wall, wall + (H - wall) / 2, 0]}>
        <boxGeometry args={[wall * 2, H - wall, D - 2 * wall]} />
      </mesh>
      {/* Right (Double thick for roll end) */}
      <mesh scale={0.999} castShadow material={materials} position={[W / 2 - wall, wall + (H - wall) / 2, 0]}>
        <boxGeometry args={[wall * 2, H - wall, D - 2 * wall]} />
      </mesh>

      {/* Inner Floor */}
      <mesh scale={0.999} receiveShadow position={[0, wall + 0.001, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[W - 4 * wall, D - 2 * wall]} />
        <primitive object={innerMat} attach="material" />
      </mesh>

      {/* ── Hinged Lid Assembly ── */}
      <group position={[0, H, -D / 2 + wall / 2]}>
        <group rotation={[lidAngle, 0, 0]}>
          {/* Main Top Face */}
          <mesh scale={0.999} castShadow material={materials} position={[0, wall / 2, D / 2 - wall / 2]}>
            <boxGeometry args={[W - 0.01, wall, D - wall]} />
          </mesh>

          {/* Front Tuck Flap */}
          <mesh scale={0.999} castShadow material={materials} position={[0, -H / 2 + wall, D - wall]} rotation={[-0.2, 0, 0]}>
            <boxGeometry args={[W - 4 * wall, H - 2 * wall, wall]} />
          </mesh>

          {/* Left Dust Flap */}
          <mesh scale={0.999} castShadow material={materials} position={[-W / 2 + wall, -0.05, 0.2]} rotation={[0, 0, 0.5]}>
            <boxGeometry args={[wall, 0.1, 0.3]} />
          </mesh>

          {/* Right Dust Flap */}
          <mesh scale={0.999} castShadow material={materials} position={[W / 2 - wall, -0.05, 0.2]} rotation={[0, 0, -0.5]}>
            <boxGeometry args={[wall, 0.1, 0.3]} />
          </mesh>

          {/* Inner Lid Surface */}
          <mesh scale={0.999} position={[0, -0.001, D / 2 - wall / 2]} rotation={[Math.PI / 2, 0, 0]}>
            <planeGeometry args={[W - 0.02, D - wall - 0.02]} />
            <primitive object={innerMat} attach="material" />
          </mesh>
        </group>
      </group>
    </group>
  );
};
