"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import {
  Search,
  Plus,
  Edit,
  Trash2,
  Eye,
  EyeOff,
  Package,
  RefreshCw,
} from "lucide-react";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Modal } from "@/components/ui/Modal";
import { formatPrice } from "@/lib/utils/formatters";
import { getProducts, deleteProduct, updateProduct } from "@/lib/firebase/firestore";
import { deleteFolder } from "@/lib/firebase/storage";
import { Product } from "@/types";
import ProductForm from "@/components/admin/ProductForm";

const categoryNames: Record<string, string> = {
  camphor: "Camphor",
  agarbatti: "Agarbatti",
  "sambrani-dhoop": "Sambrani & Dhoop",
  "deepam-oil": "Deepam Oil",
  "pooja-powders": "Pooja Powders",
  accessories: "Accessories",
};

export default function AdminProductsPage() {
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteModal, setDeleteModal] = useState<Product | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Form modal state
  const [formOpen, setFormOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const data = await getProducts();
      setProducts(data);
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const filteredProducts = products.filter((product) => {
    const matchesSearch =
      product.name.toLowerCase().includes(search.toLowerCase()) ||
      product.slug.toLowerCase().includes(search.toLowerCase());

    const matchesCategory =
      categoryFilter === "all" || product.category === categoryFilter;

    return matchesSearch && matchesCategory;
  });

  const handleToggleStock = async (product: Product) => {
    try {
      await updateProduct(product.id, { inStock: !product.inStock });
      setProducts((prev) =>
        prev.map((p) =>
          p.id === product.id ? { ...p, inStock: !p.inStock } : p
        )
      );
    } catch (error) {
      console.error("Error toggling stock:", error);
      alert("Failed to update stock status");
    }
  };

  const handleToggleFeatured = async (product: Product) => {
    try {
      await updateProduct(product.id, { isFeatured: !product.isFeatured });
      setProducts((prev) =>
        prev.map((p) =>
          p.id === product.id ? { ...p, isFeatured: !p.isFeatured } : p
        )
      );
    } catch (error) {
      console.error("Error toggling featured:", error);
    }
  };

  const handleDelete = async () => {
    if (!deleteModal) return;

    setIsDeleting(true);
    try {
      // Delete product images from storage
      await deleteFolder(`products/${deleteModal.id}`);
      // Delete product document
      await deleteProduct(deleteModal.id);
      setProducts((prev) => prev.filter((p) => p.id !== deleteModal.id));
      setDeleteModal(null);
    } catch (error) {
      console.error("Error deleting product:", error);
      alert("Failed to delete product");
    } finally {
      setIsDeleting(false);
    }
  };

  const handleAddProduct = () => {
    setEditingProduct(null);
    setFormOpen(true);
  };

  const handleEditProduct = (product: Product) => {
    setEditingProduct(product);
    setFormOpen(true);
  };

  const handleFormSuccess = () => {
    fetchProducts();
    setFormOpen(false);
    setEditingProduct(null);
  };

  const getPrice = (product: Product): string => {
    if (product.variants && product.variants.length > 0) {
      const prices = product.variants.map((v) => v.price);
      const min = Math.min(...prices);
      const max = Math.max(...prices);
      if (min === max) return formatPrice(min);
      return `${formatPrice(min)} - ${formatPrice(max)}`;
    }
    return formatPrice(product.sellingPrice || 0);
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-heading font-bold text-charcoal">
            Products
          </h1>
          <p className="text-charcoal-500">Manage your product catalog</p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={fetchProducts}
            leftIcon={<RefreshCw className="h-4 w-4" />}
          >
            Refresh
          </Button>
          <Button
            variant="primary"
            leftIcon={<Plus className="h-4 w-4" />}
            onClick={handleAddProduct}
          >
            Add Product
          </Button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <Input
            placeholder="Search products..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            leftIcon={<Search className="h-4 w-4 text-charcoal-400" />}
          />
        </div>
        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          className="px-4 py-2 border border-charcoal-200 rounded-lg focus:ring-2 focus:ring-maroon focus:border-maroon"
        >
          <option value="all">All Categories</option>
          {Object.entries(categoryNames).map(([value, label]) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </select>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="text-center py-12">
          <RefreshCw className="h-8 w-8 animate-spin text-maroon mx-auto mb-4" />
          <p className="text-charcoal-500">Loading products...</p>
        </div>
      )}

      {/* Products Grid */}
      {!loading && (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filteredProducts.map((product) => (
            <div
              key={product.id}
              className="bg-white rounded-xl shadow-card overflow-hidden"
            >
              {/* Product Image */}
              <div className="relative aspect-video bg-cream-100">
                <Image
                  src={product.thumbnailUrl || "/images/placeholder-product.jpg"}
                  alt={product.name}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
                />
                <div className="absolute top-2 right-2 flex gap-1">
                  {product.isFeatured && (
                    <Badge variant="secondary" size="sm">
                      Featured
                    </Badge>
                  )}
                  {!product.inStock && (
                    <Badge variant="outline" size="sm" className="bg-white">
                      Out of Stock
                    </Badge>
                  )}
                </div>
              </div>

              {/* Product Info */}
              <div className="p-4">
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div>
                    <p className="text-xs text-charcoal-500 uppercase">
                      {categoryNames[product.category] || product.category}
                    </p>
                    <h3 className="font-heading font-semibold text-charcoal line-clamp-1">
                      {product.name}
                    </h3>
                  </div>
                </div>

                <p className="text-sm text-charcoal-500 line-clamp-2 mb-3">
                  {product.shortDescription}
                </p>

                {/* Variants */}
                <div className="flex items-center gap-2 mb-3 text-sm">
                  <Package className="h-4 w-4 text-charcoal-400" />
                  <span className="text-charcoal-600">
                    {product.variants?.length || 0} variant
                    {(product.variants?.length || 0) !== 1 ? "s" : ""}
                  </span>
                  <span className="text-charcoal-400">|</span>
                  <span className="font-medium text-maroon">
                    {getPrice(product)}
                  </span>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 pt-3 border-t border-charcoal-100">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleToggleStock(product)}
                    leftIcon={
                      product.inStock ? (
                        <Eye className="h-4 w-4" />
                      ) : (
                        <EyeOff className="h-4 w-4" />
                      )
                    }
                  >
                    {product.inStock ? "In Stock" : "Hidden"}
                  </Button>
                  <div className="flex-1" />
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleEditProduct(product)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setDeleteModal(product)}
                    className="text-red-500 hover:text-red-600 hover:bg-red-50"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {!loading && filteredProducts.length === 0 && (
        <div className="text-center py-12 bg-white rounded-xl shadow-card">
          <Package className="h-12 w-12 text-charcoal-300 mx-auto mb-4" />
          <p className="text-charcoal-500 mb-4">No products found</p>
          <Button variant="primary" onClick={handleAddProduct}>
            Add Your First Product
          </Button>
        </div>
      )}

      {/* Product Form Modal */}
      <ProductForm
        isOpen={formOpen}
        onClose={() => {
          setFormOpen(false);
          setEditingProduct(null);
        }}
        product={editingProduct}
        onSuccess={handleFormSuccess}
      />

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={!!deleteModal}
        onClose={() => setDeleteModal(null)}
        title="Delete Product"
        size="sm"
      >
        {deleteModal && (
          <div className="space-y-4">
            <p className="text-charcoal-600">
              Are you sure you want to delete{" "}
              <strong>{deleteModal.name}</strong>? This action cannot be undone.
            </p>
            <div className="flex gap-3">
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => setDeleteModal(null)}
                disabled={isDeleting}
              >
                Cancel
              </Button>
              <Button
                variant="primary"
                className="flex-1 bg-red-600 hover:bg-red-700"
                onClick={handleDelete}
                isLoading={isDeleting}
              >
                Delete
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
