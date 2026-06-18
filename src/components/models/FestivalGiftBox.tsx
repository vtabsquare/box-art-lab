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
 * Festival Gift Box - A hinged magnetic rigid box.
 * Solid color base, flip-top lid hinged at the back.
 */
export const FestivalGiftBox = ({ color, autoRotate, textureUrl, bgTextureUrl, activeFaces }: Props) => {
  const groupRef = useRef<THREE.Group>(null!);
  const texture = useTexture(textureUrl || 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=');
  const bgTex = useTexture(bgTextureUrl || 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=');
  texture.colorSpace = THREE.SRGBColorSpace;
  bgTex.colorSpace = THREE.SRGBColorSpace;

  useFrame((_, delta) => {
    if (groupRef.current && autoRotate) groupRef.current.rotation.y += delta * 0.25;
  });
  const materials = useMemo(() => {
    return faceOrder.map(faceName => {
      const showLogo = !activeFaces || activeFaces[faceName] !== false;
      const activeTex = showLogo && textureUrl ? texture : (bgTextureUrl ? bgTex : null);
      return new THREE.MeshPhysicalMaterial({
        color: activeTex ? '#ffffff' : color || '#e0e0e0', // plain light grey/white default to avoid color/design
        map: activeTex,
        roughness: 0.5,
        metalness: 0.1,
        clearcoat: 0.1,
      });
    });
  }, [color, textureUrl, bgTextureUrl, activeFaces, texture, bgTex]);

  const BW = 2.0; // Box Width
  const BD = 2.0; // Box Depth
  const BH = 0.8; // Box Height
  const wallT = 0.04; // Wall Thickness

  return (
    <group ref={groupRef} position={[0, -BH / 2, 0]}>
      {/* ── BASE TRAY ── */}
      {/* Bottom Floor */}
      <mesh scale={0.999} position={[0, wallT / 2, 0]} castShadow receiveShadow>
        <boxGeometry args={[BW - wallT * 2, wallT, BD - wallT * 2]} />
        <meshStandardMaterial color="#ffffff" roughness={0.7} />
      </mesh>
      {/* Front Wall */}
      <mesh scale={0.999} material={materials} position={[0, BH / 2, BD / 2 - wallT / 2]} castShadow receiveShadow>
        <boxGeometry args={[BW, BH, wallT]} />
      </mesh>
      {/* Back Wall */}
      <mesh scale={0.999} material={materials} position={[0, BH / 2, -BD / 2 + wallT / 2]} castShadow receiveShadow>
        <boxGeometry args={[BW, BH, wallT]} />
      </mesh>
      {/* Left Wall */}
      <mesh scale={0.999} material={materials} position={[-BW / 2 + wallT / 2, BH / 2, 0]} castShadow receiveShadow>
        <boxGeometry args={[wallT, BH, BD]} />
      </mesh>
      {/* Right Wall */}
      <mesh scale={0.999} material={materials} position={[BW / 2 - wallT / 2, BH / 2, 0]} castShadow receiveShadow>
        <boxGeometry args={[wallT, BH, BD]} />
      </mesh>
      {/* Bottom Cover (wrap around base) */}
      <mesh scale={0.999} material={materials} position={[0, -wallT / 2, 0]} castShadow receiveShadow>
        <boxGeometry args={[BW, wallT, BD]} />
      </mesh>

      {/* ── HINGED LID COVER ── */}
      {/* Hinged at the bottom back edge of the base tray so it can wrap around, or top back edge?
          In many rigid boxes, the cover attaches to the bottom, goes up the back, and over the top.
          Let's attach the hinge at the top of the back wall. */}
      <group position={[0, BH, -BD / 2]} rotation={[-Math.PI * 0.35, 0, 0]}>
        {/* Top Panel (Lid) */}
        <mesh scale={0.999} material={materials} position={[0, wallT / 2, BD / 2]} castShadow receiveShadow>
          <boxGeometry args={[BW, wallT, BD]} />
        </mesh>
        
        {/* Inner lining of the top panel */}
        <mesh scale={0.999} position={[0, -0.001, BD / 2]} receiveShadow>
          <boxGeometry args={[BW - 0.02, wallT, BD - 0.02]} />
          <meshStandardMaterial color="#ffffff" roughness={0.7} />
        </mesh>

        {/* Front Flap (Magnetic closure flap) */}
        {/* Attached to the front edge of the top panel (Z = BD), pointing down (negative Y) */}
        <mesh scale={0.999} material={materials} position={[0, -BH / 2 + wallT, BD + wallT / 2]} castShadow receiveShadow>
          <boxGeometry args={[BW, BH, wallT]} />
        </mesh>
        
        {/* Inner lining of the front flap */}
        <mesh scale={0.999} position={[0, -BH / 2 + wallT, BD - 0.001]} receiveShadow>
          <boxGeometry args={[BW - 0.02, BH - 0.02, wallT]} />
          <meshStandardMaterial color="#ffffff" roughness={0.7} />
        </mesh>
      </group>
      
      {/* Outer Back Cover Panel (Fixed part of the cover) */}
      {/* Since the hinge is at the top back, this panel is fixed to the back of the box */}
      <mesh scale={0.999} material={materials} position={[0, BH / 2, -BD / 2 - wallT / 2]} castShadow receiveShadow>
        <boxGeometry args={[BW, BH, wallT]} />
      </mesh>

    </group>
  );
};
