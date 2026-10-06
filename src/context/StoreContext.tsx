import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import {
  Product,
  ProductShade,
  CartItem,
  Coupon,
  Order,
  OrderStatus,
  ShadeMatchResult,
  AdminMetrics,
  User,
  Address,
  BeautyProfile
} from '../types';
import { INITIAL_PRODUCTS, INITIAL_COUPONS } from '../data/initialCatalog';
import { api } from '../services/api';

interface Toast {
  id: string;
  message: string;
  type?: 'success' | 'info' | 'error';
}

interface StoreContextType {
  // Auth state
  currentUser: User | null;
  authToken: string | null;
  addresses: Address[];
  beautyProfile: BeautyProfile | null;
  isAuthModalOpen: boolean;
  setIsAuthModalOpen: (open: boolean) => void;
  login: (email: string, pass: string) => Promise<void>;
  register: (name: string, email: string, pass: string, phone?: string) => Promise<void>;
  logout: () => void;
  refreshUserProfile: () => Promise<void>;

  // Products
  products: Product[];
  isLoadingProducts: boolean;
  refreshProducts: () => Promise<void>;

  // Cart
  cart: CartItem[];
  cartSubtotal: number;
  discountTotal: number;
  shippingFee: number;
  grandTotal: number;
  freeShippingThreshold: number;
  amountNeededForFreeShipping: number;
  appliedCoupon: Coupon | null;
  addToCart: (product: Product, selectedShade?: ProductShade, quantity?: number) => Promise<void>;
  removeFromCart: (productId: string, shadeId?: string, cartItemId?: string) => Promise<void>;
  updateCartQuantity: (productIdOrCartItemId: string, quantity: number, shadeId?: string) => Promise<void>;
  clearCart: () => Promise<void>;
  applyCoupon: (code: string) => Promise<{ success: boolean; message: string }>;
  removeCoupon: () => void;

  // Wishlist
  wishlist: string[];
  toggleWishlist: (productId: string) => Promise<void>;
  isWishlisted: (productId: string) => boolean;

  // Orders
  orders: Order[];
  createOrder: (orderData: {
    items: CartItem[];
    shippingAddress: any;
    paymentMethod: 'UPI' | 'Card' | 'Netbanking' | 'COD';
  }) => Promise<Order>;
  refreshOrders: () => Promise<void>;
  updateOrderStatus: (orderId: string, newStatus: OrderStatus, note?: string) => Promise<void>;

  // Modals & Drawers
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  isAskMariyamOpen: boolean;
  setIsAskMariyamOpen: (open: boolean) => void;
  isShadeStudioOpen: boolean;
  setIsShadeStudioOpen: (open: boolean) => void;
  activeProductModal: Product | null;
  setActiveProductModal: (product: Product | null) => void;
  shadeMatchResult: ShadeMatchResult | null;
  setShadeMatchResult: (result: ShadeMatchResult | null) => void;

  // Toasts
  toasts: Toast[];
  showToast: (message: string, type?: 'success' | 'info' | 'error') => void;

