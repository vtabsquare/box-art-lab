import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, Package } from 'lucide-react';
import {
  ProductType,
  ProductCategory,
  productCategories,
  getProductsByCategory,
} from '@/lib/designRules';

const getBackgroundImage = (productName: string) => {
  // Exact product name → dedicated background image
  const mapping: Record<string, string> = {
    // ─── Food Industry ───
    'Popcorn Box': '/images/popcorn-box.webp',
    'Pizza Box': '/images/pizza-box.webp',
    'Cake Box': '/images/cake-box.webp',
    'Bakery Box': '/images/bakery-box.webp',
    'Biriyani Box': '/images/briyani-box.webp',
    'Burger Box': '/images/burger-box.webp',
    'Cheese Box': '/images/cheese-box.webp',
    'Chicken Box': '/images/chicken-box.webp',
    'Chocolate Box': '/images/chocolate-box.webp',
    'Cup Cake Box': '/images/cup-cake-box.webp',
    'Cookies Box': '/images/cookies-box.webp',
    'Dosa Box': '/images/dosa-box.webp',
    'Dip Tea Box': '/images/diptea-box.webp',
    'Dates Box': '/images/dates-box.webp',
    'Fried Chicken Box': '/images/fried-chicken-box.webp',
    'Fancy Cake Box': '/images/fancy-cake-box.webp',
    'Fancy Tea Box': '/images/fancytea-box.webp',
    'Food Grade Box': '/images/foodgrade-box.webp',
    'French Fries Box': '/images/french-fries-box.webp',
    'Fresh Cream Cake Box': '/images/cream-cake-box.webp',
    'Hotdog Box': '/images/hot-dog-box.webp',
    'Instant Food Box': '/images/instant-food-box.webp',
    'Meal Box': '/images/meal-box.webp',
    'Meat Box': '/images/meat-box.webp',
    'Nuts & Spices Box': '/images/nuts-and-spices-box.webp',
    'Nuggets Box': '/images/nuggets-box.webp',
    'Pastries Box': '/images/pastries-box.webp',
    'Plum Cake Box': '/images/plumcake-box.webp',
    'Sandwich Box': '/images/sandwich-box.webp',
    'Savouries Box': '/images/snacks-box.webp',
    'Sea Foods Box': '/images/sea-food-box.webp',
    'Shawarma Box': '/images/shawarma-box.webp',
    'Sweet Box': '/images/sweet-box.webp',
    'Tea Box': '/images/tea-box.webp',
    'Triangular Cake Slice Box': '/images/triangle-cake-box.webp',
    // ─── Garment ───
    'Garment Box': '/images/garment-box.jpeg',
    'Shirt Box': '/images/shirt-box.jpeg',
    'Shoe Box': '/images/shoe-box.jpeg',
    'Saree Box': '/images/saree-box.jpeg',
    'Jacket Box': '/images/jacket-box.jpeg',
    'Trouser Box': '/images/trouser-box.jpeg',
    'Lingerie Box': '/images/lingerie-box.jpeg',
    'Sports Wear Box': '/images/sports-wear-box.jpg',
    'Accessories Box': '/images/accessories-box.jpeg',
    'Hat Box': '/images/hat-box.jpeg',
    // ─── Carriable ───
    'Carrier Bag': '/images/carrier-box.jpeg',
    'Gift Box': '/images/gift-box.jpeg',
    'Tote Bag Box': '/images/tote-bag-box.jpeg',
    'Window Display Box': '/images/window-display-box.jpeg',
    'Hamper Box': '/images/hamper-box.jpeg',
    'Festival Gift Box': '/images/festival-gift-box.jpeg',
    'Luxury Bag': '/images/luxury-bag-box.jpeg',
    'Wedding Gift Box': '/images/wedding-gift-box.jpeg',
    // ─── Electronics ───
    'Phone Box': '/images/phone-box.jpeg',
    'Gadget Box': '/images/gadget-box.jpeg',
    'Laptop Box': '/images/laptop-box.jpeg',
    'Earbuds Box': '/images/earbuds-box.jpeg',
    'Smartwatch Box': '/images/smartwatch-box.jpeg',
    'Charger Box': '/images/charger-box.jpeg',
    'Camera Box': '/images/camera-box.jpeg',
    'Tablet Box': '/images/tablet-box.jpg',
    'Router / IoT Box': '/images/router-iot-box.jpeg',
    'Gaming Peripheral Box': '/images/gaming-pheripherals-box.jpeg',
    // ─── Pouches ───
    'Stand-Up Pouch': '/images/stand-up-pouch.jpeg',
    'Flat Pouch': '/images/flat-pouch.jpeg',
    'Zip-Lock Pouch': '/images/zip-lock-pouch.jpeg',
    'Spout Pouch': '/images/spout-pouch.jpeg',
    'Side Gusset Pouch': '/images/side-gusset-pouch.jpeg',
    'Retort Pouch': '/images/retort-pouch.jpeg',
    'Sachet / Strip Pouch': '/images/sachet-strip-pouch.jpeg',
    'Kraft Paper Pouch': '/images/kraft-paper-pouch.jpeg',
    // ─── E-Commerce ───
    'Mailer Box': '/images/mailer-box.jpeg',
    'Shipping Box': '/images/shipping-box.jpeg',
    'Subscription Box': '/images/subscription-box.jpeg',
    'Poly Mailer Bag': '/images/poly-mailer-bag.jpeg',
    'Bubble Mailer': '/images/bubble-mailer-bag.jpeg',
    'Easy-Return Box': '/images/easy-return-box.jpeg',
    'Fragile Item Box': '/images/fragile-item-box.jpeg',
    'Book Mailer': '/images/book-mailer-box.jpeg',
    'Tube / Cylinder Mailer': '/images/cylinder-mailer-box.jpeg',
    // ─── Pharma ───
    'Medicine Box': '/images/medicine-box.jpeg',
    'Supplement Box': '/images/supplement-box.jpeg',
    'Syrup / Drop Box': '/images/syrup-drop-box.jpeg',
    'Tablet Strip Box': '/images/tablet-strip-box.jpeg',
    'Injection Vial Box': '/images/injection-vial-box.jpeg',
    'Ointment / Cream Box': '/images/ointment-cream-box.jpeg',
    'Surgical Kit Box': '/images/surgical-kit-box.jpeg',
    'Vitamin & Nutraceutical Box': '/images/vitamin-box.jpeg',
    'Medical Device Box': '/images/medical-device-box.jpeg',
    // ─── Cosmetic ───
    'Perfume Box': '/images/perfume-box.jpeg',
    'Cosmetic Box': '/images/cosmetic-box.jpeg',
    'Serum Box': '/images/serum-box.jpeg',
    'Foundation Box': '/images/foundation-box.jpeg',
    'Eye Shadow Palette Box': '/images/eye-shadow-palette-box.jpeg',
    'Nail Polish Box': '/images/nail-polish-box.jpeg',
    'Hair Care Box': '/images/hair-care-box.jpeg',
    'Skincare Set Box': '/images/skin-care-set-box.jpeg',
    'Lipstick Box': '/images/lipstick-box.jpeg',
    'Body Lotion Box': '/images/body-lotion-box.jpeg',
    // ─── Luxury ───
    'Luxury Rigid Box': '/images/luxury-rigid-box.jpeg',
    'Watch Box': '/images/watch-box.jpeg',
    'Jewellery Box': '/images/jewellery-box.jpeg',
    'Ring Box': '/images/ring-box.jpeg',
    'Spirits / Wine Box': '/images/spirits-wine-box.jpeg',
    'Cigar Humidor Box': '/images/cigar-box.jpeg',
    'Luxury Pen Box': '/images/pen-box.jpeg',
    'Luxury Scarf Box': '/images/scarf-box.jpeg',
    'Luxury Chocolate Box': '/images/luxury-chocolate-box.jpeg',
    'Trophy / Award Box': '/images/award-box.webp',
  };

  return mapping[productName] || 'https://images.unsplash.com/photo-1605000797499-95a51c5269ae?q=80&w=800&auto=format&fit=crop';
};

