// ─── Shape Types ─────────────────────────────────────────────────────────────
/**
 * Each shape type describes the silhouette of a product face in orthographic
 * projection.  The SVG renderer in ScaleView2D picks the right path/element
 * for every view (front | side | top) based on this type.
 */
export type ShapeType =
  | 'box'          // Default rectangular box
  | 'open-top'     // Tapered wider-at-top (french fries, popcorn scoop)
  | 'bag'          // Bag body + rope/paper handle
  | 'pouch'        // Flexible stand-up / flat pouch
  | 'cylinder'     // Cylindrical tube
  | 'wedge'        // Triangular wedge (sandwich, cake slice)
  | 'envelope'     // Flat sealed mailer / poly bag
  | 'pizza'        // Very wide & flat box (pizza)
  | 'cone-cup'     // Paper cup (wider at top, circular top view)
  | 'hat-box';     // Round hat box (circular top view, rect front/side)

export interface ShapeConfig {
  type: ShapeType;
  /** For open-top: fraction narrower at base vs rim (0–0.35).  Default 0.18 */
  taperRatio?: number;
  /** For bag: handle height as fraction of total height.  Default 0.18 */
  handleHeightRatio?: number;
}

// ─── Product → Shape Map ──────────────────────────────────────────────────────
const shapeMap: Record<string, ShapeConfig> = {

  // ── Food ────────────────────────────────────────────────────────────────────
  'french-fries-box':          { type: 'open-top', taperRatio: 0.20 },
  'popcorn-box':               { type: 'open-top', taperRatio: 0.22 },
  'fried-chicken-box':         { type: 'open-top', taperRatio: 0.12 },
  'instant-food-box':          { type: 'open-top', taperRatio: 0.10 },
  'pizza-box':                 { type: 'pizza' },
  'cone-cup':                  { type: 'cone-cup' },

  // ── Carriable / Bags ────────────────────────────────────────────────────────
  'carrier-bag':               { type: 'bag', handleHeightRatio: 0.18 },
  'tote-bag':                  { type: 'bag', handleHeightRatio: 0.20 },
  'luxury-bag':                { type: 'bag', handleHeightRatio: 0.18 },
  'festival-box':              { type: 'bag', handleHeightRatio: 0.14 },
  'wedding-box':               { type: 'bag', handleHeightRatio: 0.14 },
  'hamper-box':                { type: 'bag', handleHeightRatio: 0.12 },

  // ── Pouches ─────────────────────────────────────────────────────────────────
  'stand-pouch':               { type: 'pouch' },
  'flat-pouch':                { type: 'pouch' },
  'zip-pouch':                 { type: 'pouch' },
  'spout-pouch':               { type: 'pouch' },
  'gusset-pouch':              { type: 'pouch' },
  'retort-pouch':              { type: 'pouch' },
  'sachet-pouch':              { type: 'pouch' },
  'kraft-pouch':               { type: 'pouch' },

  // ── Flat mailers ────────────────────────────────────────────────────────────
  'poly-mailer':               { type: 'envelope' },
  'bubble-mailer':             { type: 'envelope' },
  'book-mailer':               { type: 'envelope' },

  // ── Cylinder ────────────────────────────────────────────────────────────────
  'tube-mailer':               { type: 'cylinder' },

  // ── Wedge / Triangle ────────────────────────────────────────────────────────
  'sandwich-box':              { type: 'wedge' },
  'triangular-cake-slice-box': { type: 'wedge' },

  // ── Round hat box ───────────────────────────────────────────────────────────
  'hat-box':                   { type: 'hat-box' },

  // Everything else falls through to 'box' via getProductShape()
};

// ─── Public helper ────────────────────────────────────────────────────────────
export function getProductShape(productId?: string | null): ShapeConfig {
  if (!productId) return { type: 'box' };
  return shapeMap[productId] ?? { type: 'box' };
}
