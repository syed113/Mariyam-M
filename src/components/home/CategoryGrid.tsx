import React from 'react';
import { ArrowUpRight, Sparkles } from 'lucide-react';

interface CategoryGridProps {
  onSelectCategory: (category: string) => void;
  onOpenBridal: () => void;
}

export const CategoryGrid: React.FC<CategoryGridProps> = ({
  onSelectCategory,
  onOpenBridal
}) => {
  const categories = [
    {
      title: 'Royal Silk Complexion',
      subtitle: '8 shades calibrated for Indian undertones',
      image: 'https://images.unsplash.com/photo-1616683693504-3ea7e9ad6fec?auto=format&fit=crop&w=800&q=80',
      action: () => onSelectCategory('Makeup'),
      tag: 'Foundation & Concealer'
    },
    {
      title: 'Hydra-Velvet Lipsticks',
      subtitle: '12-hr transfer-proof festive shades',
      image: 'https://images.unsplash.com/photo-1586495777744-4413f21062fa?auto=format&fit=crop&w=800&q=80',
      action: () => onSelectCategory('Makeup'),
      tag: 'Lip Atelier'
    },
    {
      title: 'Barrier Repair & Glaze',
      subtitle: '5 Ceramides, Peptides & Bakuchiol',
      image: 'https://images.unsplash.com/photo-1601049541289-9b1b7bbbfe19?auto=format&fit=crop&w=800&q=80',
      action: () => onSelectCategory('Skincare'),
      tag: 'Prestige Skincare'
    },
    {
      title: 'Oud & Taif Rose Royale',
      subtitle: 'Handcrafted extrait de parfum with 25% oil',
      image: 'https://images.unsplash.com/photo-1547887537-6158d64c35b3?auto=format&fit=crop&w=800&q=80',
      action: () => onSelectCategory('Fragrance'),
      tag: 'Haute Parfumerie'
    },
    {
      title: 'Bridal Atelier Trousseau',
      subtitle: 'Bespoke bridal consults & wedding glow',
      image: 'https://images.unsplash.com/photo-1583241800698-e8ab01c85b27?auto=format&fit=crop&w=800&q=80',
      action: onOpenBridal,
      tag: 'Artisanal Bridal'
    }
  ];

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="text-center space-y-2 mb-12">
        <span className="text-xs font-semibold tracking-[0.25em] text-[#D4AF37] uppercase">
          Curated Departments
        </span>
        <h2 className="text-3xl sm:text-4xl font-serif font-bold text-[#351016]">
          Shop by Haute Categories
        </h2>
        <p className="text-xs sm:text-sm text-[#735D55] max-w-lg mx-auto">
          Tailored specifically for Indian climates, diverse depths of melanin, and matrimonial opulence.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {categories.map((cat, idx) => (
          <div
            key={cat.title}
            onClick={cat.action}
            className={`group relative overflow-hidden rounded-2xl cursor-pointer shadow-md hover:shadow-xl transition-all duration-500 bg-[#FCF9F5] border border-[#E8DAC2] ${
              idx === 0 ? 'sm:col-span-2 lg:col-span-1' : ''
            }`}
          >
            <div className="h-64 sm:h-72 overflow-hidden relative">
              <img
                src={cat.image}
                alt={cat.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent"></div>

              {/* Tag pill */}
              <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-md px-3 py-1 rounded-full text-[10px] font-bold text-[#4A0E17] tracking-wider uppercase">
                {cat.tag}
              </div>

              {/* Bottom Details */}
              <div className="absolute bottom-4 left-4 right-4 text-white flex items-end justify-between">
                <div>
                  <h3 className="text-lg sm:text-xl font-serif font-bold group-hover:text-[#F3DE9C] transition-colors">
                    {cat.title}
                  </h3>
                  <p className="text-xs text-gray-200 mt-0.5 line-clamp-1">{cat.subtitle}</p>
                </div>

                <div className="w-8 h-8 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white group-hover:bg-[#D4AF37] group-hover:text-black transition-colors shrink-0">
                  <ArrowUpRight className="w-4 h-4" />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
