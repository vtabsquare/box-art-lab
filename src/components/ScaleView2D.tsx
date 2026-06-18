import React, { useRef, useState, useEffect } from 'react';
import { BoxDimensions } from '@/lib/designRules';
import { getProductShape, ShapeType, ShapeConfig } from '@/lib/productShapes';

// ─── Props ────────────────────────────────────────────────────────────────────
interface ScaleView2DProps {
  dimensions: BoxDimensions;
  colorPreference?: string;
  productName?: string;
  /** Pass the selected product's `id` to get the correct silhouette shape */
  productId?: string | null;
}

// ─── Per-view constants ───────────────────────────────────────────────────────
type ViewType = 'front' | 'side' | 'top';

const AXIS_PAD   = 40;   // px left + bottom for axes
const DIM_PAD    = 26;   // px top + right for dimension arrows
const MIN_PX     = 28;   // minimum face px in any dimension
const ARROW_SIZE = 5;    // arrowhead size

// ─── Shape Face Renderer ──────────────────────────────────────────────────────
interface FaceProps {
  view: ViewType;
  shape: ShapeConfig;
  x: number; y: number; w: number; h: number;
  fill: string; stroke: string;
}

const FaceShape: React.FC<FaceProps> = ({ view, shape, x, y, w, h, fill, stroke }) => {
  const { type, taperRatio = 0.18, handleHeightRatio = 0.18 } = shape;

  /* ── BOX (default) ─────────────────────────────────────────────────────── */
  if (type === 'box' || type === 'pizza') {
    return (
      <g>
        <rect x={x} y={y} width={w} height={h} fill={fill} stroke={stroke} strokeWidth={1.5} rx={1.5} />
        {/* Subtle corner fold lines */}
        <line x1={x} y1={y} x2={x + Math.min(w, h) * 0.12} y2={y + Math.min(w, h) * 0.12}
          stroke={stroke} strokeWidth={0.7} opacity={0.3} />
        <line x1={x + w} y1={y} x2={x + w - Math.min(w, h) * 0.12} y2={y + Math.min(w, h) * 0.12}
          stroke={stroke} strokeWidth={0.7} opacity={0.3} />
      </g>
    );
  }

  /* ── OPEN-TOP SCOOP (French Fries, Popcorn) ────────────────────────────── */
  if (type === 'open-top') {
    if (view === 'top') {
      // Looking down into the box: rect with inner opening line
      return (
        <g>
          <rect x={x} y={y} width={w} height={h} fill={fill} stroke={stroke} strokeWidth={1.5} rx={1} />
          <rect x={x + w * 0.06} y={y + h * 0.06}
            width={w * 0.88} height={h * 0.88}
            fill="none" stroke={stroke} strokeWidth={0.7} opacity={0.35} rx={1} />
        </g>
      );
    }
    // Front / Side: trapezoid — wider at top
    const tp = w * taperRatio;
    return (
      <g>
        <path
          d={`M ${x + tp},${y + h} L ${x},${y} L ${x + w},${y} L ${x + w - tp},${y + h} Z`}
          fill={fill} stroke={stroke} strokeWidth={1.5} strokeLinejoin="round"
        />
        {/* Crease fold lines near base */}
        <line x1={x + tp * 0.7} y1={y + h * 0.85} x2={x} y2={y}
          stroke={stroke} strokeWidth={0.6} opacity={0.22} />
        <line x1={x + w - tp * 0.7} y1={y + h * 0.85} x2={x + w} y2={y}
          stroke={stroke} strokeWidth={0.6} opacity={0.22} />
        {/* Open rim indicator at top */}
        <line x1={x} y1={y + h * 0.04} x2={x + w} y2={y + h * 0.04}
          stroke={stroke} strokeWidth={0.9} opacity={0.4} />
      </g>
    );
  }

  /* ── BAG WITH HANDLE ───────────────────────────────────────────────────── */
  if (type === 'bag') {
    const handleH = h * handleHeightRatio;
    const bodyY   = y + handleH;
    const bodyH   = h - handleH;
    const hL      = x + w * 0.28;
    const hR      = x + w * 0.72;

    if (view === 'side') {
      return (
        <g>
          <rect x={x} y={bodyY} width={w} height={bodyH} fill={fill} stroke={stroke} strokeWidth={1.5} rx={1} />
        </g>
      );
    }
    if (view === 'top') {
      return (
        <g>
          <rect x={x} y={y} width={w} height={h} fill={fill} stroke={stroke} strokeWidth={1.5} rx={1} />
          {/* Handle attachment bands */}
          <rect x={hL - 3} y={y} width={6} height={h * 0.22} fill={stroke} opacity={0.4} rx={1} />
          <rect x={hR - 3} y={y} width={6} height={h * 0.22} fill={stroke} opacity={0.4} rx={1} />
        </g>
      );
    }
    // Front: bag body + arched handle
    return (
      <g>
        {/* Body */}
        <rect x={x} y={bodyY} width={w} height={bodyH} fill={fill} stroke={stroke} strokeWidth={1.5} rx={2} />
        {/* Handle rope/loop */}
        <path
          d={`M ${hL},${bodyY}
             C ${hL},${bodyY - handleH * 0.55} ${hL - w * 0.04},${y}
               ${hL},${y}
             C ${hL + (hR - hL) * 0.18},${y - handleH * 0.55}
               ${hR - (hR - hL) * 0.18},${y - handleH * 0.55}
               ${hR},${y}
             C ${hR + w * 0.04},${y} ${hR},${bodyY - handleH * 0.55}
               ${hR},${bodyY}`}
          fill="none" stroke={stroke} strokeWidth={2.2} strokeLinecap="round"
        />
        {/* Bottom gusset fold */}
        <line x1={x + w * 0.06} y1={bodyY + bodyH * 0.94}
          x2={x + w * 0.94} y2={bodyY + bodyH * 0.94}
          stroke={stroke} strokeWidth={0.7} opacity={0.3} strokeDasharray="4,3" />
      </g>
    );
  }

  /* ── STAND-UP POUCH ────────────────────────────────────────────────────── */
  if (type === 'pouch') {
    const cr      = Math.min(w, h) * 0.12;
    const sealW   = Math.max(3, w * 0.09);
    const topSeal = Math.max(3, h * 0.08);
    const gusset  = Math.max(3, h * 0.16);
    const zipY    = y + topSeal + h * 0.05;

    if (view === 'side') {
      // Very thin sliver
      return (
        <g>
          <rect x={x} y={y} width={w} height={h} fill={fill} stroke={stroke}
            strokeWidth={1.5} rx={Math.min(w * 0.35, 4)} />
        </g>
      );
    }
    if (view === 'top') {
      // Looking down: gusset oval
      const ry = Math.min(h / 2, w * 0.38);
      return (
        <g>
          <ellipse cx={x + w / 2} cy={y + h / 2} rx={w / 2} ry={ry}
            fill={fill} stroke={stroke} strokeWidth={1.5} />
          <line x1={x + w * 0.12} y1={y + h / 2}
            x2={x + w * 0.88} y2={y + h / 2}
            stroke={stroke} strokeWidth={0.7} opacity={0.35} />
        </g>
      );
    }
    // Front: full pouch shape
    return (
      <g>
        <path
          d={`M ${x + sealW},${y + h}
             L ${x + sealW * 0.55},${y + h - gusset}
             L ${x},${y + cr}
             Q ${x},${y} ${x + cr},${y}
             L ${x + w - cr},${y}
             Q ${x + w},${y} ${x + w},${y + cr}
             L ${x + w - sealW * 0.55},${y + h - gusset}
             L ${x + w - sealW},${y + h} Z`}
          fill={fill} stroke={stroke} strokeWidth={1.5}
        />
        {/* Side heat-seal bands */}
        <line x1={x + sealW} y1={y} x2={x + sealW} y2={y + h}
          stroke={stroke} strokeWidth={1} opacity={0.35} />
        <line x1={x + w - sealW} y1={y} x2={x + w - sealW} y2={y + h}
          stroke={stroke} strokeWidth={1} opacity={0.35} />
        {/* Top seal */}
        <line x1={x} y1={y + topSeal} x2={x + w} y2={y + topSeal}
          stroke={stroke} strokeWidth={0.9} opacity={0.38} />
        {/* Zip-lock line */}
        <line x1={x + sealW * 0.5} y1={zipY} x2={x + w - sealW * 0.5} y2={zipY}
          stroke={stroke} strokeWidth={1.4} opacity={0.5} strokeLinecap="round" />
        {/* Gusset fold */}
        <line x1={x + sealW} y1={y + h - gusset}
          x2={x + w - sealW} y2={y + h - gusset}
          stroke={stroke} strokeWidth={0.8} opacity={0.35} strokeDasharray="3,2" />
      </g>
    );
  }

  /* ── CYLINDER / TUBE ───────────────────────────────────────────────────── */
  if (type === 'cylinder') {
    if (view === 'top') {
      return (
        <g>
          <ellipse cx={x + w / 2} cy={y + h / 2} rx={w / 2} ry={h / 2}
            fill={fill} stroke={stroke} strokeWidth={1.5} />
          {/* Inner ellipse cap line */}
          <ellipse cx={x + w / 2} cy={y + h / 2} rx={w * 0.35} ry={h * 0.35}
            fill="none" stroke={stroke} strokeWidth={0.7} opacity={0.35} />
        </g>
      );
    }
    const ry = Math.max(4, w * 0.2);
    return (
      <g>
        {/* Body fill */}
        <rect x={x} y={y + ry} width={w} height={h - ry * 2} fill={fill} stroke="none" />
        {/* Bottom cap ellipse */}
        <ellipse cx={x + w / 2} cy={y + h - ry} rx={w / 2} ry={ry}
          fill={fill} stroke={stroke} strokeWidth={1.5} />
        {/* Top cap ellipse */}
        <ellipse cx={x + w / 2} cy={y + ry} rx={w / 2} ry={ry}
          fill={fill} stroke={stroke} strokeWidth={1.5} />
        {/* Side outline */}
        <line x1={x}     y1={y + ry} x2={x}     y2={y + h - ry} stroke={stroke} strokeWidth={1.5} />
        <line x1={x + w} y1={y + ry} x2={x + w} y2={y + h - ry} stroke={stroke} strokeWidth={1.5} />
        {/* Seam */}
        <line x1={x + w / 2} y1={y + ry} x2={x + w / 2} y2={y + h - ry}
          stroke={stroke} strokeWidth={0.5} opacity={0.25} strokeDasharray="5,3" />
      </g>
    );
  }

  /* ── WEDGE / TRIANGLE (Sandwich, Cake Slice) ───────────────────────────── */
  if (type === 'wedge') {
    if (view === 'side') {
      // Side is a plain rectangle
      return (
        <rect x={x} y={y} width={w} height={h} fill={fill} stroke={stroke} strokeWidth={1.5} rx={1} />
      );
    }
    // Front and Top: right-angle triangle
    const d = `M ${x},${y + h} L ${x + w},${y + h} L ${x},${y} Z`;
    return (
      <g>
        <path d={d} fill={fill} stroke={stroke} strokeWidth={1.5} strokeLinejoin="round" />
        {/* Hypotenuse highlight */}
        <line x1={x + w * 0.08} y1={y + h * 0.1} x2={x + w * 0.85} y2={y + h * 0.92}
          stroke={stroke} strokeWidth={0.6} opacity={0.25} />
      </g>
    );
  }

  /* ── FLAT ENVELOPE / MAILER ─────────────────────────────────────────────── */
  if (type === 'envelope') {
    const flapH = Math.max(5, h * 0.22);
    return (
      <g>
        <rect x={x} y={y} width={w} height={h} fill={fill} stroke={stroke} strokeWidth={1.5} rx={2} />
        {/* Flap diagonal fold lines (V shape from top) */}
        <path d={`M ${x},${y + flapH} L ${x + w / 2},${y + flapH * 1.9} L ${x + w},${y + flapH}`}
          fill="none" stroke={stroke} strokeWidth={0.9} opacity={0.4} />
        {/* Top flap rectangle */}
        <line x1={x} y1={y + flapH} x2={x + w} y2={y + flapH}
          stroke={stroke} strokeWidth={0.7} opacity={0.3} strokeDasharray="4,2" />
      </g>
    );
  }

  /* ── HAT BOX (hexagon top view) ──────────────────────────────────────── */
  if (type === 'hat-box') {
    if (view === 'top') {
      const pts = `${x+w*0.25},${y} ${x+w*0.75},${y} ${x+w},${y+h*0.5} ${x+w*0.75},${y+h} ${x+w*0.25},${y+h} ${x},${y+h*0.5}`;
      const innerPts = `${x+w*0.3},${y+h*0.1} ${x+w*0.7},${y+h*0.1} ${x+w*0.9},${y+h*0.5} ${x+w*0.7},${y+h*0.9} ${x+w*0.3},${y+h*0.9} ${x+w*0.1},${y+h*0.5}`;
      return (
        <g>
          <polygon points={pts} fill={fill} stroke={stroke} strokeWidth={1.5} strokeLinejoin="round" />
          <polygon points={innerPts} fill="none" stroke={stroke} strokeWidth={0.8} opacity={0.4} />
          {/* Circular cutout in the middle */}
          <ellipse cx={x+w/2} cy={y+h/2} rx={w*0.25} ry={h*0.25} fill="none" stroke={stroke} strokeWidth={0.8} opacity={0.4} />
        </g>
      );
    }
    // Front / Side: faceted front view
    return (
      <g>
        <rect x={x} y={y} width={w} height={h} fill={fill} stroke={stroke} strokeWidth={1.5} />
        <line x1={x+w*0.25} y1={y} x2={x+w*0.25} y2={y+h} stroke={stroke} strokeWidth={0.9} opacity={0.4} />
        <line x1={x+w*0.75} y1={y} x2={x+w*0.75} y2={y+h} stroke={stroke} strokeWidth={0.9} opacity={0.4} />
        {/* Lid seam line */}
        <line x1={x} y1={y + h * 0.4} x2={x + w} y2={y + h * 0.4} stroke={stroke} strokeWidth={1.2} opacity={0.8} />
      </g>
    );
  }

  /* ── CONE CUP ──────────────────────────────────────────────────────────── */
  if (type === 'cone-cup') {
    if (view === 'top') {
      return (
        <g>
          <ellipse cx={x + w / 2} cy={y + h / 2} rx={w / 2} ry={h / 2}
            fill={fill} stroke={stroke} strokeWidth={1.5} />
        </g>
      );
    }
    // Front / Side: trapezoid wider at top (cup shape)
    const taper = w * 0.22;
    return (
      <g>
        <path
          d={`M ${x + taper},${y + h} L ${x},${y} L ${x + w},${y} L ${x + w - taper},${y + h} Z`}
          fill={fill} stroke={stroke} strokeWidth={1.5} strokeLinejoin="round"
        />
        {/* Rim ellipse at top */}
        <ellipse cx={x + w / 2} cy={y + h * 0.06} rx={w / 2} ry={w * 0.1}
          fill="none" stroke={stroke} strokeWidth={0.9} opacity={0.5} />
      </g>
    );
  }

  /* ── CLAMSHELL (Burger box, Hotdog box, Laptop clamshell) ───────────────── */
  if (type === 'clamshell') {
    const hingeY = y + h * 0.48;
    if (view === 'top') {
      return (
        <g>
          <rect x={x} y={y} width={w} height={h} fill={fill} stroke={stroke} strokeWidth={1.5} rx={2} />
          {/* Hinge line visible from above */}
          <line x1={x + w * 0.08} y1={y + h / 2} x2={x + w * 0.92} y2={y + h / 2}
            stroke={stroke} strokeWidth={1} opacity={0.45} strokeDasharray="5,3" />
        </g>
      );
    }
    // Front/Side: box with a distinct lid crease line roughly halfway up
    return (
      <g>
        {/* Bottom half (base) */}
        <rect x={x} y={hingeY} width={w} height={h - h * 0.48} fill={fill} stroke={stroke} strokeWidth={1.5} rx={1.5} />
        {/* Top half (lid) with slight rounded top */}
        <rect x={x} y={y} width={w} height={h * 0.5} fill={fill} stroke={stroke} strokeWidth={1.5} rx={1.5} />
        {/* Hinge crease line */}
        <line x1={x} y1={hingeY} x2={x + w} y2={hingeY}
          stroke={stroke} strokeWidth={1.4} opacity={0.65} />
        {/* Subtle inside fold on lid */}
        <line x1={x + 2} y1={hingeY - h * 0.06} x2={x + w - 2} y2={hingeY - h * 0.06}
          stroke={stroke} strokeWidth={0.6} opacity={0.25} strokeDasharray="4,3" />
      </g>
    );
  }

  /* ── TRAY (Flat open tray: chocolate, meal, eye-shadow palette) ─────────── */
  if (type === 'tray') {
    if (view === 'top') {
      // From above: outer rect + inner content area showing tray depth
      const inset = Math.min(w, h) * 0.08;
      return (
        <g>
          <rect x={x} y={y} width={w} height={h} fill={fill} stroke={stroke} strokeWidth={1.5} rx={1.5} />
          <rect x={x + inset} y={y + inset} width={w - inset * 2} height={h - inset * 2}
            fill="none" stroke={stroke} strokeWidth={0.8} opacity={0.5} rx={1} />
        </g>
      );
    }
    // Front/Side: very flat box with a subtle inner-rim line near the top
    const rimY = y + Math.max(4, h * 0.25);
    return (
      <g>
        <rect x={x} y={y} width={w} height={h} fill={fill} stroke={stroke} strokeWidth={1.5} rx={1} />
        {/* Inner rim / lip of tray */}
        <line x1={x + 2} y1={rimY} x2={x + w - 2} y2={rimY}
          stroke={stroke} strokeWidth={0.8} opacity={0.35} strokeDasharray="4,2" />
        {/* Depth shadow on bottom inside */}
        <rect x={x + 2} y={rimY} width={w - 4} height={h - (rimY - y) - 2}
          fill={stroke} opacity={0.04} rx={1} />
      </g>
    );
  }

  /* ── SLIM-TALL (Perfume, Serum, Syrup, Supplement, Spirits) ─────────────── */
  if (type === 'slim-tall') {
    if (view === 'top') {
      // Top-down: small square/rect footprint
      const rx = Math.min(w, h) * 0.15;
      return (
        <g>
          <rect x={x} y={y} width={w} height={h} fill={fill} stroke={stroke} strokeWidth={1.5} rx={rx} />
          {/* Subtle corner folds */}
          <line x1={x} y1={y} x2={x + w * 0.15} y2={y + h * 0.15}
            stroke={stroke} strokeWidth={0.7} opacity={0.3} />
          <line x1={x + w} y1={y} x2={x + w - w * 0.15} y2={y + h * 0.15}
            stroke={stroke} strokeWidth={0.7} opacity={0.3} />
        </g>
      );
    }
    if (view === 'side') {
      // Very narrow side profile
      return (
        <g>
          <rect x={x} y={y} width={w} height={h} fill={fill} stroke={stroke} strokeWidth={1.5} rx={Math.min(w * 0.2, 4)} />
        </g>
      );
    }
    // Front: tall narrow carton with a tuck-end line at top and bottom
    const tuckH = Math.max(4, h * 0.09);
    return (
      <g>
        <rect x={x} y={y} width={w} height={h} fill={fill} stroke={stroke} strokeWidth={1.5} rx={2} />
        {/* Top tuck-end crease */}
        <line x1={x} y1={y + tuckH} x2={x + w} y2={y + tuckH}
          stroke={stroke} strokeWidth={0.8} opacity={0.40} />
        {/* Bottom tuck-end crease */}
        <line x1={x} y1={y + h - tuckH} x2={x + w} y2={y + h - tuckH}
          stroke={stroke} strokeWidth={0.8} opacity={0.40} />
        {/* Vertical centre crease line (elegant carton fold) */}
        <line x1={x + w / 2} y1={y + tuckH + 2} x2={x + w / 2} y2={y + h - tuckH - 2}
          stroke={stroke} strokeWidth={0.45} opacity={0.18} strokeDasharray="5,3" />
        {/* Corner fold diamonds at top */}
        <line x1={x} y1={y} x2={x + w * 0.1} y2={y + tuckH}
          stroke={stroke} strokeWidth={0.6} opacity={0.3} />
        <line x1={x + w} y1={y} x2={x + w - w * 0.1} y2={y + tuckH}
          stroke={stroke} strokeWidth={0.6} opacity={0.3} />
      </g>
    );
  }


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
        <path d={`M ${x+taper},${hingeY} L ${x},${y+h} L ${x+w},${y+h} L ${x+w-taper},${hingeY} Z`} fill={fill} stroke={stroke} strokeWidth={1.5} strokeLinejoin="round" />
        <path d={`M ${x+taper*1.5},${y} L ${x+taper},${hingeY} L ${x+w-taper},${hingeY} L ${x+w-taper*1.5},${y} Z`} fill={fill} stroke={stroke} strokeWidth={1.5} strokeLinejoin="round" />
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
          <path d={`M ${x},${bodyY} L ${x + w/2},${y} L ${x + w},${bodyY} Z`} fill={fill} stroke={stroke} strokeWidth={1.5} strokeLinejoin="round" />
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
        <path d={`M ${x},${bodyY} Q ${x + w/2},${y - roofH*0.2} ${x + w},${bodyY} Z`} fill={fill} stroke={stroke} strokeWidth={1.5} strokeLinejoin="round" />
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
          <path d={`M ${x},${bodyY} A ${w/2} ${roofH} 0 0 1 ${x+w},${bodyY} Z`} fill={fill} stroke={stroke} strokeWidth={1.5} strokeLinejoin="round" />
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
        <path d={`M ${x + w*0.3},${y + roofH*0.5} Q ${x + w/2},${y} ${x + w*0.7},${y + roofH*0.5}`} fill="none" stroke={stroke} strokeWidth={2} strokeLinecap="round" />
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
          <path d={`M ${x + w/2},${y} L ${x + w/2},${y + sealH} L ${x},${y + sealH*2} L ${x},${y+h} L ${x+w},${y+h} L ${x+w},${y + sealH*2} Z`} fill={fill} stroke={stroke} strokeWidth={1.5} strokeLinejoin="round" />
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
      serrations += `L ${x + i*toothW + toothW/2},${y + 4} L ${x + (i+1)*toothW},${y} `;
    }
    return (
      <g>
        <path d={`M ${x},${y} ${serrations} L ${x+w},${y+h} L ${x},${y+h} Z`} fill={fill} stroke={stroke} strokeWidth={1.5} strokeLinejoin="round" />
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
          <path d={`M ${x},${y + h/2} L ${x+w},${y+h/2}`} stroke={stroke} strokeWidth={1} opacity={0.4} strokeDasharray="3,2" />
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
          <line x1={x + w/2} y1={y} x2={x + w/2} y2={y+h} stroke={stroke} strokeWidth={0.8} opacity={0.5} />
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
          <path d={`M ${x+w},${y} L ${x+w*0.7},${y-h*0.8} L ${x+w*0.6},${y-h*0.8} L ${x+w*0.9},${y}`} fill="none" stroke={stroke} strokeWidth={1.5} opacity={0.5} />
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
        <path d={`M ${x},${y} L ${x - w*0.2},${y - flapH} L ${x + w + w*0.2},${y - flapH} L ${x+w},${y}`} fill={stroke} opacity={0.1} stroke={stroke} strokeWidth={1.5} strokeLinejoin="round" />
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
          <path d={`M ${x+w},${y} L ${x + w + w*0.1},${y - w} L ${x + w*1.1 - w*0.5},${y - w - w*0.1} L ${x+w},${y}`} fill={stroke} opacity={0.1} stroke={stroke} strokeWidth={1.5} strokeLinejoin="round" />
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
          <path d={`M ${x+w},${y} A ${w} ${w} 0 0 0 ${x},${y-w}`} fill="none" stroke={stroke} strokeWidth={1.5} opacity={0.4} />
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


  /* ── TRIANGLE PRISM (Standing Isosceles Triangle) ──────────────────────── */
  if (type === 'triangle-prism') {
    if (view === 'side') {
      return <rect x={x} y={y} width={w} height={h} fill={fill} stroke={stroke} strokeWidth={1.5} rx={1} />;
    }
    if (view === 'top') {
      return (
        <g>
          <rect x={x} y={y} width={w} height={h} fill={fill} stroke={stroke} strokeWidth={1.5} rx={1} />
          <line x1={x + w/2} y1={y} x2={x + w/2} y2={y+h} stroke={stroke} strokeWidth={1} opacity={0.6} strokeDasharray="4,2" />
        </g>
      );
    }
    // Front: Isosceles triangle pointing up
    return (
      <path d={`M ${x},${y + h} L ${x + w/2},${y} L ${x + w},${y + h} Z`} fill={fill} stroke={stroke} strokeWidth={1.5} strokeLinejoin="round" />
    );
  }

  // Fallback
  return <rect x={x} y={y} width={w} height={h} fill={fill} stroke={stroke} strokeWidth={1.5} rx={1.5} />;
};

