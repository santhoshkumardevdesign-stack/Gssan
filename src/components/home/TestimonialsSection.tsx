"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight, Star, Quote } from "lucide-react";
import { Container } from "@/components/layout/Container";
import { cn } from "@/lib/utils";

const testimonials = [
  {
    id: 1,
    name: "Sri Murugan Temple",
    role: "Temple Administrator",
    location: "Salem",
    content:
      "Best quality camphor I've ever used. Burns completely with divine fragrance. Our temple has been ordering for 5 years and the quality has been consistently excellent.",
    rating: 5,
    image: null,
  },
  {
    id: 2,
    name: "Lakshmi Devi",
    role: "Homemaker",
    location: "Coimbatore",
    content:
      "The agarbatti collection is wonderful. Natural fragrances that create a peaceful atmosphere for our daily pooja. Delivery is always on time.",
    rating: 5,
    image: null,
  },
  {
    id: 3,
    name: "Anand Stores",
    role: "Retailer",
    location: "Erode",
    content:
      "We've been stocking GSAAN products for 3 years. Customers love the quality and we appreciate the wholesale pricing. Highly recommended for retailers.",
    rating: 5,
    image: null,
  },
  {
    id: 4,
    name: "Sri Krishna Mandir",
    role: "Temple Trust",
    location: "Namakkal",
    content:
      "The sambrani and dhoop cups are perfect for our temple ceremonies. Pure fragrance and long-lasting. The temple committee is very satisfied.",
    rating: 5,
    image: null,
  },
];

export function TestimonialsSection() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  // Auto-play carousel
  useEffect(() => {
    if (!isAutoPlaying) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % testimonials.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [isAutoPlaying]);

  const goToPrevious = () => {
    setIsAutoPlaying(false);
    setCurrentIndex(
      (prev) => (prev - 1 + testimonials.length) % testimonials.length
    );
  };

  const goToNext = () => {
    setIsAutoPlaying(false);
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
  };

  const goToSlide = (index: number) => {
    setIsAutoPlaying(false);
    setCurrentIndex(index);
  };

  return (
    <section className="section bg-cream-100">
      <Container>
        {/* Section Header */}
        <div className="text-center mb-10 md:mb-14">
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-heading font-bold text-charcoal mb-4">
            What Our Customers Say
          </h2>
          <p className="text-charcoal-600 max-w-2xl mx-auto">
            Trusted by temples, homes, and retailers across Tamil Nadu
          </p>
        </div>

        {/* Testimonial Carousel */}
        <div className="relative max-w-4xl mx-auto">
          {/* Navigation Buttons */}
          <button
            onClick={goToPrevious}
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 md:-translate-x-12 z-10 w-10 h-10 bg-white rounded-full shadow-md flex items-center justify-center text-charcoal hover:text-maroon hover:shadow-lg transition-all"
            aria-label="Previous testimonial"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>

          <button
            onClick={goToNext}
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 md:translate-x-12 z-10 w-10 h-10 bg-white rounded-full shadow-md flex items-center justify-center text-charcoal hover:text-maroon hover:shadow-lg transition-all"
            aria-label="Next testimonial"
          >
            <ChevronRight className="h-5 w-5" />
          </button>

          {/* Testimonial Card */}
          <div className="bg-white rounded-2xl shadow-soft p-6 md:p-10 relative overflow-hidden">
            {/* Quote Icon */}
            <div className="absolute top-6 right-6 text-maroon/10">
              <Quote className="h-16 w-16 md:h-24 md:w-24" />
            </div>

            <div className="relative">
              {testimonials.map((testimonial, index) => (
                <div
                  key={testimonial.id}
                  className={cn(
                    "transition-all duration-500",
                    index === currentIndex
                      ? "opacity-100"
                      : "opacity-0 absolute inset-0 pointer-events-none"
                  )}
                >
                  {/* Rating */}
                  <div className="flex gap-1 mb-4">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        className={cn(
                          "h-5 w-5",
                          i < testimonial.rating
                            ? "fill-gold text-gold"
                            : "text-charcoal-200"
                        )}
                      />
                    ))}
                  </div>

                  {/* Content */}
                  <blockquote className="text-lg md:text-xl text-charcoal leading-relaxed mb-6">
                    "{testimonial.content}"
                  </blockquote>

                  {/* Author */}
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 bg-maroon/10 rounded-full flex items-center justify-center text-maroon font-semibold text-xl">
                      {testimonial.name.charAt(0)}
                    </div>
                    <div>
                      <p className="font-semibold text-charcoal">
                        {testimonial.name}
                      </p>
                      <p className="text-sm text-charcoal-500">
                        {testimonial.role} • {testimonial.location}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Dots Navigation */}
          <div className="flex justify-center gap-2 mt-6">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={cn(
                  "w-2 h-2 rounded-full transition-all",
                  index === currentIndex
                    ? "w-8 bg-maroon"
                    : "bg-charcoal-300 hover:bg-charcoal-400"
                )}
                aria-label={`Go to testimonial ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
}
