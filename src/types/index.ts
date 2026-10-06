export type SkinTone = 'fair' | 'light' | 'medium' | 'tan' | 'deep';
export type Undertone = 'warm' | 'cool' | 'neutral' | 'olive';
export type SkinType = 'Dry' | 'Oily' | 'Combination' | 'Normal' | 'Sensitive' | 'Acne-Prone' | 'Mature';
export type FinishType = 'Dewy' | 'Matte' | 'Satin' | 'Velvet' | 'Radiant';
export type CoverageType = 'Sheer' | 'Light' | 'Medium' | 'Full';
export type UserRole = 'CUSTOMER' | 'ADMIN';

export interface User {
  id: string;
  email: string;
  name: string;
  phone?: string;
  role: UserRole;
  createdAt: string;
  updatedAt?: string;
}

export interface Address {
  id: string;
  userId: string;
  fullName: string;
  phone: string;
  street: string;
  apartment?: string;
  city: string;
  state: string;
  pincode: string;
  isDefault: boolean;
  type?: 'Home' | 'Office' | 'Other';
}

export interface ProductShade {
  id: string;
  name: string;
  hexCode: string;
  undertone: Undertone;
  description: string;
  swatchUrl?: string;
  image?: string;
  inStock?: boolean;
}

export interface ProductVariant {
  id: string;
  productId: string;
  sku: string;
  name: string;
  size?: string;
  color?: string;
  price: number;
  mrp: number;
  stockCount: number;
  image?: string;
}

export interface ProductReview {
  id: string;
  productId?: string;
  author: string;
  userId?: string;
  rating: number;
  date: string;
  title: string;
  comment: string;
  shadeUsed?: string;
  verifiedPurchase: boolean;
  helpfulCount: number;
}

export interface Product {
  id: string;
  sku: string;
  name: string;
  slug: string;
  brand: string;
  brandType?: 'Mariyam Signature' | 'Indian Prestige' | 'International Luxury';
  department: string; // 'Makeup' | 'Skincare' | 'Fragrance' | 'Tools & Brushes' | 'Bath & Body'
  category: string;
  subcategory: string;
  price: number;
  mrp: number;
  compareAtPrice?: number;
  discountPercent?: number;
  rating: number;
  reviewCount: number;
  verifiedPurchaseCount?: number;
  images: string[];
  primaryImage: string;
  thumbnail: string;
  gallery: string[];
  lifestyleImage?: string;
  swatchImage?: string;
  shades?: ProductShade[];
  variants?: ProductVariant[];
  skinTypeCompatibility?: SkinType[];
  undertones?: Undertone[];
  finish?: FinishType;
  coverage?: CoverageType;
  concerns?: string[];
  keyIngredients?: string[];
  benefits?: string[];
  howToUse?: string;
  ingredientsList?: string;
  shortDescription?: string;
  fullDescription?: string;
  stockCount: number;
  tags?: string[];
  isBestseller?: boolean;
  isFeatured?: boolean;
  isNewArrival?: boolean;
  isClean?: boolean;
  isCrueltyFree?: boolean;
  isVegan?: boolean;
  seoTitle?: string;
  seoDescription?: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  department: string;
  description?: string;
  image?: string;
}

export interface Brand {
  id: string;
  name: string;
  slug: string;
  origin?: string;
  description?: string;
  logo?: string;
  featured?: boolean;
}

export interface InventoryRecord {
  productId: string;
  sku: string;
  stockCount: number;
  lowStockThreshold: number;
  reorderPoint: number;
  lastUpdated: string;
}

export interface CartItem {
  id?: string;
  productId: string;
  product: Product;
  selectedShade?: ProductShade;
  selectedVariant?: ProductVariant;
  quantity: number;
  price: number;
}

export interface CartRecord {
  id: string;
  userId?: string;
  sessionId?: string;
  items: CartItem[];
  couponCode?: string;
  createdAt: string;
  updatedAt: string;
}

export interface WishlistRecord {
  id: string;
  userId?: string;
  sessionId?: string;
  productIds: string[];
  updatedAt: string;
}

