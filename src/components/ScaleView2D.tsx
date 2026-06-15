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

  /* ── HAT BOX (circular top view) ──────────────────────────────────────── */
  if (type === 'hat-box') {
    if (view === 'top') {
      return (
        <g>
          <ellipse cx={x + w / 2} cy={y + h / 2} rx={w / 2} ry={h / 2}
            fill={fill} stroke={stroke} strokeWidth={1.5} />
          <ellipse cx={x + w / 2} cy={y + h / 2} rx={w * 0.38} ry={h * 0.38}
            fill="none" stroke={stroke} strokeWidth={0.8} opacity={0.4} />
        </g>
      );
    }
    // Front / Side: rounded rectangle (hat box is usually cylindrical)
    const ry2 = Math.min(w, h) * 0.08;
    return (
      <g>
        <rect x={x} y={y} width={w} height={h} fill={fill} stroke={stroke}
          strokeWidth={1.5} rx={ry2} />
        {/* Lid seam line */}
        <line x1={x} y1={y + h * 0.15} x2={x + w} y2={y + h * 0.15}
          stroke={stroke} strokeWidth={0.9} opacity={0.45} />
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
