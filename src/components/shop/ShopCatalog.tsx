import React, { useState, useMemo } from 'react';
import {
  Filter,
  SlidersHorizontal,
  Search,
  Star,
  ShoppingBag,
  Heart,
  Sparkles,
  X,
  ChevronDown
} from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { Product, ProductShade } from '../../types';

interface ShopCatalogProps {
  selectedCategory: string;
  setSelectedCategory: (cat: string) => void;
}

export const ShopCatalog: React.FC<ShopCatalogProps> = ({
  selectedCategory,
  setSelectedCategory
}) => {
  const {
    products,
    addToCart,
    toggleWishlist,
    isWishlisted,
    setActiveProductModal,
    setIsShadeStudioOpen
  } = useStore();

  // Filters state
  const [selectedBrand, setSelectedBrand] = useState<string>('All');
  const [selectedSubcategory, setSelectedSubcategory] = useState<string>('All');
  const [selectedUndertone, setSelectedUndertone] = useState<string>('All');
  const [selectedSkinType, setSelectedSkinType] = useState<string>('All');
  const [selectedFinish, setSelectedFinish] = useState<string>('All');
  const [priceRange, setPriceRange] = useState<string>('All');
  const [sortBy, setSortBy] = useState<string>('featured');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

  // Selected shades for product card preview
  const [activeCardShades, setActiveCardShades] = useState<Record<string, ProductShade>>({});

  // Derived filter options
  const brands = useMemo(() => {
    const list = Array.from(new Set(products.map(p => p.brand)));
    return ['All', ...list];
  }, [products]);

  const subcategories = useMemo(() => {
    const relevantProds = selectedCategory === 'All'
      ? products
      : products.filter(p => p.department === selectedCategory);
    const list = Array.from(new Set(relevantProds.map(p => p.subcategory)));
    return ['All', ...list];
  }, [products, selectedCategory]);

  // Filtering & Sorting logic
  const filteredProducts = useMemo(() => {
    return products.filter(product => {
      // Category / Department
      if (selectedCategory !== 'All' && product.department !== selectedCategory) {
        return false;
      }
      // Subcategory
      if (selectedSubcategory !== 'All' && product.subcategory !== selectedSubcategory) {
        return false;
      }
      // Brand
      if (selectedBrand !== 'All' && product.brand !== selectedBrand) {
        return false;
      }
      // Undertone
      if (selectedUndertone !== 'All') {
        if (!product.undertones || !product.undertones.includes(selectedUndertone as any)) {
          return false;
        }
      }
      // Skin Type
      if (selectedSkinType !== 'All') {
        if (!product.skinTypeCompatibility || !product.skinTypeCompatibility.includes(selectedSkinType as any)) {
          return false;
        }
      }
      // Finish
      if (selectedFinish !== 'All' && product.finish !== selectedFinish) {
        return false;
      }
      // Price range
      if (priceRange === 'under-999' && product.price >= 999) return false;
      if (priceRange === '999-1999' && (product.price < 999 || product.price > 1999)) return false;
      if (priceRange === '2000-above' && product.price < 2000) return false;

      // Search Query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchesName = product.name.toLowerCase().includes(q);
        const matchesBrand = product.brand.toLowerCase().includes(q);
        const matchesDept = product.department?.toLowerCase().includes(q);
        const matchesSubcat = product.subcategory.toLowerCase().includes(q);
        const matchesSku = product.sku?.toLowerCase().includes(q);
        const matchesBenefit = product.benefits?.some(b => b.toLowerCase().includes(q));
        const matchesTag = product.tags?.some(t => t.toLowerCase().includes(q));
        const matchesShade = product.shades?.some(s => s.name.toLowerCase().includes(q) || s.undertone.toLowerCase().includes(q));
        const matchesIngredient = product.keyIngredients?.some(k => k.toLowerCase().includes(q));
        const matchesDesc = (product.shortDescription || product.fullDescription || product.seoDescription)?.toLowerCase().includes(q);

        if (!matchesName && !matchesBrand && !matchesDept && !matchesSubcat && !matchesSku && !matchesBenefit && !matchesTag && !matchesShade && !matchesIngredient && !matchesDesc) {
          return false;
        }
      }

      return true;
    }).sort((a, b) => {
      if (sortBy === 'price-low') return a.price - b.price;
      if (sortBy === 'price-high') return b.price - a.price;
      if (sortBy === 'rating') return b.rating - a.rating;
      if (sortBy === 'discount') return (b.discountPercent || 0) - (a.discountPercent || 0);
      return (b.isBestseller ? 1 : 0) - (a.isBestseller ? 1 : 0);
    });
  }, [
    products,
    selectedCategory,
    selectedSubcategory,
    selectedBrand,
    selectedUndertone,
    selectedSkinType,
    selectedFinish,
    priceRange,
    searchQuery,
    sortBy
  ]);

  const clearAllFilters = () => {
    setSelectedCategory('All');
    setSelectedBrand('All');
    setSelectedSubcategory('All');
    setSelectedUndertone('All');
    setSelectedSkinType('All');
    setSelectedFinish('All');
    setPriceRange('All');
    setSearchQuery('');
  };

  const hasActiveFilters =
    selectedCategory !== 'All' ||
    selectedBrand !== 'All' ||
    selectedSubcategory !== 'All' ||
    selectedUndertone !== 'All' ||
    selectedSkinType !== 'All' ||
    selectedFinish !== 'All' ||
    priceRange !== 'All' ||
    searchQuery.trim() !== '';

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Catalog Header & Breadcrumb */}
      <div className="mb-6 space-y-1">
        <div className="text-xs text-[#8E7E73] flex items-center gap-1.5 uppercase tracking-wider">
          <span>Atelier</span>
          <span>/</span>
          <span className="text-[#4A0E17] font-semibold">{selectedCategory}</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-serif font-bold text-[#351016]">
          {selectedCategory === 'All' ? 'The Complete Prestige Atelier' : `${selectedCategory} Formulations`}
        </h1>
        <p className="text-xs sm:text-sm text-[#735D55]">
          Certified authentic formulations engineered for performance, pigmentation, and Indian skin tones.
        </p>
      </div>

      {/* Filter Bar Controls & Search (Desktop + Mobile) */}
      <div className="bg-white border border-[#E8DAC2] rounded-2xl p-4 mb-8 shadow-xs flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Search input in catalog */}
        <div className="relative w-full md:w-80">
          <input
            type="text"
            placeholder="Search within catalog..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-[#FCF9F5] border border-[#D9C8AF] rounded-full text-xs placeholder:text-[#8E7E73] text-[#201815] focus:outline-none focus:ring-1 focus:ring-[#D4AF37]"
          />
          <Search className="w-4 h-4 text-[#8E7E73] absolute left-3 top-1/2 -translate-y-1/2" />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-400 hover:text-gray-600"
            >
              ✕
            </button>
          )}
        </div>

        {/* Filter Trigger (Mobile) & Sort */}
        <div className="flex items-center justify-between w-full md:w-auto gap-3">
          <button
            onClick={() => setIsMobileFilterOpen(true)}
            className="md:hidden flex items-center gap-1.5 px-4 py-2 bg-[#FCF9F5] border border-[#D9C8AF] rounded-full text-xs font-semibold text-[#4A0E17]"
          >
            <SlidersHorizontal className="w-3.5 h-3.5" />
            <span>Filters {hasActiveFilters && '• Active'}</span>
          </button>

          <div className="flex items-center gap-2 text-xs">
            <span className="text-[#8E7E73] hidden sm:inline">Sort By:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-[#FCF9F5] border border-[#D9C8AF] rounded-full px-3 py-1.5 text-xs font-medium text-[#201815] focus:outline-none focus:border-[#D4AF37]"
            >
              <option value="featured">Featured & Bestsellers</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="rating">Highest Rated</option>
              <option value="discount">Biggest Discount</option>
            </select>
          </div>
        </div>
      </div>

      {/* Active Filter Pills Bar */}
      {hasActiveFilters && (
        <div className="flex flex-wrap items-center gap-2 mb-6 text-xs">
          <span className="text-[#8E7E73] font-medium">Applied Filters:</span>
          {selectedCategory !== 'All' && (
            <span className="inline-flex items-center gap-1 bg-[#4A0E17]/10 text-[#4A0E17] font-semibold px-2.5 py-1 rounded-full">
              Category: {selectedCategory}
              <button onClick={() => setSelectedCategory('All')}>✕</button>
            </span>
          )}
          {selectedBrand !== 'All' && (
            <span className="inline-flex items-center gap-1 bg-[#4A0E17]/10 text-[#4A0E17] font-semibold px-2.5 py-1 rounded-full">
              Brand: {selectedBrand}
              <button onClick={() => setSelectedBrand('All')}>✕</button>
            </span>
          )}
          {selectedSubcategory !== 'All' && (
            <span className="inline-flex items-center gap-1 bg-[#4A0E17]/10 text-[#4A0E17] font-semibold px-2.5 py-1 rounded-full">
              Type: {selectedSubcategory}
              <button onClick={() => setSelectedSubcategory('All')}>✕</button>
            </span>
          )}
          {selectedUndertone !== 'All' && (
            <span className="inline-flex items-center gap-1 bg-[#D4AF37]/20 text-[#8A5A2B] font-semibold px-2.5 py-1 rounded-full">
              Undertone: {selectedUndertone}
              <button onClick={() => setSelectedUndertone('All')}>✕</button>
            </span>
          )}
          {priceRange !== 'All' && (
            <span className="inline-flex items-center gap-1 bg-[#4A0E17]/10 text-[#4A0E17] font-semibold px-2.5 py-1 rounded-full">
              Price: {priceRange}
              <button onClick={() => setPriceRange('All')}>✕</button>
            </span>
          )}
          <button
            onClick={clearAllFilters}
            className="text-[#4A0E17] hover:underline font-bold text-xs ml-2"
          >
            Clear All
          </button>
        </div>
      )}

      {/* Main Grid + Sidebar Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Desktop Sidebar Filters */}
        <aside className="hidden md:block space-y-6 bg-white border border-[#E8DAC2] p-5 rounded-2xl h-fit">
          <div className="flex items-center justify-between pb-3 border-b border-[#F0E4D2]">
            <h3 className="font-serif font-bold text-base text-[#351016]">Refine Atelier</h3>
            {hasActiveFilters && (
              <button onClick={clearAllFilters} className="text-[11px] text-[#A37B30] hover:underline">
                Reset
              </button>
            )}
          </div>

          {/* Department Filter */}
          <div className="space-y-2">
            <h4 className="text-xs uppercase font-bold tracking-wider text-[#735D55]">Department</h4>
            <div className="space-y-1">
              {['All', 'Makeup', 'Skincare', 'Fragrance', 'Tools & Brushes', 'Bath & Body'].map(cat => (
                <button
                  key={cat}
                  onClick={() => {
                    setSelectedCategory(cat);
                    setSelectedSubcategory('All');
                  }}
                  className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                    selectedCategory === cat ? 'bg-[#4A0E17] text-white font-bold' : 'text-[#4A3831] hover:bg-[#FCF9F5]'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Subcategory */}
          {subcategories.length > 2 && (
            <div className="space-y-2 pt-3 border-t border-[#F0E4D2]">
              <h4 className="text-xs uppercase font-bold tracking-wider text-[#735D55]">Product Type</h4>
              <div className="space-y-1 max-h-40 overflow-y-auto pr-1">
                {subcategories.map(sub => (
                  <button
                    key={sub}
                    onClick={() => setSelectedSubcategory(sub)}
                    className={`w-full text-left px-2.5 py-1 rounded-lg text-xs transition-colors ${
                      selectedSubcategory === sub ? 'bg-[#D4AF37]/20 text-[#4A0E17] font-bold' : 'text-[#5C453E] hover:bg-[#FCF9F5]'
                    }`}
                  >
                    {sub}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Brand Filter */}
          <div className="space-y-2 pt-3 border-t border-[#F0E4D2]">
            <h4 className="text-xs uppercase font-bold tracking-wider text-[#735D55]">Brand / House</h4>
            <div className="space-y-1 max-h-44 overflow-y-auto pr-1">
              {brands.map(brand => (
                <button
                  key={brand}
                  onClick={() => setSelectedBrand(brand)}
                  className={`w-full text-left px-2.5 py-1 rounded-lg text-xs transition-colors ${
                    selectedBrand === brand ? 'bg-[#D4AF37]/20 text-[#4A0E17] font-bold' : 'text-[#5C453E] hover:bg-[#FCF9F5]'
                  }`}
                >
                  {brand}
                </button>
              ))}
            </div>
          </div>

          {/* Undertone Filter */}
          <div className="space-y-2 pt-3 border-t border-[#F0E4D2]">
            <h4 className="text-xs uppercase font-bold tracking-wider text-[#735D55]">Indian Undertone</h4>
            <div className="grid grid-cols-2 gap-1.5">
              {[
                { label: 'All', value: 'All' },
                { label: 'Warm Golden', value: 'warm' },
                { label: 'Natural Olive', value: 'olive' },
                { label: 'Neutral', value: 'neutral' },
                { label: 'Cool Rosy', value: 'cool' }
              ].map(u => (
                <button
                  key={u.value}
                  onClick={() => setSelectedUndertone(u.value)}
                  className={`px-2 py-1 rounded-md text-[11px] font-medium border text-center transition-all ${
                    selectedUndertone === u.value
                      ? 'bg-[#4A0E17] text-white border-[#4A0E17]'
                      : 'border-gray-200 text-[#5C453E] hover:border-[#D4AF37]'
                  }`}
                >
                  {u.label}
                </button>
              ))}
            </div>
          </div>

          {/* Price Range */}
          <div className="space-y-2 pt-3 border-t border-[#F0E4D2]">
            <h4 className="text-xs uppercase font-bold tracking-wider text-[#735D55]">Price (INR)</h4>
            <div className="space-y-1">
              {[
                { label: 'All Prices', value: 'All' },
                { label: 'Under ₹999', value: 'under-999' },
                { label: '₹999 - ₹1,999', value: '999-1999' },
                { label: '₹2,000 & Above (Prestige)', value: '2000-above' }
              ].map(p => (
                <button
                  key={p.value}
                  onClick={() => setPriceRange(p.value)}
                  className={`w-full text-left px-2.5 py-1 rounded-lg text-xs transition-colors ${
                    priceRange === p.value ? 'bg-[#D4AF37]/20 text-[#4A0E17] font-bold' : 'text-[#5C453E] hover:bg-[#FCF9F5]'
                  }`}
                >
                  {p.label}
                </button>
              ))}
            </div>
          </div>

          {/* AI Shade Studio Quick Prompt */}
          <div className="pt-4 border-t border-[#F0E4D2]">
            <div className="p-3 bg-gradient-to-br from-[#FAF5EC] to-[#F5ECE0] rounded-xl border border-[#D4AF37]/40 text-center space-y-2">
              <Sparkles className="w-5 h-5 text-[#D4AF37] mx-auto" />
              <h5 className="text-xs font-serif font-bold text-[#4A0E17]">Not sure of your shade?</h5>
              <p className="text-[10px] text-[#735D55]">Let our AI vision agent match your undertone in 60 seconds.</p>
              <button
                onClick={() => setIsShadeStudioOpen(true)}
                className="w-full py-1.5 bg-[#4A0E17] text-white rounded-full text-[11px] font-semibold hover:bg-[#621420] transition-colors"
              >
                Launch Studio
              </button>
            </div>
          </div>
        </aside>

        {/* Product Grid (3 cols on desktop) */}
        <main className="lg:col-span-3">
          <div className="mb-4 flex items-center justify-between text-xs text-[#735D55]">
            <span>Showing <strong className="text-[#201815]">{filteredProducts.length}</strong> creations</span>
            <span>Free Express Shipping on orders over ₹999</span>
          </div>

          {filteredProducts.length === 0 ? (
            <div className="bg-white border border-[#E8DAC2] rounded-2xl p-12 text-center space-y-4">
              <div className="w-12 h-12 rounded-full bg-[#F5ECE0] flex items-center justify-center mx-auto text-[#8E7E73]">
                <Search className="w-6 h-6" />
              </div>
              <h3 className="font-serif font-bold text-xl text-[#351016]">No matching formulations found</h3>
              <p className="text-xs text-[#735D55] max-w-sm mx-auto">
                Try loosening your filters or searching for terms like "Foundation", "Lipstick", "Rose", or "Saffron".
              </p>
              <button
                onClick={clearAllFilters}
                className="px-6 py-2 bg-[#4A0E17] text-white rounded-full text-xs font-semibold uppercase tracking-wider hover:bg-[#621420] transition-colors"
              >
                Clear Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
              {filteredProducts.map(product => {
                const activeShade = activeCardShades[product.id] || (product.shades ? product.shades[0] : undefined);
                const wishlisted = isWishlisted(product.id);

                return (
                  <div
                    key={product.id}
                    onClick={() => setActiveProductModal(product)}
                    className="group bg-white border border-[#E8DAC2] rounded-2xl overflow-hidden shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col cursor-pointer relative"
                  >
                    {/* Image Area */}
                    <div className="relative aspect-square overflow-hidden bg-[#FAF5EC]">
                      <img
                        src={product.primaryImage}
                        alt={product.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />

                      {product.discountPercent && (
                        <div className="absolute top-2.5 left-2.5 bg-[#4A0E17] text-[#FCF9F5] text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
                          {product.discountPercent}% Off
                        </div>
                      )}

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleWishlist(product.id);
                        }}
                        className="absolute top-2.5 right-2.5 w-8 h-8 rounded-full bg-white/90 backdrop-blur-md shadow-xs flex items-center justify-center text-[#4A0E17] hover:bg-white hover:scale-110 transition-all"
                      >
                        <Heart className={`w-4 h-4 ${wishlisted ? 'fill-[#4A0E17]' : ''}`} />
                      </button>

                      {product.stockCount <= 20 && (
                        <div className="absolute bottom-2.5 left-2.5 bg-amber-900/80 backdrop-blur-md text-amber-100 text-[9px] font-semibold px-2 py-0.5 rounded-full">
                          Only {product.stockCount} left
                        </div>
                      )}
                    </div>

                    {/* Content Area */}
                    <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                      <div>
                        <div className="flex items-center justify-between text-[11px] mb-1">
                          <span className="font-semibold text-[#A37B30] uppercase tracking-wider text-[10px]">
                            {product.brand}
                          </span>
                          <div className="flex items-center gap-1 text-[#4A0E17] font-medium text-[11px]">
                            <Star className="w-3 h-3 fill-[#D4AF37] text-[#D4AF37]" />
                            <span>{product.rating}</span>
                            <span className="text-gray-400">({product.reviewCount})</span>
                          </div>
                        </div>

                        <h3 className="text-xs sm:text-sm font-medium text-[#201815] line-clamp-2 group-hover:text-[#4A0E17] transition-colors leading-snug">
                          {product.name}
                        </h3>
                      </div>

                      {/* Swatches preview if shades exist */}
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
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setActiveCardShades(prev => ({ ...prev, [product.id]: shade }));
                                }}
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
          )}
        </main>
      </div>

      {/* Mobile Filters Drawer */}
      {isMobileFilterOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex justify-end">
          <div className="w-full max-w-xs bg-white h-full p-6 overflow-y-auto space-y-6">
            <div className="flex items-center justify-between border-b pb-4">
              <h3 className="font-serif font-bold text-lg text-[#4A0E17]">Filters</h3>
              <button onClick={() => setIsMobileFilterOpen(false)}>
                <X className="w-6 h-6 text-gray-500" />
              </button>
            </div>

            <div className="space-y-4 text-xs">
              <div>
                <h4 className="font-bold text-gray-700 mb-2 uppercase tracking-wider">Department</h4>
                <div className="space-y-1">
                  {['All', 'Makeup', 'Skincare', 'Fragrance', 'Tools & Brushes', 'Bath & Body'].map(cat => (
                    <button
                      key={cat}
                      onClick={() => {
                        setSelectedCategory(cat);
                        setSelectedSubcategory('All');
                      }}
                      className={`block w-full text-left py-1.5 px-3 rounded-lg ${
                        selectedCategory === cat ? 'bg-[#4A0E17] text-white font-bold' : 'text-gray-700'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              <div className="border-t pt-4">
                <h4 className="font-bold text-gray-700 mb-2 uppercase tracking-wider">Undertone</h4>
                <div className="grid grid-cols-2 gap-2">
                  {['All', 'warm', 'olive', 'neutral', 'cool'].map(u => (
                    <button
                      key={u}
                      onClick={() => setSelectedUndertone(u)}
                      className={`py-1.5 px-2 rounded-lg border text-center ${
                        selectedUndertone === u ? 'bg-[#4A0E17] text-white' : 'text-gray-700'
                      }`}
                    >
                      {u}
                    </button>
                  ))}
                </div>
              </div>

              <div className="border-t pt-4">
                <h4 className="font-bold text-gray-700 mb-2 uppercase tracking-wider">Price Range</h4>
                <div className="space-y-1">
                  {[
                    { label: 'All Prices', value: 'All' },
                    { label: 'Under ₹999', value: 'under-999' },
                    { label: '₹999 - ₹1,999', value: '999-1999' },
                    { label: '₹2,000 & Above', value: '2000-above' }
                  ].map(p => (
                    <button
                      key={p.value}
                      onClick={() => setPriceRange(p.value)}
                      className={`block w-full text-left py-1.5 px-3 rounded-lg ${
                        priceRange === p.value ? 'bg-[#D4AF37]/20 text-[#4A0E17] font-bold' : 'text-gray-700'
                      }`}
                    >
                      {p.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="pt-6 border-t flex gap-3">
              <button
                onClick={clearAllFilters}
                className="flex-1 py-2.5 border border-gray-300 rounded-full text-xs font-semibold text-gray-700"
              >
                Clear All
              </button>
              <button
                onClick={() => setIsMobileFilterOpen(false)}
                className="flex-1 py-2.5 bg-[#4A0E17] text-white rounded-full text-xs font-semibold"
              >
                Apply ({filteredProducts.length})
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
