import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { MinimumCost } from './utils';

interface PDFGenerateConfig {
  productName: string;
  productType: string | null;
  industry: string;
  dimensions: { length: number; width: number; height: number };
  colorPreference: string;
  notes: string;
  cost: MinimumCost;
  textureUrl: string | null;
  logoUrl: string | null;
}

type ColorRGB = [number, number, number];

// Luxury Theme Colors
const COLORS: Record<string, ColorRGB> = {
  primaryDark: [20, 20, 30], // #14141e
  primaryGold: [212, 175, 55], // #d4af37
  lightGold: [245, 230, 180],
  textMain: [40, 40, 45],
  textMuted: [120, 120, 130],
  surfaceLight: [250, 250, 252],
  borderLight: [230, 230, 235],
  white: [255, 255, 255],
};

const FONTS = {
  title: { size: 28, weight: 'bold' },
  heading: { size: 16, weight: 'bold' },
  subheading: { size: 12, weight: 'bold' },
  body: { size: 10, weight: 'normal' },
  small: { size: 9, weight: 'normal' },
  tiny: { size: 7, weight: 'normal' },
};

// Helper function for color operations
function setColor(pdf: jsPDF, method: 'Fill' | 'Draw' | 'Text', color: ColorRGB): void {
  if (method === 'Fill') {
    pdf.setFillColor(color[0], color[1], color[2]);
  } else if (method === 'Draw') {
    pdf.setDrawColor(color[0], color[1], color[2]);
  } else if (method === 'Text') {
    pdf.setTextColor(color[0], color[1], color[2]);
  }
}

/**
 * Add elegant header section to PDF
 */
function addHeader(pdf: jsPDF, pageWidth: number, config: PDFGenerateConfig): number {
  // Top accent bar
  setColor(pdf, 'Fill', COLORS.primaryGold);
  pdf.rect(0, 0, pageWidth, 4, 'F');

  // Brand Name
  pdf.setFont('helvetica', 'bold');
  pdf.setFontSize(FONTS.title.size);
  setColor(pdf, 'Text', COLORS.primaryDark);
  pdf.text('BOX ART LAB', 20, 25);
  
  // Tagline
  pdf.setFont('helvetica', 'normal');
  pdf.setFontSize(FONTS.small.size);
  setColor(pdf, 'Text', COLORS.textMuted);
  pdf.text('PREMIUM PACKAGING STUDIO', 20, 31);

  // Document Type / Project Name on Right
  const docTitle = 'DESIGN SPECIFICATION';
  pdf.setFont('helvetica', 'bold');
  pdf.setFontSize(FONTS.heading.size);
  setColor(pdf, 'Text', COLORS.primaryGold);
  const docTitleWidth = pdf.getTextWidth(docTitle);
  pdf.text(docTitle, pageWidth - 20 - docTitleWidth, 25);
  
  const projectName = (config.productName || 'Custom Project').toUpperCase();
  pdf.setFont('helvetica', 'normal');
  pdf.setFontSize(FONTS.small.size);
  setColor(pdf, 'Text', COLORS.textMain);
  const projWidth = pdf.getTextWidth(projectName);
  pdf.text(projectName, pageWidth - 20 - projWidth, 31);

  // Elegant divider
  setColor(pdf, 'Draw', COLORS.borderLight);
  pdf.setLineWidth(0.2);
  pdf.line(20, 40, pageWidth - 20, 40);
  
  // Meta details (Date, ID)
  const timestamp = new Date().toLocaleDateString('en-US', {
    year: 'numeric', month: 'long', day: 'numeric'
  });
  const refId = `REF-${Math.floor(Math.random() * 1000000).toString().padStart(6, '0')}`;
  
  pdf.setFontSize(FONTS.tiny.size);
  setColor(pdf, 'Text', COLORS.textMuted);
  pdf.text(`DATE: ${timestamp.toUpperCase()}`, 20, 46);
  
  const refWidth = pdf.getTextWidth(`REF: ${refId}`);
  pdf.text(`REF: ${refId}`, pageWidth - 20 - refWidth, 46);

  return 60;
}

/**
 * Add refined specifications section
 */
