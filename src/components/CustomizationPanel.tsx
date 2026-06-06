import { motion } from 'framer-motion';
import { Upload, FileImage, StickyNote, Ruler, Palette, Tag, Building2, FileDown, X, Loader2, Wand2 } from 'lucide-react';
import { Slider } from '@/components/ui/slider';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Industry, industries, BoxDimensions } from '@/lib/designRules';
import DesignTemplateSelector from '@/components/DesignTemplateSelector';
import { DesignTemplate } from '@/lib/designTemplates';

interface CustomizationPanelProps {
  dimensions: BoxDimensions;
  productName: string;
  industry: Industry;
  colorPreference: string;
  notes: string;
  logoUrl: string | null;
  designFileUrl: string | null;
  onDimensionsChange: (d: BoxDimensions) => void;
  onProductNameChange: (name: string) => void;
  onIndustryChange: (i: Industry) => void;
  onColorChange: (c: string) => void;
  onNotesChange: (n: string) => void;
  onLogoUpload: (url: string, file: File) => void;
  onDesignUpload: (url: string, file: File) => void;
  onLogoRemove: () => void;
  onDesignRemove: () => void;
  onGeneratePDF: () => Promise<void>;
  isPDFGenerating?: boolean;
  activeFaces: Record<string, boolean>;
  onFacesChange: (faces: Record<string, boolean>) => void;
  maxDimension?: number;
  selectedTemplate: DesignTemplate | null;
  onTemplateChange: (t: DesignTemplate | null) => void;
}

const presetColors = [
  '#c89d6a', '#D4AF37', '#E74C3C', '#2E86C1', '#27AE60',
  '#8E44AD', '#F39C12', '#1ABC9C', '#2C3E50',
  '#E91E63', '#FF5722',
];

