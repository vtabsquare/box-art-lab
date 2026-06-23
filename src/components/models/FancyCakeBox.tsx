import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface Props { color: string; autoRotate: boolean; textureUrl?: string | null; bgTextureUrl?: string | null; }

const W = 1.4; 
const W_max = 1.95; 
const H = 1.25; 
const W_tab = 1.0; 
const HandleW = 0.6; 

const L_main = 1.6; 
const L_tab = 0.15; 
const L_handle = 0.26; 

function getFold(y2d: number, isFront: boolean, isSide: boolean) {
    if (y2d <= L_main) {
        const t = y2d / L_main;
        const tInv = 1 - t;
        
        if (isSide) {
            // Side panel body: Bulges significantly less so it tucks INSIDE the front panel
            const z0 = W/2; 
            const z1 = W_max/2 * 1.0; 
            const z2 = W_max/2 * 0.8; 
            const z3 = W_tab/2 * 0.8; 
            const z = tInv*tInv*tInv*z0 + 3*tInv*tInv*t*z1 + 3*tInv*t*t*z2 + t*t*t*z3;
            
            const y0 = 0, y1 = H * 0.4, y2 = H * 0.8, y3 = H;
            const y = tInv*tInv*tInv*y0 + 3*tInv*tInv*t*y1 + 3*tInv*t*t*y2 + t*t*t*y3;
            const dzdt = 3*tInv*tInv*(z1-z0) + 6*tInv*t*(z2-z1) + 3*t*t*(z3-z2);
            const dydt = 3*tInv*tInv*(y1-y0) + 6*tInv*t*(y2-y1) + 3*t*t*(y3-y2);
            const len = Math.sqrt(dzdt*dzdt + dydt*dydt) || 1;
            
            // Side panel width is narrower than front panel depth, preventing corners from joining!
            const w0 = W/2; 
            const w1 = W_max/2 * 1.1; 
            const w2 = W_max/2 * 0.9; 
            const w3 = W_tab/2 * 0.8; 
            const width = tInv*tInv*tInv*w0 + 3*tInv*tInv*t*w1 + 3*tInv*t*t*w2 + t*t*t*w3;
            return { y, z, ny: -dzdt/len, nz: dydt/len, width };
        } else {
            // Front panel body: Bulges massively outwards
            const z0 = W/2; 
            const z1 = W_max/2 * 1.3; 
            const z2 = W_max/2 * 1.1; 
            const z3 = W_tab/2; 
            const z = tInv*tInv*tInv*z0 + 3*tInv*tInv*t*z1 + 3*tInv*t*t*z2 + t*t*t*z3;
            
            const y0 = 0, y1 = H * 0.4, y2 = H * 0.9, y3 = H;
            const y = tInv*tInv*tInv*y0 + 3*tInv*tInv*t*y1 + 3*tInv*t*t*y2 + t*t*t*y3;
            const dzdt = 3*tInv*tInv*(z1-z0) + 6*tInv*t*(z2-z1) + 3*t*t*(z3-z2);
            const dydt = 3*tInv*tInv*(y1-y0) + 6*tInv*t*(y2-y1) + 3*t*t*(y3-y2);
            const len = Math.sqrt(dzdt*dzdt + dydt*dydt) || 1;
            
            // Front panel width overlaps the side panels completely
            const w0 = W/2; 
            const w1 = W_max/2 * 1.3; 
            const w2 = W_max/2 * 1.1; 
            const w3 = W_tab/2; 
            const width = tInv*tInv*tInv*w0 + 3*tInv*tInv*t*w1 + 3*tInv*t*t*w2 + t*t*t*w3;
            return { y, z, ny: -dzdt/len, nz: dydt/len, width };
        }
    } else if (isSide) { 
        const t = Math.max(0, Math.min(1, (y2d - L_main) / L_tab));
        const tInv = 1 - t;
        
        const z0 = W_tab/2 * 0.8; 
        const z1 = 0.365; 
        const z2 = 0.35; 
        const z3 = 0.3; 
        const z = tInv*tInv*tInv*z0 + 3*tInv*tInv*t*z1 + 3*tInv*t*t*z2 + t*t*t*z3;
        
        const y0 = H, y1 = H + 0.023, y2 = H + 0.02, y3 = H;
        const y = tInv*tInv*tInv*y0 + 3*tInv*tInv*t*y1 + 3*tInv*t*t*y2 + t*t*t*y3;
        const dzdt = 3*tInv*tInv*(z1-z0) + 6*tInv*t*(z2-z1) + 3*t*t*(z3-z2);
        const dydt = 3*tInv*tInv*(y1-y0) + 6*tInv*t*(y2-y1) + 3*t*t*(y3-y2);
        const len = Math.sqrt(dzdt*dzdt + dydt*dydt) || 1;
        
        const w0 = W_tab/2 * 0.8; 
        const w1 = 0.356; 
        const w2 = 0.25; 
        const w3 = 0.2;
        const width = tInv*tInv*tInv*w0 + 3*tInv*tInv*t*w1 + 3*tInv*t*t*w2 + t*t*t*w3;
        return { y, z, ny: -dzdt/len, nz: dydt/len, width };
    } else { 
        const t = Math.max(0, Math.min(1, (y2d - L_main) / L_tab));
        const tInv = 1 - t;
        
        const z0 = W_tab/2, z1 = 0.447, z2 = 0.15, z3 = -0.01; 
        const z = tInv*tInv*tInv*z0 + 3*tInv*tInv*t*z1 + 3*tInv*t*t*z2 + t*t*t*z3;
        
        const y0 = H, y1 = 1.262; 
        const Y_peak = !isFront ? H + 0.06 : H + 0.04; 
        const Y_end  = !isFront ? H + 0.04 : H + 0.02;
        const y2 = Y_peak, y3 = Y_end;
        const y = tInv*tInv*tInv*y0 + 3*tInv*tInv*t*y1 + 3*tInv*t*t*y2 + t*t*t*y3;
        const dzdt = 3*tInv*tInv*(z1-z0) + 6*tInv*t*(z2-z1) + 3*t*t*(z3-z2);
        const dydt = 3*tInv*tInv*(y1-y0) + 6*tInv*t*(y2-y1) + 3*t*t*(y3-y2);
        const len = Math.sqrt(dzdt*dzdt + dydt*dydt) || 1;
        
        const w0 = W_tab/2; 
        const w1 = 0.446; 
        const w2 = HandleW/2; 
        const w3 = HandleW/2;
        const width = tInv*tInv*tInv*w0 + 3*tInv*tInv*t*w1 + 3*tInv*t*t*w2 + t*t*t*w3;
        return { y, z, ny: -dzdt/len, nz: dydt/len, width };
    }
}

