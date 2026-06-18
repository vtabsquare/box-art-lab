import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { useTexture } from '@react-three/drei';
import * as THREE from 'three';

interface Props {
  color: string;
  autoRotate: boolean;
  textureUrl?: string | null;
  bgTextureUrl?: string | null;
  activeFaces?: Record<string, boolean>;
}

const EMPTY_TEX = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=';

// Builds a smooth, slightly-bulging flat pouch mesh from a grid of vertices.
// The pouch is flat on the edges (heat-sealed) and slightly puffy in the center.
const buildPouchGeo = (W: number, H: number, bulge: number, segsX: number, segsY: number) => {
  const geo = new THREE.BufferGeometry();
  const positions: number[] = [];
  const normals: number[] = [];
  const uvs: number[] = [];
  const indices: number[] = [];

  const SEAL = 0.06; // fraction of width/height that is heat-seal (flat)

  const nx = segsX + 1;
  const ny = segsY + 1;

  for (let j = 0; j < ny; j++) {
    for (let i = 0; i < nx; i++) {
      const u = i / segsX;
      const v = j / segsY;

      const x = (u - 0.5) * W;
      const y = (v - 0.5) * H;

      // Shape factor: 0 at edges (seal), 1 at center
      const fx = Math.min(u / SEAL, (1 - u) / SEAL, 1);
      const fy = Math.min(v / SEAL, (1 - v) / SEAL, 1);
      const factor = Math.sin(fx * Math.PI * 0.5) * Math.sin(fy * Math.PI * 0.5);

      const z = bulge * factor;

      // Front face
      positions.push(x, y, z);
      normals.push(0, 0, 1);
      uvs.push(u, v);
    }
  }

  // Back face (mirrored)
  const backOffset = nx * ny;
  for (let j = 0; j < ny; j++) {
    for (let i = 0; i < nx; i++) {
      const u = i / segsX;
      const v = j / segsY;
      const x = (u - 0.5) * W;
      const y = (v - 0.5) * H;
      const fx = Math.min(u / SEAL, (1 - u) / SEAL, 1);
      const fy = Math.min(v / SEAL, (1 - v) / SEAL, 1);
      const factor = Math.sin(fx * Math.PI * 0.5) * Math.sin(fy * Math.PI * 0.5);
      const z = -bulge * factor;
      positions.push(x, y, z);
      normals.push(0, 0, -1);
      uvs.push(1 - u, v);
    }
  }

  // Front face indices
  for (let j = 0; j < segsY; j++) {
    for (let i = 0; i < segsX; i++) {
      const a = j * nx + i;
      const b = j * nx + i + 1;
      const c = (j + 1) * nx + i;
      const d = (j + 1) * nx + i + 1;
      indices.push(a, c, b, b, c, d);
    }
  }

  // Back face indices (reversed winding)
  for (let j = 0; j < segsY; j++) {
    for (let i = 0; i < segsX; i++) {
      const a = backOffset + j * nx + i;
      const b = backOffset + j * nx + i + 1;
      const c = backOffset + (j + 1) * nx + i;
      const d = backOffset + (j + 1) * nx + i + 1;
      indices.push(a, b, c, b, d, c);
    }
  }

  geo.setIndex(indices);
  geo.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
  geo.setAttribute('normal', new THREE.Float32BufferAttribute(normals, 3));
  geo.setAttribute('uv', new THREE.Float32BufferAttribute(uvs, 2));
  geo.computeVertexNormals();
  return geo;
};

// A thin tube used for the zip-close strip
const buildZipGeo = (W: number, radius: number) => {
  const path = new THREE.LineCurve3(
    new THREE.Vector3(-W / 2 + radius, 0, 0),
    new THREE.Vector3(W / 2 - radius, 0, 0)
  );
  return new THREE.TubeGeometry(path, 1, radius, 12, false);
};

// Hang hole: a torus at the top center
const buildHangHoleGeo = (innerR: number, tubeR: number) =>
  new THREE.TorusGeometry(innerR, tubeR, 16, 32);

