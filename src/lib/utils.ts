import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { BoxDimensions, Industry, productTypes } from "./designRules";
import { LivePricingMap } from "./pricingService";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// ── Hardcoded Fallback Pricing ─────────────────────────────────────────────────
export const pricingConfig: Record<
  string,
  {
    basePrice: number;
    sizeVariationPct: number;
    designPremium: number;
  }
> = {
  // Food Industry
  'popcorn-box': { basePrice: 20, sizeVariationPct: 0.0100, designPremium: 12 },
  'pizza-box': { basePrice: 40, sizeVariationPct: 0.0005, designPremium: 20 },
  'cake-box': { basePrice: 28, sizeVariationPct: 0.0125, designPremium: 16 },
  'bakery-box': { basePrice: 24, sizeVariationPct: 0.0100, designPremium: 12 },
  'biriyani-box': { basePrice: 32, sizeVariationPct: 0.0100, designPremium: 14 },
  'burger-box': { basePrice: 20, sizeVariationPct: 0.0083, designPremium: 10 },
  'cheese-box': { basePrice: 16, sizeVariationPct: 0.0020, designPremium: 8 },
  'chicken-box': { basePrice: 36, sizeVariationPct: 0.0111, designPremium: 18 },
  'chocolate-box': { basePrice: 32, sizeVariationPct: 0.0091, designPremium: 20 },
  'cup-cake-box': { basePrice: 28, sizeVariationPct: 0.0100, designPremium: 16 },
  'cookies-box': { basePrice: 24, sizeVariationPct: 0.0083, designPremium: 12 },
  'dosa-box': { basePrice: 32, sizeVariationPct: 0.0083, designPremium: 14 },
  'dip-tea-box': { basePrice: 20, sizeVariationPct: 0.0071, designPremium: 10 },
  'dates-box': { basePrice: 28, sizeVariationPct: 0.0083, designPremium: 16 },
  'fried-chicken-box': { basePrice: 40, sizeVariationPct: 0.0143, designPremium: 20 },
  'fancy-cake-box': { basePrice: 48, sizeVariationPct: 0.0167, designPremium: 28 },
  'fancy-tea-box': { basePrice: 28, sizeVariationPct: 0.0083, designPremium: 16 },
  'food-grade-box': { basePrice: 32, sizeVariationPct: 0.0091, designPremium: 18 },
  'french-fries-box': { basePrice: 16, sizeVariationPct: 0.0067, designPremium: 8 },
  'fresh-cream-cake-box': { basePrice: 40, sizeVariationPct: 0.0111, designPremium: 22 },
  'hotdog-box': { basePrice: 20, sizeVariationPct: 0.0071, designPremium: 10 },
  'instant-food-box': { basePrice: 18, sizeVariationPct: 0.0067, designPremium: 9 },
  'meal-box': { basePrice: 32, sizeVariationPct: 0.0091, designPremium: 16 },
  'meat-box': { basePrice: 40, sizeVariationPct: 0.0100, designPremium: 20 },
  'nuts-spices-box': { basePrice: 24, sizeVariationPct: 0.0077, designPremium: 12 },
  'nuggets-box': { basePrice: 18, sizeVariationPct: 0.0067, designPremium: 9 },
  'pastries-box': { basePrice: 28, sizeVariationPct: 0.0083, designPremium: 14 },
  'plum-cake-box': { basePrice: 32, sizeVariationPct: 0.0083, designPremium: 16 },
  'sandwich-box': { basePrice: 20, sizeVariationPct: 0.0067, designPremium: 10 },
  'savouries-box': { basePrice: 24, sizeVariationPct: 0.0083, designPremium: 12 },
  'sea-foods-box': { basePrice: 44, sizeVariationPct: 0.0111, designPremium: 22 },
  'shawarma-box': { basePrice: 24, sizeVariationPct: 0.0077, designPremium: 12 },
  'sweet-box': { basePrice: 28, sizeVariationPct: 0.0083, designPremium: 14 },
  'tea-box': { basePrice: 22, sizeVariationPct: 0.0071, designPremium: 11 },
  'triangular-cake-slice-box': { basePrice: 20, sizeVariationPct: 0.0067, designPremium: 10 },
  // Garment
  'garment-box': { basePrice: 48, sizeVariationPct: 0.0143, designPremium: 24 },
  'shirt-box': { basePrice: 52, sizeVariationPct: 0.0143, designPremium: 26 },
  'shoe-box': { basePrice: 56, sizeVariationPct: 0.0167, designPremium: 28 },
  'saree-box': { basePrice: 64, sizeVariationPct: 0.0154, designPremium: 32 },
  'jacket-box': { basePrice: 72, sizeVariationPct: 0.0167, designPremium: 36 },
  'trouser-box': { basePrice: 52, sizeVariationPct: 0.0143, designPremium: 26 },
  'lingerie-box': { basePrice: 56, sizeVariationPct: 0.0125, designPremium: 28 },
  'sports-box': { basePrice: 48, sizeVariationPct: 0.0133, designPremium: 24 },
  'accessories-box': { basePrice: 40, sizeVariationPct: 0.0111, designPremium: 20 },
  'hat-box': { basePrice: 60, sizeVariationPct: 0.0154, designPremium: 30 },
  // Carriable
  'carrier-bag': { basePrice: 40, sizeVariationPct: 0.0125, designPremium: 20 },
  'gift-box': { basePrice: 60, sizeVariationPct: 0.0167, designPremium: 32 },
  'tote-bag': { basePrice: 36, sizeVariationPct: 0.0118, designPremium: 18 },
  'window-box': { basePrice: 48, sizeVariationPct: 0.0133, designPremium: 24 },
  'hamper-box': { basePrice: 96, sizeVariationPct: 0.0200, designPremium: 48 },
  'festival-box': { basePrice: 68, sizeVariationPct: 0.0154, designPremium: 34 },
  'luxury-bag': { basePrice: 64, sizeVariationPct: 0.0143, designPremium: 32 },
  'wedding-box': { basePrice: 80, sizeVariationPct: 0.0182, designPremium: 40 },
  // Electronics
  'phone-box': { basePrice: 64, sizeVariationPct: 0.0100, designPremium: 32 },
  'gadget-box': { basePrice: 80, sizeVariationPct: 0.0125, designPremium: 40 },
  'laptop-box': { basePrice: 120, sizeVariationPct: 0.0200, designPremium: 60 },
  'earbuds-box': { basePrice: 56, sizeVariationPct: 0.0091, designPremium: 28 },
  'smartwatch-box': { basePrice: 68, sizeVariationPct: 0.0100, designPremium: 34 },
  'charger-box': { basePrice: 32, sizeVariationPct: 0.0067, designPremium: 16 },
  'camera-box': { basePrice: 88, sizeVariationPct: 0.0133, designPremium: 44 },
  'tablet-box': { basePrice: 96, sizeVariationPct: 0.0154, designPremium: 48 },
  'router-box': { basePrice: 72, sizeVariationPct: 0.0125, designPremium: 36 },
  'gaming-box': { basePrice: 80, sizeVariationPct: 0.0133, designPremium: 40 },
  // Pouches
  'stand-pouch': { basePrice: 12, sizeVariationPct: 0.0067, designPremium: 6 },
  'flat-pouch': { basePrice: 8, sizeVariationPct: 0.0050, designPremium: 4 },
  'zip-pouch': { basePrice: 14, sizeVariationPct: 0.0063, designPremium: 7 },
  'spout-pouch': { basePrice: 18, sizeVariationPct: 0.0071, designPremium: 9 },
  'gusset-pouch': { basePrice: 16, sizeVariationPct: 0.0067, designPremium: 8 },
  'retort-pouch': { basePrice: 20, sizeVariationPct: 0.0077, designPremium: 10 },
  'sachet-pouch': { basePrice: 4, sizeVariationPct: 0.0040, designPremium: 2 },
  'kraft-pouch': { basePrice: 14, sizeVariationPct: 0.0063, designPremium: 7 },
  // E-Commerce
  'mailer-box': { basePrice: 44, sizeVariationPct: 0.0111, designPremium: 22 },
  'shipping-box': { basePrice: 68, sizeVariationPct: 0.0143, designPremium: 34 },
  'subscription-box': { basePrice: 56, sizeVariationPct: 0.0125, designPremium: 28 },
  'poly-mailer': { basePrice: 10, sizeVariationPct: 0.0050, designPremium: 5 },
  'bubble-mailer': { basePrice: 16, sizeVariationPct: 0.0059, designPremium: 8 },
  'return-box': { basePrice: 48, sizeVariationPct: 0.0111, designPremium: 24 },
  'fragile-box': { basePrice: 72, sizeVariationPct: 0.0133, designPremium: 36 },
  'book-mailer': { basePrice: 32, sizeVariationPct: 0.0077, designPremium: 16 },
  'tube-mailer': { basePrice: 28, sizeVariationPct: 0.0083, designPremium: 14 },
  // Pharma
  'medicine-box': { basePrice: 40, sizeVariationPct: 0.0067, designPremium: 24 },
  'supplement-box': { basePrice: 36, sizeVariationPct: 0.0071, designPremium: 20 },
  'syrup-box': { basePrice: 32, sizeVariationPct: 0.0063, designPremium: 18 },
  'tablet-strip-box': { basePrice: 24, sizeVariationPct: 0.0056, designPremium: 14 },
  'injection-box': { basePrice: 44, sizeVariationPct: 0.0071, designPremium: 24 },
  'ointment-box': { basePrice: 28, sizeVariationPct: 0.0063, designPremium: 16 },
  'surgical-box': { basePrice: 56, sizeVariationPct: 0.0083, designPremium: 30 },
  'vitamin-box': { basePrice: 40, sizeVariationPct: 0.0071, designPremium: 22 },
  'device-box': { basePrice: 72, sizeVariationPct: 0.0100, designPremium: 38 },
  // Cosmetic
  'perfume-box': { basePrice: 80, sizeVariationPct: 0.0100, designPremium: 40 },
  'cosmetic-box': { basePrice: 60, sizeVariationPct: 0.0091, designPremium: 32 },
  'serum-box': { basePrice: 64, sizeVariationPct: 0.0083, designPremium: 34 },
  'foundation-box': { basePrice: 56, sizeVariationPct: 0.0077, designPremium: 29 },
  'eye-shadow-box': { basePrice: 52, sizeVariationPct: 0.0083, designPremium: 26 },
  'nail-box': { basePrice: 32, sizeVariationPct: 0.0063, designPremium: 18 },
  'hair-care-box': { basePrice: 48, sizeVariationPct: 0.0083, designPremium: 26 },
  'skincare-set-box': { basePrice: 80, sizeVariationPct: 0.0125, designPremium: 42 },
  'lipstick-box': { basePrice: 28, sizeVariationPct: 0.0059, designPremium: 14 },
  'body-lotion-box': { basePrice: 44, sizeVariationPct: 0.0077, designPremium: 22 },
  // Luxury
  'luxury-rigid': { basePrice: 120, sizeVariationPct: 0.0143, designPremium: 60 },
  'watch-box': { basePrice: 144, sizeVariationPct: 0.0125, designPremium: 72 },
  'jewellery-box': { basePrice: 128, sizeVariationPct: 0.0118, designPremium: 64 },
  'ring-box': { basePrice: 96, sizeVariationPct: 0.0100, designPremium: 48 },
  'spirits-box': { basePrice: 112, sizeVariationPct: 0.0133, designPremium: 56 },
  'cigar-box': { basePrice: 120, sizeVariationPct: 0.0125, designPremium: 60 },
  'pen-box': { basePrice: 80, sizeVariationPct: 0.0091, designPremium: 40 },
  'scarf-box': { basePrice: 96, sizeVariationPct: 0.0111, designPremium: 48 },
  'chocolate-luxury-box': { basePrice: 104, sizeVariationPct: 0.0105, designPremium: 52 },
  'trophy-box': { basePrice: 160, sizeVariationPct: 0.0167, designPremium: 80 },
};

