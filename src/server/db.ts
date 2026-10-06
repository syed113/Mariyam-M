import fs from 'fs';
import path from 'path';
import {
  User,
  Address,
  Product,
  ProductVariant,
  ProductShade,
  Category,
  Brand,
  InventoryRecord,
  CartItem,
  CartRecord,
  WishlistRecord,
  Order,
  OrderStatus,
  PaymentRecord,
  ShipmentRecord,
  Coupon,
  Promotion,
  ProductReview,
  Banner,
  Collection,
  BeautyProfile,
  ShadeRecommendation,
  AIConversation,
  AIMessage,
  AdminMetrics
} from '../types';
import { INITIAL_PRODUCTS, INITIAL_COUPONS, PINCODE_DIRECTORY } from '../data/initialCatalog.ts';
import { hashPassword } from './auth';

export interface UserRecord extends User {
  passwordHash: string;
}

export interface AddressRecord extends Address {}

export interface DatabaseSchema {
  users: UserRecord[];
  addresses: AddressRecord[];
  products: Product[];
  variants: ProductVariant[];
  categories: Category[];
  brands: Brand[];
  inventory: InventoryRecord[];
  carts: CartRecord[];
  wishlists: WishlistRecord[];
  orders: Order[];
  payments: PaymentRecord[];
  shipments: ShipmentRecord[];
  coupons: Coupon[];
  promotions: Promotion[];
  reviews: ProductReview[];
  banners: Banner[];
  collections: Collection[];
  beautyProfiles: BeautyProfile[];
  shadeRecommendations: ShadeRecommendation[];
  aiConversations: AIConversation[];
}

const DB_DIR = path.resolve(process.cwd(), '.data');
const DB_FILE = path.join(DB_DIR, 'mariyam_store.json');

// Ensure database directory exists
if (!fs.existsSync(DB_DIR)) {
  fs.mkdirSync(DB_DIR, { recursive: true });
}