function addSpecifications(
  pdf: jsPDF,
  pageWidth: number,
  startY: number,
  config: PDFGenerateConfig
): number {
  let y = startY;

  // Section heading
  pdf.setFont('helvetica', 'bold');
  pdf.setFontSize(FONTS.subheading.size);
  setColor(pdf, 'Text', COLORS.primaryDark);
  pdf.text('01. TECHNICAL SPECIFICATIONS', 20, y);
  
  y += 8;

  // Specifications table setup
  const specs = [
    { label: 'Product Model', value: config.productType || 'Custom Box' },
    { label: 'Brand / Collection', value: config.productName || 'Not Specified' },
    { label: 'Target Industry', value: config.industry.charAt(0).toUpperCase() + config.industry.slice(1) },
    { label: 'Exterior Dimensions', value: `${config.dimensions.length}cm (L) × ${config.dimensions.width}cm (W) × ${config.dimensions.height}cm (H)` },
    { label: 'Color Reference', value: config.colorPreference || 'Standard Output' },
  ];

  // Draw table
  const col1X = 25;
  const col2X = 90;
  const rowHeight = 12;

  setColor(pdf, 'Draw', COLORS.borderLight);
  pdf.setLineWidth(0.1);
  pdf.line(20, y, pageWidth - 20, y); // Top border
  
  specs.forEach((spec, index) => {
    // Subtle background for alternating rows
    if (index % 2 === 0) {
      setColor(pdf, 'Fill', COLORS.surfaceLight);
      pdf.rect(20, y, pageWidth - 40, rowHeight, 'F');
    }

    // Label
    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(FONTS.small.size);
    setColor(pdf, 'Text', COLORS.textMuted);
    pdf.text(spec.label.toUpperCase(), col1X, y + 8);

    // Value
    pdf.setFont('helvetica', 'normal');
    pdf.setFontSize(FONTS.body.size);
    setColor(pdf, 'Text', COLORS.textMain);
    pdf.text(spec.value, col2X, y + 8);

    y += rowHeight;
    
    // Row bottom border
    setColor(pdf, 'Draw', COLORS.borderLight);
    pdf.line(20, y, pageWidth - 20, y);
  });

  return y + 15;
}

/**
 * Add elegant cost breakdown section
 */
function addCostBreakdown(
  pdf: jsPDF,
  pageWidth: number,
  startY: number,
  cost: MinimumCost
): number {
  let y = startY;

  // Section heading
  pdf.setFont('helvetica', 'bold');
  pdf.setFontSize(FONTS.subheading.size);
  setColor(pdf, 'Text', COLORS.primaryDark);
  pdf.text('02. INVESTMENT SUMMARY', 20, y);
  
  y += 8;
  
  const boxWidth = pageWidth - 40;
  const col1X = 25;
  const col2X = pageWidth - 25;

  // Main cost box
  setColor(pdf, 'Draw', COLORS.primaryGold);
  pdf.setLineWidth(0.3);
  pdf.rect(20, y, boxWidth, 40, 'D'); // Just outline
  
  // Left side: Label
  pdf.setFont('helvetica', 'bold');
  pdf.setFontSize(FONTS.small.size);
  setColor(pdf, 'Text', COLORS.textMuted);
  pdf.text('ESTIMATED UNIT COST', col1X, y + 15);
  
  // Right side: Total value
  pdf.setFont('helvetica', 'bold');
  pdf.setFontSize(28);
  setColor(pdf, 'Text', COLORS.primaryGold);
  const totalStr = `$${cost.totalCost.toFixed(2)}`;
  const totalWidth = pdf.getTextWidth(totalStr);
  pdf.text(totalStr, col2X - totalWidth, y + 25);

  // Note
  pdf.setFont('helvetica', 'normal');
  pdf.setFontSize(FONTS.tiny.size);
  setColor(pdf, 'Text', COLORS.textMuted);
  pdf.text('* Subject to final material selection & order volume', col1X, y + 32);

  y += 50;

  // Detailed breakdown
  pdf.setFont('helvetica', 'bold');
  pdf.setFontSize(FONTS.small.size);
  setColor(pdf, 'Text', COLORS.primaryDark);
  pdf.text('Cost Structure Breakdown', 20, y);
  
  y += 6;
  
  const items = [
    { label: 'Base Material & Structure', value: cost.basePrice },
    { label: 'Dimensional Scaling', value: cost.sizeAdjustment },
    { label: 'Design & Print Premium', value: cost.designPremium },
  ];

  setColor(pdf, 'Draw', COLORS.borderLight);
  pdf.setLineWidth(0.1);
  pdf.line(20, y, pageWidth - 20, y);

  items.forEach((item) => {
    if (item.value === 0) return;
    
    y += 10;
    
    pdf.setFont('helvetica', 'normal');
    pdf.setFontSize(FONTS.small.size);
    setColor(pdf, 'Text', COLORS.textMain);
    pdf.text(item.label, col1X, y);
    
    const valStr = `$${item.value.toFixed(2)}`;
    const valWidth = pdf.getTextWidth(valStr);
    setColor(pdf, 'Text', COLORS.textMain);
    pdf.text(valStr, col2X - valWidth, y);
    
    y += 4;
    setColor(pdf, 'Draw', COLORS.borderLight);
    pdf.line(20, y, pageWidth - 20, y);
  });
  
  y += 8;
  pdf.setFont('helvetica', 'normal');
  pdf.setFontSize(FONTS.tiny.size);
  setColor(pdf, 'Text', COLORS.textMuted);
  pdf.text(`Includes Industry Specific Multiplier (×${cost.industryMultiplier})`, 20, y);

  return y + 15;
}

