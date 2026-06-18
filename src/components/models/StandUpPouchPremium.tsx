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

// Helper to create the bulging pouch geometry
const createPouchGeometry = (W: number, H: number, D: number, maxBulge: number) => {
  const geo = new THREE.BoxGeometry(W, H, D, 1, 48, 1);
  const posAttribute = geo.attributes.position;
  const v = new THREE.Vector3();

  for (let i = 0; i < posAttribute.count; i++) {
    v.fromBufferAttribute(posAttribute, i);
    const ny = (v.y + H / 2) / H; // 0 at bottom, 1 at top
    
    // Stand-up pouch: bulge is max at bottom (ny=0) and tapers to 0 at the top (ny=1)
    // We add a small flat area at the very top for the seal/zipper (ny > 0.85)
    let bulge = 0;
    if (ny < 0.85) {
      // Map 0 -> 0.85 to 0 -> 1 for the curve
      const curveNy = ny / 0.85;
      bulge = maxBulge * (1 - Math.pow(curveNy, 1.8));
    }

    if (v.z > 0) {
      v.z += bulge;
    } else if (v.z < 0) {
      v.z -= bulge;
    }
    
    posAttribute.setXYZ(i, v.x, v.y, v.z);
  }
  
  geo.computeVertexNormals();
  return geo;
};

export const StandUpPouchPremium = ({ color, autoRotate, textureUrl, bgTextureUrl, activeFaces }: Props) => {
  const groupRef = useRef<THREE.Group>(null!);
  const texture = useTexture(textureUrl || 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=');
  const bgTex = useTexture(bgTextureUrl || 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=');
  texture.colorSpace = THREE.SRGBColorSpace;
  bgTex.colorSpace = THREE.SRGBColorSpace;

  useFrame((_, delta) => {
    if (groupRef.current && autoRotate) groupRef.current.rotation.y += delta * 0.3;
  });

  const W = 1.0;
  const H = 1.5;
  const D = 0.02; // Initial thickness
  const maxBulge = 0.22;
  const sealW = 0.04; // width of side seals

  const geo = useMemo(() => createPouchGeometry(W, H, D, maxBulge), []);
  const materials = useMemo(() => {
    return faceOrder.map(faceName => {
      const showLogo = !activeFaces || activeFaces[faceName] !== false;
      const activeTex = showLogo && textureUrl ? texture : (bgTextureUrl ? bgTex : null);
      return new THREE.MeshPhysicalMaterial({
        color: activeTex ? '#ffffff' : color || '#e86a52',
        map: activeTex,
        roughness: 0.35,
        metalness: 0.1,
      });
    });
  }, [color, textureUrl, bgTextureUrl, activeFaces, texture, bgTex]);

  const sealMat = new THREE.MeshPhysicalMaterial({
    color: color || '#d85a42',
    roughness: 0.4,
    metalness: 0.1,
  });

  return (
    <group ref={groupRef} position={[0, 0, 0]}>
      {/* ── Main Pouch Body ── */}
      <mesh scale={0.999} castShadow receiveShadow geometry={geo} material={materials} />

      {/* ── Side Seals ── */}
      <mesh scale={0.999} position={[-W / 2 + sealW / 2, 0, 0]}>
        <boxGeometry args={[sealW, H, D + 0.005]} />
        <primitive object={sealMat} attach="material" />
      </mesh>
      <mesh scale={0.999} position={[W / 2 - sealW / 2, 0, 0]}>
        <boxGeometry args={[sealW, H, D + 0.005]} />
        <primitive object={sealMat} attach="material" />
      </mesh>

      {/* ── Bottom Gusset Fill ── */}
      {/* Covers the gap at the bottom caused by the bulge */}
      <mesh position={[0, -H / 2 + 0.01, 0]} rotation={[Math.PI / 2, 0, 0]} scale={[W - sealW * 2, maxBulge * 2 + D, 1]}>
        <circleGeometry args={[0.5, 32]} />
        <primitive object={sealMat} attach="material" />
      </mesh>

      {/* ── Zip Lock Line ── */}
      <mesh scale={0.999} position={[0, H / 2 - 0.25, D / 2 + 0.005]}>
        <boxGeometry args={[W - sealW * 2, 0.02, 0.005]} />
        <meshStandardMaterial color="#ffffff" transparent opacity={0.3} />
      </mesh>

      {/* ── Top Euro Hole Cutout (Simulated with a contrasting shape) ── */}
      <mesh scale={0.999} position={[0, H / 2 - 0.1, 0]} rotation={[Math.PI / 2, 0, 0]}>
        {/* A simple ring to simulate the hanging hole punch */}
        <cylinderGeometry args={[0.04, 0.04, D + 0.01, 16]} />
        <meshBasicMaterial color="#000000" />
      </mesh>
      {/* Euro hole side slots */}
      <mesh scale={0.999} position={[-0.06, H / 2 - 0.1, 0]}>
         <boxGeometry args={[0.06, 0.02, D + 0.01]} />
         <meshBasicMaterial color="#000000" />
      </mesh>
      <mesh scale={0.999} position={[0.06, H / 2 - 0.1, 0]}>
         <boxGeometry args={[0.06, 0.02, D + 0.01]} />
         <meshBasicMaterial color="#000000" />
      </mesh>
    </group>
  );
};
