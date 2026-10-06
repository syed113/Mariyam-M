import express, { Request, Response } from 'express';
import { createServer as createViteServer } from 'vite';
import dotenv from 'dotenv';
import path from 'path';
import { GoogleGenAI } from '@google/genai';
import { db } from './src/server/db.ts';
import {
  hashPassword,
  comparePassword,
  generateToken,
  requireAuth,
  requireAdmin,
  optionalAuth,
  AuthenticatedRequest
} from './src/server/auth.ts';
import { FOUNDATION_SHADES } from './src/data/initialCatalog.ts';
import { Order } from './src/types/index.ts';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Body parser with 10MB limit for selfie uploads
app.use(express.json({ limit: '10mb' }));

// Initialize Google GenAI
const apiKey = process.env.GEMINI_API_KEY || '';
const ai = apiKey
  ? new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build'
        }
      }
    })
  : null;

// ==========================================
// 1. HEALTH & SYSTEM CHECK
// ==========================================
app.get('/api/health', (_req: Request, res: Response) => {
  res.json({
    status: 'ok',
    brand: 'MARIYAM MAQUILLAGE',
    timestamp: new Date().toISOString(),
    aiConfigured: !!ai,
    environment: process.env.NODE_ENV || 'development'
  });
});

// ==========================================
// 2. AUTHENTICATION & CUSTOMER ACCOUNTS
// ==========================================
app.post('/api/auth/register', (req: Request, res: Response) => {
  try {
    const { email, password, name, phone } = req.body;
    if (!email || !password || !name) {
      return res.status(400).json({ error: 'Email, password, and name are required.' });
    }

    const existing = db.findUserByEmail(email);
    if (existing) {
      return res.status(409).json({ error: 'An account with this email address already exists. Please log in.' });
    }

    const passwordHash = hashPassword(password);
    const user = db.createUser({
      email,
      passwordHash,
      name,
      phone,
      role: 'CUSTOMER'
    });

    const token = generateToken({
      userId: user.id,
      email: user.email,
      name: user.name,
      role: user.role
    });

    return res.status(201).json({
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        phone: user.phone,
        role: user.role,
        createdAt: user.createdAt
      }
    });
  } catch (error: any) {
    return res.status(500).json({ error: 'Failed to create customer account', details: error.message });
  }
});

app.post('/api/auth/login', (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required.' });
    }

    const user = db.findUserByEmail(email);
    if (!user) {
      return res.status(401).json({ error: 'Invalid email or password.' });
    }

    const isValid = comparePassword(password, user.passwordHash);
    if (!isValid) {
      return res.status(401).json({ error: 'Invalid email or password.' });
    }

    const token = generateToken({
      userId: user.id,
      email: user.email,
      name: user.name,
      role: user.role
    });

    return res.json({
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        phone: user.phone,
        role: user.role,
        createdAt: user.createdAt
      }
    });
  } catch (error: any) {
    return res.status(500).json({ error: 'Login failed', details: error.message });
  }
});

app.get('/api/auth/me', requireAuth, (req: AuthenticatedRequest, res: Response) => {
  const user = db.findUserById(req.user!.userId);
  if (!user) {
    return res.status(404).json({ error: 'User record not found.' });
  }

  const addresses = db.getAddresses(user.id);
  const beautyProfile = db.getBeautyProfile(user.id);

  return res.json({
    user: {
      id: user.id,
      email: user.email,
      name: user.name,
      phone: user.phone,
      role: user.role,
      createdAt: user.createdAt
    },
    addresses,
    beautyProfile
  });
});

app.post('/api/auth/logout', (_req: Request, res: Response) => {
  res.json({ success: true, message: 'Logged out successfully.' });
});

// Addresses
app.get('/api/auth/addresses', requireAuth, (req: AuthenticatedRequest, res: Response) => {
  const addresses = db.getAddresses(req.user!.userId);
  res.json({ addresses });
});

app.post('/api/auth/addresses', requireAuth, (req: AuthenticatedRequest, res: Response) => {
  const address = db.createAddress(req.user!.userId, req.body);
  res.status(201).json({ address });
});

app.put('/api/auth/addresses/:id', requireAuth, (req: AuthenticatedRequest, res: Response) => {
  const address = db.updateAddress(req.user!.userId, req.params.id, req.body);
  if (!address) return res.status(404).json({ error: 'Address not found' });
  res.json({ address });
});

