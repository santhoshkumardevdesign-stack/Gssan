"use client";

import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Award, Truck, Shield, HeartHandshake } from "lucide-react";
import { Container } from "@/components/layout/Container";
import { Button } from "@/components/ui/Button";

const features = [
  {
    icon: Shield,
    title: "100% Pure Ingredients",
    description:
      "Our camphor is lab-tested and burns completely, leaving no residue. Only the purest ingredients for your sacred rituals.",
  },
  {
    icon: Award,
    title: "Temple Approved Quality",
    description:
      "Trusted by 500+ temples across Tamil Nadu. Our products meet the highest standards of purity and quality.",
  },
  {
    icon: Truck,
    title: "Direct from Manufacturer",
    description:
      "No middlemen means best wholesale prices. Fresh products directly from our facility to your doorstep.",
  },
  {
    icon: HeartHandshake,
    title: "25+ Years of Trust",
    description:
      "Serving devotees since 1995. Three generations of expertise in crafting premium puja essentials.",
  },
];

export function WhyChooseUsSection() {
  return (
    <section className="section bg-white">
      <Container>
        <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-center">
          {/* Image Side */}
          <div className="relative order-2 lg:order-1">
            <div className="relative aspect-[4/3] rounded-2xl overflow-hidden bg-gradient-to-br from-maroon/5 to-saffron/5">
              {/* Placeholder - replace with actual image */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <div className="text-8xl mb-4">🛕</div>
                  <p className="text-charcoal-400 text-sm">Temple Image</p>
                </div>
              </div>

              {/* Decorative Elements */}
              <div className="absolute top-4 right-4 bg-white rounded-xl shadow-lg p-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gold/20 rounded-full flex items-center justify-center">
                    <Award className="h-6 w-6 text-gold" />
                  </div>
                  <div>
                    <p className="font-semibold text-charcoal">500+</p>
                    <p className="text-xs text-charcoal-500">Temples Trust Us</p>
                  </div>
                </div>
              </div>

              <div className="absolute bottom-4 left-4 bg-white rounded-xl shadow-lg p-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-maroon/10 rounded-full flex items-center justify-center">
                    <span className="text-2xl">🪔</span>
                  </div>
                  <div>
                    <p className="font-semibold text-charcoal">Since 1995</p>
                    <p className="text-xs text-charcoal-500">25+ Years Legacy</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Content Side */}
          <div className="order-1 lg:order-2">
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-heading font-bold text-charcoal mb-6">
              The GSAAN Promise
            </h2>
            <p className="text-charcoal-600 mb-8">
              Why thousands of temples and homes trust us for their sacred needs
            </p>

            {/* Features List */}
            <div className="space-y-6">
              {features.map((feature, index) => (
                <div key={index} className="flex gap-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-maroon/10 rounded-xl flex items-center justify-center">
                    <feature.icon className="h-6 w-6 text-maroon" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-charcoal mb-1">
                      {feature.title}
                    </h3>
                    <p className="text-sm text-charcoal-600">
                      {feature.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* CTA */}
            <div className="mt-8">
              <Link href="/about">
                <Button variant="outline" rightIcon={<ArrowRight className="h-4 w-4" />}>
                  Know Our Story
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
