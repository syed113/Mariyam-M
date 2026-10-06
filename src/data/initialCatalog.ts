import { Product, ProductShade, Coupon } from '../types';

export const FOUNDATION_SHADES: ProductShade[] = [
  {
    id: "sh-101",
    name: "110 Porcelain Glow",
    hexCode: "#F8E5D3",
    undertone: "cool",
    description: "Very fair with cool pink nuances and luminous finish",
    swatchUrl: "https://images.unsplash.com/photo-1616683693504-3ea7e9ad6fec?auto=format&fit=crop&w=300&q=80",
    image: "https://images.unsplash.com/photo-1631729371254-42c2892f0e6e?auto=format&fit=crop&w=600&q=80",
    inStock: true
  },
  {
    id: "sh-102",
    name: "128 Warm Sand",
    hexCode: "#F1D1B5",
    undertone: "warm",
    description: "Fair-light with warm golden yellow undertone",
    swatchUrl: "https://images.unsplash.com/photo-1616683693504-3ea7e9ad6fec?auto=format&fit=crop&w=300&q=80",
    image: "https://images.unsplash.com/photo-1631729371254-42c2892f0e6e?auto=format&fit=crop&w=600&q=80",
    inStock: true
  },
  {
    id: "sh-103",
    name: "220 Golden Beige",
    hexCode: "#E4BD9A",
    undertone: "warm",
    description: "Medium with golden warm undertones (Most Popular in India)",
    swatchUrl: "https://images.unsplash.com/photo-1516972810927-80185027ca84?auto=format&fit=crop&w=300&q=80",
    image: "https://images.unsplash.com/photo-1631729371254-42c2892f0e6e?auto=format&fit=crop&w=600&q=80",
    inStock: true
  },
  {
    id: "sh-104",
    name: "230 Natural Olive",
    hexCode: "#D8AE89",
    undertone: "olive",
    description: "Medium with muted greenish-olive undertone tailored for Desi skin",
    swatchUrl: "https://images.unsplash.com/photo-1516972810927-80185027ca84?auto=format&fit=crop&w=300&q=80",
    image: "https://images.unsplash.com/photo-1631729371254-42c2892f0e6e?auto=format&fit=crop&w=600&q=80",
    inStock: true
  },
  {
    id: "sh-105",
    name: "310 Honey Caramel",
    hexCode: "#C8976C",
    undertone: "warm",
    description: "Tan complexion with radiant warm amber & honey tones",
    swatchUrl: "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=300&q=80",
    image: "https://images.unsplash.com/photo-1631729371254-42c2892f0e6e?auto=format&fit=crop&w=600&q=80",
    inStock: true
  },
  {
    id: "sh-106",
    name: "330 Rich Almond",
    hexCode: "#B57E53",
    undertone: "neutral",
    description: "Tan-deep with balanced neutral golden undertones",
    swatchUrl: "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=300&q=80",
    image: "https://images.unsplash.com/photo-1631729371254-42c2892f0e6e?auto=format&fit=crop&w=600&q=80",
    inStock: true
  },
  {
    id: "sh-107",
    name: "410 Deep Espresso",
    hexCode: "#925A37",
    undertone: "warm",
    description: "Deep dusky complexion with warm terracotta undertones",
    swatchUrl: "https://images.unsplash.com/photo-1516972810927-80185027ca84?auto=format&fit=crop&w=300&q=80",
    image: "https://images.unsplash.com/photo-1631729371254-42c2892f0e6e?auto=format&fit=crop&w=600&q=80",
    inStock: true
  },
  {
    id: "sh-108",
    name: "430 Royal Ebony",
    hexCode: "#693D25",
    undertone: "neutral",
    description: "Rich deep complexion with flawless neutral undertones",
    swatchUrl: "https://images.unsplash.com/photo-1516972810927-80185027ca84?auto=format&fit=crop&w=300&q=80",
    image: "https://images.unsplash.com/photo-1631729371254-42c2892f0e6e?auto=format&fit=crop&w=600&q=80",
    inStock: true
  }
];

export const LIPSTICK_SHADES: ProductShade[] = [
  {
    id: "lip-01",
    name: "Bombay Nude",
    hexCode: "#B57B6C",
    undertone: "warm",
    description: "Warm peachy nude that flatters all Indian undertones without washing out",
    inStock: true
  },
  {
    id: "lip-02",
    name: "Gulab Crimson",
    hexCode: "#A43444",
    undertone: "cool",
    description: "Velvety rose-wine with regal ruby undertones for festive celebrations",
    inStock: true
  },
  {
    id: "lip-03",
    name: "Chai Spice",
    hexCode: "#8D4D3D",
    undertone: "warm",
    description: "Toasted cinnamon brown enriched with warm terracotta notes",
    inStock: true
  },
  {
    id: "lip-04",
    name: "Kolhapur Berry",
    hexCode: "#682537",
    undertone: "cool",
    description: "Deep seductive plum berry with modern editorial intensity",
    inStock: true
  },
  {
    id: "lip-05",
    name: "Sindoor Scarlet",
    hexCode: "#C0252A",
    undertone: "neutral",
    description: "Classic royal bride scarlet with balanced undertones that make teeth look brighter",
    inStock: true
  }
];

