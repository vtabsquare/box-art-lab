import { fabric } from 'fabric';
import { DesignTemplate } from './designTemplates';

// Tag applied to all template-layer objects so they can be batch-removed
const TMPL_TAG = 'tmpl-layer';

function tag(obj: fabric.Object): fabric.Object {
  (obj as any).tmplLayer = true;
  (obj as any).selectable = false;
  (obj as any).evented = false;
  return obj;
}

// ─── Individual Pattern Builders ─────────────────────────────────────────────

function drawVerticalStripes(colors: [string, string], stripe: string): fabric.Object[] {
  const objs: fabric.Object[] = [];
  const W = 512, H = 512, stripeW = 40;
  // Alternate between background color and stripe color
  for (let x = 0; x < W; x += stripeW) {
    const fill = Math.floor(x / stripeW) % 2 === 0 ? colors[0] : stripe;
    objs.push(tag(new fabric.Rect({ left: x, top: 0, width: stripeW, height: H, fill, selectable: false, evented: false })));
  }
  return objs;
}

function drawDiagonalStripes(accent: string): fabric.Object[] {
  const objs: fabric.Object[] = [];
  for (let i = -512; i < 1024; i += 60) {
    objs.push(tag(new fabric.Line([i, 0, i + 512, 512], {
      stroke: accent, strokeWidth: 18, opacity: 0.22, selectable: false, evented: false,
    })));
  }
  return objs;
}

function drawDotsGrid(accent: string): fabric.Object[] {
  const objs: fabric.Object[] = [];
  const gap = 48, r = 4;
  for (let x = gap / 2; x < 512; x += gap) {
    for (let y = gap / 2; y < 512; y += gap) {
      objs.push(tag(new fabric.Circle({ left: x - r, top: y - r, radius: r, fill: accent, opacity: 0.35, selectable: false, evented: false })));
    }
  }
  return objs;
}

function drawConcentricCircles(accent: string): fabric.Object[] {
  const objs: fabric.Object[] = [];
  const cx = 256, cy = 256;
  for (let r = 50; r < 320; r += 50) {
    objs.push(tag(new fabric.Circle({
      left: cx - r, top: cy - r, radius: r,
      fill: 'transparent', stroke: accent, strokeWidth: 2, opacity: 0.25,
      selectable: false, evented: false,
    })));
  }
  return objs;
}

function drawWaveBands(accent: string, textColor: string): fabric.Object[] {
  const objs: fabric.Object[] = [];
  // Horizontal decorative bands
  const bandY = [80, 350];
  for (const y of bandY) {
    objs.push(tag(new fabric.Rect({ left: 0, top: y, width: 512, height: 14, fill: accent, opacity: 0.3, selectable: false, evented: false })));
  }
  // Curved wave paths
  for (let i = 0; i < 3; i++) {
    const baseY = 160 + i * 70;
    const path = `M 0 ${baseY} Q 128 ${baseY - 30} 256 ${baseY} T 512 ${baseY}`;
    objs.push(tag(new fabric.Path(path, { fill: 'transparent', stroke: accent, strokeWidth: 2, opacity: 0.4, selectable: false, evented: false })));
  }
  return objs;
}

function drawGridLines(accent: string): fabric.Object[] {
  const objs: fabric.Object[] = [];
  const gap = 48;
  for (let x = 0; x < 512; x += gap) {
    objs.push(tag(new fabric.Line([x, 0, x, 512], { stroke: accent, strokeWidth: 0.8, opacity: 0.2, selectable: false, evented: false })));
  }
  for (let y = 0; y < 512; y += gap) {
    objs.push(tag(new fabric.Line([0, y, 512, y], { stroke: accent, strokeWidth: 0.8, opacity: 0.2, selectable: false, evented: false })));
  }
  return objs;
}

function drawHexagons(accent: string): fabric.Object[] {
  const objs: fabric.Object[] = [];
  const size = 45;
  const cols = Math.ceil(512 / (size * 1.5)) + 1;
  const rows = Math.ceil(512 / (size * Math.sqrt(3))) + 1;
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const cx = c * size * 1.5;
      const cy = r * size * Math.sqrt(3) + (c % 2 === 1 ? size * Math.sqrt(3) / 2 : 0);
      const points = Array.from({ length: 6 }, (_, i) => {
        const angle = (Math.PI / 180) * (60 * i - 30);
        return { x: cx + size * 0.8 * Math.cos(angle), y: cy + size * 0.8 * Math.sin(angle) };
      });
      objs.push(tag(new fabric.Polygon(points, {
        left: cx - size, top: cy - size,
        fill: 'transparent', stroke: accent, strokeWidth: 1.2, opacity: 0.22,
        selectable: false, evented: false,
      })));
    }
  }
  return objs;
}

