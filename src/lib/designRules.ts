 
// ─── Product Types ───────────────────────────────────────────────────────────
export type ProductCategory =
  | 'food'
  | 'garment'
  | 'carriable'
  | 'electronics'
  | 'pouches'
  | 'ecommerce'
  | 'pharma'
  | 'cosmetic'
  | 'luxury';

export interface ProductType {
  id: string;
  name: string;
  category: ProductCategory;
  description: string;
  icon: string;
  defaultDimensions: BoxDimensions;
}

export const productTypes: ProductType[] = [
  // Food Industry
  { id: 'popcorn-box', name: 'Popcorn Box', category: 'food', description: 'Classic cinema-style popcorn packaging', icon: '🍿', defaultDimensions: { length: 10, width: 10, height: 18 } },
  { id: 'pizza-box', name: 'Pizza Box', category: 'food', description: 'Flat corrugated pizza packaging', icon: '🍕', defaultDimensions: { length: 30, width: 30, height: 5 } },
  { id: 'cake-box', name: 'Cake Box', category: 'food', description: 'Elegant cake & pastry packaging', icon: '🎂', defaultDimensions: { length: 25, width: 25, height: 15 } },
  { id: 'bakery-box', name: 'Bakery Box', category: 'food', description: 'Classic white bakery box', icon: '🥐', defaultDimensions: { length: 20, width: 20, height: 10 } },
  { id: 'biriyani-box', name: 'Biriyani Box', category: 'food', description: 'Sturdy takeaway biriyani container', icon: '🍲', defaultDimensions: { length: 16, width: 14, height: 3.5 } },
  { id: 'burger-box', name: 'Burger Box', category: 'food', description: 'Clamshell burger packaging', icon: '🍔', defaultDimensions: { length: 12, width: 12, height: 8 } },
  { id: 'cheese-box', name: 'Cheese Box', category: 'food', description: 'Premium cheese wedge/wheel box', icon: '🧀', defaultDimensions: { length: 14, width: 4, height: 14 } },
  { id: 'chicken-box', name: 'Chicken Box', category: 'food', description: 'Handled fried chicken meal box', icon: '🍗', defaultDimensions: { length: 20, width: 15, height: 12 } },
  { id: 'chocolate-box', name: 'Chocolate Box', category: 'food', description: 'Luxury assorted chocolates box', icon: '🍫', defaultDimensions: { length: 24, width: 16, height: 4 } },
  { id: 'cup-cake-box', name: 'Cup Cake Box', category: 'food', description: 'Box with inserts for cupcakes', icon: '🧁', defaultDimensions: { length: 18, width: 18, height: 10 } },
  { id: 'cookies-box', name: 'Cookies Box', category: 'food', description: 'Tin or board box for cookies', icon: '🍪', defaultDimensions: { length: 15, width: 15, height: 6 } },
  { id: 'dosa-box', name: 'Dosa Box', category: 'food', description: 'Long rectangular box for dosas', icon: '🥞', defaultDimensions: { length: 35, width: 12, height: 5 } },
  { id: 'dip-tea-box', name: 'Dip Tea Box', category: 'food', description: 'Small box for tea bag sachets', icon: '🫖', defaultDimensions: { length: 14, width: 8, height: 16 } },
  { id: 'dates-box', name: 'Dates Box', category: 'food', description: 'Premium box for premium dates', icon: '🌴', defaultDimensions: { length: 18, width: 12, height: 5 } },
  { id: 'fried-chicken-box', name: 'Fried Chicken Box', category: 'food', description: 'Bucket or handled box for chicken', icon: '🍗', defaultDimensions: { length: 16, width: 16, height: 18 } },
  { id: 'fancy-cake-box', name: 'Fancy Cake Box', category: 'food', description: 'Tall elegant box for tiered cakes', icon: '🎂', defaultDimensions: { length: 30, width: 30, height: 35 } },
  { id: 'fancy-tea-box', name: 'Fancy Tea Box', category: 'food', description: 'Premium tea packaging', icon: '🍵', defaultDimensions: { length: 8, width: 6, height: 14 } },
  { id: 'food-grade-box', name: 'Food Grade Box', category: 'food', description: 'Safe direct-contact food packaging', icon: '🍱', defaultDimensions: { length: 22, width: 16, height: 6 } },
  { id: 'french-fries-box', name: 'French Fries Box', category: 'food', description: 'Open top fry scoop box', icon: '🍟', defaultDimensions: { length: 8, width: 5, height: 12 } },
  { id: 'fresh-cream-cake-box', name: 'Fresh Cream Cake Box', category: 'food', description: 'Cooling-safe cake packaging', icon: '🍰', defaultDimensions: { length: 25, width: 25, height: 12 } },
  { id: 'hotdog-box', name: 'Hotdog Box', category: 'food', description: 'Long clamshell for hotdogs', icon: '🌭', defaultDimensions: { length: 22, width: 8, height: 6 } },
  { id: 'instant-food-box', name: 'Instant Food Box', category: 'food', description: 'Noodle or instant meal cup/box', icon: '🍜', defaultDimensions: { length: 16, width: 12, height: 4.5 } },
  { id: 'meal-box', name: 'Meal Box', category: 'food', description: 'Multi-compartment bento box', icon: '🍱', defaultDimensions: { length: 26, width: 20, height: 6 } },
  { id: 'meat-box', name: 'Meat Box', category: 'food', description: 'Frozen or fresh meat packaging', icon: '🥩', defaultDimensions: { length: 28, width: 20, height: 8 } },
  { id: 'nuts-spices-box', name: 'Nuts & Spices Box', category: 'food', description: 'Windowed box for dry fruits', icon: '🥜', defaultDimensions: { length: 10, width: 4.5, height: 14 } },
  { id: 'nuggets-box', name: 'Nuggets Box', category: 'food', description: 'Small folding carton for nuggets', icon: '🧆', defaultDimensions: { length: 12, width: 8, height: 5 } },
  { id: 'pastries-box', name: 'Pastries Box', category: 'food', description: 'Flat box for multiple pastries', icon: '🥐', defaultDimensions: { length: 25, width: 15, height: 6 } },
  { id: 'plum-cake-box', name: 'Plum Cake Box', category: 'food', description: 'Festive plum cake tin or box', icon: '🥮', defaultDimensions: { length: 10, width: 10, height: 5 } },
  { id: 'sandwich-box', name: 'Sandwich Box', category: 'food', description: 'Wedge-shaped sandwich pack', icon: '🥪', defaultDimensions: { length: 12, width: 6, height: 12 } },
  { id: 'savouries-box', name: 'Savouries Box', category: 'food', description: 'Box for traditional snacks', icon: '🥨', defaultDimensions: { length: 12, width: 6, height: 15 } },
  { id: 'sea-foods-box', name: 'Sea Foods Box', category: 'food', description: 'Moisture-resistant seafood box', icon: '🦐', defaultDimensions: { length: 30, width: 20, height: 10 } },
  { id: 'shawarma-box', name: 'Shawarma Box', category: 'food', description: 'Wrap or roll packaging box', icon: '🌯', defaultDimensions: { length: 25, width: 8, height: 6 } },
  { id: 'sweet-box', name: 'Sweet Box', category: 'food', description: 'Traditional mithai/sweet box', icon: '🍬', defaultDimensions: { length: 22, width: 16, height: 5 } },
  { id: 'tea-box', name: 'Tea Box', category: 'food', description: 'Loose leaf tea carton', icon: '☕', defaultDimensions: { length: 18, width: 10, height: 10 } },
  { id: 'triangular-cake-slice-box', name: 'Triangular Cake Slice Box', category: 'food', description: 'Individual cake slice container', icon: '🍰', defaultDimensions: { length: 12, width: 6, height: 14 } },
  // Garment
  { id: 'garment-box', name: 'Garment Box', category: 'garment', description: 'Premium clothing & apparel packaging', icon: '👔', defaultDimensions: { length: 35, width: 25, height: 6 } },
  { id: 'shirt-box', name: 'Shirt Box', category: 'garment', description: 'Folded shirt packaging', icon: '👕', defaultDimensions: { length: 38, width: 28, height: 5 } },
  { id: 'shoe-box', name: 'Shoe Box', category: 'garment', description: 'Footwear packaging', icon: '👟', defaultDimensions: { length: 33, width: 20, height: 12 } },
  { id: 'saree-box', name: 'Saree Box', category: 'garment', description: 'Elegant saree & ethnic wear packaging', icon: '🥻', defaultDimensions: { length: 45, width: 35, height: 6 } },
  { id: 'jacket-box', name: 'Jacket Box', category: 'garment', description: 'Large rigid box for jackets & coats', icon: '🧥', defaultDimensions: { length: 42, width: 32, height: 8 } },
  { id: 'trouser-box', name: 'Trouser Box', category: 'garment', description: 'Folded trousers & jeans packaging', icon: '👖', defaultDimensions: { length: 40, width: 30, height: 5 } },
  { id: 'lingerie-box', name: 'Lingerie Box', category: 'garment', description: 'Delicate innerwear gift packaging', icon: '🎀', defaultDimensions: { length: 26, width: 22, height: 6 } },
  { id: 'sports-box', name: 'Sports Wear Box', category: 'garment', description: 'Athletic & sportswear packaging', icon: '🏋️', defaultDimensions: { length: 35, width: 28, height: 7 } },
  { id: 'accessories-box', name: 'Accessories Box', category: 'garment', description: 'Belts, scarves & small accessories box', icon: '🧣', defaultDimensions: { length: 30, width: 12, height: 5 } },
  { id: 'hat-box', name: 'Hat Box', category: 'garment', description: 'Round or square cap & hat packaging', icon: '🎩', defaultDimensions: { length: 25, width: 25, height: 10 } },
  // Carriable
  { id: 'carrier-bag', name: 'Carrier Bag', category: 'carriable', description: 'Handled carry packaging', icon: '🛍️', defaultDimensions: { length: 18, width: 11, height: 15 } },
  { id: 'gift-box', name: 'Gift Box', category: 'carriable', description: 'Premium gift packaging with handle', icon: '🎁', defaultDimensions: { length: 20, width: 20, height: 20 } },
  { id: 'tote-bag', name: 'Tote Bag Box', category: 'carriable', description: 'Paper tote / shopping carry bag', icon: '👜', defaultDimensions: { length: 28, width: 10, height: 32 } },
  { id: 'window-box', name: 'Window Display Box', category: 'carriable', description: 'Box with transparent front panel', icon: '🪟', defaultDimensions: { length: 20, width: 8, height: 28 } },
  { id: 'hamper-box', name: 'Hamper Box', category: 'carriable', description: 'Large gift hamper basket box', icon: '🧺', defaultDimensions: { length: 40, width: 30, height: 15 } },
  { id: 'festival-box', name: 'Festival Gift Box', category: 'carriable', description: 'Decorative seasonal & festival packaging', icon: '🪔', defaultDimensions: { length: 20, width: 20, height: 8 } },
  { id: 'luxury-bag', name: 'Luxury Bag', category: 'carriable', description: 'Rope-handled premium paper carry bag', icon: '🛍️', defaultDimensions: { length: 22, width: 10, height: 28 } },
  { id: 'wedding-box', name: 'Wedding Gift Box', category: 'carriable', description: 'Elegant white & gold wedding packaging', icon: '💍', defaultDimensions: { length: 25, width: 25, height: 15 } },
  // Electronics
  { id: 'phone-box', name: 'Phone Box', category: 'electronics', description: 'Smartphone packaging', icon: '📱', defaultDimensions: { length: 16, width: 8, height: 5 } },
  { id: 'gadget-box', name: 'Gadget Box', category: 'electronics', description: 'Electronics & accessories packaging', icon: '🎧', defaultDimensions: { length: 6.5, width: 3, height: 14 } },
  { id: 'laptop-box', name: 'Laptop Box', category: 'electronics', description: 'Laptop & tablet shipping box', icon: '💻', defaultDimensions: { length: 40, width: 30, height: 8 } },
  { id: 'earbuds-box', name: 'Earbuds Box', category: 'electronics', description: 'Compact packaging for wireless earbuds', icon: '🎵', defaultDimensions: { length: 10, width: 5, height: 14 } },
  { id: 'smartwatch-box', name: 'Smartwatch Box', category: 'electronics', description: 'Rigid box for smartwatches & wearables', icon: '⌚', defaultDimensions: { length: 12, width: 12, height: 8 } },
  { id: 'charger-box', name: 'Charger Box', category: 'electronics', description: 'Small carton for chargers & cables', icon: '🔌', defaultDimensions: { length: 10, width: 8, height: 4 } },
  { id: 'camera-box', name: 'Camera Box', category: 'electronics', description: 'Rigid foam-insert box for cameras', icon: '📷', defaultDimensions: { length: 20, width: 16, height: 14 } },
  { id: 'tablet-box', name: 'Tablet Box', category: 'electronics', description: 'Slim packaging for tablets & e-readers', icon: '📟', defaultDimensions: { length: 30, width: 22, height: 4 } },
  { id: 'router-box', name: 'Router / IoT Box', category: 'electronics', description: 'Corrugated box for networking devices', icon: '📡', defaultDimensions: { length: 26, width: 18, height: 10 } },
  { id: 'gaming-box', name: 'Gaming Peripheral Box', category: 'electronics', description: 'Packaging for controllers, mice & keyboards', icon: '🎮', defaultDimensions: { length: 30, width: 20, height: 10 } },
  // Pouches
  { id: 'stand-pouch', name: 'Stand-Up Pouch', category: 'pouches', description: 'Flexible stand-up pouch packaging', icon: '🧴', defaultDimensions: { length: 10, width: 2, height: 15 } },
  { id: 'flat-pouch', name: 'Flat Pouch', category: 'pouches', description: 'Sealed flat pouch packaging', icon: '📩', defaultDimensions: { length: 18, width: 2, height: 24 } },
  { id: 'zip-pouch', name: 'Zip-Lock Pouch', category: 'pouches', description: 'Resealable zip-closure pouch', icon: '🤐', defaultDimensions: { length: 16, width: 2, height: 22 } },
  { id: 'spout-pouch', name: 'Spout Pouch', category: 'pouches', description: 'Liquid-fill pouch with spout cap', icon: '💧', defaultDimensions: { length: 14, width: 5, height: 20 } },
  { id: 'gusset-pouch', name: 'Side Gusset Pouch', category: 'pouches', description: 'Coffee & tea side-gusset bag', icon: '☕', defaultDimensions: { length: 15, width: 8, height: 26 } },
  { id: 'retort-pouch', name: 'Retort Pouch', category: 'pouches', description: 'Heat-resistant retort food pouch', icon: '🍲', defaultDimensions: { length: 18, width: 3, height: 24 } },
  { id: 'sachet-pouch', name: 'Sachet / Strip Pouch', category: 'pouches', description: 'Small single-use sachets & strips', icon: '🧂', defaultDimensions: { length: 8, width: 1, height: 12 } },
  { id: 'kraft-pouch', name: 'Kraft Paper Pouch', category: 'pouches', description: 'Eco-friendly kraft paper pouch', icon: '🌿', defaultDimensions: { length: 14, width: 6, height: 22 } },
  // E-Commerce
  { id: 'mailer-box', name: 'Mailer Box', category: 'ecommerce', description: 'Self-locking e-commerce mailer', icon: '📦', defaultDimensions: { length: 30, width: 22, height: 8 } },
  { id: 'shipping-box', name: 'Shipping Box', category: 'ecommerce', description: 'Heavy-duty corrugated shipping', icon: '🚚', defaultDimensions: { length: 40, width: 30, height: 25 } },
  { id: 'subscription-box', name: 'Subscription Box', category: 'ecommerce', description: 'Monthly subscription packaging', icon: '📬', defaultDimensions: { length: 28, width: 20, height: 10 } },
  { id: 'poly-mailer', name: 'Poly Mailer Bag', category: 'ecommerce', description: 'Lightweight plastic courier mailer bag', icon: '📮', defaultDimensions: { length: 35, width: 2, height: 45 } },
  { id: 'bubble-mailer', name: 'Bubble Mailer', category: 'ecommerce', description: 'Padded bubble wrap envelope mailer', icon: '🫧', defaultDimensions: { length: 28, width: 3, height: 38 } },
  { id: 'return-box', name: 'Easy-Return Box', category: 'ecommerce', description: 'Dual-use box for easy returns', icon: '↩️', defaultDimensions: { length: 30, width: 22, height: 10 } },
  { id: 'fragile-box', name: 'Fragile Item Box', category: 'ecommerce', description: 'Double-wall box with foam inserts', icon: '⚠️', defaultDimensions: { length: 32, width: 24, height: 10 } },
  { id: 'book-mailer', name: 'Book Mailer', category: 'ecommerce', description: 'Flat rigid mailer for books & documents', icon: '📚', defaultDimensions: { length: 32, width: 40, height: 8 } },
  { id: 'tube-mailer', name: 'Tube / Cylinder Mailer', category: 'ecommerce', description: 'Poster & document cylinder mailer', icon: '🗺️', defaultDimensions: { length: 8, width: 8, height: 50 } },
  // Pharma
  { id: 'medicine-box', name: 'Medicine Box', category: 'pharma', description: 'Pharmaceutical medicine packaging', icon: '💊', defaultDimensions: { length: 12, width: 6, height: 4 } },
  { id: 'supplement-box', name: 'Supplement Box', category: 'pharma', description: 'Health supplement packaging', icon: '🧬', defaultDimensions: { length: 10, width: 10, height: 14 } },
  { id: 'syrup-box', name: 'Syrup / Drop Box', category: 'pharma', description: 'Tall narrow box for syrup bottles', icon: '🩺', defaultDimensions: { length: 6, width: 6, height: 18 } },
  { id: 'tablet-strip-box', name: 'Tablet Strip Box', category: 'pharma', description: 'Slim carton for blister strip packs', icon: '💊', defaultDimensions: { length: 14, width: 8, height: 3 } },
  { id: 'injection-box', name: 'Injection Vial Box', category: 'pharma', description: 'Small rigid box for injection vials', icon: '💉', defaultDimensions: { length: 8, width: 5, height: 8 } },
  { id: 'ointment-box', name: 'Ointment / Cream Box', category: 'pharma', description: 'Short, wide box for tubes & tins', icon: '🧪', defaultDimensions: { length: 12, width: 5, height: 4 } },
  { id: 'surgical-box', name: 'Surgical Kit Box', category: 'pharma', description: 'Sterilization-grade surgical supplies box', icon: '🏥', defaultDimensions: { length: 25, width: 15, height: 8 } },
  { id: 'vitamin-box', name: 'Vitamin & Nutraceutical Box', category: 'pharma', description: 'Retail-ready supplement bottle packaging', icon: '🌿', defaultDimensions: { length: 10, width: 10, height: 16 } },
  { id: 'device-box', name: 'Medical Device Box', category: 'pharma', description: 'Rigid packaging for diagnostic devices', icon: '🔬', defaultDimensions: { length: 20, width: 14, height: 8 } },
  // Cosmetic
  { id: 'perfume-box', name: 'Perfume Box', category: 'cosmetic', description: 'Luxury perfume packaging', icon: '🌸', defaultDimensions: { length: 10, width: 10, height: 16 } },
  { id: 'cosmetic-box', name: 'Cosmetic Box', category: 'cosmetic', description: 'Beauty product packaging', icon: '💄', defaultDimensions: { length: 15, width: 12, height: 8 } },
  { id: 'serum-box', name: 'Serum Box', category: 'cosmetic', description: 'Tall slim box for skincare serums', icon: '✨', defaultDimensions: { length: 6, width: 6, height: 18 } },
  { id: 'foundation-box', name: 'Foundation Box', category: 'cosmetic', description: 'Compact box for foundation bottles', icon: '🪞', defaultDimensions: { length: 8, width: 5, height: 12 } },
  { id: 'eye-shadow-box', name: 'Eye Shadow Palette Box', category: 'cosmetic', description: 'Flat rectangular palette packaging', icon: '👁️', defaultDimensions: { length: 22, width: 14, height: 3 } },
  { id: 'nail-box', name: 'Nail Polish Box', category: 'cosmetic', description: 'Slim box for nail polish bottles', icon: '💅', defaultDimensions: { length: 5, width: 5, height: 12 } },
  { id: 'hair-care-box', name: 'Hair Care Box', category: 'cosmetic', description: 'Premium rigid box for hair care kits', icon: '💇', defaultDimensions: { length: 25, width: 25, height: 8 } },
  { id: 'skincare-set-box', name: 'Skincare Set Box', category: 'cosmetic', description: 'Multi-product gift set packaging', icon: '🧴', defaultDimensions: { length: 28, width: 20, height: 10 } },
  { id: 'lipstick-box', name: 'Lipstick Box', category: 'cosmetic', description: 'Small tall box for lipstick & gloss', icon: '💋', defaultDimensions: { length: 4, width: 4, height: 10 } },
  { id: 'body-lotion-box', name: 'Body Lotion Box', category: 'cosmetic', description: 'Wide box for lotion & body butter jars', icon: '🛁', defaultDimensions: { length: 7.2, width: 7.2, height: 22 } },
  // Luxury
  { id: 'luxury-rigid', name: 'Luxury Rigid Box', category: 'luxury', description: 'Premium rigid box with magnetic closure', icon: '💎', defaultDimensions: { length: 20, width: 15, height: 10 } },
  { id: 'watch-box', name: 'Watch Box', category: 'luxury', description: 'Cushioned rigid box for luxury watches', icon: '⌚', defaultDimensions: { length: 14, width: 12, height: 9 } },
  { id: 'jewellery-box', name: 'Jewellery Box', category: 'luxury', description: 'Velvet-lined rigid box for fine jewellery', icon: '💍', defaultDimensions: { length: 18, width: 12, height: 6 } },
  { id: 'ring-box', name: 'Ring Box', category: 'luxury', description: 'Small hinged box for rings', icon: '💍', defaultDimensions: { length: 5, width: 5, height: 5 } },
  { id: 'spirits-box', name: 'Spirits / Wine Box', category: 'luxury', description: 'Tall sleeve or carry-box for bottles', icon: '🍾', defaultDimensions: { length: 12, width: 12, height: 38 } },
  { id: 'cigar-box', name: 'Cigar Humidor Box', category: 'luxury', description: 'Cedar-lined premium cigar packaging', icon: '🤵', defaultDimensions: { length: 25, width: 18, height: 7 } },
  { id: 'pen-box', name: 'Luxury Pen Box', category: 'luxury', description: 'Slim rigid box for premium pens', icon: '🖊️', defaultDimensions: { length: 20, width: 5, height: 4 } },
  { id: 'scarf-box', name: 'Luxury Scarf Box', category: 'luxury', description: 'Flat rigid box for scarves & silk ties', icon: '🧣', defaultDimensions: { length: 26, width: 17, height: 2.5 } },
  { id: 'chocolate-luxury-box', name: 'Luxury Chocolate Box', category: 'luxury', description: 'Premium handmade chocolates packaging', icon: '🍫', defaultDimensions: { length: 24, width: 18, height: 5 } },
  { id: 'trophy-box', name: 'Trophy / Award Box', category: 'luxury', description: 'Presentation box for awards & trophies', icon: '🏆', defaultDimensions: { length: 22, width: 22, height: 22 } },
];

