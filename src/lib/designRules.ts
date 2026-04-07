export type Industry = 'food' | 'pharma' | 'cosmetic';
export type BoxType = 'food-box' | 'cosmetic-box' | 'pharma-box' | 'ecommerce-box';

export interface DesignConfig {
  colors: string[];
  font: string;
  layout: 'center' | 'top' | 'minimal';
  styleName: string;
}

export const designRules: Record<Industry, DesignConfig[]> = {
  food: [
    { colors: ['#FF5733', '#FFC300'], font: 'bold', layout: 'center', styleName: 'Bold Appetite' },
    { colors: ['#2D5016', '#8BC34A'], font: 'bold', layout: 'top', styleName: 'Fresh Harvest' },
    { colors: ['#E65100', '#FFE0B2'], font: 'bold', layout: 'minimal', styleName: 'Warm Delight' },
  ],
  pharma: [
    { colors: ['#2E86C1', '#AED6F1'], font: 'clean', layout: 'top', styleName: 'Clinical Trust' },
    { colors: ['#1A5276', '#D4E6F1'], font: 'clean', layout: 'center', styleName: 'Medical Pro' },
    { colors: ['#0E6655', '#A3E4D7'], font: 'clean', layout: 'minimal', styleName: 'Health Pure' },
  ],
  cosmetic: [
    { colors: ['#F5B7B1', '#FADBD8'], font: 'elegant', layout: 'minimal', styleName: 'Rose Luxe' },
    { colors: ['#2C2C2C', '#D4AF37'], font: 'elegant', layout: 'center', styleName: 'Noir Gold' },
    { colors: ['#6C3483', '#D2B4DE'], font: 'elegant', layout: 'top', styleName: 'Velvet Dream' },
  ],
};

export interface BoxDimensions {
  length: number;
  width: number;
  height: number;
}

export interface PackagingState {
  selectedBox: BoxType | null;
  dimensions: BoxDimensions;
  productName: string;
  industry: Industry;
  logoUrl: string | null;
  colorPreference: string;
  activeDesign: DesignConfig | null;
  variations: DesignConfig[];
}

export const defaultState: PackagingState = {
  selectedBox: null,
  dimensions: { length: 10, width: 8, height: 6 },
  productName: 'My Product',
  industry: 'cosmetic',
  logoUrl: null,
  colorPreference: '',
  activeDesign: null,
  variations: [],
};

export const boxTypes: { id: BoxType; name: string; description: string; icon: string }[] = [
  { id: 'food-box', name: 'Food Box', description: 'Perfect for food & beverage products', icon: '🍽️' },
  { id: 'cosmetic-box', name: 'Cosmetic Box', description: 'Elegant packaging for beauty products', icon: '💄' },
  { id: 'pharma-box', name: 'Pharma Box', description: 'Clean, professional medical packaging', icon: '💊' },
  { id: 'ecommerce-box', name: 'E-Commerce Box', description: 'Durable shipping & unboxing experience', icon: '📦' },
];
