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

export const BookMailer = ({ color, autoRotate, textureUrl, bgTextureUrl, activeFaces }: Props) => {
  const groupRef = useRef<THREE.Group>(null!);
  
  const texture = useTexture(textureUrl || 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=');
  const bgTex = useTexture(bgTextureUrl || 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=');
  texture.colorSpace = THREE.SRGBColorSpace;
  bgTex.colorSpace = THREE.SRGBColorSpace;

  useFrame((_, dt) => {
    if (groupRef.current && autoRotate) groupRef.current.rotation.y += dt * 0.3;
  });

  const baseColor = color || '#fdfdfd'; // White outer cover
  const innerColor = '#d9b485'; // Kraft inner lining

  const extMat = useMemo(() => new THREE.MeshStandardMaterial({
    color: activeFaces?.front !== false && textureUrl ? '#ffffff' : baseColor,
    map: activeFaces?.front !== false && textureUrl ? texture : null,
    roughness: 0.2,
  }), [baseColor, textureUrl, activeFaces, texture]);

  const intMat = useMemo(() => new THREE.MeshStandardMaterial({
    color: innerColor,
    roughness: 0.9,
    side: THREE.FrontSide,
  }), [innerColor]);

  const W = 3.2; // Width
  const D = 4.0; // Length
  const H = 0.8; // Height of side walls
  const T = 0.05; // Board thickness

  // Pop-up folding walls for the sides
  const sideGeo = useMemo(() => {
     const geo = new THREE.PlaneGeometry(D, H, 2, 2);
     geo.translate(0, H/2, 0);
     const pos = geo.attributes.position;
     
     for (let i = 0; i < pos.count; i++) {
        const x = pos.getX(i);
        const y = pos.getY(i);
        let z = pos.getZ(i);

        const nx = x / (D/2); // -1 to 1
        const ny = y / H; // 0 to 1

        // Center line pops up significantly
        if (Math.abs(nx) < 0.01) {
           z += ny * 0.5;
        } else if (ny > 0) {
           // Edges pop up slightly
           z += ny * 0.15;
        }
        
        pos.setXYZ(i, x, y, z);
     }
     geo.computeVertexNormals();
     return geo;
  }, [D, H]);

  return (
    <group ref={groupRef} position={[0, -0.4, 0]} scale={[1.0, 1.0, 1.0]}>
       {/* ── BASE BOARD ── */}
       <mesh scale={0.999} position={[0, T + 0.002, 0]} rotation={[-Math.PI/2, 0, 0]} castShadow receiveShadow>
          <planeGeometry args={[W, D]} />
          <primitive object={intMat} />
       </mesh>
       <mesh scale={0.999} position={[0, T/2, 0]} castShadow receiveShadow>
          <boxGeometry args={[W + T*2, T, D + T*2]} />
          <primitive object={extMat} />
       </mesh>

       {/* ── FOLDING SIDE WALLS (Inner lining only) ── */}
       {/* Left Side */}
       <group position={[-W/2, T + 0.01, 0]}>
          <mesh scale={0.999} rotation={[-Math.PI/2, 0, -Math.PI/2]} geometry={sideGeo} castShadow receiveShadow>
             <meshStandardMaterial attach="material" color={innerColor} roughness={0.9} side={THREE.DoubleSide} />
          </mesh>
       </group>
       {/* Right Side */}
       <group position={[W/2, T + 0.01, 0]}>
          <mesh scale={0.999} rotation={[-Math.PI/2, 0, Math.PI/2]} geometry={sideGeo} castShadow receiveShadow>
             <meshStandardMaterial attach="material" color={innerColor} roughness={0.9} side={THREE.DoubleSide} />
          </mesh>
       </group>
       
       {/* ── WRAP-AROUND COVER (Back + Top + Front Flap) ── */}
       <group position={[0, T/2, -D/2]} rotation={[-0.2, 0, 0]}>
          {/* Back Wall section */}
          <mesh scale={0.999} position={[0, H/2, -T/2]} castShadow receiveShadow>
             <boxGeometry args={[W + T*2, H, T]} />
             <primitive object={extMat} />
          </mesh>
          <mesh scale={0.999} position={[0, H/2, 0.002]} castShadow receiveShadow>
             <planeGeometry args={[W, H]} />
             <primitive object={intMat} />
          </mesh>

          {/* Top Lid section */}
          <group position={[0, H, -T/2]} rotation={[-0.4, 0, 0]}>
             <mesh scale={0.999} position={[0, D/2, T/2]} castShadow receiveShadow>
                <boxGeometry args={[W + T*2, D, T]} />
                <primitive object={extMat} />
             </mesh>
             <mesh scale={0.999} position={[0, D/2, T - 0.002]} rotation={[Math.PI, 0, 0]} castShadow receiveShadow>
                <planeGeometry args={[W, D]} />
                <primitive object={intMat} />
             </mesh>
             
             {/* Magnetic Front Flap */}
             <group position={[0, D, T/2]} rotation={[-0.8, 0, 0]}>
                <mesh scale={0.999} position={[0, H/2, 0]} castShadow receiveShadow>
                   <boxGeometry args={[W + T*2, H, T]} />
                   <primitive object={extMat} />
                </mesh>
                <mesh scale={0.999} position={[0, H/2, T/2 - 0.002]} rotation={[Math.PI, 0, 0]} castShadow receiveShadow>
                   <planeGeometry args={[W, H]} />
                   <primitive object={intMat} />
                </mesh>
             </group>
          </group>
       </group>
    </group>
  );
};
