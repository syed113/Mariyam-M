# Mariyam Maquillage — Production Implementation Plan

## P0 — Critical / Blocking: Core Server Architecture, Database & Security
### 1. Unified Relational In-Process Database Architecture (`src/server/db.ts`)
- **Existing state**: File-based `.data/mariyam_store.json` prototype with limited schema coverage, missing relational integrity for User Profiles, Beauty Profiles, Cart Items, Wishlist Items, Reviews, and AI Conversation histories.
- **Required change**: Comprehensive relational schema architecture supporting:
  - Users, Auth Sessions & Passwords (bcrypt)
  - Addresses (multi-address support with default flag)
  - Products, Variants, Shades, Attributes, Inventory
  - Categories & Brands
  - Carts & CartItems (guest session ID or userId with atomic item merge)
  - Wishlists & WishlistItems
  - Orders, OrderItems, Payments & Shipments (atomic stock deduction, transaction safety)
  - Coupons & Redemptions
  - Reviews & Ratings (with verified purchase flag)
  - BeautyProfiles & ShadeRecommendations
  - AIConversations & Messages (history persistence)
- **Files affected**: `src/server/db.ts`, `src/types/index.ts`, `server.ts`
- **Dependencies required**: `bcryptjs`, `jsonwebtoken` (already installed)
- **Database changes required**: Expand `DatabaseSchema` with typed collections, foreign key references, timestamps (`createdAt`, `updatedAt`), unique constraints, and atomic disk persistence with `.tmp` swapping.
- **API changes required**: Database query and mutation methods for all entities.
- **Testing required**: Node unit test script verifying atomic write, constraint checks, and stock deductions.

