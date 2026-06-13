import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface Props {
  color: string;
  autoRotate: boolean;
  textureUrl?: string | null;
  bgTextureUrl?: string | null;
  activeFaces?: Record<string, boolean>;
}

const assignUVs = (geo: THREE.BufferGeometry, width: number, height: number, flipX: boolean = false) => {
  const pos = geo.attributes.position;
  const uvs = geo.attributes.uv;
  for (let i = 0; i < pos.count; i++) {
    const x = pos.getX(i);
    const y = pos.getY(i);
    let u = (x + width / 2) / width;
    if (flipX) u = 1 - u;
    const v = y / height;
    uvs.setXY(i, u, v);
  }
  uvs.needsUpdate = true;
  return geo;
};

export const FrenchFriesBox = ({ color, autoRotate, textureUrl, bgTextureUrl, activeFaces }: Props) => {
  const groupRef = useRef<THREE.Group>(null!);

  const logoTex = useMemo(() => {
    if (!textureUrl) return null;
    const t = new THREE.TextureLoader().load(textureUrl);
    t.colorSpace = THREE.SRGBColorSpace;
    return t;
  }, [textureUrl]);

  const bgTex = useMemo(() => {
    if (!bgTextureUrl) return null;
    const t = new THREE.TextureLoader().load(bgTextureUrl);
    t.colorSpace = THREE.SRGBColorSpace;
    t.wrapS = t.wrapT = THREE.RepeatWrapping;
    return t;
  }, [bgTextureUrl]);

  useFrame((_, delta) => {
    if (groupRef.current && autoRotate) groupRef.current.rotation.y += delta * 0.35;
  });

  const boxColor = color || '#e53935'; // Red

  const baseMat = (
    <meshPhysicalMaterial
      map={bgTex || undefined}
      color={bgTex ? '#ffffff' : boxColor}
      roughness={0.7}
      metalness={0.0}
      side={THREE.DoubleSide}
    />
  );
  
  const insideMat = (
    <meshPhysicalMaterial
      color="#f5f5f5" // White interior
      roughness={0.9}
      metalness={0.0}
      side={THREE.DoubleSide}
    />
  );

  const showLogo = !activeFaces || activeFaces['front'] !== false;
  const frontTex = showLogo ? logoTex : null;

  const H = 1.0;
  const W_top = 1.0;
  const W_bot = 0.6;
  const D_top = 0.6;
  const D_bot = 0.4;
  const thickness = 0.02;

  const H_fb = Math.sqrt(H * H + Math.pow((D_top - D_bot) / 2, 2));
  const H_lr = Math.sqrt(H * H + Math.pow((W_top - W_bot) / 2, 2));

  // Front Panel (Concave Top)
  const frontGeo = useMemo(() => {
    const shape = new THREE.Shape();
    shape.moveTo(-W_bot/2, 0);
    shape.lineTo(W_bot/2, 0);
    shape.lineTo(W_top/2, H_fb);
    // Concave dip in the middle
    shape.quadraticCurveTo(0, H_fb - 0.2, -W_top/2, H_fb);
    shape.lineTo(-W_bot/2, 0);
    
    const geo = new THREE.ExtrudeGeometry(shape, { depth: thickness, bevelEnabled: false });
    return assignUVs(geo, W_top, H_fb, false);
  }, [W_bot, W_top, H_fb]);

  // Back Panel (Convex Arched Top)
  const backGeo = useMemo(() => {
    const shape = new THREE.Shape();
    shape.moveTo(-W_bot/2, 0);
    shape.lineTo(W_bot/2, 0);
    shape.lineTo(W_top/2, H_fb);
    // Convex arch extending higher
    shape.quadraticCurveTo(0, H_fb + 0.4, -W_top/2, H_fb);
    shape.lineTo(-W_bot/2, 0);
    
    const geo = new THREE.ExtrudeGeometry(shape, { depth: thickness, bevelEnabled: false });
    return assignUVs(geo, W_top, H_fb, true);
  }, [W_bot, W_top, H_fb]);

  // Side Panel (Trapezoid) Left
  const sideGeoLeft = useMemo(() => {
    const shape = new THREE.Shape();
    shape.moveTo(-D_bot/2, 0);
    shape.lineTo(D_bot/2, 0);
    shape.lineTo(D_top/2, H_lr);
    shape.lineTo(-D_top/2, H_lr);
    shape.lineTo(-D_bot/2, 0);
    
    const geo = new THREE.ExtrudeGeometry(shape, { depth: thickness, bevelEnabled: false });
    return assignUVs(geo, D_top, H_lr, true);
  }, [D_bot, D_top, H_lr]);

  // Side Panel (Trapezoid) Right
  const sideGeoRight = useMemo(() => {
    const shape = new THREE.Shape();
    shape.moveTo(-D_bot/2, 0);
    shape.lineTo(D_bot/2, 0);
    shape.lineTo(D_top/2, H_lr);
    shape.lineTo(-D_top/2, H_lr);
    shape.lineTo(-D_bot/2, 0);
    
    const geo = new THREE.ExtrudeGeometry(shape, { depth: thickness, bevelEnabled: false });
    return assignUVs(geo, D_top, H_lr, false);
  }, [D_bot, D_top, H_lr]);

  // Bottom Panel
  const bottomGeo = useMemo(() => {
    return new THREE.PlaneGeometry(W_bot, D_bot);
  }, [W_bot, D_bot]);

  // Calculate side panel rotation angle to connect front and back
  const angleX = Math.atan2((D_top - D_bot) / 2, H);
  const angleZ = Math.atan2((W_top - W_bot) / 2, H);

  return (
    <group ref={groupRef} position={[0, -H/2, 0]}>
      
      {/* Front Panel */}
      <group position={[0, 0, D_bot/2]} rotation={[angleX, 0, 0, 'YXZ']}>
        <mesh castShadow receiveShadow geometry={frontGeo}>
          {baseMat}
        </mesh>
        
        {/* Logo / Text Plane */}
        {frontTex && (
          <mesh position={[0, H_fb / 2, thickness + 0.005]}>
            <planeGeometry args={[W_bot * 0.9, H_fb * 0.6]} />
            <meshPhysicalMaterial map={frontTex} transparent depthWrite={false} roughness={0.7} />
          </mesh>
        )}
      </group>
      
      {/* Back Panel */}
      <mesh castShadow receiveShadow geometry={backGeo} position={[0, 0, -D_bot/2]} rotation={[angleX, Math.PI, 0, 'YXZ']}>
        {baseMat}
      </mesh>

      {/* Left Side */}
      <mesh castShadow receiveShadow geometry={sideGeoLeft} position={[-W_bot/2, 0, 0]} rotation={[angleZ, -Math.PI/2, 0, 'YXZ']}>
        {baseMat}
      </mesh>

      {/* Right Side */}
      <mesh castShadow receiveShadow geometry={sideGeoRight} position={[W_bot/2, 0, 0]} rotation={[angleZ, Math.PI/2, 0, 'YXZ']}>
        {baseMat}
      </mesh>

      {/* Bottom */}
      <mesh castShadow receiveShadow geometry={bottomGeo} position={[0, 0, 0]} rotation={[-Math.PI/2, 0, 0]}>
        {insideMat}
      </mesh>
      
      {/* Inner white liner to represent the inside of the box */}
      <group scale={[0.98, 0.98, 0.98]} position={[0, 0.01, 0]}>
        <mesh geometry={frontGeo} position={[0, 0, D_bot/2]} rotation={[angleX, 0, 0, 'YXZ']}>{insideMat}</mesh>
        <mesh geometry={backGeo} position={[0, 0, -D_bot/2]} rotation={[angleX, Math.PI, 0, 'YXZ']}>{insideMat}</mesh>
        <mesh geometry={sideGeoLeft} position={[-W_bot/2, 0, 0]} rotation={[angleZ, -Math.PI/2, 0, 'YXZ']}>{insideMat}</mesh>
        <mesh geometry={sideGeoRight} position={[W_bot/2, 0, 0]} rotation={[angleZ, Math.PI/2, 0, 'YXZ']}>{insideMat}</mesh>
      </group>

    </group>
  );
};
