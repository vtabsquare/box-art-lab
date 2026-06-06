import { motion } from 'framer-motion';
import { ArrowDown, Box, Sparkles, Globe2 } from 'lucide-react';

interface HeroSectionProps {
  onGetStarted: () => void;
}

const stats = [
  { value: '500+', label: 'Custom Designs', icon: Box },
  { value: '12+', label: 'Industries Served', icon: Sparkles },
  { value: '30+', label: 'Countries', icon: Globe2 },
];

const HeroSection = ({ onGetStarted }: HeroSectionProps) => {
  return (
    <section id="hero" className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20 pb-24">
      {/* Ambient background effects */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/6 w-[500px] h-[500px] rounded-full bg-amber-500/[0.04] blur-[140px]" />
        <div className="absolute bottom-1/3 right-1/5 w-[400px] h-[400px] rounded-full bg-amber-400/[0.03] blur-[120px]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-amber-600/[0.02] blur-[160px]" />
        {/* Grid pattern */}
        <div className="absolute inset-0 opacity-[0.03]" style={{
          backgroundImage: 'linear-gradient(hsl(38 90% 55% / 0.3) 1px, transparent 1px), linear-gradient(90deg, hsl(38 90% 55% / 0.3) 1px, transparent 1px)',
          backgroundSize: '60px 60px',
        }} />
      </div>

      <div className="relative z-10 w-full max-w-6xl mx-auto px-6 mt-10">
        <div className="text-center">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="inline-flex items-center gap-2 px-5 py-2 rounded-full border border-amber-500/20 bg-amber-500/[0.06] mb-8"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            <span className="text-xs font-body font-medium tracking-wider uppercase text-amber-500/90 dark:text-amber-300/80">
              Premium Packaging & Printing
            </span>
          </motion.div>

          {/* Main heading */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.15 }}
            className="font-display text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold leading-[1.05] mb-6 text-foreground"
          >
            Craft Your
            <span className="block gold-text mt-1">Perfect Package</span>
          </motion.h1>

          {/* Subheading */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="text-muted-foreground text-base sm:text-lg md:text-xl max-w-2xl mx-auto mb-10 font-body leading-relaxed"
          >
            From luxury rigid boxes to e-commerce mailers — we design, print and 
            manufacture packaging that elevates your brand across every industry.
          </motion.p>

          {/* CTA buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.45 }}
            className="flex flex-col sm:flex-row gap-4 justify-center mb-16"
          >
            <button onClick={onGetStarted} className="btn-primary text-base">
              Design Your Box
            </button>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="grid grid-cols-3 gap-4 max-w-lg mx-auto"
          >
            {stats.map((stat, i) => {
              const Icon = stat.icon;
              return (
                <div key={i} className="text-center">
                  <div className="flex items-center justify-center mb-2">
                    <Icon className="w-4 h-4 text-amber-500/60 mr-1.5" />
                    <span className="font-heading text-2xl sm:text-3xl font-bold gold-text">{stat.value}</span>
                  </div>
                  <p className="text-xs text-muted-foreground font-body">{stat.label}</p>
                </div>
              );
            })}
          </motion.div>
        </div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-4 left-1/2 -translate-x-1/2"
        animate={{ y: [0, 8, 0] }}
        transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
      >
        <div className="flex flex-col items-center gap-2 opacity-40">
          <span className="text-[10px] font-body tracking-widest uppercase text-muted-foreground">Scroll</span>
          <ArrowDown className="w-4 h-4 text-muted-foreground" />
        </div>
      </motion.div>
    </section>
  );
};

export default HeroSection;