  // Admin Actions
  adminMetrics: AdminMetrics;
  refreshAdminMetrics: () => Promise<void>;
  updateProductStock: (productId: string, newStock: number) => Promise<void>;
  updateProduct: (product: Product) => Promise<void>;
  addProduct: (product: Partial<Product>) => Promise<void>;
  deleteProduct: (productId: string) => Promise<void>;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

export const StoreProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Auth state
  const [authToken, setAuthToken] = useState<string | null>(() => localStorage.getItem('mm_auth_token'));
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [beautyProfile, setBeautyProfile] = useState<BeautyProfile | null>(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  // Products
  const [products, setProducts] = useState<Product[]>(INITIAL_PRODUCTS);
  const [isLoadingProducts, setIsLoadingProducts] = useState(false);

  // Cart & Wishlist
  const [cart, setCart] = useState<CartItem[]>([]);
  const [appliedCoupon, setAppliedCoupon] = useState<Coupon | null>(null);
  const [wishlist, setWishlist] = useState<string[]>(['mm-prod-1', 'mm-prod-13']);

  // Orders
  const [orders, setOrders] = useState<Order[]>([]);

  // Shade Match
  const [shadeMatchResult, setShadeMatchResult] = useState<ShadeMatchResult | null>(() => {
    try {
      const saved = localStorage.getItem('mm_shade_match');
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return null;
  });

  // Drawers and Modals
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isAskMariyamOpen, setIsAskMariyamOpen] = useState(false);
  const [isShadeStudioOpen, setIsShadeStudioOpen] = useState(false);
  const [activeProductModal, setActiveProductModal] = useState<Product | null>(null);
  const [toasts, setToasts] = useState<Toast[]>([]);

  // Admin Metrics
  const [adminMetrics, setAdminMetrics] = useState<AdminMetrics>({
    totalRevenue: 3058,
    totalOrders: 1,
    averageOrderValue: 3058,
    totalCustomers: 1,
    conversionRate: 3.8,
    lowStockItemsCount: 1,
    bestsellersCount: 4
  });

  const showToast = (message: string, type: 'success' | 'info' | 'error' = 'success') => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 4000);
  };

  // Fetch initial products from backend
  const refreshProducts = async () => {
    try {
      setIsLoadingProducts(true);
      const prods = await api.getProducts();
      if (prods && prods.length > 0) {
        setProducts(prods);
      }
    } catch (e) {
      console.warn('Failed to fetch catalog from API, using fallback:', e);
    } finally {
      setIsLoadingProducts(false);
    }
  };

  // Fetch Cart from backend
  const refreshCart = async () => {
    try {
      const serverCart = await api.getCart();
      if (serverCart && serverCart.items) {
        setCart(serverCart.items);
      }
    } catch (e) {
      console.warn('Failed to fetch cart from server:', e);
    }
  };

  // Fetch Wishlist from backend
  const refreshWishlist = async () => {
    try {
      const wl = await api.getWishlist();
      if (wl) {
        setWishlist(wl);
      }
    } catch (e) {
      console.warn('Failed to fetch wishlist:', e);
    }
  };

  // Fetch Orders from backend
  const refreshOrders = async () => {
    try {
      if (currentUser) {
        const userOrders = await api.getOrders();
        setOrders(userOrders);
      }
    } catch (e) {
      console.warn('Failed to fetch orders:', e);
    }
  };

  // Refresh User Profile
  const refreshUserProfile = async () => {
    try {
      const profile = await api.getMe();
      if (profile) {
        setCurrentUser(profile.user);
        setAddresses(profile.addresses);
        if (profile.beautyProfile) setBeautyProfile(profile.beautyProfile);
      } else {
        setCurrentUser(null);
        setAuthToken(null);
        localStorage.removeItem('mm_auth_token');
      }
    } catch (e) {
      setCurrentUser(null);
      setAuthToken(null);
      localStorage.removeItem('mm_auth_token');
    }
  };

  // Refresh Admin Metrics
  const refreshAdminMetrics = async () => {
    try {
      if (currentUser?.role === 'ADMIN') {
        const metrics = await api.getAdminMetrics();
        setAdminMetrics(metrics);
      }
    } catch (e) {}
  };

  // Initial load
  useEffect(() => {
    refreshProducts();
    refreshCart();
    refreshWishlist();

    if (authToken) {
      refreshUserProfile();
    }
  }, []);

  useEffect(() => {
    if (currentUser) {
      refreshOrders();
      if (currentUser.role === 'ADMIN') {
        refreshAdminMetrics();
      }
    }
  }, [currentUser]);

  // Auth actions
  const login = async (email: string, pass: string) => {
    const res = await api.login({ email, password: pass });
    setAuthToken(res.token);
    setCurrentUser(res.user);
    localStorage.setItem('mm_auth_token', res.token);

    // Merge guest cart into user cart
    const guestSession = localStorage.getItem('mm_session_id');
    if (guestSession) {
      try {
        const merged = await api.mergeCart(guestSession);
        if (merged?.items) setCart(merged.items);
      } catch (err) {}
    }

    await refreshUserProfile();
    await refreshOrders();
  };

  const register = async (name: string, email: string, pass: string, phone?: string) => {
    const res = await api.register({ name, email, password: pass, phone });
    setAuthToken(res.token);
    setCurrentUser(res.user);
    localStorage.setItem('mm_auth_token', res.token);

    const guestSession = localStorage.getItem('mm_session_id');
    if (guestSession) {
      try {
        const merged = await api.mergeCart(guestSession);
        if (merged?.items) setCart(merged.items);
      } catch (err) {}
    }

    await refreshUserProfile();
  };

  const logout = () => {
    setCurrentUser(null);
    setAuthToken(null);
    localStorage.removeItem('mm_auth_token');
    showToast('Signed out of Mariyam Maquillage', 'info');
  };

  // Cart calculations
  const cartSubtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const discountTotal = (() => {
    if (!appliedCoupon) return 0;
    if (appliedCoupon.minOrderValue && cartSubtotal < appliedCoupon.minOrderValue) return 0;
    if (appliedCoupon.discountType === 'percentage') {
      return Math.round((cartSubtotal * appliedCoupon.discountValue) / 100);
    }
    return Math.min(cartSubtotal, appliedCoupon.discountValue);
  })();

  const freeShippingThreshold = 999;
  const shippingFee = cartSubtotal === 0 || cartSubtotal >= freeShippingThreshold ? 0 : 99;
  const grandTotal = Math.max(0, cartSubtotal - discountTotal + shippingFee);
  const amountNeededForFreeShipping = Math.max(0, freeShippingThreshold - cartSubtotal);

  const addToCart = async (product: Product, selectedShade?: ProductShade, quantity = 1) => {
    try {
      const updated = await api.addToCart(product.id, selectedShade?.id, undefined, quantity);
      if (updated?.items) {
        setCart(updated.items);
      }
      const shadeNote = selectedShade ? ` in ${selectedShade.name}` : '';
      showToast(`Added ${product.name}${shadeNote} to Bag`, 'success');
    } catch (err: any) {
      showToast(err.message || 'Could not add to bag', 'error');
    }
  };

  const removeFromCart = async (productId: string, shadeId?: string, cartItemId?: string) => {
    try {
      let targetId = cartItemId;
      if (!targetId) {
        const item = cart.find(ci => ci.productId === productId && (shadeId ? ci.selectedShade?.id === shadeId : true));
        targetId = item?.id;
      }
      if (targetId) {
        const updated = await api.removeCartItem(targetId);
        if (updated?.items) setCart(updated.items);
      } else {
        setCart(prev => prev.filter(ci => ci.productId !== productId));
      }
      showToast('Item removed from Bag', 'info');
    } catch (err: any) {
      showToast(err.message || 'Error removing item', 'error');
    }
  };

  const updateCartQuantity = async (productIdOrCartItemId: string, quantity: number, shadeId?: string) => {
    try {
      let targetId = cart.find(ci => ci.id === productIdOrCartItemId)?.id;
      if (!targetId) {
        const item = cart.find(ci => ci.productId === productIdOrCartItemId && (shadeId ? ci.selectedShade?.id === shadeId : true));
        targetId = item?.id;
      }
      if (targetId) {
        if (quantity <= 0) {
          const updated = await api.removeCartItem(targetId);
          if (updated?.items) setCart(updated.items);
        } else {
          const updated = await api.updateCartQuantity(targetId, quantity);
          if (updated?.items) setCart(updated.items);
        }
      }
    } catch (err: any) {
      showToast(err.message || 'Error updating quantity', 'error');
    }
  };

  const clearCart = async () => {
    try {
      await api.clearCart();
      setCart([]);
      setAppliedCoupon(null);
    } catch (e) {
      setCart([]);
    }
  };

  const applyCoupon = async (code: string) => {
    try {
      const result = await api.validateCoupon(code, cartSubtotal);
      if (result.valid && result.coupon) {
        setAppliedCoupon(result.coupon);
        showToast(`Coupon ${result.coupon.code} applied successfully!`, 'success');
        return { success: true, message: `Coupon applied: ${result.coupon.description}` };
      }
      return { success: false, message: result.error || 'Invalid coupon' };
    } catch (e: any) {
      return { success: false, message: e.message || 'Failed to apply coupon' };
    }
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
    showToast('Coupon removed', 'info');
  };

  // Wishlist actions
  const toggleWishlist = async (productId: string) => {
    try {
      const res = await api.toggleWishlist(productId);
      setWishlist(prev => res.added ? [...prev, productId] : prev.filter(id => id !== productId));
      showToast(res.added ? 'Saved to Wishlist' : 'Removed from Wishlist', 'info');
    } catch (e) {
      setWishlist(prev => prev.includes(productId) ? prev.filter(id => id !== productId) : [...prev, productId]);
    }
  };

  const isWishlisted = (productId: string) => wishlist.includes(productId);

  // Orders
  const createOrder = async (orderData: {
    items: CartItem[];
    shippingAddress: any;
    paymentMethod: 'UPI' | 'Card' | 'Netbanking' | 'COD';
  }): Promise<Order> => {
    const order = await api.createOrder({
      items: orderData.items,
      shippingAddress: orderData.shippingAddress,
      paymentMethod: orderData.paymentMethod,
      couponCode: appliedCoupon?.code
    });

    setOrders(prev => [order, ...prev]);
    setCart([]);
    setAppliedCoupon(null);
    try {
      await api.clearCart();
    } catch (e) {}
    await refreshProducts(); // Refresh stock
    return order;
  };

  const updateOrderStatus = async (orderId: string, newStatus: OrderStatus, note?: string) => {
    try {
      const updated = await api.updateOrderStatus(orderId, newStatus, note);
      setOrders(prev => prev.map(o => o.id === orderId ? updated : o));
      showToast(`Order status updated to ${newStatus}`, 'success');
      await refreshAdminMetrics();
    } catch (e: any) {
      showToast(e.message || 'Failed to update order status', 'error');
    }
  };

  // Admin Actions
  const updateProductStock = async (productId: string, newStock: number) => {
    try {
      const delta = newStock - (products.find(p => p.id === productId)?.stockCount || 0);
      const updated = await api.restockInventory(productId, delta);
      setProducts(prev => prev.map(p => p.id === productId ? updated : p));
      showToast('Inventory level updated in live database', 'success');
      await refreshAdminMetrics();
    } catch (e: any) {
      showToast(e.message || 'Failed to adjust stock', 'error');
    }
  };

  const updateProduct = async (product: Product) => {
    try {
      const updated = await api.updateAdminProduct(product.id, product);
      setProducts(prev => prev.map(p => p.id === product.id ? updated : p));
      showToast(`Updated "${product.name}" in database`, 'success');
    } catch (e: any) {
      showToast(e.message || 'Failed to update product', 'error');
    }
  };

  const addProduct = async (productData: Partial<Product>) => {
    try {
      const created = await api.createAdminProduct(productData);
      setProducts(prev => [created, ...prev]);
      showToast(`Created product "${created.name}" in catalog`, 'success');
      await refreshAdminMetrics();
    } catch (e: any) {
      showToast(e.message || 'Failed to create product', 'error');
    }
  };

  const deleteProduct = async (productId: string) => {
    try {
      await api.deleteAdminProduct(productId);
      setProducts(prev => prev.filter(p => p.id !== productId));
      showToast('Product archived from catalog', 'info');
      await refreshAdminMetrics();
    } catch (e: any) {
      showToast(e.message || 'Failed to delete product', 'error');
    }
  };

  return (
    <StoreContext.Provider
      value={{
        currentUser,
        authToken,
        addresses,
        beautyProfile,
        isAuthModalOpen,
        setIsAuthModalOpen,
        login,
        register,
        logout,
        refreshUserProfile,
        products,
        isLoadingProducts,
        refreshProducts,
        cart,
        cartSubtotal,
        discountTotal,
        shippingFee,
        grandTotal,
        freeShippingThreshold,
        amountNeededForFreeShipping,
        appliedCoupon,
        addToCart,
        removeFromCart,
        updateCartQuantity,
        clearCart,
        applyCoupon,
        removeCoupon,
        wishlist,
        toggleWishlist,
        isWishlisted,
        orders,
        createOrder,
        refreshOrders,
        updateOrderStatus,
        isCartOpen,
        setIsCartOpen,
        isAskMariyamOpen,
        setIsAskMariyamOpen,
        isShadeStudioOpen,
        setIsShadeStudioOpen,
        activeProductModal,
        setActiveProductModal,
        shadeMatchResult,
        setShadeMatchResult,
        toasts,
        showToast,
        adminMetrics,
        refreshAdminMetrics,
        updateProductStock,
        updateProduct,
        addProduct,
        deleteProduct
      }}
    >
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = () => {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error('useStore must be used within a StoreProvider');
  }
  return context;
};
