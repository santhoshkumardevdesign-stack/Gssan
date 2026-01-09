"use client";

import Link from "next/link";
import { ArrowRight, ShoppingCart, Star } from "lucide-react";
import { Container } from "@/components/layout/Container";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { formatPrice, calculateDiscount } from "@/lib/utils/formatters";
import { useCart } from "@/context/CartContext";

// Sample products data - will be replaced with Firestore data
const bestSellers = [
  {
    id: "1",
    name: "Pure Camphor Tablets",
    slug: "pure-camphor-tablets",
    category: "Camphor",
    shortDescription: "100% pure camphor, burns completely",
    thumbnailUrl: "/images/products/camphor.jpg",
    basePrice: 150,
    sellingPrice: 120,
    rating: 4.8,
    reviewCount: 48,
    isBestSeller: true,
    isNewArrival: false,
    inStock: true,
    variantId: "v1",
    variantName: "Standard Pack",
  },
  {
    id: "2",
    name: "Nag Champa Premium",
    slug: "nag-champa-premium",
    category: "Agarbatti",
    shortDescription: "Traditional fragrance, long-lasting",
    thumbnailUrl: "/images/products/agarbatti.jpg",
    basePrice: 85,
    sellingPrice: 85,
    rating: 4.5,
    reviewCount: 32,
    isBestSeller: false,
    isNewArrival: true,
    inStock: true,
    variantId: "v2",
    variantName: "20 Sticks",
  },
  {
    id: "3",
    name: "Cup Sambrani",
    slug: "cup-sambrani",
    category: "Sambrani",
    shortDescription: "Ready-to-use dhoop cups, 12 pack",
    thumbnailUrl: "/images/products/sambrani.jpg",
    basePrice: 110,
    sellingPrice: 95,
    rating: 4.9,
    reviewCount: 56,
    isBestSeller: true,
    isNewArrival: false,
    inStock: true,
    variantId: "v3",
    variantName: "12 Cups",
  },
  {
    id: "4",
    name: "Deepam Oil 1L",
    slug: "deepam-oil-1l",
    category: "Deepam Oil",
    shortDescription: "Pure sesame oil for lamps",
    thumbnailUrl: "/images/products/oil.jpg",
    basePrice: 220,
    sellingPrice: 180,
    rating: 4.6,
    reviewCount: 28,
    isBestSeller: false,
    isNewArrival: false,
    inStock: true,
    variantId: "v4",
    variantName: "1 Litre",
  },
];

export function BestSellersSection() {
  return (
    <section className="section bg-cream-100">
      <Container>
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-10">
          <div>
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-heading font-bold text-charcoal mb-2">
              Most Loved by Our Customers
            </h2>
            <p className="text-charcoal-600">
              Our best-selling products trusted by thousands
            </p>
          </div>
          <Link
            href="/products?sort=popular"
            className="inline-flex items-center gap-2 text-maroon font-medium hover:text-maroon-700 transition-colors"
          >
            View All
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {bestSellers.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </Container>
    </section>
  );
}

interface ProductCardProps {
  product: (typeof bestSellers)[0];
}

function ProductCard({ product }: ProductCardProps) {
  const { addItem, isInCart } = useCart();
  const discount = calculateDiscount(product.basePrice, product.sellingPrice);
  const inCart = isInCart(product.id);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (inCart || !product.inStock) return;

    addItem({
      productId: product.id,
      productName: product.name,
      productSlug: product.slug,
      thumbnailUrl: product.thumbnailUrl,
      variantId: product.variantId,
      variantName: product.variantName,
      price: product.sellingPrice,
      mrp: product.basePrice,
      quantity: 1,
    });
  };

  return (
    <div className="group bg-white rounded-xl shadow-card hover:shadow-card-hover transition-all duration-300 overflow-hidden">
      {/* Image Container */}
      <Link href={`/products/${product.slug}`} className="block">
        <div className="relative aspect-square overflow-hidden bg-cream-100">
          {/* Badges */}
          <div className="absolute top-3 left-3 z-10 flex flex-col gap-2">
            {product.isBestSeller && (
              <Badge variant="secondary" size="sm">
                Bestseller
              </Badge>
            )}
            {product.isNewArrival && (
              <Badge variant="success" size="sm">
                New
              </Badge>
            )}
            {discount > 0 && (
              <Badge variant="danger" size="sm">
                -{discount}%
              </Badge>
            )}
          </div>

          {/* Placeholder Image */}
          <div className="w-full h-full flex items-center justify-center text-6xl bg-gradient-to-br from-cream-100 to-cream-200 group-hover:scale-105 transition-transform duration-300">
            {product.category === "Camphor" && "🪔"}
            {product.category === "Agarbatti" && "🌸"}
            {product.category === "Sambrani" && "💨"}
            {product.category === "Deepam Oil" && "🕯️"}
          </div>

          {/* Quick Add Button - Desktop */}
          <div className="absolute inset-x-0 bottom-0 p-3 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity hidden md:block">
            <Button
              variant={inCart ? "outline" : "secondary"}
              size="sm"
              className="w-full"
              leftIcon={<ShoppingCart className="h-4 w-4" />}
              onClick={handleAddToCart}
              disabled={!product.inStock || inCart}
            >
              {inCart ? "In Cart" : "Add to Cart"}
            </Button>
          </div>
        </div>
      </Link>

      {/* Content */}
      <div className="p-4">
        {/* Category */}
        <p className="text-xs text-charcoal-500 mb-1">{product.category}</p>

        {/* Name */}
        <Link href={`/products/${product.slug}`}>
          <h3 className="font-medium text-charcoal group-hover:text-maroon transition-colors line-clamp-2 min-h-[2.5rem]">
            {product.name}
          </h3>
        </Link>

        {/* Rating */}
        <div className="flex items-center gap-1 mt-2">
          <Star className="h-4 w-4 fill-gold text-gold" />
          <span className="text-sm font-medium">{product.rating}</span>
          <span className="text-xs text-charcoal-400">
            ({product.reviewCount})
          </span>
        </div>

        {/* Price */}
        <div className="flex items-baseline gap-2 mt-2">
          <span className="text-lg font-semibold text-maroon">
            {formatPrice(product.sellingPrice)}
          </span>
          {product.basePrice > product.sellingPrice && (
            <span className="text-sm text-charcoal-400 line-through">
              {formatPrice(product.basePrice)}
            </span>
          )}
        </div>

        {/* Mobile Add Button */}
        <Button
          variant={inCart ? "outline" : "primary"}
          size="sm"
          className="w-full mt-3 md:hidden"
          leftIcon={<ShoppingCart className="h-4 w-4" />}
          onClick={handleAddToCart}
          disabled={!product.inStock || inCart}
        >
          {inCart ? "In Cart" : "Add to Cart"}
        </Button>
      </div>
    </div>
  );
}
