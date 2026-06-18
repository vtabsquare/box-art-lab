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

export const HexagonHatBox = ({ color, autoRotate, textureUrl, bgTextureUrl, activeFaces }: Props) => {
  const groupRef = useRef<THREE.Group>(null!);
  const texture = useTexture(textureUrl || 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=');
  const bgTex = useTexture(bgTextureUrl || 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=');
  texture.colorSpace = THREE.SRGBColorSpace;
  bgTex.colorSpace = THREE.SRGBColorSpace;

  useFrame((_, delta) => {
    if (groupRef.current && autoRotate) groupRef.current.rotation.y += delta * 0.2;
  });

  const R = 0.8;       // Outer radius (distance from center to corner)
  const H = 0.6;       // Base height
  const lidH = 0.3;    // Lid height
  const wall = 0.05;   // Wall thickness
  const collarH = 0.2; // How much the inner collar sticks out above the base

  const outerMaterials = useMemo(() => {
    // Applying material to the outer box. We use the same for all faces here since it's a cylinder.
    const showLogo = !activeFaces || activeFaces['top'] !== false;
    const activeTex = (showLogo && textureUrl) ? texture : (bgTextureUrl ? bgTex : null);
    return new THREE.MeshPhysicalMaterial({
      color: activeTex ? '#ffffff' : color || '#e38b42', // Orange like the image
      map: activeTex,
      roughness: 0.7,
      metalness: 0.0,
      side: THREE.FrontSide
    });
  }, [color, textureUrl, bgTextureUrl, activeFaces, texture, bgTex]);

  const innerMat = new THREE.MeshStandardMaterial({ color: '#ffffff', roughness: 0.9, side: THREE.FrontSide });
  const innerBackMat = new THREE.MeshStandardMaterial({ color: '#ffffff', roughness: 0.9, side: THREE.BackSide });

  // Create the insert shape with a circular hole
  const insertShape = useMemo(() => {
    const R_inner = R - wall * 1.5;
    const shape = new THREE.Shape();
    for (let i = 0; i < 6; i++) {
      const angle = (Math.PI / 3) * i;
      const x = R_inner * Math.cos(angle);
      const y = R_inner * Math.sin(angle);
      if (i === 0) shape.moveTo(x, y);
      else shape.lineTo(x, y);
    }
    shape.lineTo(R_inner, 0);

    const holePath = new THREE.Path();
    holePath.absarc(0, 0, R_inner * 0.55, 0, Math.PI * 2, false);
    shape.holes.push(holePath);
    return shape;
  }, [R, wall]);

  // Rotated by 30 degrees (PI/6) so flat faces face the camera instead of sharp corners
  return (
    <group ref={groupRef} position={[0, -H / 2, 0]}>
      
      {/* ── BASE TRAY ── */}
      <group position={[0, H / 2, 0]}>
        
        {/* Outer Orange Walls */}
        <mesh scale={0.999} castShadow receiveShadow material={outerMaterials}>
          <cylinderGeometry args={[R, R, H, 6, 1, true]} />
        </mesh>
        
        {/* Outer Orange Floor (Bottom cap) */}
        <mesh scale={0.999} receiveShadow material={outerMaterials} position={[0, -H / 2, 0]} rotation={[Math.PI / 2, 0, Math.PI / 6]}>
          <circleGeometry args={[R, 6]} />
        </mesh>

        {/* Inner White Collar (Sticks up) */}
        <mesh scale={0.999} castShadow receiveShadow material={innerBackMat} position={[0, collarH / 2, 0]}>
          <cylinderGeometry args={[R - wall, R - wall, H + collarH, 6, 1, true]} />
        </mesh>
        
        {/* Inner White Floor */}
        <mesh scale={0.999} receiveShadow material={innerMat} position={[0, -H / 2 + 0.01, 0]} rotation={[-Math.PI / 2, 0, Math.PI / 6]}>
          <circleGeometry args={[R - wall, 6]} />
        </mesh>

        {/* Insert with circular hole */}
        <mesh scale={0.999} receiveShadow material={innerMat} position={[0, H / 2 + collarH - 0.05, 0]} rotation={[-Math.PI / 2, 0, Math.PI / 6]}>
          <shapeGeometry args={[insertShape]} />
        </mesh>

        {/* Inside cup/cylinder for the hole */}
        <mesh scale={0.999} receiveShadow material={innerBackMat} position={[0, (H / 2 + collarH - 0.05) / 2 - H / 2, 0]}>
          <cylinderGeometry args={[ (R - wall * 1.5) * 0.55, (R - wall * 1.5) * 0.55, H + collarH - 0.05, 32, 1, true]} />
        </mesh>
      </group>

      {/* ── HOVERING LID ── */}
      <group position={[-1.2, H + lidH + 0.5, 0.5]} rotation={[0.5, -0.4, 0.2]}>
        
        {/* Lid Outer Orange Walls */}
        <mesh scale={0.999} castShadow receiveShadow material={outerMaterials} position={[0, 0, 0]}>
          <cylinderGeometry args={[R + 0.01, R + 0.01, lidH, 6, 1, true]} />
        </mesh>
        
        {/* Lid Outer Orange Roof */}
        <mesh scale={0.999} castShadow material={outerMaterials} position={[0, lidH / 2, 0]} rotation={[-Math.PI / 2, 0, Math.PI / 6]}>
          <circleGeometry args={[R + 0.01, 6]} />
        </mesh>

        {/* Lid Inner White Walls */}
        <mesh scale={0.999} receiveShadow material={innerBackMat} position={[0, 0, 0]}>
          <cylinderGeometry args={[R + 0.01 - wall, R + 0.01 - wall, lidH, 6, 1, true]} />
        </mesh>
        
        {/* Lid Inner White Roof */}
        <mesh scale={0.999} receiveShadow material={innerMat} position={[0, lidH / 2 - 0.005, 0]} rotation={[Math.PI / 2, 0, Math.PI / 6]}>
          <circleGeometry args={[R + 0.01 - wall, 6]} />
        </mesh>

        {/* Lid Rim Thickness (Connecting outer and inner walls at bottom) */}
        <mesh scale={0.999} material={outerMaterials} position={[0, -lidH / 2, 0]} rotation={[Math.PI / 2, 0, Math.PI / 6]}>
          <ringGeometry args={[R + 0.01 - wall, R + 0.01, 6]} />
        </mesh>
        
        {/* Base Rim Thickness (Connecting outer and inner base walls at top of base tray) */}
        {/* We place this in the Lid group just for code locality? No, wait, I forgot the base rim! */}
      </group>
      
      {/* Base Rim Thickness (Top of orange base wall) */}
      <mesh scale={0.999} material={outerMaterials} position={[0, H, 0]} rotation={[-Math.PI / 2, 0, Math.PI / 6]}>
        <ringGeometry args={[R - wall, R, 6]} />
      </mesh>

      {/* Collar Rim Thickness (Top of inner white collar) */}
      <mesh scale={0.999} material={innerMat} position={[0, H + collarH, 0]} rotation={[-Math.PI / 2, 0, Math.PI / 6]}>
        <ringGeometry args={[R - wall * 1.5, R - wall, 6]} />
      </mesh>

    </group>
  );
};