// Initial seed data
function getInitialDatabase(): DatabaseSchema {
  const seedUsers: UserRecord[] = [
    {
      id: 'usr-admin-01',
      email: 'admin@mariyam.com',
      passwordHash: hashPassword('MariyamAdmin2026!'),
      name: 'Mariyam Artistry Admin',
      phone: '+91 98200 11223',
      role: 'ADMIN',
      createdAt: new Date().toISOString()
    },
    {
      id: 'usr-admin-02',
      email: 'director@mariyam-maquillage.com',
      passwordHash: hashPassword('MariyamAdmin2025!'),
      name: 'Executive Director',
      phone: '+91 98200 99887',
      role: 'ADMIN',
      createdAt: new Date().toISOString()
    },
    {
      id: 'usr-cust-01',
      email: 'aanya.sharma@example.com',
      passwordHash: hashPassword('AanyaPass123!'),
      name: 'Aanya Sharma',
      phone: '+91 98201 54321',
      role: 'CUSTOMER',
      createdAt: new Date(Date.now() - 30 * 86400000).toISOString()
    }
  ];

  const seedAddresses: AddressRecord[] = [
    {
      id: 'addr-01',
      userId: 'usr-cust-01',
      fullName: 'Aanya Sharma',
      phone: '+91 98201 54321',
      street: '402, Sea Green Apartments, Carter Road, Bandra West',
      city: 'Mumbai',
      state: 'Maharashtra',
      pincode: '400050',
      isDefault: true,
      type: 'Home'
    }
  ];

  const seedCategories: Category[] = [
    { id: 'cat-makeup', name: 'Makeup', slug: 'makeup', department: 'Makeup', description: 'Foundations, concealers, and lipsticks formulated for Indian skin tones' },
    { id: 'cat-skincare', name: 'Skincare', slug: 'skincare', department: 'Skincare', description: 'Ayurvedic bioactives meets modern dermatological actives' },
    { id: 'cat-fragrance', name: 'Fragrance', slug: 'fragrance', department: 'Fragrance', description: 'Prestige Kannauj rose and pure Assamese oud blends' },
    { id: 'cat-tools', name: 'Tools & Brushes', slug: 'tools', department: 'Tools & Brushes', description: 'Hand-crafted vegan bristles designed for seamless blend' },
    { id: 'cat-bath', name: 'Bath & Body', slug: 'bath-body', department: 'Bath & Body', description: 'Enriched royal body oils and saffron body butters' }
  ];

  const seedBrands: Brand[] = [
    { id: 'br-mariyam', name: 'Mariyam Maquillage', slug: 'mariyam-maquillage', origin: 'Mumbai, India', description: 'Haute Beauté Indienne with 24K gold & Kashmiri saffron bioactives', featured: true },
    { id: 'br-forest', name: 'Forest Essentials', slug: 'forest-essentials', origin: 'Uttarakhand, India', description: 'Luxurious Ayurvedic beauty formulations', featured: true },
    { id: 'br-kama', name: 'Kama Ayurveda', slug: 'kama-ayurveda', origin: 'Delhi, India', description: 'Traditional authentic botanical preparations', featured: true }
  ];

  const seedInventory: InventoryRecord[] = INITIAL_PRODUCTS.map(p => ({
    productId: p.id,
    sku: p.sku,
    stockCount: p.stockCount,
    lowStockThreshold: 25,
    reorderPoint: 50,
    lastUpdated: new Date().toISOString()
  }));

  const seedOrders: Order[] = [
    {
      id: 'ord-101',
      orderNumber: 'MM-2026-9481',
      userId: 'usr-cust-01',
      createdAt: new Date(Date.now() - 36 * 3600 * 1000).toISOString(),
      items: [
        {
          id: 'item-01',
          productId: 'mm-prod-1',
          product: INITIAL_PRODUCTS[0],
          selectedShade: INITIAL_PRODUCTS[0].shades?.[2],
          quantity: 1,
          price: 1899
        },
        {
          id: 'item-02',
          productId: 'mm-prod-3',
          product: INITIAL_PRODUCTS[2],
          selectedShade: INITIAL_PRODUCTS[2].shades?.[0],
          quantity: 1,
          price: 1499
        }
      ],
      subtotal: 3398,
      discountAmount: 340,
      couponCode: 'WELCOME10',
      shippingFee: 0,
      totalAmount: 3058,
      paymentMethod: 'UPI',
      paymentStatus: 'Paid',
      status: 'Shipped',
      courierName: 'Blue Dart Air Express',
      trackingNumber: 'BD-847291039IN',
      estimatedDeliveryDate: 'Tomorrow by 4:00 PM',
      shippingAddress: {
        fullName: 'Aanya Sharma',
        phone: '+91 98201 54321',
        email: 'aanya.sharma@example.com',
        street: '402, Sea Green Apartments, Carter Road',
        city: 'Mumbai',
        state: 'Maharashtra',
        pincode: '400050'
      },
      timeline: [
        {
          status: 'Confirmed',
          timestamp: new Date(Date.now() - 36 * 3600 * 1000).toISOString(),
          description: 'Order confirmed and payment verified via UPI (Ref: UPI-984218)'
        },
        {
          status: 'Packed',
          timestamp: new Date(Date.now() - 24 * 3600 * 1000).toISOString(),
          description: 'Sanitized and packed in Mariyam Signature luxury gift box with dry ice pack'
        },
        {
          status: 'Shipped',
          timestamp: new Date(Date.now() - 10 * 3600 * 1000).toISOString(),
          description: 'Dispatched via Blue Dart Air Express (AWB: BD-847291039IN)',
          location: 'Mumbai Central Cargo Terminal'
        }
      ]
    }
  ];

  const seedPayments: PaymentRecord[] = [
    {
      id: 'pay-01',
      orderId: 'ord-101',
      method: 'UPI',
      amount: 3058,
      status: 'Paid',
      transactionRef: 'UPI-984218-HDFC',
      createdAt: new Date(Date.now() - 36 * 3600 * 1000).toISOString()
    }
  ];

  const seedShipments: ShipmentRecord[] = [
    {
      id: 'ship-01',
      orderId: 'ord-101',
      courierName: 'Blue Dart Air Express',
      trackingNumber: 'BD-847291039IN',
      status: 'Shipped',
      estimatedDeliveryDate: 'Tomorrow by 4:00 PM',
      dispatchDate: new Date(Date.now() - 10 * 3600 * 1000).toISOString(),
      timeline: seedOrders[0].timeline
    }
  ];

  const seedReviews: ProductReview[] = [
    {
      id: 'rev-01',
      productId: 'mm-prod-1',
      author: 'Priya Mukherjee',
      rating: 5,
      date: '2026-09-15',
      title: 'Finally, zero grey or ashy flashback under flashlights!',
      comment: 'I wore 220 Golden Beige for my cousin’s wedding in Kolkata. The foundation held up in 34 degree humidity without separating.',
      shadeUsed: '220 Golden Beige',
      verifiedPurchase: true,
      helpfulCount: 42
    },
    {
      id: 'rev-02',
      productId: 'mm-prod-3',
      author: 'Ananya Deshmukh',
      rating: 5,
      date: '2026-09-28',
      title: 'Transfer-proof through a 4-course banquet!',
      comment: 'Bombay Nude stayed completely intact through dinner and drinks. Non-drying velvet finish.',
      shadeUsed: 'Bombay Nude',
      verifiedPurchase: true,
      helpfulCount: 28
    }
  ];

  const seedBeautyProfiles: BeautyProfile[] = [
    {
      id: 'bp-01',
      userId: 'usr-cust-01',
      skinType: 'Combination',
      skinTone: 'medium',
      undertone: 'warm',
      concerns: ['Barrier Health', 'Humidity Resistance', 'Hyperpigmentation'],
      preferredCoverage: 'Medium',
      preferredFinish: 'Radiant',
      matchedShadeId: 'sh-103',
      matchedShadeName: '220 Golden Beige',
      updatedAt: new Date().toISOString()
    }
  ];

  const seedShadeRecommendations: ShadeRecommendation[] = [
    {
      id: 'sr-01',
      userId: 'usr-cust-01',
      skinTone: 'medium',
      undertone: 'warm',
      confidenceScore: 96,
      matchedShadeId: 'sh-103',
      matchedShadeName: '220 Golden Beige',
      explanation: 'Skin exhibits warm golden nuances perfectly aligned with our 220 Golden Beige spectrum.',
      createdAt: new Date().toISOString()
    }
  ];

  const seedPromotions: Promotion[] = [
    {
      id: 'promo-01',
      title: 'Royal Bridal Season Atelier Special',
      description: 'Receive a complimentary 24K Gold Setting Mist with any trousseau purchase over ₹2,500',
      bannerImage: 'https://images.unsplash.com/photo-1596704017254-9b121068fb31?auto=format&fit=crop&w=1200&q=80',
      discountPercent: 15,
      couponCode: 'ROYAL15',
      validUntil: '2026-12-31',
      isActive: true
    }
  ];

  const seedBanners: Banner[] = [
    {
      id: 'ban-01',
      title: 'Haute Beauté Indienne',
      subtitle: 'Engineered for the nuances of Desi complexions & tropical climate endurance',
      ctaText: 'Explore Royal Atelier',
      ctaLink: '/shop',
      imageUrl: 'https://images.unsplash.com/photo-1596704017254-9b121068fb31?auto=format&fit=crop&w=1600&q=80',
      placement: 'hero',
      active: true
    }
  ];

  const seedCollections: Collection[] = [
    {
      id: 'col-bridal',
      title: 'The Royal Bridal Trousseau',
      slug: 'royal-bridal-trousseau',
      description: 'Long-wear, sweat-resistant formulations curated for Indian wedding ceremonies',
      productIds: ['mm-prod-1', 'mm-prod-2', 'mm-prod-3', 'mm-prod-7', 'mm-prod-8'],
      bannerImage: 'https://images.unsplash.com/photo-1596704017254-9b121068fb31?auto=format&fit=crop&w=1200&q=80',
      isFeatured: true
    }
  ];

  return {
    users: seedUsers,
    addresses: seedAddresses,
    products: INITIAL_PRODUCTS,
    variants: [],
    categories: seedCategories,
    brands: seedBrands,
    inventory: seedInventory,
    carts: [],
    wishlists: [
      {
        id: 'wl-01',
        userId: 'usr-cust-01',
        productIds: ['mm-prod-1', 'mm-prod-13'],
        updatedAt: new Date().toISOString()
      }
    ],
    orders: seedOrders,
    payments: seedPayments,
    shipments: seedShipments,
    coupons: INITIAL_COUPONS,
    promotions: seedPromotions,
    reviews: seedReviews,
    banners: seedBanners,
    collections: seedCollections,
    beautyProfiles: seedBeautyProfiles,
    shadeRecommendations: seedShadeRecommendations,
    aiConversations: []
  };
}

