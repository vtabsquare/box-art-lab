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
 * FancyTeaBox — A premium tall carton with an open top.
 * Features a decorative cloud-shaped tuck tab, and open dust flaps mimicking the reference image.
 */
export const FancyTeaBox = ({ color, autoRotate, textureUrl, bgTextureUrl, activeFaces }: Props) => {
  const groupRef = useRef<THREE.Group>(null!);
  const EMPTY = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=';
  const texture = useTexture(textureUrl || EMPTY);
  const bgTex   = useTexture(bgTextureUrl || EMPTY);
  texture.colorSpace = THREE.SRGBColorSpace;
  bgTex.colorSpace   = THREE.SRGBColorSpace;

  useFrame((_, delta) => {
    if (groupRef.current && autoRotate) groupRef.current.rotation.y += delta * 0.25;
  });

  const W    = 1.2;
  const H    = 1.6;
  const D    = 0.8;
  const wall = 0.02;

  // Materials
  const materials = useMemo(() => {
    return faceOrder.map(faceName => {
      const showLogo = !activeFaces || activeFaces[faceName] !== false;
      const activeTex = showLogo && textureUrl ? texture : (bgTextureUrl ? bgTex : null);
      return new THREE.MeshPhysicalMaterial({
        color: activeTex ? '#ffffff' : color || '#f5f7f2', // Light cream default
        map: activeTex ?? undefined,
        roughness: 0.8,
        metalness: 0.0,
      });
    });
  }, [color, textureUrl, bgTextureUrl, activeFaces, texture, bgTex]);

  const innerMat = useMemo(() => new THREE.MeshStandardMaterial({
    color: color || '#fdfdfc', // Clean white interior
    roughness: 0.9,
  }), [color]);

  // Generate the decorative cloud-shaped tuck tab
  const tuckTabGeometry = useMemo(() => {
    const shape = new THREE.Shape();
    const hw = W / 2;
    const td = D / 1.5; // Tab height

    shape.moveTo(-hw + 0.1, 0);
    shape.lineTo(-hw + 0.1, td * 0.2); // straight part left
    // left small bump
    shape.quadraticCurveTo(-hw + 0.2, td * 0.4, -hw + 0.35, td * 0.35);
    // middle large bump
    shape.quadraticCurveTo(0, td * 0.9, hw - 0.35, td * 0.35);
    // right small bump
    shape.quadraticCurveTo(hw - 0.2, td * 0.4, hw - 0.1, td * 0.2);
    shape.lineTo(hw - 0.1, 0); // straight part right
    shape.lineTo(-hw + 0.1, 0);

    return new THREE.ExtrudeGeometry(shape, { depth: wall, bevelEnabled: false });
  }, [W, D, wall]);

  // Open angles matching image
  const dustFlapAngle = Math.PI * 0.25; // 45 deg outwards
  const mainFlapAngle = -Math.PI * 0.4; // flipped back ~70 deg
  const frontLipAngle = Math.PI * 0.4;  // folded forward/down

  return (
    <group ref={groupRef} position={[0, -H / 2, 0]}>

      {/* ── Floor ── */}
      <mesh scale={0.999} castShadow receiveShadow material={materials} position={[0, wall / 2, 0]}>
        <boxGeometry args={[W - 2 * wall, wall, D - 2 * wall]} />
      </mesh>
      {/* Inner floor */}
      <mesh scale={0.999} receiveShadow position={[0, wall + 0.001, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[W - 2 * wall, D - 2 * wall]} />
        <primitive object={innerMat} attach="material" />
      </mesh>

      {/* ── Side Walls ── */}
      {/* Front */}
      <mesh scale={0.999} castShadow receiveShadow material={materials}
        position={[0, wall + (H - wall) / 2, D / 2 - wall / 2]}>
        <boxGeometry args={[W, H - wall, wall]} />
      </mesh>
      <mesh scale={0.999} receiveShadow position={[0, wall + (H - wall) / 2, D / 2 - wall - 0.001]} rotation={[0, Math.PI, 0]}>
        <planeGeometry args={[W - 2 * wall, H - wall]} />
        <primitive object={innerMat} attach="material" />
      </mesh>

      {/* Back */}
      <mesh scale={0.999} castShadow receiveShadow material={materials}
        position={[0, wall + (H - wall) / 2, -D / 2 + wall / 2]}>
        <boxGeometry args={[W, H - wall, wall]} />
      </mesh>
      <mesh scale={0.999} receiveShadow position={[0, wall + (H - wall) / 2, -D / 2 + wall + 0.001]}>
        <planeGeometry args={[W - 2 * wall, H - wall]} />
        <primitive object={innerMat} attach="material" />
      </mesh>

      {/* Left */}
      <mesh scale={0.999} castShadow receiveShadow material={materials}
        position={[-W / 2 + wall / 2, wall + (H - wall) / 2, 0]}>
        <boxGeometry args={[wall, H - wall, D - 2 * wall]} />
      </mesh>
      <mesh scale={0.999} receiveShadow position={[-W / 2 + wall + 0.001, wall + (H - wall) / 2, 0]} rotation={[0, Math.PI / 2, 0]}>
        <planeGeometry args={[D - 2 * wall, H - wall]} />
        <primitive object={innerMat} attach="material" />
      </mesh>

      {/* Right */}
      <mesh scale={0.999} castShadow receiveShadow material={materials}
        position={[W / 2 - wall / 2, wall + (H - wall) / 2, 0]}>
        <boxGeometry args={[wall, H - wall, D - 2 * wall]} />
      </mesh>
      <mesh scale={0.999} receiveShadow position={[W / 2 - wall - 0.001, wall + (H - wall) / 2, 0]} rotation={[0, -Math.PI / 2, 0]}>
        <planeGeometry args={[D - 2 * wall, H - wall]} />
        <primitive object={innerMat} attach="material" />
      </mesh>

      {/* ── Top Flaps ── */}

      {/* Front small lip/flap (folded forward) */}
      <group position={[0, H, D / 2 - wall / 2]} rotation={[frontLipAngle, 0, 0]}>
        <mesh scale={0.999} castShadow material={materials} position={[0, wall / 2, D / 10]}>
          <boxGeometry args={[W - 2 * wall, wall, D / 5]} />
        </mesh>
        <mesh scale={0.999} receiveShadow position={[0, -0.001, D / 10]} rotation={[Math.PI / 2, 0, 0]}>
          <planeGeometry args={[W - 2 * wall, D / 5]} />
          <primitive object={innerMat} attach="material" />
        </mesh>
      </group>

      {/* Left dust flap (pointing up/outwards) */}
      <group position={[-W / 2 + wall, H, 0]} rotation={[0, 0, dustFlapAngle]}>
        <mesh scale={0.999} castShadow material={materials} position={[W / 6, wall / 2, 0]}>
          <boxGeometry args={[W / 3, wall, D - 2 * wall]} />
        </mesh>
        <mesh scale={0.999} receiveShadow position={[W / 6, -0.001, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <planeGeometry args={[W / 3, D - 2 * wall]} />
          <primitive object={innerMat} attach="material" />
        </mesh>
      </group>

      {/* Right dust flap (pointing up/outwards) */}
      <group position={[W / 2 - wall, H, 0]} rotation={[0, 0, -dustFlapAngle]}>
        <mesh scale={0.999} castShadow material={materials} position={[-W / 6, wall / 2, 0]}>
          <boxGeometry args={[W / 3, wall, D - 2 * wall]} />
        </mesh>
        <mesh scale={0.999} receiveShadow position={[-W / 6, -0.001, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <planeGeometry args={[W / 3, D - 2 * wall]} />
          <primitive object={innerMat} attach="material" />
        </mesh>
      </group>

      {/* Back major flap (flipped backwards) */}
      <group position={[0, H, -D / 2 + wall / 2]} rotation={[mainFlapAngle, 0, 0]}>
        <mesh scale={0.999} castShadow material={materials} position={[0, wall / 2, D / 2]}>
          <boxGeometry args={[W, wall, D]} />
        </mesh>
        <mesh scale={0.999} receiveShadow position={[0, -0.001, D / 2]} rotation={[Math.PI / 2, 0, 0]}>
          <planeGeometry args={[W, D]} />
          <primitive object={innerMat} attach="material" />
        </mesh>
        
        {/* Decorative tuck tab attached to the end of the major flap */}
        <group position={[0, wall / 2, D]} rotation={[Math.PI / 2 + 0.1, 0, 0]}>
          {/* Main body of tuck tab extruded from shape */}
          <mesh scale={0.999} castShadow material={materials} geometry={tuckTabGeometry} position={[0, 0, -wall / 2]} />
          
          {/* Inner surface of tuck tab */}
          {/* We'll just rely on the side faces of the extrude taking the material, or it's small enough not to matter. */}
        </group>
      </group>

    </group>
  );
};