// ─── Auto-step for tick marks ─────────────────────────────────────────────────
function niceStep(cm: number): number {
  if (cm <= 4)   return 1;
  if (cm <= 12)  return 2;
  if (cm <= 30)  return 5;
  return 10;
}

const clamp = (v: number, lo: number, hi: number) => Math.max(lo, Math.min(hi, v));

// ─── Single Orthographic Panel ────────────────────────────────────────────────
interface ViewPanelProps {
  label: string;
  view: ViewType;
  faceW: number;    // real-world cm
  faceH: number;    // real-world cm
  xLabel: string;
  yLabel: string;
  availPx: number;  // pixel budget for the longest face edge
  fill: string;
  stroke: string;
  textColor: string;
  shape: ShapeConfig;
}

const ViewPanel: React.FC<ViewPanelProps> = ({
  label, view, faceW, faceH, xLabel, yLabel, availPx, fill, stroke, textColor, shape,
}) => {
  const maxDim = Math.max(faceW, faceH);
  const scale  = availPx / maxDim;

  const faceWpx = clamp(Math.round(faceW * scale), MIN_PX, availPx + 20);
  const faceHpx = clamp(Math.round(faceH * scale), MIN_PX, availPx + 20);

  const svgW = AXIS_PAD + faceWpx + DIM_PAD + 14;
  const svgH = DIM_PAD  + faceHpx + AXIS_PAD + 6;

  const faceX = AXIS_PAD;
  const faceY = DIM_PAD;
  const origX = AXIS_PAD;
  const origY = DIM_PAD + faceHpx;

  const stepX = niceStep(faceW);
  const stepY = niceStep(faceH);

  const xTicks: number[] = [];
  for (let c = 0; c <= faceW; c += stepX) xTicks.push(c);
  if (xTicks[xTicks.length - 1] < faceW) xTicks.push(faceW);

  const yTicks: number[] = [];
  for (let c = 0; c <= faceH; c += stepY) yTicks.push(c);
  if (yTicks[yTicks.length - 1] < faceH) yTicks.push(faceH);

  const mid = `vp-${label.replace(/\s/g, '')}-${view}`;

  return (
    <div className="flex flex-col items-center gap-1.5 select-none">
      <span
        style={{ fontSize: 9, letterSpacing: '0.13em' }}
        className="font-semibold uppercase text-amber-400/80"
      >
        {label}
      </span>

      <svg
        viewBox={`0 0 ${svgW} ${svgH}`}
        width={svgW}
        height={svgH}
        style={{ overflow: 'visible' }}
        aria-label={`${label} view`}
      >
        <defs>
          <marker id={`${mid}-ae`} markerWidth="5" markerHeight="5"
            refX="4" refY="2.5" orient="auto">
            <polygon points="0,0 5,2.5 0,5" fill={stroke} opacity="0.7" />
          </marker>
          <marker id={`${mid}-as`} markerWidth="5" markerHeight="5"
            refX="1" refY="2.5" orient="auto-start-reverse">
            <polygon points="0,0 5,2.5 0,5" fill={stroke} opacity="0.7" />
          </marker>
        </defs>

        {/* ── Product Face Shape ── */}
        <FaceShape
          view={view} shape={shape}
          x={faceX} y={faceY} w={faceWpx} h={faceHpx}
          fill={fill} stroke={stroke}
        />

        {/* ── Width dimension arrow (above face) ── */}
        {faceWpx > 22 && (
          <>
            <line x1={faceX} y1={faceY - 11} x2={faceX + faceWpx} y2={faceY - 11}
              stroke={stroke} strokeWidth={0.9} opacity={0.65}
              markerStart={`url(#${mid}-as)`} markerEnd={`url(#${mid}-ae)`} />
            <line x1={faceX}          y1={faceY - 3}  x2={faceX}          y2={faceY - 17}
              stroke={stroke} strokeWidth={0.55} opacity={0.4} strokeDasharray="2,2" />
            <line x1={faceX + faceWpx} y1={faceY - 3} x2={faceX + faceWpx} y2={faceY - 17}
              stroke={stroke} strokeWidth={0.55} opacity={0.4} strokeDasharray="2,2" />
            <text x={faceX + faceWpx / 2} y={faceY - 13}
              textAnchor="middle" dominantBaseline="auto"
              fontSize={8} fill={textColor} fontFamily="Inter,sans-serif" fontWeight="600">
              {faceW} cm
            </text>
          </>
        )}

        {/* ── Height dimension arrow (right of face) ── */}
        {faceHpx > 18 && (
          <>
            <line x1={faceX + faceWpx + 12} y1={faceY}
              x2={faceX + faceWpx + 12} y2={faceY + faceHpx}
              stroke={stroke} strokeWidth={0.9} opacity={0.65}
              markerStart={`url(#${mid}-as)`} markerEnd={`url(#${mid}-ae)`} />
            <line x1={faceX + faceWpx + 4}  y1={faceY}           x2={faceX + faceWpx + 18} y2={faceY}
              stroke={stroke} strokeWidth={0.55} opacity={0.4} strokeDasharray="2,2" />
            <line x1={faceX + faceWpx + 4}  y1={faceY + faceHpx} x2={faceX + faceWpx + 18} y2={faceY + faceHpx}
              stroke={stroke} strokeWidth={0.55} opacity={0.4} strokeDasharray="2,2" />
            <text x={faceX + faceWpx + 21} y={faceY + faceHpx / 2}
              textAnchor="start" dominantBaseline="middle"
              fontSize={8} fill={textColor} fontFamily="Inter,sans-serif" fontWeight="600">
              {faceH} cm
            </text>
          </>
        )}

        {/* ── X axis ── */}
        <line x1={origX} y1={origY} x2={origX + faceWpx + 10} y2={origY}
          stroke={stroke} strokeWidth={1.2} opacity={0.85} />
        <polygon
          points={`${origX + faceWpx + 10},${origY - ARROW_SIZE}
                   ${origX + faceWpx + 10 + ARROW_SIZE * 1.5},${origY}
                   ${origX + faceWpx + 10},${origY + ARROW_SIZE}`}
          fill={stroke} opacity={0.85}
        />
        {xTicks.map((c) => {
          const px = origX + c * scale;
          const showLbl = (c === 0 || c === faceW || (c % (stepX * 2) === 0)) && faceWpx > 32;
          return (
            <g key={`xt-${c}`}>
              <line x1={px} y1={origY} x2={px} y2={origY + 5}
                stroke={stroke} strokeWidth={0.8} opacity={0.55} />
              {showLbl && (
                <text x={px} y={origY + 14} textAnchor="middle"
                  fontSize={7} fill={textColor} fontFamily="Inter,sans-serif" opacity={0.6}>
                  {c}
                </text>
              )}
            </g>
          );
        })}
        <text x={origX + faceWpx / 2} y={origY + (faceWpx > 30 ? 24 : 17)}
          textAnchor="middle" fontSize={7.5} fill={textColor}
          fontFamily="Inter,sans-serif" fontWeight="500" opacity={0.55}>
          {xLabel}
        </text>

        {/* ── Y axis ── */}
        <line x1={origX} y1={origY} x2={origX} y2={faceY - 10}
          stroke={stroke} strokeWidth={1.2} opacity={0.85} />
        <polygon
          points={`${origX - ARROW_SIZE},${faceY - 10}
                   ${origX},${faceY - 10 - ARROW_SIZE * 1.5}
                   ${origX + ARROW_SIZE},${faceY - 10}`}
          fill={stroke} opacity={0.85}
        />
        {yTicks.map((c) => {
          const py = origY - c * scale;
          const showLbl = (c === 0 || c === faceH || (c % (stepY * 2) === 0)) && faceHpx > 32;
          return (
            <g key={`yt-${c}`}>
              <line x1={origX - 5} y1={py} x2={origX} y2={py}
                stroke={stroke} strokeWidth={0.8} opacity={0.55} />
              {showLbl && (
                <text x={origX - 8} y={py} textAnchor="end" dominantBaseline="middle"
                  fontSize={7} fill={textColor} fontFamily="Inter,sans-serif" opacity={0.6}>
                  {c}
                </text>
              )}
            </g>
          );
        })}
        <text
          x={origX - (faceHpx > 30 ? 30 : 20)} y={faceY + faceHpx / 2}
          textAnchor="middle" fontSize={7.5} fill={textColor}
          fontFamily="Inter,sans-serif" fontWeight="500" opacity={0.55}
          transform={`rotate(-90, ${origX - (faceHpx > 30 ? 30 : 20)}, ${faceY + faceHpx / 2})`}
        >
          {yLabel}
        </text>

        {/* Origin dot */}
        <circle cx={origX} cy={origY} r={2.2} fill={stroke} opacity={0.75} />
      </svg>
    </div>
  );
};

