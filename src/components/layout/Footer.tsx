import React, { useState } from 'react';
import { ShieldCheck, Truck, Sparkles, Award, Mail, ArrowRight, Heart } from 'lucide-react';
import { useStore } from '../../context/StoreContext';

interface FooterProps {
  onNavigate: (tab: string, category?: string) => void;
  onOpenAdmin: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate, onOpenAdmin }) => {
  const { showToast, setIsShadeStudioOpen, setIsAskMariyamOpen } = useStore();
  const [email, setEmail] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes('@')) {
      showToast('Please enter a valid email address', 'error');
      return;
    }
    setIsSubscribed(true);
    showToast('Welcome to the Circle of Maquillage! Use code WELCOME10 for 10% off.', 'success');
  };

  return (
    <footer className="bg-[#1C1412] text-[#EADFCB] border-t border-[#382B27] mt-16">
      {/* Trust Badges Bar */}
      <div className="border-b border-[#382B27]/80 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto grid grid-cols-2 lg:grid-cols-4 gap-6 text-center">
          <div className="flex flex-col items-center gap-2 p-3">
            <div className="w-10 h-10 rounded-full bg-[#D4AF37]/10 flex items-center justify-center text-[#D4AF37]">
              <Award className="w-5 h-5" />
            </div>
            <h4 className="text-xs font-semibold tracking-wider uppercase text-white">100% Authentic Prestige</h4>
            <p className="text-[11px] text-[#A6958B]">Formulated for diverse Indian skin undertones</p>
          </div>

          <div className="flex flex-col items-center gap-2 p-3">
            <div className="w-10 h-10 rounded-full bg-[#D4AF37]/10 flex items-center justify-center text-[#D4AF37]">
              <Sparkles className="w-5 h-5" />
            </div>
            <h4 className="text-xs font-semibold tracking-wider uppercase text-white">AI Precision Studio</h4>
            <p className="text-[11px] text-[#A6958B]">True-to-tone shade matching with zero ashy cast</p>
          </div>

          <div className="flex flex-col items-center gap-2 p-3">
            <div className="w-10 h-10 rounded-full bg-[#D4AF37]/10 flex items-center justify-center text-[#D4AF37]">
              <Truck className="w-5 h-5" />
            </div>
            <h4 className="text-xs font-semibold tracking-wider uppercase text-white">Express Pan-India Delivery</h4>
            <p className="text-[11px] text-[#A6958B]">Complimentary dispatch on orders above ₹999</p>
          </div>

          <div className="flex flex-col items-center gap-2 p-3">
            <div className="w-10 h-10 rounded-full bg-[#D4AF37]/10 flex items-center justify-center text-[#D4AF37]">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h4 className="text-xs font-semibold tracking-wider uppercase text-white">Secured Transactions</h4>
            <p className="text-[11px] text-[#A6958B]">Instant UPI, Net Banking, Cards & Verified COD</p>
          </div>
        </div>
      </div>

      {/* Main Footer Links & Newsletter */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          {/* Brand Column */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-1.5">
              <span className="text-2xl font-serif font-bold tracking-[0.2em] text-[#FCF9F5] uppercase">
                MARIYAM
              </span>
              <span className="text-2xl font-serif font-light tracking-[0.25em] text-[#D4AF37] uppercase">
                MAQUILLAGE
              </span>
            </div>
            <p className="text-xs text-[#BFAFA5] leading-relaxed max-w-sm">
              The premier destination for Indian luxury beauty. We fuse ancestral botanicals like Kashmiri saffron
              and Kannauj Taif rose with cutting-edge chromatic science and AI precision matching.
            </p>
            <div className="pt-2 text-xs text-[#D4AF37] flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#D4AF37]"></span>
              <span>Atelier Flagship: Mumbai • New Delhi • Bengaluru</span>
            </div>
          </div>

          {/* Catalog Columns */}
          <div>
            <h4 className="text-xs font-semibold tracking-[0.15em] text-[#D4AF37] uppercase mb-4">Haute Collections</h4>
            <ul className="space-y-2 text-xs text-[#C8B8AE]">
              <li>
                <button onClick={() => onNavigate('shop', 'Makeup')} className="hover:text-white transition-colors">
                  Royal Silk Foundations
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('shop', 'Makeup')} className="hover:text-white transition-colors">
                  Hydra-Velvet Lipsticks
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('shop', 'Skincare')} className="hover:text-white transition-colors">
                  Multi-Ceramide Barrier Care
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('shop', 'Skincare')} className="hover:text-white transition-colors">
                  Peptide Glaze Dew Drops
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('shop', 'Fragrance')} className="hover:text-white transition-colors">
                  Oud & Taif Rose Royale
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('shop', 'Tools & Brushes')} className="hover:text-white transition-colors">
                  Artisanal 12-Piece Brush Sets
                </button>
              </li>
            </ul>
          </div>

          {/* AI & Services */}
          <div>
            <h4 className="text-xs font-semibold tracking-[0.15em] text-[#D4AF37] uppercase mb-4">Services & AI</h4>
            <ul className="space-y-2 text-xs text-[#C8B8AE]">
              <li>
                <button onClick={() => setIsShadeStudioOpen(true)} className="hover:text-[#D4AF37] transition-colors flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-[#D4AF37]" />
                  <span>AI Shade Studio</span>
                </button>
              </li>
              <li>
                <button onClick={() => setIsAskMariyamOpen(true)} className="hover:text-[#D4AF37] transition-colors">
                  Ask Mariyam Concierge
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('bridal')} className="hover:text-white transition-colors">
                  Bridal Atelier Trousseau
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('track')} className="hover:text-white transition-colors">
                  Track Your Consignment
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('account')} className="hover:text-white transition-colors">
                  My Beauty Profile
                </button>
              </li>
              <li>
                <button onClick={onOpenAdmin} className="text-[#A6958B] hover:text-[#D4AF37] transition-colors">
                  Store Operations (Admin)
                </button>
              </li>
            </ul>
          </div>

          {/* Newsletter Column */}
          <div>
            <h4 className="text-xs font-semibold tracking-[0.15em] text-[#D4AF37] uppercase mb-4">The Atelier Circle</h4>
            <p className="text-xs text-[#BFAFA5] mb-3">
              Receive private bridal previews, seasonal shade alerts, and 10% off your inaugural order.
            </p>
            {isSubscribed ? (
              <div className="bg-[#4A0E17] border border-[#D4AF37]/50 rounded-lg p-3 text-xs text-[#FCF9F5]">
                <p className="font-semibold text-[#D4AF37]">Welcome to Mariyam Maquillage.</p>
                <p className="text-[11px] mt-1">Your code: <span className="font-mono font-bold text-white bg-black/40 px-1 py-0.5 rounded">WELCOME10</span></p>
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="space-y-2">
                <div className="relative">
                  <input
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-8 pr-10 py-2 bg-[#261D1A] border border-[#4A3831] rounded-lg text-xs text-white placeholder:text-[#8E7E73] focus:outline-none focus:border-[#D4AF37]"
                  />
                  <Mail className="w-3.5 h-3.5 text-[#8E7E73] absolute left-2.5 top-1/2 -translate-y-1/2" />
                  <button
                    type="submit"
                    className="absolute right-1.5 top-1/2 -translate-y-1/2 bg-[#D4AF37] hover:bg-[#B38F28] text-[#1C1412] p-1.5 rounded-md transition-colors"
                  >
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
                <p className="text-[10px] text-[#8E7E73]">
                  By signing up you agree to our Terms of Luxury Service & Privacy Charter.
                </p>
              </form>
            )}
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-[#382B27] mt-12 pt-6 flex flex-col sm:flex-row items-center justify-between text-[11px] text-[#8E7E73] gap-4">
          <p>© {new Date().getFullYear()} Mariyam Maquillage Pvt. Ltd. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <span>GST Registered • Pan-India</span>
            <span>Temperature-Sensitive Cosmetics</span>
            <span className="flex items-center gap-1 text-[#D4AF37]">
              <span>Curated with</span>
              <Heart className="w-3 h-3 fill-[#D4AF37]" />
              <span>for Indian Beauty</span>
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};