function mapVertices(geo: THREE.BufferGeometry, isFront: boolean, isSide: boolean) {
    geo.computeVertexNormals();
    const pos = geo.attributes.position;
    const norm = geo.attributes.normal;
    const uv = geo.attributes.uv;
    
    geo.computeBoundingBox();
    const minX = geo.boundingBox!.min.x;
    const maxX = geo.boundingBox!.max.x;
    const minY = geo.boundingBox!.min.y;
    const maxY = geo.boundingBox!.max.y;

    for(let i=0; i<pos.count; i++) {
        const oX = pos.getX(i);
        const oY = pos.getY(i);
        const oZ = pos.getZ(i);
        const nx = norm.getX(i);
        const ny = norm.getY(i);
        const nz = norm.getZ(i);

        if (uv) uv.setXY(i, (oX - minX) / (maxX - minX), (oY - minY) / (maxY - minY));
        
        const f = getFold(oY, isFront, isSide);
        const nX = oX;
        const nY = f.y + f.ny * oZ;
        const nZ = f.z + f.nz * oZ;
        
        pos.setXYZ(i, nX, nY, nZ);
        
        const new_nx = nx;
        const new_ny = ny * f.nz + nz * f.ny;
        const new_nz = -ny * f.ny + nz * f.nz;
        const len = Math.sqrt(new_nx*new_nx + new_ny*new_ny + new_nz*new_nz) || 1;
        norm.setXYZ(i, new_nx/len, new_ny/len, new_nz/len);
    }
}

