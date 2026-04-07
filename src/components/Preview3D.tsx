import { useRef, useMemo } from 'react';
import { Canvas, useFrame, useLoader } from '@react-three/fiber';
import { OrbitControls, Environment } from '@react-three/drei';
import * as THREE from 'three';
import { BoxDimensions } from '@/lib/designRules';

interface BoxMeshProps {
  dimensions: BoxDimensions;
  textureUrl: string | null;
}

const BoxMesh = ({ dimensions, textureUrl }: BoxMeshProps) => {
  const meshRef = useRef<THREE.Mesh>(null!);

  const texture = useMemo(() => {
    if (!textureUrl) return null;
    const tex = new THREE.TextureLoader().load(textureUrl);
    tex.colorSpace = THREE.SRGBColorSpace;
    return tex;
  }, [textureUrl]);

  useFrame((_, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += delta * 0.3;
    }
  });

  const scale = 0.3;
  const { length, width, height } = dimensions;

  return (
    <mesh ref={meshRef} castShadow receiveShadow>
      <boxGeometry args={[length * scale, height * scale, width * scale]} />
      {texture ? (
        <meshStandardMaterial map={texture} roughness={0.3} metalness={0.1} />
      ) : (
        <meshStandardMaterial color="#333333" roughness={0.4} metalness={0.2} />
      )}
    </mesh>
  );
};

interface Preview3DProps {
  dimensions: BoxDimensions;
  textureUrl: string | null;
}

const Preview3D = ({ dimensions, textureUrl }: Preview3DProps) => {
  return (
    <div className="premium-card p-4 h-[450px]">
      <p className="text-xs text-muted-foreground uppercase tracking-wider mb-3 font-body">3D Preview</p>
      <div className="w-full h-[400px] rounded-lg overflow-hidden bg-secondary">
        <Canvas
          shadows
          camera={{ position: [4, 3, 4], fov: 40 }}
          gl={{ antialias: true, alpha: true }}
        >
          <ambientLight intensity={0.4} />
          <directionalLight
            position={[5, 5, 5]}
            intensity={1.2}
            castShadow
            shadow-mapSize={[1024, 1024]}
          />
          <pointLight position={[-3, 2, -3]} intensity={0.5} color="#D4AF37" />
          <BoxMesh dimensions={dimensions} textureUrl={textureUrl} />
          <OrbitControls
            enablePan={false}
            minDistance={3}
            maxDistance={10}
            autoRotate={false}
          />
          <Environment preset="studio" />
          {/* Floor */}
          <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1.5, 0]} receiveShadow>
            <planeGeometry args={[20, 20]} />
            <shadowMaterial opacity={0.3} />
          </mesh>
        </Canvas>
      </div>
    </div>
  );
};

export default Preview3D;
