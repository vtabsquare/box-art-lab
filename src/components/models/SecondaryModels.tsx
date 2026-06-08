import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useTexture } from '@react-three/drei';

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

  const faceOrder = ['right', 'left', 'top', 'bottom', 'front', 'back'];
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
      <mesh castShadow material={materials}>
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

  const faceOrder = ['right', 'left', 'top', 'bottom', 'front', 'back'];
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
      <mesh castShadow material={materials} position={[0, -0.18, 0]}><boxGeometry args={[1.4, 0.42, 1.0]} /></mesh>
      <mesh castShadow material={materials} position={[0, 0.08, 0.5]}><boxGeometry args={[1.4, 0.42, 0.015]} /></mesh>
      <mesh castShadow material={materials} position={[0, 0.08, -0.5]}><boxGeometry args={[1.4, 0.42, 0.015]} /></mesh>
      <group position={[0, 0.09, -0.5]} rotation={[-0.25, 0, 0]}>
        <mesh castShadow material={materials} position={[0, 0.3, 0.5]}><boxGeometry args={[1.42, 0.6, 1.01]} /></mesh>
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

  const faceOrder = ['right', 'left', 'top', 'bottom', 'front', 'back'];
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
      <mesh castShadow material={materials} position={[0, -0.22, 0]}><boxGeometry args={[1.6, 0.55, 0.9]} /></mesh>
      <group position={[0, 0.06, -0.45]} rotation={[-0.28, 0, 0]}>
        <mesh castShadow material={materials} position={[0, 0.1, 0.45]}><boxGeometry args={[1.62, 0.22, 0.92]} /></mesh>
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
      <mesh castShadow material={matArray}><boxGeometry args={[0.85, 1.25, 0.06]} /></mesh>
      {/* Top heat seal */}
      <mesh position={[0, 0.67, 0]}><boxGeometry args={[0.85, 0.06, 0.065]} /><meshStandardMaterial color="#ffffff" roughness={0.3} transparent opacity={0.9} /></mesh>
      {/* Bottom heat seal */}
      <mesh position={[0, -0.67, 0]}><boxGeometry args={[0.85, 0.06, 0.065]} /><meshStandardMaterial color="#ffffff" roughness={0.3} transparent opacity={0.9} /></mesh>
      {/* Side seals */}
      <mesh position={[0.44, 0, 0]}><boxGeometry args={[0.03, 1.25, 0.065]} /><meshStandardMaterial color="#ffffff" roughness={0.3} transparent opacity={0.7} /></mesh>
      <mesh position={[-0.44, 0, 0]}><boxGeometry args={[0.03, 1.25, 0.065]} /><meshStandardMaterial color="#ffffff" roughness={0.3} transparent opacity={0.7} /></mesh>
      {/* Hang hole */}
      <mesh position={[0, 0.62, 0.04]} rotation={[Math.PI / 2, 0, 0]}><ringGeometry args={[0.04, 0.07, 16]} /><meshStandardMaterial color="#ffffff" side={THREE.DoubleSide} /></mesh>
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
  
  const faceOrder = ['right', 'left', 'top', 'bottom', 'front', 'back'];
  const materials = useMemo(() => {
    return faceOrder.map(faceName => {
      const showLogo = !activeFaces || activeFaces[faceName] !== false;
      const activeTex = showLogo && textureUrl ? texture : (bgTextureUrl ? bgTex : null);
      return new THREE.MeshPhysicalMaterial({
        color: activeTex ? '#ffffff' : color || '#1a1a2e',
        map: activeTex,
        roughness: 0.08,
        metalness: 0.15,
        clearcoat: 0.9,
        clearcoatRoughness: 0.05
      });
    });
  }, [color, textureUrl, bgTextureUrl, activeFaces, texture, bgTex]);

  return (
    <group ref={groupRef}>
      {/* Base box */}
      <mesh castShadow material={materials} position={[0, -0.2, 0]}><boxGeometry args={[1.2, 0.6, 0.9]} /></mesh>
      {/* Lid - slightly ajar revealing inside */}
      <group position={[0, 0.11, -0.45]} rotation={[-0.18, 0, 0]}>
        <mesh castShadow material={materials} position={[0, 0.14, 0.45]}><boxGeometry args={[1.22, 0.28, 0.92]} /></mesh>
      </group>
      {/* Gold accent strip on base */}
      <mesh position={[0, -0.2, 0.456]}><boxGeometry args={[1.2, 0.6, 0.01]} /><meshStandardMaterial color="#D4AF37" roughness={0.05} metalness={0.95} /></mesh>
      {/* Ribbon pull */}
      <mesh position={[0, 0.12, 0.46]}><boxGeometry args={[0.08, 0.55, 0.01]} /><meshStandardMaterial color="#D4AF37" roughness={0.2} metalness={0.8} /></mesh>
      {/* Magnetic dots */}
      {[-0.3, 0.3].map((x, i) => (
        <mesh key={i} position={[x, 0.12, 0.457]}>
          <cylinderGeometry args={[0.03, 0.03, 0.01, 12]} />
          <meshStandardMaterial color="#888" roughness={0.1} metalness={1.0} />
        </mesh>
      ))}
    </group>
  );
};

// Medicine box (slim carton)
export const MedicineBox = ({ color, autoRotate, textureUrl, bgTextureUrl, activeFaces }: Props) => {
  const groupRef = useRef<THREE.Group>(null!);
  const texture = useTexture(textureUrl || 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=');
  const bgTex = useTexture(bgTextureUrl || 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=');
  texture.colorSpace = THREE.SRGBColorSpace;
  bgTex.colorSpace = THREE.SRGBColorSpace;
  
  useFrame((_, delta) => {
    if (groupRef.current && autoRotate) groupRef.current.rotation.y += delta * 0.45;
  });
  
  const faceOrder = ['right', 'left', 'top', 'bottom', 'front', 'back'];
  const materials = useMemo(() => {
    return faceOrder.map(faceName => {
      const showLogo = !activeFaces || activeFaces[faceName] !== false;
      const activeTex = showLogo && textureUrl ? texture : (bgTextureUrl ? bgTex : null);
      return new THREE.MeshPhysicalMaterial({
        color: activeTex ? '#ffffff' : color || '#2E86C1',
        map: activeTex,
        roughness: 0.35,
        metalness: 0.0
      });
    });
  }, [color, textureUrl, bgTextureUrl, activeFaces, texture, bgTex]);

  return (
    <group ref={groupRef}>
      <mesh castShadow material={materials}><boxGeometry args={[0.55, 0.28, 1.1]} /></mesh>
      {/* Top tuck end */}
      <group position={[0, 0, -0.55]} rotation={[0.3, 0, 0]}>
        <mesh castShadow material={materials} position={[0, 0, 0.06]}><boxGeometry args={[0.55, 0.28, 0.12]} /></mesh>
      </group>
      {/* White label strip on front */}
      <mesh position={[0, 0, 0.552]}>
        <planeGeometry args={[0.5, 0.22]} />
        <meshStandardMaterial color="#ffffff" roughness={0.4} />
      </mesh>
      {/* Red cross symbol */}
      <mesh position={[-0.16, 0, 0.554]}><boxGeometry args={[0.06, 0.008, 0.008]} /><meshStandardMaterial color="#e53935" /></mesh>
      <mesh position={[-0.16, 0, 0.554]}><boxGeometry args={[0.008, 0.006, 0.06]} /><meshStandardMaterial color="#e53935" /></mesh>
    </group>
  );
};
