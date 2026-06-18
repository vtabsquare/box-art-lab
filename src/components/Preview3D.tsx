import { useRef, useMemo, useState, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Environment, ContactShadows, Float, Bounds, useBounds } from '@react-three/drei';
import { OrbitControls as OrbitControlsImpl } from 'three-stdlib';
import * as THREE from 'three';
import { BoxDimensions, ProductType, productTypes } from '@/lib/designRules';
import { RotateCcw, Lightbulb, Axis3d } from 'lucide-react';

import { PopcornBox } from './models/PopcornBox';
import { PizzaBox } from './models/PizzaBox';
import { CarrierBoxPremium } from './models/CarrierBoxPremium';
import { GiftBoxPremium } from './models/GiftBoxPremium';
import { LingerieBox } from './models/LingerieBox';
import { HexagonHatBox } from './models/HexagonHatBox';
import { SareeBox } from './models/SareeBox';
import { GarmentBox } from './models/GarmentBox';
import { ShirtBox } from './models/ShirtBox';
import { ShoeBoxPremium } from './models/ShoeBoxPremium';
import { PhoneBoxPremium } from './models/PhoneBoxPremium';
import { GadgetBoxPremium } from './models/GadgetBoxPremium';
import { LaptopBoxPremium } from './models/LaptopBoxPremium';
import { StandUpPouchPremium } from './models/StandUpPouchPremium';
import { FlatPouchPremium } from './models/FlatPouchPremium';
import { MailerBoxPremium } from './models/MailerBoxPremium';
import { ShippingBoxPremium } from './models/ShippingBoxPremium';
import { SubscriptionBoxPremium } from './models/SubscriptionBoxPremium';
import { PerfumeBox } from './models/PerfumeBox';
import { CakeBox } from './models/CakeBox';
import { BakeryBox } from './models/BakeryBox';
import { BurgerBox } from './models/BurgerBox';
import { BiriyaniBox } from './models/BiriyaniBox';
import { CheeseBox } from './models/CheeseBox';
import { ChickenBox } from './models/ChickenBox';
import { ChocolateBox } from './models/ChocolateBox';
import { CupCakeBox } from './models/CupCakeBox';
import { CookiesBox } from './models/CookiesBox';
import { DosaBox } from './models/DosaBox';
import { DipTeaBox } from './models/DipTeaBox';
import { DatesBox } from './models/DatesBox';
import { FriedChickenBox } from './models/FriedChickenBox';
import { FancyCakeBox } from './models/FancyCakeBox';
import { FrenchFriesBox } from './models/FrenchFriesBox';
import { HotdogBox } from './models/HotdogBox';
import { MealBox } from './models/MealBox';
import { NutsSpicesBox } from './models/NutsSpicesBox';
import { NuggetsBox } from './models/NuggetsBox';
import { PastriesBox } from './models/PastriesBox';
import { PlumCakeBox } from './models/PlumCakeBox';
import { SandwichBox } from './models/SandwichBox';
import { SavouriesBox } from './models/SavouriesBox';
import { SeaFoodBox } from './models/SeaFoodBox';
import { ShawarmaBox } from './models/ShawarmaBox';
import { TeaBox } from './models/TeaBox';
import { TriangularCakeBox } from './models/TriangularCakeBox';
import {
  StandardBox,
  MailerBox,
  ShoeBox,
  FlatPouch,
  LuxuryRigidBox,
  MedicineBox,
} from './models/SecondaryModels';
import { WatchBox } from './models/WatchBox';
import { JewelleryBox } from './models/JewelleryBox';
import { RingBox } from './models/RingBox';
import { SpiritsBox } from './models/SpiritsBox';
import { CigarBox } from './models/CigarBox';
import { LuxuryPenBox } from './models/LuxuryPenBox';
import { LuxuryScarfBox } from './models/LuxuryScarfBox';
import { LuxuryChocolateBox } from './models/LuxuryChocolateBox';
import { TrophyBox } from './models/TrophyBox';
import { InjectionBox } from './models/InjectionBox';
import { SurgicalBox } from './models/SurgicalBox';
import { BubbleMailer } from './models/BubbleMailer';
import { PolyMailer } from './models/PolyMailer';
import { ZipLockPouch } from './models/ZipLockPouch';
import { SpoutPouch } from './models/SpoutPouch';
import { SideGussetPouch } from './models/SideGussetPouch';
import { RetortPouch } from './models/RetortPouch';
import { SachetPouch } from './models/SachetPouch';
import { ToteBag } from './models/ToteBag';
import { WindowBox } from './models/WindowBox';
import { HamperBox } from './models/HamperBox';
import { LuxuryBag } from './models/LuxuryBag';
import { WeddingBox } from './models/WeddingBox';
import { FestivalGiftBox } from './models/FestivalGiftBox';
import { KraftPouch } from './models/KraftPouch';
import { FragileBox } from './models/FragileBox';
import { BookMailer } from './models/BookMailer';
import { TubeMailer } from './models/TubeMailer';
import { EasyReturnBox } from './models/EasyReturnBox';
import { BodyLotionBox } from './models/BodyLotionBox';

