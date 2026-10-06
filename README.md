# MARIYAM MAQUILLAGE (Haute Beauté Indienne)

A luxury Indian beauty and cosmetics e-commerce platform featuring AI precision shade matching, the "Ask Mariyam" AI beauty concierge, bridal atelier, and curated prestige cosmetics.

---

## 🌟 Key Highlights & Architectural Features

### 1. AI Shade Studio™
- **Chromatic Desi Calibration:** Overcomes the common issue of foundations turning ashy or oxidizing pink on Indian skin by matching against 8 Indian undertone depths (110 Porcelain Glow, 128 Warm Sand, 220 Golden Beige, 230 Natural Olive, 310 Honey Caramel, 330 Rich Almond, 410 Deep Espresso, 430 Royal Ebony).
- **Multimodal AI Analysis:** Selfie upload or guided assessment analyzing skin tone depth, undertone (warm golden, natural olive, neutral, cool rosy), and providing paired concealer recommendations with confidence score and lighting guidance.
- **Privacy-First:** Ephemeral analysis in memory with zero permanent facial image storage.

### 2. "Ask Mariyam" AI Concierge
- **Catalog-Grounded Intelligence:** Powered by Google's `gemini-3.8-flash` model via `@google/genai` TypeScript SDK on a server-side proxy route (`/api/ai/chat`).
- **Zero Hallucination Guarantee:** The AI advisor exclusively recommends real products, actual prices, in-stock items, and certified ingredients from the live catalog.
- **One-Click Routine Builder:** Directly displays interactive product cards inside the conversation with "Add to Bag" and "Add Routine to Bag" buttons.

### 3. Pan-India Luxury Commerce Experience
- **Interactive Product Catalog:** 17 prestige formulations across Makeup, Skincare, Haute Parfumerie, and Artisanal Brushes.
- **Indian Pincode Checker:** Live estimated delivery calculator with city/state lookup across major hubs (Mumbai, Delhi NCR, Bengaluru, Hyderabad, Kolkata, Chennai, Jaipur, etc.).
- **Indian Checkout Suite:** Support for instant UPI (GPay, PhonePe, Paytm, BHIM), Cards (RuPay, Visa, Mastercard), Net Banking (HDFC, ICICI, SBI), and Verified Cash on Delivery (COD).
- **Free Express Shipping Threshold:** Visual progress indicator for complimentary shipping on orders above ₹999.
- **Coupon & Promotion Engine:** Tested coupon codes (`WELCOME10`, `ROYAL15`, `FIRSTGLOW`) with dynamic cart calculation.

### 4. Real Order Lifecycle & Consignment Tracking
- **Order Stages:** Pending → Confirmed → Packed → Shipped → Out for Delivery → Delivered.
- **Shipment Timeline:** Live Blue Dart Express / Shiprocket Air AWB numbers and stage-by-stage consignment tracking.

### 5. Store Operations & Admin Console
- **Metrics Dashboard:** Gross Sales, Total Orders, Average Order Value (AOV), and Low Stock Alerts.
- **Inventory Management:** Live inventory monitor with 1-click batch restock (+25, +50 units) and low stock warnings.
- **Catalog Management:** Add new SKUs, update pricing/MRP, and toggle cult bestsellers.
- **Order Fulfillment:** Live status changer for warehouse dispatch.

---

## 🛠️ Tech Stack

- **Frontend:** React 19, TypeScript, Tailwind CSS, Lucide Icons, Motion
- **Backend:** Node.js, Express, tsx
- **AI Integration:** `@google/genai` TypeScript SDK (`gemini-3.8-flash`)
- **Build & Dev:** Vite 8, esbuild

---

## 🚀 Running Locally

1. Install dependencies:
   ```bash
   npm install
   ```

2. Configure environment:
   ```bash
   cp .env.example .env
   # Add your GEMINI_API_KEY
   ```

3. Start development server:
   ```bash
   npm run dev
   ```

4. Build for production:
   ```bash
   npm run build
   ```
