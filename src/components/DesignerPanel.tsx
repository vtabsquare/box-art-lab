import { motion } from 'framer-motion';
import { Palette, Tag, Building2, Wand2 } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Industry, industries } from '@/lib/designRules';
import DesignTemplateSelector from '@/components/DesignTemplateSelector';
import { DesignTemplate } from '@/lib/designTemplates';

interface DesignerPanelProps {
  productName: string;
  industry: Industry;
  colorPreference: string;
  selectedTemplate: DesignTemplate | null;
  onProductNameChange: (name: string) => void;
  onIndustryChange: (i: Industry) => void;
  onColorChange: (c: string) => void;
  onTemplateChange: (t: DesignTemplate | null) => void;
}

const presetColors = [
  '#c89d6a', '#D4AF37', '#E74C3C', '#2E86C1', '#27AE60',
  '#8E44AD', '#F39C12', '#1ABC9C', '#2C3E50',
  '#E91E63', '#FF5722',
];

const DesignerPanel = ({
  productName, industry, colorPreference, selectedTemplate,
  onProductNameChange, onIndustryChange, onColorChange, onTemplateChange,
}: DesignerPanelProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, x: -30 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      className="premium-card p-5 space-y-5 overflow-y-auto scrollbar-thin h-full"
    >
      <div className="flex items-center gap-2 mb-1">
        <Wand2 className="w-4 h-4 text-amber-400" />
        <h3 className="font-heading text-base font-semibold gold-text">Designer Panel</h3>
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
          className="bg-secondary/70 border-border focus:border-amber-500/50 font-body text-sm"
        />
      </div>

      {/* Industry */}
      <div className="space-y-2">
        <Label className="flex items-center gap-1.5 text-muted-foreground text-xs uppercase tracking-wider font-body">
          <Building2 className="w-3.5 h-3.5" /> Industry
        </Label>
        <div className="grid grid-cols-2 gap-1.5">
          {industries.map((ind) => (
            <button
              key={ind.value}
              onClick={() => onIndustryChange(ind.value)}
              className={`flex items-center gap-2 px-2.5 py-2 rounded-xl text-xs font-body transition-all duration-200 ${
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
              Reset
            </button>
          )}
        </div>
        <div className="flex flex-wrap gap-2 mb-2">
          {presetColors.map((c) => (
            <button
              key={c}
              onClick={() => onColorChange(c)}
              className={`w-6 h-6 rounded-lg transition-all duration-200 hover:scale-110 ${
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
            className="w-8 h-8 rounded-lg cursor-pointer border-0 bg-transparent"
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
    </motion.div>
  );
};

export default DesignerPanel;
