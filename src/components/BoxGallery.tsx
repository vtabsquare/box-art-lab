import { motion } from 'framer-motion';
import { boxTypes, BoxType } from '@/lib/designRules';

interface BoxGalleryProps {
  selectedBox: BoxType | null;
  onSelect: (box: BoxType) => void;
}

const BoxGallery = ({ selectedBox, onSelect }: BoxGalleryProps) => {
  return (
    <section className="py-20 px-6">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-14"
        >
          <p className="text-gold text-sm tracking-[0.2em] uppercase mb-3 font-body">Select Your Base</p>
          <h2 className="font-display text-3xl md:text-4xl font-bold">Packaging Collection</h2>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {boxTypes.map((box, i) => (
            <motion.button
              key={box.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              onClick={() => onSelect(box.id)}
              className={`premium-card p-8 text-left group cursor-pointer ${
                selectedBox === box.id ? 'gold-border gold-glow border' : ''
              }`}
            >
              <div className="text-5xl mb-5">{box.icon}</div>
              <h3 className="font-display text-xl font-semibold mb-2 text-foreground group-hover:text-gold transition-colors">
                {box.name}
              </h3>
              <p className="text-muted-foreground text-sm font-body">{box.description}</p>
              {selectedBox === box.id && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="mt-4 inline-block px-3 py-1 bg-gold/20 text-gold text-xs rounded-full font-body"
                >
                  Selected
                </motion.div>
              )}
            </motion.button>
          ))}
        </div>
      </div>
    </section>
  );
};

export default BoxGallery;