class Database {
  private data: DatabaseSchema;

  constructor() {
    this.data = this.loadDatabase();
  }

  private loadDatabase(): DatabaseSchema {
    try {
      if (fs.existsSync(DB_FILE)) {
        const raw = fs.readFileSync(DB_FILE, 'utf-8');
        const parsed = JSON.parse(raw);
        // Ensure all required collections exist if upgraded
        const initial = getInitialDatabase();
        const existingUsers: UserRecord[] = parsed.users || [];
        const mergedUsers = [...existingUsers];
        for (const su of initial.users) {
          if (!mergedUsers.some(u => u.email.toLowerCase() === su.email.toLowerCase())) {
            mergedUsers.push(su);
          }
        }
        const existingCoupons: Coupon[] = parsed.coupons || [];
        const mergedCoupons = [...existingCoupons];
        for (const sc of initial.coupons) {
          if (!mergedCoupons.some(c => c.code.toUpperCase() === sc.code.toUpperCase())) {
            mergedCoupons.push(sc);
          }
        }
        return {
          ...initial,
          ...parsed,
          users: mergedUsers,
          addresses: parsed.addresses || initial.addresses,
          products: parsed.products || initial.products,
          orders: parsed.orders || initial.orders,
          carts: parsed.carts || [],
          wishlists: parsed.wishlists || initial.wishlists,
          reviews: parsed.reviews || initial.reviews,
          coupons: mergedCoupons,
          beautyProfiles: parsed.beautyProfiles || initial.beautyProfiles,
          shadeRecommendations: parsed.shadeRecommendations || initial.shadeRecommendations,
          aiConversations: parsed.aiConversations || []
        };
      }
    } catch (err) {
      console.warn('Failed to load database file, reinitializing fresh seed:', err);
    }
    const initial = getInitialDatabase();
    this.persist(initial);
    return initial;
  }

  private persist(dataToSave: DatabaseSchema) {
    try {
      const tempFile = `${DB_FILE}.tmp`;
      fs.writeFileSync(tempFile, JSON.stringify(dataToSave, null, 2), 'utf-8');
      fs.renameSync(tempFile, DB_FILE);
    } catch (err) {
      console.error('Critical database write error:', err);
    }
  }

  private save() {
    this.persist(this.data);
  }

  // ===================== USER & AUTH =====================
  public findUserByEmail(email: string): UserRecord | undefined {
    return this.data.users.find(u => u.email.toLowerCase() === email.trim().toLowerCase());
  }

  public findUserById(id: string): UserRecord | undefined {
    return this.data.users.find(u => u.id === id);
  }

  public createUser(user: { email: string; passwordHash: string; name: string; phone?: string; role?: 'CUSTOMER' | 'ADMIN' }): UserRecord {
    const record: UserRecord = {
      id: `usr-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      email: user.email.trim().toLowerCase(),
      passwordHash: user.passwordHash,
      name: user.name.trim(),
      phone: user.phone?.trim(),
      role: user.role || 'CUSTOMER',
      createdAt: new Date().toISOString()
    };
    this.data.users.push(record);

    // Initialize default wishlist for new user
    this.data.wishlists.push({
      id: `wl-${record.id}`,
      userId: record.id,
      productIds: [],
      updatedAt: new Date().toISOString()
    });

    this.save();
    return record;
  }

  public updateUser(id: string, updates: Partial<User>): UserRecord | null {
    const idx = this.data.users.findIndex(u => u.id === id);
    if (idx === -1) return null;
    this.data.users[idx] = { ...this.data.users[idx], ...updates, updatedAt: new Date().toISOString() };
    this.save();
    return this.data.users[idx];
  }

  // ===================== ADDRESSES =====================
  public getAddresses(userId: string): AddressRecord[] {
    return this.data.addresses.filter(a => a.userId === userId);
  }

  public createAddress(userId: string, addressData: Omit<AddressRecord, 'id' | 'userId'>): AddressRecord {
    if (addressData.isDefault) {
      // Unset previous defaults
      this.data.addresses.forEach(a => {
        if (a.userId === userId) a.isDefault = false;
      });
    }

    const newAddr: AddressRecord = {
      ...addressData,
      id: `addr-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      userId,
      isDefault: addressData.isDefault ?? (this.getAddresses(userId).length === 0)
    };
    this.data.addresses.push(newAddr);
    this.save();
    return newAddr;
  }