interface ProductModelProps {
  productId: string | null;
  dimensions: BoxDimensions;
  textureUrl: string | null;
  bgTextureUrl?: string | null;
  activeFaces?: Record<string, boolean>;
  colorPreference: string;
  autoRotate: boolean;
}

const ProductModel = ({ productId, dimensions, textureUrl, bgTextureUrl, activeFaces, colorPreference, autoRotate }: ProductModelProps) => {
  const color = colorPreference || '#888888';
  const props = { color, autoRotate, textureUrl, bgTextureUrl, activeFaces };

  // Find the default dimensions for this product to compute scale ratios
  const defaultDims = useMemo(() => {
    if (!productId) return { length: 10, width: 10, height: 10 };
    const product = productTypes.find((p: ProductType) => p.id === productId);
    return product?.defaultDimensions || { length: 10, width: 10, height: 10 };
  }, [productId]);

  // Compute per-axis scale ratios relative to default dimensions
  // This makes the box actually change shape, not just zoom
  const scaleRatios = useMemo(() => {
    const ratioL = dimensions.length / defaultDims.length;
    const ratioW = dimensions.width / defaultDims.width;
    const ratioH = dimensions.height / defaultDims.height;
    return { x: ratioL, y: ratioH, z: ratioW };
  }, [dimensions, defaultDims]);

  // Overall scale to fit the model nicely in the viewport
  const baseScale = useMemo(() => {
    const maxDim = Math.max(dimensions.length, dimensions.width, dimensions.height);
    return Math.min(1.4, 12 / maxDim);
  }, [dimensions]);

  const model = useMemo(() => {
    const p = { color, autoRotate, textureUrl, bgTextureUrl, activeFaces };
    switch (productId) {
      case 'popcorn-box':
        return <PopcornBox {...p} />;
      case 'pizza-box':
        return <PizzaBox {...p} />;
      case 'burger-box':
        return <BurgerBox {...p} />;
      case 'biriyani-box':
        return <BiriyaniBox {...p} />;
      case 'bakery-box':
        return <BakeryBox {...p} />;
      case 'fancy-cake-box':
        return <FancyCakeBox {...p} />;
      case 'cake-box':
      case 'fresh-cream-cake-box':
      case 'pastries-box':
        return <PastriesBox {...p} />;
      case 'plum-cake-box':
        return <PlumCakeBox {...p} />;
      case 'cup-cake-box':
        return <CupCakeBox {...p} />;
      case 'cheese-box':
        return <CheeseBox {...p} />;
      case 'chicken-box':
        return <ChickenBox {...p} />;
      case 'fried-chicken-box':
        return <FriedChickenBox {...p} />;
      case 'chocolate-luxury-box':
        return <LuxuryChocolateBox {...p} />;
      case 'chocolate-box':
        return <ChocolateBox {...p} />;
      case 'cookies-box':
        return <CookiesBox {...p} />;
      case 'dosa-box':
        return <DosaBox {...p} />;
      case 'french-fries-box':
        return <FrenchFriesBox {...p} />;
      case 'hotdog-box':
        return <HotdogBox {...p} />;
      case 'meal-box':
        return <MealBox {...p} />;
      case 'nuts-spices-box':
        return <NutsSpicesBox {...p} />;
      case 'poly-mailer':
        return <PolyMailer {...p} />;
      case 'bubble-mailer':
        return <BubbleMailer {...p} />;
      case 'nuggets-box':
      case 'instant-food-box':
      case 'meat-box':
      case 'sweet-box':
        return <NuggetsBox {...p} />;
      case 'sea-foods-box':
        return <SeaFoodBox {...p} />;
      case 'sandwich-box':
        return <SandwichBox {...p} />;
      case 'savouries-box':
        return <SavouriesBox {...p} />;
      case 'dip-tea-box':
      case 'fancy-tea-box':
        return <DipTeaBox {...p} />;
      case 'tea-box':
        return <TeaBox {...p} />;
      case 'shawarma-box':
        return <ShawarmaBox {...p} />;
      case 'triangular-cake-slice-box':
        return <TriangularCakeBox {...p} />;
      case 'dates-box':
        return <DatesBox {...p} />;
      case 'carrier-bag':
        return <CarrierBoxPremium {...p} />;
      case 'gift-box':
        return <GiftBoxPremium {...p} />;
      case 'saree-box':
        return <SareeBox {...p} />;
      case 'lingerie-box':
        return <LingerieBox {...p} />;
      case 'hat-box':
        return <HexagonHatBox {...p} />;
      case 'jacket-box':
        return <MailerBoxPremium {...p} />;
      case 'garment-box':
        return <GarmentBox {...p} />;
      case 'shirt-box':
        return <ShirtBox {...p} />;
      case 'shoe-box':
        return <ShoeBoxPremium {...p} />;
      case 'phone-box':
        return <PhoneBoxPremium {...p} />;
      case 'gadget-box':
        return <GadgetBoxPremium {...p} />;
      case 'laptop-box':
        return <LaptopBoxPremium {...p} />;
      case 'stand-pouch':
        return <StandUpPouchPremium {...p} />;
      case 'flat-pouch':
        return <FlatPouchPremium {...p} />;
      case 'mailer-box':
        return <MailerBoxPremium {...p} />;
      case 'shipping-box':
        return <ShippingBoxPremium {...p} />;
      case 'subscription-box':
        return <SubscriptionBoxPremium {...p} />;
      case 'medicine-box':
        return <MedicineBox {...p} />;
      case 'injection-box':
        return <InjectionBox {...p} />;
      case 'surgical-box':
      case 'device-box':
        return <SurgicalBox {...p} />;
      case 'supplement-box':
        return <StandardBox {...p} dimensions={[0.7, 1.1, 0.7]} />;
      case 'perfume-box':
        return <PerfumeBox {...p} />;
      case 'tube-mailer':
        return <TubeMailer {...p} />;
      case 'cosmetic-box':
        return <StandardBox {...p} dimensions={[0.9, 0.55, 0.75]} />;
      case 'luxury-rigid':
        return <LuxuryRigidBox {...p} />;
      case 'watch-box':
      case 'smartwatch-box':
        return <WatchBox {...p} />;
      case 'jewellery-box':
        return <JewelleryBox {...p} />;
      case 'ring-box':
        return <RingBox {...p} />;
      case 'spirits-box':
        return <SpiritsBox {...p} />;
      case 'cigar-box':
        return <CigarBox {...p} />;
      case 'pen-box':
        return <LuxuryPenBox {...p} />;
      case 'scarf-box':
        return <LuxuryScarfBox {...p} />;
      case 'trophy-box':
        return <TrophyBox {...p} />;
      case 'zip-pouch':
        return <ZipLockPouch {...p} />;
      case 'spout-pouch':
        return <SpoutPouch {...p} />;
      case 'gusset-pouch':
        return <SideGussetPouch {...p} />;
      case 'retort-pouch':
        return <RetortPouch {...p} />;
      case 'sachet-pouch':
        return <SachetPouch {...p} />;
      case 'tote-bag':
        return <ToteBag {...p} />;
      case 'window-box':
        return <WindowBox {...p} />;
      case 'hamper-box':
        return <HamperBox {...p} />;
      case 'luxury-bag':
        return <LuxuryBag {...p} />;
      case 'wedding-box':
        return <WeddingBox {...p} />;
      case 'festival-box':
        return <FestivalGiftBox {...p} />;
      case 'kraft-pouch':
        return <KraftPouch {...p} />;
      case 'fragile-box':
        return <FragileBox {...p} />;
      case 'book-mailer':
        return <BookMailer {...p} />;
      case 'return-box':
        return <EasyReturnBox {...p} />;
      case 'body-lotion-box':
        return <BodyLotionBox {...p} />;
      default:
        // Fallback: dimension-based generic box
        return <StandardBox {...p} dimensions={[
          dimensions.length * 0.07,
          dimensions.height * 0.07,
          dimensions.width * 0.07,
        ]} />;
    }
  }, [productId, color, autoRotate, textureUrl, bgTextureUrl, activeFaces, dimensions]);

  return (
    <group scale={[
      baseScale * scaleRatios.x,
      baseScale * scaleRatios.y,
      baseScale * scaleRatios.z
    ]}>
      {model}
    </group>
  );
};

