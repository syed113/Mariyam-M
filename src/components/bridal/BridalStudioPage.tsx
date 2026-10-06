import React, { useState } from 'react';
import { Crown, Sparkles, CheckCircle2, Calendar, MapPin, Send, ShoppingBag } from 'lucide-react';
import { useStore } from '../../context/StoreContext';

export const BridalStudioPage: React.FC = () => {
  const { products, addToCart, showToast } = useStore();

  const [brideName, setBrideName] = useState('');
  const [weddingDate, setWeddingDate] = useState('');
  const [weddingCity, setWeddingCity] = useState('');
  const [phone, setPhone] = useState('');
  const [notes, setNotes] = useState('');
  const [isBooked, setIsBooked] = useState(false);

  const bridalEssentials = products.filter(p =>
    ['mm-prod-1', 'mm-prod-2', 'mm-prod-3', 'mm-prod-11', 'mm-prod-13'].includes(p.id)
  );

  const handleBooking = (e: React.FormEvent) => {
    e.preventDefault();
    if (!brideName || !weddingDate || !weddingCity || !phone) {
      showToast('Please fill all mandatory bridal details', 'error');
      return;
    }

    setIsBooked(true);
    showToast('Your Bridal Atelier Consultation has been requested! Our lead artist will contact you.', 'success');
  };

  const handleAddFullTrousseau = () => {
    bridalEssentials.forEach(p => {
      addToCart(p, p.shades ? p.shades[0] : undefined, 1);
    });
    showToast('Full Bridal Royal Trousseau added to Bag!', 'success');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-16">
      {/* Editorial Bridal Hero */}
      <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-[#3B0A11] via-[#4A0E17] to-[#2B090E] text-white p-8 sm:p-14 lg:p-20 shadow-2xl border border-[#D4AF37]/40">
        <div className="max-w-2xl space-y-6 relative z-10">
          <div className="inline-flex items-center gap-2 bg-[#D4AF37]/20 border border-[#D4AF37]/50 px-3.5 py-1.5 rounded-full text-xs font-semibold text-[#FDFBF7] tracking-wider uppercase">
            <Crown className="w-3.5 h-3.5 text-[#D4AF37]" />
            <span>The Bridal Atelier</span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-serif font-bold leading-tight">
            Cry-Proof, Sweat-Proof <br />
            <span className="italic font-normal text-[#D4AF37]">Royal Indian</span> Wedding Opulence.
          </h1>

          <p className="text-sm sm:text-base text-[#EADFCB] leading-relaxed">
            From sunrise Pheras to high-intensity Sangeet performances under blinding stage spotlights,
            Mariyam Maquillage formulations ensure your bridal skin stays immaculate, luminous, and camera-ready.
          </p>

          <div className="pt-2 flex flex-wrap gap-4">
            <button
              onClick={handleAddFullTrousseau}
              className="px-7 py-3.5 bg-gradient-to-r from-[#D4AF37] to-[#B38F28] hover:from-[#C5A028] hover:to-[#9E7A18] text-[#1C1412] rounded-full text-xs font-bold uppercase tracking-[0.2em] shadow-lg transition-all flex items-center gap-2"
            >
              <ShoppingBag className="w-4 h-4" />
              <span>Add Royal Trousseau Kit (5 Items)</span>
            </button>
          </div>
        </div>
      </div>

      {/* The 5 Ceremonies Guide */}
      <div className="space-y-8">
        <div className="text-center space-y-2">
          <span className="text-xs font-semibold tracking-[0.25em] text-[#D4AF37] uppercase">
            Wedding Rituals
          </span>
          <h2 className="text-3xl sm:text-4xl font-serif font-bold text-[#351016]">
            Formulations for Every Function
          </h2>
          <p className="text-xs sm:text-sm text-[#735D55] max-w-lg mx-auto">
            Engineered textures calibrated for the specific emotional & environmental demands of each celebration.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {[
            {
              title: 'Haldi & Chooda',
              desc: 'High-turmeric exposure; lightweight non-staining barrier hydration with peptide glaze drops.',
              time: 'Daytime Sunlight'
            },
            {
              title: 'Mehendi Soirée',
              desc: 'Transfer-resistant velvet lipsticks that endure long eating and laughter sessions.',
              time: 'Afternoon Elegance'
            },
            {
              title: 'Sangeet Madness',
              desc: 'Extreme sweat & dance resistance powered by the 24K Micro-Mist Lock spray.',
              time: 'High Heat & Lights'
            },
            {
              title: 'The Shaadi Pheras',
              desc: 'Tear-resistant, water-resistant base with zero ashiness in high-definition photography.',
              time: 'Sanctified Vows'
            },
            {
              title: 'Reception Glam',
              desc: 'Imperial Taif Rose Oud sillage and multidimensional molten gold lids.',
              time: 'Midnight Banquet'
            }
          ].map((c, i) => (
            <div key={i} className="bg-white border border-[#E8DAC2] p-5 rounded-2xl shadow-xs space-y-3">
              <span className="text-[10px] font-bold text-[#A37B30] uppercase tracking-wider block">
                {c.time}
              </span>
              <h3 className="font-serif font-bold text-lg text-[#351016]">{c.title}</h3>
              <p className="text-xs text-[#5C453E] leading-relaxed">{c.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Bridal Consultation Booking Form */}
      <div className="bg-[#FAF5EC] border border-[#E8DAC2] rounded-3xl p-8 sm:p-12 shadow-sm grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
        <div className="lg:col-span-6 space-y-4">
          <div className="inline-flex items-center gap-2 bg-[#D4AF37]/20 px-3 py-1 rounded-full text-xs font-semibold text-[#8A5A2B] uppercase">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Atelier Exclusive</span>
          </div>

          <h2 className="text-3xl font-serif font-bold text-[#351016]">
            Schedule Your Bespoke Bridal Atelier Consultation
          </h2>

          <p className="text-xs sm:text-sm text-[#5C453E] leading-relaxed">
            Our Senior Artistry Directors in Mumbai and Delhi provide 1-on-1 virtual or atelier consultations
            to curate your bespoke trousseau, undertake chromatic skin mapping, and match waterproof bridal lipsticks.
          </p>

          <div className="space-y-2 text-xs text-gray-700">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-[#D4AF37]" />
              <span>Complimentary customized shade swatch test pack sent to your address</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-[#D4AF37]" />
              <span>Personalized wedding beauty timeline from 6 months prior to D-Day</span>
            </div>
          </div>
        </div>

        <div className="lg:col-span-6 bg-white p-6 sm:p-8 rounded-2xl border border-[#D9C8AF] shadow-md">
          {isBooked ? (
            <div className="text-center py-8 space-y-3">
              <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <h3 className="font-serif font-bold text-xl text-[#351016]">Consultation Confirmed</h3>
              <p className="text-xs text-gray-600 max-w-sm mx-auto">
                Thank you, {brideName}! Our Bridal Concierge will call you at +91 {phone} to confirm your appointment slot.
              </p>
            </div>
          ) : (
            <form onSubmit={handleBooking} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-gray-700 mb-1">Bride's Full Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Radhika Merchant"
                  value={brideName}
                  onChange={(e) => setBrideName(e.target.value)}
                  className="w-full px-3 py-2 bg-[#FCF9F5] border border-[#D9C8AF] rounded-lg focus:outline-none focus:border-[#4A0E17]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-gray-700 mb-1">Wedding Date *</label>
                  <input
                    type="date"
                    required
                    value={weddingDate}
                    onChange={(e) => setWeddingDate(e.target.value)}
                    className="w-full px-3 py-2 bg-[#FCF9F5] border border-[#D9C8AF] rounded-lg focus:outline-none focus:border-[#4A0E17]"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-gray-700 mb-1">Wedding Destination *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Udaipur, Mumbai"
                    value={weddingCity}
                    onChange={(e) => setWeddingCity(e.target.value)}
                    className="w-full px-3 py-2 bg-[#FCF9F5] border border-[#D9C8AF] rounded-lg focus:outline-none focus:border-[#4A0E17]"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-gray-700 mb-1">WhatsApp / Phone Number *</label>
                <input
                  type="tel"
                  required
                  maxLength={10}
                  placeholder="10-digit mobile number"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full px-3 py-2 bg-[#FCF9F5] border border-[#D9C8AF] rounded-lg focus:outline-none focus:border-[#4A0E17]"
                />
              </div>

              <div>
                <label className="block font-semibold text-gray-700 mb-1">Trousseau Notes & Concerns</label>
                <textarea
                  rows={2}
                  placeholder="e.g. Sensitive dry skin, looking for heavy humidity resistance..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full px-3 py-2 bg-[#FCF9F5] border border-[#D9C8AF] rounded-lg focus:outline-none focus:border-[#4A0E17]"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-[#4A0E17] hover:bg-[#621420] text-white rounded-full font-bold uppercase tracking-wider text-xs shadow-md transition-colors"
              >
                Book Atelier Appointment
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
