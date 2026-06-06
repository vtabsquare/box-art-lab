import { motion } from 'framer-motion';
import { Palette, Printer, Box, Truck, PenTool, ShieldCheck } from 'lucide-react';

const services = [
  {
    icon: PenTool,
    title: 'Custom Design Studio',
    description: 'Our in-house design team creates bespoke packaging artwork tailored to your brand identity and target market.',
    accent: '#F59E0B',
  },
  {
    icon: Palette,
    title: 'Structural Engineering',
    description: 'From die-lines to prototyping, we engineer packaging structures that protect products and delight customers.',
    accent: '#8B5CF6',
  },
  {
    icon: Printer,
    title: 'Premium Printing',
    description: 'Offset, digital, and flexographic printing with spot UV, foil stamping, embossing, and specialty finishes.',
    accent: '#EC4899',
  },
  {
    icon: Box,
    title: 'Manufacturing',
    description: 'State-of-the-art manufacturing facility producing rigid boxes, folding cartons, corrugated packaging, and more.',
    accent: '#10B981',
  },
  {
    icon: ShieldCheck,
    title: 'Quality Assurance',
    description: 'ISO-certified processes ensuring consistent color accuracy, structural integrity, and food-safe compliance.',
    accent: '#3B82F6',
  },
  {
    icon: Truck,
    title: 'Global Fulfillment',
    description: 'End-to-end logistics serving international clients with timely delivery across 30+ countries worldwide.',
    accent: '#F97316',
  },
];

const ServicesSection = () => {
  return (
    <section id="services" className="py-24 px-6 relative">
      {/* Background accent */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-amber-500/20 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-amber-500/20 to-transparent" />
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <p className="section-label mb-4">What We Do</p>
          <h2 className="section-title mb-4">Our Services</h2>
          <p className="text-muted-foreground text-base md:text-lg max-w-2xl mx-auto font-body">
            End-to-end packaging solutions from concept to delivery. We combine creative design with precision manufacturing.
          </p>
        </motion.div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service, i) => {
            const Icon = service.icon;
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className="premium-card p-7 group"
              >
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center mb-5 transition-transform duration-300 group-hover:scale-110"
                  style={{ background: `${service.accent}15` }}
                >
                  <Icon className="w-6 h-6" style={{ color: service.accent }} />
                </div>

                <h3 className="font-heading text-lg font-semibold text-foreground mb-2">
                  {service.title}
                </h3>

                <p className="text-muted-foreground text-sm font-body leading-relaxed">
                  {service.description}
                </p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;
