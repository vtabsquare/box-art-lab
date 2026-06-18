import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useTexture } from '@react-three/drei';


const faceOrder = ['right', 'left', 'top', 'bottom', 'front', 'back'];
interface Props {
  color: string;
  autoRotate: boolean;
  textureUrl?: string | null;
  bgTextureUrl?: string | null;
  activeFaces?: Record<string, boolean>;
}

export const SachetPouch = ({ color, autoRotate, textureUrl, bgTextureUrl, activeFaces }: Props) => {
  const groupRef = useRef<THREE.Group>(null!);
  
  const texture = useTexture(textureUrl || 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=');
  const bgTex = useTexture(bgTextureUrl || 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=');
  texture.colorSpace = THREE.SRGBColorSpace;
  bgTex.colorSpace = THREE.SRGBColorSpace;

  useFrame((_, dt) => {
    if (groupRef.current && autoRotate) groupRef.current.rotation.y += dt * 0.3;
  });

  const baseColor = color || '#000000'; // Default black for the shampoo sachet look
  const materials = useMemo(() => {
    return faceOrder.map(faceName => {
      const showLogo = !activeFaces || activeFaces[faceName] !== false;
      const activeTex = showLogo && textureUrl ? texture : (bgTextureUrl ? bgTex : null);
      
      // High-gloss Polythene / Metallized Film material
      return new THREE.MeshPhysicalMaterial({
        color: activeTex ? '#ffffff' : baseColor,
        map: activeTex,
        roughness: 0.15,
        metalness: 0.1,
        clearcoat: 1.0,
        clearcoatRoughness: 0.15,
        side: THREE.FrontSide,
      });
    });
  }, [baseColor, textureUrl, bgTextureUrl, activeFaces, texture, bgTex]);

  const BW = 1.0;
  const BH = 1.4; // Typical sachet aspect ratio
  const Puff_Depth = 0.18; // Max thickness in the liquid-filled center
  const Seal_W = 0.08; // Width of the crimped seal
  const Seal_Thickness = 0.01; // Thickness of the flat sealed edges

  const pouchGeometry = useMemo(() => {
    // 32x32 segments for very smooth pillow puffing
    const geo = new THREE.BoxGeometry(BW, BH, Puff_Depth, 32, 32, 2);
    const pos = geo.attributes.position;
    
    const sealThresholdX = (BW / 2 - Seal_W) / (BW / 2);
    const sealThresholdY = (BH / 2 - Seal_W) / (BH / 2);

    for (let i = 0; i < pos.count; i++) {
      const x = pos.getX(i);
      const y = pos.getY(i);
      let z = pos.getZ(i);

      // Normalize coordinates (-1 to 1)
      const nx = x / (BW / 2);
      const ny = y / (BH / 2);

      const absNx = Math.abs(nx);
      const absNy = Math.abs(ny);

      let targetZ = Seal_Thickness / 2;

      // If vertex is inside the puffed area (not on the seal)
      if (absNx < sealThresholdX && absNy < sealThresholdY) {
         // Map distance from seal edge to center (0 to 1)
         const puffX = 1 - (absNx / sealThresholdX);
         const puffY = 1 - (absNy / sealThresholdY);

         // Sine curve for smooth pillow-like liquid bulge
         const curve = Math.sin(puffX * Math.PI / 2) * Math.sin(puffY * Math.PI / 2);
         targetZ = (Seal_Thickness / 2) + (Puff_Depth / 2) * Math.pow(curve, 0.8);
      }

      // Add a tiny bit of high-frequency noise/ripple to the seal areas to mimic heat crimping
      if (absNy >= sealThresholdY) {
         // Vertical ridges on top and bottom seals
         targetZ += Math.sin(x * 120) * 0.002;
      } else if (absNx >= sealThresholdX) {
         // Horizontal ridges on side seals
         targetZ += Math.sin(y * 120) * 0.002;
      }

      if (z > 0) {
         z = targetZ;
      } else if (z < 0) {
         z = -targetZ;
      }

      pos.setXYZ(i, x, y, z);
    }
    
    geo.computeVertexNormals();
    return geo;
  }, [BW, BH, Puff_Depth, Seal_W, Seal_Thickness]);

  return (
    <group ref={groupRef} position={[0, 0, 0]} scale={[1.4, 1.4, 1.4]}>
      {/* ── POUCH BODY ──────────────────────────────────────────────────────── */}
      {/* A single continuous mesh with manipulated vertices for seamless textures */}
      <mesh scale={0.999} castShadow receiveShadow geometry={pouchGeometry} material={materials} />
    </group>
  );
};