app.delete('/api/auth/addresses/:id', requireAuth, (req: AuthenticatedRequest, res: Response) => {
  const deleted = db.deleteAddress(req.user!.userId, req.params.id);
  res.json({ success: deleted });
});

// ==========================================
// 3. CATALOG & PRODUCT DISCOVERY
// ==========================================
app.get('/api/products', (req: Request, res: Response) => {
  try {
    const {
      department,
      category,
      subcategory,
      brand,
      undertone,
      skinType,
      finish,
      minPrice,
      maxPrice,
      inStockOnly,
      search,
      sort
    } = req.query;

    const products = db.getAllProducts({
      department: department as string,
      category: category as string,
      subcategory: subcategory as string,
      brand: brand as string,
      undertone: undertone as string,
      skinType: skinType as string,
      finish: finish as string,
      minPrice: minPrice ? Number(minPrice) : undefined,
      maxPrice: maxPrice ? Number(maxPrice) : undefined,
      inStockOnly: inStockOnly === 'true',
      search: search as string,
      sort: sort as any
    });

    res.json({
      count: products.length,
      products
    });
  } catch (error: any) {
    res.status(500).json({ error: 'Failed to retrieve products', details: error.message });
  }
});

app.get('/api/products/:id', (req: Request, res: Response) => {
  const product = db.getProductById(req.params.id);
  if (!product) {
    return res.status(404).json({ error: 'Product formulation not found in catalog.' });
  }
  const reviews = db.getProductReviews(product.id);
  const related = db.getAllProducts({ department: product.department }).filter(p => p.id !== product.id).slice(0, 4);

  res.json({ product, reviews, related });
});

app.get('/api/products/slug/:slug', (req: Request, res: Response) => {
  const product = db.getProductBySlug(req.params.slug);
  if (!product) {
    return res.status(404).json({ error: 'Product formulation not found.' });
  }
  const reviews = db.getProductReviews(product.id);
  res.json({ product, reviews });
});

app.get('/api/products/:id/reviews', (req: Request, res: Response) => {
  const reviews = db.getProductReviews(req.params.id);
  res.json({ reviews });
});

app.post('/api/products/:id/reviews', optionalAuth, (req: AuthenticatedRequest, res: Response) => {
  const { author, rating, title, comment, shadeUsed } = req.body;
  if (!author || !rating || !comment) {
    return res.status(400).json({ error: 'Author name, rating, and review comment are required.' });
  }

  const review = db.addReview({
    productId: req.params.id,
    author,
    userId: req.user?.userId,
    rating: Number(rating),
    title: title || 'Verified Experience',
    comment,
    shadeUsed,
    verifiedPurchase: true
  });

  res.status(201).json({ review });
});

// ==========================================
// 4. PERSISTENT CART
// ==========================================
app.get('/api/cart', optionalAuth, (req: AuthenticatedRequest, res: Response) => {
  const sessionId = req.headers['x-session-id'] as string;
  const cart = db.getCart(req.user?.userId, sessionId);
  res.json({ cart });
});

app.post('/api/cart/items', optionalAuth, (req: AuthenticatedRequest, res: Response) => {
  const sessionId = req.headers['x-session-id'] as string;
  const { productId, shadeId, variantId, quantity } = req.body;

  const numQty = Number(quantity);
  if (!productId || isNaN(numQty) || !Number.isInteger(numQty) || numQty <= 0) {
    return res.status(400).json({ error: 'Product ID and a valid positive integer quantity are required.' });
  }

  const result = db.addItemToCart(req.user?.userId, sessionId, {
    productId,
    shadeId,
    variantId,
    quantity: numQty
  });

  if (result.error) {
    return res.status(400).json({ error: result.error, cart: result.cart });
  }

  res.json({ cart: result.cart });
});

app.put('/api/cart/items/:id', optionalAuth, (req: AuthenticatedRequest, res: Response) => {
  const sessionId = req.headers['x-session-id'] as string;
  const { quantity } = req.body;

  const numQty = Number(quantity);
  if (isNaN(numQty) || !Number.isInteger(numQty) || numQty < 0) {
    return res.status(400).json({ error: 'Quantity must be zero or a positive whole integer.' });
  }

  const cart = db.updateCartItemQuantity(req.user?.userId, sessionId, req.params.id, numQty);
  res.json({ cart });
});

