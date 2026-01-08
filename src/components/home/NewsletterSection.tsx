"use client";

import { useState } from "react";
import { Send, CheckCircle } from "lucide-react";
import { Container } from "@/components/layout/Container";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";

export function NewsletterSection() {
  const [phone, setPhone] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // Validate phone
    const cleanedPhone = phone.replace(/\D/g, "");
    if (!/^[6-9]\d{9}$/.test(cleanedPhone)) {
      setError("Please enter a valid 10-digit mobile number");
      return;
    }

    setIsSubmitting(true);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));

    setIsSubmitting(false);
    setIsSubscribed(true);
    setPhone("");
  };

  return (
    <section className="py-16 bg-gradient-to-br from-maroon to-maroon-800 text-white relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}
        />
      </div>

      <Container className="relative">
        <div className="max-w-2xl mx-auto text-center">
          {/* Icon */}
          <div className="w-16 h-16 mx-auto mb-6 bg-white/10 rounded-full flex items-center justify-center">
            <span className="text-3xl">🪔</span>
          </div>

          {/* Heading */}
          <h2 className="text-2xl md:text-3xl font-heading font-bold mb-4">
            Get Exclusive Offers & Festival Discounts
          </h2>

          {/* Description */}
          <p className="text-white/80 mb-8">
            Join 5,000+ customers who receive special prices and early access to
            new products via WhatsApp
          </p>

          {/* Form */}
          {isSubscribed ? (
            <div className="bg-white/10 rounded-xl p-6 animate-scale-in">
              <CheckCircle className="h-12 w-12 text-green-400 mx-auto mb-4" />
              <p className="font-semibold text-lg mb-2">Thank you!</p>
              <p className="text-white/80 text-sm">
                We'll send you exclusive offers on WhatsApp
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
              <div className="flex-1">
                <Input
                  type="tel"
                  placeholder="Enter WhatsApp Number"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="bg-white text-charcoal placeholder:text-charcoal-400 border-0"
                  error={error}
                />
              </div>
              <Button
                type="submit"
                variant="secondary"
                isLoading={isSubmitting}
                rightIcon={<Send className="h-4 w-4" />}
                className="sm:w-auto"
              >
                Subscribe
              </Button>
            </form>
          )}

          {/* Features */}
          <div className="flex flex-wrap justify-center gap-6 mt-8 text-sm text-white/80">
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-gold" />
              <span>Festival offers</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-gold" />
              <span>New arrivals</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-gold" />
              <span>Bulk discounts</span>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
