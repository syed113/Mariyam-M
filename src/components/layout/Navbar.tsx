import React, { useState } from 'react';
import {
  Sparkles,
  Search,
  ShoppingBag,
  Heart,
  User as UserIcon,
  ShieldCheck,
  Menu,
  X,
  ChevronDown,
  Compass,
  Crown,
  LogOut,
  LogIn
} from 'lucide-react';
import { useStore } from '../../context/StoreContext';

interface NavbarProps {
  currentTab: string;
  setCurrentTab: (tab: string) => void;
  selectedCategory: string;
  setSelectedCategory: (cat: string) => void;
  onOpenAdmin: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  setCurrentTab,
  selectedCategory,
  setSelectedCategory,
  onOpenAdmin
}) => {
  const {
    cart,
    wishlist,
    setIsCartOpen,
    setIsShadeStudioOpen,
    setIsAskMariyamOpen,
    products,
    setActiveProductModal,
    currentUser,
    setIsAuthModalOpen,
    logout
  } = useStore();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchFocused, setIsSearchFocused] = useState(false);

  const cartItemCount = cart.reduce((total, item) => total + item.quantity, 0);

  // Search filtered results
  const searchResults = searchQuery.trim()
    ? products.filter(p =>
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.subcategory.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.brand.toLowerCase().includes(searchQuery.toLowerCase())
      ).slice(0, 5)
    : [];

  const handleNav = (tab: string, category: string = 'All') => {
    setCurrentTab(tab);
    setSelectedCategory(category);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <header className="sticky top-0 z-40 bg-[#FCF9F5]/95 backdrop-blur-md border-b border-[#EADFCB] transition-all">
      {/* Royal Announcement Bar */}
      <div className="bg-[#4A0E17] text-[#FCF9F5] text-xs font-medium tracking-wider uppercase py-2 px-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="hidden sm:flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-[#D4AF37] animate-pulse"></span>
            <span>Complimentary 24K Gold Setting Mist on orders above ₹1,999</span>
          </div>
          <div className="mx-auto sm:mx-0 flex items-center gap-4 text-[11px]">
            <button
              onClick={() => handleNav('track')}
              className="hover:text-[#D4AF37] transition-colors flex items-center gap-1"
            >
              <Compass className="w-3 h-3 text-[#D4AF37]" />
              <span>Track Your Order</span>
            </button>
            <span className="text-[#D4AF37]/40">|</span>
            <button
              onClick={() => setIsAskMariyamOpen(true)}
              className="hover:text-[#D4AF37] transition-colors flex items-center gap-1 font-semibold text-[#D4AF37]"
            >
              <Sparkles className="w-3 h-3" />
              <span>Ask Mariyam AI Concierge</span>
            </button>
            <span className="text-[#D4AF37]/40 hidden md:inline">|</span>
            <span className="hidden md:inline text-white/80">Pan-India Temperature-Controlled Delivery</span>
          </div>
        </div>
      </div>

      {/* Main Header Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5">
        <div className="flex items-center justify-between gap-4">
          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-[#4A0E17] hover:bg-[#F3EAD8] rounded-md transition-colors"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>

          {/* Luxury Brand Mark / Logo */}
          <div
            onClick={() => handleNav('home')}
            className="cursor-pointer text-center md:text-left flex flex-col items-center md:items-start group"
          >
            <div className="flex items-center gap-1.5">
              <span className="text-xl sm:text-2xl font-serif font-bold tracking-[0.2em] text-[#4A0E17] uppercase group-hover:text-[#6A1B28] transition-colors">
                MARIYAM
              </span>
              <span className="text-xl sm:text-2xl font-serif font-light tracking-[0.25em] text-[#A37B30] uppercase">
                MAQUILLAGE
              </span>
            </div>
            <span className="text-[9px] font-sans tracking-[0.35em] text-[#694840] uppercase font-semibold">
              Haute Beauté Indienne
            </span>
          </div>

          {/* Interactive Search Bar (Desktop) */}
          <div className="hidden lg:block relative flex-1 max-w-md mx-6">
            <div className="relative">
              <input
                type="text"
                placeholder="Search foundation, liquid lipstick, saffron cream..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => setIsSearchFocused(true)}
                onBlur={() => setTimeout(() => setIsSearchFocused(false), 200)}
                className="w-full pl-10 pr-4 py-2 bg-white/80 border border-[#D9C8AF] rounded-full text-xs placeholder:text-[#8E7E73] text-[#201815] focus:outline-none focus:ring-2 focus:ring-[#D4AF37]/50 focus:border-[#D4AF37] transition-all shadow-xs"
              />
              <Search className="w-4 h-4 text-[#8E7E73] absolute left-3.5 top-1/2 -translate-y-1/2" />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs text-gray-400 hover:text-gray-600"
                >
                  ✕
                </button>
              )}
            </div>

            {/* Instant Search Flyout */}
            {isSearchFocused && searchResults.length > 0 && (
              <div className="absolute left-0 right-0 top-full mt-2 bg-white rounded-xl shadow-xl border border-[#EADFCB] overflow-hidden z-50 p-2">
                <div className="text-[10px] uppercase font-semibold text-[#8E7E73] px-3 py-1.5 tracking-wider">
                  Products ({searchResults.length})
                </div>
                {searchResults.map((product) => (
                  <div
                    key={product.id}
                    onClick={() => {
                      setActiveProductModal(product);
                      setSearchQuery('');
                    }}
                    className="flex items-center gap-3 p-2 hover:bg-[#FCF9F5] rounded-lg cursor-pointer transition-colors"
                  >
                    <img
                      src={product.primaryImage}
                      alt={product.name}
                      className="w-10 h-10 object-cover rounded-md border border-[#EADFCB]"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium text-[#201815] truncate">{product.name}</p>
                      <p className="text-[11px] text-[#8E7E73]">{product.brand} • {product.subcategory}</p>
                    </div>
                    <span className="text-xs font-semibold text-[#4A0E17]">₹{product.price}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Quick Action Icons */}
          <div className="flex items-center gap-1.5 sm:gap-3">
            {/* AI Shade Studio Trigger CTA */}
            <button
              onClick={() => setIsShadeStudioOpen(true)}
              className="flex items-center gap-1.5 bg-gradient-to-r from-[#D4AF37] to-[#B38F28] hover:from-[#C5A028] hover:to-[#9E7A18] text-white px-3 sm:px-4 py-1.5 rounded-full text-xs font-semibold tracking-wide shadow-sm hover:shadow transition-all group"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#FFF5CC] group-hover:rotate-12 transition-transform" />
              <span className="hidden sm:inline">Find Your Shade</span>
              <span className="sm:hidden">Shade AI</span>
            </button>

            {/* Wishlist */}
            <button
              onClick={() => handleNav('account')}
              className="relative p-2 text-[#4A0E17] hover:text-[#6A1B28] hover:bg-[#F3EAD8] rounded-full transition-colors"
              title="Saved Items"
              aria-label="Wishlist"
            >
              <Heart className={`w-5 h-5 ${wishlist.length > 0 ? 'fill-[#4A0E17]' : ''}`} />
              {wishlist.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-[#D4AF37] text-white font-bold text-[10px] w-4 h-4 rounded-full flex items-center justify-center">
                  {wishlist.length}
                </span>
              )}
            </button>

            {/* Shopping Bag Button */}
            <button
              onClick={() => setIsCartOpen(true)}
              className="relative p-2 text-[#4A0E17] hover:text-[#6A1B28] hover:bg-[#F3EAD8] rounded-full transition-colors"
              title="Shopping Bag"
              aria-label="Cart"
            >
              <ShoppingBag className="w-5 h-5" />
              {cartItemCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-[#4A0E17] text-white font-bold text-[10px] w-4 h-4 rounded-full flex items-center justify-center ring-2 ring-[#FCF9F5]">
                  {cartItemCount}
                </span>
              )}
            </button>

            {/* Account & Auth Trigger */}
            <div className="relative group">
              <button
                onClick={() => {
                  if (!currentUser) {
                    setIsAuthModalOpen(true);
                  } else {
                    handleNav('account');
                  }
                }}
                className={`p-2 rounded-full transition-colors flex items-center gap-1 ${
                  currentUser
                    ? 'text-[#4A0E17] bg-[#FAF5EC] border border-[#D4AF37]/50'
                    : 'text-[#4A0E17] hover:text-[#6A1B28] hover:bg-[#F3EAD8]'
                }`}
                title={currentUser ? `Signed in as ${currentUser.name}` : 'Sign In'}
                aria-label="Account"
              >
                <UserIcon className="w-5 h-5" />
              </button>

              {/* Account Dropdown Menu */}
              <div className="hidden group-hover:block absolute right-0 top-full pt-1 z-50">
                <div className="w-52 bg-white border border-[#EADFCB] rounded-2xl shadow-xl py-2 text-xs text-[#201815]">
                  {currentUser ? (
                    <>
                      <div className="px-4 py-2 border-b border-gray-100">
                        <p className="font-bold text-[#4A0E17] truncate">{currentUser.name}</p>
                        <p className="text-[10px] text-gray-500 truncate">{currentUser.email}</p>
                      </div>
                      <button
                        onClick={() => handleNav('account')}
                        className="w-full text-left px-4 py-2 hover:bg-[#FCF9F5] flex items-center gap-2"
                      >
                        <UserIcon className="w-3.5 h-3.5 text-[#D4AF37]" />
                        <span>My Profile & Orders</span>
                      </button>
                      <button
                        onClick={() => handleNav('track')}
                        className="w-full text-left px-4 py-2 hover:bg-[#FCF9F5] flex items-center gap-2"
                      >
                        <Compass className="w-3.5 h-3.5 text-[#D4AF37]" />
                        <span>Live Order Tracking</span>
                      </button>
                      <div className="border-t border-gray-100 my-1"></div>
                      <button
                        onClick={onOpenAdmin}
                        className="w-full text-left px-4 py-2 hover:bg-[#FCF9F5] flex items-center gap-2 font-medium text-[#4A0E17]"
                      >
                        <ShieldCheck className="w-3.5 h-3.5 text-[#4A0E17]" />
                        <span>Admin Operations</span>
                      </button>
                      <button
                        onClick={logout}
                        className="w-full text-left px-4 py-2 hover:bg-red-50 flex items-center gap-2 text-red-700 font-medium"
                      >
                        <LogOut className="w-3.5 h-3.5 text-red-600" />
                        <span>Sign Out</span>
                      </button>
                    </>
                  ) : (
                    <>
                      <div className="px-4 py-2 text-gray-600 text-[11px] border-b border-gray-100">
                        Sign in to access your shade history and trousseau.
                      </div>
                      <button
                        onClick={() => setIsAuthModalOpen(true)}
                        className="w-full text-left px-4 py-2.5 hover:bg-[#FCF9F5] flex items-center gap-2 font-bold text-[#4A0E17]"
                      >
                        <LogIn className="w-4 h-4 text-[#4A0E17]" />
                        <span>Sign In / Register</span>
                      </button>
                      <button
                        onClick={onOpenAdmin}
                        className="w-full text-left px-4 py-2 hover:bg-[#FCF9F5] flex items-center gap-2 text-gray-700"
                      >
                        <ShieldCheck className="w-3.5 h-3.5 text-gray-500" />
                        <span>Admin Console</span>
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Search Bar */}
        <div className="lg:hidden mt-2.5">
          <div className="relative">
            <input
              type="text"
              placeholder="Search luxury products, shades, concerns..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-1.5 bg-white border border-[#D9C8AF] rounded-full text-xs placeholder:text-[#8E7E73] text-[#201815] focus:outline-none focus:ring-1 focus:ring-[#D4AF37]"
            />
            <Search className="w-3.5 h-3.5 text-[#8E7E73] absolute left-3 top-1/2 -translate-y-1/2" />
          </div>
        </div>
      </div>

      {/* Desktop Mega Navigation Bar */}
      <nav className="hidden md:block bg-white border-t border-[#F0E4D2]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ul className="flex items-center justify-center gap-8 text-xs uppercase tracking-wider font-medium text-[#4A3831] py-2.5">
            <li>
              <button
                onClick={() => handleNav('home')}
                className={`hover:text-[#4A0E17] transition-colors py-1 ${
                  currentTab === 'home' ? 'text-[#4A0E17] font-bold border-b-2 border-[#4A0E17]' : ''
                }`}
              >
                Home
              </button>
            </li>
            <li>
              <button
                onClick={() => handleNav('shop', 'All')}
                className={`hover:text-[#4A0E17] transition-colors py-1 ${
                  currentTab === 'shop' && selectedCategory === 'All' ? 'text-[#4A0E17] font-bold border-b-2 border-[#4A0E17]' : ''
                }`}
              >
                All Products
              </button>
            </li>
            <li>
              <button
                onClick={() => handleNav('shop', 'Makeup')}
                className={`hover:text-[#4A0E17] transition-colors py-1 ${
                  currentTab === 'shop' && selectedCategory === 'Makeup' ? 'text-[#4A0E17] font-bold border-b-2 border-[#4A0E17]' : ''
                }`}
              >
                Makeup & Shades
              </button>
            </li>
            <li>
              <button
                onClick={() => handleNav('shop', 'Skincare')}
                className={`hover:text-[#4A0E17] transition-colors py-1 ${
                  currentTab === 'shop' && selectedCategory === 'Skincare' ? 'text-[#4A0E17] font-bold border-b-2 border-[#4A0E17]' : ''
                }`}
              >
                Skincare & Barrier
              </button>
            </li>
            <li>
              <button
                onClick={() => handleNav('shop', 'Fragrance')}
                className={`hover:text-[#4A0E17] transition-colors py-1 ${
                  currentTab === 'shop' && selectedCategory === 'Fragrance' ? 'text-[#4A0E17] font-bold border-b-2 border-[#4A0E17]' : ''
                }`}
              >
                Haute Parfumerie
              </button>
            </li>
            <li>
              <button
                onClick={() => handleNav('bridal')}
                className={`hover:text-[#4A0E17] transition-colors py-1 flex items-center gap-1 ${
                  currentTab === 'bridal' ? 'text-[#4A0E17] font-bold border-b-2 border-[#4A0E17]' : ''
                }`}
              >
                <Crown className="w-3 h-3 text-[#D4AF37]" />
                <span>Bridal Atelier</span>
              </button>
            </li>
            <li>
              <button
                onClick={() => setIsShadeStudioOpen(true)}
                className="hover:text-[#D4AF37] transition-colors py-1 flex items-center gap-1 font-semibold text-[#A37B30]"
              >
                <Sparkles className="w-3 h-3 text-[#D4AF37]" />
                <span>AI Shade Studio</span>
              </button>
            </li>
            <li>
              <button
                onClick={() => setIsAskMariyamOpen(true)}
                className="hover:text-[#4A0E17] transition-colors py-1 text-[#4A0E17] font-semibold flex items-center gap-1"
              >
                <span>Ask Mariyam</span>
              </button>
            </li>
          </ul>
        </div>
      </nav>

      {/* Mobile Drawer Navigation */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#FCF9F5] border-t border-[#EADFCB] px-6 py-4 space-y-4 shadow-xl">
          <div className="space-y-2 text-sm text-[#4A3831] font-medium">
            <button
              onClick={() => handleNav('home')}
              className="w-full text-left py-2 border-b border-[#F0E4D2]"
            >
              Home
            </button>
            <button
              onClick={() => handleNav('shop', 'All')}
              className="w-full text-left py-2 border-b border-[#F0E4D2]"
            >
              All Products
            </button>
            <button
              onClick={() => handleNav('shop', 'Makeup')}
              className="w-full text-left py-2 border-b border-[#F0E4D2]"
            >
              Makeup & Foundations
            </button>
            <button
              onClick={() => handleNav('shop', 'Skincare')}
              className="w-full text-left py-2 border-b border-[#F0E4D2]"
            >
              Skincare & Barrier Care
            </button>
            <button
              onClick={() => handleNav('shop', 'Fragrance')}
              className="w-full text-left py-2 border-b border-[#F0E4D2]"
            >
              Haute Parfumerie (Oud & Rose)
            </button>
            <button
              onClick={() => handleNav('bridal')}
              className="w-full text-left py-2 border-b border-[#F0E4D2] flex items-center gap-2 text-[#4A0E17] font-semibold"
            >
              <Crown className="w-4 h-4 text-[#D4AF37]" />
              <span>Bridal Atelier Consultation</span>
            </button>
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                setIsShadeStudioOpen(true);
              }}
              className="w-full text-left py-2 border-b border-[#F0E4D2] flex items-center gap-2 text-[#A37B30] font-semibold"
            >
              <Sparkles className="w-4 h-4 text-[#D4AF37]" />
              <span>Find My Shade (AI Studio)</span>
            </button>
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                setIsAskMariyamOpen(true);
              }}
              className="w-full text-left py-2 border-b border-[#F0E4D2] flex items-center gap-2 text-[#4A0E17] font-semibold"
            >
              <Sparkles className="w-4 h-4 text-[#4A0E17]" />
              <span>Ask Mariyam Beauty AI</span>
            </button>
            <button
              onClick={() => handleNav('track')}
              className="w-full text-left py-2 border-b border-[#F0E4D2] flex items-center gap-2"
            >
              <Compass className="w-4 h-4 text-[#D4AF37]" />
              <span>Live Order Tracking</span>
            </button>
            {currentUser ? (
              <button
                onClick={logout}
                className="w-full text-left py-2 text-red-700 flex items-center gap-2"
              >
                <LogOut className="w-4 h-4" />
                <span>Sign Out ({currentUser.name})</span>
              </button>
            ) : (
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  setIsAuthModalOpen(true);
                }}
                className="w-full text-left py-2 text-[#4A0E17] font-bold flex items-center gap-2"
              >
                <LogIn className="w-4 h-4" />
                <span>Sign In / Register</span>
              </button>
            )}
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenAdmin();
              }}
              className="w-full text-left py-2 text-[#4A0E17] flex items-center gap-2"
            >
              <ShieldCheck className="w-4 h-4" />
              <span>Admin Dashboard</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
