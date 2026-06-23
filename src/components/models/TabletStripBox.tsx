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
 * TabletStripBox - A standard closed carton box (reverse tuck end).
 * Includes a realistic blister pack of capsules displayed next to it, matching the reference image.
 */
export const TabletStripBox = ({ color, autoRotate, textureUrl, bgTextureUrl, activeFaces }: Props) => {
  const groupRef = useRef<THREE.Group>(null!);
  const EMPTY = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=';
  const texture = useTexture(textureUrl || EMPTY);
  const bgTex = useTexture(bgTextureUrl || EMPTY);
  texture.colorSpace = THREE.SRGBColorSpace;
  bgTex.colorSpace = THREE.SRGBColorSpace;

  useFrame((_, delta) => {
    if (groupRef.current && autoRotate) groupRef.current.rotation.y += delta * 0.2;
  });

  const materials = useMemo(() => {
    return faceOrder.map(faceName => {
      const showLogo = !activeFaces || activeFaces[faceName] !== false;
      const activeTex = showLogo && textureUrl ? texture : (bgTextureUrl ? bgTex : null);
      return new THREE.MeshPhysicalMaterial({
        color: activeTex ? '#ffffff' : color || '#fdfdfc',
        map: activeTex,
        roughness: 0.8,
        metalness: 0.05,
      });
    });
  }, [color, textureUrl, bgTextureUrl, activeFaces, texture, bgTex]);

  // Box proportions (default 14L x 8W x 3H)
  const W = 1.4;
  const H = 0.3;
  const D = 0.8;

  // Blister pack materials
  const mFoil = useMemo(() => new THREE.MeshStandardMaterial({ 
    color: '#dddddd', 
    metalness: 0.8, 
    roughness: 0.3 
  }), []);

  const mBlister = useMemo(() => new THREE.MeshPhysicalMaterial({
    color: '#ffffff',
    transmission: 0.95,
    opacity: 1,
    metalness: 0,
    roughness: 0.1,
    ior: 1.5,
    thickness: 0.05,
    transparent: true
  }), []);

  const mCapsuleWhite = useMemo(() => new THREE.MeshStandardMaterial({ color: '#ffffff', roughness: 0.4 }), []);
  const mCapsuleGrey = useMemo(() => new THREE.MeshStandardMaterial({ color: '#e0e0e0', roughness: 0.4 }), []);

  // Blister pack dimensions
  const bW = 1.0;
  const bD = 0.6;
  const cols = 5;
  const rows = 2;

  const capsules = useMemo(() => {
    const caps = [];
    const spacingX = bW / cols;
    const spacingZ = bD / rows;

    for (let i = 0; i < cols; i++) {
      for (let j = 0; j < rows; j++) {
        const cx = -bW/2 + spacingX/2 + i * spacingX;
        const cz = -bD/2 + spacingZ/2 + j * spacingZ;
        
        caps.push(
          <group key={`cap-${i}-${j}`} position={[cx, 0.02, cz]}>
            {/* The transparent blister bubble (capsule-shaped half) */}
            <mesh material={mBlister} position={[0, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
              <capsuleGeometry args={[0.04, 0.1, 16, 16]} />
            </mesh>

            {/* The Pill/Capsule Inside */}
            {/* White Half */}
            <mesh material={mCapsuleWhite} position={[0.025, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
              <cylinderGeometry args={[0.03, 0.03, 0.05, 16]} />
            </mesh>
            <mesh material={mCapsuleWhite} position={[0.05, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
              <sphereGeometry args={[0.03, 16, 16, 0, Math.PI * 2, 0, Math.PI / 2]} />
            </mesh>

            {/* Grey Half */}
            <mesh material={mCapsuleGrey} position={[-0.025, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
              <cylinderGeometry args={[0.03, 0.03, 0.05, 16]} />
            </mesh>
            <mesh material={mCapsuleGrey} position={[-0.05, 0, 0]} rotation={[0, 0, -Math.PI / 2]}>
              <sphereGeometry args={[0.03, 16, 16, 0, Math.PI * 2, 0, Math.PI / 2]} />
            </mesh>
          </group>
        );
      }
    }
    return caps;
  }, [bW, bD, mBlister, mCapsuleWhite, mCapsuleGrey]);

  return (
    <group ref={groupRef} position={[0, -H / 2, 0]}>
      {/* ── THE CARTON BOX ── */}
      {/* Box standing up behind the blister pack to match the image composition */}
      <group position={[0, W / 2, -D / 1.5]} rotation={[Math.PI / 2, 0, 0]}>
        <mesh scale={0.999} material={materials} castShadow receiveShadow>
          <boxGeometry args={[W, H, D]} />
        </mesh>
      </group>

      {/* ── THE BLISTER PACK ── */}
      {/* Placed flat on the ground in front of the box */}
      <group position={[0, 0.01, D / 1.5]}>
        {/* Foil Base */}
        <mesh material={mFoil} receiveShadow castShadow>
          <boxGeometry args={[bW, 0.01, bD]} />
        </mesh>
        {/* Capsules and Blisters */}
        {capsules}
      </group>

    </group>
  );
};
