import { motion, AnimatePresence } from 'framer-motion';
import { Layers, Check } from 'lucide-react';
import { Industry } from '@/lib/designRules';
import { DesignTemplate, getTemplatesForIndustry } from '@/lib/designTemplates';

interface DesignTemplateSelectorProps {
  industry: Industry;
  selectedTemplateId: string | null;
  onSelect: (template: DesignTemplate | null) => void;
}

/** Renders a visually distinct SVG thumbnail for each template style */
function buildThumbnailSvg(t: DesignTemplate): string {
  const [c1, c2] = t.colors;
  const acc = t.accent;
  const stripe = t.stripeColor ?? acc;
  const tc = t.textColor;

  // Build pattern layer based on style
  let patternSvg = '';

  switch (t.style) {
    case 'vertical-stripes': {
      const stripes = [];
      const w = 80, stripeW = 10;
      for (let x = 0; x < w; x += stripeW) {
        const fill = Math.floor(x / stripeW) % 2 === 0 ? c1 : stripe;
        stripes.push(`<rect x="${x}" y="0" width="${stripeW}" height="90" fill="${fill}"/>`);
      }
      patternSvg = stripes.join('');
      break;
    }
    case 'diagonal-stripes': {
      const lines = [];
      for (let i = -90; i < 160; i += 20) {
        lines.push(`<line x1="${i}" y1="0" x2="${i + 90}" y2="90" stroke="${acc}" stroke-width="8" opacity="0.28"/>`);
      }
      patternSvg = lines.join('');
      break;
    }
    case 'dots-grid': {
      const dots = [];
      for (let x = 10; x < 80; x += 16) {
        for (let y = 10; y < 90; y += 16) {
          dots.push(`<circle cx="${x}" cy="${y}" r="2.5" fill="${acc}" opacity="0.5"/>`);
        }
      }
      patternSvg = dots.join('');
      break;
    }
    case 'concentric-circles': {
      const circles = [];
      for (let r = 10; r < 60; r += 12) {
        circles.push(`<circle cx="40" cy="45" r="${r}" fill="none" stroke="${acc}" stroke-width="2" opacity="0.3"/>`);
      }
      patternSvg = circles.join('');
      break;
    }
    case 'wave-bands': {
      patternSvg = `
        <rect x="0" y="12" width="80" height="7" fill="${acc}" opacity="0.35"/>
        <rect x="0" y="70" width="80" height="7" fill="${acc}" opacity="0.35"/>
        <path d="M0,38 Q20,30 40,38 T80,38" fill="none" stroke="${acc}" stroke-width="2" opacity="0.45"/>
        <path d="M0,52 Q20,44 40,52 T80,52" fill="none" stroke="${acc}" stroke-width="2" opacity="0.45"/>
      `;
      break;
    }
    case 'grid-lines': {
      const lines = [];
      for (let x = 10; x < 80; x += 14) lines.push(`<line x1="${x}" y1="0" x2="${x}" y2="90" stroke="${acc}" stroke-width="0.8" opacity="0.3"/>`);
      for (let y = 10; y < 90; y += 14) lines.push(`<line x1="0" y1="${y}" x2="80" y2="${y}" stroke="${acc}" stroke-width="0.8" opacity="0.3"/>`);
      patternSvg = lines.join('');
      break;
    }
    case 'hexagons': {
      patternSvg = `
        <polygon points="20,5 33,12 33,27 20,34 7,27 7,12" fill="none" stroke="${acc}" stroke-width="1.2" opacity="0.35"/>
        <polygon points="55,5 68,12 68,27 55,34 42,27 42,12" fill="none" stroke="${acc}" stroke-width="1.2" opacity="0.35"/>
        <polygon points="20,40 33,47 33,62 20,69 7,62 7,47" fill="none" stroke="${acc}" stroke-width="1.2" opacity="0.35"/>
        <polygon points="55,40 68,47 68,62 55,69 42,62 42,47" fill="none" stroke="${acc}" stroke-width="1.2" opacity="0.35"/>
        <polygon points="37,22 50,29 50,44 37,51 24,44 24,29" fill="none" stroke="${acc}" stroke-width="1.2" opacity="0.2"/>
      `;
      break;
    }
    case 'chevron': {
      const chevrons = [];
      for (let y = -10; y < 100; y += 22) {
        chevrons.push(`<path d="M0,${y + 11} L40,${y} L80,${y + 11}" fill="none" stroke="${acc}" stroke-width="7" opacity="0.22"/>`);
      }
      patternSvg = chevrons.join('');
      break;
    }
    case 'kraft-lines': {
      const lines = [];
      for (let y = 6; y < 90; y += 7) {
        lines.push(`<line x1="0" y1="${y}" x2="80" y2="${y}" stroke="${acc}" stroke-width="0.8" opacity="0.2"/>`);
      }
      patternSvg = lines.join('');
      break;
    }
    case 'circuit-lines': {
      patternSvg = `
        <path d="M0,20 H25 V40 H60 V20 H80" fill="none" stroke="${acc}" stroke-width="1.5" opacity="0.4"/>
        <path d="M0,60 H15 V45 H50 V70 H80" fill="none" stroke="${acc}" stroke-width="1.5" opacity="0.4"/>
        <circle cx="25" cy="40" r="2" fill="${acc}" opacity="0.6"/>
        <circle cx="60" cy="20" r="2" fill="${acc}" opacity="0.6"/>
        <circle cx="50" cy="70" r="2" fill="${acc}" opacity="0.6"/>
      `;
      break;
    }
    case 'starburst': {
      const rays = [];
      for (let i = 0; i < 16; i++) {
        const angle = (Math.PI * 2 * i) / 16;
        const x2 = 40 + 50 * Math.cos(angle);
        const y2 = 45 + 50 * Math.sin(angle);
        rays.push(`<line x1="40" y1="45" x2="${x2.toFixed(1)}" y2="${y2.toFixed(1)}" stroke="${acc}" stroke-width="1.2" opacity="0.28"/>`);
      }
      patternSvg = rays.join('');
      break;
    }
    case 'diamond-grid': {
      const d = [];
      const s = 16;
      for (let x = 0; x < 80; x += s) {
        for (let y = 0; y < 90; y += s) {
          d.push(`<polygon points="${x + s/2},${y} ${x+s},${y+s/2} ${x+s/2},${y+s} ${x},${y+s/2}" fill="none" stroke="${acc}" stroke-width="0.8" opacity="0.28"/>`);
        }
      }
      patternSvg = d.join('');
      break;
    }
    case 'minimal-border': {
      patternSvg = `
        <rect x="5" y="5" width="70" height="80" fill="none" stroke="${acc}" stroke-width="2.5" opacity="0.55" rx="2"/>
        <rect x="0" y="0" width="80" height="5" fill="${acc}" opacity="0.8"/>
        <rect x="0" y="85" width="80" height="5" fill="${acc}" opacity="0.8"/>
        <circle cx="5" cy="5" r="2.5" fill="${acc}" opacity="0.7"/>
        <circle cx="75" cy="5" r="2.5" fill="${acc}" opacity="0.7"/>
        <circle cx="5" cy="85" r="2.5" fill="${acc}" opacity="0.7"/>
        <circle cx="75" cy="85" r="2.5" fill="${acc}" opacity="0.7"/>
      `;
      break;
    }
    case 'neon-pulse': {
      const scanLines = [];
      for (let y = 0; y < 90; y += 4) {
        scanLines.push(`<line x1="0" y1="${y}" x2="80" y2="${y}" stroke="${acc}" stroke-width="0.4" opacity="0.1"/>`);
      }
      patternSvg = `
        ${scanLines.join('')}
        <rect x="0" y="0" width="4" height="90" fill="${acc}" opacity="0.75"/>
        <polygon points="60,-5 80,-5 80,30 60,30" fill="${acc}" opacity="0.12"/>
      `;
      break;
    }
    case 'rose-gold': {
      const lines = [];
      for (let i = -40; i < 120; i += 12) {
        lines.push(`<line x1="${i}" y1="0" x2="${i + 30}" y2="90" stroke="${acc}" stroke-width="1" opacity="0.22"/>`);
      }
      patternSvg = `
        ${lines.join('')}
        <rect x="0" y="70" width="80" height="20" fill="${acc}" opacity="0.25"/>
        <rect x="0" y="0" width="80" height="4" fill="${acc}" opacity="0.65"/>
      `;
      break;
    }
    case 'sport-strike': {
      patternSvg = `
        <line x1="15" y1="0" x2="30" y2="90" stroke="${acc}" stroke-width="12" opacity="0.28"/>
        <line x1="38" y1="0" x2="53" y2="90" stroke="${acc}" stroke-width="12" opacity="0.28"/>
        <line x1="61" y1="0" x2="76" y2="90" stroke="${acc}" stroke-width="12" opacity="0.28"/>
        <rect x="0" y="72" width="80" height="18" fill="${acc}" opacity="0.8"/>
      `;
      break;
    }
    default:
      patternSvg = '';
  }

  // Title text bar + tagline bar
  const titleBar = `<rect x="8" y="24" width="64" height="3" fill="${tc}" opacity="0.9" rx="1.5"/>`;
  const tagBar = `<rect x="14" y="32" width="52" height="2" fill="${tc}" opacity="0.5" rx="1"/>`;
  const accentBar = `<rect x="8" y="58" width="64" height="1.5" fill="${acc}" opacity="0.7" rx="0.75"/>`;

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="80" height="90" viewBox="0 0 80 90">
    <defs>
      <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="${c1}"/>
        <stop offset="100%" stop-color="${c2}"/>
      </linearGradient>
      <clipPath id="clip"><rect width="80" height="90" rx="4"/></clipPath>
    </defs>
    <rect width="80" height="90" fill="url(#bg)" rx="4"/>
    <g clip-path="url(#clip)">
      ${patternSvg}
      ${titleBar}
      ${tagBar}
      ${accentBar}
    </g>
  </svg>`;

  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
}

const DesignTemplateSelector = ({
  industry,
  selectedTemplateId,
  onSelect,
}: DesignTemplateSelectorProps) => {
  const templates = getTemplatesForIndustry(industry);
  const selected = templates.find(t => t.id === selectedTemplateId) ?? null;

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label className="flex items-center gap-1.5 text-muted-foreground text-xs uppercase tracking-wider font-body">
          <Layers className="w-3.5 h-3.5" />
          Design Templates
        </label>
        {selectedTemplateId && (
          <button
            onClick={() => onSelect(null)}
            className="text-[10px] text-amber-500 hover:text-amber-400 font-body transition-colors"
          >
            Clear
          </button>
        )}
      </div>

      <div className="grid grid-cols-3 gap-2">
        {templates.map((tmpl) => {
          const isSelected = selectedTemplateId === tmpl.id;
          return (
            <motion.button
              key={tmpl.id}
              onClick={() => onSelect(isSelected ? null : tmpl)}
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.96 }}
              title={tmpl.description}
              className={`relative flex flex-col items-center rounded-xl overflow-hidden border-2 transition-all duration-200 shadow-sm ${
                isSelected
                  ? 'border-amber-400 shadow-amber-400/30 shadow-md'
                  : 'border-white/10 hover:border-amber-400/50 hover:shadow-md'
              }`}
            >
              {/* Thumbnail image */}
              <img
                src={buildThumbnailSvg(tmpl)}
                alt={tmpl.name}
                className="w-full object-cover"
                style={{ imageRendering: 'crisp-edges' }}
                draggable={false}
              />

              {/* Name strip */}
              <div
                className="w-full px-1.5 py-1 text-center"
                style={{ background: `linear-gradient(135deg, ${tmpl.colors[0]}, ${tmpl.colors[1]})` }}
              >
                <span
                  className="text-[9px] font-semibold leading-tight block truncate font-body"
                  style={{ color: tmpl.textColor }}
                >
                  {tmpl.name}
                </span>
              </div>

              {/* Check badge */}
              <AnimatePresence>
                {isSelected && (
                  <motion.div
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0, opacity: 0 }}
                    className="absolute top-1.5 right-1.5 w-4 h-4 rounded-full bg-amber-400 flex items-center justify-center shadow"
                  >
                    <Check className="w-2.5 h-2.5 text-black" strokeWidth={3} />
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.button>
          );
        })}
      </div>

      {/* Selected template info */}
      <AnimatePresence>
        {selected && (
          <motion.p
            key={selected.id}
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="text-[10px] text-amber-400/80 font-body px-0.5 leading-relaxed"
          >
            {selected.icon} {selected.description}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
};

export default DesignTemplateSelector;
