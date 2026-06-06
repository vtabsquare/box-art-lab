import { useState, useCallback, useRef } from 'react';
import { motion } from 'framer-motion';
import { Download, FileDown, Loader2 } from 'lucide-react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

import Navbar from '@/components/Navbar';
import HeroSection from '@/components/HeroSection';
import ProductSelector from '@/components/ProductSelector';
import CustomizationPanel from '@/components/CustomizationPanel';
import Canvas2D from '@/components/Canvas2D';
import Preview3D from '@/components/Preview3D';
import DesignVariations from '@/components/DesignVariations';

import {
  PackagingState, defaultState, designRules,
  DesignConfig, Industry, BoxDimensions, ProductType,
} from '@/lib/designRules';

const Index = () => {
  const [state, setState] = useState<PackagingState>(defaultState);
  const [textureUrl, setTextureUrl] = useState<string | null>(null);
  const [exporting, setExporting] = useState(false);

  const sectionRefs = {
    hero: useRef<HTMLDivElement>(null),
    products: useRef<HTMLDivElement>(null),
    studio: useRef<HTMLDivElement>(null),
  };

  const scrollTo = (section: string) => {
    const ref = sectionRefs[section as keyof typeof sectionRefs];
    ref?.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const update = (partial: Partial<PackagingState>) =>
    setState((s) => ({ ...s, ...partial }));

  const handleProductSelect = (product: ProductType) => {
    update({
      selectedProduct: product,
      dimensions: { ...product.defaultDimensions },
    });
    // Auto-scroll to studio after short delay
    setTimeout(() => scrollTo('studio'), 400);
  };

  const handleGenerate = () => {
    const rules = designRules[state.industry];
    if (!rules) return;

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
      const pdf = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
      const pageWidth = pdf.internal.pageSize.getWidth();

      // ── Header ──────────────────────────────────
      pdf.setFillColor(20, 20, 30);
      pdf.rect(0, 0, pageWidth, 45, 'F');

      pdf.setFillColor(212, 175, 55);
      pdf.rect(0, 44, pageWidth, 1.5, 'F');

      pdf.setFont('helvetica', 'bold');
      pdf.setFontSize(22);
      pdf.setTextColor(212, 175, 55);
      pdf.text('Box Art Lab', 15, 20);

      pdf.setFont('helvetica', 'normal');
      pdf.setFontSize(9);
      pdf.setTextColor(160, 160, 170);
      pdf.text('Premium Packaging Design Studio', 15, 27);

      pdf.setFontSize(8);
      pdf.setTextColor(120, 120, 130);
      pdf.text(`Generated: ${new Date().toLocaleDateString('en-US', { 
        year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' 
      })}`, 15, 35);

      // ── Product Details Card ────────────────────
      let y = 55;

      pdf.setFillColor(28, 28, 40);
      pdf.roundedRect(10, y - 5, pageWidth - 20, 55, 3, 3, 'F');

      pdf.setFont('helvetica', 'bold');
      pdf.setFontSize(14);
      pdf.setTextColor(255, 255, 255);
      pdf.text('Package Specifications', 18, y + 5);

      pdf.setDrawColor(212, 175, 55);
      pdf.setLineWidth(0.5);
      pdf.line(18, y + 9, 85, y + 9);

      y += 18;
      pdf.setFont('helvetica', 'normal');
      pdf.setFontSize(9);

      const details = [
        ['Product Type', state.selectedProduct?.name || 'Custom Box'],
        ['Brand / Product Name', state.productName || '—'],
        ['Industry', state.industry.charAt(0).toUpperCase() + state.industry.slice(1)],
        ['Dimensions', `${state.dimensions.length} × ${state.dimensions.width} × ${state.dimensions.height} cm`],
        ['Color Preference', state.colorPreference || 'Default'],
      ];

      details.forEach(([label, value], i) => {
        const xLabel = i < 3 ? 18 : 110;
        const yOffset = i < 3 ? y + i * 9 : y + (i - 3) * 9;
        pdf.setTextColor(140, 140, 150);
        pdf.text(label, xLabel, yOffset);
        pdf.setTextColor(255, 255, 255);
        pdf.text(value, xLabel + 50, yOffset);
      });

      // ── Notes ──────────────────────────────────
      if (state.notes) {
        y += 50;
        pdf.setFillColor(28, 28, 40);
        pdf.roundedRect(10, y - 5, pageWidth - 20, 30, 3, 3, 'F');

        pdf.setFont('helvetica', 'bold');
        pdf.setFontSize(11);
        pdf.setTextColor(212, 175, 55);
        pdf.text('Special Notes', 18, y + 5);

        pdf.setFont('helvetica', 'normal');
        pdf.setFontSize(9);
        pdf.setTextColor(200, 200, 210);
        const splitNotes = pdf.splitTextToSize(state.notes, pageWidth - 45);
        pdf.text(splitNotes, 18, y + 14);
        y += 35;
      } else {
        y += 50;
      }

      // ── 3D Preview capture ─────────────────────
      const previewEl = document.getElementById('preview-3d-container');
      if (previewEl) {
        y += 5;
        pdf.setFont('helvetica', 'bold');
        pdf.setFontSize(14);
        pdf.setTextColor(255, 255, 255);
        pdf.text('3D Preview', 18, y);

        pdf.setDrawColor(212, 175, 55);
        pdf.setLineWidth(0.5);
        pdf.line(18, y + 4, 60, y + 4);

        try {
          const canvas = await html2canvas(previewEl, {
            backgroundColor: '#14141e',
            scale: 2,
            useCORS: true,
            logging: false,
          });
          const imgData = canvas.toDataURL('image/png');
          const imgWidth = pageWidth - 30;
          const imgHeight = (canvas.height / canvas.width) * imgWidth;

          y += 10;
          pdf.addImage(imgData, 'PNG', 15, y, imgWidth, Math.min(imgHeight, 100));
          y += Math.min(imgHeight, 100) + 10;
        } catch (err) {
          console.warn('Could not capture 3D preview:', err);
        }
      }

      // ── 2D Texture ─────────────────────────────
      if (textureUrl) {
        if (y > 230) {
          pdf.addPage();
          y = 20;
        }

        pdf.setFont('helvetica', 'bold');
        pdf.setFontSize(14);
        pdf.setTextColor(255, 255, 255);
        pdf.text('2D Texture Design', 18, y);

        pdf.setDrawColor(212, 175, 55);
        pdf.setLineWidth(0.5);
        pdf.line(18, y + 4, 75, y + 4);

        y += 10;
        pdf.addImage(textureUrl, 'PNG', 15, y, 70, 70);
      }

      // ── Footer ─────────────────────────────────
      const totalPages = pdf.internal.pages.length - 1;
      for (let i = 1; i <= totalPages; i++) {
        pdf.setPage(i);
        const pageH = pdf.internal.pageSize.getHeight();
        pdf.setFillColor(20, 20, 30);
        pdf.rect(0, pageH - 15, pageWidth, 15, 'F');
        pdf.setFillColor(212, 175, 55);
        pdf.rect(0, pageH - 15, pageWidth, 0.5, 'F');
        pdf.setFontSize(7);
        pdf.setTextColor(120, 120, 130);
        pdf.text('Box Art Lab — Premium Packaging & Printing Solutions', 15, pageH - 6);
        pdf.text(`Page ${i} of ${totalPages}`, pageWidth - 30, pageH - 6);
      }

      pdf.save(`${state.productName || 'box-art-lab'}-design-spec.pdf`);
    } catch (err) {
      console.error('PDF export error:', err);
    } finally {
      setExporting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar onNavigate={scrollTo} />

      <div ref={sectionRefs.hero}>
        <HeroSection
          onGetStarted={() => scrollTo('studio')}
        />
      </div>

      <div ref={sectionRefs.products}>
        <ProductSelector
          selectedProduct={state.selectedProduct}
          onSelect={handleProductSelect}
        />
      </div>

      {/* ── Design Studio Section ───────────────────────────────────── */}
      <section ref={sectionRefs.studio} className="py-20 px-4 sm:px-6" id="design-studio">
        <div className="max-w-[1400px] mx-auto">
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
                <span className="text-amber-400 font-medium ml-1">
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
                onIndustryChange={(i: Industry) => update({ industry: i })}
                onColorChange={(c: string) => update({ colorPreference: c })}
                onNotesChange={(n: string) => update({ notes: n })}
                onLogoUpload={(url: string, file: File) => update({ logoUrl: url, logoFile: file })}
                onDesignUpload={(url: string, file: File) => update({ designFileUrl: url, designFile: file })}
                onLogoRemove={() => update({ logoUrl: null, logoFile: null })}
                onDesignRemove={() => update({ designFileUrl: null, designFile: null })}
                onGenerate={handleGenerate}
              />
            </div>

            {/* Right: Previews */}
            <div className="lg:col-span-8 xl:col-span-9 space-y-6">
              {/* 3D and 2D side by side */}
              <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
                <div className="md:col-span-3">
                  <Preview3D
                    dimensions={state.dimensions}
                    textureUrl={textureUrl}
                    colorPreference={state.colorPreference}
                    productName={state.productName}
                  />
                </div>
                <div className="md:col-span-2">
                  <Canvas2D
                    design={state.activeDesign}
                    productName={state.productName}
                    logoUrl={state.logoUrl}
                    colorPreference={state.colorPreference}
                    onTextureReady={handleTextureReady}
                  />
                </div>
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
                  className="flex flex-wrap gap-3 pt-2"
                >
                  <button
                    onClick={handleExportPNG}
                    className="flex items-center gap-2 px-6 py-3 bg-secondary hover:bg-secondary/80 text-foreground font-body font-medium rounded-xl transition-all duration-300 border border-border hover:border-amber-500/30"
                  >
                    <Download className="w-4 h-4 text-amber-400" />
                    Export Design (PNG)
                  </button>
                  <button
                    onClick={handleExportPDF}
                    disabled={exporting}
                    className="btn-primary flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {exporting ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <FileDown className="w-4 h-4" />
                    )}
                    {exporting ? 'Generating PDF...' : 'Save as PDF'}
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
