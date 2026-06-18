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

export const SareeBox = ({ color, autoRotate, textureUrl, bgTextureUrl, activeFaces }: Props) => {
  const groupRef = useRef<THREE.Group>(null!);
  const texture = useTexture(textureUrl || 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=');
  const bgTex = useTexture(bgTextureUrl || 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=');
  texture.colorSpace = THREE.SRGBColorSpace;
  bgTex.colorSpace = THREE.SRGBColorSpace;

  useFrame((_, delta) => {
    if (groupRef.current && autoRotate) groupRef.current.rotation.y += delta * 0.2;
  });

  const W = 1.8;   // length
  const H = 0.3;   // height of base
  const D = 1.2;   // width/depth
  const wall = 0.02; // cardboard thickness
  
  const outerMaterials = useMemo(() => {
    return faceOrder.map(faceName => {
      const showLogo = !activeFaces || activeFaces[faceName] !== false;
      const activeTex = showLogo && textureUrl ? texture : (bgTextureUrl ? bgTex : null);
      return new THREE.MeshPhysicalMaterial({
        color: activeTex ? '#ffffff' : color || '#f1dfc4', // Peach/tan like the image
        map: activeTex,
        roughness: 0.5,
        metalness: 0.0,
      });
    });
  }, [color, textureUrl, bgTextureUrl, activeFaces, texture, bgTex]);

  const innerMat = new THREE.MeshStandardMaterial({ color: '#ffffff', roughness: 0.8 });
  const innerWallMat = new THREE.MeshStandardMaterial({ color: '#f8f8f8', roughness: 0.8 });

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

        {/* Walls */}
        {/* Front wall */}
        <group position={[0, wall + (H - wall) / 2, D / 2 - wall / 2]}>
          {/* Outer */}
          <mesh scale={0.999} castShadow material={outerMaterials} position={[0, 0, 0]}>
            <boxGeometry args={[W, H - wall, wall]} />
          </mesh>
          {/* Inner liner */}
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
      <group position={[0, H + 0.5, -0.4]} rotation={[0.4, 0, 0]}>
        {/* Lid Roof */}
        <mesh scale={0.999} castShadow material={outerMaterials} position={[0, wall / 2, 0]}>
          <boxGeometry args={[W + 0.04, wall, D + 0.04]} />
        </mesh>
        
        {/* Inner white roof */}
        <mesh scale={0.999} position={[0, -0.001, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <planeGeometry args={[W + 0.02, D + 0.02]} />
          <primitive object={innerMat} attach="material" />
        </mesh>

        {/* Lid Front wall */}
        <mesh scale={0.999} castShadow material={outerMaterials} position={[0, - (H - wall) / 2, D / 2 + 0.02 - wall / 2]}>
          <boxGeometry args={[W + 0.04, H - wall, wall]} />
        </mesh>

        {/* Lid Back wall */}
        <mesh scale={0.999} castShadow material={outerMaterials} position={[0, - (H - wall) / 2, -D / 2 - 0.02 + wall / 2]}>
          <boxGeometry args={[W + 0.04, H - wall, wall]} />
        </mesh>

        {/* Lid Left wall */}
        <mesh scale={0.999} castShadow material={outerMaterials} position={[-W / 2 - 0.02 + wall / 2, - (H - wall) / 2, 0]}>
          <boxGeometry args={[wall, H - wall, D]} />
        </mesh>

        {/* Lid Right wall */}
        <mesh scale={0.999} castShadow material={outerMaterials} position={[W / 2 + 0.02 - wall / 2, - (H - wall) / 2, 0]}>
          <boxGeometry args={[wall, H - wall, D]} />
        </mesh>
      </group>

    </group>
  );
};