export interface Coupon {
  code: string;
  discountType: 'percentage' | 'fixed';
  discountValue: number;
  minOrderValue?: number;
  description: string;
  expiresAt?: string;
  usageLimit?: number;
  usedCount?: number;
}

export interface Promotion {
  id: string;
  title: string;
  description: string;
  bannerImage: string;
  discountPercent?: number;
  couponCode?: string;
  validUntil: string;
  isActive: boolean;
}

export interface Banner {
  id: string;
  title: string;
  subtitle: string;
  ctaText: string;
  ctaLink: string;
  imageUrl: string;
  placement: 'hero' | 'middle' | 'strip';
  active: boolean;
}

export interface Collection {
  id: string;
  title: string;
  slug: string;
  description: string;
  productIds: string[];
  bannerImage?: string;
  isFeatured?: boolean;
}

export interface ShippingAddress {
  fullName: string;
  phone: string;
  email: string;
  street: string;
  apartment?: string;
  city: string;
  state: string;
  pincode: string;
  isDefault?: boolean;
}

export type OrderStatus =
  | 'Pending'
  | 'Confirmed'
  | 'Processing'
  | 'Packed'
  | 'Shipped'
  | 'Out for Delivery'
  | 'Delivered'
  | 'Cancelled';

export interface OrderTimelineEvent {
  status: OrderStatus;
  timestamp: string;
  description: string;
  location?: string;
}

export interface PaymentRecord {
  id: string;
  orderId: string;
  method: 'UPI' | 'Card' | 'Netbanking' | 'COD';
  amount: number;
  status: 'Paid' | 'Pending' | 'COD Confirmed' | 'Refunded';
  transactionRef?: string;
  createdAt: string;
}

export interface ShipmentRecord {
  id: string;
  orderId: string;
  courierName: string;
  trackingNumber: string;
  status: OrderStatus;
  estimatedDeliveryDate: string;
  dispatchDate?: string;
  timeline: OrderTimelineEvent[];
}

export interface Order {
  id: string;
  orderNumber: string;
  userId?: string;
  createdAt: string;
  items: CartItem[];
  subtotal: number;
  discountAmount: number;
  discount?: number;
  couponCode?: string;
  shippingFee: number;
  totalAmount: number;
  total?: number;
  paymentMethod: 'UPI' | 'Card' | 'Netbanking' | 'COD';
  paymentStatus: 'Paid' | 'Pending' | 'COD Confirmed';
  shippingAddress: ShippingAddress;
  status: OrderStatus;
  courierName?: string;
  trackingNumber?: string;
  estimatedDeliveryDate: string;
  timeline: OrderTimelineEvent[];
}

export interface ShadeMatchResult {
  detectedTone: SkinTone;
  detectedUndertone: Undertone;
  confidenceScore: number;
  matchedShade: ProductShade;
  concealerShadeName: string;
  explanation: string;
  lightingQuality: 'Optimal' | 'Acceptable' | 'Needs Natural Light';
  recommendedFoundationId: string;
  recommendedProducts?: Product[];
}

export interface ShadeRecommendation {
  id: string;
  userId?: string;
  skinTone: SkinTone;
  undertone: Undertone;
  confidenceScore: number;
  matchedShadeId: string;
  matchedShadeName: string;
  explanation: string;
  createdAt: string;
}

export interface BeautyProfile {
  id?: string;
  userId?: string;
  skinType?: SkinType;
  skinTone?: SkinTone;
  undertone?: Undertone;
  concerns?: string[];
  preferredCoverage?: CoverageType;
  preferredFinish?: FinishType;
  matchedShadeId?: string;
  matchedShadeName?: string;
  updatedAt?: string;
}

export interface AIMessage {
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  recommendedProductIds?: string[];
}

export interface AIConversation {
  id: string;
  userId?: string;
  sessionId?: string;
  messages: AIMessage[];
  createdAt: string;
  updatedAt: string;
}

export interface AdminMetrics {
  totalRevenue: number;
  totalOrders: number;
  averageOrderValue: number;
  totalCustomers: number;
  conversionRate: number;
  lowStockItemsCount: number;
  bestsellersCount: number;
}
