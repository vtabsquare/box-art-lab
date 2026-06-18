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

export const PopcornBox = ({ color, autoRotate, textureUrl, bgTextureUrl, activeFaces }: Props) => {
  const groupRef = useRef<THREE.Group>(null!);
  const texture = useTexture(textureUrl || 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=');
  const bgTex = useTexture(bgTextureUrl || 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=');
  
  // Ensure accurate colors
  texture.colorSpace = THREE.SRGBColorSpace;
  bgTex.colorSpace = THREE.SRGBColorSpace;

  useFrame((_, delta) => {
    if (groupRef.current && autoRotate) {
      groupRef.current.rotation.y += delta * 0.5;
    }
  });

  // Real-world proportions: top 9×9cm, bottom 6.3×6.3cm, height 13.6cm
  const topHalf = 0.45;
  const botHalf = 0.315;
  const h = 1.36;
  const defaultColor = color || '#c89d6a'; // Kraft brown

  // Build 4 trapezoidal wall faces directly in 3D with scalloped top edges
  const wallGeometries = useMemo(() => {
    // 8 corners of the frustum
    const b0 = new THREE.Vector3(-botHalf, 0, -botHalf); // back-left bottom
    const b1 = new THREE.Vector3( botHalf, 0, -botHalf); // back-right bottom
    const b2 = new THREE.Vector3( botHalf, 0,  botHalf); // front-right bottom
    const b3 = new THREE.Vector3(-botHalf, 0,  botHalf); // front-left bottom

    const t0 = new THREE.Vector3(-topHalf, h, -topHalf); // back-left top
    const t1 = new THREE.Vector3( topHalf, h, -topHalf); // back-right top
    const t2 = new THREE.Vector3( topHalf, h,  botHalf); // front-right top
    const t3 = new THREE.Vector3(-topHalf, h,  topHalf); // front-left top

    // 4 wall quads: [bottomLeft, bottomRight, topRight, topLeft]
    const faces = [
      { bl: b3, br: b2, tr: t2, tl: t3 }, // front
      { bl: b2, br: b1, tr: t1, tl: t2 }, // right
      { bl: b1, br: b0, tr: t0, tl: t1 }, // back
      { bl: b0, br: b3, tr: t3, tl: t0 }, // left
    ];

    const scallops = 8;
    const scallopDip = 0.04;

    return faces.map(({ bl, br, tr, tl }) => {
      const segments = scallops * 4; // Smooth scallop curves
      const cols = segments;

      const vertices: number[] = [];
      const uvs: number[] = [];
      const indices: number[] = [];

      // Create a grid: 2 rows (bottom, top) × (cols+1) columns
      // Bottom row
      for (let i = 0; i <= cols; i++) {
        const t = i / cols;
        const x = bl.x + (br.x - bl.x) * t;
        const y = bl.y + (br.y - bl.y) * t;
        const z = bl.z + (br.z - bl.z) * t;
        vertices.push(x, y, z);
        uvs.push(t, 0);
      }

      // Top row with scalloped edge
      for (let i = 0; i <= cols; i++) {
        const t = i / cols;
        const x = tl.x + (tr.x - tl.x) * t;
        const baseY = tl.y + (tr.y - tl.y) * t;
        const z = tl.z + (tr.z - tl.z) * t;
        // Scallop wave: sine function creates smooth bumps
        const yOffset = Math.abs(Math.sin(t * scallops * Math.PI)) * scallopDip;
        vertices.push(x, baseY + yOffset, z);
        uvs.push(t, 1);
      }

      // Triangulate: bottom row [0..cols], top row [cols+1..2*cols+1]
      const n = cols + 1;
      for (let i = 0; i < cols; i++) {
        indices.push(i, i + 1, n + i);
        indices.push(i + 1, n + i + 1, n + i);
      }

      const geo = new THREE.BufferGeometry();
      geo.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
      geo.setAttribute('uv', new THREE.Float32BufferAttribute(uvs, 2));
      geo.setIndex(indices);
      geo.computeVertexNormals();
      return geo;
    });
  }, [topHalf, botHalf, h]);

  const botW = botHalf * 2;
  const faceNames = ['front', 'right', 'back', 'left'];

  return (
    <group ref={groupRef} position={[0, -h / 2, 0]}>
      {/* ── Outer walls (kraft brown) ── */}
      {wallGeometries.map((geo, i) => {
        const showLogo = !activeFaces || activeFaces[faceNames[i]] !== false;
        const activeTex = showLogo && textureUrl ? texture : (bgTextureUrl ? bgTex : null);
        
        return (
          <mesh scale={0.999} key={`outer-${i}`} geometry={geo} castShadow receiveShadow>
            <meshPhysicalMaterial
              color={activeTex ? '#ffffff' : defaultColor}
              map={activeTex ?? undefined}
              roughness={0.75}
              metalness={0}
              side={THREE.FrontSide}
            />
          </mesh>
        );
      })}

      {/* ── Inner walls (white cardboard) ── */}
      {wallGeometries.map((geo, i) => (
        <mesh scale={0.999} key={`inner-${i}`} geometry={geo}>
          <meshPhysicalMaterial
            color="#f8f6f0"
            roughness={0.9}
            metalness={0}
            side={THREE.BackSide}
          />
        </mesh>
      ))}

      {/* ── Bottom (white inside, kraft outside) ── */}
      <mesh scale={0.999} position={[0, 0.001, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[botW, botW]} />
        <meshPhysicalMaterial color="#f8f6f0" roughness={0.9} side={THREE.FrontSide} />
      </mesh>
      <mesh scale={0.999} position={[0, -0.001, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <planeGeometry args={[botW, botW]} />
        <meshPhysicalMaterial
          color={(!activeFaces || activeFaces.bottom !== false) && textureUrl ? '#ffffff' : defaultColor}
          map={(!activeFaces || activeFaces.bottom !== false) && textureUrl ? texture : (bgTextureUrl ? bgTex : undefined)}
          roughness={0.75}
          side={THREE.FrontSide}
        />
      </mesh>
    </group>
  );
};
