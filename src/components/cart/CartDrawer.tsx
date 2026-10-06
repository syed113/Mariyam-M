import React, { useState } from 'react';
import {
  X,
  ShoppingBag,
  Trash2,
  ArrowRight,
  Sparkles,
  Tag,
  Truck,
  CheckCircle2
} from 'lucide-react';
import { useStore } from '../../context/StoreContext';

interface CartDrawerProps {
  onProceedToCheckout: () => void;
  onExploreProducts: () => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  onProceedToCheckout,
  onExploreProducts
}) => {
  const {
    isCartOpen,
    setIsCartOpen,
    cart,
    removeFromCart,
    updateCartQuantity,
    appliedCoupon,
    applyCoupon,
    removeCoupon,
    cartSubtotal,
    discountTotal,
    shippingFee,
    grandTotal,
    freeShippingThreshold,
    amountNeededForFreeShipping
  } = useStore();

  const [couponInput, setCouponInput] = useState('');
  const [couponError, setCouponError] = useState('');

  if (!isCartOpen) return null;

  const handleApplyCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    setCouponError('');
    if (!couponInput.trim()) return;

    const res = await applyCoupon(couponInput);
    if (!res.success) {
      setCouponError(res.message);
    } else {
      setCouponInput('');
    }
  };

  const freeShippingProgress = Math.min(100, Math.round((cartSubtotal / freeShippingThreshold) * 100));

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/60 backdrop-blur-xs flex justify-end">
      <div className="w-full max-w-md bg-[#FCF9F5] h-full shadow-2xl flex flex-col border-l border-[#E8DAC2]">
        {/* Drawer Header */}
        <div className="p-4 sm:p-5 border-b border-[#E8DAC2] bg-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-[#4A0E17]" />
            <h3 className="font-serif font-bold text-lg text-[#351016]">
              Your Luxury Bag ({cart.reduce((total, i) => total + i.quantity, 0)})
            </h3>
          </div>
          <button
            onClick={() => setIsCartOpen(false)}
            className="w-8 h-8 rounded-full bg-[#FAF5EC] hover:bg-[#F3EAD8] flex items-center justify-center text-gray-700 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Free Shipping Progress Indicator */}
        <div className="bg-[#FAF5EC] px-5 py-3 border-b border-[#E8DAC2] space-y-1.5">
          <div className="flex items-center justify-between text-xs">
            <span className="text-[#5C453E] font-medium flex items-center gap-1.5">
              <Truck className="w-4 h-4 text-[#D4AF37]" />
              {amountNeededForFreeShipping === 0 ? (
                <span className="font-bold text-emerald-800">You unlocked Free Express Shipping!</span>
              ) : (
                <span>Add ₹{amountNeededForFreeShipping.toLocaleString('en-IN')} for Free Express Shipping</span>
              )}
            </span>
            <span className="text-[11px] font-bold text-[#A37B30]">{freeShippingProgress}%</span>
          </div>

          <div className="w-full h-1.5 bg-gray-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-[#D4AF37] to-[#4A0E17] transition-all duration-500 rounded-full"
              style={{ width: `${freeShippingProgress}%` }}
            />
          </div>
        </div>

        {/* Cart Items List */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4">
          {cart.length === 0 ? (
            <div className="py-16 text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-[#FAF5EC] border border-[#E8DAC2] flex items-center justify-center mx-auto text-[#8E7E73]">
                <ShoppingBag className="w-8 h-8" />
              </div>
              <h4 className="font-serif font-bold text-lg text-[#351016]">Your Bag is Empty</h4>
              <p className="text-xs text-[#735D55] max-w-xs mx-auto">
                Explore our Royal Silk foundations, liquid velvet lipsticks, and ceramide elixirs.
              </p>
              <button
                onClick={() => {
                  setIsCartOpen(false);
                  onExploreProducts();
                }}
                className="px-6 py-2.5 bg-[#4A0E17] text-white rounded-full text-xs font-bold uppercase tracking-wider hover:bg-[#621420] transition-colors shadow-sm"
              >
                Explore Catalog
              </button>
            </div>
          ) : (
            cart.map(item => (
              <div
                key={`${item.productId}-${item.selectedShade?.id || 'none'}`}
                className="bg-white border border-[#E8DAC2] rounded-2xl p-3.5 flex gap-3 shadow-xs relative"
              >
                <img
                  src={item.product.primaryImage}
                  alt={item.product.name}
                  className="w-20 h-20 object-cover rounded-xl border border-gray-100 shrink-0"
                />

                <div className="flex-1 min-w-0 flex flex-col justify-between">
                  <div className="space-y-0.5">
                    <span className="text-[10px] font-bold text-[#A37B30] uppercase tracking-wider">
                      {item.product.brand}
                    </span>
                    <h5 className="text-xs font-semibold text-[#201815] truncate">
                      {item.product.name}
                    </h5>

                    {item.selectedShade && (
                      <div className="flex items-center gap-1.5 text-[11px] text-gray-600">
                        <span
                          className="w-3 h-3 rounded-full border border-black/10 shrink-0"
                          style={{ backgroundColor: item.selectedShade.hexCode }}
                        />
                        <span className="truncate">{item.selectedShade.name}</span>
                      </div>
                    )}
                  </div>

                  <div className="flex items-center justify-between pt-2">
                    <span className="text-xs font-bold text-[#4A0E17]">
                      ₹{(item.price * item.quantity).toLocaleString('en-IN')}
                    </span>

                    {/* Quantity Selector */}
                    <div className="flex items-center border border-[#D9C8AF] rounded-full bg-[#FCF9F5]">
                      <button
                        onClick={() => updateCartQuantity(item.productId, item.quantity - 1, item.selectedShade?.id)}
                        className="px-2.5 py-0.5 text-xs text-gray-600 hover:text-black font-bold"
                      >
                        -
                      </button>
                      <span className="px-1 text-xs font-semibold">{item.quantity}</span>
                      <button
                        onClick={() => updateCartQuantity(item.productId, item.quantity + 1, item.selectedShade?.id)}
                        className="px-2.5 py-0.5 text-xs text-gray-600 hover:text-black font-bold"
                      >
                        +
                      </button>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => removeFromCart(item.productId, item.selectedShade?.id)}
                  className="text-gray-400 hover:text-red-600 p-1 self-start transition-colors"
                  title="Remove"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ))
          )}
        </div>

        {/* Footer Area: Coupons, Summary & Checkout */}
        {cart.length > 0 && (
          <div className="border-t border-[#E8DAC2] bg-white p-4 sm:p-5 space-y-4">
            {/* Coupon Code Section */}
            <div>
              {appliedCoupon ? (
                <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-2.5 flex items-center justify-between text-xs text-emerald-800">
                  <div className="flex items-center gap-1.5">
                    <Tag className="w-3.5 h-3.5 text-emerald-600" />
                    <span>
                      Coupon <strong className="font-mono">{appliedCoupon.code}</strong> applied (-₹{discountTotal.toLocaleString('en-IN')})
                    </span>
                  </div>
                  <button onClick={removeCoupon} className="text-emerald-700 font-bold hover:underline">
                    Remove
                  </button>
                </div>
              ) : (
                <form onSubmit={handleApplyCoupon} className="space-y-1">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Enter Coupon (e.g. WELCOME10)"
                      value={couponInput}
                      onChange={(e) => setCouponInput(e.target.value)}
                      className="flex-1 px-3 py-1.5 bg-[#FCF9F5] border border-[#D9C8AF] rounded-lg text-xs uppercase placeholder:normal-case focus:outline-none focus:border-[#4A0E17]"
                    />
                    <button
                      type="submit"
                      className="px-4 py-1.5 bg-[#4A0E17] hover:bg-[#621420] text-white rounded-lg text-xs font-semibold transition-colors"
                    >
                      Apply
                    </button>
                  </div>
                  {couponError && <p className="text-[11px] text-red-600">{couponError}</p>}
                </form>
              )}
            </div>

            {/* Price Breakdown */}
            <div className="space-y-1.5 text-xs text-[#5C453E] border-t border-gray-100 pt-3">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>₹{cartSubtotal.toLocaleString('en-IN')}</span>
              </div>
              {discountTotal > 0 && (
                <div className="flex justify-between text-emerald-700 font-medium">
                  <span>Savings / Coupon</span>
                  <span>-₹{discountTotal.toLocaleString('en-IN')}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span>Express Shipping</span>
                <span>{shippingFee === 0 ? <strong className="text-emerald-700">FREE</strong> : `₹${shippingFee}`}</span>
              </div>
              <div className="flex justify-between text-sm font-bold text-[#351016] border-t border-[#F0E4D2] pt-2">
                <span>Total Amount</span>
                <span>₹{grandTotal.toLocaleString('en-IN')}</span>
              </div>
            </div>

            {/* Checkout Button */}
            <button
              onClick={() => {
                setIsCartOpen(false);
                onProceedToCheckout();
              }}
              className="w-full py-3.5 bg-[#4A0E17] hover:bg-[#621420] text-white rounded-full text-xs font-bold uppercase tracking-[0.18em] transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2"
            >
              <span>Proceed to Checkout</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
