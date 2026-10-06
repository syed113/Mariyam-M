import React from 'react';
import { Sparkles, ArrowRight, ShieldCheck, Award } from 'lucide-react';
import { useStore } from '../../context/StoreContext';

interface HeroSectionProps {
  onShopClick: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ onShopClick }) => {
  const { setIsShadeStudioOpen, setIsAskMariyamOpen } = useStore();

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-[#FAF5EC] via-[#F5ECE0] to-[#FCF9F5] border-b border-[#E8DAC2]">
      {/* Subtle Luxury Pattern Overlay */}
      <div className="absolute inset-0 opacity-5 pointer-events-none bg-[radial-gradient(#4A0E17_1px,transparent_1px)] [background-size:24px_24px]"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20 lg:py-24 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Column: Editorial Headline & Copy */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 bg-[#4A0E17]/10 border border-[#4A0E17]/20 px-3.5 py-1.5 rounded-full text-xs font-semibold text-[#4A0E17] tracking-wider uppercase">
              <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" />
              <span>The Autumn/Festive Royal Atelier</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-serif font-bold text-[#351016] tracking-tight leading-[1.12]">
              Luminous Radiance <br />
              <span className="italic font-normal text-[#8A5A2B]">Calibrated for</span> Indian Complexions.
            </h1>

            <p className="text-sm sm:text-base text-[#5C453E] max-w-xl mx-auto lg:mx-0 font-normal leading-relaxed">
              No ashy flashback. No heavy masking. Discover breathable, sweat-resistant formulations infused with
              Kashmiri saffron bio-actives and 24K pure gold flakes—guided by precision AI shade matching.
            </p>

            {/* CTAs */}
            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3 sm:gap-4">
              <button
                onClick={onShopClick}
                className="w-full sm:w-auto px-7 py-3.5 bg-[#4A0E17] hover:bg-[#621420] text-[#FCF9F5] rounded-full text-xs font-semibold uppercase tracking-[0.18em] transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2 group"
              >
                <span>Shop The Collection</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>

              <button
                onClick={() => setIsShadeStudioOpen(true)}
                className="w-full sm:w-auto px-7 py-3.5 bg-white border-2 border-[#D4AF37] hover:bg-[#FCF9F5] text-[#4A0E17] rounded-full text-xs font-bold uppercase tracking-[0.18em] transition-all shadow-xs hover:shadow flex items-center justify-center gap-2 group"
              >
                <Sparkles className="w-4 h-4 text-[#D4AF37]" />
                <span>Find Your Shade (AI Studio)</span>
              </button>
            </div>

            {/* Trust Points */}
            <div className="pt-6 grid grid-cols-3 gap-4 border-t border-[#E8DAC2]/80 max-w-lg mx-auto lg:mx-0 text-left">
              <div>
                <p className="text-lg sm:text-xl font-serif font-bold text-[#4A0E17]">10 Shades</p>
                <p className="text-[11px] text-[#7A635B] uppercase tracking-wider">Desi Undertone Range</p>
              </div>
              <div>
                <p className="text-lg sm:text-xl font-serif font-bold text-[#4A0E17]">16-Hour</p>
                <p className="text-[11px] text-[#7A635B] uppercase tracking-wider">Sweat & Humidity Lock</p>
              </div>
              <div>
                <p className="text-lg sm:text-xl font-serif font-bold text-[#4A0E17]">Zero Cast</p>
                <p className="text-[11px] text-[#7A635B] uppercase tracking-wider">Flashback Proof</p>
              </div>
            </div>
          </div>

          {/* Right Column: Editorial Hero Visual Composition */}
          <div className="lg:col-span-5 relative">
            <div className="relative mx-auto max-w-md lg:max-w-none">
              {/* Outer decorative gold ring */}
              <div className="absolute -inset-3 rounded-2xl bg-gradient-to-tr from-[#D4AF37]/30 via-transparent to-[#4A0E17]/20 blur-lg"></div>

              {/* Main Visual Card */}
              <div className="relative rounded-2xl overflow-hidden shadow-2xl border-4 border-white bg-white">
                <img
                  src="https://images.unsplash.com/photo-1631729371254-42c2892f0e6e?auto=format&fit=crop&w=1000&q=85"
                  alt="Mariyam Maquillage Royal Silk Luminous Foundation"
                  className="w-full h-[400px] sm:h-[480px] object-cover hover:scale-105 transition-transform duration-700"
                />

                {/* Floating Product Highlight Tag */}
                <div className="absolute bottom-4 left-4 right-4 bg-white/95 backdrop-blur-md p-4 rounded-xl shadow-lg border border-[#EADFCB] flex items-center justify-between">
                  <div>
                    <span className="text-[10px] font-bold tracking-widest text-[#D4AF37] uppercase">
                      Bestselling Signature
                    </span>
                    <h3 className="text-xs sm:text-sm font-semibold text-[#201815]">
                      Royal Silk Luminous Foundation SPF 25
                    </h3>
                    <div className="flex items-center gap-1.5 mt-0.5">
                      <span className="text-xs font-bold text-[#4A0E17]">₹1,899</span>
                      <span className="text-[11px] text-gray-400 line-through">₹2,499</span>
                      <span className="text-[10px] text-emerald-700 font-semibold">(24% OFF)</span>
                    </div>
                  </div>

                  <button
                    onClick={() => setIsShadeStudioOpen(true)}
                    className="p-2.5 bg-[#4A0E17] hover:bg-[#621420] text-white rounded-lg shadow-xs transition-colors flex items-center gap-1 text-xs font-medium"
                    title="Find My Shade"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" />
                    <span className="text-[11px] font-semibold">Match Shade</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
