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

// ─── Build a flat bag face (slightly pinched at edges for realism) ─────────────
const buildBagFaceGeo = (W: number, H: number, zSign: number, bulge: number) => {
  const segsX = 20;
  const segsY = 28;
  const geo = new THREE.PlaneGeometry(W, H, segsX, segsY);
  const pos = geo.attributes.position;
  const EDGE = 0.07; // fraction of edge that is flat seal

  for (let i = 0; i < pos.count; i++) {
    const x = pos.getX(i);
    const y = pos.getY(i);
    const u = (x / W) + 0.5;
    const v = (y / H) + 0.5;

    const fx = Math.min(u / EDGE, (1 - u) / EDGE, 1.0);
    const fy = Math.min(v / EDGE, (1 - v) / EDGE, 1.0);
    const base = Math.max(0, Math.sin(fx * Math.PI * 0.5) * Math.sin(fy * Math.PI * 0.5));
    const factor = Math.pow(base, 0.6);

    pos.setZ(i, zSign * bulge * factor);
  }
  geo.computeVertexNormals();
  return geo;
};

// ─── Build the instanced bubble hemisphere grid ───────────────────────────────
const buildBubbleInstances = (
  W: number,
  H: number,
  bubbleR: number,
  gap: number,
  zBase: number
): THREE.InstancedMesh => {
  const spacing = bubbleR * 2 + gap;
  const cols = Math.floor((W - gap) / spacing);
  const rows = Math.floor((H - gap) / spacing);

  // Reserve space to skip top flap area
  const flapH = 0.28;
  const activeH = H - flapH;
  const activeRows = Math.floor((activeH - gap) / spacing);

  const count = cols * activeRows;
  const sphereGeo = new THREE.SphereGeometry(bubbleR, 8, 5, 0, Math.PI * 2, 0, Math.PI * 0.55);
  const mat = new THREE.MeshPhysicalMaterial({
    color: '#d8f0ff',
    roughness: 0.15,
    metalness: 0.0,
    clearcoat: 1.0,
    clearcoatRoughness: 0.05,
    transparent: true,
    opacity: 0.85,
  });

  const mesh = new THREE.InstancedMesh(sphereGeo, mat, count);
  mesh.castShadow = true;

  const dummy = new THREE.Object3D();
  const startX = -(cols * spacing) / 2 + spacing / 2;
  const startY = -(H / 2) + gap + spacing / 2;

  let idx = 0;
  for (let row = 0; row < activeRows; row++) {
    for (let col = 0; col < cols; col++) {
      // Hex-offset every other row for honeycomb effect
      const xOffset = (row % 2 === 0) ? 0 : spacing * 0.5;
      const cx = startX + col * spacing + xOffset;
      const cy = startY + row * spacing;

      dummy.position.set(cx, cy, zBase);
      dummy.rotation.set(-Math.PI / 2, 0, 0); // flip hemisphere to face outward
      dummy.updateMatrix();
      mesh.setMatrixAt(idx++, dummy.matrix);
    }
  }
  mesh.instanceMatrix.needsUpdate = true;
  return mesh;
};

