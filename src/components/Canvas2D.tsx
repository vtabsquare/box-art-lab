import { useEffect, useRef, useCallback } from 'react';
import { DesignConfig } from '@/lib/designRules';

interface Canvas2DProps {
  design: DesignConfig | null;
  productName: string;
  logoUrl: string | null;
  onTextureReady?: (dataUrl: string) => void;
}

const Canvas2D = ({ design, productName, logoUrl, onTextureReady }: Canvas2DProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const logoImgRef = useRef<HTMLImageElement | null>(null);

  // Load logo
  useEffect(() => {
    if (logoUrl) {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.onload = () => { logoImgRef.current = img; };
      img.src = logoUrl;
    } else {
      logoImgRef.current = null;
    }
  }, [logoUrl]);

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const w = 400, h = 400;
    canvas.width = w;
    canvas.height = h;

    const colors = design?.colors || ['#2C2C2C', '#D4AF37'];
    const layout = design?.layout || 'center';
    const fontStyle = design?.font || 'clean';

    // Background gradient
    const grad = ctx.createLinearGradient(0, 0, 0, h);
    grad.addColorStop(0, colors[0]);
    grad.addColorStop(1, colors[1]);
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, w, h);

    // Decorative elements
    ctx.strokeStyle = `${colors[1]}44`;
    ctx.lineWidth = 1;
    for (let i = 0; i < 5; i++) {
      ctx.beginPath();
      ctx.moveTo(0, 80 * i + 40);
      ctx.lineTo(w, 80 * i + 40);
      ctx.stroke();
    }

    // Layout positioning
    let textY = h / 2;
    let logoY = h / 2 - 80;
    if (layout === 'top') { textY = 80; logoY = 140; }
    if (layout === 'minimal') { textY = h - 80; logoY = h / 2 - 40; }

    // Product name
    const fontSize = fontStyle === 'bold' ? 36 : fontStyle === 'elegant' ? 30 : 28;
    const fontFam = fontStyle === 'elegant' ? 'Playfair Display' : fontStyle === 'bold' ? 'Inter' : 'Inter';
    const fontWeight = fontStyle === 'bold' ? '700' : '400';
    ctx.fillStyle = '#FFFFFF';
    ctx.font = `${fontWeight} ${fontSize}px ${fontFam}, sans-serif`;
    ctx.textAlign = 'center';
    ctx.fillText(productName || 'Your Product', w / 2, textY);

    // Subtitle
    ctx.fillStyle = '#FFFFFF99';
    ctx.font = `300 14px Inter, sans-serif`;
    ctx.fillText(design?.styleName || 'Premium Packaging', w / 2, textY + 30);

    // Logo
    if (logoImgRef.current) {
      const logo = logoImgRef.current;
      const size = 60;
      ctx.drawImage(logo, w / 2 - size / 2, logoY, size, size);
    }

    // Border
    ctx.strokeStyle = '#FFFFFF22';
    ctx.lineWidth = 2;
    ctx.strokeRect(20, 20, w - 40, h - 40);

    onTextureReady?.(canvas.toDataURL());
  }, [design, productName, logoUrl, onTextureReady]);

  useEffect(() => {
    // Small delay for logo loading
    const timer = setTimeout(draw, 100);
    return () => clearTimeout(timer);
  }, [draw]);

  return (
    <div className="premium-card p-4">
      <p className="text-xs text-muted-foreground uppercase tracking-wider mb-3 font-body">2D Preview</p>
      <canvas
        ref={canvasRef}
        width={400}
        height={400}
        className="w-full rounded-lg"
      />
    </div>
  );
};

export default Canvas2D;
