import Image from "next/image";
import { Container } from "@/components/layout/Container";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { CheckCircle, Heart, Shield, Users } from "lucide-react";

const values = [
  {
    icon: Shield,
    title: "100% Pure & Authentic",
    description:
      "We source only the finest quality puja items directly from trusted suppliers to ensure purity and authenticity.",
  },
  {
    icon: Heart,
    title: "Made with Devotion",
    description:
      "Every product is prepared with utmost care and devotion, keeping the sacred traditions alive.",
  },
  {
    icon: Users,
    title: "Family Business",
    description:
      "Started as a small family business in Salem, we've been serving devotees for over 15 years.",
  },
];

const milestones = [
  { year: "2010", text: "Started as a small retail shop in Salem" },
  { year: "2015", text: "Expanded to wholesale distribution" },
  { year: "2020", text: "Launched online ordering via WhatsApp" },
  { year: "2024", text: "Serving 5000+ happy customers across Tamil Nadu" },
];

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Breadcrumb */}
      <div className="bg-cream border-b border-charcoal-100">
        <Container>
          <Breadcrumb items={[{ label: "About Us" }]} />
        </Container>
      </div>

      {/* Hero Section */}
      <section className="py-12 md:py-16 bg-cream">
        <Container>
          <div className="max-w-3xl mx-auto text-center">
            <span className="text-4xl mb-4 block">🪔</span>
            <h1 className="text-3xl md:text-4xl font-heading font-bold text-charcoal mb-4">
              About GSAAN Products
            </h1>
            <p className="text-lg text-charcoal-600 leading-relaxed">
              Bringing pure and premium puja essentials to your doorstep. We are
              committed to helping you perform your daily prayers with the
              finest quality products.
            </p>
          </div>
        </Container>
      </section>

      {/* Our Story */}
      <section className="py-12 md:py-16">
        <Container>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            <div className="relative aspect-[4/3] rounded-xl overflow-hidden bg-cream-100">
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-8xl">🛕</span>
              </div>
            </div>
            <div>
              <h2 className="text-2xl md:text-3xl font-heading font-bold text-charcoal mb-4">
                Our Story
              </h2>
              <div className="space-y-4 text-charcoal-600">
                <p>
                  GSAAN Products was born from a simple belief: every devotee
                  deserves access to pure, authentic puja items that honor our
                  sacred traditions. Based in Salem, Tamil Nadu, we started as a
                  small family-run shop over 15 years ago.
                </p>
                <p>
                  What began as a passion to serve our local temple community has
                  grown into a trusted name for puja essentials across Tamil Nadu.
                  Today, we're proud to serve thousands of families, temples, and
                  businesses with our carefully curated selection of camphor,
                  agarbatti, sambrani, deepam oil, and more.
                </p>
                <p>
                  Our commitment to quality remains unchanged - we personally
                  verify every product to ensure it meets our high standards
                  before it reaches your pooja room.
                </p>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* Our Values */}
      <section className="py-12 md:py-16 bg-cream">
        <Container>
          <div className="text-center mb-10">
            <h2 className="text-2xl md:text-3xl font-heading font-bold text-charcoal mb-4">
              Our Values
            </h2>
            <p className="text-charcoal-600 max-w-2xl mx-auto">
              These principles guide everything we do at GSAAN Products
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {values.map((value, index) => (
              <div
                key={index}
                className="bg-white rounded-xl p-6 shadow-card text-center"
              >
                <div className="w-14 h-14 mx-auto mb-4 bg-maroon-50 rounded-full flex items-center justify-center">
                  <value.icon className="h-7 w-7 text-maroon" />
                </div>
                <h3 className="font-heading font-semibold text-lg mb-2">
                  {value.title}
                </h3>
                <p className="text-charcoal-600 text-sm">{value.description}</p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* Timeline */}
      <section className="py-12 md:py-16">
        <Container>
          <div className="text-center mb-10">
            <h2 className="text-2xl md:text-3xl font-heading font-bold text-charcoal mb-4">
              Our Journey
            </h2>
          </div>

          <div className="max-w-2xl mx-auto">
            <div className="space-y-6">
              {milestones.map((milestone, index) => (
                <div key={index} className="flex gap-4">
                  <div className="w-20 flex-shrink-0">
                    <span className="font-heading font-bold text-maroon">
                      {milestone.year}
                    </span>
                  </div>
                  <div className="flex-1 pb-6 border-l-2 border-charcoal-100 pl-6 relative">
                    <div className="absolute -left-2 top-0 w-4 h-4 bg-maroon rounded-full" />
                    <p className="text-charcoal-600">{milestone.text}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Container>
      </section>

      {/* Why Choose Us */}
      <section className="py-12 md:py-16 bg-maroon text-white">
        <Container>
          <div className="text-center mb-10">
            <h2 className="text-2xl md:text-3xl font-heading font-bold mb-4">
              Why Choose GSAAN Products?
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              "100% Pure Products",
              "Fast Delivery",
              "WhatsApp Support",
              "Bulk Discounts",
            ].map((item, index) => (
              <div
                key={index}
                className="flex items-center gap-3 bg-white/10 rounded-lg p-4"
              >
                <CheckCircle className="h-5 w-5 text-gold flex-shrink-0" />
                <span>{item}</span>
              </div>
            ))}
          </div>
        </Container>
      </section>
    </div>
  );
}
