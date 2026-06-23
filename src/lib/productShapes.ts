// ─── Shape Types ─────────────────────────────────────────────────────────────
/**
 * Each shape type describes the silhouette of a product face in orthographic
 * projection. The SVG renderer in ScaleView2D picks the right path/element
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
  | 'hat-box'      // Round hat box (circular top view, rect front/side)
  | 'clamshell'    // Hinged clam box (burger, hotdog) — lid crease on front
  | 'tray'         // Very flat open tray with inner rim line (chocolate, meal)
  | 'slim-tall'    // Tall & narrow vertical carton (perfume, serum, syrup)
  | 'sleeve'                   // tray sliding out of a sleeve
  | 'tapered-clamshell'        // angled walls hinged clamshell
  | 'window-box'               // box with clear window
  | 'gable-box'                // arched roof with handle
  | 'dome-box'                 // semi-cylindrical dome roof with top handle
  | 'clear-cover-tray'         // base tray with tall transparent cover
  | 'rigid-hinged'             // wrap-around hinged lid
  | 'two-piece-rigid'          // 2-piece hovering lid
  | 'hanger-box'               // box with euro hole tab
  | 'side-gusset-pouch'        // blocky to pinch seal
  | 'kraft-pouch'              // serrated top, folded gussets
  | 'divider-box'              // double wall corrugated with divider holes
  | 'wrap-mailer'              // wrap around folding mailer
  | 'open-grid-box'            // tuck flap open, inner grid of vials
  | 'open-mailer'              // roll end tuck front, opened
  | 'open-flaps-box'           // 4 top flaps completely open
  | 'rigid-clamshell'          // rigid square with pillow
  | 'shallow-rigid-wrap'       // shallow rigid tray with wrap cover
  | 'triangle-prism';          // isosceles standing triangle

export interface ShapeConfig {
  type: ShapeType;
  /** For open-top: fraction narrower at base vs rim (0–0.35).  Default 0.18 */
  taperRatio?: number;
  /** For bag: handle height as fraction of total height.  Default 0.18 */
  handleHeightRatio?: number;
}

