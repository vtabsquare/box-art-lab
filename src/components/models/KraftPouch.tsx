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

export const KraftPouch = ({ color, autoRotate, textureUrl, bgTextureUrl, activeFaces }: Props) => {
  const groupRef = useRef<THREE.Group>(null!);
  
  const texture = useTexture(textureUrl || 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=');
  const bgTex = useTexture(bgTextureUrl || 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=');
  texture.colorSpace = THREE.SRGBColorSpace;
  bgTex.colorSpace = THREE.SRGBColorSpace;

  useFrame((_, dt) => {
    if (groupRef.current && autoRotate) groupRef.current.rotation.y += dt * 0.3;
  });

  const baseColor = color || '#c49a6c'; // Kraft paper brown

  // Exterior materials
  const extMaterials = useMemo(() => {
    return faceOrder.map(faceName => {
      const showLogo = !activeFaces || activeFaces[faceName] !== false;
      const activeTex = showLogo && textureUrl ? texture : (bgTextureUrl ? bgTex : null);
      
      return new THREE.MeshStandardMaterial({
        color: activeTex ? '#ffffff' : baseColor,
        map: activeTex,
        roughness: 0.95,
        metalness: 0.0,
        side: THREE.FrontSide,
      });
    });
  }, [baseColor, textureUrl, bgTextureUrl, activeFaces, texture, bgTex]);

  // Interior material (plain brown paper on the inside)
  const intMaterial = useMemo(() => {
    return new THREE.MeshStandardMaterial({
      color: baseColor,
      roughness: 0.95,
      metalness: 0.0,
      side: THREE.BackSide,
    });
  }, [baseColor]);

  const H = 3.0; // Taller bag like in image
  const W = 1.6;
  const D = 1.0;

  const { frontBackGeo, sideGeo, bottomGeo } = useMemo(() => {
    // ── FRONT & BACK PANELS ──
    const fbGeo = new THREE.PlaneGeometry(W, H, 32, 16);
    const fbPos = fbGeo.attributes.position;
    for (let i = 0; i < fbPos.count; i++) {
      const x = fbPos.getX(i);
      let y = fbPos.getY(i);
      let z = fbPos.getZ(i);

      const ny = (y + H/2) / H; // 0 to 1

      // Serrated top edge
      if (y > H/2 - 0.01) {
        const teethCount = 30;
        const tooth = Math.abs(((x + W/2) / W * teethCount) % 1 - 0.5) * 2;
        y += tooth * 0.04;
      }

      // Outward bow when open. Max bow at the top.
      const bowAmount = 0.2 * ny; 
      z += Math.sin((x / W + 0.5) * Math.PI) * bowAmount;

      fbPos.setXYZ(i, x, y, z);
    }
    fbGeo.computeVertexNormals();

    // ── SIDE PANELS (GUSSETS) ──
    const sGeo = new THREE.PlaneGeometry(D, H, 16, 16);
    const sPos = sGeo.attributes.position;
    for (let i = 0; i < sPos.count; i++) {
      const x = sPos.getX(i);
      let y = sPos.getY(i);
      let z = sPos.getZ(i);

      const ny = (y + H/2) / H;

      // Serrated top edge
      if (y > H/2 - 0.01) {
        const teethCount = 18;
        const tooth = Math.abs(((x + D/2) / D * teethCount) % 1 - 0.5) * 2;
        y += tooth * 0.04;
      }

      // Inward fold (M-shape). Max fold at the top.
      const distFromCenter = Math.abs(x); // 0 to D/2
      const foldAmount = (D/2 - distFromCenter) * 0.7 * ny; // Folds INWARD
      z -= foldAmount;

      sPos.setXYZ(i, x, y, z);
    }
    sGeo.computeVertexNormals();

    // ── BOTTOM PANEL ──
    const bGeo = new THREE.PlaneGeometry(W, D, 1, 1);
    
    return { frontBackGeo: fbGeo, sideGeo: sGeo, bottomGeo: bGeo };
  }, [W, H, D]);

  return (
    <group ref={groupRef} position={[0, -0.4, 0]} scale={[0.9, 0.9, 0.9]}>
      {/* ── EXTERIOR ── */}
      <mesh scale={0.999} position={[0, 0, D/2]} geometry={frontBackGeo} material={extMaterials[4]} castShadow receiveShadow />
      <mesh scale={0.999} position={[0, 0, -D/2]} rotation={[0, Math.PI, 0]} geometry={frontBackGeo} material={extMaterials[5]} castShadow receiveShadow />
      <mesh scale={0.999} position={[-W/2, 0, 0]} rotation={[0, -Math.PI/2, 0]} geometry={sideGeo} material={extMaterials[1]} castShadow receiveShadow />
      <mesh scale={0.999} position={[W/2, 0, 0]} rotation={[0, Math.PI/2, 0]} geometry={sideGeo} material={extMaterials[0]} castShadow receiveShadow />
      <mesh scale={0.999} position={[0, -H/2, 0]} rotation={[-Math.PI/2, 0, 0]} geometry={bottomGeo} material={extMaterials[3]} castShadow receiveShadow />

      {/* ── INTERIOR ── */}
      <mesh scale={0.999} position={[0, 0, D/2]} geometry={frontBackGeo} material={intMaterial} receiveShadow />
      <mesh scale={0.999} position={[0, 0, -D/2]} rotation={[0, Math.PI, 0]} geometry={frontBackGeo} material={intMaterial} receiveShadow />
      <mesh scale={0.999} position={[-W/2, 0, 0]} rotation={[0, -Math.PI/2, 0]} geometry={sideGeo} material={intMaterial} receiveShadow />
      <mesh scale={0.999} position={[W/2, 0, 0]} rotation={[0, Math.PI/2, 0]} geometry={sideGeo} material={intMaterial} receiveShadow />
      <mesh scale={0.999} position={[0, -H/2, 0]} rotation={[-Math.PI/2, 0, 0]} geometry={bottomGeo} material={intMaterial} receiveShadow />
    </group>
  );
};