### 2. Real Server REST API Endpoints (`server.ts`)
- **Existing state**: `server.ts` only had `/api/health`, `/api/ai/chat`, and `/api/ai/shade-match`. Cart, orders, products, and auth were client-only or disconnected.
- **Required change**: Mount complete REST endpoints:
  - Auth: `POST /api/auth/register`, `POST /api/auth/login`, `GET /api/auth/me`, `POST /api/auth/logout`, `PUT /api/auth/profile`, `POST /api/auth/addresses`, `DELETE /api/auth/addresses/:id`
  - Products & Catalog: `GET /api/products` (multi-filter, search, sort, pagination), `GET /api/products/:id`, `GET /api/products/slug/:slug`
  - Reviews: `GET /api/products/:id/reviews`, `POST /api/products/:id/reviews` (authenticated)
  - Cart: `GET /api/cart`, `POST /api/cart/items`, `PUT /api/cart/items/:id`, `DELETE /api/cart/items/:id`, `POST /api/cart/merge` (guest-to-user merge)
  - Wishlist: `GET /api/wishlist`, `POST /api/wishlist/toggle`
  - Checkout & Orders: `POST /api/orders` (transactional stock check, coupon calculation, order creation), `GET /api/orders` (user's order history), `GET /api/orders/:orderNumber` (public tracking)
  - Coupons: `POST /api/coupons/validate`
  - Pincode & Shipping: `GET /api/shipping/pincode/:pincode`
  - Beauty Profile: `GET /api/beauty-profile`, `PUT /api/beauty-profile`
  - Admin: `GET /api/admin/metrics`, `POST /api/admin/products`, `PUT /api/admin/products/:id`, `DELETE /api/admin/products/:id`, `POST /api/admin/inventory/restock`, `PUT /api/admin/orders/:id/status`
- **Files affected**: `server.ts`, `src/server/auth.ts`, `src/server/db.ts`
- **Testing required**: API verification across authentication tokens, role checks, and error responses.

---

## P1 — Core Commerce: Real Store State, Auth & Checkout
### 1. Store Context Synchronization (`src/context/StoreContext.tsx`)
- **Existing state**: StoreContext used `localStorage` for orders, cart, and products without API synchronization; fake order creation.
- **Required change**: Real full-stack store context:
  - Holds `authToken`, `currentUser` (Customer or Admin).
  - Fetches live catalog from `/api/products`.
  - Manages real server cart with guest token fallback and automatic server merge on login.
  - Submits orders to `/api/orders` with atomic inventory reduction.
  - Exposes login, registration, logout, and profile updates.
- **Files affected**: `src/context/StoreContext.tsx`
- **Testing required**: Cart items retain consistency across browser sessions and sync to backend.

### 2. Real Customer Authentication & Profile Modal (`src/components/auth/AuthModal.tsx`, `AccountPage.tsx`)
- **Existing state**: Hardcoded static user "Aanya Sharma" with static numbers and no ability to log out, switch accounts, or register.
- **Required change**:
  - Full modal supporting Customer Sign-In, Sign-Up with phone validation, and Admin Quick-Access credentials.
  - Real session persistence via JWT token stored securely in localStorage and verified with `/api/auth/me`.
  - Profile tab in `AccountPage` allowing address additions, phone updates, and beauty profile saving.
- **Files affected**: `src/components/auth/AuthModal.tsx`, `src/components/account/AccountPage.tsx`, `src/components/layout/Navbar.tsx`

### 3. Production Pincode & Delivery Serviceability Engine
- **Existing state**: Limited dictionary with hardcoded city strings in client file.
- **Required change**: Server-backed API endpoint supporting real Indian logistics hubs (Mumbai, Delhi NCR, Bengaluru, Hyderabad, Kolkata, Chennai, Jaipur, Pune, Ahmedabad, Lucknow, Chandigarh, Surat, Kochi, Guwahati, etc.) with estimated delivery days, COD eligibility, and express tier.
- **Files affected**: `src/server/db.ts`, `server.ts`, `src/components/product/ProductDetailModal.tsx`, `src/components/checkout/CheckoutModal.tsx`

---

## P2 — Admin & Operations
### 1. Role-Protected Admin Operations Console (`src/components/admin/AdminDashboard.tsx`)
- **Existing state**: Client-only admin view with no password or role enforcement; changes didn't hit server endpoints.
- **Required change**:
  - Server-side `requireAdmin` enforcement on `/api/admin/*`.
  - Real database aggregation for Gross Sales, Order Count, AOV, and Low-Stock SKUs.
  - Live product creation, price/MRP editing, and one-click stock restock.
  - Order fulfillment workflow (Confirmed -> Packed -> Shipped with AWB -> Delivered).
- **Files affected**: `src/components/admin/AdminDashboard.tsx`, `server.ts`, `src/server/auth.ts`

---

## P3 — AI Features: Precision Grounding & Conversation Storage
### 1. Live Catalog-Grounded "Ask Mariyam" Beauty Advisor (`server.ts`, `AskMariyamDrawer.tsx`)
- **Existing state**: Gemini chat with static mock fallback array.
- **Required change**:
  - Ground Gemini directly in the live database catalog query results.
  - Persist conversation history to `aiConversations` collection for logged-in users.
  - Return real active product recommendations with accurate pricing and shade references.
- **Files affected**: `server.ts`, `src/components/ai/AskMariyamDrawer.tsx`

### 2. AI Shade Studio Computer Vision Matcher (`server.ts`, `AIShadeStudioModal.tsx`)
- **Existing state**: Basic heuristic with imageBase64 vision prompt.
- **Required change**:
  - Multimodal vision prompt analyzing complexion depth and undertone (warm, cool, neutral, olive).
  - Matches to the 8 calibrated Mariyam Maquillage Foundation shades.
  - Automatically saves matched shade to customer's `BeautyProfile` on the server.
- **Files affected**: `server.ts`, `src/components/ai/AIShadeStudioModal.tsx`

---

## P4 — SEO, Performance & Accessibility
### 1. Structured Data, OpenGraph & Metadata
- **Existing state**: Basic HTML title.
- **Required change**: Schema.org JSON-LD for `OnlineStore` and luxury cosmetics products, OpenGraph tags, semantic ARIA labels, zero-pill typography, and luxury editorial design alignment.
- **Files affected**: `index.html`, `metadata.json`

---

## P5 — Advanced Enhancements
- Complete Look & Cross-sell recommendations on PDP.
- Real Customer Reviews submission and verified rating recalculation.