app.delete('/api/cart/items/:id', optionalAuth, (req: AuthenticatedRequest, res: Response) => {
  const sessionId = req.headers['x-session-id'] as string;
  const cart = db.removeCartItem(req.user?.userId, sessionId, req.params.id);
  res.json({ cart });
});

app.delete('/api/cart', optionalAuth, (req: AuthenticatedRequest, res: Response) => {
  const sessionId = req.headers['x-session-id'] as string;
  const cart = db.clearCart(req.user?.userId, sessionId);
  res.json({ cart });
});

app.post('/api/cart/merge', requireAuth, (req: AuthenticatedRequest, res: Response) => {
  const { guestSessionId } = req.body;
  if (!guestSessionId) {
    const cart = db.getCart(req.user!.userId);
    return res.json({ cart });
  }

  const cart = db.mergeCarts(req.user!.userId, guestSessionId);
  res.json({ cart, merged: true });
});

// ==========================================
// 5. WISHLIST
// ==========================================
app.get('/api/wishlist', optionalAuth, (req: AuthenticatedRequest, res: Response) => {
  const sessionId = req.headers['x-session-id'] as string;
  const wishlist = db.getWishlist(req.user?.userId, sessionId);
  res.json({ wishlist });
});

app.post('/api/wishlist/toggle', optionalAuth, (req: AuthenticatedRequest, res: Response) => {
  const sessionId = req.headers['x-session-id'] as string;
  const { productId } = req.body;
  if (!productId) return res.status(400).json({ error: 'productId required' });

  const result = db.toggleWishlist(req.user?.userId, sessionId, productId);
  res.json(result);
});

// ==========================================
// 6. ORDERS & CHECKOUT ENGINE
// ==========================================
app.post('/api/orders', optionalAuth, (req: AuthenticatedRequest, res: Response) => {
  try {
    const { items, shippingAddress, paymentMethod, couponCode } = req.body;

    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ error: 'Order must contain at least one item.' });
    }

    if (!shippingAddress || !shippingAddress.fullName || !shippingAddress.phone || !shippingAddress.street || !shippingAddress.pincode) {
      return res.status(400).json({ error: 'Complete shipping address, recipient name, phone, and 6-digit Indian pincode are required.' });
    }

    const cleanPincode = String(shippingAddress.pincode).trim();
    if (cleanPincode.length !== 6 || !/^\d{6}$/.test(cleanPincode)) {
      return res.status(400).json({ error: 'Please enter a valid 6-digit Indian delivery pincode.' });
    }

    for (const item of items) {
      const q = Number(item.quantity);
      if (isNaN(q) || !Number.isInteger(q) || q <= 0) {
        return res.status(400).json({ error: `Invalid item quantity (${item.quantity}). Quantity must be a positive integer.` });
      }
    }

    const result = db.createOrderTransaction({
      userId: req.user?.userId,
      items,
      shippingAddress: {
        ...shippingAddress,
        pincode: cleanPincode
      },
      paymentMethod: paymentMethod || 'UPI',
      couponCode
    });

    if (!result.success || !result.order) {
      return res.status(400).json({ error: result.error || 'Failed to place order.' });
    }

    res.status(201).json({ success: true, order: result.order });
  } catch (error: any) {
    res.status(500).json({ error: 'Order processing failed', details: error.message });
  }
});

app.get('/api/orders', requireAuth, (req: AuthenticatedRequest, res: Response) => {
  const orders = db.getOrders(req.user!.userId);
  res.json({ orders });
});

app.get('/api/orders/track/:orderNumber', optionalAuth, (req: AuthenticatedRequest, res: Response) => {
  const order = db.getOrderByNumber(req.params.orderNumber);
  if (!order) {
    return res.status(404).json({ error: `No active order found with identifier "${req.params.orderNumber}".` });
  }

  const isOwnerOrAdmin = req.user && (req.user.role === 'ADMIN' || req.user.userId === order.userId);
  if (isOwnerOrAdmin) {
    return res.json({ order });
  }

  // Mask sensitive identity and address info for public consignment lookup
  const rawName = order.shippingAddress.fullName || '';
  const maskedName = rawName
    ? rawName.split(' ').map(w => w.length > 2 ? `${w[0]}***${w[w.length - 1]}` : w).join(' ')
    : 'Valued Client';
  const rawPhone = order.shippingAddress.phone || '';
  const maskedPhone = rawPhone.length > 4 ? `+91 ******${rawPhone.slice(-4)}` : '+91 **********';

  const sanitizedOrder: Order = {
    ...order,
    shippingAddress: {
      ...order.shippingAddress,
      fullName: maskedName,
      phone: maskedPhone,
      email: '***@***.***',
      street: 'Dispatched via Secure Cold-Chain Logistics'
    }
  };

  res.json({ order: sanitizedOrder });
});