// ─── Industries ──────────────────────────────────────────────────────────────
export type Industry =
  | 'food'
  | 'pharma'
  | 'cosmetic'
  | 'garment'
  | 'ecommerce'
  | 'electronics';

export interface IndustryInfo {
  value: Industry;
  label: string;
  icon: string;
  color: string;
}

export const industries: IndustryInfo[] = [
  { value: 'food', label: 'Food & Beverage', icon: '🍔', color: '#FF6B35' },
  { value: 'pharma', label: 'Pharmaceutical', icon: '💊', color: '#2E86C1' },
  { value: 'cosmetic', label: 'Cosmetic & Beauty', icon: '💄', color: '#E91E8C' },
  { value: 'garment', label: 'Garment & Fashion', icon: '👔', color: '#8B5CF6' },
  { value: 'ecommerce', label: 'E-Commerce', icon: '📦', color: '#F59E0B' },
  { value: 'electronics', label: 'Electronics', icon: '🔌', color: '#10B981' },
];

// ─── Design Configs ──────────────────────────────────────────────────────────
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
  garment: [
    { colors: ['#1A1A2E', '#E0E0E0'], font: 'clean', layout: 'center', styleName: 'Modern Mono' },
    { colors: ['#2C3E50', '#BDC3C7'], font: 'elegant', layout: 'minimal', styleName: 'Urban Edge' },
    { colors: ['#4A0E4E', '#F0E6F3'], font: 'elegant', layout: 'top', styleName: 'Fashion Forward' },
  ],
  ecommerce: [
    { colors: ['#FF9800', '#FFF3E0'], font: 'bold', layout: 'center', styleName: 'Unbox Joy' },
    { colors: ['#795548', '#D7CCC8'], font: 'clean', layout: 'top', styleName: 'Kraft Natural' },
    { colors: ['#E91E63', '#FCE4EC'], font: 'bold', layout: 'minimal', styleName: 'Pop Ship' },
  ],
  electronics: [
    { colors: ['#0D1117', '#58A6FF'], font: 'clean', layout: 'center', styleName: 'Tech Noir' },
    { colors: ['#1E3A5F', '#A8D8EA'], font: 'clean', layout: 'top', styleName: 'Circuit Blue' },
    { colors: ['#2D2D2D', '#00E676'], font: 'clean', layout: 'minimal', styleName: 'Neon Pulse' },
  ],
};

