"use client";

import { useState, useMemo, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { Filter } from "lucide-react";
import { Container } from "@/components/layout/Container";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { Button } from "@/components/ui/Button";
import {
  ProductGrid,
  ProductFilters,
  MobileFilters,
  SortDropdown,
  SortOption,
} from "@/components/products";
import { ProductCategory } from "@/types";
import { sampleProducts, getCategoryCounts } from "@/data/sampleProducts";
import { Timestamp } from "firebase/firestore";

const toDate = (value: Timestamp | Date): Date => {
  if (value instanceof Timestamp) return value.toDate();
  return value;
};

const categoryNames: Record<ProductCategory, string> = {
  camphor: "Camphor",
  agarbatti: "Agarbatti",
  "sambrani-dhoop": "Sambrani & Dhoop",
  "deepam-oil": "Deepam Oil",
  "pooja-powders": "Pooja Powders",
  accessories: "Pooja Accessories",
};

function ProductsContent() {
  const searchParams = useSearchParams();
  const initialCategory = searchParams.get("category") as ProductCategory | null;

  const [selectedCategory, setSelectedCategory] = useState<ProductCategory | null>(initialCategory);
  const [selectedPriceRange, setSelectedPriceRange] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<SortOption>("featured");
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  const categoryCounts = getCategoryCounts();

  // Filter and sort products
  const filteredProducts = useMemo(() => {
    let products = [...sampleProducts];

    // Filter by category
    if (selectedCategory) {
      products = products.filter((p) => p.category === selectedCategory);
    }

    // Filter by price range
    if (selectedPriceRange) {
      const [min, max] = selectedPriceRange.split("-").map((v) => (v === "+" ? Infinity : Number(v)));
      products = products.filter((p) => {
        const price = p.variants[0].price;
        if (max === Infinity) {
          return price >= 500;
        }
        return price >= (min || 0) && price <= (max || Infinity);
      });
    }

    // Sort products
    switch (sortBy) {
      case "newest":
        products.sort((a, b) => toDate(b.createdAt).getTime() - toDate(a.createdAt).getTime());
        break;
      case "price-low":
        products.sort((a, b) => a.variants[0].price - b.variants[0].price);
        break;
      case "price-high":
        products.sort((a, b) => b.variants[0].price - a.variants[0].price);
        break;
      case "name":
        products.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case "featured":
      default:
        products.sort((a, b) => (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0));
        break;
    }

    return products;
  }, [selectedCategory, selectedPriceRange, sortBy]);

  const handleClearFilters = () => {
    setSelectedCategory(null);
    setSelectedPriceRange(null);
  };

  const pageTitle = selectedCategory
    ? categoryNames[selectedCategory]
    : "All Products";

  return (
    <div className="min-h-screen bg-cream">
      {/* Breadcrumb */}
      <div className="bg-white border-b border-charcoal-100">
        <Container>
          <Breadcrumb
            items={[
              { label: "Products", href: "/products" },
              ...(selectedCategory
                ? [{ label: categoryNames[selectedCategory] }]
                : []),
            ]}
          />
        </Container>
      </div>

      {/* Page Header */}
      <div className="bg-white border-b border-charcoal-100">
        <Container>
          <div className="py-6 md:py-8">
            <h1 className="text-2xl md:text-3xl font-heading font-bold text-charcoal mb-2">
              {pageTitle}
            </h1>
            <p className="text-charcoal-500">
              {filteredProducts.length} product{filteredProducts.length !== 1 ? "s" : ""} found
            </p>
          </div>
        </Container>
      </div>

      {/* Main Content */}
      <Container className="py-6 md:py-8">
        <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
          {/* Sidebar Filters - Desktop */}
          <aside className="hidden lg:block w-64 flex-shrink-0">
            <div className="sticky top-24">
              <ProductFilters
                selectedCategory={selectedCategory}
                selectedPriceRange={selectedPriceRange}
                onCategoryChange={setSelectedCategory}
                onPriceRangeChange={setSelectedPriceRange}
                onClearFilters={handleClearFilters}
                categoryCounts={categoryCounts}
              />
            </div>
          </aside>

          {/* Products Grid */}
          <main className="flex-1">
            {/* Toolbar */}
            <div className="flex items-center justify-between mb-6 gap-4">
              {/* Mobile Filter Button */}
              <Button
                variant="outline"
                size="sm"
                className="lg:hidden"
                leftIcon={<Filter className="h-4 w-4" />}
                onClick={() => setShowMobileFilters(true)}
              >
                Filters
                {(selectedCategory || selectedPriceRange) && (
                  <span className="ml-1 w-5 h-5 bg-maroon text-white text-xs rounded-full flex items-center justify-center">
                    {(selectedCategory ? 1 : 0) + (selectedPriceRange ? 1 : 0)}
                  </span>
                )}
              </Button>

              {/* Results count - Desktop */}
              <div className="hidden lg:block text-sm text-charcoal-500">
                Showing {filteredProducts.length} of {sampleProducts.length} products
              </div>

              {/* Sort Dropdown */}
              <SortDropdown value={sortBy} onChange={setSortBy} />
            </div>

            {/* Products */}
            <ProductGrid products={filteredProducts} />
          </main>
        </div>
      </Container>

      {/* Mobile Filters Modal */}
      <MobileFilters
        isOpen={showMobileFilters}
        onClose={() => setShowMobileFilters(false)}
        selectedCategory={selectedCategory}
        selectedPriceRange={selectedPriceRange}
        onCategoryChange={setSelectedCategory}
        onPriceRangeChange={setSelectedPriceRange}
        onClearFilters={handleClearFilters}
        categoryCounts={categoryCounts}
      />
    </div>
  );
}

function LoadingFallback() {
  return (
    <div className="min-h-screen bg-cream">
      <div className="bg-white border-b border-charcoal-100">
        <Container>
          <div className="py-4">
            <div className="animate-pulse h-6 bg-gray-200 rounded w-32"></div>
          </div>
        </Container>
      </div>
      <div className="bg-white border-b border-charcoal-100">
        <Container>
          <div className="py-6 md:py-8">
            <div className="animate-pulse h-8 bg-gray-200 rounded w-48 mb-2"></div>
            <div className="animate-pulse h-4 bg-gray-200 rounded w-24"></div>
          </div>
        </Container>
      </div>
      <Container className="py-6 md:py-8">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="animate-pulse bg-white rounded-lg p-4">
              <div className="h-40 bg-gray-200 rounded mb-4"></div>
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            </div>
          ))}
        </div>
      </Container>
    </div>
  );
}

export default function ProductsPage() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <ProductsContent />
    </Suspense>
  );
}