function drawChevron(accent: string): fabric.Object[] {
  const objs: fabric.Object[] = [];
  for (let y = -40; y < 560; y += 80) {
    const path = `M 0 ${y + 40} L 256 ${y} L 512 ${y + 40}`;
    objs.push(tag(new fabric.Path(path, { fill: 'transparent', stroke: accent, strokeWidth: 20, opacity: 0.18, selectable: false, evented: false })));
  }
  return objs;
}

function drawKraftLines(accent: string): fabric.Object[] {
  const objs: fabric.Object[] = [];
  for (let y = 20; y < 512; y += 24) {
    objs.push(tag(new fabric.Line([0, y, 512, y], { stroke: accent, strokeWidth: 1, opacity: 0.18, selectable: false, evented: false })));
  }
  return objs;
}

function drawCircuitLines(accent: string): fabric.Object[] {
  const objs: fabric.Object[] = [];
  const paths = [
    'M 0 100 H 150 V 200 H 400 V 100 H 512',
    'M 0 300 H 80 V 180 H 280 V 350 H 512',
    'M 100 0 V 120 H 350 V 400 V 512',
    'M 400 0 V 80 H 200 V 450 H 450 V 512',
  ];
  for (const p of paths) {
    objs.push(tag(new fabric.Path(p, { fill: 'transparent', stroke: accent, strokeWidth: 1.5, opacity: 0.25, selectable: false, evented: false })));
  }
  // Junction dots
  const junctions = [[150, 200], [400, 100], [80, 180], [280, 350], [350, 120], [200, 450]];
  for (const [x, y] of junctions) {
    objs.push(tag(new fabric.Circle({ left: x - 3, top: y - 3, radius: 3, fill: accent, opacity: 0.5, selectable: false, evented: false })));
  }
  return objs;
}

function drawStarburst(accent: string): fabric.Object[] {
  const objs: fabric.Object[] = [];
  const cx = 256, cy = 256, rays = 20;
  for (let i = 0; i < rays; i++) {
    const angle = (Math.PI * 2 * i) / rays;
    const x2 = cx + 320 * Math.cos(angle);
    const y2 = cy + 320 * Math.sin(angle);
    objs.push(tag(new fabric.Line([cx, cy, x2, y2], { stroke: accent, strokeWidth: 1.5, opacity: 0.18, selectable: false, evented: false })));
  }
  return objs;
}

function drawDiamondGrid(accent: string): fabric.Object[] {
  const objs: fabric.Object[] = [];
  const size = 40;
  for (let x = 0; x < 512; x += size) {
    for (let y = 0; y < 512; y += size) {
      const pts = [
        { x: x + size / 2, y },
        { x: x + size, y: y + size / 2 },
        { x: x + size / 2, y: y + size },
        { x, y: y + size / 2 },
      ];
      objs.push(tag(new fabric.Polygon(pts, { fill: 'transparent', stroke: accent, strokeWidth: 0.8, opacity: 0.22, selectable: false, evented: false })));
    }
  }
  return objs;
}

function drawMinimalBorder(accent: string, color2: string): fabric.Object[] {
  const objs: fabric.Object[] = [];
  // Outer border
  objs.push(tag(new fabric.Rect({ left: 16, top: 16, width: 480, height: 480, fill: 'transparent', stroke: accent, strokeWidth: 3, opacity: 0.5, rx: 4, ry: 4, selectable: false, evented: false })));
  // Inner accent bar top
  objs.push(tag(new fabric.Rect({ left: 0, top: 0, width: 512, height: 10, fill: accent, opacity: 0.85, selectable: false, evented: false })));
  // Inner accent bar bottom
  objs.push(tag(new fabric.Rect({ left: 0, top: 502, width: 512, height: 10, fill: accent, opacity: 0.85, selectable: false, evented: false })));
  // Corner accents
  for (const [lx, ly] of [[16, 16], [480, 16], [16, 480], [480, 480]] as [number, number][]) {
    objs.push(tag(new fabric.Circle({ left: lx - 4, top: ly - 4, radius: 4, fill: accent, opacity: 0.7, selectable: false, evented: false })));
  }
  return objs;
}

function drawNeonPulse(accent: string): fabric.Object[] {
  const objs: fabric.Object[] = [];
  // Horizontal scanning lines
  for (let y = 0; y < 512; y += 6) {
    objs.push(tag(new fabric.Line([0, y, 512, y], { stroke: accent, strokeWidth: 0.5, opacity: 0.07, selectable: false, evented: false })));
  }
  // Vertical accent bar left
  objs.push(tag(new fabric.Rect({ left: 0, top: 0, width: 6, height: 512, fill: accent, opacity: 0.7, selectable: false, evented: false })));
  // Corner triangle top-right
  const tri = new fabric.Triangle({ left: 400, top: -20, width: 150, height: 150, fill: accent, opacity: 0.15, angle: 45, selectable: false, evented: false });
  objs.push(tag(tri));
  return objs;
}

