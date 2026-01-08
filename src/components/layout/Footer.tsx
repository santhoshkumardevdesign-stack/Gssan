"use client";

import Link from "next/link";
import {
  Phone,
  Mail,
  MapPin,
  Facebook,
  Instagram,
  Youtube,
} from "lucide-react";
import { Container } from "./Container";

const footerLinks = {
  quickLinks: [
    { name: "Home", href: "/" },
    { name: "Products", href: "/products" },
    { name: "About Us", href: "/about" },
    { name: "Contact", href: "/contact" },
    { name: "Track Order", href: "/track-order" },
  ],
  categories: [
    { name: "Camphor", href: "/products?category=camphor" },
    { name: "Agarbatti", href: "/products?category=agarbatti" },
    { name: "Sambrani & Dhoop", href: "/products?category=sambrani-dhoop" },
    { name: "Deepam Oil", href: "/products?category=deepam-oil" },
    { name: "Pooja Powders", href: "/products?category=pooja-powders" },
  ],
  legal: [
    { name: "Privacy Policy", href: "/privacy" },
    { name: "Terms of Service", href: "/terms" },
    { name: "Shipping Policy", href: "/shipping" },
    { name: "Refund Policy", href: "/refund" },
  ],
};

const socialLinks = [
  { name: "Facebook", href: "https://facebook.com", icon: Facebook },
  { name: "Instagram", href: "https://instagram.com", icon: Instagram },
  { name: "YouTube", href: "https://youtube.com", icon: Youtube },
];

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-charcoal text-white">
      {/* Main Footer */}
      <Container className="py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {/* Company Info */}
          <div className="lg:col-span-1">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <div className="w-12 h-12 bg-maroon rounded-full flex items-center justify-center">
                <span className="text-white font-heading font-bold text-xl">
                  G
                </span>
              </div>
              <div>
                <h2 className="font-heading font-bold text-xl">GSAAN</h2>
                <p className="text-xs text-charcoal-300 -mt-1">Products</p>
              </div>
            </Link>

            <p className="text-charcoal-300 text-sm leading-relaxed mb-6">
              Premium puja essentials since 1995. Trusted by temples and homes
              across Tamil Nadu for 100% pure camphor, agarbatti, and sacred
              products.
            </p>

            {/* Social Links */}
            <div className="flex items-center gap-3">
              {socialLinks.map((social) => (
                <a
                  key={social.name}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 bg-charcoal-700 rounded-full flex items-center justify-center hover:bg-maroon transition-colors"
                  aria-label={social.name}
                >
                  <social.icon className="h-5 w-5" />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold text-lg mb-4">Quick Links</h3>
            <ul className="space-y-2">
              {footerLinks.quickLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-charcoal-300 hover:text-white transition-colors text-sm"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h3 className="font-semibold text-lg mb-4">Categories</h3>
            <ul className="space-y-2">
              {footerLinks.categories.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-charcoal-300 hover:text-white transition-colors text-sm"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="font-semibold text-lg mb-4">Contact Us</h3>
            <ul className="space-y-4">
              <li>
                <a
                  href="tel:+918300051198"
                  className="flex items-center gap-3 text-charcoal-300 hover:text-white transition-colors text-sm"
                >
                  <Phone className="h-5 w-5 text-saffron flex-shrink-0" />
                  <span>83000 51198</span>
                </a>
              </li>
              <li>
                <a
                  href="mailto:gsaanproducts@gmail.com"
                  className="flex items-center gap-3 text-charcoal-300 hover:text-white transition-colors text-sm"
                >
                  <Mail className="h-5 w-5 text-saffron flex-shrink-0" />
                  <span>gsaanproducts@gmail.com</span>
                </a>
              </li>
              <li className="flex items-start gap-3 text-charcoal-300 text-sm">
                <MapPin className="h-5 w-5 text-saffron flex-shrink-0 mt-0.5" />
                <span>
                  No.94 Z, Peramanur,
                  <br />
                  Salem - 636007,
                  <br />
                  Tamil Nadu, India
                </span>
              </li>
            </ul>

            {/* WhatsApp Button */}
            <a
              href="https://wa.me/918300051198"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-6 inline-flex items-center gap-2 px-4 py-2 bg-[#25D366] text-white text-sm font-medium rounded-lg hover:bg-[#20bd5a] transition-colors"
            >
              <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
              </svg>
              Chat with us
            </a>
          </div>
        </div>
      </Container>

      {/* Bottom Bar */}
      <div className="border-t border-charcoal-700">
        <Container className="py-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-charcoal-400 text-sm text-center md:text-left">
              © {currentYear} GSAAN Products. All rights reserved.
            </p>

            <ul className="flex items-center gap-4 md:gap-6">
              {footerLinks.legal.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-charcoal-400 hover:text-white transition-colors text-sm"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </Container>
      </div>
    </footer>
  );
}