export const BubbleMailer = ({ color, autoRotate, textureUrl, bgTextureUrl, activeFaces }: Props) => {
  const groupRef = useRef<THREE.Group>(null!);
  const logoTex = useTexture(textureUrl || EMPTY_TEX);
  const bgTex = useTexture(bgTextureUrl || EMPTY_TEX);
  logoTex.colorSpace = THREE.SRGBColorSpace;
  bgTex.colorSpace = THREE.SRGBColorSpace;

  useFrame((_, dt) => {
    if (groupRef.current && autoRotate) groupRef.current.rotation.y += dt * 0.28;
  });

  // ── Dimensions ──────────────────────────────────────────────────────────────
  const BW = 1.55;
  const BH = 1.95;
  const BULGE = 0.07;        // how much the bag puffs
  const FLAP_H = 0.28;      // opening flap height
  const SEAL_W = 0.055;     // heat-seal border width

  // ── Materials ───────────────────────────────────────────────────────────────
  const bagColor = color || '#f472b6'; // hot pink default, like reference

  const showFront = !activeFaces || activeFaces['front'] !== false;
  const frontTex = showFront && textureUrl ? logoTex : (bgTextureUrl ? bgTex : null);

  // Glossy polythene front face
  const mFront = useMemo(() => new THREE.MeshPhysicalMaterial({
    color: frontTex ? '#ffffff' : bagColor,
    map: frontTex || undefined,
    roughness: 0.12,
    metalness: 0.05,
    clearcoat: 1.0,
    clearcoatRoughness: 0.06,
    side: THREE.FrontSide,
  }), [bagColor, frontTex]);

  // Slightly darker back face (bubble side)
  const mBack = useMemo(() => new THREE.MeshPhysicalMaterial({
    color: bagColor,
    roughness: 0.18,
    metalness: 0.05,
    clearcoat: 0.8,
    clearcoatRoughness: 0.1,
    side: THREE.BackSide,
  }), [bagColor]);

  // Heat-seal edge strips
  const mSeal = useMemo(() => new THREE.MeshPhysicalMaterial({
    color: bagColor,
    roughness: 0.3,
    metalness: 0.05,
    clearcoat: 0.6,
    side: THREE.DoubleSide,
  }), [bagColor]);

  // Peel-and-seal adhesive strip (white/silver strip)
  const mSealStrip = useMemo(() => new THREE.MeshPhysicalMaterial({
    color: '#f0f0f0',
    roughness: 0.55,
    metalness: 0.0,
    clearcoat: 0.2,
  }), []);

  // Red dashed seal indicator line
  const mRedSeal = useMemo(() => new THREE.MeshStandardMaterial({
    color: '#e05050',
    roughness: 0.8,
  }), []);

  // Flap (polythene fold)
  const mFlap = useMemo(() => new THREE.MeshPhysicalMaterial({
    color: bagColor,
    roughness: 0.12,
    metalness: 0.05,
    clearcoat: 1.0,
    clearcoatRoughness: 0.06,
    side: THREE.DoubleSide,
  }), [bagColor]);

  // ── Geometry ────────────────────────────────────────────────────────────────
  const frontGeo = useMemo(() => buildBagFaceGeo(BW, BH, 1, BULGE), []);
  const backGeo = useMemo(() => buildBagFaceGeo(BW, BH, -1, BULGE), []);

  // Instanced bubbles sitting on the back face
  const bubbleMesh = useMemo(() => buildBubbleInstances(
    BW - SEAL_W * 2,
    BH - SEAL_W * 2 - FLAP_H,
    0.028,   // bubble radius — small and dense
    0.008,   // gap between bubbles
    -(BULGE * 0.55) // sit just outside the back face
  ), []);

  // ── Edge strip helpers ───────────────────────────────────────────────────────
  const THICK = 0.012;

  return (
    <group ref={groupRef} position={[0, 0, 0]}>

      {/* ══ FRONT FACE ══ */}
      <mesh scale={0.999} geometry={frontGeo} material={mFront} castShadow receiveShadow />

      {/* ══ BACK FACE ══ */}
      <mesh scale={0.999} geometry={backGeo} material={mBack} castShadow receiveShadow />

      {/* ══ BUBBLE WRAP on back ══ */}
      <primitive object={bubbleMesh} position={[0, FLAP_H * 0.5 - 0.14, 0]} />

      {/* ══ HEAT SEAL EDGES ══ */}
      {/* Left */}
      <mesh scale={0.999} castShadow position={[-BW / 2 + SEAL_W / 2, 0, 0]}>
        <boxGeometry args={[SEAL_W, BH, THICK]} />
        <primitive object={mSeal} attach="material" />
      </mesh>
      {/* Right */}
      <mesh scale={0.999} castShadow position={[BW / 2 - SEAL_W / 2, 0, 0]}>
        <boxGeometry args={[SEAL_W, BH, THICK]} />
        <primitive object={mSeal} attach="material" />
      </mesh>
      {/* Bottom */}
      <mesh scale={0.999} castShadow position={[0, -BH / 2 + SEAL_W / 2, 0]}>
        <boxGeometry args={[BW, SEAL_W, THICK]} />
        <primitive object={mSeal} attach="material" />
      </mesh>

      {/* ══ OPENING at top — peel-and-seal strip ══ */}
      {/* Main seal strip (white adhesive band) */}
      <mesh scale={0.999} position={[0, BH / 2 - FLAP_H + 0.035, 0.001]} castShadow>
        <boxGeometry args={[BW - SEAL_W * 2, 0.055, THICK]} />
        <primitive object={mSealStrip} attach="material" />
      </mesh>
      {/* Red indicator dashes (printed stripe below seal) */}
      {[-0.45, -0.2, 0.05, 0.3, 0.55].map((xOff, i) => (
        <mesh scale={0.999} key={i} position={[xOff, BH / 2 - FLAP_H - 0.01, 0.002]}>
          <boxGeometry args={[0.14, 0.018, 0.002]} />
          <primitive object={mRedSeal} attach="material" />
        </mesh>
      ))}

      {/* ══ TOP FLAP (fold over to back) ══ */}
      <group
        position={[0, BH / 2 - SEAL_W * 0.5, 0]}
        rotation={[Math.PI * 0.02, 0, 0]}  // very slight tilt showing it's open
      >
        <mesh scale={0.999} castShadow>
          <planeGeometry args={[BW - SEAL_W * 2, FLAP_H, 8, 4]} />
          <primitive object={mFlap} attach="material" />
        </mesh>
        {/* Flap top edge seal */}
        <mesh scale={0.999} position={[0, FLAP_H / 2 - SEAL_W / 2, 0]}>
          <boxGeometry args={[BW - SEAL_W * 2, SEAL_W, THICK]} />
          <primitive object={mSeal} attach="material" />
        </mesh>
      </group>

    </group>
  );
};