const CustomizationPanel = ({
  dimensions, productName, industry, colorPreference, notes,
  logoUrl, designFileUrl,
  onDimensionsChange, onProductNameChange, onIndustryChange,
  onColorChange, onNotesChange, onLogoUpload, onDesignUpload,
  onLogoRemove, onDesignRemove, onGeneratePDF, isPDFGenerating = false, activeFaces, onFacesChange, maxDimension = 50,
  selectedTemplate, onTemplateChange
}: CustomizationPanelProps) => {
  const handleFileUpload = (
    e: React.ChangeEvent<HTMLInputElement>,
    handler: (url: string, file: File) => void
  ) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      handler(url, file);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: -30 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      className="premium-card p-6 space-y-5 overflow-y-auto max-h-[calc(100vh-180px)] scrollbar-thin"
    >
      <div className="flex items-center gap-2 mb-1">
        <Wand2 className="w-5 h-5 text-amber-400" />
        <h3 className="font-heading text-xl font-semibold gold-text">Customize Your Box</h3>
      </div>

      {/* Product / Brand Name */}
      <div className="space-y-2">
        <Label className="flex items-center gap-1.5 text-muted-foreground text-xs uppercase tracking-wider font-body">
          <Tag className="w-3.5 h-3.5" /> Product / Brand Name
        </Label>
        <Input
          id="product-name-input"
          value={productName}
          onChange={(e) => onProductNameChange(e.target.value)}
          placeholder="Enter your product or brand name"
          className="bg-secondary/70 border-border focus:border-amber-500/50 font-body"
        />
      </div>

      {/* Industry Select */}
      <div className="space-y-2">
        <Label className="flex items-center gap-1.5 text-muted-foreground text-xs uppercase tracking-wider font-body">
          <Building2 className="w-3.5 h-3.5" /> Industry
        </Label>
        <div className="grid grid-cols-2 gap-2">
          {industries.map((ind) => (
            <button
              key={ind.value}
              onClick={() => onIndustryChange(ind.value)}
              className={`flex items-center gap-2 px-3 py-2.5 rounded-xl text-xs font-body transition-all duration-200 ${
                industry === ind.value
                  ? 'bg-amber-500/15 text-amber-300 border border-amber-500/30'
                  : 'bg-secondary/50 text-muted-foreground hover:text-foreground hover:bg-secondary border border-transparent'
              }`}
            >
              <span>{ind.icon}</span>
              <span className="truncate">{ind.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Dimensions */}
      <div className="space-y-3">
        <Label className="flex items-center gap-1.5 text-muted-foreground text-xs uppercase tracking-wider font-body">
          <Ruler className="w-3.5 h-3.5" /> Dimensions (cm)
        </Label>
        {(['length', 'width', 'height'] as const).map((dim) => (
          <div key={dim} className="space-y-1">
            <div className="flex justify-between text-xs font-body">
              <span className="text-muted-foreground capitalize">{dim}</span>
              <span className="text-amber-400 font-medium tabular-nums">{dimensions[dim]} cm</span>
            </div>
            <Slider
              value={[dimensions[dim]]}
              min={1}
              max={maxDimension}
              step={0.5}
              onValueChange={([v]) => onDimensionsChange({ ...dimensions, [dim]: v })}
              className="[&_[role=slider]]:bg-amber-500 [&_[role=slider]]:border-amber-500 [&_[role=slider]]:shadow-[0_0_8px_hsl(38_90%_55%/0.4)]"
            />
          </div>
        ))}
      </div>

      {/* Color Preference */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label className="flex items-center gap-1.5 text-muted-foreground text-xs uppercase tracking-wider font-body">
            <Palette className="w-3.5 h-3.5" /> Color Preference
          </Label>
          {colorPreference && (
            <button 
              onClick={() => onColorChange('')} 
              className="text-[10px] text-amber-500 hover:text-amber-400 font-body transition-colors"
            >
              Reset to Carton Default
            </button>
          )}
        </div>
        <div className="flex flex-wrap gap-2 mb-2">
          {presetColors.map((c) => (
            <button
              key={c}
              onClick={() => onColorChange(c)}
              className={`w-7 h-7 rounded-lg transition-all duration-200 hover:scale-110 ${
                colorPreference === c ? 'ring-2 ring-amber-400 ring-offset-2 ring-offset-background scale-110' : ''
              }`}
              style={{ backgroundColor: c }}
              title={c}
            />
          ))}
        </div>
        <div className="flex gap-2 items-center">
          <input
            type="color"
            value={colorPreference || '#D4AF37'}
            onChange={(e) => onColorChange(e.target.value)}
            className="w-9 h-9 rounded-lg cursor-pointer border-0 bg-transparent"
          />
          <Input
            value={colorPreference}
            onChange={(e) => onColorChange(e.target.value)}
            placeholder="#D4AF37"
            className="bg-secondary/70 border-border focus:border-amber-500/50 font-body flex-1 text-xs"
          />
        </div>
      </div>

      {/* Design Templates */}
      <DesignTemplateSelector
        industry={industry}
        selectedTemplateId={selectedTemplate?.id ?? null}
        onSelect={onTemplateChange}
      />

      {/* Logo Upload */}
      <div className="space-y-2">
        <Label className="flex items-center gap-1.5 text-muted-foreground text-xs uppercase tracking-wider font-body">
          <Upload className="w-3.5 h-3.5" /> Upload Logo
        </Label>
        {logoUrl ? (
          <div className="relative group">
            <div className="border border-border rounded-xl p-3 flex items-center gap-3 bg-secondary/30">
              <img src={logoUrl} alt="Logo" className="w-12 h-12 rounded-lg object-cover" />
              <span className="text-xs text-foreground font-body flex-1 truncate">Logo uploaded</span>
              <button
                onClick={onLogoRemove}
                className="p-1.5 rounded-lg hover:bg-red-500/20 text-muted-foreground hover:text-red-400 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        ) : (
          <label className="block border-2 border-dashed border-border rounded-xl p-5 text-center cursor-pointer hover:border-amber-500/30 hover:bg-amber-500/[0.03] transition-all duration-300">
            <Upload className="w-5 h-5 text-muted-foreground mx-auto mb-2" />
            <span className="text-muted-foreground text-xs font-body block">
              Click or drag to upload logo
            </span>
            <span className="text-muted-foreground/50 text-[10px] font-body block mt-1">
              PNG, JPG, SVG up to 5MB
            </span>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => handleFileUpload(e, onLogoUpload)}
              className="hidden"
            />
          </label>
        )}
      </div>

      {/* Design File Upload */}
      <div className="space-y-2">
        <Label className="flex items-center gap-1.5 text-muted-foreground text-xs uppercase tracking-wider font-body">
          <FileImage className="w-3.5 h-3.5" /> Upload Design / Artwork
        </Label>
        {designFileUrl ? (
          <div className="border border-border rounded-xl p-3 flex items-center gap-3 bg-secondary/30">
            <img src={designFileUrl} alt="Design" className="w-12 h-12 rounded-lg object-cover" />
            <span className="text-xs text-foreground font-body flex-1 truncate">Design uploaded</span>
            <button
              onClick={onDesignRemove}
              className="p-1.5 rounded-lg hover:bg-red-500/20 text-muted-foreground hover:text-red-400 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <label className="block border-2 border-dashed border-border rounded-xl p-5 text-center cursor-pointer hover:border-amber-500/30 hover:bg-amber-500/[0.03] transition-all duration-300">
            <FileImage className="w-5 h-5 text-muted-foreground mx-auto mb-2" />
            <span className="text-muted-foreground text-xs font-body block">
              Upload artwork or design file
            </span>
            <span className="text-muted-foreground/50 text-[10px] font-body block mt-1">
              PNG, JPG, AI, PSD, PDF
            </span>
            <input
              type="file"
              accept="image/*,.pdf,.ai,.psd"
              onChange={(e) => handleFileUpload(e, onDesignUpload)}
              className="hidden"
            />
          </label>
        )}
      </div>

      {/* Logo Placement */}
      <div className="space-y-2">
        <Label className="flex items-center gap-1.5 text-muted-foreground text-xs uppercase tracking-wider font-body">
          <Wand2 className="w-3.5 h-3.5" /> Logo / Text Placement
        </Label>
        <div className="flex flex-wrap gap-2">
          {['front', 'back', 'left', 'right', 'top', 'bottom'].map((face) => (
            <button
              key={face}
              onClick={() => onFacesChange({ ...(activeFaces || {}), [face]: !(activeFaces || {})[face] })}
              className={`px-3 py-1.5 rounded-lg text-xs font-body transition-colors ${
                (activeFaces || {})[face] 
                  ? 'bg-amber-500/20 text-amber-500 border border-amber-500/50' 
                  : 'bg-secondary/50 text-muted-foreground border border-transparent hover:bg-secondary'
              }`}
            >
              <span className="capitalize">{face}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Notes */}
      <div className="space-y-2">
        <Label className="flex items-center gap-1.5 text-muted-foreground text-xs uppercase tracking-wider font-body">
          <StickyNote className="w-3.5 h-3.5" /> Notes / Special Requirements
        </Label>
        <Textarea
          id="notes-input"
          value={notes}
          onChange={(e) => onNotesChange(e.target.value)}
          placeholder="Any special requirements, finishes (matte, glossy, foil stamping...), or notes for the design team..."
          className="bg-secondary/70 border-border focus:border-amber-500/50 font-body text-sm min-h-[80px] resize-none"
          rows={3}
        />
      </div>

      {/* Generate PDF Button */}
      <button
        onClick={onGeneratePDF}
        disabled={isPDFGenerating || !productName}
        className="w-full bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 disabled:from-amber-500/50 disabled:to-orange-500/50 text-white font-body font-semibold py-3 px-4 rounded-xl transition-all duration-300 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-sm border border-amber-400/40 hover:border-amber-300/60 disabled:border-amber-400/20 hover:shadow-lg hover:shadow-amber-500/30"
      >
        {isPDFGenerating ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" />
            Generating PDF...
          </>
        ) : (
          <>
            <FileDown className="w-4 h-4" />
            Generate Professional PDF
          </>
        )}
      </button>
    </motion.div>
  );
};

export default CustomizationPanel;
