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
 * Subscription Box Premium — A deep, sturdy roll-end tuck-top mailer.
 * Similar to a mailer box but proportioned differently and stylized 
 * with a contrasting inner material, perfect for subscription kits.
 */
export const SubscriptionBoxPremium = ({ color, autoRotate, textureUrl, bgTextureUrl, activeFaces }: Props) => {
  const groupRef = useRef<THREE.Group>(null!);
  const texture = useTexture(textureUrl || 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=');
  const bgTex = useTexture(bgTextureUrl || 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=');
  texture.colorSpace = THREE.SRGBColorSpace;
  bgTex.colorSpace = THREE.SRGBColorSpace;

  useFrame((_, delta) => {
    if (groupRef.current && autoRotate) groupRef.current.rotation.y += delta * 0.3;
  });

  const W = 1.5;
  const D = 1.2;
  const H = 0.6; // Deeper for subscription contents
  const wall = 0.025; // Thick corrugated
  
  const lidAngle = -0.7; // opened wider

  const faceOrder = ['right', 'left', 'top', 'bottom', 'front', 'back'];
  const materials = useMemo(() => {
    return faceOrder.map(faceName => {
      const showLogo = !activeFaces || activeFaces[faceName] !== false;
      const activeTex = showLogo && textureUrl ? texture : (bgTextureUrl ? bgTex : null);
      return new THREE.MeshPhysicalMaterial({
        color: activeTex ? '#ffffff' : color || '#f5f0e6',
        map: activeTex,
        roughness: 0.7,
        metalness: 0.0,
      });
    });
  }, [color, textureUrl, bgTextureUrl, activeFaces, texture, bgTex]);

  // Subscription boxes often have vibrant, branded interiors
  const innerMat = new THREE.MeshStandardMaterial({ color: '#c93a40', roughness: 0.8 });

  return (
    <group ref={groupRef} position={[0, -H / 2, 0]}>
      {/* ── Base Tray ── */}
      {/* Bottom Floor */}
      <mesh castShadow receiveShadow material={materials} position={[0, wall / 2, 0]}>
        <boxGeometry args={[W, wall, D]} />
      </mesh>
      
      {/* Front Wall */}
      <mesh castShadow material={materials} position={[0, wall + (H - wall) / 2, D / 2 - wall / 2]}>
        <boxGeometry args={[W, H - wall, wall]} />
      </mesh>
      {/* Back Wall */}
      <mesh castShadow material={materials} position={[0, wall + (H - wall) / 2, -D / 2 + wall / 2]}>
        <boxGeometry args={[W, H - wall, wall]} />
      </mesh>
      {/* Left Wall (Roll end double thickness) */}
      <mesh castShadow material={materials} position={[-W / 2 + wall, wall + (H - wall) / 2, 0]}>
        <boxGeometry args={[wall * 2, H - wall, D - 2 * wall]} />
      </mesh>
      {/* Right Wall (Roll end) */}
      <mesh castShadow material={materials} position={[W / 2 - wall, wall + (H - wall) / 2, 0]}>
        <boxGeometry args={[wall * 2, H - wall, D - 2 * wall]} />
      </mesh>

      {/* Inner Floor (Colored) */}
      <mesh receiveShadow position={[0, wall + 0.001, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[W - 4 * wall, D - 2 * wall]} />
        <primitive object={innerMat} attach="material" />
      </mesh>
      {/* Inner Walls (Colored) */}
      <mesh position={[0, H / 2, D / 2 - wall - 0.001]} rotation={[Math.PI, 0, 0]}>
         <planeGeometry args={[W - 4 * wall, H - wall]} />
         <primitive object={innerMat} attach="material" />
      </mesh>
      <mesh position={[0, H / 2, -D / 2 + wall + 0.001]}>
         <planeGeometry args={[W - 4 * wall, H - wall]} />
         <primitive object={innerMat} attach="material" />
      </mesh>
      <mesh position={[-W / 2 + wall * 2 + 0.001, H / 2, 0]} rotation={[0, Math.PI / 2, 0]}>
         <planeGeometry args={[D - 2 * wall, H - wall]} />
         <primitive object={innerMat} attach="material" />
      </mesh>
      <mesh position={[W / 2 - wall * 2 - 0.001, H / 2, 0]} rotation={[0, -Math.PI / 2, 0]}>
         <planeGeometry args={[D - 2 * wall, H - wall]} />
         <primitive object={innerMat} attach="material" />
      </mesh>

      {/* ── Hinged Lid Assembly ── */}
      <group position={[0, H, -D / 2 + wall / 2]}>
        <group rotation={[lidAngle, 0, 0]}>
          {/* Main Top Lid */}
          <mesh castShadow material={materials} position={[0, wall / 2, D / 2 - wall / 2]}>
            <boxGeometry args={[W - 0.01, wall, D - wall]} />
          </mesh>

          {/* Front Tuck Flap */}
          <mesh castShadow material={materials} position={[0, -H / 2 + wall, D - wall]} rotation={[-0.15, 0, 0]}>
            <boxGeometry args={[W - 4 * wall, H - 2 * wall, wall]} />
          </mesh>

          {/* Left Dust Flap */}
          <mesh castShadow material={materials} position={[-W / 2 + wall, -0.05, 0.2]} rotation={[0, 0, 0.35]}>
            <boxGeometry args={[wall, 0.1, 0.35]} />
          </mesh>
          {/* Right Dust Flap */}
          <mesh castShadow material={materials} position={[W / 2 - wall, -0.05, 0.2]} rotation={[0, 0, -0.35]}>
            <boxGeometry args={[wall, 0.1, 0.35]} />
          </mesh>

          {/* Inner Lid Lining (Colored) */}
          <mesh position={[0, -0.001, D / 2 - wall / 2]} rotation={[Math.PI / 2, 0, 0]}>
            <planeGeometry args={[W - 0.02, D - wall - 0.02]} />
            <primitive object={innerMat} attach="material" />
          </mesh>
        </group>
      </group>
    </group>
  );
};
