import React, { useState, useEffect } from 'react';
import {
  X,
  ShieldCheck,
  Truck,
  CreditCard,
  QrCode,
  Building,
  CheckCircle2,
  Lock,
  ArrowRight
} from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { Order } from '../../types';
import { api } from '../../services/api';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOrderComplete: (order: Order) => void;
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({
  isOpen,
  onClose,
  onOrderComplete
}) => {
  const {
    cart,
    cartSubtotal,
    discountTotal,
    shippingFee,
    grandTotal,
    appliedCoupon,
    currentUser,
    addresses,
    createOrder,
    showToast
  } = useStore();

  if (!isOpen) return null;

  // Form Fields
  const defaultAddr = addresses.find(a => a.isDefault) || addresses[0];

  const [fullName, setFullName] = useState(currentUser?.name || defaultAddr?.fullName || '');
  const [email, setEmail] = useState(currentUser?.email || '');
  const [phone, setPhone] = useState(currentUser?.phone?.replace(/\D/g, '') || defaultAddr?.phone?.replace(/\D/g, '') || '');
  const [street, setStreet] = useState(defaultAddr?.street || '');
  const [city, setCity] = useState(defaultAddr?.city || 'Mumbai');
  const [state, setState] = useState(defaultAddr?.state || 'Maharashtra');
  const [pincode, setPincode] = useState(defaultAddr?.pincode || '');
  const [paymentMethod, setPaymentMethod] = useState<'UPI' | 'Card' | 'Netbanking' | 'COD'>('UPI');
  const [upiId, setUpiId] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvv, setCardCvv] = useState('');
  const [selectedBank, setSelectedBank] = useState('HDFC Bank');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [pincodeError, setPincodeError] = useState('');
  const [pincodeDetails, setPincodeDetails] = useState<{ city?: string; state?: string; days?: number } | null>(null);

  useEffect(() => {
    if (pincode && pincode.length === 6) {
      handlePincodeChange(pincode);
    }
  }, []);

  const handlePincodeChange = async (val: string) => {
    setPincode(val);
    setPincodeError('');
    if (val.length === 6 && /^\d+$/.test(val)) {
      try {
        const res = await api.checkPincode(val);
        if (res.serviceable && res.city) {
          setCity(res.city);
          if (res.state) setState(res.state);
          setPincodeDetails(res);
        } else {
          setPincodeError('Pincode is currently outside our temperature-controlled direct courier network.');
        }
      } catch (err) {}
    }
  };

  const handleSubmitOrder = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!fullName || !phone || !email || !street || !pincode) {
      showToast('Please fill all required shipping details', 'error');
      return;
    }

    if (pincode.length !== 6 || !/^\d{6}$/.test(pincode)) {
      setPincodeError('Please enter a valid 6-digit Indian Pincode');
      return;
    }

    if (paymentMethod === 'UPI' && !upiId.trim()) {
      showToast('Please enter your UPI ID (e.g. yourname@okhdfcbank)', 'error');
      return;
    }

    if (paymentMethod === 'Card' && (!cardNumber.trim() || !cardExpiry.trim() || !cardCvv.trim())) {
      showToast('Please enter complete card number, validity, and CVV', 'error');
      return;
    }

    if (cart.length === 0) {
      showToast('Your shopping bag is empty', 'error');
      return;
    }

    setIsSubmitting(true);

    try {
      const newOrder = await createOrder({
        items: cart,
        paymentMethod,
        shippingAddress: {
          fullName,
          phone: phone.startsWith('+91') ? phone : `+91 ${phone}`,
          email,
          street,
          city,
          state,
          pincode
        }
      });

      setIsSubmitting(false);
      onClose();
      onOrderComplete(newOrder);
      showToast(`Order ${newOrder.orderNumber} successfully booked and reserved!`, 'success');
    } catch (err: any) {
      setIsSubmitting(false);
      showToast(err.message || 'Order failed to process', 'error');
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
      <div className="bg-[#FCF9F5] border border-[#E8DAC2] rounded-3xl max-w-3xl w-full overflow-hidden shadow-2xl relative my-auto max-h-[92vh] flex flex-col">
        {/* Header */}
        <div className="bg-[#4A0E17] text-white p-4 sm:p-5 flex items-center justify-between border-b border-[#D4AF37]/30">
          <div className="flex items-center gap-2">
            <Lock className="w-5 h-5 text-[#D4AF37]" />
            <div>
              <h3 className="font-serif font-bold text-base sm:text-lg">Secured Pan-India Checkout</h3>
              <p className="text-[10px] text-[#EADFCB]">Encrypted 256-bit Payment & Cold-Chain Logistics Gateway</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4 text-white" />
          </button>
        </div>

        <form onSubmit={handleSubmitOrder} className="overflow-y-auto p-6 flex-1 space-y-6">
          {/* Step 1: Contact Details */}
          <div className="bg-white border border-[#E8DAC2] rounded-2xl p-5 space-y-4">
            <h4 className="font-serif font-bold text-base text-[#351016] flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-[#4A0E17] text-white text-xs flex items-center justify-center font-sans">1</span>
              <span>Customer Information</span>
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="block text-gray-700 font-semibold mb-1">Full Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Diya Sen"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full px-3 py-2 bg-[#FCF9F5] border border-[#D9C8AF] rounded-lg focus:outline-none focus:border-[#4A0E17]"
                />
              </div>

              <div>
                <label className="block text-gray-700 font-semibold mb-1">Mobile Number (+91) *</label>
                <div className="flex">
                  <span className="px-3 py-2 bg-gray-100 border border-r-0 border-[#D9C8AF] rounded-l-lg text-gray-600 font-medium">
                    +91
                  </span>
                  <input
                    type="tel"
                    required
                    maxLength={10}
                    placeholder="98200 12345"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))}
                    className="flex-1 px-3 py-2 bg-[#FCF9F5] border border-[#D9C8AF] rounded-r-lg focus:outline-none focus:border-[#4A0E17]"
                  />
                </div>
              </div>

              <div className="sm:col-span-2">
                <label className="block text-gray-700 font-semibold mb-1">Email Address (for order tracking & invoice) *</label>
                <input
                  type="email"
                  required
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3 py-2 bg-[#FCF9F5] border border-[#D9C8AF] rounded-lg focus:outline-none focus:border-[#4A0E17]"
                />
              </div>
            </div>
          </div>

          {/* Step 2: Shipping Address */}
          <div className="bg-white border border-[#E8DAC2] rounded-2xl p-5 space-y-4">
            <h4 className="font-serif font-bold text-base text-[#351016] flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-[#4A0E17] text-white text-xs flex items-center justify-center font-sans">2</span>
              <span>Delivery Address</span>
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
              <div className="sm:col-span-3">
                <label className="block text-gray-700 font-semibold mb-1">Flat / Building / Street Address *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. 402, Sea Green Apartments, Carter Road, Bandra West"
                  value={street}
                  onChange={(e) => setStreet(e.target.value)}
                  className="w-full px-3 py-2 bg-[#FCF9F5] border border-[#D9C8AF] rounded-lg focus:outline-none focus:border-[#4A0E17]"
                />
              </div>

              <div>
                <label className="block text-gray-700 font-semibold mb-1">Pincode (6 digits) *</label>
                <input
                  type="text"
                  required
                  maxLength={6}
                  placeholder="400050"
                  value={pincode}
                  onChange={(e) => handlePincodeChange(e.target.value)}
                  className="w-full px-3 py-2 bg-[#FCF9F5] border border-[#D9C8AF] rounded-lg focus:outline-none focus:border-[#4A0E17]"
                />
                {pincodeError && <p className="text-[10px] text-red-600 mt-1">{pincodeError}</p>}
              </div>

              <div>
                <label className="block text-gray-700 font-semibold mb-1">City *</label>
                <input
                  type="text"
                  required
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="w-full px-3 py-2 bg-[#FCF9F5] border border-[#D9C8AF] rounded-lg focus:outline-none focus:border-[#4A0E17]"
                />
              </div>

              <div>
                <label className="block text-gray-700 font-semibold mb-1">State *</label>
                <input
                  type="text"
                  required
                  value={state}
                  onChange={(e) => setState(e.target.value)}
                  className="w-full px-3 py-2 bg-[#FCF9F5] border border-[#D9C8AF] rounded-lg focus:outline-none focus:border-[#4A0E17]"
                />
              </div>
            </div>

            <div className="flex items-center gap-2 text-[11px] text-[#A37B30] bg-[#FAF5EC] p-2.5 rounded-xl border border-[#E8DAC2]">
              <Truck className="w-4 h-4 shrink-0 text-[#D4AF37]" />
              <span>
                {pincodeDetails?.days
                  ? `Blue Dart Express: Estimated delivery to ${city} within ${pincodeDetails.days} business days.`
                  : 'Standard pan-India delivery within 2-3 business days via Blue Dart Air Express.'}
              </span>
            </div>
          </div>

          {/* Step 3: Payment Method */}
          <div className="bg-white border border-[#E8DAC2] rounded-2xl p-5 space-y-4">
            <h4 className="font-serif font-bold text-base text-[#351016] flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-[#4A0E17] text-white text-xs flex items-center justify-center font-sans">3</span>
              <span>Payment Option</span>
            </h4>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
              {[
                { id: 'UPI', label: 'Instant UPI / QR', icon: QrCode },
                { id: 'Card', label: 'Cards (Debit/Credit)', icon: CreditCard },
                { id: 'Netbanking', label: 'Net Banking', icon: Building },
                { id: 'COD', label: 'Cash on Delivery', icon: ShieldCheck }
              ].map(opt => {
                const Icon = opt.icon;
                return (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => setPaymentMethod(opt.id as any)}
                    className={`p-3 rounded-xl border flex flex-col items-center gap-2 transition-all ${
                      paymentMethod === opt.id
                        ? 'border-[#4A0E17] bg-[#4A0E17]/5 ring-1 ring-[#4A0E17]'
                        : 'border-gray-200 bg-[#FCF9F5] hover:border-gray-300'
                    }`}
                  >
                    <Icon className={`w-5 h-5 ${paymentMethod === opt.id ? 'text-[#4A0E17]' : 'text-gray-500'}`} />
                    <span className="font-semibold text-gray-800 text-center">{opt.label}</span>
                  </button>
                );
              })}
            </div>

            {/* UPI Details */}
            {paymentMethod === 'UPI' && (
              <div className="bg-[#FAF5EC] p-3.5 rounded-xl border border-[#E8DAC2] space-y-2 text-xs">
                <label className="block text-gray-700 font-semibold">Enter your UPI ID (GPay / PhonePe / Paytm / BHIM)</label>
                <input
                  type="text"
                  value={upiId}
                  onChange={(e) => setUpiId(e.target.value)}
                  placeholder="username@okhdfcbank"
                  className="w-full px-3 py-2 bg-white border border-[#D9C8AF] rounded-lg focus:outline-none focus:border-[#4A0E17]"
                />
                <p className="text-[10px] text-gray-500">A payment collect request will be sent to your UPI app for one-click approval.</p>
              </div>
            )}

            {/* Card Details */}
            {paymentMethod === 'Card' && (
              <div className="bg-[#FAF5EC] p-3.5 rounded-xl border border-[#E8DAC2] space-y-3 text-xs">
                <div>
                  <label className="block text-gray-700 font-semibold mb-1">Card Number</label>
                  <input
                    type="text"
                    value={cardNumber}
                    onChange={(e) => setCardNumber(e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-[#D9C8AF] rounded-lg"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-gray-700 font-semibold mb-1">Valid Thru</label>
                    <input
                      type="text"
                      value={cardExpiry}
                      onChange={(e) => setCardExpiry(e.target.value)}
                      className="w-full px-3 py-2 bg-white border border-[#D9C8AF] rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700 font-semibold mb-1">CVV</label>
                    <input
                      type="password"
                      maxLength={3}
                      value={cardCvv}
                      onChange={(e) => setCardCvv(e.target.value)}
                      className="w-full px-3 py-2 bg-white border border-[#D9C8AF] rounded-lg"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Netbanking */}
            {paymentMethod === 'Netbanking' && (
              <div className="bg-[#FAF5EC] p-3.5 rounded-xl border border-[#E8DAC2] space-y-2 text-xs">
                <label className="block text-gray-700 font-semibold">Select Bank</label>
                <select
                  value={selectedBank}
                  onChange={(e) => setSelectedBank(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-[#D9C8AF] rounded-lg"
                >
                  <option>HDFC Bank</option>
                  <option>ICICI Bank</option>
                  <option>State Bank of India (SBI)</option>
                  <option>Axis Bank</option>
                  <option>Kotak Mahindra Bank</option>
                </select>
              </div>
            )}

            {/* COD Notice */}
            {paymentMethod === 'COD' && (
              <div className="bg-[#FAF5EC] p-3.5 rounded-xl border border-[#E8DAC2] text-xs text-gray-700 space-y-1">
                <p className="font-semibold text-[#4A0E17]">Cash on Delivery Available</p>
                <p className="text-[11px] text-gray-600">
                  Please keep exact cash ready upon delivery. You may also scan courier UPI QR at your doorstep.
                </p>
              </div>
            )}
          </div>

          {/* Order Summary Bar */}
          <div className="bg-[#FAF5EC] border border-[#E8DAC2] rounded-2xl p-4 flex items-center justify-between text-xs">
            <div>
              <p className="text-gray-600">Total Payable Amount:</p>
              <p className="text-xl font-bold text-[#4A0E17]">₹{grandTotal.toLocaleString('en-IN')}</p>
            </div>

            <button
              type="submit"
              disabled={isSubmitting || cart.length === 0}
              className="px-8 py-3.5 bg-[#4A0E17] hover:bg-[#621420] text-white rounded-full text-xs font-bold uppercase tracking-[0.2em] shadow-lg transition-all flex items-center gap-2 disabled:opacity-50"
            >
              {isSubmitting ? (
                <span>Confirming Order...</span>
              ) : (
                <>
                  <span>Place Order</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