function getCakeShape(isHole: boolean) {
    const p = isHole ? new THREE.Path() : new THREE.Shape();
    const cY_cake = L_main * 0.45; 
    const t1W = 0.8, t1H = 0.15; 
    const t2W = 0.6, t2H = 0.15;
    const t3W = 0.35, t3H = 0.12;
    
    if (!isHole) {
        p.moveTo(-t1W/2, cY_cake - t1H);
        p.lineTo(t1W/2, cY_cake - t1H);
        p.lineTo(t1W/2, cY_cake);
        p.lineTo(t2W/2, cY_cake);
        p.lineTo(t2W/2, cY_cake + t2H);
        p.lineTo(t3W/2, cY_cake + t2H);
        p.quadraticCurveTo(0, cY_cake + t2H + t3H * 1.5, -t3W/2, cY_cake + t2H);
        p.lineTo(-t2W/2, cY_cake + t2H);
        p.lineTo(-t2W/2, cY_cake);
        p.lineTo(-t1W/2, cY_cake);
    } else {
        p.moveTo(-t1W/2, cY_cake - t1H);
        p.lineTo(-t1W/2, cY_cake);
        p.lineTo(-t2W/2, cY_cake);
        p.lineTo(-t2W/2, cY_cake + t2H);
        p.lineTo(-t3W/2, cY_cake + t2H);
        p.quadraticCurveTo(0, cY_cake + t2H + t3H * 1.5, t3W/2, cY_cake + t2H);
        p.lineTo(t2W/2, cY_cake + t2H);
        p.lineTo(t2W/2, cY_cake);
        p.lineTo(t1W/2, cY_cake);
        p.lineTo(t1W/2, cY_cake - t1H);
    }
    p.closePath(); 
    return p;
}

function createSidePanelGeo() {
    const shape = new THREE.Shape();
    const stepsBody = 64;
    const stepsTab = 24;
    
    const f0 = getFold(0, false, true);
    shape.moveTo(f0.width, 0);
    
    for(let i=1; i<=stepsBody; i++) {
        const y2d = (i/stepsBody) * L_main;
        const f = getFold(y2d, false, true);
        shape.lineTo(f.width, y2d);
    }
    for(let i=1; i<=stepsTab; i++) {
        const y2d = L_main + (i/stepsTab) * L_tab;
        const f = getFold(y2d, false, true);
        shape.lineTo(f.width, y2d);
    }
    
    const fTop = getFold(L_main + L_tab, false, true);
    shape.lineTo(-fTop.width, L_main + L_tab);
    
    for(let i=stepsTab-1; i>=0; i--) {
        const y2d = L_main + (i/stepsTab) * L_tab;
        const f = getFold(y2d, false, true);
        shape.lineTo(-f.width, y2d);
    }
    for(let i=stepsBody-1; i>=0; i--) {
        const y2d = (i/stepsBody) * L_main;
        const f = getFold(y2d, false, true);
        shape.lineTo(-f.width, y2d);
    }
    
    const geo = new THREE.ExtrudeGeometry(shape, { 
        depth: 0.005, bevelEnabled: true, bevelThickness: 0.002, bevelSize: 0.002, bevelSegments: 2, curveSegments: 32 
    });
    mapVertices(geo, false, true);
    return geo;
}

