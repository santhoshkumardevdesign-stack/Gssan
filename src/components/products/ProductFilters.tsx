"use client";

import { useState } from "react";
import { X, Filter, ChevronDown, ChevronUp } from "lucide-react";
import { ProductCategory } from "@/types";
import { Button } from "@/components/ui/Button";

interface FilterOption {
  value: string;
  label: string;
  count?: number;
}

interface ProductFiltersProps {
  selectedCategory: ProductCategory | null;
  selectedPriceRange: string | null;
  onCategoryChange: (category: ProductCategory | null) => void;
  onPriceRangeChange: (range: string | null) => void;
  onClearFilters: () => void;
  categoryCounts?: Record<ProductCategory, number>;
}

const categories: FilterOption[] = [
  { value: "camphor", label: "Camphor" },
  { value: "agarbatti", label: "Agarbatti" },
  { value: "sambrani-dhoop", label: "Sambrani & Dhoop" },
  { value: "deepam-oil", label: "Deepam Oil" },
  { value: "pooja-powders", label: "Pooja Powders" },
  { value: "accessories", label: "Pooja Accessories" },
];

const priceRanges: FilterOption[] = [
  { value: "0-100", label: "Under ₹100" },
  { value: "100-250", label: "₹100 - ₹250" },
  { value: "250-500", label: "₹250 - ₹500" },
  { value: "500+", label: "Above ₹500" },
];

export function ProductFilters({
  selectedCategory,
  selectedPriceRange,
  onCategoryChange,
  onPriceRangeChange,
  onClearFilters,
  categoryCounts,
}: ProductFiltersProps) {
  const [expandedSections, setExpandedSections] = useState({
    category: true,
    price: true,
  });

  const toggleSection = (section: "category" | "price") => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const hasActiveFilters = selectedCategory !== null || selectedPriceRange !== null;

  return (
    <div className="bg-white rounded-xl shadow-card p-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-4 pb-4 border-b border-charcoal-100">
        <div className="flex items-center gap-2">
          <Filter className="h-5 w-5 text-maroon" />
          <h3 className="font-heading font-semibold text-charcoal">Filters</h3>
        </div>
        {hasActiveFilters && (
          <button
            onClick={onClearFilters}
            className="text-sm text-saffron hover:text-saffron-600 transition-colors"
          >
            Clear All
          </button>
        )}
      </div>

      {/* Active Filters */}
      {hasActiveFilters && (
        <div className="mb-4 pb-4 border-b border-charcoal-100">
          <p className="text-xs text-charcoal-500 mb-2">Active Filters</p>
          <div className="flex flex-wrap gap-2">
            {selectedCategory && (
              <span className="inline-flex items-center gap-1 px-2 py-1 bg-maroon-50 text-maroon text-sm rounded-full">
                {categories.find((c) => c.value === selectedCategory)?.label}
                <button
                  onClick={() => onCategoryChange(null)}
                  className="hover:bg-maroon-100 rounded-full p-0.5"
                >
                  <X className="h-3 w-3" />
                </button>
              </span>
            )}
            {selectedPriceRange && (
              <span className="inline-flex items-center gap-1 px-2 py-1 bg-saffron-50 text-saffron-600 text-sm rounded-full">
                {priceRanges.find((p) => p.value === selectedPriceRange)?.label}
                <button
                  onClick={() => onPriceRangeChange(null)}
                  className="hover:bg-saffron-100 rounded-full p-0.5"
                >
                  <X className="h-3 w-3" />
                </button>
              </span>
            )}
          </div>
        </div>
      )}

      {/* Category Filter */}
      <div className="mb-4">
        <button
          onClick={() => toggleSection("category")}
          className="flex items-center justify-between w-full py-2"
        >
          <span className="font-medium text-charcoal">Category</span>
          {expandedSections.category ? (
            <ChevronUp className="h-4 w-4 text-charcoal-400" />
          ) : (
            <ChevronDown className="h-4 w-4 text-charcoal-400" />
          )}
        </button>
        {expandedSections.category && (
          <div className="space-y-2 mt-2">
            {categories.map((category) => (
              <label
                key={category.value}
                className="flex items-center gap-3 cursor-pointer group"
              >
                <input
                  type="radio"
                  name="category"
                  checked={selectedCategory === category.value}
                  onChange={() =>
                    onCategoryChange(
                      selectedCategory === category.value
                        ? null
                        : (category.value as ProductCategory)
                    )
                  }
                  className="w-4 h-4 text-maroon border-charcoal-300 focus:ring-maroon"
                />
                <span className="text-sm text-charcoal-600 group-hover:text-maroon transition-colors">
                  {category.label}
                </span>
                {categoryCounts && categoryCounts[category.value as ProductCategory] && (
                  <span className="ml-auto text-xs text-charcoal-400">
                    ({categoryCounts[category.value as ProductCategory]})
                  </span>
                )}
              </label>
            ))}
          </div>
        )}
      </div>

      {/* Price Filter */}
      <div className="mb-4">
        <button
          onClick={() => toggleSection("price")}
          className="flex items-center justify-between w-full py-2"
        >
          <span className="font-medium text-charcoal">Price Range</span>
          {expandedSections.price ? (
            <ChevronUp className="h-4 w-4 text-charcoal-400" />
          ) : (
            <ChevronDown className="h-4 w-4 text-charcoal-400" />
          )}
        </button>
        {expandedSections.price && (
          <div className="space-y-2 mt-2">
            {priceRanges.map((range) => (
              <label
                key={range.value}
                className="flex items-center gap-3 cursor-pointer group"
              >
                <input
                  type="radio"
                  name="priceRange"
                  checked={selectedPriceRange === range.value}
                  onChange={() =>
                    onPriceRangeChange(
                      selectedPriceRange === range.value ? null : range.value
                    )
                  }
                  className="w-4 h-4 text-saffron border-charcoal-300 focus:ring-saffron"
                />
                <span className="text-sm text-charcoal-600 group-hover:text-saffron transition-colors">
                  {range.label}
                </span>
              </label>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// Mobile Filter Modal
interface MobileFiltersProps extends ProductFiltersProps {
  isOpen: boolean;
  onClose: () => void;
}

export function MobileFilters({
  isOpen,
  onClose,
  ...filterProps
}: MobileFiltersProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 lg:hidden">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50"
        onClick={onClose}
      />

      {/* Panel */}
      <div className="absolute inset-y-0 right-0 w-full max-w-sm bg-white shadow-xl">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-charcoal-100">
          <h2 className="font-heading font-semibold text-lg">Filters</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-charcoal-50 rounded-full transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Filters */}
        <div className="p-4 overflow-y-auto max-h-[calc(100vh-140px)]">
          <ProductFilters {...filterProps} />
        </div>

        {/* Footer */}
        <div className="absolute bottom-0 left-0 right-0 p-4 bg-white border-t border-charcoal-100">
          <Button variant="primary" className="w-full" onClick={onClose}>
            Apply Filters
          </Button>
        </div>
      </div>
    </div>
  );
}
