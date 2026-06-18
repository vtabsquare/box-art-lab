const fs = require('fs');
const p = 'src/components/models/PizzaBox.tsx';
let code = fs.readFileSync(p, 'utf8');

// Fix Left/Right walls to not z-fight with Front/Back walls
code = code.replace(/<boxGeometry args=\{\[bt, BH, D\]\} \/>/g, '<boxGeometry args={[bt * 0.95, BH * 0.99, D * 0.99]} />');
code = code.replace(/<boxGeometry args=\{\[bt, LH, D\]\} \/>/g, '<boxGeometry args={[bt * 0.95, LH * 0.99, D * 0.99]} />');
// Fix Front/Back walls
code = code.replace(/<boxGeometry args=\{\[W, BH, bt\]\} \/>/g, '<boxGeometry args={[W * 0.99, BH * 0.99, bt * 0.95]} />');
code = code.replace(/<boxGeometry args=\{\[W, LH, bt\]\} \/>/g, '<boxGeometry args={[W * 0.99, LH * 0.99, bt * 0.95]} />');
// Floor and Lid top
code = code.replace(/<boxGeometry args=\{\[W, bt, D\]\} \/>/g, '<boxGeometry args={[W * 0.99, bt * 0.95, D * 0.99]} />');

fs.writeFileSync(p, code);