function createMainPanelGeo(isFront: boolean, hasWindow: boolean) {
    const shape = new THREE.Shape();
    const stepsBody = 64;
    const stepsTab = 24;
    
    const f0 = getFold(0, isFront, false);
    shape.moveTo(f0.width, 0);
    
    for(let i=1; i<=stepsBody; i++) {
        const y2d = (i/stepsBody) * L_main;
        const f = getFold(y2d, isFront, false);
        shape.lineTo(f.width, y2d);
    }
    for(let i=1; i<=stepsTab; i++) {
        const y2d = L_main + (i/stepsTab) * L_tab;
        const f = getFold(y2d, isFront, false);
        shape.lineTo(f.width, y2d);
    }
    
    const fTabTop = getFold(L_main + L_tab, isFront, false);
    shape.lineTo(-fTabTop.width, L_main + L_tab);
    
    for(let i=stepsTab-1; i>=0; i--) {
        const y2d = L_main + (i/stepsTab) * L_tab;
        const f = getFold(y2d, isFront, false);
        shape.lineTo(-f.width, y2d);
    }
    for(let i=stepsBody-1; i>=0; i--) {
        const y2d = (i/stepsBody) * L_main;
        const f = getFold(y2d, isFront, false);
        shape.lineTo(-f.width, y2d);
    }

    if (hasWindow) {
        shape.holes.push(getCakeShape(true) as THREE.Path);
    }

    const geo = new THREE.ExtrudeGeometry(shape, { 
        depth: 0.005, bevelEnabled: true, bevelThickness: 0.002, bevelSize: 0.002, bevelSegments: 2, curveSegments: 32 
    });
    mapVertices(geo, isFront, false);
    return geo;
}

function createHandleGeo(isFront: boolean) {
    const shape = new THREE.Shape();
    const totalL = L_main + L_tab + L_handle;
    
    const startY = L_main + L_tab - 0.04; 
    
    shape.moveTo(HandleW/2, startY);
    shape.lineTo(HandleW/2, totalL);
    
    shape.quadraticCurveTo(HandleW/2, totalL + 0.15, 0, totalL + 0.15);
    shape.quadraticCurveTo(-HandleW/2, totalL + 0.15, -HandleW/2, totalL);
    
    shape.lineTo(-HandleW/2, startY);
    shape.lineTo(HandleW/2, startY);
    
    const hHole = new THREE.Path();
    const hrX = HandleW * 0.4; 
    const hrY = L_handle * 0.35;
    const cY = L_main + L_tab + L_handle * 0.45;
    hHole.absellipse(0, cY, hrX, hrY, 0, Math.PI * 2, true, 0);
    shape.holes.push(hHole);

    const geo = new THREE.ExtrudeGeometry(shape, { 
        depth: 0.005, bevelEnabled: true, bevelThickness: 0.002, bevelSize: 0.002, bevelSegments: 2, curveSegments: 32 
    });
    
    geo.computeVertexNormals();
    const pos = geo.attributes.position;
    const norm = geo.attributes.normal;
    const uv = geo.attributes.uv;
    
    geo.computeBoundingBox();
    const minX = geo.boundingBox!.min.x;
    const maxX = geo.boundingBox!.max.x;
    const minY = geo.boundingBox!.min.y;
    const maxY = geo.boundingBox!.max.y;

    for(let i=0; i<pos.count; i++) {
        const oX = pos.getX(i);
        const oY = pos.getY(i);
        const oZ = pos.getZ(i);
        const nx = norm.getX(i);
        const ny = norm.getY(i);
        const nz = norm.getZ(i);

        if (uv) uv.setXY(i, (oX - minX) / (maxX - minX), (oY - minY) / (maxY - minY));
        
        const t = (oY - L_main - L_tab) / L_handle;
        const Y_end = !isFront ? H + 0.04 : H + 0.02;
        const handleHeight = isFront ? L_handle : L_handle - 0.02; 
        
        const nX = oX;
        const nY = Y_end + t * handleHeight; 
        const nZ = -0.01 + oZ; 
        
        pos.setXYZ(i, nX, nY, nZ);
        
        const f_ny = 0, f_nz = 1;
        const new_nx = nx;
        const new_ny = ny * f_nz + nz * f_ny; 
        const new_nz = -ny * f_ny + nz * f_nz; 
        const len = Math.sqrt(new_nx*new_nx + new_ny*new_ny + new_nz*new_nz) || 1;
        norm.setXYZ(i, new_nx/len, new_ny/len, new_nz/len);
    }
    return geo;
}

