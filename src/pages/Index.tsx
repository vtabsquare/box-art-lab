import { useState, useCallback, useRef } from 'react';
import { motion } from 'framer-motion';
import { Download } from 'lucide-react';
import Navbar from '@/components/Navbar';
import HeroSection from '@/components/HeroSection';
import BoxGallery from '@/components/BoxGallery';
import CustomizationPanel from '@/components/CustomizationPanel';
import Canvas2D from '@/components/Canvas2D';
import Preview3D from '@/components/Preview3D';
import DesignVariations from '@/components/DesignVariations';
import {
  PackagingState, defaultState, designRules,
  DesignConfig, BoxType, Industry, BoxDimensions,
} from '@/lib/designRules';

const Index = () => {
  const [state, setState] = useState<PackagingState>(defaultState);
  const [textureUrl, setTextureUrl] = useState<string | null>(null);
  const studioRef = useRef<HTMLDivElement>(null);

  const scrollToStudio = () => {
    studioRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const update = (partial: Partial<PackagingState>) =>
    setState((s) => ({ ...s, ...partial }));

  const handleBoxSelect = (box: BoxType) => {
    const industryMap: Record<BoxType, Industry> = {
      'food-box': 'food',
      'cosmetic-box': 'cosmetic',
      'pharma-box': 'pharma',
      'ecommerce-box': 'food',
    };
    update({ selectedBox: box, industry: industryMap[box] });
  };

  const handleGenerate = () => {
    const rules = designRules[state.industry];
    const variations = rules.map((r) => ({
      ...r,
      colors: state.colorPreference
        ? [state.colorPreference, r.colors[1]]
        : r.colors,
    }));
    update({ variations, activeDesign: variations[0] });
  };

  const handleTextureReady = useCallback((dataUrl: string) => {
    setTextureUrl(dataUrl);
  }, []);

  const handleExport = () => {
    if (!textureUrl) return;
    const a = document.createElement('a');
    a.href = textureUrl;
    a.download = `${state.productName || 'design'}-packaging.png`;
    a.click();
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <HeroSection onGetStarted={scrollToStudio} />

      <BoxGallery selectedBox={state.selectedBox} onSelect={handleBoxSelect} />

      {/* Studio Section */}
      <section ref={studioRef} className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-14"
          >
            <p className="text-gold text-sm tracking-[0.2em] uppercase mb-3 font-body">Design Studio</p>
            <h2 className="font-display text-3xl md:text-4xl font-bold">Craft Your Design</h2>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left: Customization */}
            <div className="lg:col-span-1">
              <CustomizationPanel
                dimensions={state.dimensions}
                productName={state.productName}
                industry={state.industry}
                colorPreference={state.colorPreference}
                onDimensionsChange={(d: BoxDimensions) => update({ dimensions: d })}
                onProductNameChange={(n: string) => update({ productName: n })}
                onIndustryChange={(i: Industry) => update({ industry: i })}
                onColorChange={(c: string) => update({ colorPreference: c })}
                onLogoUpload={(url: string) => update({ logoUrl: url })}
                onGenerate={handleGenerate}
              />
            </div>

            {/* Right: Previews */}
            <div className="lg:col-span-2 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Canvas2D
                  design={state.activeDesign}
                  productName={state.productName}
                  logoUrl={state.logoUrl}
                  onTextureReady={handleTextureReady}
                />
                <Preview3D
                  dimensions={state.dimensions}
                  textureUrl={textureUrl}
                />
              </div>

              {/* Variations */}
              <DesignVariations
                variations={state.variations}
                activeDesign={state.activeDesign}
                onSelect={(d: DesignConfig) => update({ activeDesign: d })}
              />

              {/* Export */}
              {state.activeDesign && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex gap-4"
                >
                  <button
                    onClick={handleExport}
                    className="flex items-center gap-2 px-6 py-3 bg-gold text-primary-foreground font-body font-semibold rounded-lg gold-glow hover:brightness-110 transition-all"
                  >
                    <Download className="w-4 h-4" />
                    Export PNG
                  </button>
                </motion.div>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Index;
