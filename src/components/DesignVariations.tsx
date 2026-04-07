import { motion } from 'framer-motion';
import { DesignConfig } from '@/lib/designRules';

interface DesignVariationsProps {
  variations: DesignConfig[];
  activeDesign: DesignConfig | null;
  onSelect: (design: DesignConfig) => void;
}

const DesignVariations = ({ variations, activeDesign, onSelect }: DesignVariationsProps) => {
  if (variations.length === 0) return null;

  return (
    <section className="py-12">
      <p className="text-xs text-muted-foreground uppercase tracking-wider mb-4 font-body">AI-Generated Variations</p>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {variations.map((v, i) => (
          <motion.button
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.15 }}
            onClick={() => onSelect(v)}
            className={`premium-card p-5 text-left ${
              activeDesign?.styleName === v.styleName ? 'gold-border gold-glow border' : ''
            }`}
          >
            <div className="flex gap-2 mb-3">
              {v.colors.map((c, ci) => (
                <div key={ci} className="w-8 h-8 rounded-md" style={{ backgroundColor: c }} />
              ))}
            </div>
            <h4 className="font-display text-sm font-semibold text-foreground">{v.styleName}</h4>
            <p className="text-xs text-muted-foreground font-body mt-1 capitalize">
              {v.font} · {v.layout} layout
            </p>
          </motion.button>
        ))}
      </div>
    </section>
  );
};

export default DesignVariations;