  public updateAddress(userId: string, addressId: string, updates: Partial<AddressRecord>): AddressRecord | null {
    const idx = this.data.addresses.findIndex(a => a.id === addressId && a.userId === userId);
    if (idx === -1) return null;

    if (updates.isDefault) {
      this.data.addresses.forEach(a => {
        if (a.userId === userId) a.isDefault = false;
      });
    }

    this.data.addresses[idx] = { ...this.data.addresses[idx], ...updates };
    this.save();
    return this.data.addresses[idx];
  }

  public deleteAddress(userId: string, addressId: string): boolean {
    const lenBefore = this.data.addresses.length;
    this.data.addresses = this.data.addresses.filter(a => !(a.id === addressId && a.userId === userId));
    this.save();
    return this.data.addresses.length < lenBefore;
  }

  // ===================== CATALOG & PRODUCTS =====================
  public getAllProducts(filters?: {
    department?: string;
    category?: string;
    subcategory?: string;
    brand?: string;
    undertone?: string;
    skinType?: string;
    finish?: string;
    minPrice?: number;
    maxPrice?: number;
    inStockOnly?: boolean;
    search?: string;
    sort?: 'price-low' | 'price-high' | 'rating' | 'discount' | 'bestseller' | 'featured';
  }): Product[] {
    let list = [...this.data.products];

    if (filters) {
      if (filters.department && filters.department !== 'All') {
        list = list.filter(p => p.department.toLowerCase() === filters.department!.toLowerCase());
      }
      if (filters.category && filters.category !== 'All') {
        list = list.filter(p => p.category.toLowerCase() === filters.category!.toLowerCase());
      }
      if (filters.subcategory && filters.subcategory !== 'All') {
        list = list.filter(p => p.subcategory.toLowerCase() === filters.subcategory!.toLowerCase());
      }
      if (filters.brand && filters.brand !== 'All') {
        list = list.filter(p => p.brand.toLowerCase() === filters.brand!.toLowerCase());
      }
      if (filters.undertone && filters.undertone !== 'All') {
        list = list.filter(p => p.undertones?.some(u => u.toLowerCase() === filters.undertone!.toLowerCase()));
      }
      if (filters.skinType && filters.skinType !== 'All') {
        list = list.filter(p => p.skinTypeCompatibility?.some(st => st.toLowerCase() === filters.skinType!.toLowerCase()));
      }
      if (filters.finish && filters.finish !== 'All') {
        list = list.filter(p => p.finish?.toLowerCase() === filters.finish!.toLowerCase());
      }
      if (filters.minPrice !== undefined) {
        list = list.filter(p => p.price >= filters.minPrice!);
      }
      if (filters.maxPrice !== undefined) {
        list = list.filter(p => p.price <= filters.maxPrice!);
      }
      if (filters.inStockOnly) {
        list = list.filter(p => p.stockCount > 0);
      }
      if (filters.search) {
        const q = filters.search.toLowerCase().trim();
        list = list.filter(p =>
          p.name.toLowerCase().includes(q) ||
          p.brand.toLowerCase().includes(q) ||
          p.subcategory.toLowerCase().includes(q) ||
          p.sku.toLowerCase().includes(q) ||
          p.tags?.some(t => t.toLowerCase().includes(q)) ||
          p.shades?.some(s => s.name.toLowerCase().includes(q))
        );
      }

      // Sorting
      if (filters.sort === 'price-low') {
        list.sort((a, b) => a.price - b.price);
      } else if (filters.sort === 'price-high') {
        list.sort((a, b) => b.price - a.price);
      } else if (filters.sort === 'rating') {
        list.sort((a, b) => b.rating - a.rating);
      } else if (filters.sort === 'discount') {
        list.sort((a, b) => (b.discountPercent || 0) - (a.discountPercent || 0));
      } else if (filters.sort === 'bestseller') {
        list.sort((a, b) => (b.isBestseller ? 1 : 0) - (a.isBestseller ? 1 : 0));
      }
    }

    return list;
  }

  public getProductById(id: string): Product | undefined {
    return this.data.products.find(p => p.id === id);
  }

  public getProductBySlug(slug: string): Product | undefined {
    return this.data.products.find(p => p.slug === slug);
  }

  public createProduct(product: Product): Product {
    this.data.products.unshift(product);
    this.data.inventory.push({
      productId: product.id,
      sku: product.sku,
      stockCount: product.stockCount,
      lowStockThreshold: 25,
      reorderPoint: 50,
      lastUpdated: new Date().toISOString()
    });
    this.save();
    return product;
  }

  public updateProduct(id: string, updates: Partial<Product>): Product | null {
    const idx = this.data.products.findIndex(p => p.id === id);
    if (idx === -1) return null;
    this.data.products[idx] = { ...this.data.products[idx], ...updates };

    // Keep inventory in sync
    const inv = this.data.inventory.find(i => i.productId === id);
    if (inv && updates.stockCount !== undefined) {
      inv.stockCount = updates.stockCount;
      inv.lastUpdated = new Date().toISOString();
    }

    this.save();
    return this.data.products[idx];
  }

  public deleteProduct(id: string): boolean {
    const lenBefore = this.data.products.length;
    this.data.products = this.data.products.filter(p => p.id !== id);
    this.data.inventory = this.data.inventory.filter(i => i.productId !== id);
    this.save();
    return this.data.products.length < lenBefore;
  }

