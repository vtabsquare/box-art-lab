import { motion } from 'framer-motion';
import { TrendingUp, Package, Settings, Zap, RefreshCw, Wifi, WifiOff } from 'lucide-react';
import { MinimumCost } from '@/lib/utils';

interface CostCardProps {
  cost: MinimumCost;
  productName: string;
  dimensions: {
    length: number;
    width: number;
    height: number;
  };
  pricingLoading?: boolean;
  onRefresh?: () => void;
  lastUpdated?: Date | null;
}

const CostCard = ({ cost, productName, dimensions, pricingLoading, onRefresh, lastUpdated }: CostCardProps) => {
  const lastUpdatedStr = lastUpdated
    ? lastUpdated.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    : null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="premium-card p-6 flex flex-col h-full"
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <div className="p-2.5 rounded-lg bg-gradient-to-br from-amber-500/20 to-orange-500/20 backdrop-blur-sm border border-amber-500/30">
              <TrendingUp className="w-4 h-4 text-amber-500" />
            </div>
            <h3 className="font-heading text-sm font-semibold text-muted-foreground uppercase tracking-wider">
              Minimum Cost
            </h3>
          </div>
          <p className="text-xs text-muted-foreground/70">Per Unit Pricing</p>
        </div>

        {/* Live / Refresh indicator */}
        <div className="flex flex-col items-end gap-1">
          {cost.isLive ? (
            <span className="flex items-center gap-1 text-[10px] font-semibold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-full">
              <Wifi className="w-2.5 h-2.5" />
              Live
            </span>
          ) : (
            <span className="flex items-center gap-1 text-[10px] font-semibold text-muted-foreground/50 bg-white/5 border border-white/10 px-2 py-0.5 rounded-full">
              <WifiOff className="w-2.5 h-2.5" />
              Default
            </span>
          )}
          {onRefresh && (
            <button
              onClick={onRefresh}
              disabled={pricingLoading}
              title="Refresh prices from Google Sheets"
              className="text-muted-foreground/40 hover:text-amber-400 transition-colors disabled:opacity-30"
            >
              <RefreshCw className={`w-3 h-3 ${pricingLoading ? 'animate-spin' : ''}`} />
            </button>
          )}
          {lastUpdatedStr && (
            <span className="text-[9px] text-muted-foreground/30">{lastUpdatedStr}</span>
          )}
        </div>
      </div>

      {/* Main Price Display */}
      <div className="mb-6 pb-6 border-b border-white/[0.06]">
        <motion.div
          key={cost.totalCost}
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'spring', stiffness: 200, damping: 20 }}
          className="flex items-baseline gap-1 mb-2"
        >
          <span className="text-3xl font-bold bg-gradient-to-r from-amber-400 to-orange-500 bg-clip-text text-transparent">
            ₹{cost.totalCost.toFixed(2)}
          </span>
          <span className="text-xs text-muted-foreground/60 font-medium">per unit</span>
        </motion.div>
        <p className="text-xs text-muted-foreground/70">
          {productName || 'Custom Package'} · {dimensions.length} × {dimensions.width} × {dimensions.height} cm
        </p>
      </div>

      {/* Cost Breakdown */}
      <div className="space-y-3 mb-6">
        <div className="space-y-2">
          <div className="text-xs uppercase tracking-wide font-semibold text-muted-foreground mb-3">
            Cost Breakdown
          </div>

          {/* Base Price */}
          <motion.div
            initial={{ opacity: 0, x: -10 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.05 }}
            className="flex items-center justify-between p-2.5 rounded-lg bg-white/[0.02] border border-white/5 hover:bg-white/[0.04] transition-colors"
          >
            <div className="flex items-center gap-2">
              <Package className="w-3.5 h-3.5 text-amber-500/60" />
              <span className="text-xs text-muted-foreground/80 font-medium">Base Material</span>
            </div>
            <span className="text-xs font-semibold text-amber-400 font-mono">
              ₹{cost.basePrice.toFixed(2)}
            </span>
          </motion.div>

          {/* Size Adjustment */}
          <motion.div
            initial={{ opacity: 0, x: -10 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="flex items-center justify-between p-2.5 rounded-lg bg-white/[0.02] border border-white/5 hover:bg-white/[0.04] transition-colors"
          >
            <div className="flex items-center gap-2">
              <Zap className="w-3.5 h-3.5 text-blue-500/60" />
              <span className="text-xs text-muted-foreground/80 font-medium">Size Adjustment</span>
            </div>
            <span className="text-xs font-semibold text-blue-400 font-mono">
              ₹{cost.sizeAdjustment.toFixed(2)}
            </span>
          </motion.div>

          {/* Design Premium */}
          {cost.designPremium > 0 && (
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.15 }}
              className="flex items-center justify-between p-2.5 rounded-lg bg-white/[0.02] border border-white/5 hover:bg-white/[0.04] transition-colors"
            >
              <div className="flex items-center gap-2">
                <Settings className="w-3.5 h-3.5 text-purple-500/60" />
                <span className="text-xs text-muted-foreground/80 font-medium">Custom Design</span>
              </div>
              <span className="text-xs font-semibold text-purple-400 font-mono">
                ₹{cost.designPremium.toFixed(2)}
              </span>
            </motion.div>
          )}
        </div>
      </div>

      {/* Industry Multiplier Info */}
      <div className="pt-6 border-t border-white/[0.06]">
        <div className="p-3 rounded-lg bg-gradient-to-br from-amber-500/10 to-orange-500/10 border border-amber-500/20">
          <p className="text-[11px] text-muted-foreground/70 leading-relaxed mb-1">
            <span className="font-semibold text-amber-400">Industry Adjustment:</span> ×{cost.industryMultiplier}
          </p>
          <p className="text-[10px] text-muted-foreground/60">
            {cost.isLive
              ? '✦ Prices synced from Google Sheets'
              : 'Prices vary by industry standards and material specifications'}
          </p>
        </div>
      </div>

      {/* Footer Note */}
      <div className="mt-auto pt-6">
        <p className="text-[10px] text-muted-foreground/50 text-center">
          Minimum order quantity may apply • Contact for bulk pricing
        </p>
      </div>
    </motion.div>
  );
};

export default CostCard;