// ─── Main Component ───────────────────────────────────────────────────────────
const ScaleView2D: React.FC<ScaleView2DProps> = ({
  dimensions, colorPreference, productName, productId,
}) => {
  const { length, width, height } = dimensions;
  const containerRef = useRef<HTMLDivElement>(null);
  const [containerW, setContainerW] = useState(340);

  useEffect(() => {
    if (!containerRef.current) return;
    const ro = new ResizeObserver((entries) => {
      const w = entries[0]?.contentRect.width;
      if (w) setContainerW(w);
    });
    ro.observe(containerRef.current);
    return () => ro.disconnect();
  }, []);

  // Colours
  const fillColor   = colorPreference ? `${colorPreference}88` : '#E8B84B55';
  const strokeColor = colorPreference ? colorPreference         : '#D4A017';
  const textColor   = '#d1d5db';

  // Shape for this product
  const shape = getProductShape(productId);

  // Panel pixel budgets — normalise to largest dimension across all 3 views
  const maxDimAll = Math.max(length, width, height);
  const halfW     = Math.floor((containerW - 36) / 2);
  const fullW     = Math.min(containerW - 48, halfW * 1.35);

  function budget(w: number, h: number, isTop = false): number {
    const longest = Math.max(w, h);
    const base    = isTop ? fullW : halfW;
    return clamp(Math.round(base * (longest / maxDimAll)), MIN_PX + 14, base);
  }

  return (
    <div id="scale-view-2d-container" className="premium-card p-4 flex flex-col bg-secondary/20 h-full min-h-[440px]">

      {/* ── Header ── */}
      <div className="flex items-center justify-between mb-3 shrink-0">
        <p className="text-xs text-muted-foreground uppercase tracking-wider font-body">
          2D Scale View
        </p>
        {productName && (
          <span className="text-[10px] text-amber-400/70 font-body truncate max-w-[150px]"
            title={productName}>
            {productName}
          </span>
        )}
      </div>

      {/* ── Dimension pills ── */}
      <div className="flex gap-2 mb-4 justify-center flex-wrap shrink-0">
        {([
          { label: 'L', full: 'Length', value: length },
          { label: 'W', full: 'Width',  value: width  },
          { label: 'H', full: 'Height', value: height },
        ] as { label: string; full: string; value: number }[]).map(({ label, full, value }) => (
          <div key={label}
            className="flex items-center gap-1.5 bg-black/30 border border-white/10 rounded-lg px-2.5 py-1">
            <span className="text-[9px] text-muted-foreground font-body">{full}</span>
            <span className="text-xs text-amber-400 font-semibold font-mono">{value}</span>
            <span className="text-[9px] text-muted-foreground font-body">cm</span>
          </div>
        ))}
      </div>

      {/* ── Views ── */}
      <div ref={containerRef}
        className="flex-1 flex flex-col items-center justify-center gap-5 overflow-auto py-2 px-1">

        {/* Front + Side — side by side */}
        <div className="flex gap-5 flex-wrap justify-center items-end">
          <ViewPanel
            label="Front View" view="front"
            faceW={length} faceH={height}
            xLabel="Length" yLabel="Height"
            availPx={budget(length, height)}
            fill={fillColor} stroke={strokeColor} textColor={textColor}
            shape={shape}
          />
          <ViewPanel
            label="Side View" view="side"
            faceW={width} faceH={height}
            xLabel="Width" yLabel="Height"
            availPx={budget(width, height)}
            fill={fillColor} stroke={strokeColor} textColor={textColor}
            shape={shape}
          />
        </div>

        {/* Divider */}
        <div className="w-full border-t border-white/5 shrink-0" />

        {/* Top View */}
        <ViewPanel
          label="Top View" view="top"
          faceW={length} faceH={width}
          xLabel="Length" yLabel="Width"
          availPx={budget(length, width, true)}
          fill={fillColor} stroke={strokeColor} textColor={textColor}
          shape={shape}
        />
      </div>

      {/* ── Footer ── */}
      <p className="text-[9px] text-center text-muted-foreground/40 mt-3 shrink-0 font-body">
        Proportional scale · dimensions in centimetres
      </p>
    </div>
  );
};

export default ScaleView2D;
