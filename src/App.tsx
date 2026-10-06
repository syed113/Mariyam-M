/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { StoreProvider, useStore } from './context/StoreContext';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { HeroSection } from './components/home/HeroSection';
import { CategoryGrid } from './components/home/CategoryGrid';
import { BestsellersCarousel } from './components/home/BestsellersCarousel';
import { ShadeStudioBanner } from './components/home/ShadeStudioBanner';
import { ShopCatalog } from './components/shop/ShopCatalog';
import { BridalStudioPage } from './components/bridal/BridalStudioPage';
import { AccountPage } from './components/account/AccountPage';
import { ProductDetailModal } from './components/product/ProductDetailModal';
import { AIShadeStudioModal } from './components/ai/AIShadeStudioModal';
import { AskMariyamDrawer } from './components/ai/AskMariyamDrawer';
import { CartDrawer } from './components/cart/CartDrawer';
import { CheckoutModal } from './components/checkout/CheckoutModal';
import { OrderTrackingModal } from './components/account/OrderTrackingModal';
import { AdminDashboard } from './components/admin/AdminDashboard';
import { AuthModal } from './components/auth/AuthModal';
import { Sparkles, CheckCircle2, AlertCircle, Info, Crown, Heart, ShieldCheck } from 'lucide-react';
import { Product, ProductShade, Order } from './types';