function drawRoseGold(accent: string): fabric.Object[] {
  const objs: fabric.Object[] = [];
  // Diagonal gold shimmer lines
  for (let i = -300; i < 800; i += 30) {
    objs.push(tag(new fabric.Line([i, 0, i + 200, 512], { stroke: accent, strokeWidth: 1, opacity: 0.18, selectable: false, evented: false })));
  }
  // Bottom sash
  objs.push(tag(new fabric.Rect({ left: 0, top: 440, width: 512, height: 72, fill: accent, opacity: 0.2, selectable: false, evented: false })));
  // Top thin band
  objs.push(tag(new fabric.Rect({ left: 0, top: 0, width: 512, height: 8, fill: accent, opacity: 0.6, selectable: false, evented: false })));
  return objs;
}

function drawSportStrike(accent: string): fabric.Object[] {
  const objs: fabric.Object[] = [];
  // Bold diagonal slashes
  for (const x of [100, 240, 380]) {
    objs.push(tag(new fabric.Line([x, 0, x + 100, 512], { stroke: accent, strokeWidth: 28, opacity: 0.25, selectable: false, evented: false })));
  }
  // Bottom thick band
  objs.push(tag(new fabric.Rect({ left: 0, top: 460, width: 512, height: 52, fill: accent, opacity: 0.8, selectable: false, evented: false })));
  return objs;
}

// ─── Main Dispatcher ─────────────────────────────────────────────────────────

export function buildTemplateObjects(
  canvas: fabric.Canvas,
  tmpl: DesignTemplate,
  /** When the user has chosen a custom color, pass it here so vertical-stripe
   *  templates blend the user's color with the template's accent instead of
   *  completely overriding both stripe colours with the template's own palette. */
  bgColorOverride?: string
): fabric.Object[] {
  // Remove old template layer objects
  const toRemove = canvas.getObjects().filter((o: any  ) => o.tmplLayer === true);
  toRemove.forEach((o) => canvas.remove(o));

  let objs: fabric.Object[] = [];

  switch (tmpl.style) {
    case 'vertical-stripes': {
      // Use the user's colour as the even-stripe base when provided
      const stripeColors: [string, string] = bgColorOverride
        ? [bgColorOverride, tmpl.colors[1]]
        : tmpl.colors;
      objs = drawVerticalStripes(stripeColors, tmpl.stripeColor ?? tmpl.accent);
      break;
    }
    case 'diagonal-stripes':
      objs = drawDiagonalStripes(tmpl.accent);
      break;
    case 'dots-grid':
      objs = drawDotsGrid(tmpl.accent);
      break;
    case 'concentric-circles':
      objs = drawConcentricCircles(tmpl.accent);
      break;
    case 'wave-bands':
      objs = drawWaveBands(tmpl.accent, tmpl.textColor);
      break;
    case 'grid-lines':
      objs = drawGridLines(tmpl.accent);
      break;
    case 'hexagons':
      objs = drawHexagons(tmpl.accent);
      break;
    case 'chevron':
      objs = drawChevron(tmpl.accent);
      break;
    case 'kraft-lines':
      objs = drawKraftLines(tmpl.accent);
      break;
    case 'circuit-lines':
      objs = drawCircuitLines(tmpl.accent);
      break;
    case 'starburst':
      objs = drawStarburst(tmpl.accent);
      break;
    case 'diamond-grid':
      objs = drawDiamondGrid(tmpl.accent);
      break;
    case 'minimal-border':
      objs = drawMinimalBorder(tmpl.accent, tmpl.colors[1]);
      break;
    case 'neon-pulse':
      objs = drawNeonPulse(tmpl.accent);
      break;
    case 'rose-gold':
      objs = drawRoseGold(tmpl.accent);
      break;
    case 'sport-strike':
      objs = drawSportStrike(tmpl.accent);
      break;
    default:
      objs = [];
  }

  // Insert template objects after the 'bg' rect but before 'grid'
  const bgIndex = canvas.getObjects().findIndex((o: any  ) => o.id === 'bg');
  objs.forEach((obj, i) => {
    canvas.insertAt(obj, bgIndex + 1 + i, false);
  });

  return objs;
}

export function clearTemplateObjects(canvas: fabric.Canvas) {
  const toRemove = canvas.getObjects().filter((o: any  ) => o.tmplLayer === true);
  toRemove.forEach((o) => canvas.remove(o));
}