function createWindowGeo() {
    const shape = getCakeShape(false) as THREE.Shape;
    const geo = new THREE.ExtrudeGeometry(shape, {
        depth: 0.001, bevelEnabled: false, curveSegments: 32
    });
    geo.translate(0, 0, -0.001);
    mapVertices(geo, true, false);
    return geo;
}

export const FancyCakeBox = ({ color, autoRotate, textureUrl, bgTextureUrl }: Props) => {
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

  // Defaulting to the beautiful Kraft Brown from the reference photo
  const boxColor = color || '#c19a6b';

  const matProps = { roughness: 0.85, metalness: 0.0, side: THREE.DoubleSide };

  const mat = <meshPhysicalMaterial map={texture || undefined} color={texture ? '#ffffff' : boxColor} {...matProps} />;
  const bgMat = <meshPhysicalMaterial map={bgTexture || texture || undefined} color={bgTexture || texture ? '#ffffff' : boxColor} {...matProps} />;
  const glassMat = <meshPhysicalMaterial color="#ffffff" roughness={0.1} transmission={0.9} thickness={0.01} transparent opacity={0.4} side={THREE.DoubleSide} />;

  const frontBodyGeo = useMemo(() => createMainPanelGeo(true, true), []);
  const frontHandleGeo = useMemo(() => createHandleGeo(true), []);
  
  const backBodyGeo = useMemo(() => createMainPanelGeo(false, false), []);
  const backHandleGeo = useMemo(() => createHandleGeo(false), []);
  
  const sideGeo = useMemo(() => createSidePanelGeo(), []);
  const windowGeo = useMemo(() => createWindowGeo(), []);

  const baseGeo = useMemo(() => {
    const shape = new THREE.Shape();
    const r = 0.1;
    const h = W/2;
    shape.moveTo(-h+r, -h);
    shape.lineTo(h-r, -h);
    shape.quadraticCurveTo(h, -h, h, -h+r);
    shape.lineTo(h, h-r);
    shape.quadraticCurveTo(h, h, h-r, h);
    shape.lineTo(-h+r, h);
    shape.quadraticCurveTo(-h, h, -h, h-r);
    shape.lineTo(-h, -h+r);
    shape.quadraticCurveTo(-h, -h, -h+r, -h);
    
    const geo = new THREE.ExtrudeGeometry(shape, { 
        depth: 0.005, bevelEnabled: true, bevelThickness: 0.005, bevelSize: 0.005, bevelSegments: 2
    });
    geo.rotateX(Math.PI/2);
    return geo;
  }, []);

  return (
    <group ref={groupRef} position={[0, -0.4, 0]}>
      <mesh castShadow receiveShadow geometry={baseGeo} position={[0, 0, 0]}>
        {bgMat}
      </mesh>

      <mesh castShadow receiveShadow geometry={frontBodyGeo} position={[0, 0, 0]}>
        {mat}
      </mesh>
      <mesh castShadow receiveShadow geometry={frontHandleGeo} position={[0, 0, 0]}>
        {mat}
      </mesh>
      
      <mesh geometry={windowGeo} position={[0, 0, 0]}>
        {glassMat}
      </mesh>

      <mesh castShadow receiveShadow geometry={backBodyGeo} position={[0, 0, 0]} rotation={[0, Math.PI, 0]}>
        {bgMat}
      </mesh>
      <mesh castShadow receiveShadow geometry={backHandleGeo} position={[0, 0, 0]} rotation={[0, Math.PI, 0]}>
        {bgMat}
      </mesh>

      <mesh castShadow receiveShadow geometry={sideGeo} position={[0, 0, 0]} rotation={[0, -Math.PI/2, 0]}>
        {bgMat}
      </mesh>

      <mesh castShadow receiveShadow geometry={sideGeo} position={[0, 0, 0]} rotation={[0, Math.PI/2, 0]}>
        {bgMat}
      </mesh>
    </group>
  );
};
