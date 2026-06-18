const fs = require('fs');
const file = 'src/components/models/BookMailer.tsx';
let code = fs.readFileSync(file, 'utf8');

// Fix sideGeo translation and ny
code = code.replace(
`  const sideGeo = useMemo(() => {
     const geo = new THREE.PlaneGeometry(D, H, 2, 2);
     const pos = geo.attributes.position;
     
     for (let i = 0; i < pos.count; i++) {
        const x = pos.getX(i);
        const y = pos.getY(i);
        let z = pos.getZ(i);

        const nx = x / (D/2); // -1 to 1
        const ny = (y + H/2) / H; // 0 to 1`,
`  const sideGeo = useMemo(() => {
     const geo = new THREE.PlaneGeometry(D, H, 2, 2);
     geo.translate(0, H/2, 0);
     const pos = geo.attributes.position;
     
     for (let i = 0; i < pos.count; i++) {
        const x = pos.getX(i);
        const y = pos.getY(i);
        let z = pos.getZ(i);

        const nx = x / (D/2); // -1 to 1
        const ny = y / H; // 0 to 1`
);

// Fix Base Board Z-fighting
code = code.replace(
`<mesh scale={0.999} position={[0, T, 0]} rotation={[-Math.PI/2, 0, 0]} castShadow receiveShadow>
          <planeGeometry args={[W, D]} />`,
`<mesh scale={0.999} position={[0, T + 0.002, 0]} rotation={[-Math.PI/2, 0, 0]} castShadow receiveShadow>
          <planeGeometry args={[W, D]} />`
);

// Fix Back Wall Z-fighting
code = code.replace(
`<mesh scale={0.999} position={[0, H/2, 0]} castShadow receiveShadow>
             <planeGeometry args={[W, H]} />`,
`<mesh scale={0.999} position={[0, H/2, 0.002]} castShadow receiveShadow>
             <planeGeometry args={[W, H]} />`
);

// Fix Top Lid Z-fighting
code = code.replace(
`<mesh scale={0.999} position={[0, D/2, T]} rotation={[Math.PI, 0, 0]} castShadow receiveShadow>
                <planeGeometry args={[W, D]} />`,
`<mesh scale={0.999} position={[0, D/2, T - 0.002]} rotation={[Math.PI, 0, 0]} castShadow receiveShadow>
                <planeGeometry args={[W, D]} />`
);

// Fix Front Flap Z-fighting
code = code.replace(
`<mesh scale={0.999} position={[0, H/2, T/2]} rotation={[Math.PI, 0, 0]} castShadow receiveShadow>
                   <planeGeometry args={[W, H]} />`,
`<mesh scale={0.999} position={[0, H/2, T/2 - 0.002]} rotation={[Math.PI, 0, 0]} castShadow receiveShadow>
                   <planeGeometry args={[W, H]} />`
);

fs.writeFileSync(file, code);