  public adjustStock(productId: string, quantityDelta: number): Product | null {
    const prod = this.getProductById(productId);
    if (!prod) return null;
    prod.stockCount = Math.max(0, prod.stockCount + quantityDelta);

    const inv = this.data.inventory.find(i => i.productId === productId);
    if (inv) {
      inv.stockCount = prod.stockCount;
      inv.lastUpdated = new Date().toISOString();
    }

    this.save();
    return prod;
  }

  // ===================== REVIEWS =====================
  public getProductReviews(productId: string): ProductReview[] {
    return this.data.reviews.filter(r => r.productId === productId || !r.productId);
  }

  public addReview(reviewData: Omit<ProductReview, 'id' | 'date' | 'helpfulCount'>): ProductReview {
    const review: ProductReview = {
      ...reviewData,
      id: `rev-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      date: new Date().toISOString().split('T')[0],
      helpfulCount: 0
    };
    this.data.reviews.unshift(review);

    // Recalculate average rating for product
    if (reviewData.productId) {
      const prod = this.getProductById(reviewData.productId);
      if (prod) {
        const prodRevs = this.data.reviews.filter(r => r.productId === prod.id);
        const totalRating = prodRevs.reduce((acc, r) => acc + r.rating, 0);
        prod.rating = Number((totalRating / prodRevs.length).toFixed(1));
        prod.reviewCount = prodRevs.length;
      }
    }

    this.save();
    return review;
  }

  // ===================== CART =====================
  public getCart(userId?: string, sessionId?: string): CartRecord {
    let cart = this.data.carts.find(c => {
      if (userId && c.userId === userId) return true;
      if (sessionId && c.sessionId === sessionId) return true;
      return false;
    });

    if (!cart) {
      cart = {
        id: `cart-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
        userId,
        sessionId,
        items: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      this.data.carts.push(cart);
      this.save();
    }
    return cart;
  }

  public addItemToCart(
    userId: string | undefined,
    sessionId: string | undefined,
    item: { productId: string; shadeId?: string; variantId?: string; quantity: number }
  ): { cart: CartRecord; error?: string } {
    const qty = Number(item.quantity);
    if (!Number.isInteger(qty) || qty <= 0) {
      return { cart: this.getCart(userId, sessionId), error: 'Quantity must be a positive whole number.' };
    }

    const product = this.getProductById(item.productId);
    if (!product) return { cart: this.getCart(userId, sessionId), error: 'Product not found' };

    if (product.stockCount < qty) {
      return { cart: this.getCart(userId, sessionId), error: `Only ${product.stockCount} units in stock` };
    }

    const cart = this.getCart(userId, sessionId);
    const selectedShade = product.shades?.find(s => s.id === item.shadeId) || (product.shades ? product.shades[0] : undefined);
    const selectedVariant = product.variants?.find(v => v.id === item.variantId);

    const existingIndex = cart.items.findIndex(ci =>
      ci.productId === item.productId &&
      (item.shadeId ? ci.selectedShade?.id === item.shadeId : !ci.selectedShade) &&
      (item.variantId ? ci.selectedVariant?.id === item.variantId : !ci.selectedVariant)
    );

    if (existingIndex > -1) {
      const newQty = cart.items[existingIndex].quantity + qty;
      if (newQty > product.stockCount) {
        return { cart, error: `Cannot exceed stock limit of ${product.stockCount}` };
      }
      cart.items[existingIndex].quantity = newQty;
    } else {
      cart.items.push({
        id: `ci-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
        productId: product.id,
        product,
        selectedShade,
        selectedVariant,
        quantity: qty,
        price: selectedVariant?.price || product.price
      });
    }

    cart.updatedAt = new Date().toISOString();
    this.save();
    return { cart };
  }

  public updateCartItemQuantity(
    userId: string | undefined,
    sessionId: string | undefined,
    cartItemId: string,
    quantity: number
  ): CartRecord {
    const cart = this.getCart(userId, sessionId);
    const qty = Number(quantity);
    if (isNaN(qty) || !Number.isInteger(qty) || qty < 0) {
      return cart;
    }
    if (qty === 0) {
      cart.items = cart.items.filter(ci => ci.id !== cartItemId);
    } else {
      const target = cart.items.find(ci => ci.id === cartItemId);
      if (target) {
        const prod = this.getProductById(target.productId);
        if (prod && qty <= prod.stockCount) {
          target.quantity = qty;
        }
      }
    }
    cart.updatedAt = new Date().toISOString();
    this.save();
    return cart;
  }

  public removeCartItem(
    userId: string | undefined,
    sessionId: string | undefined,
    cartItemId: string
  ): CartRecord {
    const cart = this.getCart(userId, sessionId);
    cart.items = cart.items.filter(ci => ci.id !== cartItemId);
    cart.updatedAt = new Date().toISOString();
    this.save();
    return cart;
  }

  public clearCart(userId?: string, sessionId?: string): CartRecord {
    const cart = this.getCart(userId, sessionId);
    cart.items = [];
    cart.couponCode = undefined;
    cart.updatedAt = new Date().toISOString();
    this.save();
    return cart;
  }

  /**
   * Intelligently merges a guest session cart into the authenticated customer's cart
   * Prevents duplicates by combining quantities and validating stock
   */
  public mergeCarts(userId: string, guestSessionId: string): CartRecord {
    const guestCart = this.data.carts.find(c => c.sessionId === guestSessionId && c.items.length > 0);
    const userCart = this.getCart(userId);

    if (!guestCart || guestCart.items.length === 0) {
      return userCart;
    }

    for (const gItem of guestCart.items) {
      const prod = this.getProductById(gItem.productId);
      if (!prod || prod.stockCount <= 0) continue;

      const existingIdx = userCart.items.findIndex(uItem =>
        uItem.productId === gItem.productId &&
        (gItem.selectedShade ? uItem.selectedShade?.id === gItem.selectedShade.id : !uItem.selectedShade)
      );

      if (existingIdx > -1) {
        const combined = userCart.items[existingIdx].quantity + gItem.quantity;
        userCart.items[existingIdx].quantity = Math.min(combined, prod.stockCount);
      } else {
        userCart.items.push({
          ...gItem,
          id: `ci-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
          product: prod
        });
      }
    }

