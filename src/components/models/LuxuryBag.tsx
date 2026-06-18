import React, { useRef, useMemo } from 'react';
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

const Quad = ({ p1, p2, p3, p4, mat }: any) => {
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

  return <mesh scale={0.999} geometry={geo} material={mat} castShadow receiveShadow />;
};

const GoldEdge = ({ start, end, radius = 0.015, mat }: any) => {
  const geo = useMemo(() => {
    const s = new THREE.Vector3(...start);
    const e = new THREE.Vector3(...end);
    const dist = s.distanceTo(e);
    
    if (dist < 0.001) return new THREE.BufferGeometry();
    
    const dir = new THREE.Vector3().subVectors(e, s).normalize();
    const q = new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 1, 0), dir);
    const geometry = new THREE.CylinderGeometry(radius, radius, dist, 8);
    geometry.applyQuaternion(q);
    const mid = new THREE.Vector3().addVectors(s, e).multiplyScalar(0.5);
    geometry.translate(mid.x, mid.y, mid.z);
    return geometry;
  }, [start, end, radius]);
  return <mesh scale={0.999} geometry={geo} material={mat} castShadow />;
};

const RibbonHandle = ({ points, mat }: any) => {
  const geo = useMemo(() => {
    const curvePoints = points.map((p: any) => new THREE.Vector3(...p));
    const curve = new THREE.CatmullRomCurve3(curvePoints);
    
    const shape = new THREE.Shape();
    const w = 0.15; // wide flat ribbon
    const t = 0.005;
    shape.moveTo(-w, -t);
    shape.lineTo(w, -t);
    shape.lineTo(w, t);
    shape.lineTo(-w, t);
    shape.lineTo(-w, -t);
    
    const extrudeSettings = {
      steps: 48,
      bevelEnabled: false,
      extrudePath: curve
    };
    
    return new THREE.ExtrudeGeometry(shape, extrudeSettings);
  }, [points]);

  return <mesh scale={0.999} geometry={geo} material={mat} castShadow />;
};