export const INITIAL_PRODUCTS: Product[] = [
  {
    id: "mm-prod-1",
    sku: "MM-RSF-101",
    name: "Mariyam Maquillage Royal Silk Luminous Foundation SPF 25",
    slug: "royal-silk-luminous-foundation",
    brand: "Mariyam Maquillage",
    brandType: "Mariyam Signature",
    department: "Makeup",
    category: "Makeup",
    subcategory: "Foundation",
    price: 1899,
    mrp: 2499,
    compareAtPrice: 2499,
    discountPercent: 24,
    rating: 4.9,
    reviewCount: 840,
    verifiedPurchaseCount: 690,
    images: [
      "https://images.unsplash.com/photo-1631729371254-42c2892f0e6e?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1616683693504-3ea7e9ad6fec?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1516972810927-80185027ca84?auto=format&fit=crop&w=800&q=80"
    ],
    primaryImage: "https://images.unsplash.com/photo-1631729371254-42c2892f0e6e?auto=format&fit=crop&w=800&q=80",
    thumbnail: "https://images.unsplash.com/photo-1631729371254-42c2892f0e6e?auto=format&fit=crop&w=400&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1631729371254-42c2892f0e6e?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1616683693504-3ea7e9ad6fec?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=800&q=80"
    ],
    shades: FOUNDATION_SHADES,
    skinTypeCompatibility: ["Dry", "Normal", "Combination"],
    undertones: ["warm", "neutral", "olive", "cool"],
    finish: "Dewy",
    coverage: "Medium",
    concerns: ["Uneven Tone", "Dullness", "Dehydration"],
    keyIngredients: ["Hyaluronic Acid", "Kashmiri Saffron Extract", "Niacinamide 2%", "Gold Peptides"],
    benefits: [
      "Specially formulated for Indian skin tones with zero ashy flashback",
      "Breathable 16-hour sweat-resistant formula with SPF 25 PA++",
      "Infused with Kashmiri saffron for continuous barrier nourishment",
      "Buildable medium-to-full radiant coverage"
    ],
    howToUse: "Dispense 1-2 pumps onto the back of your hand. Dot onto forehead, cheeks, and chin. Blend outwards using the Mariyam Artisanal Foundation Brush or damp sponge for a seamless second-skin radiance.",
    ingredientsList: "Aqua, Cyclopentasiloxane, Titanium Dioxide, Dimethicone, Saffron (Crocus Sativus) Stigma Extract, Niacinamide, Sodium Hyaluronate, Gold Tripeptide-1, Glycerin, Silica, Tocopherol, Phenoxyethanol, Ethylhexylglycerin.",
    shortDescription: "Weightless serum foundation offering radiant, buildable coverage with true-to-tone Indian undertone calibration.",
    fullDescription: "Formulated specifically for the diverse depths and golden, warm, and olive undertones of Indian complexions. Unlike traditional foundations that ash out under flash photography, Royal Silk merges saffron bio-actives with micro-milled pigments to impart a natural lit-from-within royal glow.",
    stockCount: 85,
    isBestseller: true,
    isFeatured: true,
    isClean: true,
    isCrueltyFree: true,
    isVegan: true
  },
  {
    id: "mm-prod-2",
    sku: "MM-HVM-202",
    name: "Mariyam Maquillage Hydra-Velvet Transfer-Proof Liquid Lipstick",
    slug: "hydra-velvet-liquid-lipstick",
    brand: "Mariyam Maquillage",
    brandType: "Mariyam Signature",
    department: "Makeup",
    category: "Makeup",
    subcategory: "Lipstick",
    price: 1199,
    mrp: 1599,
    compareAtPrice: 1599,
    discountPercent: 25,
    rating: 4.8,
    reviewCount: 520,
    verifiedPurchaseCount: 410,
    images: [
      "https://images.unsplash.com/photo-1586495777744-4413f21062fa?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1625093742435-6fa192b6fb10?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1563178406-4cdc2923acbc?auto=format&fit=crop&w=800&q=80"
    ],
    primaryImage: "https://images.unsplash.com/photo-1586495777744-4413f21062fa?auto=format&fit=crop&w=800&q=80",
    thumbnail: "https://images.unsplash.com/photo-1586495777744-4413f21062fa?auto=format&fit=crop&w=400&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1586495777744-4413f21062fa?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1625093742435-6fa192b6fb10?auto=format&fit=crop&w=800&q=80"
    ],
    shades: LIPSTICK_SHADES,
    skinTypeCompatibility: ["Normal", "Dry", "Combination", "Oily"],
    finish: "Velvet",
    coverage: "Full",
    concerns: ["Dry Lips", "Feathering", "Smudging"],
    keyIngredients: ["Sweet Almond Oil", "Vitamin E", "Hyaluronic Spheres", "Shea Butter"],
    benefits: [
      "12-hour transfer-proof wear without lip crackling or drying",
      "Richly pigmented one-swipe full color payoff",
      "Infused with hyaluronic filling spheres for plush, plump comfort",
      "Precise diamond applicator for clean lip contours"
    ],
    howToUse: "Outline lips starting at cupid's bow using the pointed tip. Fill in with smooth strokes. Allow 90 seconds to dry into a transfer-resistant velvet veil.",
    ingredientsList: "Isododecane, Dimethicone, Trimethylsiloxysilicate, Prunus Amygdalus Dulcis Oil, Butyrospermum Parkii Butter, Tocopheryl Acetate, CI 77491, CI 77492, CI 15850.",
    shortDescription: "Velvety transfer-resistant lip color enriched with nourishing almond oil and lip-smoothing hyaluronic spheres.",
    fullDescription: "A groundbreaking comfortable matte liquid lipstick crafted to stay put through festive feasts and long wedding nights without drying your lips.",
    stockCount: 140,
    isBestseller: true,
    isFeatured: true,
    isCrueltyFree: true,
    isVegan: true
  },
  {
    id: "mm-prod-3",
    sku: "MM-24K-303",
    name: "Mariyam Maquillage 24K Micro-Mist Lock & Fixer Spray (100ml)",
    slug: "24k-micro-mist-lock-fixer",
    brand: "Mariyam Maquillage",
    brandType: "Mariyam Signature",
    department: "Makeup",
    category: "Makeup",
    subcategory: "Setting Spray",
    price: 1499,
    mrp: 1999,
    compareAtPrice: 1999,
    discountPercent: 25,
    rating: 4.9,
    reviewCount: 390,
    verifiedPurchaseCount: 310,
    images: [
      "https://images.unsplash.com/photo-1608248597359-253457a4128f?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1616683693504-3ea7e9ad6fec?auto=format&fit=crop&w=800&q=80"
    ],
    primaryImage: "https://images.unsplash.com/photo-1608248597359-253457a4128f?auto=format&fit=crop&w=800&q=80",
    thumbnail: "https://images.unsplash.com/photo-1608248597359-253457a4128f?auto=format&fit=crop&w=400&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1608248597359-253457a4128f?auto=format&fit=crop&w=800&q=80"
    ],
    skinTypeCompatibility: ["Normal", "Oily", "Combination", "Dry"],
    finish: "Radiant",
    concerns: ["Makeup Meltdown", "Humidity Smudging", "Dullness"],
    keyIngredients: ["24K Pure Gold Flakes", "Rosewater of Kannauj", "Green Tea Bioferment", "PVP Film Former"],
    benefits: [
      "Locks makeup for 24 hours against tropical heat & monsoons",
      "Ultra-fine micro-aerosol delivers cloud-like mist without droplets",
      "Provides subtle golden glow without chunky glitter",
      "Calms redness with distilled Kannauj rosewater"
    ],
    howToUse: "Shake vigorously to suspend gold particulates. Hold bottle 8-10 inches from face and mist evenly in an 'X' and 'T' pattern across set makeup.",
    ingredientsList: "Rosa Damascena Flower Water, Aqua, PVP, Glycerin, 24K Gold, Camellia Sinensis Leaf Extract, Phenoxyethanol, Disodium EDTA.",
    shortDescription: "All-day humidity-proof setting spray with suspended 24K gold flakes and distilled Kannauj rosewater.",
    fullDescription: "Engineered specifically for Indian climates, this weightless mist creates an invisible water-resistant shield while imparting a celestial golden hour radiance.",
    stockCount: 65,
    isBestseller: true,
    isFeatured: true,
    isCrueltyFree: true,
    isVegan: true
  },
  {
    id: "mm-prod-4",
    sku: "MM-MCR-404",
    name: "Mariyam Maquillage Midnight Renewal Multi-Ceramide Barrier Cream",
    slug: "midnight-renewal-ceramide-barrier-cream",
    brand: "Mariyam Maquillage",
    brandType: "Mariyam Signature",
    department: "Skincare",
    category: "Skincare",
    subcategory: "Moisturizer",
    price: 2199,
    mrp: 2799,
    compareAtPrice: 2799,
    discountPercent: 21,
    rating: 4.95,
    reviewCount: 610,
    verifiedPurchaseCount: 520,
    images: [
      "https://images.unsplash.com/photo-1601049541289-9b1b7bbbfe19?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=800&q=80"
    ],
    primaryImage: "https://images.unsplash.com/photo-1601049541289-9b1b7bbbfe19?auto=format&fit=crop&w=800&q=80",
    thumbnail: "https://images.unsplash.com/photo-1601049541289-9b1b7bbbfe19?auto=format&fit=crop&w=400&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1601049541289-9b1b7bbbfe19?auto=format&fit=crop&w=800&q=80"
    ],
    skinTypeCompatibility: ["Dry", "Sensitive", "Combination", "Normal"],
    finish: "Dewy",
    concerns: ["Damaged Barrier", "Dryness", "Pollution Sensitivity", "Fine Lines"],
    keyIngredients: ["5 Essential Ceramides (NP, AP, EOP, NS, AS)", "Centella Asiatica", "Oat Beta-Glucan", "Bakuchiol 1%"],
    benefits: [
      "Restores compromised skin barrier within 3 nights",
      "Calms irritation triggered by extreme urban pollution & heat",
      "Bakuchiol encourages gentle cellular renewal without retinol sensitivity",
      "Plumping peptide hydration without greasy residue"
    ],
    howToUse: "Warm a pea-sized portion between fingertips. Gently press into face, neck and décolletage as the final step of your PM beauty ritual.",
    ingredientsList: "Aqua, Ceramide NP, Ceramide AP, Ceramide EOP, Phytosphingosine, Cholesterol, Bakuchiol, Centella Asiatica Extract, Avena Sativa Kernel Flour, Squalane.",
    shortDescription: "Ultra-restorative evening cream packed with 5 bio-identical ceramides and gentle bakuchiol.",
    fullDescription: "An intensive night balm formulated to heal stressed skin barriers damaged by pollution, heavy makeup, and changing Indian weather.",
    stockCount: 45,
    isBestseller: true,
    isFeatured: true,
    isClean: true,
    isCrueltyFree: true,
    isVegan: true
  },
  {
    id: "mm-prod-5",
    sku: "MM-PGD-505",
    name: "Mariyam Maquillage Luminous Peptide Glaze Dew Drops",
    slug: "luminous-peptide-glaze-dew-drops",
    brand: "Mariyam Maquillage",
    brandType: "Mariyam Signature",
    department: "Skincare",
    category: "Skincare",
    subcategory: "Serum",
    price: 1799,
    mrp: 2299,
    compareAtPrice: 2299,
    discountPercent: 22,
    rating: 4.85,
    reviewCount: 340,
    verifiedPurchaseCount: 290,
    images: [
      "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1608248597359-253457a4128f?auto=format&fit=crop&w=800&q=80"
    ],
    primaryImage: "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=800&q=80",
    thumbnail: "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=400&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=800&q=80"
    ],
    skinTypeCompatibility: ["Normal", "Dry", "Combination", "Oily"],
    finish: "Radiant",
    concerns: ["Dullness", "Texture", "Dehydration"],
    keyIngredients: ["Copper Peptides", "Multi-Weight Hyaluronic Acid", "Niacinamide 5%", "Watermelon Seed Extract"],
    benefits: [
      "Instantly confers glass-skin reflective finish with zero stickiness",
      "Functions as a primer serum under foundation or natural highlighter",
      "Boosts skin elasticity with bioactive copper peptides",
      "Non-comedogenic and light on pores"
    ],
    howToUse: "Apply 2-3 drops directly onto bare skin before moisturizer, mix 1 drop with foundation for enhanced luminosity, or pat over cheekbones as a high-shine glaze.",
    ingredientsList: "Aqua, Niacinamide, Glycerin, Copper Tripeptide-1, Sodium Hyaluronate, Citrullus Lanatus Fruit Extract, Panthenol, Carbomer, Phenoxyethanol.",
    shortDescription: "Multitasking peptide serum and liquid glaze primer that delivers glass skin radiance.",
    fullDescription: "Formulated for instant glass-skin dewy radiance that also works as an ultra-hydrating makeup base.",
    stockCount: 75,
    isBestseller: true,
    isFeatured: true,
    isClean: true,
    isCrueltyFree: true,
    isVegan: true
  },
  {
    id: "mm-prod-6",
    sku: "KAY-MATTE-LIP",
    name: "Kay Beauty Matteinee Matte Lip Crayon by Katrina Kaif",
    slug: "kay-beauty-matteinee-matte-lip-crayon",
    brand: "Kay Beauty",
    brandType: "Indian Prestige",
    department: "Makeup",
    category: "Makeup",
    subcategory: "Lipstick",
    price: 799,
    mrp: 999,
    compareAtPrice: 999,
    discountPercent: 20,
    rating: 4.7,
    reviewCount: 920,
    verifiedPurchaseCount: 780,
    images: [
      "https://images.unsplash.com/photo-1596462502278-27bfdc403348?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1586495777744-4413f21062fa?auto=format&fit=crop&w=800&q=80"
    ],
    primaryImage: "https://images.unsplash.com/photo-1596462502278-27bfdc403348?auto=format&fit=crop&w=800&q=80",
    thumbnail: "https://images.unsplash.com/photo-1596462502278-27bfdc403348?auto=format&fit=crop&w=400&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1596462502278-27bfdc403348?auto=format&fit=crop&w=800&q=80"
    ],
    skinTypeCompatibility: ["Normal", "Dry", "Combination"],
    finish: "Matte",
    coverage: "Full",
    concerns: ["Dryness", "Fading"],
    keyIngredients: ["Marula Oil", "Chamomile Extract", "Carnauba Wax"],
    benefits: [
      "Enriched with nourishing African Marula oil for velvety glide",
      "High-impact matte color with weightless feel",
      "Easy sharpenable crayon format with precision tip"
    ],
    howToUse: "Glide effortlessly across lips. Layer for richer intensity.",
    stockCount: 110,
    isBestseller: true,
    isCrueltyFree: true
  },
  {
    id: "mm-prod-7",
    sku: "MIN-SPF-50",
    name: "Minimalist Sunscreen SPF 50 PA++++ with Niacinamide & Vitamin B5",
    slug: "minimalist-sunscreen-spf-50",
    brand: "Minimalist",
    brandType: "Indian Prestige",
    department: "Skincare",
    category: "Skincare",
    subcategory: "Sunscreen",
    price: 399,
    mrp: 499,
    compareAtPrice: 499,
    discountPercent: 20,
    rating: 4.8,
    reviewCount: 1450,
    verifiedPurchaseCount: 1200,
    images: [
      "https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=800&q=80"
    ],
    primaryImage: "https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?auto=format&fit=crop&w=800&q=80",
    thumbnail: "https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?auto=format&fit=crop&w=400&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?auto=format&fit=crop&w=800&q=80"
    ],
    skinTypeCompatibility: ["Oily", "Combination", "Acne-Prone", "Normal"],
    finish: "Satin",
    concerns: ["Sun Damage", "Tanning", "Pigmentation", "White Cast"],
    keyIngredients: ["New-Age UV Filters", "Niacinamide 2%", "Panthenol", "Centella Extract"],
    benefits: [
      "Zero white cast guaranteed on deep Indian skin tones",
      "Tested PA++++ broad spectrum protection against UVA & UVB rays",
      "Lightweight lotion texture that does not clog pores or pill under makeup"
    ],
    howToUse: "Apply two finger lengths generously to face and neck 15 minutes before stepping into the sun. Reapply every 2-3 hours.",
    stockCount: 180,
    isBestseller: true,
    isClean: true,
    isCrueltyFree: true
  },
  {
    id: "mm-prod-8",
    sku: "DOT-CER-MOIST",
    name: "Dot & Key Ceramides & Hyaluronic Skin Barrier Repair Cream",
    slug: "dot-and-key-ceramides-hyaluronic-barrier-cream",
    brand: "Dot & Key",
    brandType: "Indian Prestige",
    department: "Skincare",
    category: "Skincare",
    subcategory: "Moisturizer",
    price: 495,
    mrp: 595,
    compareAtPrice: 595,
    discountPercent: 17,
    rating: 4.7,
    reviewCount: 780,
    verifiedPurchaseCount: 650,
    images: [
      "https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1601049541289-9b1b7bbbfe19?auto=format&fit=crop&w=800&q=80"
    ],
    primaryImage: "https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=800&q=80",
    thumbnail: "https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=400&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=800&q=80"
    ],
    skinTypeCompatibility: ["Dry", "Sensitive", "Normal"],
    finish: "Dewy",
    concerns: ["Dryness", "Compromised Barrier", "Flakiness"],
    keyIngredients: ["5 Ceramides", "Hyaluronic Acid", "Japanese Rice Water", "Colloidal Oatmeal"],
    benefits: [
      "Deep moisture infusion for 72 hours",
      "Soothes itchy, irritated or peeling skin barrier",
      "Smooth whipped texture that absorbs cleanly"
    ],
    howToUse: "Massage into cleansed face and neck morning and evening.",
    stockCount: 95,
    isCrueltyFree: true
  },
  {
    id: "mm-prod-9",
    sku: "SUGAR-KAJAL-01",
    name: "SUGAR Cosmetics Stroke of Genius Heavy-Duty Kohl Kajal - 01 Back to Black",
    slug: "sugar-stroke-of-genius-kohl-kajal",
    brand: "SUGAR Cosmetics",
    brandType: "Indian Prestige",
    department: "Makeup",
    category: "Makeup",
    subcategory: "Kajal & Kohl",
    price: 499,
    mrp: 599,
    compareAtPrice: 599,
    discountPercent: 17,
    rating: 4.85,
    reviewCount: 1120,
    verifiedPurchaseCount: 980,
    images: [
      "https://images.unsplash.com/photo-1512496015851-a90fb38ba796?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1596462502278-27bfdc403348?auto=format&fit=crop&w=800&q=80"
    ],
    primaryImage: "https://images.unsplash.com/photo-1512496015851-a90fb38ba796?auto=format&fit=crop&w=800&q=80",
    thumbnail: "https://images.unsplash.com/photo-1512496015851-a90fb38ba796?auto=format&fit=crop&w=400&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1512496015851-a90fb38ba796?auto=format&fit=crop&w=800&q=80"
    ],
    skinTypeCompatibility: ["Normal", "Sensitive", "Oily"],
    finish: "Matte",
    concerns: ["Smudging", "Watery Eyes", "Pigment Payoff"],
    keyIngredients: ["Castor Seed Oil", "Carnauba Wax", "Iron Oxides"],
    benefits: [
      "Ultra-creamy waterproof glide for waterline and tightline",
      "Jet black matte finish that stays 12 hours without raccoon eyes",
      "Free of parabens and ophthalmologist certified"
    ],
    howToUse: "Swipe across waterline. Smudge along lash line with a brush for a dramatic smoky Indian eye.",
    stockCount: 150,
    isBestseller: true,
    isCrueltyFree: true
  },
  {
    id: "mm-prod-10",
    sku: "MAC-STUDIO-FIX",
    name: "M.A.C Studio Fix Fluid SPF 15 24HR Matte Foundation",
    slug: "mac-studio-fix-fluid-foundation",
    brand: "M.A.C",
    brandType: "International Luxury",
    department: "Makeup",
    category: "Makeup",
    subcategory: "Foundation",
    price: 3600,
    mrp: 3900,
    compareAtPrice: 3900,
    discountPercent: 8,
    rating: 4.8,
    reviewCount: 650,
    verifiedPurchaseCount: 540,
    images: [
      "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1631729371254-42c2892f0e6e?auto=format&fit=crop&w=800&q=80"
    ],
    primaryImage: "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=800&q=80",
    thumbnail: "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=400&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=800&q=80"
    ],
    skinTypeCompatibility: ["Oily", "Combination", "Normal"],
    finish: "Matte",
    coverage: "Full",
    concerns: ["Shine Control", "High Coverage", "Open Pores"],
    keyIngredients: ["Silica", "Vitamin E", "Broad Spectrum SPF 15"],
    benefits: [
      "24-hour oil-control matte finish",
      "Iconic NC (Neutral Cool/Golden) & NW shades",
      "Full camera-ready coverage without cakey texture"
    ],
    howToUse: "Buff into skin using a dense foundation brush starting from the center of the face.",
    stockCount: 30,
    isBestseller: true
  },
  {
    id: "mm-prod-11",
    sku: "HUDA-EMPOWER",
    name: "Huda Beauty Empowered Luxury Eyeshadow Palette",
    slug: "huda-beauty-empowered-eyeshadow-palette",
    brand: "Huda Beauty",
    brandType: "International Luxury",
    department: "Makeup",
    category: "Makeup",
    subcategory: "Eyeshadow Palettes",
    price: 5800,
    mrp: 6400,
    compareAtPrice: 6400,
    discountPercent: 9,
    rating: 4.95,
    reviewCount: 410,
    verifiedPurchaseCount: 350,
    images: [
      "https://images.unsplash.com/photo-1583241800698-e8ab01c85b27?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1512496015851-a90fb38ba796?auto=format&fit=crop&w=800&q=80"
    ],
    primaryImage: "https://images.unsplash.com/photo-1583241800698-e8ab01c85b27?auto=format&fit=crop&w=800&q=80",
    thumbnail: "https://images.unsplash.com/photo-1583241800698-e8ab01c85b27?auto=format&fit=crop&w=400&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1583241800698-e8ab01c85b27?auto=format&fit=crop&w=800&q=80"
    ],
    finish: "Radiant",
    concerns: ["Bridal Glam", "Festive Eyes", "Pigment Richness"],
    benefits: [
      "18 opulent buttery shades in coppers, golds, and buttery mattes",
      "High pigment payoff tailored for diverse skin tones",
      "Long-wear gel liners and wet-look foil toppers included"
    ],
    howToUse: "Build your base with neutral mattes, and press metallic foil toppers with fingertips for ultra-reflective dimension.",
    stockCount: 22,
    isBestseller: true,
    isCrueltyFree: true
  },
  {
    id: "mm-prod-12",
    sku: "CT-MAGIC-CRM",
    name: "Charlotte Tilbury Charlotte's Magic Cream Instant Glow Moisturiser",
    slug: "charlotte-tilbury-magic-cream",
    brand: "Charlotte Tilbury",
    brandType: "International Luxury",
    department: "Skincare",
    category: "Skincare",
    subcategory: "Moisturizer",
    price: 5650,
    mrp: 6150,
    compareAtPrice: 6150,
    discountPercent: 8,
    rating: 4.88,
    reviewCount: 310,
    verifiedPurchaseCount: 260,
    images: [
      "https://images.unsplash.com/photo-1608248597359-253457a4128f?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1601049541289-9b1b7bbbfe19?auto=format&fit=crop&w=800&q=80"
    ],
    primaryImage: "https://images.unsplash.com/photo-1608248597359-253457a4128f?auto=format&fit=crop&w=800&q=80",
    thumbnail: "https://images.unsplash.com/photo-1608248597359-253457a4128f?auto=format&fit=crop&w=400&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1608248597359-253457a4128f?auto=format&fit=crop&w=800&q=80"
    ],
    skinTypeCompatibility: ["Dry", "Normal", "Mature"],
    finish: "Dewy",
    concerns: ["Dullness", "Dehydration", "Red Carpet Prep"],
    keyIngredients: ["BioNymph Peptide", "Hyaluronic Acid", "Rosehip Oil", "Vitamins C & E"],
    benefits: [
      "Legendary red carpet moisturizer for instant lit-from-within cushion",
      "Reduces fine line appearance under foundation",
      "Nourishing formula beloved by celebrity makeup artists worldwide"
    ],
    howToUse: "Apply the 'Tilbury Tap' massage across temples, jawline, and cheeks before foundation.",
    stockCount: 18,
    isCrueltyFree: true
  },
  {
    id: "mm-prod-13",
    sku: "MM-OUD-NOIR",
    name: "Mariyam Maquillage Oud & Velvet Rose Royale Eau de Parfum (100ml)",
    slug: "oud-velvet-rose-royale-perfume",
    brand: "Mariyam Maquillage",
    brandType: "Mariyam Signature",
    department: "Fragrance",
    category: "Fragrance",
    subcategory: "Eau de Parfum",
    price: 3499,
    mrp: 4499,
    compareAtPrice: 4499,
    discountPercent: 22,
    rating: 4.96,
    reviewCount: 280,
    verifiedPurchaseCount: 240,
    images: [
      "https://images.unsplash.com/photo-1547887537-6158d64c35b3?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?auto=format&fit=crop&w=800&q=80"
    ],
    primaryImage: "https://images.unsplash.com/photo-1547887537-6158d64c35b3?auto=format&fit=crop&w=800&q=80",
    thumbnail: "https://images.unsplash.com/photo-1547887537-6158d64c35b3?auto=format&fit=crop&w=400&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1547887537-6158d64c35b3?auto=format&fit=crop&w=800&q=80"
    ],
    concerns: ["Long-Lasting Fragrance", "Signature Scent", "Festive Allure"],
    keyIngredients: ["Assam Agarwood Oud", "Taif Rose Petals", "Golden Amber", "Mysore Sandalwood"],
    benefits: [
      "Handcrafted extrait de parfum with 25% fragrance oil concentration",
      "Lasts 18+ hours on fabric and skin through Indian festivities",
      "Rich harmonious sillage blending smoked agarwood with velvety Damascus roses",
      "Bottled in heavyweight fluted crystal with 24K gold-plated cap"
    ],
    howToUse: "Spray on pulse points: wrists, hollow of throat, behind ears, and scarf edges for majestic projection.",
    shortDescription: "Regal Indian artisanal perfume combining Assam agarwood with opulent Taif rose petals.",
    stockCount: 35,
    isBestseller: true,
    isFeatured: true,
    isCrueltyFree: true,
    isVegan: true
  },
  {
    id: "mm-prod-14",
    sku: "PIL-ROSEMARY-OIL",
    name: "Pilgrim Spanish Rosemary & Biotin Hair Growth Oil with Redensyl",
    slug: "pilgrim-rosemary-biotin-hair-growth-oil",
    brand: "Pilgrim",
    brandType: "Indian Prestige",
    department: "Haircare",
    category: "Haircare",
    subcategory: "Hair Oil",
    price: 495,
    mrp: 650,
    compareAtPrice: 650,
    discountPercent: 24,
    rating: 4.72,
    reviewCount: 890,
    verifiedPurchaseCount: 740,
    images: [
      "https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=800&q=80"
    ],
    primaryImage: "https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?auto=format&fit=crop&w=800&q=80",
    thumbnail: "https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?auto=format&fit=crop&w=400&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?auto=format&fit=crop&w=800&q=80"
    ],
    skinTypeCompatibility: ["Normal", "Dry", "Oily"],
    concerns: ["Hair Fall", "Thinning Hair", "Scalp Health"],
    keyIngredients: ["Spanish Rosemary Oil", "Redensyl 3%", "Biotin", "Amla Extract"],
    benefits: [
      "Clinically proven hair follicle reactivation",
      "Reduces postpartum and seasonal hair shedding",
      "Non-sticky lightweight oil that washes out effortlessly"
    ],
    howToUse: "Section dry hair and apply 5-10 drops directly to scalp using dropper. Massage gently for 5 minutes and leave for at least 1 hour or overnight.",
    stockCount: 120,
    isClean: true,
    isCrueltyFree: true
  },
  {
    id: "mm-prod-15",
    sku: "PLUM-VANILLA-BUTTER",
    name: "Plum BodyLovin' Vanilla Vibes Body Butter for Dry Skin",
    slug: "plum-bodylovin-vanilla-vibes-body-butter",
    brand: "Plum",
    brandType: "Indian Prestige",
    department: "Bath & Body",
    category: "Bath & Body",
    subcategory: "Body Butter",
    price: 450,
    mrp: 525,
    compareAtPrice: 525,
    discountPercent: 14,
    rating: 4.8,
    reviewCount: 650,
    verifiedPurchaseCount: 520,
    images: [
      "https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1601049541289-9b1b7bbbfe19?auto=format&fit=crop&w=800&q=80"
    ],
    primaryImage: "https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=800&q=80",
    thumbnail: "https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=400&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=800&q=80"
    ],
    skinTypeCompatibility: ["Dry", "Normal"],
    concerns: ["Body Dryness", "Rough Knees & Elbows"],
    keyIngredients: ["Shea Butter", "Brazil Nut Oil", "Sunflower Seed Oil"],
    benefits: [
      "Warm gourmand vanilla bakery fragrance that lingers all day",
      "Intense moisture nourishment for 48 hours without greasy feel",
      "100% vegan formula packed with cold-pressed botanical butters"
    ],
    howToUse: "Slather over freshly bathed, towel-dried skin.",
    stockCount: 80,
    isVegan: true,
    isCrueltyFree: true
  },
  {
    id: "mm-prod-16",
    sku: "BSC-BEARD-GROWTH",
    name: "Bombay Shaving Company Beard Growth Oil with Vetiver & Jojoba",
    slug: "bombay-shaving-company-beard-growth-oil",
    brand: "Bombay Shaving Company",
    brandType: "Indian Prestige",
    department: "Bath & Body",
    category: "Bath & Body",
    subcategory: "Beard Oil",
    price: 399,
    mrp: 499,
    compareAtPrice: 499,
    discountPercent: 20,
    rating: 4.65,
    reviewCount: 420,
    verifiedPurchaseCount: 360,
    images: [
      "https://images.unsplash.com/photo-1621607512214-68297480165e?auto=format&fit=crop&w=800&q=80"
    ],
    primaryImage: "https://images.unsplash.com/photo-1621607512214-68297480165e?auto=format&fit=crop&w=800&q=80",
    thumbnail: "https://images.unsplash.com/photo-1621607512214-68297480165e?auto=format&fit=crop&w=400&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1621607512214-68297480165e?auto=format&fit=crop&w=800&q=80"
    ],
    concerns: ["Patchy Beard", "Beard Dandruff", "Coarse Beard Hair"],
    keyIngredients: ["Vetiver Oil", "Jojoba Oil", "Brahmi Extract"],
    benefits: [
      "Strengthens roots and softens coarse beard bristles",
      "Calms itchy under-beard skin with cooling vetiver aroma",
      "Lightweight fast absorption"
    ],
    howToUse: "Rub 4-6 drops between palms and massage through beard from roots to tips.",
    stockCount: 50,
    isCrueltyFree: true
  },
  {
    id: "mm-prod-17",
    sku: "PAC-PRO-BRUSH-SET",
    name: "PAC Professional Master 12-Piece Artisanal Makeup Brush Kit with Bag",
    slug: "pac-master-12-piece-brush-kit",
    brand: "PAC Cosmetics",
    brandType: "Indian Prestige",
    department: "Tools & Brushes",
    category: "Tools & Brushes",
    subcategory: "Makeup Brushes",
    price: 3250,
    mrp: 4200,
    compareAtPrice: 4200,
    discountPercent: 23,
    rating: 4.92,
    reviewCount: 380,
    verifiedPurchaseCount: 320,
    images: [
      "https://images.unsplash.com/photo-1516914943479-89db7d9ae7f2?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=800&q=80"
    ],
    primaryImage: "https://images.unsplash.com/photo-1516914943479-89db7d9ae7f2?auto=format&fit=crop&w=800&q=80",
    thumbnail: "https://images.unsplash.com/photo-1516914943479-89db7d9ae7f2?auto=format&fit=crop&w=400&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1516914943479-89db7d9ae7f2?auto=format&fit=crop&w=800&q=80"
    ],
    concerns: ["Seamless Blending", "Brush Shedding", "Precision Application"],
    keyIngredients: ["Micro-Fine Synthetic Duo-Fiber Filaments", "Handcrafted Wooden Handles", "Copper Ferrules"],
    benefits: [
      "12 essential brushes for face, eyes, and contour blending",
      "Ultra-soft vegan bristles that do not shed or soak excess liquid",
      "Includes water-resistant zip travel pouch"
    ],
    howToUse: "Use dense brushes for liquid and cream blending, and fluffy brushes for setting powder, blush, and eyeshadow transitions.",
    stockCount: 40,
    isBestseller: true,
    isCrueltyFree: true,
    isVegan: true
  }
];