    if (guestCart.couponCode && !userCart.couponCode) {
      userCart.couponCode = guestCart.couponCode;
    }

    // Clean up guest cart items
    guestCart.items = [];
    guestCart.updatedAt = new Date().toISOString();
    userCart.updatedAt = new Date().toISOString();

    this.save();
    return userCart;
  }

  // ===================== WISHLIST =====================
  public getWishlist(userId?: string, sessionId?: string): WishlistRecord {
    let wl = this.data.wishlists.find(w => {
      if (userId && w.userId === userId) return true;
      if (sessionId && w.sessionId === sessionId) return true;
      return false;
    });

    if (!wl) {
      wl = {
        id: `wl-${Date.now()}`,
        userId,
        sessionId,
        productIds: [],
        updatedAt: new Date().toISOString()
      };
      this.data.wishlists.push(wl);
      this.save();
    }
    return wl;
  }

  public toggleWishlist(userId: string | undefined, sessionId: string | undefined, productId: string): { wishlist: WishlistRecord; added: boolean } {
    const wl = this.getWishlist(userId, sessionId);
    const exists = wl.productIds.includes(productId);
    if (exists) {
      wl.productIds = wl.productIds.filter(id => id !== productId);
    } else {
      wl.productIds.push(productId);
    }
    wl.updatedAt = new Date().toISOString();
    this.save();
    return { wishlist: wl, added: !exists };
  }

  // ===================== ORDERS & TRANSACTIONS =====================
  public createOrderTransaction(orderData: {
    userId?: string;
    items: Array<{ productId: string; shadeId?: string; variantId?: string; quantity: number }>;
    shippingAddress: any;
    paymentMethod: 'UPI' | 'Card' | 'Netbanking' | 'COD';
    couponCode?: string;
  }): { success: boolean; order?: Order; error?: string } {
    // 1. Validate shipping address
    if (!orderData.shippingAddress || !orderData.shippingAddress.fullName?.trim() || !orderData.shippingAddress.phone?.trim() || !orderData.shippingAddress.street?.trim()) {
      return { success: false, error: 'Full name, phone number, and street address are required.' };
    }
    const cleanPincode = (orderData.shippingAddress.pincode || '').toString().trim();
    if (cleanPincode.length !== 6 || !/^\d{6}$/.test(cleanPincode)) {
      return { success: false, error: 'A valid 6-digit Indian delivery pincode is required.' };
    }

    if (!orderData.items || !Array.isArray(orderData.items) || orderData.items.length === 0) {
      return { success: false, error: 'Order must contain at least one item.' };
    }

    // 2. Atomically validate real inventory & quantities for all items
    for (const item of orderData.items) {
      const numQty = Number(item.quantity);
      if (!Number.isInteger(numQty) || numQty <= 0) {
        return { success: false, error: `Invalid item quantity (${item.quantity}). Quantity must be a positive whole number.` };
      }
      const prod = this.getProductById(item.productId);
      if (!prod) {
        return { success: false, error: `Product ID ${item.productId} was not found in catalog.` };
      }
      if (prod.stockCount < numQty) {
        return {
          success: false,
          error: `Insufficient stock for "${prod.name}". Available: ${prod.stockCount}, Requested: ${numQty}.`
        };
      }
    }

    // 3. Compute subtotal & financial amounts server-side
    let subtotal = 0;
    const fullItems: CartItem[] = orderData.items.map(item => {
      const prod = this.getProductById(item.productId)!;
      const shade = prod.shades?.find(s => s.id === item.shadeId) || (prod.shades ? prod.shades[0] : undefined);
      const variant = prod.variants?.find(v => v.id === item.variantId);
      const unitPrice = variant?.price || prod.price;
      const numQty = Number(item.quantity);
      subtotal += unitPrice * numQty;
      return {
        id: `ord-item-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
        productId: prod.id,
        product: prod,
        selectedShade: shade,
        selectedVariant: variant,
        quantity: numQty,
        price: unitPrice
      };
    });

    // 4. Validate coupon server-side
    let discountAmount = 0;
    let validCouponCode = undefined;
    if (orderData.couponCode) {
      const couponCheck = this.validateCoupon(orderData.couponCode, subtotal);
      if (couponCheck.valid && couponCheck.coupon) {
        validCouponCode = couponCheck.coupon.code;
        if (couponCheck.coupon.discountType === 'percentage') {
          discountAmount = Math.round((subtotal * couponCheck.coupon.discountValue) / 100);
        } else {
          discountAmount = Math.min(subtotal, couponCheck.coupon.discountValue);
        }
        // Increment coupon usage
        couponCheck.coupon.usedCount = (couponCheck.coupon.usedCount || 0) + 1;
      }
    }

    const freeShippingThreshold = 999;
    const shippingFee = subtotal >= freeShippingThreshold ? 0 : 99;
    const totalAmount = Math.max(0, subtotal - discountAmount + shippingFee);

    // 5. Atomically deduct stock from live inventory
    for (const item of orderData.items) {
      const numQty = Number(item.quantity);
      this.adjustStock(item.productId, -numQty);
    }

    // 5. Construct Order & Tracking Details
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const orderNumber = `MM-${new Date().getFullYear()}-${randomSuffix}`;
    const orderId = `ord-${Date.now()}`;
    const trackingNumber = `BD-${Math.floor(100000000 + Math.random() * 900000000)}IN`;

    const order: Order = {
      id: orderId,
      orderNumber,
      userId: orderData.userId,
      createdAt: new Date().toISOString(),
      items: fullItems,
      subtotal,
      discountAmount,
      discount: discountAmount,
      couponCode: validCouponCode,
      shippingFee,
      totalAmount,
      total: totalAmount,
      paymentMethod: orderData.paymentMethod,
      paymentStatus: orderData.paymentMethod === 'COD' ? 'COD Confirmed' : 'Paid',
      shippingAddress: orderData.shippingAddress,
      status: 'Confirmed',
      courierName: 'Blue Dart Air Express',
      trackingNumber,
      estimatedDeliveryDate: 'Within 2-3 Business Days',
      timeline: [
        {
          status: 'Confirmed',
          timestamp: new Date().toISOString(),
          description: `Order ${orderNumber} confirmed with ${orderData.paymentMethod} payment.`
        }
      ]
    };

    this.data.orders.unshift(order);

    // Record Payment
    this.data.payments.push({
      id: `pay-${Date.now()}`,
      orderId,
      method: orderData.paymentMethod,
      amount: totalAmount,
      status: orderData.paymentMethod === 'COD' ? 'COD Confirmed' : 'Paid',
      transactionRef: `${orderData.paymentMethod}-${Date.now().toString().slice(-6)}`,
      createdAt: new Date().toISOString()
    });

    // Record Shipment
    this.data.shipments.push({
      id: `ship-${Date.now()}`,
      orderId,
      courierName: 'Blue Dart Air Express',
      trackingNumber,
      status: 'Confirmed',
      estimatedDeliveryDate: 'Within 2-3 Business Days',
      timeline: order.timeline
    });

    // Clear cart for the user
    if (orderData.userId) {
      this.clearCart(orderData.userId);
    }

    this.save();
    return { success: true, order };
  }

  public getOrders(userId?: string): Order[] {
    if (userId) {
      const user = this.findUserById(userId);
      return this.data.orders.filter(o =>
        o.userId === userId ||
        (user && o.shippingAddress.email?.toLowerCase() === user.email.toLowerCase())
      );
    }
    return this.data.orders;
  }

  public getOrderByNumber(orderNumber: string): Order | undefined {
    return this.data.orders.find(o =>
      o.orderNumber.toLowerCase() === orderNumber.trim().toLowerCase() ||
      o.trackingNumber?.toLowerCase() === orderNumber.trim().toLowerCase()
    );
  }

  public updateOrderStatus(
    orderId: string,
    status: OrderStatus,
    note?: string,
    courierName?: string,
    trackingNumber?: string
  ): Order | null {
    const order = this.data.orders.find(o => o.id === orderId || o.orderNumber === orderId);
    if (!order) return null;

    const prevStatus = order.status;
    order.status = status;
    if (courierName) order.courierName = courierName;
    if (trackingNumber) order.trackingNumber = trackingNumber;

    // Replenish inventory if cancelling an active order
    if (prevStatus !== 'Cancelled' && status === 'Cancelled') {
      for (const item of order.items) {
        this.adjustStock(item.productId, item.quantity);
      }
    } else if (prevStatus === 'Cancelled' && status !== 'Cancelled') {
      // Re-activating a cancelled order: re-deduct
      for (const item of order.items) {
        this.adjustStock(item.productId, -item.quantity);
      }
    }

    order.timeline.push({
      status,
      timestamp: new Date().toISOString(),
      description: note || `Order updated to ${status}`
    });

    // Sync shipment
    const shipment = this.data.shipments.find(s => s.orderId === order.id);
    if (shipment) {
      shipment.status = status;
      shipment.timeline = order.timeline;
    }

    this.save();
    return order;
  }

  // ===================== COUPONS =====================
  public validateCoupon(code: string, subtotal: number): { valid: boolean; coupon?: Coupon; error?: string } {
    const coupon = this.data.coupons.find(c => c.code.toUpperCase() === code.trim().toUpperCase());
    if (!coupon) {
      return { valid: false, error: `Invalid promotional code "${code}". Try WELCOME10, ROYAL15, or ROYAL20.` };
    }
    if (coupon.expiresAt && new Date(coupon.expiresAt).getTime() < Date.now()) {
      return { valid: false, error: `Promotional code "${coupon.code}" has expired.` };
    }
    if (coupon.usageLimit && (coupon.usedCount || 0) >= coupon.usageLimit) {
      return { valid: false, error: `Promotional code "${coupon.code}" has reached its maximum redemptions.` };
    }
    if (coupon.minOrderValue && subtotal < coupon.minOrderValue) {
      return {
        valid: false,
        error: `Coupon ${coupon.code} requires a minimum order value of ₹${coupon.minOrderValue.toLocaleString('en-IN')}`
      };
    }
    return { valid: true, coupon };
  }

  // ===================== PINCODE & LOGISTICS =====================
  public checkPincode(pincode: string): { serviceable: boolean; city?: string; state?: string; days?: number; expressAvailable?: boolean } {
    const clean = pincode.trim();
    const entry = PINCODE_DIRECTORY[clean];
    if (entry) {
      return {
        serviceable: true,
        city: entry.city,
        state: entry.state,
        days: entry.days,
        expressAvailable: entry.days <= 2
      };
    }
    // Pan-India fallback for standard 6 digit codes
    if (clean.length === 6 && /^\d+$/.test(clean)) {
      return {
        serviceable: true,
        city: 'Pan-India Destination',
        state: 'India',
        days: 3,
        expressAvailable: false
      };
    }
    return { serviceable: false };
  }

  // ===================== BEAUTY PROFILE & SHADE =====================
  public getBeautyProfile(userId: string): BeautyProfile | undefined {
    return this.data.beautyProfiles.find(b => b.userId === userId);
  }

  public saveBeautyProfile(userId: string, profile: Partial<BeautyProfile>): BeautyProfile {
    let existing = this.data.beautyProfiles.find(b => b.userId === userId);
    if (existing) {
      Object.assign(existing, profile, { updatedAt: new Date().toISOString() });
    } else {
      existing = {
        id: `bp-${Date.now()}`,
        userId,
        ...profile,
        updatedAt: new Date().toISOString()
      };
      this.data.beautyProfiles.push(existing);
    }
    this.save();
    return existing;
  }

  public saveShadeRecommendation(userId: string | undefined, rec: Omit<ShadeRecommendation, 'id' | 'createdAt'>): ShadeRecommendation {
    const record: ShadeRecommendation = {
      ...rec,
      id: `sr-${Date.now()}`,
      userId,
      createdAt: new Date().toISOString()
    };
    this.data.shadeRecommendations.unshift(record);

    if (userId) {
      this.saveBeautyProfile(userId, {
        skinTone: rec.skinTone,
        undertone: rec.undertone,
        matchedShadeId: rec.matchedShadeId,
        matchedShadeName: rec.matchedShadeName
      });
    }

    this.save();
    return record;
  }

  // ===================== AI CONVERSATIONS =====================
  public getAIConversation(userId?: string, sessionId?: string): AIConversation | undefined {
    return this.data.aiConversations.find(c => {
      if (userId && c.userId === userId) return true;
      if (sessionId && c.sessionId === sessionId) return true;
      return false;
    });
  }

  public appendAIMessage(userId: string | undefined, sessionId: string | undefined, message: AIMessage): AIConversation {
    let conv = this.getAIConversation(userId, sessionId);
    if (!conv) {
      conv = {
        id: `conv-${Date.now()}`,
        userId,
        sessionId,
        messages: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      this.data.aiConversations.push(conv);
    }
    conv.messages.push(message);
    conv.updatedAt = new Date().toISOString();
    this.save();
    return conv;
  }

  // ===================== ADMIN METRICS =====================
  public getAdminMetrics(): AdminMetrics {
    const totalOrders = this.data.orders.length;
    const totalRevenue = this.data.orders.reduce((sum, o) => {
      return sum + (o.paymentStatus === 'Paid' || o.paymentStatus === 'COD Confirmed' ? o.totalAmount : 0);
    }, 0);
    const averageOrderValue = totalOrders > 0 ? Math.round(totalRevenue / totalOrders) : 0;
    const uniqueCustomerEmails = new Set(this.data.orders.map(o => o.shippingAddress.email));
    const lowStockItemsCount = this.data.products.filter(p => p.stockCount <= 25).length;
    const bestsellersCount = this.data.products.filter(p => p.isBestseller).length;

    return {
      totalRevenue,
      totalOrders,
      averageOrderValue,
      totalCustomers: uniqueCustomerEmails.size,
      conversionRate: 3.8,
      lowStockItemsCount,
      bestsellersCount
    };
  }

  // ===================== ADMIN EXTENSIONS =====================
  public getAllCustomers(): Array<Omit<UserRecord, 'passwordHash'> & { orderCount: number; totalSpent: number }> {
    return this.data.users
      .filter(u => u.role === 'CUSTOMER')
      .map(u => {
        const userOrders = this.data.orders.filter(o => o.userId === u.id);
        const totalSpent = userOrders.reduce((sum, o) => sum + (o.totalAmount || 0), 0);
        const { passwordHash, ...safeUser } = u;
        return {
          ...safeUser,
          orderCount: userOrders.length,
          totalSpent
        };
      });
  }

  public getAllCoupons(): Coupon[] {
    return this.data.coupons;
  }

  public createCoupon(coupon: Coupon): Coupon {
    const existing = this.data.coupons.findIndex(c => c.code.toUpperCase() === coupon.code.toUpperCase());
    if (existing > -1) {
      this.data.coupons[existing] = { ...this.data.coupons[existing], ...coupon };
    } else {
      this.data.coupons.push(coupon);
    }
    this.save();
    return coupon;
  }

  public deleteCoupon(code: string): boolean {
    const initialLen = this.data.coupons.length;
    this.data.coupons = this.data.coupons.filter(c => c.code.toUpperCase() !== code.toUpperCase());
    this.save();
    return this.data.coupons.length < initialLen;
  }

  public getBanners(): Banner[] {
    return this.data.banners || [];
  }

  public createBanner(banner: Banner): Banner {
    if (!this.data.banners) this.data.banners = [];
    const idx = this.data.banners.findIndex(b => b.id === banner.id);
    if (idx > -1) {
      this.data.banners[idx] = banner;
    } else {
      this.data.banners.push(banner);
    }
    this.save();
    return banner;
  }

  public deleteBanner(id: string): boolean {
    if (!this.data.banners) return false;
    const len = this.data.banners.length;
    this.data.banners = this.data.banners.filter(b => b.id !== id);
    this.save();
    return this.data.banners.length < len;
  }

  public toggleBanner(id: string): Banner | null {
    if (!this.data.banners) return null;
    const target = this.data.banners.find(b => b.id === id);
    if (!target) return null;
    target.active = !target.active;
    this.save();
    return target;
  }
}

export const db = new Database();
