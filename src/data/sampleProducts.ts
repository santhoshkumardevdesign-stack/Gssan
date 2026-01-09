import { Product, ProductCategory } from "@/types";

// Sample products data for development
export const sampleProducts: Product[] = [
  {
    id: "prod_001",
    name: "Pure Bhimseni Camphor",
    slug: "pure-bhimseni-camphor",
    category: "camphor",
    description: "Premium quality Bhimseni Camphor made from natural camphor tree extract. Known for its pure white color, strong fragrance, and complete burning without residue. Ideal for daily puja, havan, and religious ceremonies.",
    shortDescription: "100% Pure Bhimseni Camphor for daily puja",
    basePrice: 199,
    sellingPrice: 169,
    variants: [
      { id: "var_001_1", name: "50g Pack", weight: "50g", sku: "CAMP-50G", mrp: 199, price: 169, inStock: true },
      { id: "var_001_2", name: "100g Pack", weight: "100g", sku: "CAMP-100G", mrp: 349, price: 299, inStock: true },
      { id: "var_001_3", name: "250g Pack", weight: "250g", sku: "CAMP-250G", mrp: 749, price: 649, inStock: true },
    ],
    images: ["/images/products/camphor-1.jpg", "/images/products/camphor-2.jpg"],
    thumbnailUrl: "/images/products/camphor-thumb.jpg",
    inStock: true,
    isFeatured: true,
    isBestSeller: true,
    isNewArrival: false,
    tags: ["camphor", "bhimseni", "pure", "natural"],
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "prod_002",
    name: "Premium Rose Agarbatti",
    slug: "premium-rose-agarbatti",
    category: "agarbatti",
    description: "Hand-rolled premium Rose incense sticks made with natural rose essence. Long-lasting fragrance that fills your home with divine aroma. Each stick burns for approximately 45 minutes.",
    shortDescription: "Natural rose fragrance incense sticks",
    basePrice: 149,
    sellingPrice: 129,
    variants: [
      { id: "var_002_1", name: "12 Sticks", sku: "ROSE-12", mrp: 149, price: 129, inStock: true },
      { id: "var_002_2", name: "50 Sticks", sku: "ROSE-50", mrp: 449, price: 399, inStock: true },
      { id: "var_002_3", name: "100 Sticks", sku: "ROSE-100", mrp: 799, price: 699, inStock: true },
    ],
    images: ["/images/products/agarbatti-rose-1.jpg"],
    thumbnailUrl: "/images/products/agarbatti-rose-thumb.jpg",
    inStock: true,
    isFeatured: true,
    isBestSeller: false,
    isNewArrival: false,
    tags: ["agarbatti", "incense", "rose", "fragrance"],
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "prod_003",
    name: "Sambrani Cup",
    slug: "sambrani-cup",
    category: "sambrani-dhoop",
    description: "Traditional Sambrani dhoop cups made with natural loban resin. Creates sacred smoke that purifies the air and creates a divine atmosphere. Pack of 12 ready-to-use cups.",
    shortDescription: "Natural Sambrani dhoop cups for puja",
    basePrice: 99,
    sellingPrice: 79,
    variants: [
      { id: "var_003_1", name: "12 Cups", sku: "SAM-12", mrp: 99, price: 79, inStock: true },
      { id: "var_003_2", name: "24 Cups", sku: "SAM-24", mrp: 179, price: 149, inStock: true },
      { id: "var_003_3", name: "50 Cups", sku: "SAM-50", mrp: 349, price: 299, inStock: true },
    ],
    images: ["/images/products/sambrani-1.jpg"],
    thumbnailUrl: "/images/products/sambrani-thumb.jpg",
    inStock: true,
    isFeatured: false,
    isBestSeller: true,
    isNewArrival: false,
    tags: ["sambrani", "dhoop", "loban", "purification"],
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "prod_004",
    name: "Pure Deepam Oil",
    slug: "pure-deepam-oil",
    category: "deepam-oil",
    description: "Premium quality sesame oil (Nallennai) for lighting deepam. Cold-pressed from selected sesame seeds. Burns with a bright, steady flame perfect for puja.",
    shortDescription: "Cold-pressed sesame oil for deepam",
    basePrice: 249,
    sellingPrice: 199,
    variants: [
      { id: "var_004_1", name: "200ml", weight: "200ml", sku: "OIL-200", mrp: 249, price: 199, inStock: true },
      { id: "var_004_2", name: "500ml", weight: "500ml", sku: "OIL-500", mrp: 499, price: 449, inStock: true },
      { id: "var_004_3", name: "1 Litre", weight: "1L", sku: "OIL-1L", mrp: 899, price: 799, inStock: true },
    ],
    images: ["/images/products/deepam-oil-1.jpg"],
    thumbnailUrl: "/images/products/deepam-oil-thumb.jpg",
    inStock: true,
    isFeatured: false,
    isBestSeller: false,
    isNewArrival: true,
    tags: ["oil", "deepam", "sesame", "nallennai"],
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

// Helper function to get products by category
export function getProductsByCategory(category: ProductCategory): Product[] {
  return sampleProducts.filter((p) => p.category === category);
}

// Helper function to get featured products
export function getFeaturedProducts(): Product[] {
  return sampleProducts.filter((p) => p.isFeatured);
}

// Helper function to get product by slug
export function getProductBySlug(slug: string): Product | undefined {
  return sampleProducts.find((p) => p.slug === slug);
}

// Helper function to get category counts
export function getCategoryCounts(): Record<ProductCategory, number> {
  const counts: Record<ProductCategory, number> = {
    camphor: 0,
    agarbatti: 0,
    "sambrani-dhoop": 0,
    "deepam-oil": 0,
    "pooja-powders": 0,
    accessories: 0,
  };

  sampleProducts.forEach((p) => {
    counts[p.category]++;
  });

  return counts;
}
