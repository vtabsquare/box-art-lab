/**
 * TubeMailer — Cylindrical kraft-paper tube mailer
 *
 * Matches reference image:
 *  - Tall cylinder body standing upright, open at top
 *  - Separate shorter cylinder lid placed in front, slightly angled
 *  - Kraft brown cardboard material with slight roughness
 */

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

const EMPTY_TEX = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=';
const RADIAL_SEGS = 64;

export const TubeMailer = ({ color, autoRotate, textureUrl, bgTextureUrl, activeFaces }: Props) => {
  const groupRef = useRef<THREE.Group>(null!);
  const texture = useTexture(textureUrl || EMPTY_TEX);
  const bgTex   = useTexture(bgTextureUrl || EMPTY_TEX);
  texture.colorSpace = THREE.SRGBColorSpace;
  bgTex.colorSpace   = THREE.SRGBColorSpace;

  useFrame((_, dt) => {
    if (groupRef.current && autoRotate) groupRef.current.rotation.y += dt * 0.25;
  });

  const kraft = color || '#b5813a';
  const T = 0.04; // wall thickness

  // Cylinder dimensions
  const R  = 0.6;  // outer radius
  const Ri = R - T; // inner radius
  const H  = 2.8;  // body height
  const Hl = 0.7;  // lid height (shorter cap)

  // Body outer wall material — wraps texture around the tube
  const bodyMat = useMemo(() => {
    const showLogo = !activeFaces || activeFaces['front'] !== false;
    const activeTex = showLogo && textureUrl ? texture : (bgTextureUrl ? bgTex : null);
    const mat = new THREE.MeshStandardMaterial({
      color: activeTex ? '#ffffff' : kraft,
      map: activeTex,
      roughness: 0.85,
      side: THREE.FrontSide,
    });
    if (activeTex) {
      activeTex.wrapS = THREE.RepeatWrapping;
      activeTex.wrapT = THREE.RepeatWrapping;
      activeTex.repeat.set(1, 1);
    }
    return mat;
  }, [kraft, textureUrl, bgTextureUrl, activeFaces, texture, bgTex]);

  // Inner wall (plain kraft)
  const innerMat = useMemo(() => new THREE.MeshStandardMaterial({
    color: new THREE.Color(kraft).multiplyScalar(0.75).getStyle(),
    roughness: 0.95,
    side: THREE.BackSide,
  }), [kraft]);

  // Disc cap material
  const discMat = useMemo(() => new THREE.MeshStandardMaterial({
    color: kraft,
    roughness: 0.85,
  }), [kraft]);

  // Lid outer wall material
  const lidMat = useMemo(() => {
    const showLogo = !activeFaces || activeFaces['back'] !== false;
    const activeTex = showLogo && textureUrl ? texture : (bgTextureUrl ? bgTex : null);
    const mat = new THREE.MeshStandardMaterial({
      color: activeTex ? '#ffffff' : kraft,
      map: activeTex,
      roughness: 0.85,
      side: THREE.FrontSide,
    });
    if (activeTex) {
      activeTex.wrapS = THREE.RepeatWrapping;
      activeTex.wrapT = THREE.RepeatWrapping;
    }
    return mat;
  }, [kraft, textureUrl, bgTextureUrl, activeFaces, texture, bgTex]);

  return (
    <group ref={groupRef} position={[0, -0.5, 0]}>

      {/* ── BODY (tall tube, open top) ───────────────────────────── */}
      <group position={[-0.5, H / 2, 0]}>
        {/* Outer wall */}
        <mesh scale={0.999} castShadow receiveShadow>
          <cylinderGeometry args={[R, R, H, RADIAL_SEGS, 1, true]} />
          <primitive object={bodyMat} />
        </mesh>
        {/* Inner wall (visible when looking down) */}
        <mesh>
          <cylinderGeometry args={[Ri, Ri, H, RADIAL_SEGS, 1, true]} />
          <primitive object={innerMat} />
        </mesh>
        {/* Bottom disc — horizontal, sealing the base */}
        <mesh scale={0.999} position={[0, -H / 2, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <circleGeometry args={[R, RADIAL_SEGS]} />
          <primitive object={discMat} />
        </mesh>
      </group>

      {/* ── LID (shorter cap, separate — open bottom, closed top) ── */}
      {/* Placed further right and angled naturally */}
      <group position={[1.1, Hl / 2, 0.25]} rotation={[0.3, -0.25, 0.15]}>
        {/* Outer wall */}
        <mesh scale={0.999} castShadow receiveShadow>
          <cylinderGeometry args={[R + 0.02, R + 0.02, Hl, RADIAL_SEGS, 1, true]} />
          <primitive object={lidMat} />
        </mesh>
        {/* Inner wall */}
        <mesh>
          <cylinderGeometry args={[Ri + 0.01, Ri + 0.01, Hl, RADIAL_SEGS, 1, true]} />
          <primitive object={innerMat} />
        </mesh>
        {/* Top disc — closed end (horizontal) */}
        <mesh scale={0.999} position={[0, Hl / 2, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <circleGeometry args={[R + 0.02, RADIAL_SEGS]} />
          <primitive object={discMat} />
        </mesh>
        {/* Top rim ring */}
        <mesh scale={0.999} position={[0, Hl / 2 - T / 2, 0]}>
          <cylinderGeometry args={[R + 0.02, R + 0.02, T, RADIAL_SEGS]} />
          <primitive object={discMat} />
        </mesh>
        {/* Bottom is OPEN — just a rim edge */}
        <mesh scale={0.999} position={[0, -Hl / 2 + T / 2, 0]}>
          <cylinderGeometry args={[R + 0.02, R + 0.02, T, RADIAL_SEGS]} />
          <primitive object={discMat} />
        </mesh>
      </group>

    </group>
  );
};
