import { useEffect, useRef, useState, useCallback } from 'react';
import { fabric } from 'fabric';
import { DesignConfig } from '@/lib/designRules';
import { DesignTemplate } from '@/lib/designTemplates';
import { buildTemplateObjects, clearTemplateObjects } from '@/lib/templateRenderers';
import { AlignCenter, AlignLeft, AlignRight } from 'lucide-react';

interface Canvas2DProps {
  design: DesignConfig | null;
  productName: string;
  logoUrl: string | null;
  colorPreference: string;
  onTextureReady?: (dataUrl: string, bgDataUrl: string) => void;
  templateOverride?: DesignTemplate | null;
}

const Canvas2D = ({ design, productName, logoUrl, colorPreference, onTextureReady, templateOverride }: Canvas2DProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fabricRef = useRef<fabric.Canvas | null>(null);
  
  // Track alignment tools state
  const [activeObj, setActiveObj] = useState<fabric.Object | null>(null);
  const [activeTab, setActiveTab] = useState<'editor'|'preview'>('editor');

  // 1. Initialize Canvas & Static Elements
  useEffect(() => {
    if (!canvasRef.current) return;
    
    const canvas = new fabric.Canvas(canvasRef.current, {
      width: 512,
      height: 512,
      preserveObjectStacking: true,
      selection: true,
    });
    
    // Make canvas responsive to its container without changing logical resolution
    canvas.setDimensions({ width: '100%', height: '100%' }, { cssOnly: true });
    
    fabricRef.current = canvas;
    
    // Expose fabric canvas globally for PDF export
    (window as any).__fabricCanvas = canvas;

    // Background Layer
    const bg = new fabric.Rect({
      left: 0, top: 0, width: 512, height: 512,
      selectable: false, evented: false, id: 'bg'
    } as any);
    canvas.add(bg);

    // Grid / Axis Layer
    const gridLines = [];
    
    // Axis lines (X = Red, Y = Green)
    gridLines.push(new fabric.Line([0, 1, 512, 1], { stroke: '#ef4444', strokeWidth: 2, selectable: false })); // X
    gridLines.push(new fabric.Line([1, 0, 1, 512], { stroke: '#22c55e', strokeWidth: 2, selectable: false })); // Y
    
    // Grid / Axis Layer
    for (let i = 32; i <= 512; i += 32) {
      gridLines.push(new fabric.Line([i, 0, i, 512], { stroke: 'rgba(255,255,255,0.08)', selectable: false }));
      gridLines.push(new fabric.Line([0, i, 512, i], { stroke: 'rgba(255,255,255,0.08)', selectable: false }));
    }
    
    // Axis labels
    for (let i = 32; i < 512; i += 64) {
      gridLines.push(new fabric.Text(`${i}`, { left: i + 4, top: 4, fontSize: 10, fill: 'rgba(255,255,255,0.4)', selectable: false }));
      gridLines.push(new fabric.Text(`${i}`, { left: 4, top: i + 4, fontSize: 10, fill: 'rgba(255,255,255,0.4)', selectable: false }));
    }
    
    const grid = new fabric.Group(gridLines, { selectable: false, evented: false, id: 'grid' } as any);
    canvas.add(grid);

    // Initial Text Objects
    const title = new fabric.Textbox('Your Brand', {
      left: 256, top: 256,
      width: 400,
      originX: 'center', originY: 'middle',
      fontSize: 38,
      fontFamily: 'Inter',
      fontWeight: 'bold',
      fill: '#ffffff',
      textAlign: 'center',
      shadow: new fabric.Shadow({ color: 'rgba(0,0,0,0.3)', blur: 8, offsetY: 2 }),
      id: 'title',
      transparentCorners: false,
      cornerColor: '#f59e0b',
      borderColor: '#f59e0b',
      cornerSize: 8,
    } as any);
    
    const subtitle = new fabric.Textbox('Premium Packaging', {
      left: 256, top: 290,
      width: 400,
      originX: 'center', originY: 'middle',
      fontSize: 16,
      fontFamily: 'Inter',
      fontWeight: '300',
      fill: 'rgba(255,255,255,0.7)',
      textAlign: 'center',
      id: 'subtitle',
      transparentCorners: false,
      cornerColor: '#f59e0b',
      borderColor: '#f59e0b',
      cornerSize: 8,
    } as any);

    canvas.add(title, subtitle);

    // Event listeners for interactivity
    const onModify = () => updateTexture();
    canvas.on('object:modified', onModify);
    canvas.on('object:moving', onModify);
    canvas.on('object:scaling', onModify);
    canvas.on('object:rotating', onModify);
    
    canvas.on('selection:created', (e) => setActiveObj(e.selected?.[0] || null));
    canvas.on('selection:updated', (e) => setActiveObj(e.selected?.[0] || null));
    canvas.on('selection:cleared', () => setActiveObj(null));
    
    // Auto-update texture after init
    setTimeout(() => updateTexture(), 100);

    return () => {
      canvas.dispose();
    };
  }, []); // Run once

  // 2a. Template pattern layer — runs independently whenever templateOverride changes
  useEffect(() => {
    const canvas = fabricRef.current;
    if (!canvas) return;

    if (templateOverride) {
      buildTemplateObjects(canvas, templateOverride);
    } else {
      clearTemplateObjects(canvas);
    }

    // Ensure title/subtitle/logo are on top after template objects are inserted
    const bring = (id: string) => {
      const obj = canvas.getObjects().find((o: any) => o.id === id);
      if (obj) canvas.bringToFront(obj);
    };
    bring('grid');
    bring('title');
    bring('subtitle');
    bring('logo');

    canvas.renderAll();
    setTimeout(() => updateTexture(), 50);
  }, [templateOverride]);

  // 2. Sync Props to Canvas Objects
  useEffect(() => {
    const canvas = fabricRef.current;
    if (!canvas) return;

    // Find objects
    const objs = canvas.getObjects() as any[];
    const bg = objs.find(o => o.id === 'bg');
    const title = objs.find(o => o.id === 'title') as fabric.Textbox;
    const subtitle = objs.find(o => o.id === 'subtitle') as fabric.Textbox;
    
    // Update Background Color / Gradient
    // Priority: colorPreference > template > design colors
    let colors: string[];
    if (colorPreference) {
      colors = [colorPreference, colorPreference];
    } else if (templateOverride) {
      colors = [templateOverride.colors[0], templateOverride.colors[1]];
    } else {
      colors = design?.colors || ['#2C2C2C', '#D4AF37'];
    }
    
    if (bg) {
      const grad = new fabric.Gradient({
        type: 'linear',
        coords: { x1: 0, y1: 0, x2: 256, y2: 512 },
        colorStops: [
          { offset: 0, color: colors[0] },
          { offset: 1, color: colors[1] || colors[0] }
        ]
      });
      bg.set('fill', grad);
    }

    // Update Text Content & Style
    if (title) {
      title.set('text', productName || 'Your Brand');
      const fontFam = (templateOverride?.font ?? design?.font) === 'elegant' ? 'Playfair Display' : 'Inter';
      const fontWeight = (templateOverride?.font ?? design?.font) === 'bold' ? 800 : (templateOverride?.font ?? design?.font) === 'elegant' ? 600 : 500;
      title.set('fontFamily', fontFam);
      title.set('fontWeight', fontWeight);
      title.set('fill', templateOverride?.textColor ?? '#ffffff');
    }
    
    if (subtitle) {
      subtitle.set('text', templateOverride?.tagline ?? design?.styleName ?? 'Premium Packaging');
      subtitle.set('fill', templateOverride?.textColor ? `${templateOverride.textColor}BB` : 'rgba(255,255,255,0.7)');
    }

    // Handle Logo
    const existingLogo = objs.find(o => o.id === 'logo') as fabric.Image;
    if (logoUrl) {
      if (!existingLogo || (existingLogo as any).getSrc() !== logoUrl) {
        // Need to load new logo
        fabric.Image.fromURL(logoUrl, (img: any) => {
          img.set({
            id: 'logo',
            originX: 'center', originY: 'middle',
            left: 256, top: 160,
            transparentCorners: false,
            cornerColor: '#f59e0b',
            borderColor: '#f59e0b',
            cornerSize: 8,
          });
          
          // Scale to fit ~120px initially
          const scale = 120 / Math.max(img.width || 1, img.height || 1);
          img.scale(scale);
          
          if (existingLogo) canvas.remove(existingLogo);
          canvas.add(img);
          canvas.bringToFront(img);
          canvas.renderAll();
          updateTexture();
        }, { crossOrigin: 'anonymous' });
      }
    } else {
      if (existingLogo) {
        canvas.remove(existingLogo);
      }
    }

    // Render & export
    canvas.renderAll();
    updateTexture();
  }, [design, productName, logoUrl, colorPreference, templateOverride]);

  // Texture updater
  const updateTexture = () => {
    if (fabricRef.current && onTextureReady) {
      const canvas = fabricRef.current;
      
      // Objects to toggle
      const grid = canvas.getObjects().find((o: any) => o.id === 'grid');
      const title = canvas.getObjects().find((o: any) => o.id === 'title');
      const subtitle = canvas.getObjects().find((o: any) => o.id === 'subtitle');
      const logo = canvas.getObjects().find((o: any) => o.id === 'logo');
      
      // 1. Hide grid for main export
      if (grid) grid.set('visible', false);
      const dataUrl = canvas.toDataURL({ format: 'png', quality: 1, multiplier: 2 });
      
      // 2. Hide content for bg-only export
      if (title) title.set('visible', false);
      if (subtitle) subtitle.set('visible', false);
      if (logo) logo.set('visible', false);
      const bgDataUrl = canvas.toDataURL({ format: 'png', quality: 1, multiplier: 1 }); // Multiplier 1 is enough for bg
      
      onTextureReady(dataUrl, bgDataUrl);
      
      // Update preview tab image
      const imgEl = document.getElementById('texture-preview-img') as HTMLImageElement;
      if (imgEl) imgEl.src = dataUrl;
      
      // 3. Restore all visibilities
      if (title) title.set('visible', true);
      if (subtitle) subtitle.set('visible', true);
      if (logo) logo.set('visible', true);
      if (grid) grid.set('visible', true);
      
      canvas.requestRenderAll();
    }
  };

  // UI Tools for active object
  const alignActiveObject = (pos: 'left' | 'center' | 'right') => {
    const obj = activeObj;
    const canvas = fabricRef.current;
    if (!obj || !canvas) return;
    
    if (pos === 'center') {
      obj.centerH();
    } else if (pos === 'left') {
      obj.set({ left: obj.getScaledWidth() / 2 + 32 }); 
    } else {
      obj.set({ left: 512 - obj.getScaledWidth() / 2 - 32 });
    }
    
    obj.setCoords();
    canvas.renderAll();
    updateTexture();
  };

  return (
    <div className="premium-card p-4 flex flex-col h-full bg-secondary/20">
      <div className="flex items-center justify-between mb-3">
        <div className="flex bg-black/20 p-1 rounded-lg">
          <button 
            onClick={() => setActiveTab('editor')} 
            className={`text-[10px] px-3 py-1.5 rounded-md font-body transition-colors ${activeTab === 'editor' ? 'bg-amber-500 text-black font-semibold' : 'text-muted-foreground hover:text-white'}`}
          >
            Editor
          </button>
          <button 
            onClick={() => setActiveTab('preview')} 
            className={`text-[10px] px-3 py-1.5 rounded-md font-body transition-colors ${activeTab === 'preview' ? 'bg-amber-500 text-black font-semibold' : 'text-muted-foreground hover:text-white'}`}
          >
            2D Preview
          </button>
        </div>
        
        {/* Toolbar */}
        {activeTab === 'editor' && (
          <div className="flex gap-1 bg-black/20 p-1 rounded-lg border border-white/5">
            <button 
              onClick={() => alignActiveObject('left')}
              disabled={!activeObj}
              className="p-1.5 rounded-md text-muted-foreground hover:bg-white/10 hover:text-white disabled:opacity-30 disabled:pointer-events-none transition-all"
              title="Align Left"
            ><AlignLeft size={14} /></button>
            <button 
              onClick={() => alignActiveObject('center')}
              disabled={!activeObj}
              className="p-1.5 rounded-md text-muted-foreground hover:bg-white/10 hover:text-white disabled:opacity-30 disabled:pointer-events-none transition-all"
              title="Center Horizontally"
            ><AlignCenter size={14} /></button>
            <button 
              onClick={() => alignActiveObject('right')}
              disabled={!activeObj}
              className="p-1.5 rounded-md text-muted-foreground hover:bg-white/10 hover:text-white disabled:opacity-30 disabled:pointer-events-none transition-all"
              title="Align Right"
            ><AlignRight size={14} /></button>
          </div>
        )}
      </div>
      
      <div className="relative flex-1 flex justify-center items-center rounded-xl overflow-hidden min-h-[380px]">
        
        {/* Editor Tab */}
        <div className={`w-full max-w-[512px] aspect-square shadow-[0_0_40px_rgba(0,0,0,0.5)] border border-white/10 rounded overflow-hidden transition-opacity duration-300 ${activeTab === 'editor' ? 'opacity-100 z-10' : 'opacity-0 pointer-events-none absolute'}`}>
          <canvas ref={canvasRef} id="fabric-canvas-2d" />
          {/* Helper tooltip */}
          <div className="absolute bottom-3 left-3 right-3 text-center pointer-events-none">
            <span className="bg-black/60 backdrop-blur-sm px-3 py-2 rounded-full text-[10px] text-white/90 font-body shadow-lg">
              Drag, resize, or rotate elements to instantly update the 3D model
            </span>
          </div>
        </div>
        
        {/* Preview Tab */}
        <div className={`w-full max-w-[512px] aspect-square rounded shadow-xl bg-black/40 border border-white/5 flex items-center justify-center overflow-hidden transition-opacity duration-300 ${activeTab === 'preview' ? 'opacity-100 z-10' : 'opacity-0 pointer-events-none absolute'}`}>
          <img id="texture-preview-img" alt="2D Final Preview" className="w-full h-full object-cover" />
        </div>

      </div>
    </div>
  );
};

export default Canvas2D;