interface ProductSelectorProps {
  selectedProduct: ProductType | null;
  onSelect: (product: ProductType) => void;
}

const ProductSelector = ({ selectedProduct, onSelect }: ProductSelectorProps) => {
  const [activeCategory, setActiveCategory] = useState<ProductCategory>('food');
  const products = getProductsByCategory(activeCategory);

  return (
    <section id="products" className="py-24 px-6 relative">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/3 right-0 w-[400px] h-[400px] rounded-full bg-amber-500/[0.03] blur-[140px]" />
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <p className="section-label mb-4">Choose Your Product</p>
          <h2 className="section-title mb-4">Packaging Collection</h2>
          <p className="text-muted-foreground text-base md:text-lg max-w-2xl mx-auto font-body">
            Select a product type to start customizing. We offer packaging for every industry.
          </p>
        </motion.div>

        {/* Category Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-12 w-full overflow-x-auto pb-4 hide-scrollbar px-4 sm:px-6"
        >
          <div className="flex items-center gap-2 p-2 bg-black/5 dark:bg-white/[0.03] backdrop-blur-xl rounded-[1.5rem] border border-black/5 dark:border-white/5 shadow-inner w-max mx-auto">
            {productCategories.map((cat) => {
              const isActive = activeCategory === cat.category;
              return (
                <button
                  key={cat.category}
                  onClick={() => setActiveCategory(cat.category)}
                  className={`relative flex items-center gap-2.5 px-6 py-3 rounded-xl text-sm font-body transition-colors duration-300 z-10 outline-none ${
                    isActive
                      ? 'text-white font-semibold'
                      : 'text-muted-foreground font-medium hover:text-foreground hover:bg-black/5 dark:hover:bg-white/5'
                  }`}
                >
                  {isActive && (
                    <motion.div
                      layoutId="activeCategoryIndicator"
                      className="absolute inset-0 bg-gradient-to-r from-amber-500 to-orange-500 rounded-xl shadow-[0_4px_20px_-5px_rgba(245,158,11,0.5)] border border-amber-400/40"
                      transition={{ type: "spring", stiffness: 400, damping: 30 }}
                      style={{ zIndex: -1 }}
                    />
                  )}
                  <span className={`text-lg transition-transform duration-300 ${isActive ? 'scale-110 drop-shadow-md' : 'grayscale-[50%] opacity-60'}`}>
                    {cat.icon}
                  </span>
                  <span className="whitespace-nowrap tracking-wide">
                    {cat.label}
                  </span>
                </button>
              );
            })}
          </div>
        </motion.div>

        {/* Products Grid */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeCategory}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5"
          >
            {products.map((product, i) => {
              const isSelected = selectedProduct?.id === product.id;
              return (
                <motion.button
                  key={product.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.04 }}
                  onClick={() => onSelect(product)}
                  className={`relative group cursor-pointer overflow-hidden rounded-[1.5rem] transition-all duration-500 text-left min-h-[260px] ${
                    isSelected
                      ? 'shadow-[0_0_40px_-10px_hsl(38_90%_55%/0.4)] ring-2 ring-amber-500'
                      : 'hover:shadow-2xl ring-1 ring-white/10 hover:ring-amber-500/50'
                  }`}
                >
                  {/* Background Image */}
                  <div 
                    className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
                    style={{ backgroundImage: `url(${getBackgroundImage(product.name)})` }}
                  />
                  
                  {/* Overlay gradient to ensure text readability */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/70 to-black/20 group-hover:via-black/60 transition-colors duration-500" />
                  
                  {/* Decorative hover tint */}
                  <div className="absolute inset-0 bg-amber-500/0 group-hover:bg-amber-500/10 transition-colors duration-500 mix-blend-overlay" />
                  
                  {/* Selected indicator */}
                  {isSelected && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="absolute top-4 right-4 w-7 h-7 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center z-10 shadow-[0_0_15px_rgba(245,158,11,0.5)] border border-amber-200/50"
                    >
                      <Check className="w-4 h-4 text-amber-950" strokeWidth={3} />
                    </motion.div>
                  )}

                  <div className="p-5 flex flex-col h-full relative z-10">
                    <div className="flex items-start justify-end mb-auto pb-4">
                      {!isSelected && (
                        <div className="w-8 h-8 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center text-white/70 group-hover:bg-amber-500/30 group-hover:text-amber-400 transition-colors opacity-0 group-hover:opacity-100 border border-white/10">
                          <Package className="w-4 h-4" />
                        </div>
                      )}
                    </div>

                    <h3 className="font-heading text-lg font-bold text-white mb-1.5 group-hover:text-amber-400 transition-colors tracking-tight drop-shadow-md">
                      {product.name}
                    </h3>
                    
                    <p className="text-white/70 text-xs font-body leading-relaxed mb-5 line-clamp-2 drop-shadow-sm">
                      {product.description}
                    </p>
                    
                    <div className="pt-3 border-t border-white/10 flex items-center justify-between">
                      <div className="flex gap-1.5">
                        <span className="text-[9px] font-mono tracking-wider font-semibold text-white/80 bg-white/10 border border-white/10 px-2 py-1 rounded backdrop-blur-md">
                          L: {product.defaultDimensions.length}
                        </span>
                        <span className="text-[9px] font-mono tracking-wider font-semibold text-white/80 bg-white/10 border border-white/10 px-2 py-1 rounded backdrop-blur-md">
                          W: {product.defaultDimensions.width}
                        </span>
                        <span className="text-[9px] font-mono tracking-wider font-semibold text-white/80 bg-white/10 border border-white/10 px-2 py-1 rounded backdrop-blur-md">
                          H: {product.defaultDimensions.height}
                        </span>
                      </div>
                    </div>
                  </div>
                </motion.button>
              );
            })}
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
};

export default ProductSelector;
