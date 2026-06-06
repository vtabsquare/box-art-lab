import { motion } from 'framer-motion';
import { DesignConfig } from '@/lib/designRules';
import { Check } from 'lucide-react';

interface DesignVariationsProps {
  variations: DesignConfig[];
  activeDesign: DesignConfig | null;
  onSelect: (design: DesignConfig) => void;
}

const DesignVariations = ({ variations, activeDesign, onSelect }: DesignVariationsProps) => {
  if (variations.length === 0) return null;

  return (
    <div className="space-y-3">
      <p className="text-xs text-muted-foreground uppercase tracking-wider font-body">
        Design Variations — Choose a style
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {variations.map((v, i) => {
          const isActive = activeDesign?.styleName === v.styleName;
          return (
            <motion.button
              key={i}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              onClick={() => onSelect(v)}
              className={`relative premium-card p-4 text-left transition-all duration-300 ${
                isActive
                  ? 'border-amber-500/50 shadow-[0_0_25px_-6px_hsl(38_90%_55%/0.25)]'
                  : ''
              }`}
            >
              {isActive && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute top-2.5 right-2.5 w-5 h-5 rounded-full bg-amber-500 flex items-center justify-center"
                >
                  <Check className="w-3 h-3 text-black" />
                </motion.div>
              )}

              {/* Color swatches */}
              <div className="flex gap-1.5 mb-3">
                {v.colors.map((c, ci) => (
                  <div
                    key={ci}
                    className="w-8 h-8 rounded-lg shadow-inner"
                    style={{ backgroundColor: c }}
                  />
                ))}
              </div>

              <h4 className="font-heading text-sm font-semibold text-foreground">{v.styleName}</h4>
              <p className="text-[10px] text-muted-foreground font-body mt-0.5 capitalize">
                {v.font} • {v.layout} layout
              </p>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
};

export default DesignVariations;