// ── Industry Price Adjustments ────────────────────────────────────────────────
const industryPriceMultipliers: Record<Industry, number> = {
  food: 1.0,
  pharma: 1.3,
  cosmetic: 1.4,
  garment: 1.2,
  ecommerce: 0.95,
  electronics: 1.25,
};

export interface MinimumCost {
  basePrice: number;
  sizeAdjustment: number;
  designPremium: number;
  industryMultiplier: number;
  totalCost: number;
  isLive: boolean; // true if price came from Google Sheets
}

/**
 * Calculate the minimum cost for a package.
 *
 * Priority:
 *  1. Live price from Google Sheets (via livePricing map)
 *  2. Hardcoded fallback from pricingConfig
 *
 * The basePrice represents the cost of the product at its default dimensions.
 * If dimensions are smaller than default, sizeAdjustment is 0.
 * If dimensions are larger, sizeVariationPct applies to the extra dimensions.
 */
export function calculateMinimumCost(
  productId: string | undefined,
  dimensions: BoxDimensions,
  industry: Industry,
  hasCustomDesign = false,
  livePricing: LivePricingMap = {}
): MinimumCost {
  const currentTotalCm = dimensions.length + dimensions.width + dimensions.height;
  const industryMultiplier = industryPriceMultipliers[industry] || 1.0;
  
  // Find default dimensions for this product type
  const productDef = productTypes.find((p) => p.id === productId);
  const defaultTotalCm = productDef
    ? productDef.defaultDimensions.length + productDef.defaultDimensions.width + productDef.defaultDimensions.height
    : 0;

  // Only apply size adjustment if the current size is LARGER than the default size
  const extraCm = Math.max(0, currentTotalCm - defaultTotalCm);

  // ── 1. Try live pricing from Sheets ──────────────────────────────────────
  if (productId && livePricing[productId]) {
    const live = livePricing[productId];
    const basePrice = live.basePrice;
    
    // Multiplier only grows based on extra cm above default
    const sizeMultiplier = 1 + live.sizeVariationPct * extraCm;
    const sizeAdjustment = basePrice * (sizeMultiplier - 1);
    const designPremium = hasCustomDesign ? live.designPremium : 0;
    
    const totalCost = (basePrice + sizeAdjustment + designPremium) * industryMultiplier;

    return {
      basePrice,
      sizeAdjustment: Number(sizeAdjustment.toFixed(2)),
      designPremium: Number(designPremium.toFixed(2)),
      industryMultiplier,
      totalCost: Number(totalCost.toFixed(2)),
      isLive: true,
    };
  }

  // ── 2. Hardcoded fallback ─────────────────────────────────────────────────
  const config = productId ? pricingConfig[productId] : null;

  if (!config) {
    return {
      basePrice: 0.5,
      sizeAdjustment: 0,
      designPremium: 0,
      industryMultiplier,
      totalCost: Number((0.5 * industryMultiplier).toFixed(2)),
      isLive: false,
    };
  }

  const basePrice = config.basePrice;
  const sizeMultiplier = 1 + config.sizeVariationPct * extraCm;
  const sizeAdjustment = basePrice * (sizeMultiplier - 1);
  const designPremium = hasCustomDesign ? config.designPremium : 0;
  
  const totalCost = (basePrice + sizeAdjustment + designPremium) * industryMultiplier;

  return {
    basePrice,
    sizeAdjustment: Number(sizeAdjustment.toFixed(2)),
    designPremium: Number(designPremium.toFixed(2)),
    industryMultiplier,
    totalCost: Number(totalCost.toFixed(2)),
    isLive: false,
  };
}
