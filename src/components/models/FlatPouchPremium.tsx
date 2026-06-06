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

// Helper to create the bulging flat pouch geometry
const createFlatPouchGeometry = (W: number, H: number, D: number, maxBulge: number) => {
  const geo = new THREE.BoxGeometry(W, H, D, 1, 48, 1);
  const posAttribute = geo.attributes.position;
  const v = new THREE.Vector3();

  for (let i = 0; i < posAttribute.count; i++) {
    v.fromBufferAttribute(posAttribute, i);
    const ny = (v.y + H / 2) / H; // 0 at bottom, 1 at top
    
    // Flat pouch: bulge is max in the center (ny=0.5) and tapers to 0 at top and bottom
    // We add flat seal areas at top and bottom (ny < 0.1 or ny > 0.9)
    let bulge = 0;
    if (ny > 0.1 && ny < 0.9) {
      // Map 0.1 -> 0.9 to 0 -> 1 for the sine curve
      const curveNy = (ny - 0.1) / 0.8;
      bulge = maxBulge * Math.sin(curveNy * Math.PI);
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

export const FlatPouchPremium = ({ color, autoRotate, textureUrl, bgTextureUrl, activeFaces }: Props) => {
  const groupRef = useRef<THREE.Group>(null!);
  const texture = useTexture(textureUrl || 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=');
  const bgTex = useTexture(bgTextureUrl || 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=');
  texture.colorSpace = THREE.SRGBColorSpace;
  bgTex.colorSpace = THREE.SRGBColorSpace;

  useFrame((_, delta) => {
    if (groupRef.current && autoRotate) groupRef.current.rotation.y += delta * 0.3;
  });

  const W = 0.9;
  const H = 1.3;
  const D = 0.015; // Initial thickness
  const maxBulge = 0.12;
  const sealW = 0.035; // width of side seals

  const geo = useMemo(() => createFlatPouchGeometry(W, H, D, maxBulge), []);

  const faceOrder = ['right', 'left', 'top', 'bottom', 'front', 'back'];
  const materials = useMemo(() => {
    return faceOrder.map(faceName => {
      const showLogo = !activeFaces || activeFaces[faceName] !== false;
      const activeTex = showLogo && textureUrl ? texture : (bgTextureUrl ? bgTex : null);
      return new THREE.MeshPhysicalMaterial({
        color: activeTex ? '#ffffff' : color || '#2e4a3b',
        map: activeTex,
        roughness: 0.4,
        metalness: 0.15,
      });
    });
  }, [color, textureUrl, bgTextureUrl, activeFaces, texture, bgTex]);

  const sealMat = new THREE.MeshPhysicalMaterial({
    color: color || '#22382c',
    roughness: 0.5,
    metalness: 0.1,
  });

  return (
    <group ref={groupRef} position={[0, 0, 0]}>
      {/* ── Main Pouch Body ── */}
      <mesh castShadow receiveShadow geometry={geo} material={materials} />

      {/* ── Side Seals ── */}
      <mesh position={[-W / 2 + sealW / 2, 0, 0]}>
        <boxGeometry args={[sealW, H, D + 0.005]} />
        <primitive object={sealMat} attach="material" />
      </mesh>
      <mesh position={[W / 2 - sealW / 2, 0, 0]}>
        <boxGeometry args={[sealW, H, D + 0.005]} />
        <primitive object={sealMat} attach="material" />
      </mesh>

      {/* ── Top & Bottom Seals (Horizontal) ── */}
      <mesh position={[0, H / 2 - sealW / 2, 0]}>
        <boxGeometry args={[W, sealW, D + 0.005]} />
        <primitive object={sealMat} attach="material" />
      </mesh>
      <mesh position={[0, -H / 2 + sealW / 2, 0]}>
        <boxGeometry args={[W, sealW, D + 0.005]} />
        <primitive object={sealMat} attach="material" />
      </mesh>

      {/* ── Tear Notch ── */}
      {/* Subtle indent on the left side seal near the top */}
      <mesh position={[-W / 2, H / 2 - 0.15, 0]}>
        <cylinderGeometry args={[0.015, 0.015, D + 0.02, 16]} />
        <meshBasicMaterial color="#000000" />
      </mesh>
    </group>
  );
};
