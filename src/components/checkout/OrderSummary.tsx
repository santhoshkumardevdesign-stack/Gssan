"use client";

import Image from "next/image";
import { CartItem } from "@/types";
import { formatPrice } from "@/lib/utils/formatters";

interface OrderSummaryProps {
  items: CartItem[];
  subtotal: number;
  deliveryCharge: number;
  total: number;
}

export function OrderSummary({
  items,
  subtotal,
  deliveryCharge,
  total,
}: OrderSummaryProps) {
  return (
    <div className="bg-white rounded-xl shadow-card p-6">
      <h3 className="font-heading font-semibold text-lg mb-4">Order Summary</h3>

      {/* Items */}
      <div className="space-y-3 mb-4 max-h-64 overflow-y-auto">
        {items.map((item) => (
          <div
            key={`${item.productId}-${item.variantId}`}
            className="flex gap-3"
          >
            <div className="relative w-14 h-14 flex-shrink-0 rounded-lg overflow-hidden bg-cream-100">
              <Image
                src={item.productImage || "/images/placeholder-product.jpg"}
                alt={item.productName}
                fill
                className="object-cover"
                sizes="56px"
              />
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-maroon text-white text-xs rounded-full flex items-center justify-center">
                {item.quantity}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-charcoal line-clamp-1">
                {item.productName}
              </p>
              <p className="text-xs text-charcoal-500">{item.variantName}</p>
            </div>
            <span className="text-sm font-medium">
              {formatPrice(item.price * item.quantity)}
            </span>
          </div>
        ))}
      </div>

      {/* Totals */}
      <div className="border-t border-charcoal-100 pt-4 space-y-2 text-sm">
        <div className="flex justify-between">
          <span className="text-charcoal-600">Subtotal</span>
          <span>{formatPrice(subtotal)}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-charcoal-600">Delivery</span>
          <span className={deliveryCharge === 0 ? "text-green-600" : ""}>
            {deliveryCharge === 0 ? "FREE" : formatPrice(deliveryCharge)}
          </span>
        </div>
        <div className="flex justify-between text-lg font-semibold pt-2 border-t border-charcoal-100">
          <span>Total</span>
          <span className="text-maroon">{formatPrice(total)}</span>
        </div>
      </div>
    </div>
  );
}
