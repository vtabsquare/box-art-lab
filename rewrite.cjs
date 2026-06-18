const fs = require('fs');
let code = fs.readFileSync('src/components/models/HexagonHatBox.tsx', 'utf8');

// 1. Remove rotation={[0, Math.PI / 6, 0]} from all meshes
code = code.replace(/ rotation=\{\[0, Math\.PI \/ 6, 0\]\}/g, '');

// 2. Change rotation={[-Math.PI / 2, 0, 0]} to rotation={[-Math.PI / 2, 0, Math.PI / 6]}
code = code.replace(/rotation=\{\[-Math\.PI \/ 2, 0, 0\]\}/g, 'rotation={[-Math.PI / 2, 0, Math.PI / 6]}');

// 3. Change rotation={[Math.PI / 2, 0, 0]} to rotation={[Math.PI / 2, 0, Math.PI / 6]}
code = code.replace(/rotation=\{\[Math\.PI \/ 2, 0, 0\]\}/g, 'rotation={[Math.PI / 2, 0, Math.PI / 6]}');

// 4. Ensure inner radius is small enough
code = code.replace(/const wall = 0\.02;/g, 'const wall = 0.05;');

fs.writeFileSync('src/components/models/HexagonHatBox.tsx', code);
