import { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Download, FileDown, Loader2, ArrowLeft, AlertCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

import Navbar from '@/components/Navbar';
import CustomizationPanel from '@/components/CustomizationPanel';
import Canvas2D from '@/components/Canvas2D';
import Preview3D from '@/components/Preview3D';
import DesignVariations from '@/components/DesignVariations';
import CostCard from '@/components/CostCard';

import { usePackaging } from '@/context/PackagingContext';
import { usePricing } from '@/context/PricingContext';
import { designRules, DesignConfig, Industry, BoxDimensions } from '@/lib/designRules';
import { calculateMinimumCost } from '@/lib/utils';
import { generatePDF } from '@/lib/pdfGenerator';
import { DesignTemplate } from '@/lib/designTemplates';

const StudioPage = () => {
  const navigate = useNavigate();
  const { state, update, textureUrl, setTextureUrl } = usePackaging();
  const { pricing: livePricing, loading: pricingLoading, lastUpdated, refresh: refreshPricing } = usePricing();
  const [bgTextureUrl, setBgTextureUrl] = useState<string | null>(null);
  const [exporting, setExporting] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<DesignTemplate | null>(null);
  
  const [activeFaces, setActiveFaces] = useState<Record<string, boolean>>({
    front: true, back: true, left: true, right: true, top: true, bottom: true
  });

  // Clear template when industry changes
  const handleIndustryChange = (i: Industry) => {
    update({ industry: i });
    setSelectedTemplate(null);
  };

  // Derive max slider dimension from live pricing sheet (falls back to 50 cm)
  const selectedProductId = state.selectedProduct?.id;
  const maxDimension: number =
    (selectedProductId && livePricing[selectedProductId]?.maxDimension)
      ? livePricing[selectedProductId].maxDimension!
      : 50;

  const handleTextureReady = useCallback((dataUrl: string, bgUrl: string) => {
    setTextureUrl(dataUrl);
    setBgTextureUrl(bgUrl);
  }, [setTextureUrl]);

  const handleExportPNG = () => {
    if (!textureUrl) return;
    const a = document.createElement('a');
    a.href = textureUrl;
    a.download = `${state.productName || 'box-art-lab'}-design.png`;
    a.click();
  };

  const handleExportPDF = async () => {
    setExporting(true);
    try {
      const cost = calculateMinimumCost(
        state.selectedProduct?.id,
        state.dimensions,
        state.industry,
        !!(state.logoUrl || state.designFileUrl),
        livePricing
      );

      await generatePDF({
        productName: state.productName,
        productType: state.selectedProduct?.name || null,
        industry: state.industry,
        dimensions: state.dimensions,
        colorPreference: state.colorPreference,
        notes: state.notes,
        cost,
        textureUrl,
        logoUrl: state.logoUrl,
      });
    } catch (err) {
      console.error('PDF generation failed:', err);
      alert('Failed to generate PDF. Please try again.');
    } finally {
      setExporting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background pt-24 pb-12">
      <Navbar />
      
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6">
        <button 
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors font-body text-sm px-4 py-2 rounded-lg hover:bg-black/5 dark:hover:bg-white/5 mb-4"
        >
          <ArrowLeft size={16} />
          Go Back
        </button>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <p className="section-label mb-4">Interactive Studio</p>
          <h2 className="section-title mb-4">Design & Preview</h2>
          <p className="text-muted-foreground text-base md:text-lg max-w-2xl mx-auto font-body">
            Fill in your requirements and see your packaging come to life in real-time 3D.
            {state.selectedProduct && (
              <span className="text-amber-500 font-medium ml-1">
                — Editing: {state.selectedProduct.name}
              </span>
            )}
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left: Form Panel */}
          <div className="lg:col-span-4 xl:col-span-3">
            <CustomizationPanel
              dimensions={state.dimensions}
              productName={state.productName}
              industry={state.industry}
              colorPreference={state.colorPreference}
              notes={state.notes}
              logoUrl={state.logoUrl}
              designFileUrl={state.designFileUrl}
              onDimensionsChange={(d: BoxDimensions) => update({ dimensions: d })}
              onProductNameChange={(n: string) => update({ productName: n })}
              onIndustryChange={handleIndustryChange}
              onColorChange={(c: string) => update({ colorPreference: c })}
              onNotesChange={(n: string) => update({ notes: n })}
              onLogoUpload={(url: string, file: File) => update({ logoUrl: url, logoFile: file })}
              onDesignUpload={(url: string, file: File) => update({ designFileUrl: url, designFile: file })}
              onLogoRemove={() => update({ logoUrl: null, logoFile: null })}
              onDesignRemove={() => update({ designFileUrl: null, designFile: null })}
              onGeneratePDF={handleExportPDF}
              isPDFGenerating={exporting}
              activeFaces={activeFaces}
              onFacesChange={setActiveFaces}
              maxDimension={maxDimension}
              selectedTemplate={selectedTemplate}
              onTemplateChange={setSelectedTemplate}
            />
          </div>

          {/* Right: Previews */}
          <div className="lg:col-span-8 xl:col-span-9 space-y-6">
            {/* 3D Preview and Cost Card side by side */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="md:col-span-2" id="preview-3d-container">
                <Preview3D
                  dimensions={state.dimensions}
                  textureUrl={textureUrl}
                  bgTextureUrl={bgTextureUrl}
                  activeFaces={activeFaces}
                  colorPreference={state.colorPreference}
                  productName={state.productName}
                  productId={state.selectedProduct?.id ?? null}
                />
              </div>
              <div className="md:col-span-1">
                <CostCard
                  cost={calculateMinimumCost(
                    state.selectedProduct?.id,
                    state.dimensions,
                    state.industry,
                    !!(state.logoUrl || state.designFileUrl),
                    livePricing
                  )}
                  productName={state.selectedProduct?.name || 'Custom Package'}
                  dimensions={state.dimensions}
                  pricingLoading={pricingLoading}
                  onRefresh={refreshPricing}
                  lastUpdated={lastUpdated}
                />
              </div>
            </div>

            {/* 2D Preview below */}
            <div>
              <Canvas2D
                design={state.activeDesign}
                productName={state.productName}
                logoUrl={state.logoUrl}
                colorPreference={state.colorPreference}
                onTextureReady={handleTextureReady}
                templateOverride={selectedTemplate}
              />
            </div>

            {/* Design Variations */}
            <DesignVariations
              variations={state.variations}
              activeDesign={state.activeDesign}
              onSelect={(d: DesignConfig) => update({ activeDesign: d })}
            />

            {/* Export Actions */}
            {state.activeDesign && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-4"
              >
                {/* Export Buttons */}
                <div className="flex flex-col sm:flex-row gap-3 pt-4">
                  <button
                    onClick={handleExportPNG}
                    className="flex items-center justify-center gap-2 px-6 py-3 bg-secondary hover:bg-secondary/80 text-foreground font-body font-medium rounded-xl transition-all duration-300 border border-border hover:border-amber-500/30 hover:shadow-md"
                  >
                    <Download className="w-4 h-4 text-amber-500" />
                    <span>Export Design (PNG)</span>
                  </button>

                  <button
                    onClick={handleExportPDF}
                    disabled={exporting || !state.productName}
                    className="flex items-center justify-center gap-2 px-8 py-3 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-body font-semibold rounded-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-lg hover:shadow-amber-500/30 border border-amber-400/40"
                  >
                    {exporting ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Generating PDF...</span>
                      </>
                    ) : (
                      <>
                        <FileDown className="w-4 h-4" />
                        <span>Generate Professional PDF</span>
                      </>
                    )}
                  </button>
                </div>

                {/* Info Note */}
                {!state.productName && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex items-start gap-3 p-3 bg-amber-500/10 border border-amber-500/30 rounded-lg"
                  >
                    <AlertCircle className="w-4 h-4 text-amber-500 flex-shrink-0 mt-0.5" />
                    <p className="text-sm text-amber-300 font-body">
                      Add a product/brand name to generate PDF
                    </p>
                  </motion.div>
                )}
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudioPage;
