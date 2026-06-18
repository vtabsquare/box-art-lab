const fs = require('fs');
const file = 'src/components/models/BubbleMailer.tsx';
let code = fs.readFileSync(file, 'utf8');

// Fix NaN issue with Math.pow
code = code.replace(
`    const factor = Math.pow(Math.sin(fx * Math.PI * 0.5) * Math.sin(fy * Math.PI * 0.5), 0.6);`,
`    const base = Math.max(0, Math.sin(fx * Math.PI * 0.5) * Math.sin(fy * Math.PI * 0.5));
    const factor = Math.pow(base, 0.6);`
);

fs.writeFileSync(file, code);