// ==========================================
// 7. COUPONS & PINCODE LOGISTICS
// ==========================================
app.post('/api/coupons/validate', (req: Request, res: Response) => {
  const { code, subtotal } = req.body;
  if (!code) return res.status(400).json({ valid: false, error: 'Coupon code is required.' });

  const result = db.validateCoupon(code, Number(subtotal || 0));
  res.json(result);
});

app.get('/api/shipping/pincode/:pincode', (req: Request, res: Response) => {
  const result = db.checkPincode(req.params.pincode);
  res.json(result);
});

// ==========================================
// 8. BEAUTY PROFILE
// ==========================================
app.get('/api/beauty-profile', requireAuth, (req: AuthenticatedRequest, res: Response) => {
  const profile = db.getBeautyProfile(req.user!.userId);
  res.json({ profile });
});

app.put('/api/beauty-profile', requireAuth, (req: AuthenticatedRequest, res: Response) => {
  const profile = db.saveBeautyProfile(req.user!.userId, req.body);
  res.json({ profile });
});

// ==========================================
// 9. AI BEAUTY CONCIERGE (ASK MARIYAM)
// ==========================================
app.post('/api/ai/chat', optionalAuth, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { message, history } = req.body;
    const sessionId = req.headers['x-session-id'] as string;

    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }

    const currentCatalog = db.getAllProducts({ inStockOnly: true }).map(p => ({
      id: p.id,
      name: p.name,
      brand: p.brand,
      department: p.department,
      subcategory: p.subcategory,
      price: `₹${p.price}`,
      mrp: `₹${p.mrp}`,
      rating: p.rating,
      benefits: p.benefits?.slice(0, 2).join('; '),
      shades: p.shades?.map(s => `${s.name} (${s.undertone})`).join(', ') || 'N/A',
      finish: p.finish || 'N/A',
      coverage: p.coverage || 'N/A'
    }));

    if (!ai) {
      // Intelligent fallback grounded in live database catalog
      const lower = message.toLowerCase();
      let matched = currentCatalog.slice(0, 3);

      if (lower.includes('foundation') || lower.includes('shade') || lower.includes('skin')) {
        matched = currentCatalog.filter(p => p.subcategory === 'Foundation' || p.subcategory === 'Serum');
      } else if (lower.includes('lip') || lower.includes('lipstick')) {
        matched = currentCatalog.filter(p => p.subcategory === 'Lipstick');
      } else if (lower.includes('bridal') || lower.includes('wedding')) {
        matched = currentCatalog.slice(0, 3);
      }

      const reply = `Namaste! As your Mariyam Maquillage beauty advisor, I would love to guide you. For your routine, I recommend focusing on formulations that honor your unique undertone and stand up to Indian climate conditions. Here are our premier recommendations tailored to your request:`;

      db.appendAIMessage(req.user?.userId, sessionId, {
        role: 'user',
        content: message,
        timestamp: new Date().toISOString()
      });
      db.appendAIMessage(req.user?.userId, sessionId, {
        role: 'assistant',
        content: reply,
        timestamp: new Date().toISOString(),
        recommendedProductIds: matched.map(m => m.id)
      });

      return res.json({
        reply,
        recommendedProductIds: matched.map(p => p.id)
      });
    }

    const systemInstruction = `You are "Mariyam", the chief beauty concierge, master cosmetic chemist, and luxury Indian beauty advisor for "MARIYAM MAQUILLAGE" (Haute Beauté Indienne).
Tone: Elegant, warm, culturally attuned to Indian complexions and wedding/festive celebrations, professional, and knowledgeable.
CRITICAL CATALOG GROUNDING RULES:
1. You MUST ONLY recommend real products from our actual catalog provided below.
2. NEVER invent products, prices, discounts, or imaginary shades.
3. If asked about bridal makeup, oily skin in humid weather, pigmentation, dusky or olive undertones, give actionable steps and suggest exact products from the catalog.
4. Foundation advice must reference our 8 foundation shades: 110 Porcelain Glow, 128 Warm Sand, 220 Golden Beige (Most Popular), 230 Natural Olive, 310 Honey Caramel, 330 Rich Almond, 410 Deep Espresso, 430 Royal Ebony.
5. In your response, format recommendations clearly. At the very end of your response, on a new line, write:
RECOMMENDED_IDS: [id1, id2, ...]
where id1, id2 are the exact product IDs from our catalog that you recommended.

LIVE CATALOG:
${JSON.stringify(currentCatalog, null, 1)}`;

    const promptText = `User query: "${message}"\n\nRecent conversation history:\n${JSON.stringify(history || [])}`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: [
        {
          role: 'user',
          parts: [{ text: promptText }]
        }
      ],
      config: {
        systemInstruction: { parts: [{ text: systemInstruction }] },
        temperature: 0.7
      }
    });

    const replyText = response.text || 'I would be delighted to assist you with finding the perfect Mariyam Maquillage formulations for your routine.';

    // Extract RECOMMENDED_IDS
    const idMatch = replyText.match(/RECOMMENDED_IDS:\s*\[(.*?)\]/);
    let recommendedProductIds: string[] = [];
    let cleanReply = replyText;

    if (idMatch) {
      cleanReply = replyText.replace(/RECOMMENDED_IDS:\s*\[(.*?)\]/, '').trim();
      recommendedProductIds = idMatch[1]
        .split(',')
        .map(id => id.trim().replace(/['"]/g, ''))
        .filter(id => currentCatalog.some(p => p.id === id));
    }

    if (recommendedProductIds.length === 0) {
      recommendedProductIds = currentCatalog
        .filter(p => cleanReply.toLowerCase().includes(p.name.toLowerCase()) || cleanReply.toLowerCase().includes(p.subcategory.toLowerCase()))
        .map(p => p.id)
        .slice(0, 3);
    }

    db.appendAIMessage(req.user?.userId, sessionId, {
      role: 'user',
      content: message,
      timestamp: new Date().toISOString()
    });
    db.appendAIMessage(req.user?.userId, sessionId, {
      role: 'assistant',
      content: cleanReply,
      timestamp: new Date().toISOString(),
      recommendedProductIds
    });

    return res.json({
      reply: cleanReply,
      recommendedProductIds
    });
  } catch (error: any) {
    console.warn('Gemini chat fallback invoked:', error.message);
    const catalog = db.getAllProducts().slice(0, 3);
    return res.json({
      reply: 'Namaste! As your Mariyam Maquillage luxury beauty consultant, I have curated these signature formulations tailored to your complexion and Indian climate endurance:',
      recommendedProductIds: catalog.map(p => p.id)
    });
  }
});