// ─── Box Dimensions ──────────────────────────────────────────────────────────
export interface BoxDimensions {
  length: number;
  width: number;
  height: number;
}

// ─── Application State ───────────────────────────────────────────────────────
export interface PackagingState {
  selectedProduct: ProductType | null;
  dimensions: BoxDimensions;
  productName: string;
  industry: Industry;
  logoUrl: string | null;
  logoFile: File | null;
  designFile: File | null;
  designFileUrl: string | null;
  colorPreference: string;
  notes: string;
  activeDesign: DesignConfig | null;
  variations: DesignConfig[];
}

export const defaultState: PackagingState = {
  selectedProduct: null,
  dimensions: { length: 10, width: 8, height: 6 },
  productName: '',
  industry: 'food',
  logoUrl: null,
  logoFile: null,
  designFile: null,
  designFileUrl: null,
  colorPreference: '',
  notes: '',
  activeDesign: null,
  variations: [],
};

// ─── Category grouping helper ────────────────────────────────────────────────
export const productCategories: { category: ProductCategory; label: string; icon: string }[] = [
  { category: 'food', label: 'Food Industry', icon: '🍔' },
  { category: 'garment', label: 'Garment', icon: '👔' },
  { category: 'carriable', label: 'Carriable', icon: '🛍️' },
  { category: 'electronics', label: 'Electronics', icon: '🔌' },
  { category: 'pouches', label: 'Pouches', icon: '🧴' },
  { category: 'ecommerce', label: 'E-Commerce', icon: '📦' },
  { category: 'pharma', label: 'Pharma', icon: '💊' },
  { category: 'cosmetic', label: 'Cosmetic', icon: '💄' },
  { category: 'luxury', label: 'Luxury', icon: '💎' },
];

export function getProductsByCategory(category: ProductCategory): ProductType[] {
  return productTypes.filter((p) => p.category === category);
}

// ── Legacy compat ────────────────────────────────────────────────────────────
export type BoxType = string;
export const boxTypes = productTypes.map((p) => ({
  id: p.id as BoxType,
  name: p.name,
  description: p.description,
  icon: p.icon,
}));
