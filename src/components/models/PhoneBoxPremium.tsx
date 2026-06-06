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
 * Phone Box Premium — A rigid clamshell box with an inner collar (shoulder box).
 * Features a deep base, a deep hinged lid, and a contrasting inner tray collar
 * that the lid sleeves over when closed.
 */
export const PhoneBoxPremium = ({ color, autoRotate, textureUrl, bgTextureUrl, activeFaces }: Props) => {
  const groupRef = useRef<THREE.Group>(null!);
  const texture = useTexture(textureUrl || 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=');
  const bgTex = useTexture(bgTextureUrl || 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=');
  texture.colorSpace = THREE.SRGBColorSpace;
  bgTex.colorSpace = THREE.SRGBColorSpace;

  useFrame((_, delta) => {
    if (groupRef.current && autoRotate) groupRef.current.rotation.y += delta * 0.3;
  });

  const W = 0.8;      // width
  const D = 1.4;      // length
  const H = 0.35;     // base outer shell height
  const wall = 0.02;  // thickness of outer shell
  const lidH = 0.35;  // lid height
  const collarH = 0.33; // height of the inner collar protruding above base
  const collarWall = 0.015; // thickness of inner collar
  
  // Angle for opening the lid (radians)
  const lidAngle = -1.8; // opened wide

  const faceOrder = ['right', 'left', 'top', 'bottom', 'front', 'back'];
  const materials = useMemo(() => {
    return faceOrder.map(faceName => {
      const showLogo = !activeFaces || activeFaces[faceName] !== false;
      const activeTex = showLogo && textureUrl ? texture : (bgTextureUrl ? bgTex : null);
      return new THREE.MeshPhysicalMaterial({
        color: activeTex ? '#ffffff' : color || '#111111',
        map: activeTex,
        roughness: 0.25,
        metalness: 0.1,
      });
    });
  }, [color, textureUrl, bgTextureUrl, activeFaces, texture, bgTex]);

  const innerMat = new THREE.MeshStandardMaterial({ color: '#2b44d2', roughness: 0.8 });

  return (
    <group ref={groupRef} position={[0, -H / 2, 0]}>
      {/* ── Base Outer Tray ── */}
      <mesh castShadow receiveShadow material={materials} position={[0, wall / 2, 0]}>
        <boxGeometry args={[W, wall, D]} />
      </mesh>
      {/* Front */}
      <mesh castShadow material={materials} position={[0, wall + (H - wall) / 2, D / 2 - wall / 2]}>
        <boxGeometry args={[W, H - wall, wall]} />
      </mesh>
      {/* Back */}
      <mesh castShadow material={materials} position={[0, wall + (H - wall) / 2, -D / 2 + wall / 2]}>
        <boxGeometry args={[W, H - wall, wall]} />
      </mesh>
      {/* Left */}
      <mesh castShadow material={materials} position={[-W / 2 + wall / 2, wall + (H - wall) / 2, 0]}>
        <boxGeometry args={[wall, H - wall, D - 2 * wall]} />
      </mesh>
      {/* Right */}
      <mesh castShadow material={materials} position={[W / 2 - wall / 2, wall + (H - wall) / 2, 0]}>
        <boxGeometry args={[wall, H - wall, D - 2 * wall]} />
      </mesh>

      {/* ── Inner Collar (The blue tray that sticks up) ── */}
      <group position={[0, wall, 0]}>
        {/* Inner bottom */}
        <mesh receiveShadow position={[0, 0.001, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[W - 2 * wall, D - 2 * wall]} />
          <primitive object={innerMat} attach="material" />
        </mesh>
        
        {/* Collar Front */}
        <mesh position={[0, (H - wall + collarH) / 2, D / 2 - wall - collarWall / 2]}>
          <boxGeometry args={[W - 2 * wall, H - wall + collarH, collarWall]} />
          <primitive object={innerMat} attach="material" />
        </mesh>
        {/* Collar Back */}
        <mesh position={[0, (H - wall + collarH) / 2, -(D / 2 - wall - collarWall / 2)]}>
          <boxGeometry args={[W - 2 * wall, H - wall + collarH, collarWall]} />
          <primitive object={innerMat} attach="material" />
        </mesh>
        {/* Collar Left */}
        <mesh position={[-(W / 2 - wall - collarWall / 2), (H - wall + collarH) / 2, 0]}>
          <boxGeometry args={[collarWall, H - wall + collarH, D - 2 * wall - 2 * collarWall]} />
          <primitive object={innerMat} attach="material" />
        </mesh>
        {/* Collar Right */}
        <mesh position={[W / 2 - wall - collarWall / 2, (H - wall + collarH) / 2, 0]}>
          <boxGeometry args={[collarWall, H - wall + collarH, D - 2 * wall - 2 * collarWall]} />
          <primitive object={innerMat} attach="material" />
        </mesh>
      </group>

      {/* ── Hinged Lid ── */}
      <group position={[0, H, -D / 2]}>
        <group rotation={[lidAngle, 0, 0]}>
          {/* Lid Top */}
          <mesh castShadow material={materials} position={[0, lidH - wall / 2, D / 2]}>
            <boxGeometry args={[W, wall, D]} />
          </mesh>
          {/* Lid Front */}
          <mesh castShadow material={materials} position={[0, (lidH - wall) / 2, D - wall / 2]}>
            <boxGeometry args={[W, lidH - wall, wall]} />
          </mesh>
          {/* Lid Back */}
          <mesh castShadow material={materials} position={[0, (lidH - wall) / 2, wall / 2]}>
            <boxGeometry args={[W, lidH - wall, wall]} />
          </mesh>
          {/* Lid Left */}
          <mesh castShadow material={materials} position={[-W / 2 + wall / 2, (lidH - wall) / 2, D / 2]}>
            <boxGeometry args={[wall, lidH - wall, D - 2 * wall]} />
          </mesh>
          {/* Lid Right */}
          <mesh castShadow material={materials} position={[W / 2 - wall / 2, (lidH - wall) / 2, D / 2]}>
            <boxGeometry args={[wall, lidH - wall, D - 2 * wall]} />
          </mesh>
          
          {/* Inner Lid Lining */}
          <mesh position={[0, lidH - wall - 0.001, D / 2]} rotation={[Math.PI / 2, 0, 0]}>
            <planeGeometry args={[W - 2 * wall, D - 2 * wall]} />
            <primitive object={innerMat} attach="material" />
          </mesh>
        </group>
      </group>
    </group>
  );
};
