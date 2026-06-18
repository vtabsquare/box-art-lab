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

// Generic standard box used for multiple products — shows open-top tuck flap style
export const StandardBox = ({ color, autoRotate, textureUrl, bgTextureUrl, activeFaces, dimensions = [1, 1.4, 0.7] }: Props & { dimensions?: [number,number,number] }) => {
  const groupRef = useRef<THREE.Group>(null!);
  const texture = useTexture(textureUrl || 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=');
  const bgTex = useTexture(bgTextureUrl || 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=');
  texture.colorSpace = THREE.SRGBColorSpace;
  bgTex.colorSpace = THREE.SRGBColorSpace;
  
  useFrame((_, delta) => {
    if (groupRef.current && autoRotate) groupRef.current.rotation.y += delta * 0.35;
  });
  const materials = useMemo(() => {
    return faceOrder.map(faceName => {
      const showLogo = !activeFaces || activeFaces[faceName] !== false;
      const activeTex = showLogo && textureUrl ? texture : (bgTextureUrl ? bgTex : null);
      return new THREE.MeshPhysicalMaterial({
        color: activeTex ? '#ffffff' : color || '#888888',
        map: activeTex,
        roughness: 0.3,
        metalness: 0.05,
        clearcoat: 0.3,
        clearcoatRoughness: 0.2
      });
    });
  }, [color, textureUrl, bgTextureUrl, activeFaces, texture, bgTex]);

  return (
    <group ref={groupRef}>
      <mesh scale={0.999} castShadow material={materials}>
        <boxGeometry args={dimensions} />
      </mesh>
    </group>
  );
};

// Mailer box: two-part (base + lid that wraps over)
export const MailerBox = ({ color, autoRotate, textureUrl, bgTextureUrl, activeFaces, dimensions = [1.4, 0.42, 1.0] }: Props & { dimensions?: [number, number, number] }) => {
  const groupRef = useRef<THREE.Group>(null!);
  const texture = useTexture(textureUrl || 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=');
  const bgTex = useTexture(bgTextureUrl || 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=');
  texture.colorSpace = THREE.SRGBColorSpace;
  bgTex.colorSpace = THREE.SRGBColorSpace;
  
  useFrame((_, delta) => {
    if (groupRef.current && autoRotate) groupRef.current.rotation.y += delta * 0.35;
  });
  const materials = useMemo(() => {
    return faceOrder.map(faceName => {
      const showLogo = !activeFaces || activeFaces[faceName] !== false;
      const activeTex = showLogo && textureUrl ? texture : (bgTextureUrl ? bgTex : null);
      return new THREE.MeshPhysicalMaterial({
        color: activeTex ? '#ffffff' : color || '#FF9800',
        map: activeTex,
        roughness: 0.45,
        metalness: 0.0
      });
    });
  }, [color, textureUrl, bgTextureUrl, activeFaces, texture, bgTex]);

  return (
    <group ref={groupRef}>
      <mesh scale={0.999} castShadow material={materials} position={[0, -0.18, 0]}><boxGeometry args={[1.4, 0.42, 1.0]} /></mesh>
      <mesh scale={0.999} castShadow material={materials} position={[0, 0.08, 0.5]}><boxGeometry args={[1.4, 0.42, 0.015]} /></mesh>
      <mesh scale={0.999} castShadow material={materials} position={[0, 0.08, -0.5]}><boxGeometry args={[1.4, 0.42, 0.015]} /></mesh>
      <group position={[0, 0.09, -0.5]} rotation={[-0.25, 0, 0]}>
        <mesh scale={0.999} castShadow material={materials} position={[0, 0.3, 0.5]}><boxGeometry args={[1.42, 0.6, 1.01]} /></mesh>
      </group>
    </group>
  );
};

// Shoe box with lid
export const ShoeBox = ({ color, autoRotate, textureUrl, bgTextureUrl, activeFaces }: Props) => {
  const groupRef = useRef<THREE.Group>(null!);
  const texture = useTexture(textureUrl || 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=');
  const bgTex = useTexture(bgTextureUrl || 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=');
  texture.colorSpace = THREE.SRGBColorSpace;
  bgTex.colorSpace = THREE.SRGBColorSpace;

  useFrame((_, delta) => {
    if (groupRef.current && autoRotate) groupRef.current.rotation.y += delta * 0.3;
  });
  const materials = useMemo(() => {
    return faceOrder.map(faceName => {
      const showLogo = !activeFaces || activeFaces[faceName] !== false;
      const activeTex = showLogo && textureUrl ? texture : (bgTextureUrl ? bgTex : null);
      return new THREE.MeshPhysicalMaterial({
        color: activeTex ? '#ffffff' : color || '#795548',
        map: activeTex,
        roughness: 0.5,
        metalness: 0.0
      });
    });
  }, [color, textureUrl, bgTextureUrl, activeFaces, texture, bgTex]);

  return (
    <group ref={groupRef}>
      <mesh scale={0.999} castShadow material={materials} position={[0, -0.22, 0]}><boxGeometry args={[1.6, 0.55, 0.9]} /></mesh>
      <group position={[0, 0.06, -0.45]} rotation={[-0.28, 0, 0]}>
        <mesh scale={0.999} castShadow material={materials} position={[0, 0.1, 0.45]}><boxGeometry args={[1.62, 0.22, 0.92]} /></mesh>
      </group>
    </group>
  );
};

// Flat pouch (sealed flat envelope style)
export const FlatPouch = ({ color, autoRotate, textureUrl, bgTextureUrl, activeFaces }: Props) => {
  const groupRef = useRef<THREE.Group>(null!);
  const texture = useTexture(textureUrl || 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=');
  const bgTex = useTexture(bgTextureUrl || 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=');
  texture.colorSpace = THREE.SRGBColorSpace;
  bgTex.colorSpace = THREE.SRGBColorSpace;
  
  useFrame((_, delta) => {
    if (groupRef.current && autoRotate) groupRef.current.rotation.y += delta * 0.4;
  });
  
  const pouchColor = color || '#607d8b';
  const showLogoFront = !activeFaces || activeFaces['front'] !== false;
  const activeTexFront = showLogoFront && textureUrl ? texture : (bgTextureUrl ? bgTex : null);
  const showLogoBack = !activeFaces || activeFaces['back'] !== false;
  const activeTexBack = showLogoBack && textureUrl ? texture : (bgTextureUrl ? bgTex : null);
  
  const frontMat = new THREE.MeshPhysicalMaterial({ map: activeTexFront, color: activeTexFront ? '#ffffff' : pouchColor, roughness: 0.2, metalness: 0.4 });
  const backMat = new THREE.MeshPhysicalMaterial({ map: activeTexBack, color: activeTexBack ? '#ffffff' : pouchColor, roughness: 0.2, metalness: 0.4 });
  const matArray = [frontMat, frontMat, frontMat, frontMat, frontMat, backMat];

  return (
    <group ref={groupRef}>
      <mesh scale={0.999} castShadow material={matArray}><boxGeometry args={[0.85, 1.25, 0.06]} /></mesh>
      {/* Top heat seal */}
      <mesh scale={0.999} position={[0, 0.67, 0]}><boxGeometry args={[0.85, 0.06, 0.065]} /><meshStandardMaterial color="#ffffff" roughness={0.3} transparent opacity={0.9} /></mesh>
      {/* Bottom heat seal */}
      <mesh scale={0.999} position={[0, -0.67, 0]}><boxGeometry args={[0.85, 0.06, 0.065]} /><meshStandardMaterial color="#ffffff" roughness={0.3} transparent opacity={0.9} /></mesh>
      {/* Side seals */}
      <mesh scale={0.999} position={[0.44, 0, 0]}><boxGeometry args={[0.03, 1.25, 0.065]} /><meshStandardMaterial color="#ffffff" roughness={0.3} transparent opacity={0.7} /></mesh>
      <mesh scale={0.999} position={[-0.44, 0, 0]}><boxGeometry args={[0.03, 1.25, 0.065]} /><meshStandardMaterial color="#ffffff" roughness={0.3} transparent opacity={0.7} /></mesh>
      {/* Hang hole */}
      <mesh scale={0.999} position={[0, 0.62, 0.04]} rotation={[Math.PI / 2, 0, 0]}><ringGeometry args={[0.04, 0.07, 16]} /><meshStandardMaterial color="#ffffff" side={THREE.DoubleSide} /></mesh>
    </group>
  );
};

// Luxury rigid box (with lid that sits on top, magnetic closure)
export const LuxuryRigidBox = ({ color, autoRotate, textureUrl, bgTextureUrl, activeFaces }: Props) => {
  const groupRef = useRef<THREE.Group>(null!);
  const texture = useTexture(textureUrl || 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=');
  const bgTex = useTexture(bgTextureUrl || 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=');
  texture.colorSpace = THREE.SRGBColorSpace;
  bgTex.colorSpace = THREE.SRGBColorSpace;

  useFrame((_, delta) => {
    if (groupRef.current && autoRotate) groupRef.current.rotation.y += delta * 0.25;
  });
  const outerMat = useMemo(() => {
    return faceOrder.map(faceName => {
      const showLogo = !activeFaces || activeFaces[faceName] !== false;
      const activeTex = showLogo && textureUrl ? texture : (bgTextureUrl ? bgTex : null);
      return new THREE.MeshPhysicalMaterial({
        color: activeTex ? '#ffffff' : color || '#1a1a2e',
        map: activeTex,
        roughness: 0.08,
        metalness: 0.15,
        clearcoat: 0.9,
        clearcoatRoughness: 0.05,
        side: THREE.FrontSide,
      });
    });
  }, [color, textureUrl, bgTextureUrl, activeFaces, texture, bgTex]);

  const goldMat = useMemo(() => new THREE.MeshStandardMaterial({ color: '#D4AF37', roughness: 0.05, metalness: 0.95 }), []);
  const ribbonMat = useMemo(() => new THREE.MeshStandardMaterial({ color: '#D4AF37', roughness: 0.2, metalness: 0.8 }), []);
  const magnetMat = useMemo(() => new THREE.MeshStandardMaterial({ color: '#888', roughness: 0.1, metalness: 1.0 }), []);

  // Dimensions
  const W = 1.2;  // width (X)
  const D = 0.9;  // depth (Z)
  const t = 0.04; // wall thickness

  // Base dimensions
  const BH = 0.55; // base inner height
  // Lid dimensions
  const LH = 0.28; // lid inner height

  const baseY = -0.22; // center Y of base

  // Lid is slightly ajar — rotated open from back edge
  const lidOpenAngle = -0.22;

  return (
    <group ref={groupRef}>
      {/* ── BASE (hollow: 4 outer walls + floor, open top) ── */}
      <group position={[0, baseY, 0]}>
        {/* Outer shell rendered as a solid box — but we add inner lining via BackSide */}
        {/* Front wall outer */}
        <mesh scale={0.999} castShadow material={outerMat} position={[0, 0, D / 2]}>
          <boxGeometry args={[W, BH, t]} />
        </mesh>
        {/* Back wall outer */}
        <mesh scale={0.999} castShadow material={outerMat} position={[0, 0, -D / 2]}>
          <boxGeometry args={[W, BH, t]} />
        </mesh>
        {/* Left wall outer */}
        <mesh scale={0.999} castShadow material={outerMat} position={[-W / 2, 0, 0]}>
          <boxGeometry args={[t, BH, D]} />
        </mesh>
        {/* Right wall outer */}
        <mesh scale={0.999} castShadow material={outerMat} position={[W / 2, 0, 0]}>
          <boxGeometry args={[t, BH, D]} />
        </mesh>
        {/* Floor outer */}
        <mesh scale={0.999} castShadow material={outerMat} position={[0, -BH / 2 + t / 2, 0]}>
          <boxGeometry args={[W, t, D]} />
        </mesh>
        {/* Interior lining — cream inner surface */}
        <mesh scale={0.999} position={[0, 0, 0]}>
          <boxGeometry args={[W - t, BH - t, D - t]} />
          <meshStandardMaterial color="#f0ead6" roughness={0.65} side={THREE.BackSide} />
        </mesh>
      </group>

      {/* ── LID (hollow: 4 outer walls + top panel, open bottom) — slightly ajar ── */}
      {/* Pivot from back bottom edge of lid */}
      <group position={[0, baseY + BH / 2, -D / 2]} rotation={[lidOpenAngle, 0, 0]}>
        <group position={[0, LH / 2, D / 2]}>
          {/* Top panel */}
          <mesh scale={0.999} castShadow material={outerMat} position={[0, LH / 2 - t / 2, 0]}>
            <boxGeometry args={[W + t * 2, t, D + t * 2]} />
          </mesh>
          {/* Front wall */}
          <mesh scale={0.999} castShadow material={outerMat} position={[0, 0, (D + t * 2) / 2]}>
            <boxGeometry args={[W + t * 2, LH, t]} />
          </mesh>
          {/* Back wall */}
          <mesh scale={0.999} castShadow material={outerMat} position={[0, 0, -(D + t * 2) / 2]}>
            <boxGeometry args={[W + t * 2, LH, t]} />
          </mesh>
          {/* Left wall */}
          <mesh scale={0.999} castShadow material={outerMat} position={[-(W + t * 2) / 2, 0, 0]}>
            <boxGeometry args={[t, LH, D + t * 2]} />
          </mesh>
          {/* Right wall */}
          <mesh scale={0.999} castShadow material={outerMat} position={[(W + t * 2) / 2, 0, 0]}>
            <boxGeometry args={[t, LH, D + t * 2]} />
          </mesh>
          {/* Interior lining of lid */}
          <mesh scale={0.999} position={[0, 0, 0]}>
            <boxGeometry args={[W, LH, D]} />
            <meshStandardMaterial color="#f0ead6" roughness={0.65} side={THREE.BackSide} />
          </mesh>
          {/* Gold accent on lid front */}
          <mesh scale={0.999} position={[0, 0, (D + t * 2) / 2 + 0.002]} material={goldMat}>
            <boxGeometry args={[W + t * 2, LH, 0.005]} />
          </mesh>
        </group>
      </group>

      {/* Gold accent strip on base front */}
      <mesh scale={0.999} position={[0, baseY, D / 2 + 0.002]} material={goldMat}>
        <boxGeometry args={[W, BH, 0.005]} />
      </mesh>
      {/* ── PREMIUM MAGNETIC CLASP ── */}

      {/* Ribbon pull — satin ribbon with rounded tip */}
      {/* Main ribbon body */}
      <mesh scale={0.999} position={[0, baseY + BH / 2 + LH * 0.35, D / 2 + 0.014]} material={ribbonMat}>
        <boxGeometry args={[0.055, BH * 0.75, 0.007]} />
      </mesh>
      {/* Ribbon tip — small rounded gold bead at bottom of pull */}
      <mesh scale={0.999} position={[0, baseY + BH / 2 + LH * 0.35 - BH * 0.375 - 0.018, D / 2 + 0.014]} material={goldMat}>
        <sphereGeometry args={[0.018, 12, 12]} />
      </mesh>

      {/* ── BASE CLASP RECEIVER (on base front wall) ── */}
      {/* Outer gold border plate */}
      <mesh scale={0.999} position={[0, baseY + BH / 2 - 0.09, D / 2 + 0.007]} material={goldMat}>
        <boxGeometry args={[0.22, 0.072, 0.006]} />
      </mesh>
      {/* Inner dark inset (the magnetic pad) */}
      <mesh scale={0.999} position={[0, baseY + BH / 2 - 0.09, D / 2 + 0.012]}>
        <boxGeometry args={[0.17, 0.042, 0.004]} />
        <meshStandardMaterial color="#1a1206" roughness={0.3} metalness={0.6} />
      </mesh>
      {/* Two tiny polished magnet circles inside inset */}
      {[-0.055, 0.055].map((x, i) => (
        <mesh scale={0.999} key={i} position={[x, baseY + BH / 2 - 0.09, D / 2 + 0.015]} material={magnetMat} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.018, 0.018, 0.006, 20]} />
        </mesh>
      ))}
      {/* Gold horizontal score lines above and below clasp */}
      {[-0.055, 0.055].map((y, i) => (
        <mesh scale={0.999} key={i} position={[0, baseY + BH / 2 - 0.09 + y, D / 2 + 0.0085]} material={goldMat}>
          <boxGeometry args={[0.22, 0.005, 0.003]} />
        </mesh>
      ))}

      {/* ── LID CLASP PLATE (on lid front wall, inner lower rim) ── */}
      <group position={[0, baseY + BH / 2, -D / 2]} rotation={[lidOpenAngle, 0, 0]}>
        <group position={[0, LH / 2, D / 2]}>
          {/* Outer gold clasp plate — mounted on lower rim of lid front */}
          <mesh scale={0.999} position={[0, -LH / 2 + 0.04, (D + t * 2) / 2 + 0.007]} material={goldMat}>
            <boxGeometry args={[0.22, 0.072, 0.006]} />
          </mesh>
          {/* Dark inset */}
          <mesh scale={0.999} position={[0, -LH / 2 + 0.04, (D + t * 2) / 2 + 0.012]}>
            <boxGeometry args={[0.17, 0.042, 0.004]} />
            <meshStandardMaterial color="#1a1206" roughness={0.3} metalness={0.6} />
          </mesh>
          {/* Polished magnet circles in lid clasp */}
          {[-0.055, 0.055].map((x, i) => (
            <mesh scale={0.999} key={i} position={[x, -LH / 2 + 0.04, (D + t * 2) / 2 + 0.015]} material={magnetMat} rotation={[Math.PI / 2, 0, 0]}>
              <cylinderGeometry args={[0.018, 0.018, 0.006, 20]} />
            </mesh>
          ))}
          {/* Score lines on lid clasp */}
          {[-0.055, 0.055].map((y, i) => (
            <mesh scale={0.999} key={i} position={[0, -LH / 2 + 0.04 + y, (D + t * 2) / 2 + 0.0085]} material={goldMat}>
              <boxGeometry args={[0.22, 0.005, 0.003]} />
            </mesh>
          ))}
        </group>
      </group>
    </group>
  );
};

// Medicine box (tablet carton format, dynamic 2-box presentation)
export const MedicineBox = ({ color, autoRotate, textureUrl, bgTextureUrl, activeFaces }: Props) => {
  const groupRef = useRef<THREE.Group>(null!);
  const texture = useTexture(textureUrl || 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=');
  const bgTex = useTexture(bgTextureUrl || 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=');
  texture.colorSpace = THREE.SRGBColorSpace;
  bgTex.colorSpace = THREE.SRGBColorSpace;
  
  useFrame((_, delta) => {
    if (groupRef.current && autoRotate) groupRef.current.rotation.y += delta * 0.3;
  });
  const materials = useMemo(() => {
    return faceOrder.map(faceName => {
      const showLogo = !activeFaces || activeFaces[faceName] !== false;
      const activeTex = showLogo && textureUrl ? texture : (bgTextureUrl ? bgTex : null);
      return new THREE.MeshPhysicalMaterial({
        color: activeTex ? '#ffffff' : color || '#ffffff',
        map: activeTex,
        roughness: 0.6, // slightly matte cardboard
        metalness: 0.0,
        clearcoat: 0.05
      });
    });
  }, [color, textureUrl, bgTextureUrl, activeFaces, texture, bgTex]);

  // Wide rectangular tablet box dimensions
  const W = 1.5;
  const H = 0.4;
  const D = 0.9;

  return (
    <group ref={groupRef} position={[0, -0.2, 0]}>
      {/* Box: Lying flat on the ground */}
      <mesh scale={0.999} castShadow receiveShadow material={materials}>
        <boxGeometry args={[W, H, D]} />
      </mesh>
    </group>
  );
};
