import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Sun, Moon } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';

const navLinks = [
  { label: 'Home', path: '/home' },
  { label: 'Products', path: '/products' },
  { label: 'Design Studio', path: '/studio' },
];

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isDark, setIsDark] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    setIsDark(document.documentElement.classList.contains('dark'));
    const handleScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleTheme = () => {
    const newDark = !isDark;
    setIsDark(newDark);
    if (newDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  const handleNav = (path: string) => {
    navigate(path);
    setMobileOpen(false);
  };

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <>
      <motion.nav
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className={`fixed top-0 left-0 right-0 z-50 px-4 sm:px-6 py-3 transition-all duration-300 ${
          scrolled || location.pathname !== '/' ? 'bg-background/80 backdrop-blur-xl shadow-lg' : ''
        }`}
      >
        <div className="max-w-7xl mx-auto flex items-center justify-between w-full">
          {/* Logo */}
          <button onClick={() => handleNav('/home')} className="flex items-center gap-3 group">
            <div className="relative w-10 h-10 rounded-xl overflow-hidden flex-shrink-0">
              <div className="absolute inset-0 bg-gradient-to-br from-amber-400 via-amber-500 to-amber-600" />
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="font-display font-bold text-white text-lg">B</span>
              </div>
            </div>
            <div className="flex flex-col text-left">
              <span className="font-display text-lg font-bold gold-text leading-tight whitespace-nowrap">Box Art Lab</span>
              <span className="text-[10px] text-muted-foreground tracking-[0.15em] uppercase font-body whitespace-nowrap">Packaging Studio</span>
            </div>
          </button>

          {/* Right Section: Nav, Toggle, CTA, Mobile Menu */}
          <div className="flex items-center gap-2 md:gap-4">
            {/* Desktop nav */}
            <div className="flex max-lg:hidden items-center gap-1">
              {navLinks.map((link) => (
                <button
                  key={link.path}
                  onClick={() => handleNav(link.path)}
                  className={`px-4 py-2 text-sm font-body transition-colors rounded-lg hover:bg-black/5 dark:hover:bg-white/5 ${
                    isActive(link.path) ? 'text-foreground font-medium' : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  {link.label}
                </button>
              ))}
            </div>

            {/* Theme Toggle (Always Visible) */}
            <button
              onClick={toggleTheme}
              className="p-2 sm:p-2.5 rounded-full bg-surface hover:bg-surface-hover border border-border/50 transition-all duration-300 hover:shadow-gold/20 hover:border-gold/30 group flex items-center justify-center flex-shrink-0"
              aria-label="Toggle theme"
            >
              {isDark ? (
                <Sun size={18} className="text-gold group-hover:rotate-45 transition-transform duration-300" />
              ) : (
                <Moon size={18} className="text-gold group-hover:-rotate-12 transition-transform duration-300" />
              )}
            </button>


            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="lg:hidden p-2 rounded-lg hover:bg-black/5 dark:hover:bg-white/5 transition-colors text-foreground flex items-center justify-center flex-shrink-0"
              aria-label="Toggle menu"
            >
              {mobileOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>
      </motion.nav>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="fixed inset-x-0 top-[72px] z-40 bg-background/95 backdrop-blur-2xl border-b border-border px-6 py-6 lg:hidden shadow-xl"
          >
            <div className="flex flex-col gap-2">
              {navLinks.map((link) => (
                <button
                  key={link.path}
                  onClick={() => handleNav(link.path)}
                  className={`w-full text-left px-4 py-3 text-sm font-body rounded-xl hover:bg-black/5 dark:hover:bg-white/5 transition-colors ${
                    isActive(link.path) ? 'text-foreground font-medium bg-black/5 dark:bg-white/5' : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  {link.label}
                </button>
              ))}

            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;
