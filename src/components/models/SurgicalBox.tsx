/**
 * SurgicalBox / Medical Device Box
 * 
 * Architecture:
 *   - Empty RETF (Roll End Tuck Front) Mailer Box
 *   - Clean interior, double side walls
 *   - Lid hinged at the back, opened back with dust flaps and tuck flap
 *   - No hardcoded typography or extra colors, supports standard texture mapping
 */

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

const EMPTY_TEX = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=';

export const SurgicalBox = ({ color, autoRotate, textureUrl, bgTextureUrl, activeFaces }: Props) => {
  const groupRef = useRef<THREE.Group>(null!);
  const texture = useTexture(textureUrl || EMPTY_TEX);
  const bgTex = useTexture(bgTextureUrl || EMPTY_TEX);
  texture.colorSpace = THREE.SRGBColorSpace;
  bgTex.colorSpace = THREE.SRGBColorSpace;

  useFrame((_, dt) => {
    if (groupRef.current && autoRotate) groupRef.current.rotation.y += dt * 0.25;
  });

  const extC = color || '#ffffff';
  const mInner = useMemo(() => new THREE.MeshStandardMaterial({ color: '#f8f8f8', roughness: 0.9 }), []);
  const extMaterials = useMemo(() => {
    return faceOrder.map(faceName => {
      const showLogo = !activeFaces || activeFaces[faceName] !== false;
      const activeTex = showLogo && textureUrl ? texture : (bgTextureUrl ? bgTex : null);
      
      return new THREE.MeshStandardMaterial({
        color: activeTex ? '#ffffff' : extC,
        map: activeTex,
        roughness: 0.8,
      });
    });
  }, [extC, textureUrl, bgTextureUrl, activeFaces, texture, bgTex]);

  // Box Dimensions
  const BW = 2.4;
  const BD = 1.8;
  const BH = 0.5;
  const T = 0.04; // single wall thickness
  const T2 = 0.08; // double wall thickness

  return (
    <group ref={groupRef} position={[0, -0.2, 0]} scale={[1.1, 1.1, 1.1]}>
      
      {/* ── BASE & WALLS ── */}
      <mesh scale={0.999} position={[0, T/2, 0]} castShadow receiveShadow material={[mInner, mInner, mInner, extMaterials[3], mInner, mInner]}>
        <boxGeometry args={[BW, T, BD]} />
      </mesh>
      
      {/* Left Wall (Double thick) */}
      <mesh scale={0.999} position={[-BW/2 + T2/2, BH/2, 0]} castShadow receiveShadow material={[mInner, extMaterials[1], mInner, mInner, mInner, mInner]}>
        <boxGeometry args={[T2, BH, BD]} />
      </mesh>

      {/* Right Wall (Double thick) */}
      <mesh scale={0.999} position={[BW/2 - T2/2, BH/2, 0]} castShadow receiveShadow material={[extMaterials[0], mInner, mInner, mInner, mInner, mInner]}>
        <boxGeometry args={[T2, BH, BD]} />
      </mesh>

      {/* Back Wall (Single thick, where lid hinges) */}
      <mesh scale={0.999} position={[0, BH/2, -BD/2 + T/2]} castShadow receiveShadow material={[mInner, mInner, mInner, mInner, mInner, extMaterials[5]]}>
        <boxGeometry args={[BW, BH, T]} />
      </mesh>

      {/* Front Wall (Double thick) */}
      <mesh scale={0.999} position={[0, BH/2, BD/2 - T2/2]} castShadow receiveShadow material={[mInner, mInner, mInner, mInner, extMaterials[4], mInner]}>
        <boxGeometry args={[BW, BH, T2]} />
      </mesh>

      {/* ── LID (Hinged backward) ── */}
      <group position={[0, BH, -BD/2 + T/2]} rotation={[-0.8, 0, 0]}>
        {/* Main lid panel */}
        {/* Inner face is +Z (index 4), Outer face is -Z (index 5) mapping to 'top' (extMaterials[2]) */}
        <mesh scale={0.999} position={[0, BD/2, T/2]} castShadow receiveShadow material={[mInner, mInner, mInner, mInner, mInner, extMaterials[2]]}>
          <boxGeometry args={[BW, BD, T]} />
        </mesh>
        
        {/* Lid Front Tuck Flap */}
        {/* Folds inward 90 degrees */}
        <mesh scale={0.999} position={[0, BD, T/2 + 0.2]} rotation={[Math.PI / 2 - 0.1, 0, 0]} castShadow receiveShadow material={[mInner, mInner, mInner, mInner, mInner, mInner]}>
          <boxGeometry args={[BW * 0.96, 0.4, T]} />
        </mesh>
        
        {/* Lid side flaps (Dust flaps) */}
        {/* Fold inward 90 degrees */}
        <mesh scale={0.999} position={[-BW/2 + T/2 + 0.1, BD/2, T/2 + 0.2]} rotation={[0, Math.PI / 2 - 0.2, 0]} castShadow receiveShadow material={[mInner, mInner, mInner, mInner, mInner, mInner]}>
           <boxGeometry args={[0.3, BD * 0.8, T]} />
        </mesh>
        <mesh scale={0.999} position={[BW/2 - T/2 - 0.1, BD/2, T/2 + 0.2]} rotation={[0, -Math.PI / 2 + 0.2, 0]} castShadow receiveShadow material={[mInner, mInner, mInner, mInner, mInner, mInner]}>
           <boxGeometry args={[0.3, BD * 0.8, T]} />
        </mesh>
      </group>

    </group>
  );
};
