import React from 'react';
import { Sparkles, Camera, CheckCircle2, ArrowRight } from 'lucide-react';
import { useStore } from '../../context/StoreContext';

export const ShadeStudioBanner: React.FC = () => {
  const { setIsShadeStudioOpen } = useStore();

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#2F0B11] via-[#4A0E17] to-[#2B090E] text-white p-8 sm:p-12 lg:p-16 shadow-2xl border border-[#D4AF37]/30">
        {/* Decorative Gold Glow Effects */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#D4AF37]/15 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-[#B38F28]/10 rounded-full blur-2xl pointer-events-none"></div>

        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 bg-[#D4AF37]/20 border border-[#D4AF37]/40 px-3.5 py-1.5 rounded-full text-xs font-semibold text-[#FDFBF7] tracking-wider uppercase">
              <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" />
              <span>Proprietary Beauty Technology</span>
            </div>

            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-bold text-[#FCF9F5] leading-tight">
              AI Shade Studio: <br />
              <span className="italic text-[#D4AF37] font-normal">Foundations without</span> the Guesswork.
            </h2>

            <p className="text-sm text-[#E6D8D2] max-w-xl leading-relaxed">
              Standard beauty algorithms fail on Indian skin because they overlook olive green nuances and warm golden depth.
              Our multimodal AI analyzes your selfie under calibrated lighting to match you to your true second-skin shade.
            </p>

            {/* Feature Checkpoints */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-[#F2E8E4]">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#D4AF37] shrink-0" />
                <span>Zero Ashy Flashback Calibration</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#D4AF37] shrink-0" />
                <span>Distinct Olive & Golden Detection</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#D4AF37] shrink-0" />
                <span>Concealer + Foundation Pairing</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#D4AF37] shrink-0" />
                <span>Privacy-First: Photos Not Stored</span>
              </div>
            </div>

            <div className="pt-2">
              <button
                onClick={() => setIsShadeStudioOpen(true)}
                className="px-8 py-3.5 bg-gradient-to-r from-[#D4AF37] to-[#B38F28] hover:from-[#C5A028] hover:to-[#9E7A18] text-[#1C1412] rounded-full text-xs font-bold uppercase tracking-[0.2em] shadow-lg hover:shadow-xl transition-all flex items-center gap-2 group"
              >
                <Camera className="w-4 h-4" />
                <span>Launch AI Shade Studio</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>

          {/* Right Column: Visual Swatch Hierarchy */}
          <div className="lg:col-span-5 bg-white/5 backdrop-blur-md p-6 rounded-2xl border border-white/10 space-y-4">
            <div className="flex items-center justify-between text-xs border-b border-white/10 pb-3">
              <span className="font-semibold text-[#D4AF37] tracking-wider uppercase text-[11px]">
                Indian Shade Matrix
              </span>
              <span className="text-[11px] text-gray-300">8 Precision Tones</span>
            </div>

            {/* Swatch Previews */}
            <div className="space-y-2.5">
              {[
                { name: '128 Warm Sand', undertone: 'Fair-Light Warm', hex: '#F1D1B5' },
                { name: '220 Golden Beige', undertone: 'Medium Warm (Most Popular)', hex: '#E4BD9A' },
                { name: '230 Natural Olive', undertone: 'Medium Muted Olive', hex: '#D8AE89' },
                { name: '310 Honey Caramel', undertone: 'Tan Golden Amber', hex: '#C8976C' },
                { name: '410 Deep Espresso', undertone: 'Deep Terracotta Warm', hex: '#925A37' }
              ].map((s) => (
                <div
                  key={s.name}
                  className="flex items-center justify-between p-2 rounded-xl bg-white/5 hover:bg-white/10 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <span
                      className="w-7 h-7 rounded-full shadow-inner border border-white/20"
                      style={{ backgroundColor: s.hex }}
                    />
                    <div>
                      <p className="text-xs font-semibold text-white">{s.name}</p>
                      <p className="text-[10px] text-gray-300">{s.undertone}</p>
                    </div>
                  </div>
                  <span className="text-[10px] font-mono text-[#D4AF37]">96% match</span>
                </div>
              ))}
            </div>

            <p className="text-[10px] text-gray-300 italic text-center pt-2">
              Tested on over 1,200 Indian skin tones across 14 states.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};