// ==========================================
// 10. AI SHADE STUDIO MATCHER
// ==========================================
app.post('/api/ai/shade-match', optionalAuth, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { imageBase64, manualPreferences } = req.body;

    if (ai && imageBase64) {
      const cleanBase64 = imageBase64.replace(/^data:image\/\w+;base64,/, '');

      const shadePrompt = `You are the lead color scientist at Mariyam Maquillage analyzing an uploaded customer selfie for Foundation & Concealer shade matching.
Analyze the user's facial skin tone depth and undertone (warm golden, neutral, cool rosy, or olive).
Match them to ONE of our 8 Mariyam Maquillage Foundation Shades:
1. "110 Porcelain Glow" (Fair, Cool pink)
2. "128 Warm Sand" (Fair-Light, Warm yellow)
3. "220 Golden Beige" (Medium, Warm golden - most common Indian undertone)
4. "230 Natural Olive" (Medium, Muted olive green)
5. "310 Honey Caramel" (Tan, Warm amber)
6. "330 Rich Almond" (Tan-Deep, Neutral golden)
7. "410 Deep Espresso" (Deep, Warm terracotta)
8. "430 Royal Ebony" (Rich Deep, Neutral)

You MUST respond strictly in valid JSON matching this schema:
{
  "detectedTone": "fair" | "light" | "medium" | "tan" | "deep",
  "detectedUndertone": "warm" | "cool" | "neutral" | "olive",
  "confidenceScore": number (85-98),
  "matchedShadeName": string,
  "concealerShadeName": string,
  "explanation": string (explaining why this matches their jawline/complexion with lighting considerations),
  "lightingQuality": "Optimal" | "Acceptable" | "Needs Natural Light"
}`;

      try {
        const response = await ai.models.generateContent({
          model: 'gemini-3.8-flash',
          contents: [
            {
              role: 'user',
              parts: [
                {
                  inlineData: {
                    mimeType: 'image/jpeg',
                    data: cleanBase64
                  }
                },
                { text: shadePrompt }
              ]
            }
          ],
          config: {
            responseMimeType: 'application/json',
            temperature: 0.2
          }
        });

        const parsed = JSON.parse(response.text || '{}');
        const matchedShade = FOUNDATION_SHADES.find(s => s.name === parsed.matchedShadeName) || FOUNDATION_SHADES[2];

        // Save recommendation to database
        db.saveShadeRecommendation(req.user?.userId, {
          skinTone: parsed.detectedTone || 'medium',
          undertone: parsed.detectedUndertone || 'warm',
          confidenceScore: parsed.confidenceScore || 94,
          matchedShadeId: matchedShade.id,
          matchedShadeName: matchedShade.name,
          explanation: parsed.explanation || 'Analyzed with chromo-matching algorithms for Desi undertones.'
        });

        return res.json({
          detectedTone: parsed.detectedTone || 'medium',
          detectedUndertone: parsed.detectedUndertone || 'warm',
          confidenceScore: parsed.confidenceScore || 94,
          matchedShade,
          concealerShadeName: parsed.concealerShadeName || `${matchedShade.name} Concealer Spot-Light`,
          explanation: parsed.explanation || 'Based on your photo, your complexion exhibits healthy golden undertones that align seamlessly with our Golden Beige pigment spectrum.',
          lightingQuality: parsed.lightingQuality || 'Optimal',
          recommendedFoundationId: 'mm-prod-1'
        });
      } catch (geminiErr) {
        console.warn('Multimodal vision failed, falling back to algorithmic matcher:', geminiErr);
      }
    }

    // Heuristic algorithm based on preferences
    const undertone = manualPreferences?.undertone || 'warm';
    const depth = manualPreferences?.depth || 'medium';

    let matched = FOUNDATION_SHADES[2]; // Default: 220 Golden Beige
    if (depth === 'fair') matched = FOUNDATION_SHADES[0];
    else if (depth === 'light') matched = FOUNDATION_SHADES[1];
    else if (depth === 'medium' && undertone === 'olive') matched = FOUNDATION_SHADES[3];
    else if (depth === 'medium') matched = FOUNDATION_SHADES[2];
    else if (depth === 'tan' && undertone === 'neutral') matched = FOUNDATION_SHADES[5];
    else if (depth === 'tan') matched = FOUNDATION_SHADES[4];
    else if (depth === 'deep' && undertone === 'neutral') matched = FOUNDATION_SHADES[7];
    else if (depth === 'deep') matched = FOUNDATION_SHADES[6];

    db.saveShadeRecommendation(req.user?.userId, {
      skinTone: depth,
      undertone,
      confidenceScore: 92,
      matchedShadeId: matched.id,
      matchedShadeName: matched.name,
      explanation: `Calibrated for ${depth} skin with authentic ${undertone} undertones to eliminate ashy cast and blend flawlessly with natural Indian skin nuances.`
    });

    return res.json({
      detectedTone: depth,
      detectedUndertone: undertone,
      confidenceScore: 92,
      matchedShade: matched,
      concealerShadeName: `${matched.name} Radiant Concealer`,
      explanation: `Calibrated for ${depth} skin with authentic ${undertone} undertones to eliminate ashy cast and blend flawlessly with natural Indian skin nuances.`,
      lightingQuality: 'Acceptable',
      recommendedFoundationId: 'mm-prod-1'
    });
  } catch (error: any) {
    res.status(500).json({ error: 'Failed to compute shade match', details: error.message });
  }
});

