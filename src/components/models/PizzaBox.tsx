import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface Props { color: string; autoRotate: boolean; textureUrl?: string | null; }

export const PizzaBox = ({ color, autoRotate, textureUrl }: Props) => {
  const groupRef = useRef<THREE.Group>(null!);

  const texture = useMemo(() => {
    if (!textureUrl) return null;
    const t = new THREE.TextureLoader().load(textureUrl);
    t.colorSpace = THREE.SRGBColorSpace;
    return t;
  }, [textureUrl]);

  useFrame((_, delta) => {
    if (groupRef.current && autoRotate) groupRef.current.rotation.y += delta * 0.3;
  });

  const boxColor = color || '#d4a843';
  // Corrugated-cardboard look
  const mat = (col = boxColor) => (
    <meshPhysicalMaterial
      color={texture ? '#ffffff' : col}
      map={texture ?? undefined}
      roughness={0.75}
      metalness={0.0}
    />
  );

  // ── Dimensions ───────────────────────────────────────────────
  const W  = 2.0;   // width  (X)
  const D  = 2.0;   // depth  (Z)
  const bt = 0.015; // board thickness
  const BH = 0.13;  // base tray inner wall height
  const LH = 0.09;  // lid inner wall height
  const halfW = W / 2;
  const halfD = D / 2;

  // ── Open angle for the lid ──
  const lidOpenAngle = -0.38; // radians (~22°) — lid open upward from back hinge

  /*
   * Coordinate plan (model rests on ContactShadow plane at y ≈ -1.2):
   *
   *   Base tray:
   *     - Floor plate : y = 0, xz centred
   *     - Walls        : rise from y = 0 up to y = BH
   *
   *   Lid:
   *     - Hinge line   : back edge of base top  →  z = -halfD,  y = BH
   *     - Pivot group placed at [0, BH, -halfD]
   *     - Inside pivot group lid parts are offset +halfD along Z
   *       so the back edge of the lid coincides with the pivot
   */

  return (
    <group ref={groupRef} position={[0, -BH / 2, 0]}>

      {/* ══════════════ BASE TRAY ══════════════ */}
      <group>
        {/* Floor */}
        <mesh castShadow position={[0, 0, 0]}>
          <boxGeometry args={[W, bt, D]} />
          {mat()}
        </mesh>

        {/* Front wall  (z = +halfD) */}
        <mesh castShadow position={[0, BH / 2 + bt / 2, halfD - bt / 2]}>
          <boxGeometry args={[W, BH, bt]} />
          {mat()}
        </mesh>

        {/* Back wall   (z = -halfD) */}
        <mesh castShadow position={[0, BH / 2 + bt / 2, -halfD + bt / 2]}>
          <boxGeometry args={[W, BH, bt]} />
          {mat()}
        </mesh>

        {/* Left wall   (x = -halfW) */}
        <mesh castShadow position={[-halfW + bt / 2, BH / 2 + bt / 2, 0]}>
          <boxGeometry args={[bt, BH, D]} />
          {mat()}
        </mesh>

        {/* Right wall  (x = +halfW) */}
        <mesh castShadow position={[halfW - bt / 2, BH / 2 + bt / 2, 0]}>
          <boxGeometry args={[bt, BH, D]} />
          {mat()}
        </mesh>

        {/* Interior base surface (slightly darker kraft) */}
        <mesh position={[0, bt / 2 + 0.001, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[W - bt * 2, D - bt * 2]} />
          <meshStandardMaterial color="#c8893a" roughness={0.8} />
        </mesh>
      </group>

      {/* ══════════════ LID (hinged at back top edge of base) ══════════════
       *  Pivot anchor = [0, BH + bt, -halfD]
       *  Lid rotates around X axis at this point.
       *  Inside the pivot group everything is offset +halfD along Z.
       */}
      <group position={[0, BH + bt, -halfD]} rotation={[lidOpenAngle, 0, 0]}>

        {/* Lid top panel — offset so its back edge is at z=0 (pivot) */}
        <mesh castShadow position={[0, LH + bt / 2, halfD]}>
          <boxGeometry args={[W, bt, D]} />
          {mat()}
        </mesh>

        {/* Lid top face — texture / brand print */}
        <mesh position={[0, LH + bt + 0.001, halfD]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[W - 0.05, D - 0.05]} />
          <meshStandardMaterial
            color={texture ? '#ffffff' : '#c8893a'}
            map={texture ?? undefined}
            roughness={0.65}
          />
        </mesh>

        {/* Lid front wall */}
        <mesh castShadow position={[0, LH / 2, W - bt / 2]}>
          <boxGeometry args={[W, LH, bt]} />
          {mat()}
        </mesh>

        {/* Lid back wall (at pivot z=0) */}
        <mesh castShadow position={[0, LH / 2, bt / 2]}>
          <boxGeometry args={[W, LH, bt]} />
          {mat()}
        </mesh>

        {/* Lid left wall */}
        <mesh castShadow position={[-halfW + bt / 2, LH / 2, halfD]}>
          <boxGeometry args={[bt, LH, D]} />
          {mat()}
        </mesh>

        {/* Lid right wall */}
        <mesh castShadow position={[halfW - bt / 2, LH / 2, halfD]}>
          <boxGeometry args={[bt, LH, D]} />
          {mat()}
        </mesh>

        {/* Lid underside */}
        <mesh position={[0, 0, halfD]} rotation={[Math.PI / 2, 0, 0]}>
          <planeGeometry args={[W - bt * 2, D - bt * 2]} />
          <meshStandardMaterial color="#c8893a" roughness={0.8} side={THREE.BackSide} />
        </mesh>
      </group>

      {/* ══════════════ GREASE-STAIN DETAIL on base interior ══════════════ */}
      {!texture && (
        <mesh position={[0, bt + 0.002, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <circleGeometry args={[0.55, 40]} />
          <meshStandardMaterial color="#a06020" roughness={0.95} transparent opacity={0.25} />
        </mesh>
      )}
    </group>
  );
};