export const INITIAL_COUPONS: Coupon[] = [
  {
    code: "WELCOME10",
    discountType: "percentage",
    discountValue: 10,
    description: "10% off your first luxury order"
  },
  {
    code: "ROYAL15",
    discountType: "percentage",
    discountValue: 15,
    minOrderValue: 2000,
    description: "15% off orders above ₹2,000"
  },
  {
    code: "ROYAL20",
    discountType: "percentage",
    discountValue: 20,
    minOrderValue: 2500,
    description: "20% off luxury orders above ₹2,500"
  },
  {
    code: "BRIDAL15",
    discountType: "percentage",
    discountValue: 15,
    minOrderValue: 3000,
    description: "15% off bridal trousseau collections above ₹3,000"
  },
  {
    code: "FIRSTGLOW",
    discountType: "fixed",
    discountValue: 500,
    minOrderValue: 2500,
    description: "Flat ₹500 off on bridal & prestige orders above ₹2,500"
  }
];

export const PINCODE_DIRECTORY: Record<string, { city: string; state: string; days: number }> = {
  "110001": { city: "New Delhi", state: "Delhi", days: 1 },
  "110020": { city: "New Delhi", state: "Delhi", days: 1 },
  "400001": { city: "Mumbai", state: "Maharashtra", days: 2 },
  "400050": { city: "Mumbai (Bandra)", state: "Maharashtra", days: 2 },
  "560001": { city: "Bengaluru", state: "Karnataka", days: 2 },
  "560034": { city: "Bengaluru (Koramangala)", state: "Karnataka", days: 2 },
  "700001": { city: "Kolkata", state: "West Bengal", days: 3 },
  "500001": { city: "Hyderabad", state: "Telangana", days: 2 },
  "600001": { city: "Chennai", state: "Tamil Nadu", days: 2 },
  "380001": { city: "Ahmedabad", state: "Gujarat", days: 2 },
  "302001": { city: "Jaipur", state: "Rajasthan", days: 2 },
  "226001": { city: "Lucknow", state: "Uttar Pradesh", days: 2 },
  "411001": { city: "Pune", state: "Maharashtra", days: 2 },
  "160017": { city: "Chandigarh", state: "Punjab", days: 2 },
  "682001": { city: "Kochi", state: "Kerala", days: 3 }
};
