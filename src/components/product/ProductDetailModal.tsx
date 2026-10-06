import React, { useState, useEffect } from 'react';
import {
  X,
  Star,
  Heart,
  ShoppingBag,
  Sparkles,
  Truck,
  ShieldCheck,
  Check,
  Share2,
  ChevronRight,
  Info,
  MessageSquare,
  ThumbsUp
} from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { Product, ProductShade, ProductReview } from '../../types';
import { api } from '../../services/api';

interface ProductDetailModalProps {
  product: Product | null;
  onClose: () => void;
  onBuyNow: (product: Product, shade?: ProductShade, qty?: number) => void;
}

export const ProductDetailModal: React.FC<ProductDetailModalProps> = ({
  product,
  onClose,
  onBuyNow
}) => {
  const {
    addToCart,
    toggleWishlist,
    isWishlisted,
    setIsShadeStudioOpen,
    currentUser,
    setIsAuthModalOpen,
    showToast
  } = useStore();

  if (!product) return null;

  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [selectedShade, setSelectedShade] = useState<ProductShade | undefined>(
    product.shades ? product.shades[0] : undefined
  );
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState<'benefits' | 'howTo' | 'ingredients' | 'reviews'>('benefits');
  const [pincode, setPincode] = useState('');
  const [pincodeResult, setPincodeResult] = useState<{ city?: string; days?: number; expressAvailable?: boolean } | null>(null);
  const [pincodeError, setPincodeError] = useState('');

  // Live Reviews State
  const [reviews, setReviews] = useState<ProductReview[]>([]);
  const [isAddingReview, setIsAddingReview] = useState(false);
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewTitle, setReviewTitle] = useState('');
  const [reviewComment, setReviewComment] = useState('');
  const [reviewAuthor, setReviewAuthor] = useState(currentUser?.name || '');
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);

  useEffect(() => {
    if (product) {
      setSelectedShade(product.shades ? product.shades[0] : undefined);
      setActiveImageIndex(0);
      setQuantity(1);

      // Fetch live reviews from database
      api.getProduct(product.id).then(res => {
        if (res && res.reviews) {
          setReviews(res.reviews);
        }
      }).catch(() => {});
    }
  }, [product]);

  const wishlisted = isWishlisted(product.id);
  const gallery = product.images.length > 0 ? product.images : [product.primaryImage];

  const handlePincodeCheck = async (e: React.FormEvent) => {
    e.preventDefault();
    setPincodeError('');
    if (!pincode || pincode.length !== 6 || !/^\d+$/.test(pincode)) {
      setPincodeError('Please enter a valid 6-digit Indian pincode.');
      return;
    }
    try {
      const res = await api.checkPincode(pincode);
      if (res.serviceable) {
        setPincodeResult(res);
      } else {
        setPincodeError('Location currently serviced via standard air postal parcel.');
      }
    } catch (e) {
      setPincodeResult({ city: 'Your Location', days: 3 });
    }
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: product.name,
        text: `Discover ${product.name} at Mariyam Maquillage`,
        url: window.location.href
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.href);
      showToast('Product formulation link copied to clipboard!', 'info');
    }
  };

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewComment || !reviewAuthor) {
      showToast('Please provide your name and review details', 'error');
      return;
    }

    try {
      setIsSubmittingReview(true);
      const newRev = await api.addReview(product.id, {
        author: reviewAuthor,
        rating: reviewRating,
        title: reviewTitle || 'Verified Experience',
        comment: reviewComment,
        shadeUsed: selectedShade?.name
      });
      setReviews(prev => [newRev, ...prev]);
      setIsAddingReview(false);
      setReviewComment('');
      setReviewTitle('');
      showToast('Review published to Mariyam verified reviews', 'success');
    } catch (err: any) {
      showToast(err.message || 'Failed to submit review', 'error');
    } finally {
      setIsSubmittingReview(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 lg:p-6">
      <div className="bg-[#FCF9F5] border border-[#E8DAC2] rounded-3xl max-w-4xl w-full overflow-hidden shadow-2xl relative my-auto max-h-[92vh] flex flex-col">
        {/* Top Floating Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 w-9 h-9 rounded-full bg-white/90 backdrop-blur-md text-[#201815] hover:bg-white shadow-md flex items-center justify-center transition-all"
          aria-label="Close dialog"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="overflow-y-auto p-6 sm:p-8 flex-1 grid grid-cols-1 md:grid-cols-12 gap-8">
          {/* Left Column: Image Gallery */}
          <div className="md:col-span-6 space-y-4">
            <div className="relative aspect-square rounded-2xl overflow-hidden bg-white border border-[#E8DAC2] shadow-xs">
              <img
                src={gallery[activeImageIndex] || product.primaryImage}
                alt={product.name}
                className="w-full h-full object-cover"
              />

              {product.discountPercent && (
                <div className="absolute top-3 left-3 bg-[#4A0E17] text-white text-xs font-bold px-2.5 py-1 rounded-full uppercase tracking-wider">
                  {product.discountPercent}% OFF
                </div>
              )}

              <button
                onClick={() => toggleWishlist(product.id)}
                className="absolute top-3 right-3 w-9 h-9 rounded-full bg-white/90 backdrop-blur-md shadow-sm flex items-center justify-center text-[#4A0E17] hover:scale-110 transition-all"
              >
                <Heart className={`w-4 h-4 ${wishlisted ? 'fill-[#4A0E17]' : ''}`} />
              </button>
            </div>

            {/* Thumbnail Strip */}
            {gallery.length > 1 && (
              <div className="flex gap-2 overflow-x-auto pb-1">
                {gallery.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveImageIndex(i)}
                    className={`w-16 h-16 rounded-xl overflow-hidden border-2 transition-all shrink-0 ${
                      activeImageIndex === i ? 'border-[#4A0E17] scale-105' : 'border-transparent opacity-70 hover:opacity-100'
                    }`}
                  >
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}

            {/* Trust points under images */}
            <div className="bg-[#FAF5EC] rounded-xl p-3 border border-[#E8DAC2] text-[11px] text-[#5C453E] space-y-1.5">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-[#D4AF37]" />
                <span>100% Certified Authentic • Tested under Indian wedding lighting</span>
              </div>
              <div className="flex items-center gap-2">
                <Truck className="w-4 h-4 text-[#D4AF37]" />
                <span>Complimentary Express Shipping on orders above ₹999</span>
              </div>
            </div>
          </div>

          {/* Right Column: Details, Shades & Purchase */}
          <div className="md:col-span-6 space-y-5 flex flex-col justify-between">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold tracking-[0.2em] text-[#D4AF37] uppercase">
                  {product.brand}
                </span>
                <button
                  onClick={handleShare}
                  className="text-xs text-[#8E7E73] hover:text-[#4A0E17] flex items-center gap-1"
                >
                  <Share2 className="w-3.5 h-3.5" />
                  <span>Share</span>
                </button>
              </div>

              <h2 className="text-xl sm:text-2xl font-serif font-bold text-[#351016] leading-snug">
                {product.name}
              </h2>

              {/* Rating and Reviews */}
              <div className="flex items-center gap-2 text-xs">
                <div className="flex items-center gap-1 bg-[#4A0E17] text-white px-2 py-0.5 rounded-md font-semibold text-[11px]">
                  <span>{product.rating}</span>
                  <Star className="w-3 h-3 fill-white" />
                </div>
                <span className="text-[#8E7E73]">
                  {reviews.length || product.reviewCount} Reviews • {product.verifiedPurchaseCount || 200}+ Verified Purchases
                </span>
              </div>

              {/* Pricing */}
              <div className="py-2 border-y border-[#F0E4D2]">
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl font-bold text-[#4A0E17]">
                    ₹{product.price.toLocaleString('en-IN')}
                  </span>
                  {product.mrp > product.price && (
                    <span className="text-sm text-gray-400 line-through">
                      MRP ₹{product.mrp.toLocaleString('en-IN')}
                    </span>
                  )}
                  {product.discountPercent && (
                    <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                      Save {product.discountPercent}%
                    </span>
                  )}
                </div>
                <p className="text-[10px] text-gray-500 mt-0.5">Inclusive of all taxes & duties (Pan-India)</p>
              </div>

              {/* Short Description */}
              <p className="text-xs text-[#5C453E] leading-relaxed">
                {product.shortDescription || product.fullDescription}
              </p>

              {/* Shade Selection (if available) */}
              {product.shades && product.shades.length > 0 && (
                <div className="space-y-2 pt-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-gray-700">
                      Selected Shade: <strong className="text-[#4A0E17]">{selectedShade?.name}</strong>
                    </span>
                    <button
                      onClick={() => setIsShadeStudioOpen(true)}
                      className="text-[#A37B30] hover:text-[#4A0E17] font-bold text-xs flex items-center gap-1 group"
                    >
                      <Sparkles className="w-3 h-3 text-[#D4AF37]" />
                      <span className="underline">Find My Shade (AI)</span>
                    </button>
                  </div>

                  {selectedShade?.description && (
                    <p className="text-[11px] text-[#735D55] italic">
                      "{selectedShade.description}"
                    </p>
                  )}

                  {/* Swatches Grid */}
                  <div className="grid grid-cols-4 sm:grid-cols-4 gap-2 pt-1">
                    {product.shades.map((shade) => (
                      <button
                        key={shade.id}
                        onClick={() => setSelectedShade(shade)}
                        className={`p-1.5 rounded-xl border flex items-center gap-2 text-left transition-all ${
                          selectedShade?.id === shade.id
                            ? 'border-[#4A0E17] bg-[#4A0E17]/5 ring-1 ring-[#4A0E17]'
                            : 'border-gray-200 hover:border-gray-400 bg-white'
                        }`}
                      >
                        <span
                          className="w-5 h-5 rounded-full border border-black/10 shrink-0"
                          style={{ backgroundColor: shade.hexCode }}
                        />
                        <div className="truncate min-w-0">
                          <p className="text-[10px] font-semibold text-[#201815] truncate">{shade.name.split(' ')[0]}</p>
                          <p className="text-[9px] text-[#8E7E73] capitalize">{shade.undertone}</p>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Pincode Estimator */}
              <div className="pt-3 border-t border-[#F0E4D2]">
                <form onSubmit={handlePincodeCheck} className="flex gap-2 text-xs">
                  <div className="relative flex-1">
                    <input
                      type="text"
                      placeholder="Enter 6-digit Pincode"
                      value={pincode}
                      onChange={(e) => setPincode(e.target.value)}
                      maxLength={6}
                      className="w-full pl-8 pr-3 py-1.5 bg-white border border-[#D9C8AF] rounded-lg text-xs focus:outline-none focus:border-[#4A0E17]"
                    />
                    <Truck className="w-3.5 h-3.5 text-[#8E7E73] absolute left-2.5 top-1/2 -translate-y-1/2" />
                  </div>
                  <button
                    type="submit"
                    className="px-4 py-1.5 bg-[#4A0E17] hover:bg-[#621420] text-white rounded-lg font-semibold text-xs transition-colors"
                  >
                    Check
                  </button>
                </form>

                {pincodeResult && (
                  <p className="text-[11px] text-emerald-700 mt-1.5 font-medium flex items-center gap-1">
                    <Check className="w-3 h-3" />
                    <span>Delivery within {pincodeResult.days} business days to {pincodeResult.city}</span>
                  </p>
                )}
                {pincodeError && (
                  <p className="text-[11px] text-red-600 mt-1">{pincodeError}</p>
                )}
              </div>
            </div>

            {/* Quantity & CTA Buttons */}
            <div className="space-y-3 pt-3">
              <div className="flex items-center gap-4">
                <span className="text-xs font-semibold text-gray-700">Quantity:</span>
                <div className="flex items-center border border-[#D9C8AF] rounded-full bg-white">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="px-3 py-1 text-gray-600 hover:text-black font-bold"
                  >
                    -
                  </button>
                  <span className="px-2 text-xs font-semibold">{quantity}</span>
                  <button
                    onClick={() => setQuantity(Math.min(product.stockCount, quantity + 1))}
                    className="px-3 py-1 text-gray-600 hover:text-black font-bold"
                  >
                    +
                  </button>
                </div>
                <span className="text-[11px] text-gray-500">
                  {product.stockCount > 0 ? `${product.stockCount} in stock` : 'Out of Stock'}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => addToCart(product, selectedShade, quantity)}
                  disabled={product.stockCount === 0}
                  className="w-full py-3 bg-[#FCF9F5] border-2 border-[#4A0E17] hover:bg-[#F5ECE0] text-[#4A0E17] rounded-full text-xs font-bold uppercase tracking-wider transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  <ShoppingBag className="w-4 h-4" />
                  <span>Add to Bag</span>
                </button>

                <button
                  onClick={() => {
                    onClose();
                    onBuyNow(product, selectedShade, quantity);
                  }}
                  disabled={product.stockCount === 0}
                  className="w-full py-3 bg-[#4A0E17] hover:bg-[#621420] text-white rounded-full text-xs font-bold uppercase tracking-wider transition-colors shadow-md hover:shadow-lg flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  <span>Buy Now</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Accordion Details (Benefits, How to Use, Ingredients, Verified Reviews) */}
        <div className="border-t border-[#E8DAC2] bg-white p-6 sm:p-8">
          <div className="flex border-b border-gray-200 text-xs font-semibold gap-6">
            <button
              onClick={() => setActiveTab('benefits')}
              className={`pb-2 transition-colors ${
                activeTab === 'benefits' ? 'text-[#4A0E17] border-b-2 border-[#4A0E17] font-bold' : 'text-gray-500'
              }`}
            >
              Proven Benefits
            </button>
            <button
              onClick={() => setActiveTab('howTo')}
              className={`pb-2 transition-colors ${
                activeTab === 'howTo' ? 'text-[#4A0E17] border-b-2 border-[#4A0E17] font-bold' : 'text-gray-500'
              }`}
            >
              How to Apply
            </button>
            <button
              onClick={() => setActiveTab('ingredients')}
              className={`pb-2 transition-colors ${
                activeTab === 'ingredients' ? 'text-[#4A0E17] border-b-2 border-[#4A0E17] font-bold' : 'text-gray-500'
              }`}
            >
              Ingredients
            </button>
            <button
              onClick={() => setActiveTab('reviews')}
              className={`pb-2 transition-colors ${
                activeTab === 'reviews' ? 'text-[#4A0E17] border-b-2 border-[#4A0E17] font-bold' : 'text-gray-500'
              }`}
            >
              Verified Reviews ({reviews.length})
            </button>
          </div>

          <div className="pt-4 text-xs text-[#5C453E] leading-relaxed">
            {activeTab === 'benefits' && (
              <ul className="space-y-2 list-disc pl-5">
                {product.benefits?.map((b, i) => (
                  <li key={i}>{b}</li>
                )) || <li>Formulated with skin-loving bioactives for long-lasting performance.</li>}
              </ul>
            )}

            {activeTab === 'howTo' && (
              <p>{product.howToUse || 'Apply as desired on clean, prepped skin for seamless results.'}</p>
            )}

            {activeTab === 'ingredients' && (
              <div className="space-y-2">
                <p className="font-semibold text-gray-800">
                  Key Actives: {product.keyIngredients?.join(', ') || 'Kashmiri Saffron Bioactives, Taif Damask Rose, Botanical Peptides'}
                </p>
                <p className="text-[11px] text-gray-600 font-mono">
                  Full list: {product.ingredientsList || 'Aqua, Glycerin, Niacinamide, Taif Rose Extract, 24K Micro-Milled Gold, Botanical Squalane, Tocopherol.'}
                </p>
              </div>
            )}

            {activeTab === 'reviews' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between pb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-xl font-serif font-bold text-[#4A0E17]">{product.rating} / 5</span>
                    <div className="flex text-[#D4AF37]">
                      {'★'.repeat(Math.round(product.rating))}
                    </div>
                    <span className="text-gray-500">Based on {reviews.length} authentic purchases</span>
                  </div>

                  <button
                    onClick={() => {
                      if (!currentUser) {
                        setIsAuthModalOpen(true);
                      } else {
                        setIsAddingReview(!isAddingReview);
                      }
                    }}
                    className="px-4 py-1.5 bg-[#4A0E17] text-white rounded-full font-semibold text-xs"
                  >
                    Write a Review
                  </button>
                </div>

                {/* Add Review Form */}
                {isAddingReview && (
                  <form onSubmit={handleSubmitReview} className="p-4 bg-[#FAF5EC] border border-[#D9C8AF] rounded-2xl space-y-3">
                    <h5 className="font-serif font-bold text-sm text-[#351016]">Share Your Experience</h5>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block font-semibold mb-1">Your Name</label>
                        <input
                          type="text"
                          required
                          value={reviewAuthor}
                          onChange={e => setReviewAuthor(e.target.value)}
                          className="w-full p-2 bg-white border rounded"
                        />
                      </div>
                      <div>
                        <label className="block font-semibold mb-1">Rating</label>
                        <select
                          value={reviewRating}
                          onChange={e => setReviewRating(Number(e.target.value))}
                          className="w-full p-2 bg-white border rounded"
                        >
                          <option value="5">5 Stars - Immaculate</option>
                          <option value="4">4 Stars - Very Good</option>
                          <option value="3">3 Stars - Average</option>
                          <option value="2">2 Stars - Disappointed</option>
                          <option value="1">1 Star - Poor</option>
                        </select>
                      </div>
                    </div>
                    <div>
                      <label className="block font-semibold mb-1">Review Headline</label>
                      <input
                        type="text"
                        placeholder="e.g. Flawless match for Indian festive lights"
                        value={reviewTitle}
                        onChange={e => setReviewTitle(e.target.value)}
                        className="w-full p-2 bg-white border rounded"
                      />
                    </div>
                    <div>
                      <label className="block font-semibold mb-1">Detailed Comment</label>
                      <textarea
                        required
                        rows={3}
                        placeholder="Describe texture, wear time in humidity, shade match nuances..."
                        value={reviewComment}
                        onChange={e => setReviewComment(e.target.value)}
                        className="w-full p-2 bg-white border rounded"
                      />
                    </div>
                    <button
                      type="submit"
                      disabled={isSubmittingReview}
                      className="px-6 py-2 bg-[#4A0E17] text-white rounded-full font-bold uppercase tracking-wider"
                    >
                      {isSubmittingReview ? 'Submitting...' : 'Post Verified Review'}
                    </button>
                  </form>
                )}

                {/* Review Items */}
                <div className="space-y-3 divide-y divide-gray-100">
                  {reviews.length === 0 ? (
                    <p className="text-gray-500 py-3">No customer reviews yet. Be the first to share your formulation experience!</p>
                  ) : (
                    reviews.map(r => (
                      <div key={r.id} className="pt-3 space-y-1">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <strong className="text-gray-900">{r.author}</strong>
                            {r.verifiedPurchase && (
                              <span className="text-[10px] text-emerald-800 bg-emerald-100 px-1.5 py-0.2 rounded font-semibold">
                                Verified Purchase
                              </span>
                            )}
                          </div>
                          <span className="text-gray-400 text-[10px]">{r.date}</span>
                        </div>
                        <div className="flex items-center gap-1 text-[#D4AF37] text-[11px]">
                          {'★'.repeat(r.rating)}
                          {r.shadeUsed && <span className="text-gray-500 ml-2 font-medium">Shade: {r.shadeUsed}</span>}
                        </div>
                        <p className="font-semibold text-gray-800">{r.title}</p>
                        <p className="text-gray-600">{r.comment}</p>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
