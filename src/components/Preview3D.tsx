import { useRef, useMemo, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Environment, ContactShadows, Float } from '@react-three/drei';
import * as THREE from 'three';
import { BoxDimensions, productTypes } from '@/lib/designRules';
import { RotateCcw, Maximize2, Lightbulb, LightbulbOff, Axis3d } from 'lucide-react';

import { PopcornBox } from './models/PopcornBox';
import { PizzaBox } from './models/PizzaBox';
import { CarrierBoxPremium } from './models/CarrierBoxPremium';
import { GiftBoxPremium } from './models/GiftBoxPremium';
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
    const product = productTypes.find((p: any) => p.id === productId);
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
    switch (productId) {
      case 'popcorn-box':
        return <PopcornBox {...props} />;
      case 'pizza-box':
        return <PizzaBox {...props} />;
      case 'burger-box':
        return <BurgerBox {...props} />;
      case 'biriyani-box':
        return <BiriyaniBox {...props} />;
      case 'bakery-box':
        return <BakeryBox {...props} />;
      case 'fancy-cake-box':
        return <FancyCakeBox {...props} />;
      case 'cake-box':
      case 'fresh-cream-cake-box':
      case 'pastries-box':
        return <PastriesBox {...props} />;
      case 'plum-cake-box':
        return <PlumCakeBox {...props} />;
      case 'cup-cake-box':
        return <CupCakeBox {...props} />;
      case 'cheese-box':
        return <CheeseBox {...props} />;
      case 'chicken-box':
        return <ChickenBox {...props} />;
      case 'fried-chicken-box':
        return <FriedChickenBox {...props} />;
      case 'chocolate-box':
        return <ChocolateBox {...props} />;
      case 'cookies-box':
        return <CookiesBox {...props} />;
      case 'dosa-box':
        return <DosaBox {...props} />;
      case 'french-fries-box':
        return <FrenchFriesBox {...props} />;
      case 'hotdog-box':
        return <HotdogBox {...props} />;
      case 'meal-box':
        return <MealBox {...props} />;
      case 'nuts-spices-box':
        return <NutsSpicesBox {...props} />;
      case 'nuggets-box':
      case 'instant-food-box':
      case 'meat-box':
      case 'sweet-box':
        return <NuggetsBox {...props} />;
      case 'sea-foods-box':
        return <SeaFoodBox {...props} />;
      case 'sandwich-box':
        return <SandwichBox {...props} />;
      case 'savouries-box':
        return <SavouriesBox {...props} />;
      case 'dip-tea-box':
      case 'fancy-tea-box':
        return <DipTeaBox {...props} />;
      case 'tea-box':
        return <TeaBox {...props} />;
      case 'shawarma-box':
        return <ShawarmaBox {...props} />;
      case 'triangular-cake-slice-box':
        return <TriangularCakeBox {...props} />;
      case 'dates-box':
        return <DatesBox {...props} />;
      case 'carrier-bag':
        return <CarrierBoxPremium {...props} />;
      case 'gift-box':
        return <GiftBoxPremium {...props} />;
      case 'garment-box':
        return <GarmentBox {...props} />;
      case 'shirt-box':
        return <ShirtBox {...props} />;
      case 'shoe-box':
        return <ShoeBoxPremium {...props} />;
      case 'phone-box':
        return <PhoneBoxPremium {...props} />;
      case 'gadget-box':
        return <GadgetBoxPremium {...props} />;
      case 'laptop-box':
        return <LaptopBoxPremium {...props} />;
      case 'stand-pouch':
        return <StandUpPouchPremium {...props} />;
      case 'flat-pouch':
        return <FlatPouchPremium {...props} />;
      case 'mailer-box':
        return <MailerBoxPremium {...props} />;
      case 'shipping-box':
        return <ShippingBoxPremium {...props} />;
      case 'subscription-box':
        return <SubscriptionBoxPremium {...props} />;
      case 'medicine-box':
        return <MedicineBox {...props} />;
      case 'supplement-box':
        return <StandardBox {...props} dimensions={[0.7, 1.1, 0.7]} />;
      case 'perfume-box':
        return <PerfumeBox {...props} />;
      case 'cosmetic-box':
        return <StandardBox {...props} dimensions={[0.9, 0.55, 0.75]} />;
      case 'luxury-rigid':
        return <LuxuryRigidBox {...props} />;
      default:
        // Fallback: dimension-based generic box
        return <StandardBox {...props} dimensions={[
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
  const controlsRef = useRef<any>(null);

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
              <Environment preset="city" intensity={0.5} />
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
            <ProductModel
              productId={productId}
              dimensions={dimensions}
              textureUrl={textureUrl}
              bgTextureUrl={bgTextureUrl}
              activeFaces={activeFaces}
              colorPreference={colorPreference}
              autoRotate={autoRotate}
            />
          </Float>

          <OrbitControls
            ref={controlsRef}
            enablePan={false}
            maxDistance={12}
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