function MainApp() {
  const {
    activeProductModal,
    setActiveProductModal,
    setIsAskMariyamOpen,
    addToCart,
    isAuthModalOpen,
    setIsAuthModalOpen,
    toasts
  } = useStore();

  const [currentTab, setCurrentTab] = useState<'home' | 'shop' | 'bridal' | 'account' | 'track'>('home');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isTrackingOpen, setIsTrackingOpen] = useState(false);
  const [selectedOrderForTracking, setSelectedOrderForTracking] = useState<Order | null>(null);
  const [isAdminOpen, setIsAdminOpen] = useState(false);

  const handleBuyNow = (product: Product, shade?: ProductShade, qty = 1) => {
    addToCart(product, shade, qty);
    setIsCheckoutOpen(true);
  };

  const handleOrderCompleted = (order: Order) => {
    setSelectedOrderForTracking(order);
    setIsTrackingOpen(true);
  };

  const handleTrackSpecificOrder = (order: Order) => {
    setSelectedOrderForTracking(order);
    setIsTrackingOpen(true);
  };

  return (
    <div className="min-h-screen bg-[#FCF9F5] flex flex-col font-sans selection:bg-[#D4AF37]/25 selection:text-[#4A0E17]">
      {/* Top Navigation */}
      <Navbar
        currentTab={currentTab}
        setCurrentTab={(tab) => {
          if (tab === 'track') {
            setIsTrackingOpen(true);
          } else {
            setCurrentTab(tab as any);
          }
        }}
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
        onOpenAdmin={() => setIsAdminOpen(true)}
      />

      {/* Main Content Router */}
      <main className="flex-1">
        {currentTab === 'home' && (
          <div>
            <HeroSection
              onShopClick={() => {
                setSelectedCategory('All');
                setCurrentTab('shop');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
            />

            <CategoryGrid
              onSelectCategory={(cat) => {
                setSelectedCategory(cat);
                setCurrentTab('shop');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              onOpenBridal={() => {
                setCurrentTab('bridal');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
            />

            <BestsellersCarousel
              onViewAllClick={() => {
                setSelectedCategory('All');
                setCurrentTab('shop');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
            />

            <ShadeStudioBanner />

            {/* Cultural Formulation Philosophy Strip */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
              <div className="bg-[#FAF5EC] border border-[#E8DAC2] rounded-3xl p-8 sm:p-12 text-center space-y-4">
                <div className="w-12 h-12 rounded-full bg-[#4A0E17] text-[#D4AF37] flex items-center justify-center mx-auto shadow-md">
                  <Crown className="w-6 h-6" />
                </div>
                <h3 className="font-serif font-bold text-2xl sm:text-3xl text-[#351016]">
                  The Science of Desi Chromatic Harmony
                </h3>
                <p className="text-xs sm:text-sm text-[#5C453E] max-w-2xl mx-auto leading-relaxed">
                  Indian skin is rich in yellow pheomelanin and olive undertones that international brands
                  frequently overlook. Every Mariyam Maquillage formulation is tested under intense tropical heat,
                  heavy monsoon humidity, and bright matrimonial halogen lights to ensure 100% true-color permanence.
                </p>
                <div className="pt-2 flex flex-wrap items-center justify-center gap-6 text-xs text-[#8A5A2B] font-semibold uppercase tracking-wider">
                  <span>• Kashmiri Mogra & Saffron</span>
                  <span>• 24K Micro-Milled Gold</span>
                  <span>• Kannauj Taif Rose</span>
                  <span>• 100% Cruelty-Free</span>
                </div>
              </div>
            </section>
          </div>
        )}

        {currentTab === 'shop' && (
          <ShopCatalog
            selectedCategory={selectedCategory}
            setSelectedCategory={setSelectedCategory}
          />
        )}

        {currentTab === 'bridal' && (
          <BridalStudioPage />
        )}

        {currentTab === 'account' && (
          <AccountPage
            onTrackOrder={handleTrackSpecificOrder}
            onExploreShop={() => {
              setSelectedCategory('All');
              setCurrentTab('shop');
            }}
          />
        )}
      </main>

      {/* Persistent Floating "Ask Mariyam" AI Button */}
      <button
        onClick={() => setIsAskMariyamOpen(true)}
        className="fixed bottom-6 right-6 z-40 bg-gradient-to-r from-[#4A0E17] to-[#731926] hover:from-[#621420] hover:to-[#8C1E2F] text-white p-3.5 sm:px-5 sm:py-3.5 rounded-full shadow-2xl border-2 border-[#D4AF37] flex items-center gap-2.5 transition-all hover:scale-105 group"
        title="Ask Mariyam Beauty AI"
      >
        <div className="relative">
          <Sparkles className="w-5 h-5 text-[#D4AF37] group-hover:rotate-12 transition-transform" />
          <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-[#D4AF37] animate-ping"></span>
        </div>
        <span className="text-xs font-bold uppercase tracking-wider hidden sm:inline">
          Ask Mariyam AI
        </span>
      </button>

      {/* Footer */}
      <Footer
        onNavigate={(tab, cat = 'All') => {
          if (tab === 'track') {
            setIsTrackingOpen(true);
          } else {
            setCurrentTab(tab as any);
            setSelectedCategory(cat);
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }
        }}
        onOpenAdmin={() => setIsAdminOpen(true)}
      />

      {/* MODALS & DRAWERS */}
      {/* 1. Product Detail Modal */}
      <ProductDetailModal
        product={activeProductModal}
        onClose={() => setActiveProductModal(null)}
        onBuyNow={handleBuyNow}
      />

      {/* 2. AI Shade Studio Modal */}
      <AIShadeStudioModal />

      {/* 3. Ask Mariyam AI Drawer */}
      <AskMariyamDrawer />

      {/* 4. Cart Drawer */}
      <CartDrawer
        onProceedToCheckout={() => setIsCheckoutOpen(true)}
        onExploreProducts={() => {
          setSelectedCategory('All');
          setCurrentTab('shop');
        }}
      />

      {/* 5. Checkout Modal */}
      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        onOrderComplete={handleOrderCompleted}
      />

      {/* 6. Live Order Tracking Modal */}
      <OrderTrackingModal
        isOpen={isTrackingOpen}
        onClose={() => {
          setIsTrackingOpen(false);
          setSelectedOrderForTracking(null);
        }}
        selectedOrder={selectedOrderForTracking}
      />

      {/* 7. Store Admin Operations Console */}
      {isAdminOpen && (
        <AdminDashboard onClose={() => setIsAdminOpen(false)} />
      )}

      {/* 8. Customer Authentication Modal */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
      />

      {/* Toast Notifications */}
      <div className="fixed bottom-6 left-6 z-50 space-y-2 pointer-events-none max-w-sm">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`pointer-events-auto px-4 py-3 rounded-2xl shadow-xl border flex items-center gap-2.5 text-xs font-medium backdrop-blur-md transition-all animate-in fade-in slide-in-from-bottom-2 ${
              toast.type === 'error'
                ? 'bg-red-900/90 text-white border-red-700'
                : toast.type === 'info'
                ? 'bg-[#201815]/95 text-white border-[#E8DAC2]/30'
                : 'bg-[#4A0E17]/95 text-white border-[#D4AF37]/60'
            }`}
          >
            {toast.type === 'error' ? (
              <AlertCircle className="w-4 h-4 text-red-300 shrink-0" />
            ) : (
              <CheckCircle2 className="w-4 h-4 text-[#D4AF37] shrink-0" />
            )}
            <span>{toast.message}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function App() {
  return (
    <StoreProvider>
      <MainApp />
    </StoreProvider>
  );
}
