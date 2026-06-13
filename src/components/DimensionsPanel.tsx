import { motion } from 'framer-motion';
import { Ruler } from 'lucide-react';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import { BoxDimensions } from '@/lib/designRules';

interface DimensionsPanelProps {
  dimensions: BoxDimensions;
  maxDimension?: number;
  onDimensionsChange: (d: BoxDimensions) => void;
}

const DimensionsPanel = ({ dimensions, maxDimension = 50, onDimensionsChange }: DimensionsPanelProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: -15 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="premium-card px-5 py-4"
    >
      <div className="flex items-center gap-2 mb-3">
        <Ruler className="w-4 h-4 text-amber-400" />
        <h3 className="font-heading text-sm font-semibold gold-text uppercase tracking-wider">Dimensions (cm)</h3>
      </div>

      <div className="grid grid-cols-3 gap-6">
        {(['length', 'width', 'height'] as const).map((dim) => (
          <div key={dim} className="space-y-2">
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
    </motion.div>
  );
};

export default DimensionsPanel;
