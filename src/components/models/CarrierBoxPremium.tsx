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
 * Gable Box / Carrier Box
 * A folding carton meal box with a handle on top.
 */
export const CarrierBoxPremium = ({ color, autoRotate, textureUrl, bgTextureUrl, activeFaces }: Props) => {
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
        color: activeTex ? '#ffffff' : color || '#c9a485', // Kraft paper brown default
        map: activeTex,
        roughness: 0.85,
        metalness: 0.0,
        clearcoat: 0.05,
      });
    });
  }, [color, textureUrl, bgTextureUrl, activeFaces, texture, bgTex]);

  const W = 1.8;
  const D = 1.1;
  const H = 0.9;
  const rH = 0.6; // roof height
  const hH = 0.35; // handle height
  const t = 0.01; // wall thickness

  const L = Math.sqrt(rH * rH + (D / 2) * (D / 2));
  const roofAngle = Math.atan2(D / 2, rH);

  const { handleGeo, sideRoofGeo } = useMemo(() => {
    // Handle Shape with cutout
    const hShape = new THREE.Shape();
    const hw = W / 2 * 0.95; // Slightly narrower at the very top
    const hbw = W / 2;       // Base of handle
    hShape.moveTo(-hbw, 0);
    hShape.lineTo(hbw, 0);
    hShape.lineTo(hw, hH);
    hShape.lineTo(-hw, hH);
    hShape.lineTo(-hbw, 0);

    const hole = new THREE.Path();
    const holeW = 0.7;
    const holeH = 0.14;
    const holeY = hH * 0.55;
    hole.moveTo(-holeW / 2, holeY - holeH / 2);
    hole.lineTo(holeW / 2, holeY - holeH / 2);
    hole.absarc(holeW / 2, holeY, holeH / 2, -Math.PI / 2, Math.PI / 2, false);
    hole.lineTo(-holeW / 2, holeY + holeH / 2);
    hole.absarc(-holeW / 2, holeY, holeH / 2, Math.PI / 2, Math.PI * 1.5, false);
    hShape.holes.push(hole);

    const extrudeSettings = { depth: t, bevelEnabled: false };
    const hGeo = new THREE.ExtrudeGeometry(hShape, extrudeSettings);
    hGeo.center();

    // Side Roof Shape (triangle folded inwards)
    const srShape = new THREE.Shape();
    srShape.moveTo(-D / 2, 0);
    srShape.lineTo(D / 2, 0);
    srShape.lineTo(0, rH);
    srShape.lineTo(-D / 2, 0);
    const srGeo = new THREE.ExtrudeGeometry(srShape, extrudeSettings);
    srGeo.center();

    return { handleGeo: hGeo, sideRoofGeo: srGeo };
  }, []);

  // Material arrays for extruded geometry to pick up front/back textures
  const handleFrontMat = [materials[4], materials[4]];
  const handleBackMat = [materials[5], materials[5]];

  return (
    <group ref={groupRef} position={[0, -(H + rH + hH) / 2, 0]}>
      {/* ── Base Box ── */}
      <mesh scale={0.999} castShadow receiveShadow material={materials} position={[0, H / 2, D / 2]}>
        <boxGeometry args={[W, H, t]} />
      </mesh>
      <mesh scale={0.999} castShadow receiveShadow material={materials} position={[0, H / 2, -D / 2]}>
        <boxGeometry args={[W, H, t]} />
      </mesh>
      <mesh scale={0.999} castShadow receiveShadow material={materials} position={[-W / 2, H / 2, 0]}>
        <boxGeometry args={[t, H, D]} />
      </mesh>
      <mesh scale={0.999} castShadow receiveShadow material={materials} position={[W / 2, H / 2, 0]}>
        <boxGeometry args={[t, H, D]} />
      </mesh>
      <mesh scale={0.999} castShadow receiveShadow material={materials} position={[0, t / 2, 0]}>
        <boxGeometry args={[W, t, D]} />
      </mesh>

      {/* ── Angled Roof Panels ── */}
      <mesh scale={0.999} castShadow receiveShadow material={materials} position={[0, H + rH / 2, D / 4]} rotation={[-roofAngle, 0, 0]}>
        <boxGeometry args={[W, L, t]} />
      </mesh>
      <mesh scale={0.999} castShadow receiveShadow material={materials} position={[0, H + rH / 2, -D / 4]} rotation={[roofAngle, 0, 0]}>
        <boxGeometry args={[W, L, t]} />
      </mesh>

      {/* ── Side Triangle Roofs (folded inward) ── */}
      <mesh scale={0.999} castShadow receiveShadow material={materials} position={[-W / 2 + t / 2, H + rH / 2, 0]} rotation={[0, Math.PI / 2, 0]} geometry={sideRoofGeo} />
      <mesh scale={0.999} castShadow receiveShadow material={materials} position={[W / 2 - t / 2, H + rH / 2, 0]} rotation={[0, Math.PI / 2, 0]} geometry={sideRoofGeo} />

      {/* ── Top Handles ── */}
      {/* Front handle half */}
      <mesh scale={0.999} castShadow receiveShadow material={handleFrontMat} position={[0, H + rH + hH / 2, t / 2]} geometry={handleGeo} />
      {/* Back handle half */}
      <mesh scale={0.999} castShadow receiveShadow material={handleBackMat} position={[0, H + rH + hH / 2, -t / 2]} geometry={handleGeo} />
    </group>
  );
};
