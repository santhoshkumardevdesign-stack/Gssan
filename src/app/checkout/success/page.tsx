"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { CheckCircle, ShoppingBag, Phone, ArrowRight } from "lucide-react";
import { Container } from "@/components/layout/Container";
import { Button } from "@/components/ui/Button";

function SuccessContent() {
  const searchParams = useSearchParams();
  const orderNumber = searchParams.get("orderNumber");

  return (
    <div className="min-h-screen bg-cream flex items-center justify-center py-12">
      <Container>
        <div className="max-w-lg mx-auto bg-white rounded-xl shadow-card p-8 text-center">
          {/* Success Icon */}
          <div className="w-20 h-20 mx-auto mb-6 bg-green-100 rounded-full flex items-center justify-center">
            <CheckCircle className="h-10 w-10 text-green-600" />
          </div>

          {/* Heading */}
          <h1 className="text-2xl font-heading font-bold text-charcoal mb-2">
            Order Sent Successfully!
          </h1>

          {orderNumber && (
            <p className="text-charcoal-500 mb-6">
              Order Number:{" "}
              <span className="font-semibold text-charcoal">{orderNumber}</span>
            </p>
          )}

          {/* Message */}
          <div className="bg-cream rounded-lg p-4 mb-6 text-left">
            <h3 className="font-semibold text-charcoal mb-2">What's Next?</h3>
            <ul className="space-y-2 text-sm text-charcoal-600">
              <li className="flex items-start gap-2">
                <span className="w-5 h-5 bg-maroon-100 text-maroon rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 text-xs">
                  1
                </span>
                <span>
                  Your order details have been sent to our WhatsApp. If WhatsApp
                  didn't open, please message us directly.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="w-5 h-5 bg-maroon-100 text-maroon rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 text-xs">
                  2
                </span>
                <span>
                  We'll confirm your order and delivery details via WhatsApp
                  within 30 minutes.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="w-5 h-5 bg-maroon-100 text-maroon rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 text-xs">
                  3
                </span>
                <span>
                  Pay cash when your order is delivered to your doorstep.
                </span>
              </li>
            </ul>
          </div>

          {/* WhatsApp Contact */}
          <div className="flex items-center justify-center gap-3 mb-6 p-3 bg-green-50 rounded-lg">
            <Phone className="h-5 w-5 text-green-600" />
            <span className="text-charcoal-600">
              WhatsApp:{" "}
              <a
                href="https://wa.me/918300051198"
                className="text-green-600 font-semibold hover:underline"
                target="_blank"
                rel="noopener noreferrer"
              >
                +91 83000 51198
              </a>
            </span>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3">
            <Link href="/products" className="flex-1">
              <Button
                variant="outline"
                className="w-full"
                leftIcon={<ShoppingBag className="h-5 w-5" />}
              >
                Continue Shopping
              </Button>
            </Link>
            <Link href="/" className="flex-1">
              <Button
                variant="primary"
                className="w-full"
                rightIcon={<ArrowRight className="h-5 w-5" />}
              >
                Go to Home
              </Button>
            </Link>
          </div>
        </div>
      </Container>
    </div>
  );
}

function LoadingFallback() {
  return (
    <div className="min-h-screen bg-cream flex items-center justify-center py-12">
      <Container>
        <div className="max-w-lg mx-auto bg-white rounded-xl shadow-card p-8 text-center">
          <div className="animate-pulse">
            <div className="w-20 h-20 mx-auto mb-6 bg-gray-200 rounded-full"></div>
            <div className="h-8 bg-gray-200 rounded w-3/4 mx-auto mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2 mx-auto"></div>
          </div>
        </div>
      </Container>
    </div>
  );
}

export default function CheckoutSuccessPage() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <SuccessContent />
    </Suspense>
  );
}
