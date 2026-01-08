"use client";

import Link from "next/link";
import { ShoppingBag, ArrowLeft } from "lucide-react";
import { Container } from "@/components/layout/Container";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { Button } from "@/components/ui/Button";
import { CartItem, CartSummary } from "@/components/cart";
import { useCart } from "@/context/CartContext";

export default function CartPage() {
  const { items, clearCart, itemCount } = useCart();

  return (
    <div className="min-h-screen bg-cream">
      {/* Breadcrumb */}
      <div className="bg-white border-b border-charcoal-100">
        <Container>
          <Breadcrumb items={[{ label: "Shopping Cart" }]} />
        </Container>
      </div>

      {/* Page Header */}
      <div className="bg-white border-b border-charcoal-100">
        <Container>
          <div className="py-6 md:py-8">
            <h1 className="text-2xl md:text-3xl font-heading font-bold text-charcoal">
              Shopping Cart
            </h1>
            {itemCount > 0 && (
              <p className="text-charcoal-500 mt-1">
                {itemCount} item{itemCount !== 1 ? "s" : ""} in your cart
              </p>
            )}
          </div>
        </Container>
      </div>

      {/* Main Content */}
      <Container className="py-6 md:py-8">
        {items.length === 0 ? (
          // Empty Cart State
          <div className="text-center py-12 bg-white rounded-xl shadow-card">
            <div className="w-24 h-24 mx-auto mb-6 bg-charcoal-50 rounded-full flex items-center justify-center">
              <ShoppingBag className="h-10 w-10 text-charcoal-300" />
            </div>
            <h2 className="text-xl font-heading font-semibold text-charcoal mb-2">
              Your cart is empty
            </h2>
            <p className="text-charcoal-500 mb-6 max-w-md mx-auto">
              Looks like you haven't added any items to your cart yet. Start
              shopping our premium puja essentials!
            </p>
            <Link href="/products">
              <Button
                variant="primary"
                leftIcon={<ShoppingBag className="h-5 w-5" />}
              >
                Start Shopping
              </Button>
            </Link>
          </div>
        ) : (
          // Cart with Items
          <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
            {/* Cart Items */}
            <div className="flex-1">
              <div className="bg-white rounded-xl shadow-card p-4 md:p-6">
                {/* Header */}
                <div className="flex items-center justify-between mb-4 pb-4 border-b border-charcoal-100">
                  <h2 className="font-heading font-semibold">Cart Items</h2>
                  <button
                    onClick={clearCart}
                    className="text-sm text-charcoal-500 hover:text-red-500 transition-colors"
                  >
                    Clear All
                  </button>
                </div>

                {/* Items List */}
                <div>
                  {items.map((item) => (
                    <CartItem
                      key={`${item.productId}-${item.variantId}`}
                      item={item}
                    />
                  ))}
                </div>

                {/* Continue Shopping - Mobile */}
                <Link
                  href="/products"
                  className="flex items-center gap-2 mt-4 text-sm text-saffron hover:text-saffron-600 transition-colors md:hidden"
                >
                  <ArrowLeft className="h-4 w-4" />
                  Continue Shopping
                </Link>
              </div>
            </div>

            {/* Order Summary */}
            <div className="lg:w-80 xl:w-96">
              <div className="sticky top-24">
                <CartSummary />
              </div>
            </div>
          </div>
        )}
      </Container>
    </div>
  );
}
