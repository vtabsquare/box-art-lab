import { motion } from 'framer-motion';

const Navbar = () => (
  <motion.nav
    initial={{ opacity: 0, y: -20 }}
    animate={{ opacity: 1, y: 0 }}
    className="fixed top-0 left-0 right-0 z-50 px-6 py-4"
  >
    <div className="max-w-7xl mx-auto flex items-center justify-between glass-card rounded-xl px-6 py-3">
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 rounded-lg bg-gold flex items-center justify-center text-primary-foreground font-display font-bold text-sm">
          P
        </div>
        <span className="font-display text-lg font-semibold gold-text">PackAI</span>
      </div>
      <div className="flex items-center gap-6">
        <span className="text-muted-foreground text-sm font-body hidden sm:block">AI Packaging Studio</span>
      </div>
    </div>
  </motion.nav>
);

export default Navbar;
