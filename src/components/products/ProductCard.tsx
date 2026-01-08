"use client";

import Image from "next/image";
import Link from "next/link";
import { ShoppingCart, Eye } from "lucide-react";
import { Product } from "@/types";
import { formatPrice, formatDiscount } from "@/lib/utils/formatters";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { useCart } from "@/context/CartContext";

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const { addItem, isInCart } = useCart();
  const inCart = isInCart(product.id);

  // Get the default variant (first one) for initial display
  const defaultVariant = product.variants[0];
  const hasDiscount = defaultVariant.basePrice > defaultVariant.sellingPrice;
  const discountPercent = hasDiscount
    ? Math.round(((defaultVariant.basePrice - defaultVariant.sellingPrice) / defaultVariant.basePrice) * 100)
    : 0;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    addItem({
      productId: product.id,
      productName: product.name,
      productSlug: product.slug,
      productImage: product.thumbnailUrl,
      variantId: defaultVariant.id,
      variantName: defaultVariant.size,
      price: defaultVariant.sellingPrice,
      quantity: 1,
    });
  };

  return (
    <Link
      href={`/products/${product.slug}`}
      className="group block bg-white rounded-xl overflow-hidden shadow-card hover:shadow-card-hover transition-all duration-300"
    >
      {/* Image Container */}
      <div className="relative aspect-square overflow-hidden bg-cream-100">
        <Image
          src={product.thumbnailUrl || "/images/placeholder-product.jpg"}
          alt={product.name}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-500"
          sizes="(max-width: 480px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
        />

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-2">
          {hasDiscount && (
            <Badge variant="primary" size="sm">
              {discountPercent}% OFF
            </Badge>
          )}
          {product.isFeatured && (
            <Badge variant="secondary" size="sm">
              Best Seller
            </Badge>
          )}
          {!product.inStock && (
            <Badge variant="outline" size="sm" className="bg-white">
              Out of Stock
            </Badge>
          )}
        </div>

        {/* Quick Actions */}
        <div className="absolute bottom-3 right-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <button
            onClick={handleAddToCart}
            disabled={!product.inStock || inCart}
            className="w-10 h-10 bg-white rounded-full shadow-lg flex items-center justify-center hover:bg-saffron hover:text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            title={inCart ? "Already in cart" : "Add to cart"}
          >
            <ShoppingCart className="h-5 w-5" />
          </button>
          <span className="w-10 h-10 bg-white rounded-full shadow-lg flex items-center justify-center hover:bg-maroon hover:text-white transition-colors">
            <Eye className="h-5 w-5" />
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        {/* Category */}
        <p className="text-xs text-charcoal-500 uppercase tracking-wider mb-1">
          {product.category.replace("-", " ")}
        </p>

        {/* Name */}
        <h3 className="font-heading font-semibold text-charcoal line-clamp-2 mb-2 group-hover:text-maroon transition-colors">
          {product.name}
        </h3>

        {/* Short Description */}
        <p className="text-sm text-charcoal-500 line-clamp-1 mb-3">
          {product.shortDescription}
        </p>

        {/* Variants Info */}
        {product.variants.length > 1 && (
          <p className="text-xs text-charcoal-400 mb-2">
            {product.variants.length} pack sizes available
          </p>
        )}

        {/* Price */}
        <div className="flex items-center gap-2 mb-3">
          <span className="text-lg font-bold text-maroon">
            {formatPrice(defaultVariant.sellingPrice)}
          </span>
          {hasDiscount && (
            <span className="text-sm text-charcoal-400 line-through">
              {formatPrice(defaultVariant.basePrice)}
            </span>
          )}
        </div>

        {/* Add to Cart Button - Mobile */}
        <Button
          variant={inCart ? "outline" : "primary"}
          size="sm"
          className="w-full md:hidden"
          onClick={handleAddToCart}
          disabled={!product.inStock || inCart}
        >
          {inCart ? "In Cart" : product.inStock ? "Add to Cart" : "Out of Stock"}
        </Button>
      </div>
    </Link>
  );
}
