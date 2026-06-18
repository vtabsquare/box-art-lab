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

export const SideGussetPouch = ({ color, autoRotate, textureUrl, bgTextureUrl, activeFaces }: Props) => {
  const groupRef = useRef<THREE.Group>(null!);
  
  const texture = useTexture(textureUrl || 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=');
  const bgTex = useTexture(bgTextureUrl || 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=');
  texture.colorSpace = THREE.SRGBColorSpace;
  bgTex.colorSpace = THREE.SRGBColorSpace;

  useFrame((_, dt) => {
    if (groupRef.current && autoRotate) groupRef.current.rotation.y += dt * 0.3;
  });

  const baseColor = color || '#d84b2c';
  const materials = useMemo(() => {
    return faceOrder.map(faceName => {
      const showLogo = !activeFaces || activeFaces[faceName] !== false;
      const activeTex = showLogo && textureUrl ? texture : (bgTextureUrl ? bgTex : null);
      
      // Polythene / Plastic material properties
      return new THREE.MeshPhysicalMaterial({
        color: activeTex ? '#ffffff' : baseColor,
        map: activeTex,
        roughness: 0.35,
        metalness: 0.05,
        clearcoat: 0.4,
        clearcoatRoughness: 0.2,
        side: THREE.FrontSide,
      });
    });
  }, [baseColor, textureUrl, bgTextureUrl, activeFaces, texture, bgTex]);

  const W = 1.2;
  const H = 2.4;
  const D = 0.6;
  const T_Depth = 0.02; // Very thin at the top seal

  const pouchGeometry = useMemo(() => {
    // 4 width segments, 32 height segments, 2 depth segments for high-res bending
    const geo = new THREE.BoxGeometry(W, H, D, 4, 32, 2);
    const pos = geo.attributes.position;
    
    for (let i = 0; i < pos.count; i++) {
      let x = pos.getX(i);
      const y = pos.getY(i);
      let z = pos.getZ(i);

      let ny = (y + H / 2) / H; // 0 at bottom, 1 at top
      ny = Math.max(0, Math.min(1, ny)); // Prevent NaN

      // The bag is blocky up to pinchStart, then pinches to the seal
      const pinchStart = 0.8;
      let targetZ = D / 2;
      let targetW = W;
      let p = 0; // Pinch factor (0 to 1)

      if (ny > pinchStart) {
        p = (ny - pinchStart) / (1 - pinchStart);
        targetZ = (D / 2) * (1 - p) + (T_Depth / 2) * p;
        targetW = W * (1 - p) + (W * 0.96) * p;
      }

      // Calculate edge factor for smooth puffing
      const edgeFactor = Math.max(0, 1 - Math.abs(x) / (W / 2));

      // Adjust Z for front and back faces
      if (z > 0.01) {
        z = targetZ;
        // Puff the front face outwards slightly in the main body
        if (ny < pinchStart) {
          const bodyNy = ny / pinchStart; // 0 to 1 within the body
          const puff = Math.sin(bodyNy * Math.PI) * Math.pow(edgeFactor, 1.5) * 0.06;
          z += puff;
        }
      } else if (z < -0.01) {
        z = -targetZ;
        // Puff the back face
        if (ny < pinchStart) {
          const bodyNy = ny / pinchStart;
          const puff = Math.sin(bodyNy * Math.PI) * Math.pow(edgeFactor, 1.5) * 0.06;
          z -= puff;
        }
      }

      // Adjust X for the side gussets
      if (Math.abs(z) < 0.01) { 
        // Side gusset fold forms a sharp V
        const foldAmount = targetZ * 0.95;
        
        if (x > 0.01) {
          x = targetW / 2 - foldAmount;
        } else if (x < -0.01) {
          x = -targetW / 2 + foldAmount;
        }
      } else { 
        // Front/back face vertices and corners
        if (x > 0.01) {
          x = (x / (W / 2)) * (targetW / 2);
        } else if (x < -0.01) {
          x = (x / (W / 2)) * (targetW / 2);
        }
      }

      pos.setXYZ(i, x, y, z);
    }
    
    geo.computeVertexNormals();
    return geo;
  }, [W, H, D, T_Depth]);

  return (
    <group ref={groupRef} position={[0, -0.2, 0]} scale={[1.1, 1.1, 1.1]}>
      {/* ── POUCH BODY ──────────────────────────────────────────────────────── */}
      <mesh scale={0.999} castShadow receiveShadow geometry={pouchGeometry} material={materials} />

      {/* ── TOP CRIMP SEAL ──────────────────────────────────────────────────── */}
      <mesh scale={0.999} position={[0, H / 2 + 0.05, 0]}>
        <boxGeometry args={[W * 0.96 + 0.02, 0.15, T_Depth + 0.01]} />
        <meshPhysicalMaterial color={baseColor} roughness={0.35} metalness={0.05} clearcoat={0.4} />
      </mesh>
    </group>
  );
};