export const LuxuryBag = ({ color, autoRotate, textureUrl }: Props) => {
  const groupRef = useRef<THREE.Group>(null!);
  const logoTex = useTexture(textureUrl || EMPTY_TEX);
  logoTex.colorSpace = THREE.SRGBColorSpace;

  useFrame((_, dt) => {
    if (groupRef.current && autoRotate) groupRef.current.rotation.y += dt * 0.25;
  });

  const extC = color || '#e6959b'; // Premium blush pink paper color

  const mPaper = new THREE.MeshPhysicalMaterial({ 
    color: textureUrl ? '#ffffff' : extC, 
    map: textureUrl ? logoTex : undefined,
    roughness: 0.5, 
    metalness: 0.1,
    clearcoat: 0.1,
    side: THREE.DoubleSide
  });

  const mPaperInside = new THREE.MeshPhysicalMaterial({ 
    color: extC, 
    roughness: 0.7, 
    metalness: 0.0,
    side: THREE.DoubleSide
  });

  const mGold = new THREE.MeshPhysicalMaterial({ 
    color: '#d4af37', 
    roughness: 0.2, 
    metalness: 0.8,
    clearcoat: 0.5
  });

  // Dimensions for shopping bag
  const W = 2.4;
  const H = 2.6;
  const D = 1.0;
  const foldIn = 0.35; // inward side gusset fold

  // Front face
  const f_bl = [-W/2, 0, D/2];
  const f_br = [W/2, 0, D/2];
  const f_tr = [W/2, H, D/2];
  const f_tl = [-W/2, H, D/2];

  // Back face
  const b_bl = [W/2, 0, -D/2];
  const b_br = [-W/2, 0, -D/2];
  const b_tr = [-W/2, H, -D/2];
  const b_tl = [W/2, H, -D/2];

  // Left side gusset midpoints
  const l_bot_mid = [-W/2, 0, 0];
  const l_top_mid = [-W/2 + foldIn, H, 0];

  // Right side gusset midpoints
  const r_bot_mid = [W/2, 0, 0];
  const r_top_mid = [W/2 - foldIn, H, 0];

  const frontEdges = [
    [f_bl, f_br], [f_br, f_tr], [f_tr, f_tl], [f_tl, f_bl]
  ];
  
  const backEdges = [
    [b_bl, b_br], [b_br, b_tr], [b_tr, b_tl], [b_tl, b_bl]
  ];

  // Attached to the inside of the rim
  const frontRibbon = [
    [-0.5, H - 0.2, D/2 - 0.02],
    [-0.6, H + 0.6, D/2 + 0.1],
    [0, H + 0.9, D/2 + 0.1],
    [0.6, H + 0.6, D/2 + 0.1],
    [0.5, H - 0.2, D/2 - 0.02]
  ];

  const backRibbon = [
    [0.5, H - 0.2, -D/2 + 0.02],
    [0.6, H + 0.6, -D/2 - 0.1],
    [0, H + 0.9, -D/2 - 0.1],
    [-0.6, H + 0.6, -D/2 - 0.1],
    [-0.5, H - 0.2, -D/2 + 0.02]
  ];

  return (
    <group ref={groupRef} position={[0, -H/2, 0]} scale={[0.8, 0.8, 0.8]}>
      
      {/* Outer Bag Surface */}
      <group>
        <Quad p1={f_bl} p2={f_br} p3={f_tr} p4={f_tl} mat={mPaper} />
        <Quad p1={b_bl} p2={b_br} p3={b_tr} p4={b_tl} mat={mPaper} />
        
        <Quad p1={f_br} p2={r_bot_mid} p3={r_top_mid} p4={f_tr} mat={mPaper} />
        <Quad p1={r_bot_mid} p2={b_bl} p3={b_tl} p4={r_top_mid} mat={mPaper} />
        
        <Quad p1={b_br} p2={l_bot_mid} p3={l_top_mid} p4={b_tr} mat={mPaper} />
        <Quad p1={l_bot_mid} p2={f_bl} p3={f_tl} p4={l_top_mid} mat={mPaper} />
        
        <Quad p1={b_br} p2={b_bl} p3={f_br} p4={f_bl} mat={mPaper} />
      </group>

      {/* Inner Bag Surface (scaled slightly down to prevent Z-fighting) */}
      <group position={[0, 0.005, 0]} scale={[0.995, 0.995, 0.995]}>
        <Quad p1={f_bl} p2={f_br} p3={f_tr} p4={f_tl} mat={mPaperInside} />
        <Quad p1={b_bl} p2={b_br} p3={b_tr} p4={b_tl} mat={mPaperInside} />
        <Quad p1={f_br} p2={r_bot_mid} p3={r_top_mid} p4={f_tr} mat={mPaperInside} />
        <Quad p1={r_bot_mid} p2={b_bl} p3={b_tl} p4={r_top_mid} mat={mPaperInside} />
        <Quad p1={b_br} p2={l_bot_mid} p3={l_top_mid} p4={b_tr} mat={mPaperInside} />
        <Quad p1={l_bot_mid} p2={f_bl} p3={f_tl} p4={l_top_mid} mat={mPaperInside} />
        <Quad p1={b_br} p2={b_bl} p3={f_br} p4={f_bl} mat={mPaperInside} />
      </group>

      {/* Luxury Gold Edges */}
      {frontEdges.map((pts, i) => <GoldEdge key={`fe-${i}`} start={pts[0]} end={pts[1]} mat={mGold} />)}
      {backEdges.map((pts, i) => <GoldEdge key={`be-${i}`} start={pts[0]} end={pts[1]} mat={mGold} />)}

      {/* Premium Ribbon Handles */}
      <RibbonHandle points={frontRibbon} mat={mGold} />
      <RibbonHandle points={backRibbon} mat={mGold} />

    </group>
  );
};
