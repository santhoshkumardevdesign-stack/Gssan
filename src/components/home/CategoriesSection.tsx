"use client";

import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { Container } from "@/components/layout/Container";

const categories = [
  {
    id: "camphor",
    name: "Camphor",
    nameInTamil: "கற்பூரம்",
    description: "Pure camphor tablets",
    itemCount: 18,
    icon: "🪔",
    gradient: "from-orange-50 to-yellow-50",
    href: "/products?category=camphor",
  },
  {
    id: "agarbatti",
    name: "Agarbatti",
    nameInTamil: "ஊதுபத்தி",
    description: "Premium incense sticks",
    itemCount: 25,
    icon: "🌸",
    gradient: "from-purple-50 to-pink-50",
    href: "/products?category=agarbatti",
  },
  {
    id: "sambrani-dhoop",
    name: "Sambrani",
    nameInTamil: "சாம்பிராணி",
    description: "Traditional dhoop & cups",
    itemCount: 12,
    icon: "💨",
    gradient: "from-amber-50 to-orange-50",
    href: "/products?category=sambrani-dhoop",
  },
  {
    id: "deepam-oil",
    name: "Deepam Oil",
    nameInTamil: "தீபம் எண்ணெய்",
    description: "Lamp oils & wicks",
    itemCount: 8,
    icon: "🕯️",
    gradient: "from-yellow-50 to-amber-50",
    href: "/products?category=deepam-oil",
  },
  {
    id: "pooja-powders",
    name: "Pooja Powders",
    nameInTamil: "பூஜை பொருட்கள்",
    description: "Kumkum, turmeric & more",
    itemCount: 10,
    icon: "🔴",
    gradient: "from-red-50 to-orange-50",
    href: "/products?category=pooja-powders",
  },
  {
    id: "accessories",
    name: "Accessories",
    nameInTamil: "பாத்திரங்கள்",
    description: "Puja vessels & items",
    itemCount: 15,
    icon: "🔔",
    gradient: "from-indigo-50 to-blue-50",
    href: "/products?category=accessories",
  },
];

export function CategoriesSection() {
  return (
    <section className="section bg-white">
      <Container>
        {/* Section Header */}
        <div className="text-center mb-10 md:mb-14">
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-heading font-bold text-charcoal mb-4">
            Explore Our Sacred Collection
          </h2>
          <p className="text-charcoal-600 max-w-2xl mx-auto">
            Handpicked premium products for your daily pooja and special occasions
          </p>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 md:gap-6">
          {categories.map((category) => (
            <Link
              key={category.id}
              href={category.href}
              className="group"
            >
              <div className={`relative bg-gradient-to-br ${category.gradient} rounded-2xl p-6 text-center transition-all duration-300 hover:shadow-lg hover:-translate-y-1 border border-transparent hover:border-gold/30`}>
                {/* Icon */}
                <div className="w-20 h-20 md:w-24 md:h-24 mx-auto mb-4 bg-white rounded-full flex items-center justify-center shadow-sm group-hover:shadow-md transition-shadow">
                  <span className="text-4xl md:text-5xl">{category.icon}</span>
                </div>

                {/* Name */}
                <h3 className="font-semibold text-charcoal group-hover:text-maroon transition-colors">
                  {category.name}
                </h3>

                {/* Tamil Name */}
                <p className="text-xs text-charcoal-500 font-tamil mt-1">
                  {category.nameInTamil}
                </p>

                {/* Item Count */}
                <p className="text-xs text-charcoal-400 mt-2">
                  {category.itemCount} items
                </p>

                {/* Hover Arrow */}
                <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                  <ArrowRight className="h-4 w-4 text-maroon" />
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* View All Link */}
        <div className="text-center mt-10">
          <Link
            href="/products"
            className="inline-flex items-center gap-2 text-maroon font-medium hover:text-maroon-700 transition-colors"
          >
            View All Products
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </Container>
    </section>
  );
}
