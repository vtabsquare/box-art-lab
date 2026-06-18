import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface Props { color: string; autoRotate: boolean; textureUrl?: string | null; }

// A helper component to build a perfect wall from 4 corner points.
// This guarantees that there are no gaps, overlaps, or rotation shear bugs.
const Quad = ({ p1, p2, p3, p4, mat }: any  ) => {
  const geo = useMemo(() => {
    const vertices = new Float32Array([
      ...p1, ...p2, ...p3,
      ...p1, ...p3, ...p4
    ]);
    const uvs = new Float32Array([
      0,0, 1,0, 1,1,
      0,0, 1,1, 0,1
    ]);
    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.BufferAttribute(vertices, 3));
    geometry.setAttribute('uv', new THREE.BufferAttribute(uvs, 2));
    geometry.computeVertexNormals();
    return geometry;
  }, [p1, p2, p3, p4]);

  return <mesh scale={0.999} geometry={geo} castShadow receiveShadow>{mat}</mesh>;
};

export const HotdogBox = ({ color, autoRotate, textureUrl }: Props) => {
  const groupRef = useRef<THREE.Group>(null!);

  const texture = useMemo(() => {
    if (!textureUrl) return null;
    const t = new THREE.TextureLoader().load(textureUrl);
    t.colorSpace = THREE.SRGBColorSpace;
    return t;
  }, [textureUrl]);

  useFrame((_, delta) => {
    if (groupRef.current && autoRotate) groupRef.current.rotation.y += delta * 0.25;
  });

  const boxColor = color || '#ad8157'; 

  // DoubleSide is essential here to make the thin cardboard visible from all angles
  const mat = (
    <meshPhysicalMaterial
      map={texture || undefined}
      color={texture ? '#ffffff' : boxColor}
      roughness={0.95}
      metalness={0.05}
      clearcoat={0.0}
      side={THREE.DoubleSide}
    />
  );

  const insideMat = (
    <meshPhysicalMaterial
      color="#d3a778" // Slightly lighter natural kraft inside
      roughness={0.95}
      metalness={0.0}
      side={THREE.DoubleSide}
    />
  );

  // Box Proportions
  const W_top = 2.8, W_bot = 2.2;
  const D_top = 1.3, D_bot = 0.8;
  const H_b = 0.45, H_l = 0.45;
  const lidOpenAngle = -2.2; 

  // --- BASE COORDINATES ---
  const BL_bot = [-W_bot/2, 0, D_bot/2];
  const BR_bot = [W_bot/2, 0, D_bot/2];
  const TR_bot = [W_bot/2, 0, -D_bot/2];
  const TL_bot = [-W_bot/2, 0, -D_bot/2];

  const BL_top = [-W_top/2, H_b, D_top/2];
  const BR_top = [W_top/2, H_b, D_top/2];
  const TR_top = [W_top/2, H_b, -D_top/2];
  const TL_top = [-W_top/2, H_b, -D_top/2];

  // --- LID COORDINATES ---
  // The lid is a mirrored version of the base
  const BL_lid_bot = [-W_top/2, 0, D_top/2];
  const BR_lid_bot = [W_top/2, 0, D_top/2];
  const TR_lid_bot = [W_top/2, 0, -D_top/2];
  const TL_lid_bot = [-W_top/2, 0, -D_top/2];

  const BL_lid_top = [-W_bot/2, H_l, D_bot/2];
  const BR_lid_top = [W_bot/2, H_l, D_bot/2];
  const TR_lid_top = [W_bot/2, H_l, -D_bot/2];
  const TL_lid_top = [-W_bot/2, H_l, -D_bot/2];

  // --- WINGS & TABS ---
  const wingSize = 0.14;
  const slotW = 0.25;
  const lipW_mid = W_top * 0.35;
  const lipW_side = (W_top - lipW_mid - 2 * slotW) / 2;
  
  const tabW = 0.20;
  const tabH = 0.12;
  const tabOffset = lipW_mid/2 + slotW/2;

  const sideFlapH = 0.25;

  // Render sets of faces
  const baseWalls = [
    <Quad key="f" p1={BL_bot} p2={BR_bot} p3={BR_top} p4={BL_top} />,
    <Quad key="r" p1={BR_bot} p2={TR_bot} p3={TR_top} p4={BR_top} />,
    <Quad key="b" p1={TR_bot} p2={TL_bot} p3={TL_top} p4={TR_top} />,
    <Quad key="l" p1={TL_bot} p2={BL_bot} p3={BL_top} p4={TL_top} />,
    <Quad key="floor" p1={TL_bot} p2={TR_bot} p3={BR_bot} p4={BL_bot} />
  ];

  const baseWings = [
    // Front Wing (3 parts leaving 2 slots)
    <Quad key="wfL" p1={[-W_top/2, H_b, D_top/2]} p2={[-W_top/2 + lipW_side, H_b, D_top/2]} p3={[-W_top/2 + lipW_side, H_b, D_top/2 + wingSize]} p4={[-W_top/2, H_b, D_top/2 + wingSize]} />,
    <Quad key="wfM" p1={[-lipW_mid/2, H_b, D_top/2]} p2={[lipW_mid/2, H_b, D_top/2]} p3={[lipW_mid/2, H_b, D_top/2 + wingSize]} p4={[-lipW_mid/2, H_b, D_top/2 + wingSize]} />,
    <Quad key="wfR" p1={[W_top/2 - lipW_side, H_b, D_top/2]} p2={[W_top/2, H_b, D_top/2]} p3={[W_top/2, H_b, D_top/2 + wingSize]} p4={[W_top/2 - lipW_side, H_b, D_top/2 + wingSize]} />,
    // Side Wings
    <Quad key="wL" p1={TL_top} p2={BL_top} p3={[-W_top/2 - wingSize, H_b, D_top/2]} p4={[-W_top/2 - wingSize, H_b, -D_top/2]} />,
    <Quad key="wR" p1={BR_top} p2={TR_top} p3={[W_top/2 + wingSize, H_b, -D_top/2]} p4={[W_top/2 + wingSize, H_b, D_top/2]} />
  ];

  const lidWalls = [
    <Quad key="f" p1={BL_lid_bot} p2={BR_lid_bot} p3={BR_lid_top} p4={BL_lid_top} />,
    <Quad key="r" p1={BR_lid_bot} p2={TR_lid_bot} p3={TR_lid_top} p4={BR_lid_top} />,
    <Quad key="b" p1={TR_lid_bot} p2={TL_lid_bot} p3={TL_lid_top} p4={TR_lid_top} />,
    <Quad key="l" p1={TL_lid_bot} p2={BL_lid_bot} p3={BL_lid_top} p4={TL_lid_top} />,
    <Quad key="ceil" p1={TL_lid_top} p2={TR_lid_top} p3={BR_lid_top} p4={BL_lid_top} />
  ];

  const lidFlaps = [
    // Front Tabs
    <Quad key="tL" p1={[-tabOffset - tabW/2, 0, D_top/2]} p2={[-tabOffset + tabW/2, 0, D_top/2]} p3={[-tabOffset + tabW/2, 0, D_top/2 + tabH]} p4={[-tabOffset - tabW/2, 0, D_top/2 + tabH]} />,
    <Quad key="tR" p1={[tabOffset - tabW/2, 0, D_top/2]} p2={[tabOffset + tabW/2, 0, D_top/2]} p3={[tabOffset + tabW/2, 0, D_top/2 + tabH]} p4={[tabOffset - tabW/2, 0, D_top/2 + tabH]} />,
    // Tapered Side Tuck Flaps
    <Quad key="tfL" p1={TL_lid_bot} p2={BL_lid_bot} p3={[-W_top/2 + 0.1, -sideFlapH, D_top/2 - 0.1]} p4={[-W_top/2 + 0.1, -sideFlapH, -D_top/2 + 0.1]} />,
    <Quad key="tfR" p1={BR_lid_bot} p2={TR_lid_bot} p3={[W_top/2 - 0.1, -sideFlapH, -D_top/2 + 0.1]} p4={[W_top/2 - 0.1, -sideFlapH, D_top/2 - 0.1]} />
  ];

  const RenderGroup = ({ elements, isLid = false }: any  ) => (
    <group>
      <group>
        {elements.map((el: any  ) => React.cloneElement(el, { mat }))}
      </group>
      {/* Inner layer scaled slightly down to prevent z-fighting and show inner texture */}
      <group position={[0, isLid ? -0.002 : 0.002, 0]} scale={[0.995, 0.99, 0.995]}>
        {elements.map((el: any  ) => React.cloneElement(el, { mat: insideMat }))}
      </group>
    </group>
  );

  return (
    <group ref={groupRef} position={[0, -H_b/2, 0]}>
      {/* ════════ BASE ════════ */}
      <RenderGroup elements={[...baseWalls, ...baseWings]} />

      {/* ════════ LID (Hinged at back edge) ════════ */}
      <group position={[0, H_b, -D_top/2]} rotation={[lidOpenAngle, 0, 0]}>
        {/* Offset lid so its back bottom edge is exactly at the pivot */}
        <group position={[0, 0, D_top/2]}>
          <RenderGroup elements={[...lidWalls, ...lidFlaps]} isLid={true} />
        </group>
      </group>
    </group>
  );
};
