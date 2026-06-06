import { Industry } from './designRules';

// ─── Style keys that map to templateRenderers.ts ─────────────────────────────
export type TemplateStyle =
  | 'vertical-stripes'
  | 'diagonal-stripes'
  | 'dots-grid'
  | 'concentric-circles'
  | 'wave-bands'
  | 'grid-lines'
  | 'hexagons'
  | 'chevron'
  | 'kraft-lines'
  | 'circuit-lines'
  | 'starburst'
  | 'diamond-grid'
  | 'minimal-border'
  | 'neon-pulse'
  | 'rose-gold'
  | 'sport-strike'
  | 'none';

export interface DesignTemplate {
  id: string;
  name: string;
  industry: Industry;
  /** Gradient background stops [from, to] */
  colors: [string, string];
  /** Accent color for decorative pattern elements */
  accent: string;
  /** Secondary color for stripe patterns */
  stripeColor?: string;
  /** Text / title color on the canvas */
  textColor: string;
  /** Fabric.js font style */
  font: 'bold' | 'clean' | 'elegant';
  /** Subtitle tagline drawn on the box */
  tagline: string;
  /** Which pattern renderer to use */
  style: TemplateStyle;
  /** Description shown below the card when selected */
  description: string;
  /** Emoji icon for identification */
  icon: string;
}

