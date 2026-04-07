import { motion } from 'framer-motion';
import { Slider } from '@/components/ui/slider';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Industry, BoxDimensions } from '@/lib/designRules';

interface CustomizationPanelProps {
  dimensions: BoxDimensions;
  productName: string;
  industry: Industry;
  colorPreference: string;
  onDimensionsChange: (d: BoxDimensions) => void;
  onProductNameChange: (name: string) => void;
  onIndustryChange: (i: Industry) => void;
  onColorChange: (c: string) => void;
  onLogoUpload: (url: string) => void;
  onGenerate: () => void;
}

const industries: { value: Industry; label: string }[] = [
  { value: 'food', label: 'Food & Beverage' },
  { value: 'pharma', label: 'Pharmaceutical' },
  { value: 'cosmetic', label: 'Cosmetic & Beauty' },
];

const CustomizationPanel = ({
  dimensions, productName, industry, colorPreference,
  onDimensionsChange, onProductNameChange, onIndustryChange,
  onColorChange, onLogoUpload, onGenerate,
}: CustomizationPanelProps) => {
  const handleLogoFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      onLogoUpload(url);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: -30 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      className="premium-card p-6 space-y-6"
    >
      <h3 className="font-display text-xl font-semibold gold-text">Customize</h3>

      {/* Product Name */}
      <div className="space-y-2">
        <Label className="text-muted-foreground text-xs uppercase tracking-wider font-body">Product Name</Label>
        <Input
          value={productName}
          onChange={(e) => onProductNameChange(e.target.value)}
          placeholder="Enter product name"
          className="bg-secondary border-border focus:border-gold font-body"
        />
      </div>

      {/* Industry */}
      <div className="space-y-2">
        <Label className="text-muted-foreground text-xs uppercase tracking-wider font-body">Industry</Label>
        <div className="grid grid-cols-3 gap-2">
          {industries.map((ind) => (
            <button
              key={ind.value}
              onClick={() => onIndustryChange(ind.value)}
              className={`px-3 py-2 rounded-md text-xs font-body transition-all ${
                industry === ind.value
                  ? 'bg-gold text-primary-foreground'
                  : 'bg-secondary text-muted-foreground hover:text-foreground'
              }`}
            >
              {ind.label}
            </button>
          ))}
        </div>
      </div>

      {/* Dimensions */}
      <div className="space-y-4">
        <Label className="text-muted-foreground text-xs uppercase tracking-wider font-body">Dimensions (cm)</Label>
        {(['length', 'width', 'height'] as const).map((dim) => (
          <div key={dim} className="space-y-1">
            <div className="flex justify-between text-xs font-body">
              <span className="text-muted-foreground capitalize">{dim}</span>
              <span className="text-gold">{dimensions[dim]} cm</span>
            </div>
            <Slider
              value={[dimensions[dim]]}
              min={2}
              max={30}
              step={0.5}
              onValueChange={([v]) => onDimensionsChange({ ...dimensions, [dim]: v })}
              className="[&_[role=slider]]:bg-gold [&_[role=slider]]:border-gold"
            />
          </div>
        ))}
      </div>

      {/* Color Preference */}
      <div className="space-y-2">
        <Label className="text-muted-foreground text-xs uppercase tracking-wider font-body">Color Preference</Label>
        <div className="flex gap-2 items-center">
          <input
            type="color"
            value={colorPreference || '#D4AF37'}
            onChange={(e) => onColorChange(e.target.value)}
            className="w-10 h-10 rounded-md cursor-pointer border-0 bg-transparent"
          />
          <Input
            value={colorPreference}
            onChange={(e) => onColorChange(e.target.value)}
            placeholder="#D4AF37"
            className="bg-secondary border-border focus:border-gold font-body flex-1"
          />
        </div>
      </div>

      {/* Logo Upload */}
      <div className="space-y-2">
        <Label className="text-muted-foreground text-xs uppercase tracking-wider font-body">Logo Upload</Label>
        <label className="block border-2 border-dashed border-border rounded-lg p-4 text-center cursor-pointer hover:border-gold/40 transition-colors">
          <span className="text-muted-foreground text-sm font-body">Click to upload logo</span>
          <input type="file" accept="image/*" onChange={handleLogoFile} className="hidden" />
        </label>
      </div>

      {/* Generate */}
      <button
        onClick={onGenerate}
        className="w-full py-3 bg-gold text-primary-foreground font-body font-semibold rounded-lg gold-glow hover:brightness-110 transition-all"
      >
        ✨ Generate Designs
      </button>
    </motion.div>
  );
};

export default CustomizationPanel;
