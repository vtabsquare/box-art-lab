import { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Loader2, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

import Navbar from '@/components/Navbar';
import DesignerPanel from '@/components/DesignerPanel';
import UploadPanel from '@/components/UploadPanel';
import DimensionsPanel from '@/components/DimensionsPanel';
import Canvas2D from '@/components/Canvas2D';
import Preview3D from '@/components/Preview3D';
import ScaleView2D from '@/components/ScaleView2D';
import CostCard from '@/components/CostCard';

import { usePackaging } from '@/context/PackagingContext';
import { usePricing } from '@/context/PricingContext';
import { Industry, BoxDimensions } from '@/lib/designRules';
import { calculateMinimumCost } from '@/lib/utils';
import { generatePDF, generatePDFInstance } from '@/lib/pdfGenerator';
import { sendProposalEmail } from '@/lib/brevoService';
import { DesignTemplate } from '@/lib/designTemplates';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

const StudioPage = () => {
  const navigate = useNavigate();
  const { state, update, textureUrl, setTextureUrl } = usePackaging();
  const { pricing: livePricing, loading: pricingLoading, lastUpdated, refresh: refreshPricing } = usePricing();
  const [bgTextureUrl, setBgTextureUrl] = useState<string | null>(null);
  const [exporting, setExporting] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<DesignTemplate | null>(null);
  const [showQuoteDialog, setShowQuoteDialog] = useState(false);
  const [quoteEmail, setQuoteEmail] = useState('');
  const [isSendingQuote, setIsSendingQuote] = useState(false);

  const [activeFaces, setActiveFaces] = useState<Record<string, boolean>>({
    front: true, back: true, left: true, right: true, top: true, bottom: true
  });

  const handleIndustryChange = (i: Industry) => {
    update({ industry: i });
    setSelectedTemplate(null);
  };

  const selectedProductId = state.selectedProduct?.id;
  const maxDimension: number =
    (selectedProductId && livePricing[selectedProductId]?.maxDimension)
      ? livePricing[selectedProductId].maxDimension!
      : 50;

  const handleTextureReady = useCallback((dataUrl: string, bgUrl: string) => {
    setTextureUrl(dataUrl);
    setBgTextureUrl(bgUrl);
  }, [setTextureUrl]);

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

  const handleGetQuote = () => {
    const savedEmail = localStorage.getItem('userEmail') || localStorage.getItem('registeredEmail') || '';
    setQuoteEmail(savedEmail);
    setShowQuoteDialog(true);
  };

  const handleSendQuote = async () => {
    if (!quoteEmail) return;
    setIsSendingQuote(true);
    try {
      const cost = calculateMinimumCost(
        state.selectedProduct?.id,
        state.dimensions,
        state.industry,
        !!(state.logoUrl || state.designFileUrl),
        livePricing
      );
      const pdf = await generatePDFInstance({
        productName: state.productName || 'Custom Project',
        productType: state.selectedProduct?.name || null,
        industry: state.industry,
        dimensions: state.dimensions,
        colorPreference: state.colorPreference,
        notes: state.notes,
        cost,
        textureUrl,
        logoUrl: state.logoUrl,
      });
      const pdfBase64DataUri = pdf.output('datauristring');
      const pdfBase64 = pdfBase64DataUri.split(',')[1];
      const pdfFilename = `BAL-${(state.productName || 'Quote').replace(/\s+/g, '-').toUpperCase()}-PROPOSAL.pdf`;

      const response = await sendProposalEmail({
        email: quoteEmail,
        name: localStorage.getItem('userName') || 'Valued Client',
        category: state.selectedProduct?.category || 'Custom Category',
        productType: state.selectedProduct?.name || 'Custom Package',
        dimensions: `${state.dimensions.length}x${state.dimensions.width}x${state.dimensions.height} cm`,
        pricing: {
          basePrice: cost.basePrice,
          sizeAdjustment: cost.sizeAdjustment,
          designPremium: cost.designPremium,
          totalCost: cost.totalCost,
          multiplier: cost.industryMultiplier,
        },
        pdfBase64,
        pdfFilename,
      });

      if (response.success) {
        setShowQuoteDialog(false);
        navigate('/thank-you');
      } else {
        alert('Failed to send quote: ' + response.error);
      }
    } catch (err: any) {
      console.error('Quote email failed:', err);
      alert('Error sending quote email. Please try again.');
    } finally {
      setIsSendingQuote(false);
    }
  };

  return (
    <div className="min-h-screen bg-background pt-24 pb-12">
      <Navbar />

      <div className="max-w-[1700px] mx-auto px-4 sm:px-6">
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
          className="text-center mb-8"
        >
          <p className="section-label mb-3">Interactive Studio</p>
          <h2 className="section-title mb-3">Design &amp; Preview</h2>
          <p className="text-muted-foreground text-base max-w-2xl mx-auto font-body">
            Fill in your requirements and see your packaging come to life in real-time 3D.
            {state.selectedProduct && (
              <span className="text-amber-500 font-medium ml-1">
                — Editing: {state.selectedProduct.name}
              </span>
            )}
          </p>
        </motion.div>

        {/* ────────────────────────────────────────
            MAIN LAYOUT  (matches wireframe)
            Left col (xl:3) | Right col (xl:9)
        ──────────────────────────────────────── */}
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-4">

          {/* ── LEFT COLUMN: Designer Panel (top) + Upload Panel (bottom) ── */}
          <div className="xl:col-span-3 flex flex-col gap-4">
            {/* Designer panel */}
            <DesignerPanel
              productName={state.productName}
              industry={state.industry}
              colorPreference={state.colorPreference}
              selectedTemplate={selectedTemplate}
              onProductNameChange={(n: string) => update({ productName: n })}
              onIndustryChange={handleIndustryChange}
              onColorChange={(c: string) => update({ colorPreference: c })}
              onTemplateChange={setSelectedTemplate}
            />
            {/* Upload panel */}
            <UploadPanel
              logoUrl={state.logoUrl}
              designFileUrl={state.designFileUrl}
              notes={state.notes}
              activeFaces={activeFaces}
              isPDFGenerating={exporting}
              onLogoUpload={(url: string, file: File) => update({ logoUrl: url, logoFile: file })}
              onDesignUpload={(url: string, file: File) => update({ designFileUrl: url, designFile: file })}
              onLogoRemove={() => update({ logoUrl: null, logoFile: null })}
              onDesignRemove={() => update({ designFileUrl: null, designFile: null })}
              onNotesChange={(n: string) => update({ notes: n })}
              onFacesChange={setActiveFaces}
              onGeneratePDF={handleExportPDF}
            />
          </div>

          {/* ── RIGHT COLUMN ── */}
          <div className="xl:col-span-9 flex flex-col gap-4">

            {/* Row 1: Dimensions (spans full right column width) */}
            <DimensionsPanel
              dimensions={state.dimensions}
              maxDimension={maxDimension}
              onDimensionsChange={(d: BoxDimensions) => update({ dimensions: d })}
            />

            {/* Row 2: 3D Preview + Bill Summary */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
                  onGetQuote={handleGetQuote}
                />
              </div>
            </div>

            {/* Row 3: Text Editor + 2D Preview */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Text Editor */}
              <Canvas2D
                design={state.activeDesign}
                productName={state.productName}
                logoUrl={state.logoUrl}
                designFileUrl={state.designFileUrl}
                colorPreference={state.colorPreference}
                onTextureReady={handleTextureReady}
                templateOverride={selectedTemplate}
                mode="editor"
              />

              {/* 2D Scale View — front / side / top orthographic projections */}
              <ScaleView2D
                dimensions={state.dimensions}
                colorPreference={state.colorPreference}
                productName={state.productName || state.selectedProduct?.name}
                productId={state.selectedProduct?.id ?? null}
              />
            </div>

          </div>
        </div>
      </div>

      {/* ── Quote Dialog ── */}
      <Dialog open={showQuoteDialog} onOpenChange={setShowQuoteDialog}>
        <DialogContent className="sm:max-w-[425px] bg-[#0e0e14] border border-white/10 text-white">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold bg-gradient-to-r from-amber-400 to-orange-500 bg-clip-text text-transparent">
              Get Your Custom Quote
            </DialogTitle>
            <DialogDescription className="text-muted-foreground/80">
              We'll send a detailed PDF proposal and pricing breakdown directly to your email.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="flex flex-col gap-2">
              <Label htmlFor="email" className="text-sm font-medium text-white/80">
                Email Address
              </Label>
              <Input
                id="email"
                type="email"
                value={quoteEmail}
                onChange={(e) => setQuoteEmail(e.target.value)}
                placeholder="Enter your email"
                className="bg-black/50 border-white/10 focus-visible:ring-amber-500/50 text-white"
              />
            </div>
          </div>
          <DialogFooter>
            <button
              onClick={handleSendQuote}
              disabled={!quoteEmail || isSendingQuote}
              className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-body font-semibold rounded-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-lg hover:shadow-amber-500/30 border border-amber-400/40"
            >
              {isSendingQuote ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Sending Proposal...</span>
                </>
              ) : (
                <span>Send Proposal</span>
              )}
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default StudioPage;
