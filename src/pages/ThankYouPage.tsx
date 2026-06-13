import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { MailCheck, ArrowRight, Home } from 'lucide-react';
import Navbar from '@/components/Navbar';

const ThankYouPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background pt-24 pb-12 flex flex-col">
      <Navbar />
      
      <div className="flex-1 flex items-center justify-center relative overflow-hidden">
        {/* Ambient background effects */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] rounded-full bg-emerald-500/[0.04] blur-[140px]" />
          <div className="absolute bottom-1/3 right-1/4 w-[400px] h-[400px] rounded-full bg-emerald-400/[0.03] blur-[120px]" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-amber-600/[0.02] blur-[160px]" />
          {/* Grid pattern */}
          <div className="absolute inset-0 opacity-[0.03]" style={{
            backgroundImage: 'linear-gradient(hsl(150 90% 55% / 0.3) 1px, transparent 1px), linear-gradient(90deg, hsl(150 90% 55% / 0.3) 1px, transparent 1px)',
            backgroundSize: '60px 60px',
          }} />
        </div>

        <div className="relative z-10 w-full max-w-2xl mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, type: 'spring', bounce: 0.4 }}
            className="flex justify-center mb-8"
          >
            <div className="relative">
              <div className="absolute inset-0 bg-emerald-500/20 blur-xl rounded-full" />
              <div className="relative w-24 h-24 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-full flex items-center justify-center shadow-lg shadow-emerald-500/30 border-4 border-background">
                <MailCheck className="w-12 h-12 text-white" />
              </div>
            </div>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="font-display text-4xl sm:text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-emerald-400 via-emerald-500 to-emerald-600 bg-clip-text text-transparent"
          >
            Proposal Sent!
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="text-muted-foreground text-lg md:text-xl max-w-lg mx-auto mb-10 font-body leading-relaxed"
          >
            Thank you for choosing Box Art Lab. We've emailed your detailed design proposal and cost breakdown. Our packaging experts will be in touch shortly to assist you further.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center"
          >
            <button
              onClick={() => navigate('/')}
              className="flex items-center justify-center gap-2 px-8 py-3.5 bg-secondary hover:bg-secondary/80 text-foreground font-body font-medium rounded-xl transition-all duration-300 border border-border hover:border-emerald-500/30 hover:shadow-md hover:shadow-emerald-500/10 group w-full sm:w-auto"
            >
              <Home className="w-4 h-4 text-muted-foreground group-hover:text-emerald-500 transition-colors" />
              <span>Back to Home</span>
            </button>
            <button
              onClick={() => navigate('/products')}
              className="flex items-center justify-center gap-2 px-8 py-3.5 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-body font-semibold rounded-xl transition-all duration-300 shadow-lg shadow-amber-500/20 group w-full sm:w-auto border border-amber-400/40"
            >
              <span>Explore More Models</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default ThankYouPage;
