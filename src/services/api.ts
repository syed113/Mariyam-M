import {
  Product,
  CartItem,
  CartRecord,
  Order,
  OrderStatus,
  Coupon,
  ShadeMatchResult,
  AdminMetrics,
  User,
  Address,
  BeautyProfile
} from '../types';

function getSessionId(): string {
  let sid = localStorage.getItem('mm_session_id');
  if (!sid) {
    sid = 'sess_' + Math.random().toString(36).substring(2, 11) + Date.now().toString(36);
    localStorage.setItem('mm_session_id', sid);
  }
  return sid;
}

function getAuthHeader(): Record<string, string> {
  const token = localStorage.getItem('mm_auth_token');
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    'x-session-id': getSessionId()
  };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  return headers;
}

export const api = {
  // Auth
  async register(data: { email: string; password: string; name: string; phone?: string }) {
    const res = await fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.error || 'Registration failed');
    return json as { token: string; user: User };
  },

  async login(data: { email: string; password: string }) {
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.error || 'Login failed');
    return json as { token: string; user: User };
  },

  async getMe() {
    const res = await fetch('/api/auth/me', {
      headers: getAuthHeader()
    });
    if (!res.ok) return null;
    return (await res.json()) as { user: User; addresses: Address[]; beautyProfile?: BeautyProfile };
  },

  // Addresses
  async getAddresses() {
    const res = await fetch('/api/auth/addresses', { headers: getAuthHeader() });
    return (await res.json()).addresses as Address[];
  },

  async addAddress(addr: Omit<Address, 'id' | 'userId'>) {
    const res = await fetch('/api/auth/addresses', {
      method: 'POST',
      headers: getAuthHeader(),
      body: JSON.stringify(addr)
    });
    return (await res.json()).address as Address;
  },

  async deleteAddress(id: string) {
    const res = await fetch(`/api/auth/addresses/${id}`, {
      method: 'DELETE',
      headers: getAuthHeader()
    });
    return res.json();
  },

  // Products
  async getProducts(params?: Record<string, string | number | boolean | undefined>) {
    const query = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([k, v]) => {
        if (v !== undefined && v !== 'All' && v !== '') {
          query.set(k, String(v));
        }
      });
    }
    const res = await fetch(`/api/products?${query.toString()}`);
    return (await res.json()).products as Product[];
  },

  async getProduct(id: string) {
    const res = await fetch(`/api/products/${id}`);
    return res.json() as Promise<{ product: Product; reviews: any[]; related: Product[] }>;
  },

  async addReview(productId: string, data: { author: string; rating: number; title: string; comment: string; shadeUsed?: string }) {
    const res = await fetch(`/api/products/${productId}/reviews`, {
      method: 'POST',
      headers: getAuthHeader(),
      body: JSON.stringify(data)
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.error || 'Failed to submit review');
    return json.review;
  },

  // Cart
  async getCart() {
    const res = await fetch('/api/cart', { headers: getAuthHeader() });
    return (await res.json()).cart as CartRecord;
  },

  async addToCart(productId: string, shadeId?: string, variantId?: string, quantity = 1) {
    const res = await fetch('/api/cart/items', {
      method: 'POST',
      headers: getAuthHeader(),
      body: JSON.stringify({ productId, shadeId, variantId, quantity })
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.error || 'Failed to add item to bag');
    return json.cart as CartRecord;
  },

  async updateCartQuantity(cartItemId: string, quantity: number) {
    const res = await fetch(`/api/cart/items/${cartItemId}`, {
      method: 'PUT',
      headers: getAuthHeader(),
      body: JSON.stringify({ quantity })
    });
    return (await res.json()).cart as CartRecord;
  },

  async removeCartItem(cartItemId: string) {
    const res = await fetch(`/api/cart/items/${cartItemId}`, {
      method: 'DELETE',
      headers: getAuthHeader()
    });
    return (await res.json()).cart as CartRecord;
  },

  async clearCart() {
    const res = await fetch('/api/cart', {
      method: 'DELETE',
      headers: getAuthHeader()
    });
    return (await res.json()).cart as CartRecord;
  },

  async mergeCart(guestSessionId: string) {
    const res = await fetch('/api/cart/merge', {
      method: 'POST',
      headers: getAuthHeader(),
      body: JSON.stringify({ guestSessionId })
    });
    return (await res.json()).cart as CartRecord;
  },

  // Wishlist
  async getWishlist() {
    const res = await fetch('/api/wishlist', { headers: getAuthHeader() });
    return (await res.json()).wishlist?.productIds as string[] || [];
  },

  async toggleWishlist(productId: string) {
    const res = await fetch('/api/wishlist/toggle', {
      method: 'POST',
      headers: getAuthHeader(),
      body: JSON.stringify({ productId })
    });
    return res.json() as Promise<{ added: boolean }>;
  },

  // Orders
  async createOrder(orderData: {
    items: CartItem[];
    shippingAddress: any;
    paymentMethod: 'UPI' | 'Card' | 'Netbanking' | 'COD';
    couponCode?: string;
  }) {
    const res = await fetch('/api/orders', {
      method: 'POST',
      headers: getAuthHeader(),
      body: JSON.stringify({
        items: orderData.items.map(ci => ({
          productId: ci.productId,
          shadeId: ci.selectedShade?.id,
          variantId: ci.selectedVariant?.id,
          quantity: ci.quantity
        })),
        shippingAddress: orderData.shippingAddress,
        paymentMethod: orderData.paymentMethod,
        couponCode: orderData.couponCode
      })
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.error || 'Failed to place order');
    return json.order as Order;
  },

  async getOrders() {
    const res = await fetch('/api/orders', { headers: getAuthHeader() });
    if (!res.ok) return [];
    return (await res.json()).orders as Order[];
  },

  async trackOrder(orderNumber: string) {
    const res = await fetch(`/api/orders/track/${encodeURIComponent(orderNumber)}`);
    const json = await res.json();
    if (!res.ok) throw new Error(json.error || 'Order not found');
    return json.order as Order;
  },

  // Logistics & Coupons
  async checkPincode(pincode: string) {
    const res = await fetch(`/api/shipping/pincode/${pincode}`);
    return res.json() as Promise<{ serviceable: boolean; city?: string; state?: string; days?: number; expressAvailable?: boolean }>;
  },

  async validateCoupon(code: string, subtotal: number) {
    const res = await fetch('/api/coupons/validate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ code, subtotal })
    });
    return res.json() as Promise<{ valid: boolean; coupon?: Coupon; error?: string }>;
  },

  // Beauty Profile
  async getBeautyProfile() {
    const res = await fetch('/api/beauty-profile', { headers: getAuthHeader() });
    return (await res.json()).profile as BeautyProfile | undefined;
  },

  async saveBeautyProfile(profile: Partial<BeautyProfile>) {
    const res = await fetch('/api/beauty-profile', {
      method: 'PUT',
      headers: getAuthHeader(),
      body: JSON.stringify(profile)
    });
    return (await res.json()).profile as BeautyProfile;
  },

  // AI Chat & Shade
  async chatWithMariyam(message: string, history: any[]) {
    const res = await fetch('/api/ai/chat', {
      method: 'POST',
      headers: getAuthHeader(),
      body: JSON.stringify({ message, history })
    });
    return res.json() as Promise<{ reply: string; recommendedProductIds: string[] }>;
  },

  async matchShade(data: { imageBase64?: string; manualPreferences?: { depth: string; undertone: string } }) {
    const res = await fetch('/api/ai/shade-match', {
      method: 'POST',
      headers: getAuthHeader(),
      body: JSON.stringify(data)
    });
    return res.json() as Promise<ShadeMatchResult>;
  },

  // Admin
  async getAdminMetrics() {
    const res = await fetch('/api/admin/metrics', { headers: getAuthHeader() });
    if (!res.ok) throw new Error('Admin authorization required');
    return (await res.json()).metrics as AdminMetrics;
  },

  async getAdminOrders() {
    const res = await fetch('/api/admin/orders', { headers: getAuthHeader() });
    if (!res.ok) throw new Error('Admin authorization required');
    return (await res.json()).orders as Order[];
  },

  async updateOrderStatus(orderId: string, status: OrderStatus, note?: string, courierName?: string, trackingNumber?: string) {
    const res = await fetch(`/api/admin/orders/${orderId}/status`, {
      method: 'PUT',
      headers: getAuthHeader(),
      body: JSON.stringify({ status, note, courierName, trackingNumber })
    });
    return (await res.json()).order as Order;
  },

  async createAdminProduct(product: Partial<Product>) {
    const res = await fetch('/api/admin/products', {
      method: 'POST',
      headers: getAuthHeader(),
      body: JSON.stringify(product)
    });
    return (await res.json()).product as Product;
  },

  async updateAdminProduct(id: string, updates: Partial<Product>) {
    const res = await fetch(`/api/admin/products/${id}`, {
      method: 'PUT',
      headers: getAuthHeader(),
      body: JSON.stringify(updates)
    });
    return (await res.json()).product as Product;
  },

  async deleteAdminProduct(id: string) {
    const res = await fetch(`/api/admin/products/${id}`, {
      method: 'DELETE',
      headers: getAuthHeader()
    });
    return res.json();
  },

  async restockInventory(productId: string, delta: number) {
    const res = await fetch('/api/admin/inventory/restock', {
      method: 'POST',
      headers: getAuthHeader(),
      body: JSON.stringify({ productId, delta })
    });
    return (await res.json()).product as Product;
  },

  async getAdminCustomers() {
    const res = await fetch('/api/admin/customers', { headers: getAuthHeader() });
    if (!res.ok) throw new Error('Admin authorization required');
    return (await res.json()).customers as Array<User & { orderCount: number; totalSpent: number }>;
  },

  async getAdminCoupons() {
    const res = await fetch('/api/admin/coupons', { headers: getAuthHeader() });
    if (!res.ok) throw new Error('Admin authorization required');
    return (await res.json()).coupons as Coupon[];
  },

  async createAdminCoupon(coupon: Coupon) {
    const res = await fetch('/api/admin/coupons', {
      method: 'POST',
      headers: getAuthHeader(),
      body: JSON.stringify(coupon)
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.error || 'Failed to create coupon');
    return json.coupon as Coupon;
  },

  async deleteAdminCoupon(code: string) {
    const res = await fetch(`/api/admin/coupons/${encodeURIComponent(code)}`, {
      method: 'DELETE',
      headers: getAuthHeader()
    });
    return res.json();
  },

  async getAdminBanners() {
    const res = await fetch('/api/admin/banners', { headers: getAuthHeader() });
    if (!res.ok) throw new Error('Admin authorization required');
    return (await res.json()).banners;
  },

  async createAdminBanner(banner: any) {
    const res = await fetch('/api/admin/banners', {
      method: 'POST',
      headers: getAuthHeader(),
      body: JSON.stringify(banner)
    });
    return (await res.json()).banner;
  },

  async deleteAdminBanner(id: string) {
    const res = await fetch(`/api/admin/banners/${id}`, {
      method: 'DELETE',
      headers: getAuthHeader()
    });
    return res.json();
  },

  async toggleAdminBanner(id: string) {
    const res = await fetch(`/api/admin/banners/${id}/toggle`, {
      method: 'PUT',
      headers: getAuthHeader()
    });
    return (await res.json()).banner;
  }
};
