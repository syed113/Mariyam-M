import React, { useState } from 'react';
import { Star, Heart, ShoppingBag, Sparkles, Check } from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { Product, ProductShade } from '../../types';

interface BestsellersCarouselProps {
  onViewAllClick: () => void;
}

export const BestsellersCarousel: React.FC<BestsellersCarouselProps> = ({ onViewAllClick }) => {
  const {
    products,
    addToCart,
    toggleWishlist,
    isWishlisted,
    setActiveProductModal,
    setIsShadeStudioOpen
  } = useStore();

  // Selected preview shades per product
  const [selectedShades, setSelectedShades] = useState<Record<string, ProductShade>>({});

  const bestsellers = products.filter(p => p.isBestseller).slice(0, 8);

  const handleSelectShade = (productId: string, shade: ProductShade, e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedShades(prev => ({ ...prev, [productId]: shade }));
  };

  return (
    <section className="bg-white border-y border-[#E8DAC2] py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
          <div>
            <span className="text-xs font-semibold tracking-[0.25em] text-[#D4AF37] uppercase">
              The Royal Edit
            </span>
            <h2 className="text-3xl sm:text-4xl font-serif font-bold text-[#351016] mt-1">
              Cult Bestsellers
            </h2>
            <p className="text-xs sm:text-sm text-[#735D55] mt-1">
              Most coveted luxury beauty essentials curated for endurance and radiance.
            </p>
          </div>

          <button
            onClick={onViewAllClick}
            className="self-start md:self-auto text-xs font-semibold uppercase tracking-[0.18em] text-[#4A0E17] hover:text-[#7A1E2C] border-b-2 border-[#4A0E17] pb-1 transition-colors"
          >
            View All Products →
          </button>
        </div>

        {/* Product Cards Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {bestsellers.map(product => {
            const activeShade = selectedShades[product.id] || (product.shades ? product.shades[0] : undefined);
            const wishlisted = isWishlisted(product.id);

            return (
              <div
                key={product.id}
                onClick={() => setActiveProductModal(product)}
                className="group bg-[#FCF9F5] border border-[#E8DAC2] rounded-2xl overflow-hidden shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col cursor-pointer relative"
              >
                {/* Image Container with Badges */}
                <div className="relative aspect-square overflow-hidden bg-white">
                  <img
                    src={product.primaryImage}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />

                  {/* Discount or Bestseller Badge */}
                  {product.discountPercent && (
                    <div className="absolute top-2.5 left-2.5 bg-[#4A0E17] text-[#FCF9F5] text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
                      {product.discountPercent}% Off
                    </div>
                  )}

                  {/* Wishlist Button */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleWishlist(product.id);
                    }}
                    className="absolute top-2.5 right-2.5 w-8 h-8 rounded-full bg-white/90 backdrop-blur-md shadow-xs flex items-center justify-center text-[#4A0E17] hover:bg-white hover:scale-110 transition-all"
                    title={wishlisted ? 'Remove from Wishlist' : 'Add to Wishlist'}
                  >
                    <Heart className={`w-4 h-4 ${wishlisted ? 'fill-[#4A0E17]' : ''}`} />
                  </button>

                  {/* Stock Warning Badge */}
                  {product.stockCount <= 25 && product.stockCount > 0 && (
                    <div className="absolute bottom-2.5 left-2.5 bg-amber-900/80 backdrop-blur-md text-amber-100 text-[9px] font-semibold px-2 py-0.5 rounded-full">
                      Only {product.stockCount} left
                    </div>
                  )}
                </div>

                {/* Card Content */}
                <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                  <div>
                    <div className="flex items-center justify-between text-[11px] text-[#8E7E73] mb-1">
                      <span className="font-semibold text-[#A37B30] uppercase tracking-wider text-[10px]">
                        {product.brand}
                      </span>
                      <div className="flex items-center gap-1 text-[#4A0E17] font-medium">
                        <Star className="w-3 h-3 fill-[#D4AF37] text-[#D4AF37]" />
                        <span>{product.rating}</span>
                        <span className="text-gray-400">({product.reviewCount})</span>
                      </div>
                    </div>

                    <h3 className="text-xs sm:text-sm font-medium text-[#201815] line-clamp-2 group-hover:text-[#4A0E17] transition-colors leading-snug">
                      {product.name}
                    </h3>
                  </div>

                  {/* Shade Swatch Preview if available */}
                  {product.shades && product.shades.length > 0 && (
                    <div className="space-y-1">
                      <div className="flex items-center justify-between text-[10px] text-[#735D55]">
                        <span className="truncate">Shade: <span className="font-semibold text-[#201815]">{activeShade?.name}</span></span>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setIsShadeStudioOpen(true);
                          }}
                          className="text-[#A37B30] font-bold hover:underline flex items-center gap-0.5"
                        >
                          <Sparkles className="w-2.5 h-2.5" /> Match
                        </button>
                      </div>
                      <div className="flex items-center gap-1.5 overflow-x-auto py-1">
                        {product.shades.slice(0, 5).map(shade => (
                          <button
                            key={shade.id}
                            onClick={(e) => handleSelectShade(product.id, shade, e)}
                            className={`w-4 h-4 rounded-full border transition-all ${
                              activeShade?.id === shade.id ? 'ring-2 ring-[#4A0E17] scale-110' : 'border-gray-300'
                            }`}
                            style={{ backgroundColor: shade.hexCode }}
                            title={`${shade.name} (${shade.undertone})`}
                          />
                        ))}
                        {product.shades.length > 5 && (
                          <span className="text-[10px] text-gray-500 font-medium">
                            +{product.shades.length - 5}
                          </span>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Pricing and Action */}
                  <div className="pt-2 border-t border-[#F0E4D2] flex items-center justify-between">
                    <div>
                      <div className="flex items-baseline gap-1.5">
                        <span className="text-sm sm:text-base font-bold text-[#4A0E17]">
                          ₹{product.price.toLocaleString('en-IN')}
                        </span>
                        {product.mrp > product.price && (
                          <span className="text-xs text-gray-400 line-through">
                            ₹{product.mrp.toLocaleString('en-IN')}
                          </span>
                        )}
                      </div>
                    </div>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        addToCart(product, activeShade, 1);
                      }}
                      className="p-2 sm:px-3 sm:py-1.5 bg-[#4A0E17] hover:bg-[#621420] text-white rounded-lg sm:rounded-full text-xs font-semibold flex items-center gap-1 transition-colors shadow-xs"
                      title="Add to Bag"
                    >
                      <ShoppingBag className="w-3.5 h-3.5" />
                      <span className="hidden sm:inline">Add</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
