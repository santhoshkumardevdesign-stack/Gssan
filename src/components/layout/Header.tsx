"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Menu,
  X,
  ShoppingCart,
  Search,
  Phone,
  ChevronDown,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useCart } from "@/context/CartContext";
import { Container } from "./Container";
import { MobileNav } from "./MobileNav";

const navigation = [
  { name: "Home", href: "/" },
  {
    name: "Products",
    href: "/products",
    children: [
      { name: "All Products", href: "/products" },
      { name: "Camphor", href: "/products?category=camphor" },
      { name: "Agarbatti", href: "/products?category=agarbatti" },
      { name: "Sambrani & Dhoop", href: "/products?category=sambrani-dhoop" },
      { name: "Deepam Oil", href: "/products?category=deepam-oil" },
      { name: "Pooja Powders", href: "/products?category=pooja-powders" },
      { name: "Accessories", href: "/products?category=accessories" },
    ],
  },
  { name: "About Us", href: "/about" },
  { name: "Contact", href: "/contact" },
];

export function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const pathname = usePathname();
  const { itemCount } = useCart();

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);

  return (
    <>
      {/* Top Bar */}
      <div className="bg-maroon text-white py-2 text-sm hidden md:block">
        <Container>
          <div className="flex items-center justify-between">
            <p>Free delivery on orders above ₹500</p>
            <div className="flex items-center gap-4">
              <a
                href="tel:+918300051198"
                className="flex items-center gap-1 hover:text-gold transition-colors"
              >
                <Phone className="h-4 w-4" />
                <span>83000 51198</span>
              </a>
            </div>
          </div>
        </Container>
      </div>

      {/* Main Header */}
      <header
        className={cn(
          "sticky top-0 z-40 bg-white transition-shadow duration-300",
          isScrolled && "shadow-md"
        )}
      >
        <Container>
          <div className="flex items-center justify-between h-16 md:h-20">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2">
              <div className="w-10 h-10 md:w-12 md:h-12 bg-maroon rounded-full flex items-center justify-center">
                <span className="text-white font-heading font-bold text-lg md:text-xl">
                  G
                </span>
              </div>
              <div className="hidden xs:block">
                <h1 className="font-heading font-bold text-lg md:text-xl text-maroon">
                  GSAAN
                </h1>
                <p className="text-xs text-charcoal-500 -mt-1">Products</p>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center gap-1">
              {navigation.map((item) => (
                <div
                  key={item.name}
                  className="relative"
                  onMouseEnter={() =>
                    item.children && setActiveDropdown(item.name)
                  }
                  onMouseLeave={() => setActiveDropdown(null)}
                >
                  <Link
                    href={item.href}
                    className={cn(
                      "flex items-center gap-1 px-4 py-2 text-sm font-medium rounded-lg transition-colors",
                      pathname === item.href
                        ? "text-maroon bg-maroon/5"
                        : "text-charcoal hover:text-maroon hover:bg-maroon/5"
                    )}
                  >
                    {item.name}
                    {item.children && (
                      <ChevronDown className="h-4 w-4" />
                    )}
                  </Link>

                  {/* Dropdown */}
                  {item.children && activeDropdown === item.name && (
                    <div className="absolute top-full left-0 pt-2 w-56">
                      <div className="bg-white rounded-lg shadow-lg border border-charcoal-100 py-2">
                        {item.children.map((child) => (
                          <Link
                            key={child.name}
                            href={child.href}
                            className="block px-4 py-2 text-sm text-charcoal hover:text-maroon hover:bg-maroon/5 transition-colors"
                          >
                            {child.name}
                          </Link>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </nav>

            {/* Actions */}
            <div className="flex items-center gap-2 md:gap-4">
              {/* Search */}
              <button
                className="p-2 text-charcoal hover:text-maroon transition-colors rounded-lg hover:bg-charcoal-50"
                aria-label="Search"
              >
                <Search className="h-5 w-5" />
              </button>

              {/* Cart */}
              <Link
                href="/cart"
                className="relative p-2 text-charcoal hover:text-maroon transition-colors rounded-lg hover:bg-charcoal-50"
                aria-label="Shopping cart"
              >
                <ShoppingCart className="h-5 w-5" />
                {itemCount > 0 && (
                  <span className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center bg-saffron text-white text-xs font-medium rounded-full">
                    {itemCount > 99 ? "99+" : itemCount}
                  </span>
                )}
              </Link>

              {/* Mobile Menu Toggle */}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="lg:hidden p-2 text-charcoal hover:text-maroon transition-colors rounded-lg hover:bg-charcoal-50"
                aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
              >
                {isMobileMenuOpen ? (
                  <X className="h-6 w-6" />
                ) : (
                  <Menu className="h-6 w-6" />
                )}
              </button>
            </div>
          </div>
        </Container>
      </header>

      {/* Mobile Navigation */}
      <MobileNav
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
        navigation={navigation}
      />
    </>
  );
}
