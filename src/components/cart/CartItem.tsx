"use client";

import Image from "next/image";
import Link from "next/link";
import { Trash2, Minus, Plus } from "lucide-react";
import { CartItem as CartItemType, useCart } from "@/context/CartContext";
import { formatPrice } from "@/lib/utils/formatters";

interface CartItemProps {
  item: CartItemType;
}

export function CartItem({ item }: CartItemProps) {
  const { updateQuantity, removeItem } = useCart();

  const handleQuantityChange = (delta: number) => {
    const newQuantity = item.quantity + delta;
    if (newQuantity < 1) {
      removeItem(item.productId, item.variantId);
    } else if (newQuantity <= 10) {
      updateQuantity(item.productId, item.variantId, newQuantity);
    }
  };

  return (
    <div className="flex gap-4 py-4 border-b border-charcoal-100 last:border-0">
      {/* Product Image */}
      <Link
        href={`/products/${item.productSlug}`}
        className="relative w-20 h-20 md:w-24 md:h-24 flex-shrink-0 rounded-lg overflow-hidden bg-cream-100"
      >
        <Image
          src={item.thumbnailUrl || "/images/placeholder-product.jpg"}
          alt={item.productName}
          fill
          className="object-cover"
          sizes="96px"
        />
      </Link>

      {/* Product Details */}
      <div className="flex-1 min-w-0">
        <Link
          href={`/products/${item.productSlug}`}
          className="font-heading font-semibold text-charcoal hover:text-maroon transition-colors line-clamp-2"
        >
          {item.productName}
        </Link>
        <p className="text-sm text-charcoal-500 mt-1">{item.variantName}</p>

        {/* Mobile Price */}
        <div className="flex items-center justify-between mt-2 md:hidden">
          <span className="font-semibold text-maroon">
            {formatPrice(item.price * item.quantity)}
          </span>
        </div>

        {/* Quantity Controls */}
        <div className="flex items-center gap-4 mt-3">
          <div className="flex items-center border border-charcoal-200 rounded-lg">
            <button
              onClick={() => handleQuantityChange(-1)}
              className="w-8 h-8 flex items-center justify-center hover:bg-charcoal-50 transition-colors"
              aria-label="Decrease quantity"
            >
              <Minus className="h-3 w-3" />
            </button>
            <span className="w-8 text-center text-sm font-medium">
              {item.quantity}
            </span>
            <button
              onClick={() => handleQuantityChange(1)}
              disabled={item.quantity >= 10}
              className="w-8 h-8 flex items-center justify-center hover:bg-charcoal-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              aria-label="Increase quantity"
            >
              <Plus className="h-3 w-3" />
            </button>
          </div>

          <button
            onClick={() => removeItem(item.productId, item.variantId)}
            className="text-charcoal-400 hover:text-red-500 transition-colors p-1"
            aria-label="Remove item"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Desktop Price */}
      <div className="hidden md:flex flex-col items-end">
        <span className="font-semibold text-maroon">
          {formatPrice(item.price * item.quantity)}
        </span>
        <span className="text-sm text-charcoal-500 mt-1">
          {formatPrice(item.price)} each
        </span>
      </div>
    </div>
  );
}
