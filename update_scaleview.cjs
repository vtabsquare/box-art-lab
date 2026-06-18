const fs = require('fs');
const path = '/home/Suhaif/Downloads/box_art_lab_project/box-art-lab/src/components/ScaleView2D.tsx';
let content = fs.readFileSync(path, 'utf8');

const newShapes = `
  /* ── SLEEVE (Biriyani Box) ─────────────────────────────────────────────── */
  if (type === 'sleeve') {
    if (view === 'side') {
      return (
        <g>
          <rect x={x} y={y} width={w} height={h} fill={fill} stroke={stroke} strokeWidth={1.5} rx={1} />
          <rect x={x+2} y={y+2} width={Math.max(1, w-4)} height={Math.max(1, h-4)} fill="none" stroke={stroke} strokeWidth={0.8} opacity={0.4} />
        </g>
      );
    }
    return <rect x={x} y={y} width={w} height={h} fill={fill} stroke={stroke} strokeWidth={1.5} rx={1} />;
  }

  /* ── TAPERED CLAMSHELL (Burger Box, Hotdog Box) ────────────────────────── */
  if (type === 'tapered-clamshell') {
    const hingeY = y + h * 0.48;
    const taper = Math.min(w * 0.08, 10);
    if (view === 'top') {
      return (
        <g>
          <rect x={x} y={y} width={w} height={h} fill={fill} stroke={stroke} strokeWidth={1.5} rx={2} />
          <line x1={x + taper} y1={y + h/2} x2={x + w - taper} y2={y + h/2} stroke={stroke} strokeWidth={1} opacity={0.45} strokeDasharray="5,3" />
        </g>
      );
    }
    return (
      <g>
        <path d={\`M \${x+taper},\${hingeY} L \${x},\${y+h} L \${x+w},\${y+h} L \${x+w-taper},\${hingeY} Z\`} fill={fill} stroke={stroke} strokeWidth={1.5} strokeLinejoin="round" />
        <path d={\`M \${x+taper*1.5},\${y} L \${x+taper},\${hingeY} L \${x+w-taper},\${hingeY} L \${x+w-taper*1.5},\${y} Z\`} fill={fill} stroke={stroke} strokeWidth={1.5} strokeLinejoin="round" />
        <line x1={x+taper} y1={hingeY} x2={x+w-taper} y2={hingeY} stroke={stroke} strokeWidth={1.4} opacity={0.65} />
      </g>
    );
  }

  /* ── WINDOW BOX ────────────────────────────────────────────────────────── */
  if (type === 'window-box') {
    return (
      <g>
        <rect x={x} y={y} width={w} height={h} fill={fill} stroke={stroke} strokeWidth={1.5} rx={1.5} />
        {view === 'top' && (
          <rect x={x + w*0.15} y={y + h*0.15} width={w*0.7} height={h*0.7} fill={stroke} opacity={0.08} stroke={stroke} strokeWidth={1} rx={2} />
        )}
      </g>
    );
  }

  /* ── GABLE BOX (Fried Chicken Box) ─────────────────────────────────────── */
  if (type === 'gable-box') {
    const roofH = h * 0.35;
    const bodyY = y + roofH;
    const bodyH = h - roofH;
    if (view === 'side') {
      return (
        <g>
          <rect x={x} y={bodyY} width={w} height={bodyH} fill={fill} stroke={stroke} strokeWidth={1.5} rx={1} />
          <path d={\`M \${x},\${bodyY} L \${x + w/2},\${y} L \${x + w},\${bodyY} Z\`} fill={fill} stroke={stroke} strokeWidth={1.5} strokeLinejoin="round" />
        </g>
      );
    }
    if (view === 'top') {
      return (
        <g>
          <rect x={x} y={y} width={w} height={h} fill={fill} stroke={stroke} strokeWidth={1.5} rx={1} />
          <line x1={x} y1={y + h/2} x2={x + w} y2={y + h/2} stroke={stroke} strokeWidth={1.5} opacity={0.6} />
        </g>
      );
    }
    return (
      <g>
        <rect x={x} y={bodyY} width={w} height={bodyH} fill={fill} stroke={stroke} strokeWidth={1.5} rx={1} />
        <path d={\`M \${x},\${bodyY} Q \${x + w/2},\${y - roofH*0.2} \${x + w},\${bodyY} Z\`} fill={fill} stroke={stroke} strokeWidth={1.5} strokeLinejoin="round" />
        <rect x={x + w*0.4} y={y + roofH*0.4} width={w*0.2} height={roofH*0.3} rx={2} fill="none" stroke={stroke} strokeWidth={1.2} opacity={0.6} />
      </g>
    );
  }

  /* ── DOME BOX (Fancy Cake Box) ─────────────────────────────────────────── */
  if (type === 'dome-box') {
    const roofH = h * 0.3;
    const bodyY = y + roofH;
    const bodyH = h - roofH;
    if (view === 'side') {
      return (
        <g>
          <rect x={x} y={bodyY} width={w} height={bodyH} fill={fill} stroke={stroke} strokeWidth={1.5} rx={1} />
          <path d={\`M \${x},\${bodyY} A \${w/2} \${roofH} 0 0 1 \${x+w},\${bodyY} Z\`} fill={fill} stroke={stroke} strokeWidth={1.5} strokeLinejoin="round" />
        </g>
      );
    }
    if (view === 'top') {
      return (
        <g>
          <rect x={x} y={y} width={w} height={h} fill={fill} stroke={stroke} strokeWidth={1.5} rx={1} />
          <rect x={x + w*0.4} y={y + h*0.45} width={w*0.2} height={h*0.1} fill={stroke} opacity={0.3} rx={1} />
        </g>
      );
    }
    return (
      <g>
        <rect x={x} y={bodyY} width={w} height={bodyH} fill={fill} stroke={stroke} strokeWidth={1.5} rx={1} />
        <rect x={x} y={y + roofH*0.5} width={w} height={roofH*0.5} fill={fill} stroke={stroke} strokeWidth={1.5} />
        <path d={\`M \${x + w*0.3},\${y + roofH*0.5} Q \${x + w/2},\${y} \${x + w*0.7},\${y + roofH*0.5}\`} fill="none" stroke={stroke} strokeWidth={2} strokeLinecap="round" />
      </g>
    );
  }

  /* ── CLEAR COVER TRAY (Hamper Box) ─────────────────────────────────────── */
  if (type === 'clear-cover-tray') {
    const trayH = Math.max(8, h * 0.2);
    if (view === 'top') {
      return <rect x={x} y={y} width={w} height={h} fill={fill} stroke={stroke} strokeWidth={1.5} rx={1.5} />;
    }
    return (
      <g>
        <rect x={x+1} y={y} width={Math.max(1, w-2)} height={Math.max(1, h - trayH)} fill={stroke} opacity={0.08} stroke={stroke} strokeWidth={1} rx={1} />
        <rect x={x} y={y + h - trayH} width={w} height={trayH} fill={fill} stroke={stroke} strokeWidth={1.5} rx={1} />
      </g>
    );
  }

  /* ── RIGID HINGED (Festival Box) ───────────────────────────────────────── */
  if (type === 'rigid-hinged') {
    const lidT = 4;
    if (view === 'top') {
      return <rect x={x} y={y} width={w} height={h} fill={fill} stroke={stroke} strokeWidth={1.5} rx={1.5} />;
    }
    if (view === 'side') {
      return (
        <g>
          <rect x={x} y={y} width={w} height={h} fill={fill} stroke={stroke} strokeWidth={1.5} rx={1} />
          <line x1={x + lidT} y1={y} x2={x + lidT} y2={y + h} stroke={stroke} strokeWidth={0.8} opacity={0.4} />
          <line x1={x + lidT} y1={y + lidT} x2={x + w} y2={y + lidT} stroke={stroke} strokeWidth={0.8} opacity={0.4} />
        </g>
      );
    }
    return (
      <g>
        <rect x={x} y={y} width={w} height={h} fill={fill} stroke={stroke} strokeWidth={1.5} rx={1} />
        <line x1={x} y1={y + lidT} x2={x + w} y2={y + lidT} stroke={stroke} strokeWidth={1} opacity={0.5} />
      </g>
    );
  }

  /* ── TWO PIECE RIGID (Wedding Box) ─────────────────────────────────────── */
  if (type === 'two-piece-rigid') {
    const lidH = Math.max(8, h * 0.4);
    if (view === 'top') {
      return <rect x={x} y={y} width={w} height={h} fill={fill} stroke={stroke} strokeWidth={1.5} rx={1.5} />;
    }
    return (
      <g>
        <rect x={x + 1} y={y + lidH} width={Math.max(1, w - 2)} height={Math.max(1, h - lidH)} fill={fill} stroke={stroke} strokeWidth={1.5} />
        <rect x={x} y={y} width={w} height={lidH} fill={fill} stroke={stroke} strokeWidth={1.5} rx={1} />
        <line x1={x+1} y1={y + lidH} x2={x+w-1} y2={y + lidH} stroke="#000" strokeWidth={1.5} opacity={0.2} />
      </g>
    );
  }

  /* ── HANGER BOX (Gadget Box) ───────────────────────────────────────────── */
  if (type === 'hanger-box') {
    const hangH = Math.max(10, h * 0.15);
    const bodyY = y + hangH;
    const bodyH = h - hangH;
    if (view === 'top') {
      return (
        <g>
          <rect x={x} y={y} width={w} height={h} fill={fill} stroke={stroke} strokeWidth={1.5} rx={1} />
          <rect x={x + w*0.3} y={y} width={w*0.4} height={4} fill={fill} stroke={stroke} strokeWidth={1} />
        </g>
      );
    }
    if (view === 'side') {
      return (
        <g>
          <rect x={x} y={bodyY} width={w} height={bodyH} fill={fill} stroke={stroke} strokeWidth={1.5} rx={1} />
          <rect x={x} y={y} width={2} height={hangH} fill={fill} stroke={stroke} strokeWidth={1} />
        </g>
      );
    }
    return (
      <g>
        <rect x={x} y={bodyY} width={w} height={bodyH} fill={fill} stroke={stroke} strokeWidth={1.5} rx={1} />
        <rect x={x + w*0.25} y={y} width={w*0.5} height={hangH} fill={fill} stroke={stroke} strokeWidth={1.5} rx={2} />
        <ellipse cx={x + w/2} cy={y + hangH/2} rx={4} ry={4} fill="none" stroke={stroke} strokeWidth={1.2} opacity={0.6} />
      </g>
    );
  }

  /* ── SIDE GUSSET POUCH ─────────────────────────────────────────────────── */
  if (type === 'side-gusset-pouch') {
    const sealH = Math.max(6, h * 0.1);
    if (view === 'top') {
      return (
        <g>
          <rect x={x} y={y + h*0.2} width={w} height={h*0.6} fill={fill} stroke={stroke} strokeWidth={1.5} rx={2} />
          <line x1={x+w*0.2} y1={y + h*0.2} x2={x} y2={y + h*0.5} stroke={stroke} strokeWidth={1} opacity={0.5} />
          <line x1={x+w*0.2} y1={y + h*0.8} x2={x} y2={y + h*0.5} stroke={stroke} strokeWidth={1} opacity={0.5} />
          <line x1={x+w*0.8} y1={y + h*0.2} x2={x+w} y2={y + h*0.5} stroke={stroke} strokeWidth={1} opacity={0.5} />
          <line x1={x+w*0.8} y1={y + h*0.8} x2={x+w} y2={y + h*0.5} stroke={stroke} strokeWidth={1} opacity={0.5} />
        </g>
      );
    }
    if (view === 'side') {
      return (
        <g>
          <path d={\`M \${x + w/2},\${y} L \${x + w/2},\${y + sealH} L \${x},\${y + sealH*2} L \${x},\${y+h} L \${x+w},\${y+h} L \${x+w},\${y + sealH*2} Z\`} fill={fill} stroke={stroke} strokeWidth={1.5} strokeLinejoin="round" />
          <line x1={x+w/2} y1={y + sealH} x2={x+w/2} y2={y+h} stroke={stroke} strokeWidth={0.8} opacity={0.5} strokeDasharray="3,2" />
        </g>
      );
    }
    return (
      <g>
        <rect x={x} y={y + sealH} width={w} height={h - sealH} fill={fill} stroke={stroke} strokeWidth={1.5} rx={1} />
        <rect x={x + w*0.05} y={y} width={w*0.9} height={sealH} fill={fill} stroke={stroke} strokeWidth={1.5} rx={1} />
        <line x1={x + w*0.15} y1={y + sealH} x2={x + w*0.15} y2={y+h} stroke={stroke} strokeWidth={0.6} opacity={0.3} />
        <line x1={x + w*0.85} y1={y + sealH} x2={x + w*0.85} y2={y+h} stroke={stroke} strokeWidth={0.6} opacity={0.3} />
      </g>
    );
  }

  /* ── KRAFT POUCH ───────────────────────────────────────────────────────── */
  if (type === 'kraft-pouch') {
    if (view === 'top') {
      return (
        <g>
          <rect x={x} y={y} width={w} height={h} fill={fill} stroke={stroke} strokeWidth={1.5} rx={2} />
          <line x1={x} y1={y + h/2} x2={x + w*0.2} y2={y + h/2} stroke={stroke} strokeWidth={1} opacity={0.5} />
          <line x1={x + w} y1={y + h/2} x2={x + w*0.8} y2={y + h/2} stroke={stroke} strokeWidth={1} opacity={0.5} />
        </g>
      );
    }
    if (view === 'side') {
      return (
        <g>
          <rect x={x} y={y} width={w} height={h} fill={fill} stroke={stroke} strokeWidth={1.5} rx={1} />
          <line x1={x+w/2} y1={y} x2={x+w/2} y2={y+h} stroke={stroke} strokeWidth={0.8} opacity={0.5} strokeDasharray="3,2" />
        </g>
      );
    }
    let serrations = "";
    const teeth = 12;
    const toothW = w / teeth;
    for(let i=0; i<teeth; i++) {
      serrations += \`L \${x + i*toothW + toothW/2},\${y + 4} L \${x + (i+1)*toothW},\${y} \`;
    }
    return (
      <g>
        <path d={\`M \${x},\${y} \${serrations} L \${x+w},\${y+h} L \${x},\${y+h} Z\`} fill={fill} stroke={stroke} strokeWidth={1.5} strokeLinejoin="round" />
        <line x1={x + w*0.15} y1={y} x2={x + w*0.15} y2={y+h} stroke={stroke} strokeWidth={0.6} opacity={0.3} />
        <line x1={x + w*0.85} y1={y} x2={x + w*0.85} y2={y+h} stroke={stroke} strokeWidth={0.6} opacity={0.3} />
      </g>
    );
  }

  /* ── DIVIDER BOX (Fragile Item Box) ────────────────────────────────────── */
  if (type === 'divider-box') {
    if (view === 'top') {
      return (
        <g>
          <rect x={x} y={y} width={w} height={h} fill={fill} stroke={stroke} strokeWidth={2} />
          <circle cx={x + w*0.3} cy={y + h/2} r={Math.min(w,h)*0.2} fill="none" stroke={stroke} strokeWidth={1} opacity={0.6} />
          <circle cx={x + w*0.7} cy={y + h/2} r={Math.min(w,h)*0.2} fill="none" stroke={stroke} strokeWidth={1} opacity={0.6} />
        </g>
      );
    }
    if (view === 'side') {
      return (
        <g>
          <rect x={x} y={y} width={w} height={h} fill={fill} stroke={stroke} strokeWidth={1.5} rx={1} />
          <line x1={x + w*0.1} y1={y} x2={x + w*0.1} y2={y+h} stroke={stroke} strokeWidth={1} opacity={0.3} />
          <line x1={x + w*0.9} y1={y} x2={x + w*0.9} y2={y+h} stroke={stroke} strokeWidth={1} opacity={0.3} />
        </g>
      );
    }
    return (
      <g>
        <rect x={x} y={y - h*0.8} width={w} height={h*0.8} fill={stroke} opacity={0.1} stroke={stroke} strokeWidth={1.5} />
        <rect x={x} y={y} width={w} height={h} fill={fill} stroke={stroke} strokeWidth={1.5} rx={1} />
        <line x1={x + 4} y1={y} x2={x + 4} y2={y+h} stroke={stroke} strokeWidth={1} opacity={0.3} />
        <line x1={x + w - 4} y1={y} x2={x + w - 4} y2={y+h} stroke={stroke} strokeWidth={1} opacity={0.3} />
      </g>
    );
  }

  /* ── WRAP MAILER (Book Mailer) ─────────────────────────────────────────── */
  if (type === 'wrap-mailer') {
    if (view === 'side') {
      return (
        <g>
          <rect x={x} y={y} width={w} height={h} fill={fill} stroke={stroke} strokeWidth={1.5} rx={1} />
          <path d={\`M \${x},\${y + h/2} L \${x+w},\${y+h/2}\`} stroke={stroke} strokeWidth={1} opacity={0.4} strokeDasharray="3,2" />
        </g>
      );
    }
    return (
      <g>
        <rect x={x} y={y} width={w} height={h} fill={fill} stroke={stroke} strokeWidth={1.5} rx={2} />
        <line x1={x} y1={y + h*0.15} x2={x+w} y2={y + h*0.15} stroke={stroke} strokeWidth={1} opacity={0.5} />
        <line x1={x} y1={y + h*0.85} x2={x+w} y2={y + h*0.85} stroke={stroke} strokeWidth={1} opacity={0.3} strokeDasharray="4,2" />
      </g>
    );
  }

  /* ── OPEN GRID BOX (Injection Vial Box) ────────────────────────────────── */
  if (type === 'open-grid-box') {
    if (view === 'top') {
      return (
        <g>
          <rect x={x} y={y} width={w} height={h} fill={fill} stroke={stroke} strokeWidth={1.5} rx={1} />
          <line x1={x} y1={y + h/2} x2={x+w} y2={y + h/2} stroke={stroke} strokeWidth={0.8} opacity={0.5} />
          <line x1={x + w*0.2} y1={y} x2={x + w*0.2} y2={y+h} stroke={stroke} strokeWidth={0.8} opacity={0.5} />
          <line x1={x + w*0.4} y1={y} x2={x + w*0.4} y2={y+h} stroke={stroke} strokeWidth={0.8} opacity={0.5} />
          <line x1={x + w*0.6} y1={y} x2={x + w*0.6} y2={y+h} stroke={stroke} strokeWidth={0.8} opacity={0.5} />
          <line x1={x + w*0.8} y1={y} x2={x + w*0.8} y2={y+h} stroke={stroke} strokeWidth={0.8} opacity={0.5} />
        </g>
      );
    }
    if (view === 'side') {
      return (
        <g>
          <path d={\`M \${x+w},\${y} L \${x+w*0.7},\${y-h*0.8} L \${x+w*0.6},\${y-h*0.8} L \${x+w*0.9},\${y}\`} fill="none" stroke={stroke} strokeWidth={1.5} opacity={0.5} />
          <rect x={x} y={y} width={w} height={h} fill={fill} stroke={stroke} strokeWidth={1.5} rx={1} />
        </g>
      );
    }
    return (
      <g>
        <rect x={x} y={y - h*0.8} width={w} height={h*0.8} fill={stroke} opacity={0.1} stroke={stroke} strokeWidth={1.5} rx={1} />
        <rect x={x} y={y} width={w} height={h} fill={fill} stroke={stroke} strokeWidth={1.5} rx={1} />
      </g>
    );
  }

  /* ── OPEN MAILER (Surgical Box) ────────────────────────────────────────── */
  if (type === 'open-mailer') {
    if (view === 'side') {
      return (
        <g>
          <line x1={x+w} y1={y} x2={x+w*0.5} y2={y-h*1.5} stroke={stroke} strokeWidth={1.5} opacity={0.6} />
          <rect x={x} y={y} width={w} height={h} fill={fill} stroke={stroke} strokeWidth={1.5} rx={1} />
        </g>
      );
    }
    if (view === 'top') {
      return (
        <g>
          <rect x={x} y={y} width={w} height={h} fill={fill} stroke={stroke} strokeWidth={1.5} />
          <rect x={x+4} y={y+4} width={Math.max(1, w-8)} height={Math.max(1, h-8)} fill="none" stroke={stroke} strokeWidth={0.8} opacity={0.5} />
        </g>
      );
    }
    return (
      <g>
        <rect x={x} y={y - h*1.5} width={w} height={h*1.5} fill={stroke} opacity={0.1} stroke={stroke} strokeWidth={1.5} />
        <rect x={x} y={y} width={w} height={h} fill={fill} stroke={stroke} strokeWidth={1.5} rx={1} />
      </g>
    );
  }

  /* ── OPEN FLAPS BOX (Body Lotion Box) ──────────────────────────────────── */
  if (type === 'open-flaps-box') {
    const flapH = Math.min(w/2, h*0.3);
    if (view === 'top') {
      return (
        <g>
          <rect x={x-flapH} y={y} width={flapH} height={h} fill={stroke} opacity={0.1} stroke={stroke} strokeWidth={1} />
          <rect x={x+w} y={y} width={flapH} height={h} fill={stroke} opacity={0.1} stroke={stroke} strokeWidth={1} />
          <rect x={x} y={y-flapH} width={w} height={flapH} fill={stroke} opacity={0.1} stroke={stroke} strokeWidth={1} />
          <rect x={x} y={y+h} width={w} height={flapH} fill={stroke} opacity={0.1} stroke={stroke} strokeWidth={1} />
          <rect x={x} y={y} width={w} height={h} fill={fill} stroke={stroke} strokeWidth={1.5} />
        </g>
      );
    }
    return (
      <g>
        <path d={\`M \${x},\${y} L \${x - w*0.2},\${y - flapH} L \${x + w + w*0.2},\${y - flapH} L \${x+w},\${y}\`} fill={stroke} opacity={0.1} stroke={stroke} strokeWidth={1.5} strokeLinejoin="round" />
        <rect x={x} y={y} width={w} height={h} fill={fill} stroke={stroke} strokeWidth={1.5} rx={1} />
      </g>
    );
  }

  /* ── RIGID CLAMSHELL (Watch Box) ───────────────────────────────────────── */
  if (type === 'rigid-clamshell') {
    if (view === 'top') {
      return (
        <g>
          <rect x={x} y={y} width={w} height={h} fill={fill} stroke={stroke} strokeWidth={1.5} rx={2} />
          <rect x={x + w*0.25} y={y + h*0.25} width={w*0.5} height={h*0.5} fill={stroke} opacity={0.2} stroke={stroke} strokeWidth={1} rx={4} />
        </g>
      );
    }
    if (view === 'side') {
      return (
        <g>
          <path d={\`M \${x+w},\${y} L \${x + w + w*0.1},\${y - w} L \${x + w*1.1 - w*0.5},\${y - w - w*0.1} L \${x+w},\${y}\`} fill={stroke} opacity={0.1} stroke={stroke} strokeWidth={1.5} strokeLinejoin="round" />
          <rect x={x} y={y} width={w} height={h} fill={fill} stroke={stroke} strokeWidth={1.5} rx={1} />
        </g>
      );
    }
    return (
      <g>
        <rect x={x} y={y - h} width={w} height={h} fill={stroke} opacity={0.1} stroke={stroke} strokeWidth={1.5} />
        <rect x={x} y={y} width={w} height={h} fill={fill} stroke={stroke} strokeWidth={1.5} rx={1} />
      </g>
    );
  }

  /* ── SHALLOW RIGID WRAP (Luxury Scarf Box) ─────────────────────────────── */
  if (type === 'shallow-rigid-wrap') {
    if (view === 'top') {
      return (
        <g>
          <rect x={x} y={y} width={w} height={h} fill={fill} stroke={stroke} strokeWidth={1.5} rx={1} />
          <rect x={x+2} y={y+h-10} width={Math.max(1, w-4)} height={8} fill="none" stroke={stroke} strokeWidth={0.8} opacity={0.5} />
        </g>
      );
    }
    if (view === 'side') {
      return (
        <g>
          <rect x={x} y={y} width={w} height={h} fill={fill} stroke={stroke} strokeWidth={1.5} rx={1} />
          <path d={\`M \${x+w},\${y} A \${w} \${w} 0 0 0 \${x},\${y-w}\`} fill="none" stroke={stroke} strokeWidth={1.5} opacity={0.4} />
        </g>
      );
    }
    return (
      <g>
        <rect x={x} y={y - h*3} width={w} height={h*3} fill={stroke} opacity={0.1} stroke={stroke} strokeWidth={1.5} />
        <rect x={x} y={y} width={w} height={h} fill={fill} stroke={stroke} strokeWidth={1.5} rx={1} />
      </g>
    );
  }
`;

content = content.replace('  // Fallback\n  return <rect', newShapes + '\n  // Fallback\n  return <rect');
fs.writeFileSync(path, content, 'utf8');