/**
 * Add special notes section with clean styling
 */
function addNotes(pdf: jsPDF, pageWidth: number, startY: number, notes: string): number {
  if (!notes) return startY;

  let y = startY;

  pdf.setFont('helvetica', 'bold');
  pdf.setFontSize(FONTS.subheading.size);
  setColor(pdf, 'Text', COLORS.primaryDark);
  pdf.text('03. SPECIAL INSTRUCTIONS', 20, y);
  
  y += 8;

  // Notes area
  setColor(pdf, 'Fill', COLORS.surfaceLight);
  setColor(pdf, 'Draw', COLORS.borderLight);
  pdf.setLineWidth(0.1);
  
  const splitNotes = pdf.splitTextToSize(notes, pageWidth - 50);
  const notesHeight = splitNotes.length * 6 + 12;
  
  pdf.rect(20, y, pageWidth - 40, notesHeight, 'FD'); // Fill and stroke

  pdf.setFont('helvetica', 'normal');
  pdf.setFontSize(FONTS.body.size);
  setColor(pdf, 'Text', COLORS.textMain);
  pdf.text(splitNotes, 25, y + 9);

  return y + notesHeight + 15;
}

/**
 * Add minimal luxury page footer
 */
function addFooter(pdf: jsPDF, pageNumber: number, totalPages: number): void {
  const pageHeight = pdf.internal.pageSize.getHeight();
  const pageWidth = pdf.internal.pageSize.getWidth();

  setColor(pdf, 'Draw', COLORS.borderLight);
  pdf.setLineWidth(0.2);
  pdf.line(20, pageHeight - 15, pageWidth - 20, pageHeight - 15);

  pdf.setFont('helvetica', 'bold');
  pdf.setFontSize(FONTS.tiny.size);
  setColor(pdf, 'Text', COLORS.primaryDark);
  pdf.text('BOX ART LAB', 20, pageHeight - 8);

  pdf.setFont('helvetica', 'normal');
  setColor(pdf, 'Text', COLORS.textMuted);
  pdf.text('Confidential Design Specification', 60, pageHeight - 8);
  
  const pageStr = `${pageNumber} / ${totalPages}`;
  const pageStrWidth = pdf.getTextWidth(pageStr);
  pdf.text(pageStr, pageWidth - 20 - pageStrWidth, pageHeight - 8);
}

/**
 * Main PDF generation function
 */
