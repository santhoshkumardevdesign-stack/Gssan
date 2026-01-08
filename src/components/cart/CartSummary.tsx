"use client";

import Link from "next/link";
import { ShoppingBag, ArrowRight, Truck } from "lucide-react";
import { formatPrice } from "@/lib/utils/formatters";
import { Button } from "@/components/ui/Button";
import { useCart } from "@/context/CartContext";

const FREE_DELIVERY_THRESHOLD = 499;
const DELIVERY_CHARGE = 49;

export function CartSummary() {
  const { subtotal, itemCount } = useCart();

  const deliveryCharge = subtotal >= FREE_DELIVERY_THRESHOLD ? 0 : DELIVERY_CHARGE;
  const total = subtotal + deliveryCharge;
  const amountForFreeDelivery = FREE_DELIVERY_THRESHOLD - subtotal;

  return (
    <div className="bg-white rounded-xl shadow-card p-6">
      <h3 className="font-heading font-semibold text-lg mb-4">Order Summary</h3>

      {/* Free Delivery Progress */}
      {subtotal > 0 && amountForFreeDelivery > 0 && (
        <div className="mb-4 p-3 bg-saffron-50 rounded-lg">
          <div className="flex items-center gap-2 text-sm text-saffron-600 mb-2">
            <Truck className="h-4 w-4" />
            <span>
              Add {formatPrice(amountForFreeDelivery)} more for FREE Delivery!
            </span>
          </div>
          <div className="h-2 bg-saffron-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-saffron transition-all duration-300"
              style={{
                width: `${Math.min(100, (subtotal / FREE_DELIVERY_THRESHOLD) * 100)}%`,
              }}
            />
          </div>
        </div>
      )}

      {subtotal >= FREE_DELIVERY_THRESHOLD && (
        <div className="mb-4 p-3 bg-green-50 rounded-lg flex items-center gap-2 text-sm text-green-600">
          <Truck className="h-4 w-4" />
          <span>You've unlocked FREE Delivery!</span>
        </div>
      )}

      {/* Summary Lines */}
      <div className="space-y-3 text-sm">
        <div className="flex justify-between">
          <span className="text-charcoal-600">
            Subtotal ({itemCount} item{itemCount !== 1 ? "s" : ""})
          </span>
          <span className="font-medium">{formatPrice(subtotal)}</span>
        </div>

        <div className="flex justify-between">
          <span className="text-charcoal-600">Delivery</span>
          <span className="font-medium">
            {deliveryCharge === 0 ? (
              <span className="text-green-600">FREE</span>
            ) : (
              formatPrice(deliveryCharge)
            )}
          </span>
        </div>

        <div className="pt-3 border-t border-charcoal-100">
          <div className="flex justify-between text-lg font-semibold">
            <span>Total</span>
            <span className="text-maroon">{formatPrice(total)}</span>
          </div>
          <p className="text-xs text-charcoal-400 mt-1">
            (Inclusive of all taxes)
          </p>
        </div>
      </div>

      {/* Checkout Button */}
      <Link href="/checkout" className="block mt-6">
        <Button
          variant="primary"
          size="lg"
          className="w-full"
          rightIcon={<ArrowRight className="h-5 w-5" />}
          disabled={itemCount === 0}
        >
          Proceed to Checkout
        </Button>
      </Link>

      {/* Continue Shopping */}
      <Link
        href="/products"
        className="flex items-center justify-center gap-2 mt-4 text-sm text-charcoal-600 hover:text-saffron transition-colors"
      >
        <ShoppingBag className="h-4 w-4" />
        Continue Shopping
      </Link>
    </div>
  );
}