// ==========================================
// 11. ADMIN OPERATIONS GATEWAY
// ==========================================
app.get('/api/admin/metrics', requireAdmin, (_req: AuthenticatedRequest, res: Response) => {
  const metrics = db.getAdminMetrics();
  res.json({ metrics });
});

app.get('/api/admin/orders', requireAdmin, (_req: AuthenticatedRequest, res: Response) => {
  const orders = db.getOrders();
  res.json({ orders });
});

app.put('/api/admin/orders/:id/status', requireAdmin, (req: AuthenticatedRequest, res: Response) => {
  const { status, note, courierName, trackingNumber } = req.body;
  const order = db.updateOrderStatus(req.params.id, status, note, courierName, trackingNumber);
  if (!order) return res.status(404).json({ error: 'Order not found' });
  res.json({ order });
});

app.post('/api/admin/products', requireAdmin, (req: AuthenticatedRequest, res: Response) => {
  const product = db.createProduct(req.body);
  res.status(201).json({ product });
});

app.put('/api/admin/products/:id', requireAdmin, (req: AuthenticatedRequest, res: Response) => {
  const product = db.updateProduct(req.params.id, req.body);
  if (!product) return res.status(404).json({ error: 'Product not found' });
  res.json({ product });
});

app.delete('/api/admin/products/:id', requireAdmin, (req: AuthenticatedRequest, res: Response) => {
  const deleted = db.deleteProduct(req.params.id);
  res.json({ success: deleted });
});

