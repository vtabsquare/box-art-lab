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

export const LingerieBox = ({ color, autoRotate, textureUrl, bgTextureUrl, activeFaces }: Props) => {
  const groupRef = useRef<THREE.Group>(null!);
  const texture = useTexture(textureUrl || 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=');
  const bgTex = useTexture(bgTextureUrl || 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=');
  texture.colorSpace = THREE.SRGBColorSpace;
  bgTex.colorSpace = THREE.SRGBColorSpace;

  useFrame((_, delta) => {
    if (groupRef.current && autoRotate) groupRef.current.rotation.y += delta * 0.2;
  });

  const W = 1.3;   // length
  const H = 0.3;   // height of base
  const D = 1.1;   // width/depth
  const wall = 0.02; // cardboard thickness
  const FW = 0.25; // Frame width for window

  const outerMaterials = useMemo(() => {
    return faceOrder.map(faceName => {
      const showLogo = !activeFaces || activeFaces[faceName] !== false;
      // We don't apply logo to the top face because it's a window frame, we'll apply it manually to the front thick frame.
      const activeTex = (showLogo && textureUrl && faceName !== 'top') ? texture : (bgTextureUrl ? bgTex : null);
      return new THREE.MeshPhysicalMaterial({
        color: activeTex ? '#ffffff' : color || '#fdfdfd', // Off-white/cream like the image
        map: activeTex,
        roughness: 0.6,
        metalness: 0.0,
      });
    });
  }, [color, textureUrl, bgTextureUrl, activeFaces, texture, bgTex]);

  const innerMat = new THREE.MeshStandardMaterial({ color: '#ffffff', roughness: 0.8 });
  const innerWallMat = new THREE.MeshStandardMaterial({ color: '#f8f8f8', roughness: 0.8 });
  const mWindow = new THREE.MeshPhysicalMaterial({ color: '#ffffff', transmission: 0.95, opacity: 1, roughness: 0.05, ior: 1.5, thickness: 0.01 });

  return (
    <group ref={groupRef} position={[0, -H / 2, 0]}>
      {/* ── Base tray ── */}
      <group position={[0, 0, 0]}>
        {/* Floor */}
        <mesh scale={0.999} castShadow receiveShadow material={outerMaterials} position={[0, wall / 2, 0]}>
          <boxGeometry args={[W, wall, D]} />
        </mesh>
        
        {/* Inner white floor */}
        <mesh scale={0.999} position={[0, wall + 0.001, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[W - 2 * wall, D - 2 * wall]} />
          <primitive object={innerMat} attach="material" />
        </mesh>

        {/* Front wall */}
        <group position={[0, wall + (H - wall) / 2, D / 2 - wall / 2]}>
          <mesh scale={0.999} castShadow material={outerMaterials} position={[0, 0, 0]}>
            <boxGeometry args={[W, H - wall, wall]} />
          </mesh>
          <mesh scale={0.999} material={innerWallMat} position={[0, -wall/2, -wall/2 - 0.001]}>
            <boxGeometry args={[W - 2*wall, H - 2*wall, 0.002]} />
          </mesh>
        </group>

        {/* Back wall */}
        <group position={[0, wall + (H - wall) / 2, -D / 2 + wall / 2]}>
          <mesh scale={0.999} castShadow material={outerMaterials} position={[0, 0, 0]}>
            <boxGeometry args={[W, H - wall, wall]} />
          </mesh>
          <mesh scale={0.999} material={innerWallMat} position={[0, -wall/2, wall/2 + 0.001]}>
            <boxGeometry args={[W - 2*wall, H - 2*wall, 0.002]} />
          </mesh>
        </group>

        {/* Left wall */}
        <group position={[-W / 2 + wall / 2, wall + (H - wall) / 2, 0]}>
          <mesh scale={0.999} castShadow material={outerMaterials} position={[0, 0, 0]}>
            <boxGeometry args={[wall, H - wall, D - 2 * wall]} />
          </mesh>
          <mesh scale={0.999} material={innerWallMat} position={[wall/2 + 0.001, -wall/2, 0]}>
            <boxGeometry args={[0.002, H - 2*wall, D - 4*wall]} />
          </mesh>
        </group>

        {/* Right wall */}
        <group position={[W / 2 - wall / 2, wall + (H - wall) / 2, 0]}>
          <mesh scale={0.999} castShadow material={outerMaterials} position={[0, 0, 0]}>
            <boxGeometry args={[wall, H - wall, D - 2 * wall]} />
          </mesh>
          <mesh scale={0.999} material={innerWallMat} position={[-wall/2 - 0.001, -wall/2, 0]}>
            <boxGeometry args={[0.002, H - 2*wall, D - 4*wall]} />
          </mesh>
        </group>
      </group>

      {/* ── Lid (hovering, angled) ── */}
      <group position={[0, H + 1.0, 0]} rotation={[0.4, 0.3, 0]}>
        
        {/* Lid Frame Roof */}
        {/* Top edge (back) */}
        <mesh scale={0.999} castShadow material={outerMaterials} position={[0, wall / 2, -(D + 0.04) / 2 + FW / 2]}>
          <boxGeometry args={[W + 0.04, wall, FW]} />
        </mesh>
        {/* Bottom edge (front - wider for logo) */}
        <mesh scale={0.999} castShadow material={outerMaterials} position={[0, wall / 2, (D + 0.04) / 2 - FW / 2]}>
          <boxGeometry args={[W + 0.04, wall, FW]} />
        </mesh>
        {/* Left edge */}
        <mesh scale={0.999} castShadow material={outerMaterials} position={[-(W + 0.04) / 2 + FW / 2, wall / 2, 0]}>
          <boxGeometry args={[FW, wall, (D + 0.04) - FW * 2]} />
        </mesh>
        {/* Right edge */}
        <mesh scale={0.999} castShadow material={outerMaterials} position={[(W + 0.04) / 2 - FW / 2, wall / 2, 0]}>
          <boxGeometry args={[FW, wall, (D + 0.04) - FW * 2]} />
        </mesh>

        {/* Window Glass */}
        <mesh scale={0.999} position={[0, wall / 2 - 0.005, 0]}>
          <boxGeometry args={[(W + 0.04) - FW * 2, 0.005, (D + 0.04) - FW * 2]} />
          <primitive object={mWindow} attach="material" />
        </mesh>

        {/* Logo placed on the thick front lip frame */}
        {textureUrl && (!activeFaces || activeFaces['top'] !== false) && (
          <mesh scale={0.999} position={[0, wall + 0.005, (D + 0.04) / 2 - FW / 2]} rotation={[-Math.PI / 2, 0, 0]}>
            <planeGeometry args={[W * 0.8, FW * 0.8]} />
            <meshPhysicalMaterial color="#ffffff" map={texture} roughness={0.9} transparent />
          </mesh>
        )}

        {/* Lid Front wall */}
        <mesh scale={0.999} castShadow material={outerMaterials} position={[0, - (H - wall) / 2, (D + 0.04) / 2 - wall / 2]}>
          <boxGeometry args={[W + 0.04, H - wall, wall]} />
        </mesh>

        {/* Lid Back wall */}
        <mesh scale={0.999} castShadow material={outerMaterials} position={[0, - (H - wall) / 2, -(D + 0.04) / 2 + wall / 2]}>
          <boxGeometry args={[W + 0.04, H - wall, wall]} />
        </mesh>

        {/* Lid Left wall */}
        <mesh scale={0.999} castShadow material={outerMaterials} position={[-(W + 0.04) / 2 + wall / 2, - (H - wall) / 2, 0]}>
          <boxGeometry args={[wall, H - wall, D + 0.04]} />
        </mesh>

        {/* Lid Right wall */}
        <mesh scale={0.999} castShadow material={outerMaterials} position={[(W + 0.04) / 2 - wall / 2, - (H - wall) / 2, 0]}>
          <boxGeometry args={[wall, H - wall, D + 0.04]} />
        </mesh>
      </group>

    </group>
  );
};