// ─── Product → Shape Map ──────────────────────────────────────────────────────
const shapeMap: Record<string, ShapeConfig> = {

  // ══════════════════════════════════════════════════════════════════════════
  // FOOD
  // ══════════════════════════════════════════════════════════════════════════
  'popcorn-box':               { type: 'open-top', taperRatio: 0.22 },
  'pizza-box':                 { type: 'pizza' },
  'cake-box':                  { type: 'box' },
  'bakery-box':                { type: 'box' },
  'biriyani-box':              { type: 'sleeve' },
  'burger-box':                { type: 'tapered-clamshell' },
  'cheese-box':                { type: 'triangle-prism' },
  'chicken-box':               { type: 'clamshell' },
  'chocolate-box':             { type: 'tray' },
  'cup-cake-box':              { type: 'window-box' },
  'cookies-box':               { type: 'tray' },
  'dosa-box':                  { type: 'pizza' },          // very wide & flat
  'dip-tea-box':               { type: 'box' },
  'dates-box':                 { type: 'tray' },
  'fried-chicken-box':         { type: 'gable-box' },
  'fancy-cake-box':            { type: 'dome-box' },
  'fancy-tea-box':             { type: 'fancy-tea-box' },
  'food-grade-box':            { type: 'box' },
  'french-fries-box':          { type: 'open-top', taperRatio: 0.20 },
  'fresh-cream-cake-box':      { type: 'box' },
  'hotdog-box':                { type: 'tapered-clamshell' },
  'instant-food-box':          { type: 'box' },
  'meal-box':                  { type: 'tray' },
  'meat-box':                  { type: 'tray' },
  'nuts-spices-box':           { type: 'slim-tall' },
  'nuggets-box':               { type: 'box' },
  'pastries-box':              { type: 'tray' },
  'plum-cake-box':             { type: 'two-piece-rigid' },
  'sandwich-box':              { type: 'wedge' },
  'savouries-box':             { type: 'slim-tall' },
  'sea-foods-box':             { type: 'tray' },
  'shawarma-box':              { type: 'envelope' },       // flat wrap
  'sweet-box':                 { type: 'tray' },
  'tea-box':                   { type: 'open-flaps-box' },
  'triangular-cake-slice-box': { type: 'triangle-prism' },
  'cone-cup':                  { type: 'cone-cup' },

  // ══════════════════════════════════════════════════════════════════════════
  // GARMENT
  // ══════════════════════════════════════════════════════════════════════════
  'garment-box':               { type: 'pizza' },          // wide flat lid box
  'shirt-box':                 { type: 'pizza' },
  'shoe-box':                  { type: 'box' },
  'saree-box':                 { type: 'two-piece-rigid' },          // very wide flat
  'jacket-box':                { type: 'open-mailer' },
  'trouser-box':               { type: 'pizza' },
  'lingerie-box':              { type: 'window-box' },
  'sports-box':                { type: 'pizza' },
  'accessories-box':           { type: 'pizza' },          // wide flat
  'hat-box':                   { type: 'hat-box' },

  // ══════════════════════════════════════════════════════════════════════════
  // CARRIABLE (bags, gift boxes)
  // ══════════════════════════════════════════════════════════════════════════
  'carrier-bag':               { type: 'gable-box' },
  'gift-box':                  { type: 'box' },
  'tote-bag':                  { type: 'bag', handleHeightRatio: 0.20 },
  'window-box':                { type: 'window-box' },
  'hamper-box':                { type: 'clear-cover-tray' },
  'festival-box':              { type: 'rigid-hinged' },
  'luxury-bag':                { type: 'bag', handleHeightRatio: 0.18 },
  'wedding-box':               { type: 'two-piece-rigid' },

  // ══════════════════════════════════════════════════════════════════════════
  // ELECTRONICS
  // ══════════════════════════════════════════════════════════════════════════
  'phone-box':                 { type: 'slim-tall' },      // tall narrow portrait
  'gadget-box':                { type: 'hanger-box' },
  'laptop-box':                { type: 'pizza' },          // very wide flat
  'earbuds-box':               { type: 'box' },
  'smartwatch-box':            { type: 'two-piece-rigid' },
  'charger-box':               { type: 'tray' },
  'camera-box':                { type: 'box' },
  'tablet-box':                { type: 'pizza' },          // wide flat
  'router-box':                { type: 'box' },
  'gaming-box':                { type: 'box' },

  // ══════════════════════════════════════════════════════════════════════════
  // POUCHES
  // ══════════════════════════════════════════════════════════════════════════
  'stand-pouch':               { type: 'pouch' },
  'flat-pouch':                { type: 'pouch' },
  'zip-pouch':                 { type: 'pouch' },
  'spout-pouch':               { type: 'pouch' },
  'gusset-pouch':              { type: 'side-gusset-pouch' },
  'retort-pouch':              { type: 'pouch' },
  'sachet-pouch':              { type: 'envelope' },       // very small flat sealed
  'kraft-pouch':               { type: 'kraft-pouch' },

  // ══════════════════════════════════════════════════════════════════════════
  // E-COMMERCE
  // ══════════════════════════════════════════════════════════════════════════
  'mailer-box':                { type: 'box' },
  'shipping-box':              { type: 'box' },
  'subscription-box':          { type: 'box' },
  'poly-mailer':               { type: 'envelope' },
  'bubble-mailer':             { type: 'envelope' },
  'return-box':                { type: 'box' },
  'fragile-box':               { type: 'divider-box' },
  'book-mailer':               { type: 'wrap-mailer' },
  'tube-mailer':               { type: 'cylinder' },

  // ══════════════════════════════════════════════════════════════════════════
  // PHARMA
  // ══════════════════════════════════════════════════════════════════════════
  'medicine-box':              { type: 'box' },            // standard carton
  'supplement-box':            { type: 'slim-tall' },      // tall bottle carton
  'syrup-box':                 { type: 'slim-tall' },      // tall narrow
  'tablet-strip-box':          { type: 'slim-tall' },      // standard tuck-end carton
  'injection-box':             { type: 'open-grid-box' },
  'ointment-box':              { type: 'tray' },           // short wide tube box
  'surgical-box':              { type: 'open-mailer' },
  'vitamin-box':               { type: 'slim-tall' },      // tall supplement bottle
  'device-box':                { type: 'open-mailer' },

  // ══════════════════════════════════════════════════════════════════════════
  // COSMETIC
  // ══════════════════════════════════════════════════════════════════════════
  'perfume-box':               { type: 'slim-tall' },      // tall narrow elegant
  'cosmetic-box':              { type: 'box' },
  'serum-box':                 { type: 'slim-tall' },
  'foundation-box':            { type: 'slim-tall' },
  'eye-shadow-box':            { type: 'palette-box' },
  'nail-box':                  { type: 'slim-tall' },
  'hair-care-box':             { type: 'rigid-hinged' },
  'skincare-set-box':          { type: 'rigid-hinged' },
  'lipstick-box':              { type: 'slim-tall' },
  'body-lotion-box':           { type: 'open-flaps-box' },

  // ══════════════════════════════════════════════════════════════════════════
  // LUXURY
  // ══════════════════════════════════════════════════════════════════════════
  'luxury-rigid':              { type: 'box' },
  'watch-box':                 { type: 'rigid-clamshell' },
  'jewellery-box':             { type: 'tray' },           // flat hinged
  'ring-box':                  { type: 'box' },
  'spirits-box':               { type: 'slim-tall' },      // tall bottle sleeve
  'cigar-box':                 { type: 'tray' },           // flat cedar-lined
  'pen-box':                   { type: 'envelope' },       // long & very slim
  'scarf-box':                 { type: 'shallow-rigid-wrap' },
  'chocolate-luxury-box':      { type: 'tray' },
  'trophy-box':                { type: 'box' },
};

// ─── Public helper ────────────────────────────────────────────────────────────
export function getProductShape(productId?: string | null): ShapeConfig {
  if (!productId) return { type: 'box' };
  return shapeMap[productId] ?? { type: 'box' };
}