export async function generatePDF(config: PDFGenerateConfig): Promise<void> {
  try {
    const pdf = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();
    let currentY = 0;
    let pageNumber = 1;

    // --- PAGE 1: Specs & Costs ---
    currentY = addHeader(pdf, pageWidth, config);
    currentY = addSpecifications(pdf, pageWidth, currentY, config);
    currentY = addCostBreakdown(pdf, pageWidth, currentY, config.cost);

    if (config.notes) {
      if (currentY > pageHeight - 60) {
        pdf.addPage();
        currentY = 20;
        pageNumber++;
      }
      currentY = addNotes(pdf, pageWidth, currentY, config.notes);
    }

    // --- PAGE 2: Visual Previews ---
    const preview3DEl = document.getElementById('preview-3d-container');
    const canvas2DEl = document.getElementById('fabric-canvas-2d') as HTMLCanvasElement;
    
    if (preview3DEl || canvas2DEl) {
      pdf.addPage();
      currentY = 0;
      pageNumber++;
      
      currentY = addHeader(pdf, pageWidth, config);

      pdf.setFont('helvetica', 'bold');
      pdf.setFontSize(FONTS.subheading.size);
      setColor(pdf, 'Text', COLORS.primaryDark);
      pdf.text('04. VISUAL RENDERS', 20, currentY);
      currentY += 15;

      const contentWidth = pageWidth - 40; // 20mm padding each side
      
      // We will place images vertically centered beautifully
      // 1. 3D Preview (Hero shot)
      if (preview3DEl) {
        try {
          const threeCanvas = preview3DEl.querySelector('canvas') as HTMLCanvasElement;
          let imgData: string | null = null;

          if (threeCanvas && threeCanvas.width > 0 && threeCanvas.height > 0) {
            imgData = threeCanvas.toDataURL('image/png');
          } else {
            const capturedCanvas = await html2canvas(preview3DEl, {
              backgroundColor: null, // Keep transparent if possible
              scale: 2,
              useCORS: true,
              logging: false,
            });
            imgData = capturedCanvas.toDataURL('image/png');
          }

          if (imgData) {
            // Hero image takes full width, elegant crop
            const imgWidth = contentWidth;
            const imgHeight = imgWidth * 0.75; // 4:3 aspect
            
            // Subtle frame
            setColor(pdf, 'Fill', COLORS.surfaceLight);
            setColor(pdf, 'Draw', COLORS.borderLight);
            pdf.setLineWidth(0.1);
            pdf.rect(20, currentY, imgWidth, imgHeight, 'FD');
            
            pdf.addImage(imgData, 'PNG', 20, currentY, imgWidth, imgHeight);
            
            // Label
            pdf.setFont('helvetica', 'bold');
            pdf.setFontSize(FONTS.small.size);
            setColor(pdf, 'Text', COLORS.textMuted);
            pdf.text('3D STRUCTURAL RENDER', 20, currentY + imgHeight + 6);
            
            currentY += imgHeight + 25;
          }
        } catch (err) {
          console.warn('Could not capture 3D preview:', err);
        }
      }

      // Check if we need a new page for 2D design
      if (canvas2DEl && currentY > pageHeight - 120) {
        pdf.addPage();
        currentY = 0;
        pageNumber++;
        currentY = addHeader(pdf, pageWidth, config);
        
        pdf.setFont('helvetica', 'bold');
        pdf.setFontSize(FONTS.subheading.size);
        setColor(pdf, 'Text', COLORS.primaryDark);
        pdf.text('05. FLAT ARTWORK / DIELINE', 20, currentY);
        currentY += 15;
      } else if (canvas2DEl && currentY <= pageHeight - 120) {
        // If on same page, add subtitle
        pdf.setFont('helvetica', 'bold');
        pdf.setFontSize(FONTS.small.size);
        setColor(pdf, 'Text', COLORS.primaryDark);
        pdf.text('FLAT ARTWORK / DIELINE', 20, currentY - 5);
      }

      // 2. 2D Design Texture
      if (canvas2DEl) {
        try {
          const fabricCanvas = (window as unknown as Record<string, unknown>).__fabricCanvas as { getObjects: () => { id: string; visible: boolean }[]; renderAll: () => void; toDataURL: (options: Record<string, unknown>) => string };
          let imgData: string | null = null;

          if (fabricCanvas) {
            const gridGroup = fabricCanvas.getObjects().find((obj: { id: string; visible: boolean }) => obj.id === 'grid');
            if (gridGroup) gridGroup.visible = false;
            fabricCanvas.renderAll();

            imgData = fabricCanvas.toDataURL({
              format: 'png',
              quality: 1,
              multiplier: 2,
              enableRetinaScaling: true,
            });

            if (gridGroup) gridGroup.visible = true;
            fabricCanvas.renderAll();
          } else if (canvas2DEl.width > 0 && canvas2DEl.height > 0) {
            imgData = canvas2DEl.toDataURL('image/png');
          }

          if (imgData) {
            // Keep aspect ratio
            const aspect = canvas2DEl.height / canvas2DEl.width;
            let imgWidth = contentWidth;
            let imgHeight = imgWidth * aspect;

            // Constrain height if too tall
            const maxAllowedHeight = pageHeight - currentY - 30;
            if (imgHeight > maxAllowedHeight) {
              imgHeight = maxAllowedHeight;
              imgWidth = imgHeight / aspect;
            }

            const xOffset = 20 + (contentWidth - imgWidth) / 2; // Center it

            // Shadow / Frame
            setColor(pdf, 'Draw', COLORS.borderLight);
            pdf.setLineWidth(0.1);
            pdf.rect(xOffset - 1, currentY - 1, imgWidth + 2, imgHeight + 2, 'D');

            pdf.addImage(imgData, 'PNG', xOffset, currentY, imgWidth, imgHeight);
            
            // Label
            pdf.setFont('helvetica', 'bold');
            pdf.setFontSize(FONTS.small.size);
            setColor(pdf, 'Text', COLORS.textMuted);
            pdf.text('TEXTURE MAP LAYOUT', xOffset, currentY + imgHeight + 6);
          }
        } catch (err) {
          console.warn('Could not capture 2D design:', err);
        }
      }
    }

    // Add footers to all pages
    const totalPages = pdf.internal.pages.length - 1;
    for (let i = 1; i <= totalPages; i++) {
      pdf.setPage(i);
      addFooter(pdf, i, totalPages);
    }

    // Download
    const filename = `BAL-${config.productName.replace(/\s+/g, '-').toUpperCase()}-SPEC.pdf`;
    pdf.save(filename);
  } catch (err) {
    console.error('PDF generation error:', err);
    throw new Error('Failed to generate PDF. Please try again.');
  }
}

