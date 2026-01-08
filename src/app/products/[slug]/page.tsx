"use client";

import { useState, useMemo } from "react";
import { useParams, notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import {
  ShoppingCart,
  Heart,
  Share2,
  ChevronLeft,
  ChevronRight,
  Minus,
  Plus,
  Check,
  Truck,
  Shield,
  Phone,
} from "lucide-react";
import { Container } from "@/components/layout/Container";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { ProductCard } from "@/components/products";
import { useCart } from "@/context/CartContext";
import { formatPrice } from "@/lib/utils/formatters";
import { getProductBySlug, sampleProducts } from "@/data/sampleProducts";
import { ProductVariant } from "@/types";

const categoryNames: Record<string, string> = {
  camphor: "Camphor",
  agarbatti: "Agarbatti",
  "sambrani-dhoop": "Sambrani & Dhoop",
  "deepam-oil": "Deepam Oil",
  "pooja-powders": "Pooja Powders",
  accessories: "Pooja Accessories",
};

export default function ProductDetailPage() {
  const params = useParams();
  const slug = params.slug as string;

  const product = getProductBySlug(slug);

  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(
    product?.variants[0] || null
  );
  const [quantity, setQuantity] = useState(1);
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  const { addItem, isInCart } = useCart();

  if (!product) {
    notFound();
  }

  const inCart = isInCart(product.id);
  const hasDiscount =
    selectedVariant &&
    selectedVariant.basePrice > selectedVariant.sellingPrice;
  const discountPercent = hasDiscount && selectedVariant
    ? Math.round(
        ((selectedVariant.basePrice - selectedVariant.sellingPrice) /
          selectedVariant.basePrice) *
          100
      )
    : 0;

  // Get related products (same category, excluding current)
  const relatedProducts = useMemo(() => {
    return sampleProducts
      .filter((p) => p.category === product.category && p.id !== product.id)
      .slice(0, 4);
  }, [product]);

  const handleAddToCart = () => {
    if (!selectedVariant) return;

    addItem({
      productId: product.id,
      productName: product.name,
      productSlug: product.slug,
      productImage: product.thumbnailUrl,
      variantId: selectedVariant.id,
      variantName: selectedVariant.size,
      price: selectedVariant.sellingPrice,
      quantity,
    });
  };

  const handleQuantityChange = (delta: number) => {
    setQuantity((prev) => Math.max(1, Math.min(10, prev + delta)));
  };

  const nextImage = () => {
    setActiveImageIndex((prev) =>
      prev === product.images.length - 1 ? 0 : prev + 1
    );
  };

  const prevImage = () => {
    setActiveImageIndex((prev) =>
      prev === 0 ? product.images.length - 1 : prev - 1
    );
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Breadcrumb */}
      <div className="bg-cream border-b border-charcoal-100">
        <Container>
          <Breadcrumb
            items={[
              { label: "Products", href: "/products" },
              {
                label: categoryNames[product.category],
                href: `/products?category=${product.category}`,
              },
              { label: product.name },
            ]}
          />
        </Container>
      </div>

      {/* Product Section */}
      <Container className="py-6 md:py-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Image Gallery */}
          <div className="space-y-4">
            {/* Main Image */}
            <div className="relative aspect-square rounded-xl overflow-hidden bg-cream-100">
              <Image
                src={product.images[activeImageIndex] || product.thumbnailUrl || "/images/placeholder-product.jpg"}
                alt={product.name}
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
                priority
              />

              {/* Navigation Arrows */}
              {product.images.length > 1 && (
                <>
                  <button
                    onClick={prevImage}
                    className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/90 rounded-full shadow-lg flex items-center justify-center hover:bg-white transition-colors"
                  >
                    <ChevronLeft className="h-5 w-5" />
                  </button>
                  <button
                    onClick={nextImage}
                    className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/90 rounded-full shadow-lg flex items-center justify-center hover:bg-white transition-colors"
                  >
                    <ChevronRight className="h-5 w-5" />
                  </button>
                </>
              )}

              {/* Badges */}
              <div className="absolute top-3 left-3 flex flex-col gap-2">
                {hasDiscount && (
                  <Badge variant="primary" size="md">
                    {discountPercent}% OFF
                  </Badge>
                )}
                {product.isFeatured && (
                  <Badge variant="secondary" size="md">
                    Best Seller
                  </Badge>
                )}
              </div>
            </div>

            {/* Thumbnail Gallery */}
            {product.images.length > 1 && (
              <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
                {product.images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setActiveImageIndex(index)}
                    className={`relative w-20 h-20 flex-shrink-0 rounded-lg overflow-hidden border-2 transition-colors ${
                      activeImageIndex === index
                        ? "border-maroon"
                        : "border-transparent hover:border-charcoal-200"
                    }`}
                  >
                    <Image
                      src={image}
                      alt={`${product.name} - Image ${index + 1}`}
                      fill
                      className="object-cover"
                      sizes="80px"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            {/* Category */}
            <Link
              href={`/products?category=${product.category}`}
              className="text-sm text-saffron hover:text-saffron-600 uppercase tracking-wider"
            >
              {categoryNames[product.category]}
            </Link>

            {/* Title */}
            <h1 className="text-2xl md:text-3xl font-heading font-bold text-charcoal">
              {product.name}
            </h1>

            {/* Short Description */}
            <p className="text-charcoal-600">{product.shortDescription}</p>

            {/* Price */}
            <div className="flex items-center gap-3">
              <span className="text-3xl font-bold text-maroon">
                {formatPrice(selectedVariant?.sellingPrice || 0)}
              </span>
              {hasDiscount && selectedVariant && (
                <span className="text-xl text-charcoal-400 line-through">
                  {formatPrice(selectedVariant.basePrice)}
                </span>
              )}
              {hasDiscount && (
                <span className="text-sm font-medium text-green-600 bg-green-50 px-2 py-1 rounded">
                  Save {formatPrice((selectedVariant?.basePrice || 0) - (selectedVariant?.sellingPrice || 0))}
                </span>
              )}
            </div>

            {/* Variant Selector */}
            <div className="space-y-3">
              <label className="text-sm font-medium text-charcoal">
                Pack Size
              </label>
              <div className="flex flex-wrap gap-3">
                {product.variants.map((variant) => (
                  <button
                    key={variant.id}
                    onClick={() => {
                      setSelectedVariant(variant);
                      setQuantity(1);
                    }}
                    className={`px-4 py-2 rounded-lg border-2 text-sm font-medium transition-colors ${
                      selectedVariant?.id === variant.id
                        ? "border-maroon bg-maroon-50 text-maroon"
                        : "border-charcoal-200 hover:border-charcoal-300 text-charcoal-600"
                    }`}
                  >
                    {variant.size}
                    <span className="block text-xs mt-0.5 font-normal">
                      {formatPrice(variant.sellingPrice)}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Quantity */}
            <div className="space-y-3">
              <label className="text-sm font-medium text-charcoal">
                Quantity
              </label>
              <div className="flex items-center gap-3">
                <div className="flex items-center border border-charcoal-200 rounded-lg">
                  <button
                    onClick={() => handleQuantityChange(-1)}
                    disabled={quantity <= 1}
                    className="w-10 h-10 flex items-center justify-center hover:bg-charcoal-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    <Minus className="h-4 w-4" />
                  </button>
                  <span className="w-12 text-center font-medium">{quantity}</span>
                  <button
                    onClick={() => handleQuantityChange(1)}
                    disabled={quantity >= 10}
                    className="w-10 h-10 flex items-center justify-center hover:bg-charcoal-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                </div>
                <span className="text-sm text-charcoal-500">
                  (Max 10 per order)
                </span>
              </div>
            </div>

            {/* Stock Status */}
            <div className="flex items-center gap-2">
              {product.inStock ? (
                <>
                  <Check className="h-5 w-5 text-green-600" />
                  <span className="text-green-600 font-medium">In Stock</span>
                </>
              ) : (
                <span className="text-red-600 font-medium">Out of Stock</span>
              )}
            </div>

            {/* Add to Cart Button */}
            <div className="flex gap-3">
              <Button
                variant={inCart ? "outline" : "primary"}
                size="lg"
                className="flex-1"
                onClick={handleAddToCart}
                disabled={!product.inStock || inCart}
                leftIcon={<ShoppingCart className="h-5 w-5" />}
              >
                {inCart ? "Added to Cart" : "Add to Cart"}
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="px-4"
                title="Add to Wishlist"
              >
                <Heart className="h-5 w-5" />
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="px-4"
                title="Share"
              >
                <Share2 className="h-5 w-5" />
              </Button>
            </div>

            {/* Trust Badges */}
            <div className="grid grid-cols-3 gap-4 py-4 border-t border-b border-charcoal-100">
              <div className="text-center">
                <Truck className="h-6 w-6 mx-auto text-maroon mb-2" />
                <p className="text-xs text-charcoal-600">Free Delivery</p>
                <p className="text-xs text-charcoal-400">Orders above ₹499</p>
              </div>
              <div className="text-center">
                <Shield className="h-6 w-6 mx-auto text-maroon mb-2" />
                <p className="text-xs text-charcoal-600">100% Pure</p>
                <p className="text-xs text-charcoal-400">Quality Guaranteed</p>
              </div>
              <div className="text-center">
                <Phone className="h-6 w-6 mx-auto text-maroon mb-2" />
                <p className="text-xs text-charcoal-600">WhatsApp Support</p>
                <p className="text-xs text-charcoal-400">Quick Response</p>
              </div>
            </div>

            {/* Full Description */}
            <div className="space-y-3">
              <h3 className="font-heading font-semibold text-charcoal">
                Description
              </h3>
              <p className="text-charcoal-600 leading-relaxed">
                {product.description}
              </p>
            </div>
          </div>
        </div>
      </Container>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <section className="py-12 bg-cream">
          <Container>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl md:text-2xl font-heading font-bold text-charcoal">
                Related Products
              </h2>
              <Link
                href={`/products?category=${product.category}`}
                className="text-sm text-saffron hover:text-saffron-600 font-medium"
              >
                View All
              </Link>
            </div>
            <div className="grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
              {relatedProducts.map((relatedProduct) => (
                <ProductCard key={relatedProduct.id} product={relatedProduct} />
              ))}
            </div>
          </Container>
        </section>
      )}
    </div>
  );
}
