const fs = require('fs');
const path = '/home/Suhaif/Downloads/box_art_lab_project/box-art-lab/src/components/ScaleView2D.tsx';
let content = fs.readFileSync(path, 'utf8');

const trianglePrismLogic = `
  /* ── TRIANGLE PRISM (Standing Isosceles Triangle) ──────────────────────── */
  if (type === 'triangle-prism') {
    if (view === 'side') {
      return <rect x={x} y={y} width={w} height={h} fill={fill} stroke={stroke} strokeWidth={1.5} rx={1} />;
    }
    if (view === 'top') {
      return (
        <g>
          <rect x={x} y={y} width={w} height={h} fill={fill} stroke={stroke} strokeWidth={1.5} rx={1} />
          <line x1={x} y1={y + h/2} x2={x+w} y2={y + h/2} stroke={stroke} strokeWidth={1} opacity={0.6} strokeDasharray="4,2" />
        </g>
      );
    }
    // Front: Isosceles triangle pointing up
    return (
      <path d={\`M \${x},\${y + h} L \${x + w/2},\${y} L \${x + w},\${y + h} Z\`} fill={fill} stroke={stroke} strokeWidth={1.5} strokeLinejoin="round" />
    );
  }
`;

content = content.replace('  // Fallback\n  return <rect', trianglePrismLogic + '\n  // Fallback\n  return <rect');
fs.writeFileSync(path, content, 'utf8');
