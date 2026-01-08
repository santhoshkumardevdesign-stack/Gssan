"use client";

import Link from "next/link";
import Image from "next/image";
import { ArrowRight, CheckCircle } from "lucide-react";
import { Container } from "@/components/layout/Container";
import { Button } from "@/components/ui/Button";

const features = [
  "100% Pure",
  "Temple Approved",
  "Fast Delivery",
];

export function HeroSection() {
  return (
    <section className="relative bg-gradient-to-br from-cream-100 to-white overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%238B0000' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }} />
      </div>

      <Container className="relative py-12 md:py-20 lg:py-28">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          {/* Content */}
          <div className="text-center lg:text-left order-2 lg:order-1">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-gold/20 text-maroon rounded-full text-sm font-medium mb-6">
              <span className="w-2 h-2 bg-gold rounded-full animate-pulse" />
              Trusted Since 1995
            </div>

            {/* Heading */}
            <h1 className="text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-heading font-bold text-charcoal mb-6 leading-tight">
              Pure Devotion,{" "}
              <span className="text-maroon">Divine Quality</span>
            </h1>

            {/* Subheading */}
            <p className="text-lg md:text-xl text-charcoal-600 mb-8 max-w-xl mx-auto lg:mx-0">
              Premium puja essentials for your sacred rituals. Serving temples
              and homes with 100% pure camphor, agarbatti & sacred products.
            </p>

            {/* Features */}
            <div className="flex flex-wrap justify-center lg:justify-start gap-4 mb-8">
              {features.map((feature) => (
                <div
                  key={feature}
                  className="flex items-center gap-2 text-sm text-charcoal-600"
                >
                  <CheckCircle className="h-5 w-5 text-success" />
                  <span>{feature}</span>
                </div>
              ))}
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Link href="/products">
                <Button
                  variant="primary"
                  size="lg"
                  rightIcon={<ArrowRight className="h-5 w-5" />}
                >
                  Shop Now
                </Button>
              </Link>
              <Link href="/about">
                <Button variant="outline" size="lg">
                  Learn More
                </Button>
              </Link>
            </div>
          </div>

          {/* Image */}
          <div className="relative order-1 lg:order-2">
            <div className="relative aspect-square max-w-md mx-auto lg:max-w-none">
              {/* Decorative elements */}
              <div className="absolute -top-4 -left-4 w-24 h-24 bg-saffron/20 rounded-full blur-2xl" />
              <div className="absolute -bottom-4 -right-4 w-32 h-32 bg-gold/20 rounded-full blur-2xl" />

              {/* Main Image Container */}
              <div className="relative bg-gradient-to-br from-maroon/5 to-saffron/5 rounded-3xl p-8 shadow-soft">
                {/* Placeholder for hero image - replace with actual product image */}
                <div className="relative aspect-square rounded-2xl bg-gradient-to-br from-cream-100 to-cream-200 flex items-center justify-center overflow-hidden">
                  {/* Decorative Om symbol */}
                  <div className="text-maroon/10 text-[200px] font-heading select-none">
                    ॐ
                  </div>

                  {/* Floating product icons */}
                  <div className="absolute top-4 left-4 w-16 h-16 bg-white rounded-xl shadow-md flex items-center justify-center animate-bounce" style={{ animationDelay: "0s", animationDuration: "3s" }}>
                    <span className="text-3xl">🪔</span>
                  </div>
                  <div className="absolute bottom-4 right-4 w-16 h-16 bg-white rounded-xl shadow-md flex items-center justify-center animate-bounce" style={{ animationDelay: "0.5s", animationDuration: "3s" }}>
                    <span className="text-3xl">🕯️</span>
                  </div>
                  <div className="absolute top-1/2 right-4 w-14 h-14 bg-white rounded-xl shadow-md flex items-center justify-center animate-bounce" style={{ animationDelay: "1s", animationDuration: "3s" }}>
                    <span className="text-2xl">🌸</span>
                  </div>
                </div>

                {/* Stats Badge */}
                <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 bg-white rounded-2xl shadow-lg px-6 py-3 flex items-center gap-4">
                  <div className="text-center">
                    <p className="text-2xl font-bold text-maroon">25+</p>
                    <p className="text-xs text-charcoal-500">Years</p>
                  </div>
                  <div className="w-px h-10 bg-charcoal-200" />
                  <div className="text-center">
                    <p className="text-2xl font-bold text-maroon">500+</p>
                    <p className="text-xs text-charcoal-500">Temples</p>
                  </div>
                  <div className="w-px h-10 bg-charcoal-200" />
                  <div className="text-center">
                    <p className="text-2xl font-bold text-maroon">10K+</p>
                    <p className="text-xs text-charcoal-500">Customers</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Container>

      {/* Trust Indicators */}
      <div className="bg-maroon text-white py-6">
        <Container>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div>
              <p className="text-2xl md:text-3xl font-bold text-gold">25+</p>
              <p className="text-sm text-white/80">Years Legacy</p>
            </div>
            <div>
              <p className="text-2xl md:text-3xl font-bold text-gold">FREE</p>
              <p className="text-sm text-white/80">Delivery ₹500+</p>
            </div>
            <div>
              <p className="text-2xl md:text-3xl font-bold text-gold">100%</p>
              <p className="text-sm text-white/80">Pure Quality</p>
            </div>
            <div>
              <p className="text-2xl md:text-3xl font-bold text-gold">24/7</p>
              <p className="text-sm text-white/80">WhatsApp Support</p>
            </div>
          </div>
        </Container>
      </div>
    </section>
  );
}
