import { motion } from 'framer-motion';
import { Upload, FileImage, StickyNote, FileDown, X, Loader2, Wand2 } from 'lucide-react';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

interface UploadPanelProps {
  logoUrl: string | null;
  designFileUrl: string | null;
  notes: string;
  activeFaces: Record<string, boolean>;
  isPDFGenerating?: boolean;
  onLogoUpload: (url: string, file: File) => void;
  onDesignUpload: (url: string, file: File) => void;
  onLogoRemove: () => void;
  onDesignRemove: () => void;
  onNotesChange: (n: string) => void;
  onFacesChange: (faces: Record<string, boolean>) => void;
  onGeneratePDF: () => Promise<void>;
}

const UploadPanel = ({
  logoUrl, designFileUrl, notes, activeFaces, isPDFGenerating = false,
  onLogoUpload, onDesignUpload, onLogoRemove, onDesignRemove,
  onNotesChange, onFacesChange, onGeneratePDF,
}: UploadPanelProps) => {
  const handleFileUpload = (
    e: React.ChangeEvent<HTMLInputElement>,
    handler: (url: string, file: File) => void
  ) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      handler(url, file);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: -30 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      className="premium-card p-5 space-y-4 overflow-y-auto scrollbar-thin h-full"
    >
      <div className="flex items-center gap-2 mb-1">
        <Upload className="w-4 h-4 text-amber-400" />
        <h3 className="font-heading text-base font-semibold gold-text">Upload Panel</h3>
      </div>

      {/* Logo Upload */}
      <div className="space-y-2">
        <Label className="flex items-center gap-1.5 text-muted-foreground text-xs uppercase tracking-wider font-body">
          <Upload className="w-3.5 h-3.5" /> Upload Logo
        </Label>
        {logoUrl ? (
          <div className="border border-border rounded-xl p-3 flex items-center gap-3 bg-secondary/30">
            <img src={logoUrl} alt="Logo" className="w-10 h-10 rounded-lg object-cover" />
            <span className="text-xs text-foreground font-body flex-1 truncate">Logo uploaded</span>
            <button
              onClick={onLogoRemove}
              className="p-1.5 rounded-lg hover:bg-red-500/20 text-muted-foreground hover:text-red-400 transition-colors"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        ) : (
          <label className="block border-2 border-dashed border-border rounded-xl p-4 text-center cursor-pointer hover:border-amber-500/30 hover:bg-amber-500/[0.03] transition-all duration-300">
            <Upload className="w-4 h-4 text-muted-foreground mx-auto mb-1.5" />
            <span className="text-muted-foreground text-xs font-body block">Click or drag to upload logo</span>
            <span className="text-muted-foreground/50 text-[10px] font-body block mt-0.5">PNG, JPG, SVG up to 5MB</span>
            <input type="file" accept="image/*" onChange={(e) => handleFileUpload(e, onLogoUpload)} className="hidden" />
          </label>
        )}
      </div>

      {/* Design File Upload */}
      <div className="space-y-2">
        <Label className="flex items-center gap-1.5 text-muted-foreground text-xs uppercase tracking-wider font-body">
          <FileImage className="w-3.5 h-3.5" /> Upload Design / Artwork
        </Label>
        {designFileUrl ? (
          <div className="border border-border rounded-xl p-3 flex items-center gap-3 bg-secondary/30">
            <img src={designFileUrl} alt="Design" className="w-10 h-10 rounded-lg object-cover" />
            <span className="text-xs text-foreground font-body flex-1 truncate">Design uploaded</span>
            <button
              onClick={onDesignRemove}
              className="p-1.5 rounded-lg hover:bg-red-500/20 text-muted-foreground hover:text-red-400 transition-colors"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        ) : (
          <label className="block border-2 border-dashed border-border rounded-xl p-4 text-center cursor-pointer hover:border-amber-500/30 hover:bg-amber-500/[0.03] transition-all duration-300">
            <FileImage className="w-4 h-4 text-muted-foreground mx-auto mb-1.5" />
            <span className="text-muted-foreground text-xs font-body block">Upload artwork or design file</span>
            <span className="text-muted-foreground/50 text-[10px] font-body block mt-0.5">PNG, JPG, AI, PSD, PDF</span>
            <input type="file" accept="image/*,.pdf,.ai,.psd" onChange={(e) => handleFileUpload(e, onDesignUpload)} className="hidden" />
          </label>
        )}
      </div>

      {/* Logo / Text Placement */}
      <div className="space-y-2">
        <Label className="flex items-center gap-1.5 text-muted-foreground text-xs uppercase tracking-wider font-body">
          <Wand2 className="w-3.5 h-3.5" /> Logo / Text Placement
        </Label>
        <div className="flex flex-wrap gap-2">
          {['front', 'back', 'left', 'right', 'top', 'bottom'].map((face) => (
            <button
              key={face}
              onClick={() => onFacesChange({ ...(activeFaces || {}), [face]: !(activeFaces || {})[face] })}
              className={`px-3 py-1.5 rounded-lg text-xs font-body transition-colors ${
                (activeFaces || {})[face]
                  ? 'bg-amber-500/20 text-amber-500 border border-amber-500/50'
                  : 'bg-secondary/50 text-muted-foreground border border-transparent hover:bg-secondary'
              }`}
            >
              <span className="capitalize">{face}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Notes */}
      <div className="space-y-2">
        <Label className="flex items-center gap-1.5 text-muted-foreground text-xs uppercase tracking-wider font-body">
          <StickyNote className="w-3.5 h-3.5" /> Notes / Special Requirements
        </Label>
        <Textarea
          id="notes-input"
          value={notes}
          onChange={(e) => onNotesChange(e.target.value)}
          placeholder="Any special requirements, finishes (matte, glossy, foil stamping...), or notes for the design team..."
          className="bg-secondary/70 border-border focus:border-amber-500/50 font-body text-sm min-h-[70px] resize-none"
          rows={3}
        />
      </div>

      {/* Generate PDF Button */}
      <button
        onClick={onGeneratePDF}
        disabled={isPDFGenerating}
        className="w-full bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 disabled:from-amber-500/50 disabled:to-orange-500/50 text-white font-body font-semibold py-2.5 px-4 rounded-xl transition-all duration-300 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-sm border border-amber-400/40 hover:border-amber-300/60 disabled:border-amber-400/20 hover:shadow-lg hover:shadow-amber-500/30"
      >
        {isPDFGenerating ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" />
            Generating PDF...
          </>
        ) : (
          <>
            <FileDown className="w-4 h-4" />
            Generate Professional PDF
          </>
        )}
      </button>
    </motion.div>
  );
};

export default UploadPanel;