// ─── Template Config ──────────────────────────────────────────────────────────
export const designTemplates: Record<Industry, DesignTemplate[]> = {

  // ── Food & Beverage ─────────────────────────────────────────────────────
  food: [
    {
      id: 'food-bold-appetite',
      name: 'Bold Appetite',
      industry: 'food',
      colors: ['#B71C1C', '#E53935'],
      accent: '#FFD600',
      textColor: '#FFFFFF',
      font: 'bold',
      tagline: 'Taste the Difference',
      style: 'diagonal-stripes',
      description: 'Fiery red with bold yellow diagonal slashes — fast food energy.',
      icon: '🍔',
    },
    {
      id: 'food-fresh-harvest',
      name: 'Fresh Harvest',
      industry: 'food',
      colors: ['#1B5E20', '#2E7D32'],
      accent: '#AEEA00',
      textColor: '#FFFFFF',
      font: 'bold',
      tagline: 'Farm Fresh Quality',
      style: 'dots-grid',
      description: 'Deep forest green with neon-green polka dots — organic & fresh.',
      icon: '🥗',
    },
    {
      id: 'food-warm-delight',
      name: 'Warm Delight',
      industry: 'food',
      colors: ['#E65100', '#FFAB40'],
      accent: '#FFF8E1',
      textColor: '#FFFFFF',
      font: 'bold',
      tagline: 'Freshly Made for You',
      style: 'wave-bands',
      description: 'Warm amber with cream wave bands — bakeries, cakes & pastries.',
      icon: '🍰',
    },
    {
      id: 'food-pizza-classico',
      name: 'Pizza Classico',
      industry: 'food',
      colors: ['#0A0A0A', '#1A1A1A'],
      accent: '#C62828',
      textColor: '#FFFFFF',
      font: 'bold',
      tagline: 'Authentic Italian Taste',
      style: 'concentric-circles',
      description: 'Jet black with bold red concentric rings — dramatic pizzeria look.',
      icon: '🍕',
    },
    {
      id: 'food-popcorn-stripes',
      name: 'Popcorn Classic',
      industry: 'food',
      colors: ['#FFFFFF', '#FFFFFF'],
      accent: '#C62828',
      stripeColor: '#C62828',
      textColor: '#C62828',
      font: 'bold',
      tagline: 'Pop. Crunch. Enjoy.',
      style: 'vertical-stripes',
      description: 'Classic red & white vertical stripes — the iconic popcorn box look.',
      icon: '🍿',
    },
    {
      id: 'food-eco-kraft',
      name: 'Eco Kraft',
      industry: 'food',
      colors: ['#6D4C41', '#8D6E63'],
      accent: '#558B2F',
      textColor: '#FFF8E1',
      font: 'clean',
      tagline: '100% Natural & Pure',
      style: 'kraft-lines',
      description: 'Earthy brown with horizontal kraft-paper lines for eco brands.',
      icon: '🌿',
    },
  ],

  // ── Pharma ──────────────────────────────────────────────────────────────
  pharma: [
    {
      id: 'pharma-clinical-trust',
      name: 'Clinical Trust',
      industry: 'pharma',
      colors: ['#0D47A1', '#1565C0'],
      accent: '#82B1FF',
      textColor: '#FFFFFF',
      font: 'clean',
      tagline: 'Trusted by Professionals',
      style: 'grid-lines',
      description: 'Deep navy with a clean grid — precision and clinical authority.',
      icon: '🏥',
    },
    {
      id: 'pharma-pure-white',
      name: 'Pure White',
      industry: 'pharma',
      colors: ['#FAFAFA', '#E3F2FD'],
      accent: '#0288D1',
      textColor: '#0D47A1',
      font: 'clean',
      tagline: 'Purity You Can Trust',
      style: 'minimal-border',
      description: 'Crisp white with a blue accent border — OTC medicine clarity.',
      icon: '💊',
    },
    {
      id: 'pharma-health-green',
      name: 'Health Green',
      industry: 'pharma',
      colors: ['#1B5E20', '#2E7D32'],
      accent: '#69F0AE',
      textColor: '#FFFFFF',
      font: 'clean',
      tagline: 'Wellness Starts Here',
      style: 'wave-bands',
      description: 'Rich green with mint wave bands — supplements & nutraceuticals.',
      icon: '🌿',
    },
    {
      id: 'pharma-medical-pro',
      name: 'Medical Pro',
      industry: 'pharma',
      colors: ['#1C2833', '#2C3E50'],
      accent: '#00BCD4',
      textColor: '#ECEFF1',
      font: 'clean',
      tagline: 'Advanced Healthcare',
      style: 'diagonal-stripes',
      description: 'Dark slate with cyan diagonal stripes — medical devices & prescriptions.',
      icon: '🔬',
    },
    {
      id: 'pharma-soft-care',
      name: 'Soft Care',
      industry: 'pharma',
      colors: ['#EDE7F6', '#D1C4E9'],
      accent: '#5C6BC0',
      textColor: '#1A1A2E',
      font: 'clean',
      tagline: 'Gentle. Effective. Safe.',
      style: 'dots-grid',
      description: 'Soft lavender with indigo dots — OTC creams, lotions & baby care.',
      icon: '🩺',
    },
  ],

  // ── Cosmetic & Beauty ───────────────────────────────────────────────────
  cosmetic: [
    {
      id: 'cosmetic-rose-luxe',
      name: 'Rose Luxe',
      industry: 'cosmetic',
      colors: ['#880E4F', '#AD1457'],
      accent: '#F8BBD0',
      textColor: '#FFFFFF',
      font: 'elegant',
      tagline: 'Crafted for Beauty',
      style: 'rose-gold',
      description: 'Deep rose with shimmer diagonal streaks — premium skincare & perfume.',
      icon: '🌸',
    },
    {
      id: 'cosmetic-noir-gold',
      name: 'Noir Gold',
      industry: 'cosmetic',
      colors: ['#050505', '#0D0D0D'],
      accent: '#D4AF37',
      textColor: '#D4AF37',
      font: 'elegant',
      tagline: 'Luxury Redefined',
      style: 'diamond-grid',
      description: 'Jet black with gold diamond lattice — the ultimate luxury look.',
      icon: '✨',
    },
    {
      id: 'cosmetic-velvet-dream',
      name: 'Velvet Dream',
      industry: 'cosmetic',
      colors: ['#4A148C', '#6A1B9A'],
      accent: '#EA80FC',
      textColor: '#FFFFFF',
      font: 'elegant',
      tagline: 'Feel the Difference',
      style: 'starburst',
      description: 'Regal purple with starburst rays — hair care & premium cosmetics.',
      icon: '💜',
    },
    {
      id: 'cosmetic-blush-minimal',
      name: 'Blush Minimal',
      industry: 'cosmetic',
      colors: ['#FCE4EC', '#F8BBD0'],
      accent: '#E91E63',
      textColor: '#880E4F',
      font: 'elegant',
      tagline: 'Pure. Natural. You.',
      style: 'concentric-circles',
      description: 'Pastel blush with rose rings — natural & organic beauty brands.',
      icon: '🩷',
    },
    {
      id: 'cosmetic-mint-fresh',
      name: 'Mint Fresh',
      industry: 'cosmetic',
      colors: ['#004D40', '#00695C'],
      accent: '#A7FFEB',
      textColor: '#FFFFFF',
      font: 'clean',
      tagline: 'Refresh Your Beauty',
      style: 'chevron',
      description: 'Deep teal with mint chevron bands — face wash, toners & serums.',
      icon: '🌿',
    },
  ],

  // ── Garment & Fashion ───────────────────────────────────────────────────
  garment: [
    {
      id: 'garment-modern-mono',
      name: 'Modern Mono',
      industry: 'garment',
      colors: ['#0A0A0A', '#212121'],
      accent: '#EEEEEE',
      textColor: '#FFFFFF',
      font: 'clean',
      tagline: 'Wear Your Identity',
      style: 'vertical-stripes',
      stripeColor: '#1A1A1A',
      description: 'Black-on-black tonal stripes — contemporary minimalist fashion.',
      icon: '🖤',
    },
    {
      id: 'garment-urban-edge',
      name: 'Urban Edge',
      industry: 'garment',
      colors: ['#1C2833', '#212F3C'],
      accent: '#CFD8DC',
      textColor: '#ECEFF1',
      font: 'clean',
      tagline: 'Style Without Limits',
      style: 'diagonal-stripes',
      description: 'Dark slate with silver diagonal slashes — urban streetwear energy.',
      icon: '🏙️',
    },
    {
      id: 'garment-fashion-forward',
      name: 'Fashion Forward',
      industry: 'garment',
      colors: ['#4A0E4E', '#6A1B9A'],
      accent: '#CE93D8',
      textColor: '#FFFFFF',
      font: 'elegant',
      tagline: 'Ahead of the Curve',
      style: 'hexagons',
      description: 'Bold purple with hexagon mesh — high-street & avant-garde fashion.',
      icon: '👗',
    },
    {
      id: 'garment-ivory-elite',
      name: 'Ivory Elite',
      industry: 'garment',
      colors: ['#F5F0E8', '#EDE0D4'],
      accent: '#8D6E63',
      textColor: '#4E342E',
      font: 'elegant',
      tagline: 'Timeless Elegance',
      style: 'minimal-border',
      description: 'Warm ivory with walnut border — premium ethnic & formal wear.',
      icon: '🥻',
    },
    {
      id: 'garment-sport-strike',
      name: 'Sport Strike',
      industry: 'garment',
      colors: ['#0D47A1', '#1565C0'],
      accent: '#FF6F00',
      textColor: '#FFFFFF',
      font: 'bold',
      tagline: 'Performance Unleashed',
      style: 'sport-strike',
      description: 'Bold blue with orange power slashes — sports & activewear.',
      icon: '⚡',
    },
  ],

  // ── E-Commerce ──────────────────────────────────────────────────────────
  ecommerce: [
    {
      id: 'ecommerce-unbox-joy',
      name: 'Unbox Joy',
      industry: 'ecommerce',
      colors: ['#E65100', '#F57C00'],
      accent: '#FFD600',
      textColor: '#FFFFFF',
      font: 'bold',
      tagline: 'Delivered with Love',
      style: 'starburst',
      description: 'Burnt orange with a yellow starburst burst — maximum unboxing excitement.',
      icon: '🎉',
    },
    {
      id: 'ecommerce-kraft-natural',
      name: 'Kraft Natural',
      industry: 'ecommerce',
      colors: ['#5D4037', '#6D4C41'],
      accent: '#A5D6A7',
      textColor: '#FFF8E1',
      font: 'clean',
      tagline: 'Sustainably Shipped',
      style: 'kraft-lines',
      description: 'Kraft brown with green-tinted lines — eco shipping brands.',
      icon: '♻️',
    },
    {
      id: 'ecommerce-pop-ship',
      name: 'Pop Ship',
      industry: 'ecommerce',
      colors: ['#880E4F', '#C2185B'],
      accent: '#F48FB1',
      textColor: '#FFFFFF',
      font: 'bold',
      tagline: 'Fast. Fun. Fresh.',
      style: 'chevron',
      description: 'Hot magenta with pink chevrons — trendy DTC & direct-to-consumer.',
      icon: '🚀',
    },
    {
      id: 'ecommerce-midnight-ship',
      name: 'Midnight Ship',
      industry: 'ecommerce',
      colors: ['#050A1A', '#0A1628'],
      accent: '#40C4FF',
      textColor: '#FFFFFF',
      font: 'clean',
      tagline: 'Premium Delivery',
      style: 'circuit-lines',
      description: 'Dark navy with cyan circuit routes — premium subscription boxes.',
      icon: '🌙',
    },
    {
      id: 'ecommerce-green-go',
      name: 'Green Go',
      industry: 'ecommerce',
      colors: ['#1B5E20', '#2E7D32'],
      accent: '#69F0AE',
      textColor: '#FFFFFF',
      font: 'bold',
      tagline: 'Fast & Eco Friendly',
      style: 'diagonal-stripes',
      description: 'Forest green with mint diagonal stripes — eco-shipping signal.',
      icon: '🌍',
    },
  ],

  // ── Electronics ─────────────────────────────────────────────────────────
  electronics: [
    {
      id: 'electronics-tech-noir',
      name: 'Tech Noir',
      industry: 'electronics',
      colors: ['#0D1117', '#161B22'],
      accent: '#58A6FF',
      textColor: '#C9D1D9',
      font: 'clean',
      tagline: 'Engineered for Excellence',
      style: 'circuit-lines',
      description: 'Dark GitHub theme with blue circuit traces — serious developer tools.',
      icon: '💻',
    },
    {
      id: 'electronics-circuit-blue',
      name: 'Circuit Blue',
      industry: 'electronics',
      colors: ['#0D2137', '#0D3B6E'],
      accent: '#82B1FF',
      textColor: '#FFFFFF',
      font: 'clean',
      tagline: 'Power in Every Byte',
      style: 'hexagons',
      description: 'Deep blue with hex grid — consumer electronics & smart devices.',
      icon: '🔋',
    },
    {
      id: 'electronics-neon-pulse',
      name: 'Neon Pulse',
      industry: 'electronics',
      colors: ['#050505', '#0A0A0A'],
      accent: '#00E676',
      textColor: '#00E676',
      font: 'clean',
      tagline: 'Next-Gen Technology',
      style: 'neon-pulse',
      description: 'Matrix black with scanning neon green — gaming & high-performance.',
      icon: '🎮',
    },
    {
      id: 'electronics-silver-precision',
      name: 'Silver Precision',
      industry: 'electronics',
      colors: ['#37474F', '#546E7A'],
      accent: '#ECEFF1',
      textColor: '#FFFFFF',
      font: 'clean',
      tagline: 'Precision Crafted',
      style: 'diagonal-stripes',
      description: 'Metallic slate with silver diagonal lines — premium audio & devices.',
      icon: '🎵',
    },
    {
      id: 'electronics-solar-white',
      name: 'Solar White',
      industry: 'electronics',
      colors: ['#FAFAFA', '#F5F5F5'],
      accent: '#FF6D00',
      textColor: '#212121',
      font: 'clean',
      tagline: 'Simplicity. Power.',
      style: 'minimal-border',
      description: 'Apple-inspired clean white with orange accent border.',
      icon: '📱',
    },
  ],
};

/** Returns all templates for a given industry */
export function getTemplatesForIndustry(industry: Industry): DesignTemplate[] {
  return designTemplates[industry] ?? [];
}

/** Returns a specific template by id */
export function getTemplateById(id: string): DesignTemplate | undefined {
  for (const templates of Object.values(designTemplates)) {
    const found = templates.find((t) => t.id === id);
    if (found) return found;
  }
  return undefined;
}
