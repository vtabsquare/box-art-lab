import { motion } from 'framer-motion';
import { Mail, Phone, MapPin, Send, Globe } from 'lucide-react';

const ContactSection = () => {
  return (
    <section id="contact" className="py-24 px-6 relative">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-amber-500/20 to-transparent" />
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <p className="section-label mb-4">Get In Touch</p>
          <h2 className="section-title mb-4">Let's Create Together</h2>
          <p className="text-muted-foreground text-base md:text-lg max-w-2xl mx-auto font-body">
            Ready to bring your packaging vision to life? Our team is here to help you every step of the way.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Contact Info */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="space-y-6"
          >
            <div className="premium-card p-6 space-y-6">
              <h3 className="font-heading text-xl font-semibold text-foreground">Contact Information</h3>
              
              <div className="space-y-4">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center flex-shrink-0">
                    <Mail className="w-4.5 h-4.5 text-amber-400" />
                  </div>
                  <div>
                    <p className="text-sm font-body font-medium text-foreground">Email</p>
                    <p className="text-sm text-muted-foreground font-body">info@boxartlab.com</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center flex-shrink-0">
                    <Phone className="w-4.5 h-4.5 text-amber-400" />
                  </div>
                  <div>
                    <p className="text-sm font-body font-medium text-foreground">Phone</p>
                    <p className="text-sm text-muted-foreground font-body">+1 (555) 123-4567</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center flex-shrink-0">
                    <MapPin className="w-4.5 h-4.5 text-amber-400" />
                  </div>
                  <div>
                    <p className="text-sm font-body font-medium text-foreground">Address</p>
                    <p className="text-sm text-muted-foreground font-body">123 Packaging Street, Design District<br />Creative City, CC 10001</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center flex-shrink-0">
                    <Globe className="w-4.5 h-4.5 text-amber-400" />
                  </div>
                  <div>
                    <p className="text-sm font-body font-medium text-foreground">Serving Worldwide</p>
                    <p className="text-sm text-muted-foreground font-body">International clients across 30+ countries</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Industries served */}
            <div className="premium-card p-6">
              <h4 className="font-heading text-base font-semibold text-foreground mb-4">Industries We Serve</h4>
              <div className="flex flex-wrap gap-2">
                {['Food & Beverage', 'Pharmaceutical', 'Cosmetics', 'Fashion & Garment', 'Electronics', 'E-Commerce', 'Luxury Brands', 'FMCG'].map((ind) => (
                  <span key={ind} className="px-3 py-1.5 rounded-lg bg-white/5 text-xs text-muted-foreground font-body border border-white/5">
                    {ind}
                  </span>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Quick Inquiry Form */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <div className="premium-card p-6">
              <h3 className="font-heading text-xl font-semibold text-foreground mb-6">Quick Inquiry</h3>
              <form onSubmit={(e) => e.preventDefault()} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs text-muted-foreground font-body uppercase tracking-wider block mb-1.5">Name</label>
                    <input
                      type="text"
                      placeholder="Your name"
                      className="w-full px-4 py-2.5 rounded-xl bg-secondary/70 border border-border text-sm font-body text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:border-amber-500/50 transition-colors"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-muted-foreground font-body uppercase tracking-wider block mb-1.5">Email</label>
                    <input
                      type="email"
                      placeholder="Your email"
                      className="w-full px-4 py-2.5 rounded-xl bg-secondary/70 border border-border text-sm font-body text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:border-amber-500/50 transition-colors"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs text-muted-foreground font-body uppercase tracking-wider block mb-1.5">Company</label>
                  <input
                    type="text"
                    placeholder="Your company name"
                    className="w-full px-4 py-2.5 rounded-xl bg-secondary/70 border border-border text-sm font-body text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:border-amber-500/50 transition-colors"
                  />
                </div>

                <div>
                  <label className="text-xs text-muted-foreground font-body uppercase tracking-wider block mb-1.5">Message</label>
                  <textarea
                    placeholder="Tell us about your packaging needs..."
                    rows={4}
                    className="w-full px-4 py-2.5 rounded-xl bg-secondary/70 border border-border text-sm font-body text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:border-amber-500/50 transition-colors resize-none"
                  />
                </div>

                <button type="submit" className="btn-primary w-full flex items-center justify-center gap-2 text-sm">
                  <Send className="w-4 h-4" />
                  Send Inquiry
                </button>
              </form>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Footer */}
      <div className="max-w-7xl mx-auto mt-20 pt-8 border-t border-border">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center">
              <span className="font-display font-bold text-white text-sm">B</span>
            </div>
            <span className="font-display text-base font-semibold gold-text">Box Art Lab</span>
          </div>
          <p className="text-xs text-muted-foreground font-body">
            © {new Date().getFullYear()} Box Art Lab. All rights reserved. Premium Packaging & Printing Solutions.
          </p>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