app.post('/api/admin/inventory/restock', requireAdmin, (req: AuthenticatedRequest, res: Response) => {
  const { productId, delta } = req.body;
  const product = db.adjustStock(productId, Number(delta || 25));
  if (!product) return res.status(404).json({ error: 'Product not found' });
  res.json({ product });
});

// Admin Customers Management
app.get('/api/admin/customers', requireAdmin, (_req: AuthenticatedRequest, res: Response) => {
  const customers = db.getAllCustomers();
  res.json({ customers });
});

// Admin Coupons Management
app.get('/api/admin/coupons', requireAdmin, (_req: AuthenticatedRequest, res: Response) => {
  const coupons = db.getAllCoupons();
  res.json({ coupons });
});

app.post('/api/admin/coupons', requireAdmin, (req: AuthenticatedRequest, res: Response) => {
  const { code, discountType, discountValue, minOrderValue, description, expiresAt, usageLimit } = req.body;
  if (!code || !discountType || discountValue === undefined) {
    return res.status(400).json({ error: 'Coupon code, discountType, and discountValue are required.' });
  }
  const coupon = db.createCoupon({
    code: code.trim().toUpperCase(),
    discountType,
    discountValue: Number(discountValue),
    minOrderValue: minOrderValue ? Number(minOrderValue) : undefined,
    description: description || `${discountValue}${discountType === 'percentage' ? '%' : '₹'} off`,
    expiresAt,
    usageLimit: usageLimit ? Number(usageLimit) : undefined,
    usedCount: 0
  });
  res.status(201).json({ coupon });
});

app.delete('/api/admin/coupons/:code', requireAdmin, (req: AuthenticatedRequest, res: Response) => {
  const deleted = db.deleteCoupon(req.params.code);
  res.json({ success: deleted });
});

// Admin CMS Banners Management
app.get('/api/admin/banners', requireAdmin, (_req: AuthenticatedRequest, res: Response) => {
  const banners = db.getBanners();
  res.json({ banners });
});

app.post('/api/admin/banners', requireAdmin, (req: AuthenticatedRequest, res: Response) => {
  const banner = db.createBanner(req.body);
  res.status(201).json({ banner });
});

app.delete('/api/admin/banners/:id', requireAdmin, (req: AuthenticatedRequest, res: Response) => {
  const deleted = db.deleteBanner(req.params.id);
  res.json({ success: deleted });
});

app.put('/api/admin/banners/:id/toggle', requireAdmin, (req: AuthenticatedRequest, res: Response) => {
  const banner = db.toggleBanner(req.params.id);
  if (!banner) return res.status(404).json({ error: 'Banner not found' });
  res.json({ banner });
});

// ==========================================
// 12. VITE DEV SERVER / PRODUCTION SERVE
// ==========================================
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa'
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, () => {
    console.log(`[MARIYAM MAQUILLAGE] Server listening on http://0.0.0.0:${PORT}`);
  });
}

startServer();
