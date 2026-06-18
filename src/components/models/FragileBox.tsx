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

export const FragileBox = ({ color, autoRotate, textureUrl, bgTextureUrl, activeFaces }: Props) => {
  const groupRef = useRef<THREE.Group>(null!);
  
  const texture = useTexture(textureUrl || 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=');
  const bgTex = useTexture(bgTextureUrl || 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=');
  texture.colorSpace = THREE.SRGBColorSpace;
  bgTex.colorSpace = THREE.SRGBColorSpace;

  useFrame((_, dt) => {
    if (groupRef.current && autoRotate) groupRef.current.rotation.y += dt * 0.3;
  });

  const extC = color || '#c09867'; // Rich corrugated cardboard brown matching Image 2

  const matInner = useMemo(() => new THREE.MeshStandardMaterial({
    color: extC,
    roughness: 0.9,
  }), [extC]);
  const extMaterials = useMemo(() => {
    return faceOrder.map(faceName => {
      const showLogo = !activeFaces || activeFaces[faceName] !== false;
      const activeTex = showLogo && textureUrl ? texture : (bgTextureUrl ? bgTex : null);
      
      return new THREE.MeshStandardMaterial({
        color: activeTex ? '#ffffff' : extC,
        map: activeTex,
        roughness: 0.9,
      });
    });
  }, [extC, textureUrl, bgTextureUrl, activeFaces, texture, bgTex]);

  const W = 3.2;
  const D = 2.4;
  const H = 1.0; // Deeper box
  const T = 0.04; // Single wall thickness
  const T2 = 0.08; // Double wall thickness for sides and front

  // Insert geometry dimensions
  const insertW = W - T2 * 2 - 0.02; // Fit inside double walls
  const insertD = D - T2 - T - 0.02; // Fit between front double wall and back single wall
  const holeSize = insertW * 0.35;
  const gap = insertW * 0.1;
  const lCX = -holeSize/2 - gap/2;
  const rCX = holeSize/2 + gap/2;
  
  const insertGeo = useMemo(() => {
    const shape = new THREE.Shape();
    // Main insert deck
    shape.moveTo(-insertW/2, -insertD/2);
    shape.lineTo(insertW/2, -insertD/2);
    shape.lineTo(insertW/2, insertD/2);
    shape.lineTo(-insertW/2, insertD/2);
    shape.lineTo(-insertW/2, -insertD/2);

    // Left hole (Clockwise winding)
    const hole1 = new THREE.Path();
    hole1.moveTo(lCX - holeSize/2, -holeSize/2);
    hole1.lineTo(lCX - holeSize/2, holeSize/2);
    hole1.lineTo(lCX + holeSize/2, holeSize/2);
    hole1.lineTo(lCX + holeSize/2, -holeSize/2);
    hole1.lineTo(lCX - holeSize/2, -holeSize/2);
    shape.holes.push(hole1);

    // Right hole (Clockwise winding)
    const hole2 = new THREE.Path();
    hole2.moveTo(rCX - holeSize/2, -holeSize/2);
    hole2.lineTo(rCX - holeSize/2, holeSize/2);
    hole2.lineTo(rCX + holeSize/2, holeSize/2);
    hole2.lineTo(rCX + holeSize/2, -holeSize/2);
    hole2.lineTo(rCX - holeSize/2, -holeSize/2);
    shape.holes.push(hole2);

    return new THREE.ExtrudeGeometry(shape, {
      depth: T,
      bevelEnabled: false,
    });
  }, [insertW, insertD, T, holeSize, gap, lCX, rCX]);

  return (
    <group ref={groupRef} position={[0, -0.4, 0]} scale={[1.2, 1.2, 1.2]}>
      {/* ── BASE & WALLS ── */}
      <mesh scale={0.999} position={[0, T/2, 0]} castShadow receiveShadow material={[matInner, matInner, matInner, extMaterials[3], matInner, matInner]}>
        <boxGeometry args={[W, T, D]} />
      </mesh>
      
      {/* Left Wall (Double thick) */}
      <mesh scale={0.999} position={[-W/2 + T2/2, H/2, 0]} castShadow receiveShadow material={[matInner, extMaterials[1], matInner, matInner, matInner, matInner]}>
        <boxGeometry args={[T2, H, D]} />
      </mesh>

      {/* Right Wall (Double thick) */}
      <mesh scale={0.999} position={[W/2 - T2/2, H/2, 0]} castShadow receiveShadow material={[extMaterials[0], matInner, matInner, matInner, matInner, matInner]}>
        <boxGeometry args={[T2, H, D]} />
      </mesh>

      {/* Back Wall (Single thick, where lid hinges) */}
      <mesh scale={0.999} position={[0, H/2, -D/2 + T/2]} castShadow receiveShadow material={[matInner, matInner, matInner, matInner, matInner, extMaterials[5]]}>
        <boxGeometry args={[W, H, T]} />
      </mesh>

      {/* Front Wall (Double thick) */}
      <mesh scale={0.999} position={[0, H/2, D/2 - T2/2]} castShadow receiveShadow material={[matInner, matInner, matInner, matInner, extMaterials[4], matInner]}>
        <boxGeometry args={[W, H, T2]} />
      </mesh>

      {/* ── LID (STANDING UP) ── */}
      {/* Hinged at the top of the back wall */}
      <group position={[0, H, -D/2 + T/2]} rotation={[0.2, 0, 0]}>
        {/* Main lid panel */}
        <mesh scale={0.999} position={[0, D/2, T/2]} castShadow receiveShadow material={[matInner, matInner, matInner, matInner, matInner, extMaterials[2]]}>
          <boxGeometry args={[W, D, T]} />
        </mesh>
        
        {/* Lid Front Tuck Flap */}
        <mesh scale={0.999} position={[0, D, T/2 + 0.2]} rotation={[Math.PI / 2 - 0.1, 0, 0]} castShadow receiveShadow>
          <boxGeometry args={[W * 0.96, 0.4, T]} />
          <primitive object={matInner} />
        </mesh>
        
        {/* Lid side flaps (Dust flaps) */}
        <mesh scale={0.999} position={[-W/2 + T/2 + 0.1, D/2, T/2 + 0.2]} rotation={[0, Math.PI / 2 - 0.1, 0]} castShadow receiveShadow>
           <boxGeometry args={[0.4, D * 0.8, T]} />
           <primitive object={matInner} />
        </mesh>
        <mesh scale={0.999} position={[W/2 - T/2 - 0.1, D/2, T/2 + 0.2]} rotation={[0, -Math.PI / 2 + 0.1, 0]} castShadow receiveShadow>
           <boxGeometry args={[0.4, D * 0.8, T]} />
           <primitive object={matInner} />
        </mesh>
      </group>

      {/* ── INSERT ── */}
      <group position={[0, H - 0.2, 0]}>
         {/* Insert Deck */}
         <mesh scale={0.999} rotation={[Math.PI / 2, 0, 0]} geometry={insertGeo} castShadow receiveShadow>
            <primitive object={matInner} />
         </mesh>
         
         {/* Insert Compartment Walls (Left hole) */}
         <mesh scale={0.999} position={[lCX, -H/2 + 0.1, 0]} castShadow receiveShadow>
            <boxGeometry args={[holeSize, H - 0.2, holeSize]} />
            <meshStandardMaterial color={extC} roughness={0.9} side={THREE.BackSide} />
         </mesh>
         
         {/* Insert Compartment Walls (Right hole) */}
         <mesh scale={0.999} position={[rCX, -H/2 + 0.1, 0]} castShadow receiveShadow>
            <boxGeometry args={[holeSize, H - 0.2, holeSize]} />
            <meshStandardMaterial color={extC} roughness={0.9} side={THREE.BackSide} />
         </mesh>
      </group>
    </group>
  );
};
