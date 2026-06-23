import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface Props { color: string; autoRotate: boolean; textureUrl?: string | null; bgTextureUrl?: string | null; }

export const CheeseBox = ({ color, autoRotate, textureUrl, bgTextureUrl }: Props) => {
  const groupRef = useRef<THREE.Group>(null!);

  const texture = useMemo(() => {
    if (!textureUrl) return null;
    const t = new THREE.TextureLoader().load(textureUrl);
    t.colorSpace = THREE.SRGBColorSpace;
    return t;
  }, [textureUrl]);

  const bgTexture = useMemo(() => {
    if (!bgTextureUrl) return null;
    const t = new THREE.TextureLoader().load(bgTextureUrl);
    t.colorSpace = THREE.SRGBColorSpace;
    return t;
  }, [bgTextureUrl]);

  useFrame((_, delta) => {
    if (groupRef.current && autoRotate) groupRef.current.rotation.y += delta * 0.35;
  });

  const boxColor = color || '#fdd835'; // Yellow cheese color

  const W = 1.4;
  const H = 1.4;
  const D = 0.4;

  const geo = useMemo(() => {
    const shape = new THREE.Shape();
    // Triangle pointing up
    shape.moveTo(0, H/2);
    shape.lineTo(-W/2, -H/2);
    shape.lineTo(W/2, -H/2);
    shape.lineTo(0, H/2);

    const extrudeSettings = {
      steps: 1,
      depth: D,
      bevelEnabled: true,
      bevelThickness: 0.01,
      bevelSize: 0.01,
      bevelOffset: 0,
      bevelSegments: 2
    };

    const geometry = new THREE.ExtrudeGeometry(shape, extrudeSettings);
    // Center the extrusion depth along Z
    geometry.translate(0, 0, -D/2);

    // Fix UV mapping so the 2D texture correctly fits the triangle
    const pos = geometry.attributes.position;
    const uv = geometry.attributes.uv;
    const index = geometry.index;
    for (let i = 0; i < uv.count; i++) {
      const x = pos.getX(i);
      const y = pos.getY(i);
      const z = pos.getZ(i);

      if (z > D / 2 - 0.05) {
        // Front face
        uv.setXY(i, x / W + 0.5, y / H + 0.5);
      } else if (z < -D / 2 + 0.05) {
        // Back face (flipped horizontally)
        uv.setXY(i, -x / W + 0.5, y / H + 0.5);
      }
      // For sides, keep the default generated UVs or they can be adjusted similarly if needed.
    }

    if (index) {
      const arr = index.array;
      const frontIndices = [];
      const otherIndices = [];
      for (let i = 0; i < arr.length; i += 3) {
        const a = arr[i];
        const b = arr[i+1];
        const c = arr[i+2];
        const zAvg = (pos.getZ(a) + pos.getZ(b) + pos.getZ(c)) / 3;
        
        if (zAvg > D / 2 - 0.05) {
          frontIndices.push(a, b, c);
        } else {
          otherIndices.push(a, b, c);
        }
      }
      geometry.setIndex([...frontIndices, ...otherIndices]);
      geometry.clearGroups();
      geometry.addGroup(0, frontIndices.length, 0);
      geometry.addGroup(frontIndices.length, otherIndices.length, 1);
    }

    return geometry;
  }, [W, H, D]);

  return (
    <group ref={groupRef} position={[0, -0.1, 0]}>
      <mesh scale={0.999} castShadow receiveShadow geometry={geo}>
        <meshPhysicalMaterial
          attach="material-0"
          map={texture || undefined}
          color={texture ? '#ffffff' : boxColor}
          roughness={0.7}
          metalness={0.0}
        />
        <meshPhysicalMaterial
          attach="material-1"
          map={bgTexture || texture || undefined}
          color={bgTexture || texture ? '#ffffff' : boxColor}
          roughness={0.7}
          metalness={0.0}
        />
      </mesh>
    </group>
  );
};