const FitBounds = ({ dimensions }: { dimensions: BoxDimensions }) => {
  const bounds = useBounds();
  useEffect(() => {
    // Refresh bounds calculation and fit to screen
    bounds.refresh().clip().fit();
  }, [dimensions, bounds]);
  return null;
};

interface Preview3DProps {
  dimensions: BoxDimensions;
  textureUrl: string | null;
  bgTextureUrl?: string | null;
  activeFaces?: Record<string, boolean>;
  colorPreference: string;
  productName: string | null;
  productId: string | null;
}

const Preview3D = ({
  dimensions,
  textureUrl,
  bgTextureUrl,
  activeFaces,
  colorPreference,
  productName,
  productId,
}: Preview3DProps) => {
  const [autoRotate, setAutoRotate] = useState(false);
  const [lightsOn, setLightsOn] = useState(true);
  const [showAxis, setShowAxis] = useState(false);
  const controlsRef = useRef<OrbitControlsImpl>(null);

  return (
    <div className="premium-card p-4 flex flex-col h-full bg-secondary/20">
      <div className="flex items-center justify-between mb-3">
        <p className="text-xs text-muted-foreground uppercase tracking-wider font-body">3D Preview</p>
        <div className="flex gap-2">
          <button
            onClick={() => setLightsOn(!lightsOn)}
            className={`p-1.5 rounded-lg transition-colors border ${lightsOn ? 'text-amber-500 bg-amber-500/10 border-amber-500/20' : 'text-muted-foreground hover:bg-white/5 border-transparent'}`}
            title={lightsOn ? "Disable Lights" : "Enable Lights"}
          >
            <Lightbulb size={16} />
          </button>
          <button
            onClick={() => setShowAxis(!showAxis)}
            className={`p-1.5 rounded-lg transition-colors border ${showAxis ? 'text-amber-500 bg-amber-500/10 border-amber-500/20' : 'text-muted-foreground hover:bg-white/5 border-transparent'}`}
            title="Toggle 3D Axis"
          >
            <Axis3d size={16} />
          </button>
          <button
            onClick={() => setAutoRotate(!autoRotate)}
            className={`p-1.5 rounded-lg transition-colors ${autoRotate ? 'text-amber-500 bg-amber-500/10' : 'text-muted-foreground hover:bg-white/5'}`}
            title="Toggle Rotation"
          >
            <RotateCcw size={16} className={autoRotate ? 'animate-spin-slow' : ''} />
          </button>
        </div>
      </div>

      <div className="flex-1 bg-black/20 rounded-xl overflow-hidden relative min-h-[380px]">
        <Canvas camera={{ position: [5, 4, 6], fov: 45 }} gl={{ preserveDrawingBuffer: true }}>
          {lightsOn ? (
            <>
              <Environment preset="city" environmentIntensity={0.5} />
              <ambientLight intensity={0.85} />
              <directionalLight position={[8, 10, 5]} intensity={0.4} castShadow />
              <directionalLight position={[-8, 5, -5]} intensity={0.2} />
            </>
          ) : (
            <ambientLight intensity={3.5} />
          )}

          {showAxis && <axesHelper args={[5]} />}

          <Float
            speed={autoRotate ? 0 : 1.5}
            rotationIntensity={0}
            floatIntensity={autoRotate ? 0 : 0.3}
          >
            <Bounds fit clip margin={1.2}>
              <ProductModel
                productId={productId}
                dimensions={dimensions}
                textureUrl={textureUrl}
                bgTextureUrl={bgTextureUrl}
                activeFaces={activeFaces}
                colorPreference={colorPreference}
                autoRotate={autoRotate}
              />
              <FitBounds dimensions={dimensions} />
            </Bounds>
          </Float>

          <OrbitControls
            ref={controlsRef}
            makeDefault
            enablePan={false}
            maxDistance={15}
            autoRotate={false}
            enableDamping
            dampingFactor={0.05}
          />


          <ContactShadows
            position={[0, -1.0, 0]}
            opacity={0.4}
            scale={6}
            blur={2.0}
            far={4}
          />
        </Canvas>
      </div>

      {/* Dimension info */}
      <div className="mt-3 flex items-center justify-between px-1">
        <div className="flex gap-3 text-[10px] font-body text-muted-foreground">
          <span>L: <b className="text-amber-500">{dimensions.length}cm</b></span>
          <span>W: <b className="text-amber-500">{dimensions.width}cm</b></span>
          <span>H: <b className="text-amber-500">{dimensions.height}cm</b></span>
        </div>
        <span className="text-[10px] font-body text-muted-foreground/50">
          Drag to rotate · Scroll to zoom
        </span>
      </div>
    </div>
  );
};

export default Preview3D;
