import React, { useState } from 'react';
import {
  User as UserIcon,
  Package,
  Heart,
  Sparkles,
  MapPin,
  Clock,
  Compass,
  CheckCircle2,
  ChevronRight,
  ShoppingBag,
  Plus,
  LogOut,
  ShieldCheck
} from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { Order, Address } from '../../types';
import { api } from '../../services/api';

interface AccountPageProps {
  onTrackOrder: (order: Order) => void;
  onExploreShop: () => void;
}

export const AccountPage: React.FC<AccountPageProps> = ({
  onTrackOrder,
  onExploreShop
}) => {
  const {
    currentUser,
    addresses,
    beautyProfile,
    orders,
    wishlist,
    products,
    shadeMatchResult,
    addToCart,
    toggleWishlist,
    setIsShadeStudioOpen,
    setIsAuthModalOpen,
    logout,
    refreshUserProfile,
    showToast
  } = useStore();

  const [activeTab, setActiveTab] = useState<'orders' | 'profile' | 'wishlist'>('orders');
  const [isAddingAddress, setIsAddingAddress] = useState(false);
  const [newStreet, setNewStreet] = useState('');
  const [newCity, setNewCity] = useState('');
  const [newState, setNewState] = useState('');
  const [newPincode, setNewPincode] = useState('');
  const [newPhone, setNewPhone] = useState('');
  const [newFullName, setNewFullName] = useState('');
  const [isSubmittingAddress, setIsSubmittingAddress] = useState(false);

  const wishlistedProducts = products.filter(p => wishlist.includes(p.id));

  const handleAddAddress = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newStreet || !newCity || !newPincode || !newPhone) {
      showToast('Please fill all address fields', 'error');
      return;
    }
    try {
      setIsSubmittingAddress(true);
      await api.addAddress({
        fullName: newFullName || currentUser?.name || 'Customer',
        phone: newPhone,
        street: newStreet,
        city: newCity,
        state: newState,
        pincode: newPincode,
        isDefault: addresses.length === 0,
        type: 'Home'
      });
      await refreshUserProfile();
      setIsAddingAddress(false);
      setNewStreet('');
      setNewCity('');
      setNewState('');
      setNewPincode('');
      setNewPhone('');
      showToast('Delivery address saved to profile', 'success');
    } catch (e: any) {
      showToast(e.message || 'Failed to add address', 'error');
    } finally {
      setIsSubmittingAddress(false);
    }
  };

  const handleDeleteAddress = async (id: string) => {
    try {
      await api.deleteAddress(id);
      await refreshUserProfile();
      showToast('Address removed', 'info');
    } catch (e) {
      showToast('Failed to delete address', 'error');
    }
  };

  if (!currentUser) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center space-y-6">
        <div className="w-20 h-20 rounded-full bg-[#4A0E17]/10 text-[#4A0E17] flex items-center justify-center mx-auto border border-[#D4AF37]/40 shadow-md">
          <UserIcon className="w-10 h-10 text-[#4A0E17]" />
        </div>
        <div className="space-y-2">
          <h2 className="text-3xl font-serif font-bold text-[#351016]">
            Welcome to Mariyam Maquillage
          </h2>
          <p className="text-sm text-[#735D55] max-w-md mx-auto">
            Sign in to access your luxury beauty profile, shade recommendations, order fulfillment tracking, and bridal trousseau.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4">
          <button
            onClick={() => setIsAuthModalOpen(true)}
            className="w-full sm:w-auto px-8 py-3.5 bg-[#4A0E17] hover:bg-[#621420] text-white rounded-full font-bold text-xs uppercase tracking-[0.15em] shadow-lg transition-all"
          >
            Sign In to Your Account
          </button>
          <button
            onClick={onExploreShop}
            className="w-full sm:w-auto px-8 py-3.5 bg-white border border-[#D9C8AF] hover:bg-[#FAF5EC] text-[#4A0E17] rounded-full font-bold text-xs uppercase tracking-[0.15em] transition-all"
          >
            Browse Atelier Catalog
          </button>
        </div>
      </div>
    );
  }

  const initials = currentUser.name
    .split(' ')
    .map(n => n[0])
    .join('')
    .substring(0, 2)
    .toUpperCase();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Account Overview Header */}
      <div className="bg-white border border-[#E8DAC2] rounded-3xl p-6 sm:p-8 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-[#4A0E17] text-[#D4AF37] font-serif font-bold text-2xl flex items-center justify-center shadow-md">
            {initials || 'MM'}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-serif font-bold text-[#351016]">{currentUser.name}</h1>
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${
                currentUser.role === 'ADMIN'
                  ? 'bg-purple-100 text-purple-900 border border-purple-300'
                  : 'bg-[#D4AF37]/20 text-[#8A5A2B]'
              }`}>
                {currentUser.role === 'ADMIN' ? 'Store Administrator' : 'Royal Tier VIP'}
              </span>
            </div>
            <p className="text-xs text-[#735D55]">{currentUser.email} {currentUser.phone ? `• ${currentUser.phone}` : ''}</p>
            <p className="text-[11px] text-[#A37B30] mt-0.5">
              Member since {new Date(currentUser.createdAt).toLocaleDateString('en-IN', { month: 'short', year: 'numeric' })}
            </p>
          </div>
        </div>

        {/* Beauty Profile Snapshot & Actions */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          <div className="bg-[#FAF5EC] border border-[#E8DAC2] rounded-2xl p-4 flex items-center gap-3 text-xs">
            <div className="w-10 h-10 rounded-full bg-[#D4AF37]/20 flex items-center justify-center text-[#8A5A2B] shrink-0">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold text-gray-500 block">Matched Foundation Shade</span>
              <span className="font-bold text-[#4A0E17]">
                {beautyProfile?.matchedShadeName || shadeMatchResult?.matchedShade.name || '220 Golden Beige'}
              </span>
              <p className="text-[10px] text-gray-600">
                {beautyProfile?.undertone || 'Warm Golden'} Undertone • {beautyProfile?.skinTone || 'Medium'} Depth
              </p>
            </div>
            <button
              onClick={() => setIsShadeStudioOpen(true)}
              className="text-xs font-semibold text-[#4A0E17] hover:underline shrink-0 ml-2"
            >
              Recalibrate
            </button>
          </div>

          <button
            onClick={logout}
            className="p-3 text-gray-500 hover:text-red-700 hover:bg-red-50 rounded-2xl border border-gray-200 transition-colors flex items-center justify-center gap-1.5 text-xs font-semibold"
            title="Sign Out"
          >
            <LogOut className="w-4 h-4" />
            <span className="sm:hidden">Sign Out</span>
          </button>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex border-b border-[#E8DAC2] text-xs font-semibold gap-8">
        <button
          onClick={() => setActiveTab('orders')}
          className={`pb-3 transition-colors flex items-center gap-2 ${
            activeTab === 'orders' ? 'text-[#4A0E17] border-b-2 border-[#4A0E17] font-bold' : 'text-gray-500'
          }`}
        >
          <Package className="w-4 h-4" />
          <span>My Orders ({orders.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('wishlist')}
          className={`pb-3 transition-colors flex items-center gap-2 ${
            activeTab === 'wishlist' ? 'text-[#4A0E17] border-b-2 border-[#4A0E17] font-bold' : 'text-gray-500'
          }`}
        >
          <Heart className="w-4 h-4" />
          <span>Saved Wishlist ({wishlistedProducts.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('profile')}
          className={`pb-3 transition-colors flex items-center gap-2 ${
            activeTab === 'profile' ? 'text-[#4A0E17] border-b-2 border-[#4A0E17] font-bold' : 'text-gray-500'
          }`}
        >
          <UserIcon className="w-4 h-4" />
          <span>Delivery Addresses & Preferences</span>
        </button>
      </div>

      {/* TAB CONTENT: ORDERS */}
      {activeTab === 'orders' && (
        <div className="space-y-4">
          {orders.length === 0 ? (
            <div className="bg-white border border-[#E8DAC2] rounded-3xl p-12 text-center space-y-3">
              <Package className="w-12 h-12 text-gray-400 mx-auto" />
              <h3 className="font-serif font-bold text-xl text-[#351016]">No Orders Placed Yet</h3>
              <p className="text-xs text-gray-500">Discover our cult foundations, bridal lipsticks, and serums.</p>
              <button
                onClick={onExploreShop}
                className="px-6 py-2.5 bg-[#4A0E17] text-white rounded-full text-xs font-bold uppercase tracking-wider"
              >
                Start Shopping
              </button>
            </div>
          ) : (
            orders.map(order => (
              <div
                key={order.id}
                className="bg-white border border-[#E8DAC2] rounded-2xl p-5 shadow-xs space-y-4"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-gray-100 pb-3 gap-2">
                  <div>
                    <span className="text-[10px] font-bold text-[#A37B30] uppercase tracking-wider">
                      Order No. {order.orderNumber}
                    </span>
                    <p className="text-xs text-gray-500">
                      Placed on {new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </p>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="px-3 py-1 bg-[#4A0E17]/10 text-[#4A0E17] text-xs font-bold rounded-full uppercase tracking-wider">
                      {order.status}
                    </span>
                    <button
                      onClick={() => onTrackOrder(order)}
                      className="px-4 py-1.5 bg-[#4A0E17] hover:bg-[#621420] text-white text-xs font-semibold rounded-full flex items-center gap-1.5 transition-colors"
                    >
                      <Compass className="w-3.5 h-3.5" />
                      <span>Track Live</span>
                    </button>
                  </div>
                </div>

                {/* Items in order */}
                <div className="space-y-2">
                  {order.items.map((item, i) => (
                    <div key={i} className="flex items-center gap-3 text-xs">
                      <img
                        src={item.product?.primaryImage || 'https://images.unsplash.com/photo-1631729371254-42c2892f0e6e?auto=format&fit=crop&w=300&q=80'}
                        alt={item.product?.name || 'Product'}
                        className="w-12 h-12 object-cover rounded-lg border border-gray-100"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-gray-900 truncate">{item.product?.name || 'Formulation'}</p>
                        {item.selectedShade && (
                          <p className="text-[11px] text-gray-500">Shade: {item.selectedShade.name}</p>
                        )}
                        <p className="text-[10px] text-gray-400">Qty: {item.quantity}</p>
                      </div>
                      <span className="font-bold text-[#4A0E17]">₹{(item.price * item.quantity).toLocaleString('en-IN')}</span>
                    </div>
                  ))}
                </div>

                <div className="pt-2 border-t border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between text-xs text-gray-600 gap-2">
                  <div>
                    <span>Delivery Address: </span>
                    <strong className="text-gray-800">
                      {order.shippingAddress.street}, {order.shippingAddress.city} - {order.shippingAddress.pincode}
                    </strong>
                  </div>
                  <div className="text-sm font-bold text-gray-900">
                    Total: <span className="text-[#4A0E17]">₹{order.totalAmount.toLocaleString('en-IN')}</span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* TAB CONTENT: WISHLIST */}
      {activeTab === 'wishlist' && (
        <div className="space-y-4">
          {wishlistedProducts.length === 0 ? (
            <div className="bg-white border border-[#E8DAC2] rounded-3xl p-12 text-center space-y-3">
              <Heart className="w-12 h-12 text-gray-300 mx-auto" />
              <h3 className="font-serif font-bold text-xl text-[#351016]">No Saved Items</h3>
              <p className="text-xs text-gray-500">Tap the heart on any luxury creation to save for bridal celebrations.</p>
              <button
                onClick={onExploreShop}
                className="px-6 py-2.5 bg-[#4A0E17] text-white rounded-full text-xs font-bold uppercase tracking-wider"
              >
                Browse Catalog
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {wishlistedProducts.map(product => (
                <div
                  key={product.id}
                  className="bg-white border border-[#E8DAC2] rounded-2xl p-4 flex gap-3 shadow-xs relative"
                >
                  <img
                    src={product.primaryImage}
                    alt={product.name}
                    className="w-20 h-20 object-cover rounded-xl border border-gray-100 shrink-0"
                  />
                  <div className="flex-1 min-w-0 flex flex-col justify-between">
                    <div>
                      <span className="text-[10px] font-bold text-[#A37B30] uppercase block">
                        {product.brand}
                      </span>
                      <h4 className="text-xs font-semibold text-gray-900 truncate">
                        {product.name}
                      </h4>
                      <p className="text-xs font-bold text-[#4A0E17] mt-1">
                        ₹{product.price.toLocaleString('en-IN')}
                      </p>
                    </div>

                    <div className="flex items-center gap-2 pt-2">
                      <button
                        onClick={() => addToCart(product, product.shades ? product.shades[0] : undefined, 1)}
                        className="px-3 py-1 bg-[#4A0E17] hover:bg-[#621420] text-white rounded-full text-[11px] font-semibold flex items-center gap-1 transition-colors"
                      >
                        <ShoppingBag className="w-3 h-3" />
                        <span>Move to Bag</span>
                      </button>
                      <button
                        onClick={() => toggleWishlist(product.id)}
                        className="text-xs text-gray-400 hover:text-red-600 underline"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB CONTENT: PROFILE & ADDRESSES */}
      {activeTab === 'profile' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
          {/* Saved Addresses */}
          <div className="bg-white border border-[#E8DAC2] rounded-2xl p-5 space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="font-serif font-bold text-base text-[#351016]">Saved Delivery Addresses</h4>
              <button
                onClick={() => setIsAddingAddress(!isAddingAddress)}
                className="text-xs font-bold text-[#4A0E17] hover:underline flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>{isAddingAddress ? 'Cancel' : 'Add New'}</span>
              </button>
            </div>

            {/* Add Address Form */}
            {isAddingAddress && (
              <form onSubmit={handleAddAddress} className="p-4 bg-[#FAF5EC] rounded-xl border border-[#D9C8AF] space-y-3">
                <p className="font-bold text-gray-800">Add New Shipping Address</p>
                <div>
                  <label className="block text-gray-600 mb-0.5">Full Name</label>
                  <input
                    type="text"
                    required
                    value={newFullName}
                    onChange={e => setNewFullName(e.target.value)}
                    placeholder="Recipient's Name"
                    className="w-full p-2 bg-white border rounded"
                  />
                </div>
                <div>
                  <label className="block text-gray-600 mb-0.5">Phone Number (+91)</label>
                  <input
                    type="tel"
                    required
                    value={newPhone}
                    onChange={e => setNewPhone(e.target.value)}
                    placeholder="10-digit mobile"
                    className="w-full p-2 bg-white border rounded"
                  />
                </div>
                <div>
                  <label className="block text-gray-600 mb-0.5">Street Address</label>
                  <input
                    type="text"
                    required
                    value={newStreet}
                    onChange={e => setNewStreet(e.target.value)}
                    placeholder="Flat / Floor / Street"
                    className="w-full p-2 bg-white border rounded"
                  />
                </div>
                <div className="grid grid-cols-3 gap-2">
                  <div>
                    <label className="block text-gray-600 mb-0.5">Pincode</label>
                    <input
                      type="text"
                      required
                      maxLength={6}
                      value={newPincode}
                      onChange={e => setNewPincode(e.target.value)}
                      placeholder="6-digit"
                      className="w-full p-2 bg-white border rounded"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-600 mb-0.5">City</label>
                    <input
                      type="text"
                      required
                      value={newCity}
                      onChange={e => setNewCity(e.target.value)}
                      placeholder="City"
                      className="w-full p-2 bg-white border rounded"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-600 mb-0.5">State</label>
                    <input
                      type="text"
                      required
                      value={newState}
                      onChange={e => setNewState(e.target.value)}
                      placeholder="State"
                      className="w-full p-2 bg-white border rounded"
                    />
                  </div>
                </div>
                <button
                  type="submit"
                  disabled={isSubmittingAddress}
                  className="w-full py-2 bg-[#4A0E17] text-white font-bold rounded-lg hover:bg-[#621420]"
                >
                  {isSubmittingAddress ? 'Saving...' : 'Save Address'}
                </button>
              </form>
            )}

            {addresses.length === 0 && !isAddingAddress ? (
              <p className="text-gray-500 py-4 text-center">No saved addresses yet. Click "Add New" to add your primary shipping address.</p>
            ) : (
              addresses.map(addr => (
                <div key={addr.id} className="bg-[#FCF9F5] p-4 rounded-xl border border-[#E8DAC2] space-y-1 relative group">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-gray-900">{addr.fullName} ({addr.type || 'Home'})</span>
                    {addr.isDefault && (
                      <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded">Default</span>
                    )}
                  </div>
                  <p className="text-gray-600">{addr.street}</p>
                  <p className="text-gray-600">{addr.city}, {addr.state} - {addr.pincode}</p>
                  <p className="text-gray-600">Phone: {addr.phone}</p>
                  <div className="pt-2 flex justify-end">
                    <button
                      onClick={() => handleDeleteAddress(addr.id)}
                      className="text-red-700 hover:underline text-[11px]"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Beauty Preferences */}
          <div className="bg-white border border-[#E8DAC2] rounded-2xl p-5 space-y-4">
            <h4 className="font-serif font-bold text-base text-[#351016]">Beauty Profile & Undertone</h4>
            <div className="space-y-2 text-gray-700">
              <div className="flex justify-between py-1.5 border-b">
                <span>Skin Type:</span>
                <strong className="text-gray-900">{beautyProfile?.skinType || 'Combination / Sensitive'}</strong>
              </div>
              <div className="flex justify-between py-1.5 border-b">
                <span>Complexion Depth:</span>
                <strong className="text-gray-900 capitalize">{beautyProfile?.skinTone || 'Medium'}</strong>
              </div>
              <div className="flex justify-between py-1.5 border-b">
                <span>Undertone Nuance:</span>
                <strong className="text-gray-900 capitalize">{beautyProfile?.undertone || 'Warm Golden'}</strong>
              </div>
              <div className="flex justify-between py-1.5 border-b">
                <span>Primary Skin Concerns:</span>
                <strong className="text-gray-900">{beautyProfile?.concerns?.join(', ') || 'Barrier Health & Humidity Endurance'}</strong>
              </div>
              <div className="flex justify-between py-1.5">
                <span>Calibrated Foundation:</span>
                <strong className="text-[#4A0E17]">
                  {beautyProfile?.matchedShadeName || shadeMatchResult?.matchedShade.name || '220 Golden Beige'}
                </strong>
              </div>
            </div>

            <div className="pt-2">
              <button
                onClick={() => setIsShadeStudioOpen(true)}
                className="w-full py-2.5 bg-[#FAF5EC] border border-[#D9C8AF] hover:bg-[#F3EAD8] text-[#4A0E17] font-semibold rounded-xl text-center transition-colors"
              >
                Run AI Computer Vision Shade Match
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