export const FlatPouchPremium = ({ color, autoRotate, textureUrl, bgTextureUrl, activeFaces }: Props) => {
  const groupRef = useRef<THREE.Group>(null!);
  const texture = useTexture(textureUrl || EMPTY_TEX);
  const bgTex = useTexture(bgTextureUrl || EMPTY_TEX);
  texture.colorSpace = THREE.SRGBColorSpace;
  bgTex.colorSpace = THREE.SRGBColorSpace;

  useFrame((_, delta) => {
    if (groupRef.current && autoRotate) groupRef.current.rotation.y += delta * 0.28;
  });

  // --- Dimensions ---
  const W = 1.5;   // width
  const H = 1.9;   // height
  const BULGE = 0.055; // how puffy the pouch is

  // --- Geometries ---
  const pouchGeo = useMemo(() => buildPouchGeo(W, H, BULGE, 32, 40), []);

  // Heat-seal strips (thin flat quads on the edges)
  const sealThick = 0.008;
  const sealW = 0.055;

  // Zip strip geometry
  const zipGeo = useMemo(() => buildZipGeo(W - 0.01, 0.018), []);
  const zipGrooveGeo = useMemo(() => buildZipGeo(W - 0.01, 0.010), []);

  // Hang hole
  const hangGeo = useMemo(() => buildHangHoleGeo(0.055, 0.012), []);

  // --- Materials ---
  const pouchColor = color || '#3bb8e8';

  const showFrontTex = !activeFaces || activeFaces['front'] !== false;
  const showBackTex = !activeFaces || activeFaces['back'] !== false;
  const frontTex = showFrontTex && textureUrl ? texture : (bgTextureUrl ? bgTex : null);
  const backTex = showBackTex && textureUrl ? texture : (bgTextureUrl ? bgTex : null);

  const mFront = useMemo(() => new THREE.MeshPhysicalMaterial({
    color: frontTex ? '#ffffff' : pouchColor,
    map: frontTex || undefined,
    roughness: 0.08,
    metalness: 0.05,
    clearcoat: 1.0,
    clearcoatRoughness: 0.05,
    reflectivity: 0.9,
    side: THREE.FrontSide,
  }), [pouchColor, frontTex]);

  const mBack = useMemo(() => new THREE.MeshPhysicalMaterial({
    color: backTex ? '#ffffff' : pouchColor,
    map: backTex || undefined,
    roughness: 0.08,
    metalness: 0.05,
    clearcoat: 1.0,
    clearcoatRoughness: 0.05,
    reflectivity: 0.9,
    side: THREE.BackSide,
  }), [pouchColor, backTex]);

  const mSeal = useMemo(() => new THREE.MeshPhysicalMaterial({
    color: pouchColor,
    roughness: 0.25,
    metalness: 0.1,
    clearcoat: 0.8,
    side: THREE.DoubleSide,
  }), [pouchColor]);

  const mZip = useMemo(() => new THREE.MeshPhysicalMaterial({
    color: '#e8e8f0',
    roughness: 0.3,
    metalness: 0.2,
    clearcoat: 0.9,
  }), []);

  const mZipGroove = useMemo(() => new THREE.MeshPhysicalMaterial({
    color: '#c0c0d8',
    roughness: 0.4,
    metalness: 0.1,
  }), []);

  const mHole = useMemo(() => new THREE.MeshPhysicalMaterial({
    color: '#aaaacc',
    roughness: 0.2,
    metalness: 0.3,
    clearcoat: 1.0,
  }), []);

  // Zip strip Y position — near the top, just below top seal
  const zipY = H / 2 - sealW - 0.08;
  // Hang hole Y position — within the top seal zone
  const hangY = H / 2 - sealW * 0.5;

  return (
    <group ref={groupRef} position={[0, 0, 0]}>

      {/* ── Main pouch body (front + back faces via single geometry) ── */}
      <mesh scale={0.999} castShadow receiveShadow geometry={pouchGeo} material={mFront} />
      <mesh scale={0.999} castShadow receiveShadow geometry={pouchGeo} material={mBack} />

      {/* ── Heat-seal side strips ── */}
      {/* Left seal */}
      <mesh scale={0.999} castShadow position={[-W / 2 + sealW / 2, 0, 0]}>
        <boxGeometry args={[sealW, H, sealThick]} />
        <primitive object={mSeal} attach="material" />
      </mesh>
      {/* Right seal */}
      <mesh scale={0.999} castShadow position={[W / 2 - sealW / 2, 0, 0]}>
        <boxGeometry args={[sealW, H, sealThick]} />
        <primitive object={mSeal} attach="material" />
      </mesh>
      {/* Top seal */}
      <mesh scale={0.999} castShadow position={[0, H / 2 - sealW / 2, 0]}>
        <boxGeometry args={[W, sealW, sealThick]} />
        <primitive object={mSeal} attach="material" />
      </mesh>
      {/* Bottom seal */}
      <mesh scale={0.999} castShadow position={[0, -H / 2 + sealW / 2, 0]}>
        <boxGeometry args={[W, sealW, sealThick]} />
        <primitive object={mSeal} attach="material" />
      </mesh>

      {/* ── Zip-lock close strip ── */}
      {/* Main zip ridge (front) */}
      <mesh scale={0.999} geometry={zipGeo} material={mZip} position={[0, zipY, BULGE * 0.6]} castShadow />
      {/* Groove (slightly behind the main ridge) */}
      <mesh scale={0.999} geometry={zipGrooveGeo} material={mZipGroove} position={[0, zipY - 0.03, BULGE * 0.6 + 0.001]} />
      {/* Back-face zip strip */}
      <mesh scale={0.999} geometry={zipGeo} material={mZip} position={[0, zipY, -BULGE * 0.6]} castShadow />
      <mesh scale={0.999} geometry={zipGrooveGeo} material={mZipGroove} position={[0, zipY - 0.03, -BULGE * 0.6 - 0.001]} />

      {/* ── Hang hole at top center ── */}
      <mesh scale={0.999} geometry={hangGeo}
        material={mHole}
        position={[0, hangY, 0]}
        rotation={[Math.PI / 2, 0, 0]}
        castShadow
      />
    </group>
  );
};
