"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import {
  X,
  Upload,
  Camera,
  Trash2,
  Plus,
  Loader2,
  ImageIcon,
} from "lucide-react";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { Product, ProductVariant, ProductCategory } from "@/types";
import {
  uploadProductImage,
  deleteFileByUrl,
  validateImageFile,
} from "@/lib/firebase/storage";
import { createProduct, updateProduct } from "@/lib/firebase/firestore";

interface ProductFormProps {
  isOpen: boolean;
  onClose: () => void;
  product?: Product | null;
  onSuccess: () => void;
}

const categories: { value: ProductCategory; label: string }[] = [
  { value: "camphor", label: "Camphor" },
  { value: "agarbatti", label: "Agarbatti" },
  { value: "sambrani-dhoop", label: "Sambrani & Dhoop" },
  { value: "deepam-oil", label: "Deepam Oil" },
  { value: "pooja-powders", label: "Pooja Powders" },
  { value: "accessories", label: "Accessories" },
];

const generateSlug = (name: string): string => {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
};

const generateId = (): string => {
  return `prod_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};

export default function ProductForm({
  isOpen,
  onClose,
  product,
  onSuccess,
}: ProductFormProps) {
  const isEditing = !!product;
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  // Form state
  const [name, setName] = useState(product?.name || "");
  const [nameInTamil, setNameInTamil] = useState(product?.nameInTamil || "");
  const [category, setCategory] = useState<ProductCategory>(
    product?.category || "camphor"
  );
  const [shortDescription, setShortDescription] = useState(
    product?.shortDescription || ""
  );
  const [description, setDescription] = useState(product?.description || "");
  const [tags, setTags] = useState(product?.tags?.join(", ") || "");
  const [isFeatured, setIsFeatured] = useState(product?.isFeatured || false);
  const [isBestSeller, setIsBestSeller] = useState(product?.isBestSeller || false);
  const [inStock, setInStock] = useState(product?.inStock ?? true);

  // Images
  const [images, setImages] = useState<string[]>(product?.images || []);
  const [uploadingImages, setUploadingImages] = useState(false);
  const [imageError, setImageError] = useState("");

  // Variants
  const [variants, setVariants] = useState<ProductVariant[]>(
    product?.variants || [
      {
        id: "v1",
        name: "Regular",
        weight: "",
        price: 0,
        mrp: 0,
        inStock: true,
      },
    ]
  );

  // Form state
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleImageUpload = async (files: FileList | null) => {
    if (!files || files.length === 0) return;

    setImageError("");
    setUploadingImages(true);

    try {
      const productId = product?.id || generateId();
      const newImages: string[] = [];

      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const validation = validateImageFile(file);

        if (!validation.valid) {
          setImageError(validation.error || "Invalid file");
          continue;
        }

        const url = await uploadProductImage(file, productId);
        newImages.push(url);
      }

      setImages((prev) => [...prev, ...newImages]);
    } catch (err) {
      console.error("Upload error:", err);
      setImageError("Failed to upload images. Please try again.");
    } finally {
      setUploadingImages(false);
    }
  };

  const handleRemoveImage = async (index: number) => {
    const imageUrl = images[index];
    try {
      await deleteFileByUrl(imageUrl);
    } catch (err) {
      console.error("Error deleting image:", err);
    }
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  const addVariant = () => {
    setVariants((prev) => [
      ...prev,
      {
        id: `v${Date.now()}`,
        name: "",
        weight: "",
        price: 0,
        mrp: 0,
        inStock: true,
      },
    ]);
  };

  const updateVariant = (
    index: number,
    field: keyof ProductVariant,
    value: string | number | boolean
  ) => {
    setVariants((prev) =>
      prev.map((v, i) => (i === index ? { ...v, [field]: value } : v))
    );
  };

  const removeVariant = (index: number) => {
    if (variants.length > 1) {
      setVariants((prev) => prev.filter((_, i) => i !== index));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsSubmitting(true);

    try {
      // Validation
      if (!name.trim()) {
        throw new Error("Product name is required");
      }
      if (images.length === 0) {
        throw new Error("At least one image is required");
      }
      if (variants.some((v) => !v.name || v.price <= 0)) {
        throw new Error("All variants must have a name and price");
      }

      const productData = {
        name: name.trim(),
        slug: generateSlug(name),
        nameInTamil: nameInTamil.trim() || undefined,
        category,
        description: description.trim(),
        shortDescription: shortDescription.trim(),
        basePrice: Math.min(...variants.map((v) => v.mrp)),
        sellingPrice: Math.min(...variants.map((v) => v.price)),
        variants: variants.map((v) => ({
          ...v,
          price: Number(v.price),
          mrp: Number(v.mrp),
        })),
        images,
        thumbnailUrl: images[0],
        inStock,
        tags: tags
          .split(",")
          .map((t) => t.trim())
          .filter(Boolean),
        isFeatured,
        isBestSeller,
        isNewArrival: !isEditing,
      };

      if (isEditing && product) {
        await updateProduct(product.id, productData);
      } else {
        await createProduct(productData as Omit<Product, "id" | "createdAt" | "updatedAt">);
      }

      onSuccess();
      onClose();
    } catch (err) {
      console.error("Submit error:", err);
      setError(err instanceof Error ? err.message : "Failed to save product");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isEditing ? "Edit Product" : "Add New Product"}
      size="lg"
    >
      <form onSubmit={handleSubmit} className="space-y-6 max-h-[70vh] overflow-y-auto px-1">
        {error && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-600">
            {error}
          </div>
        )}

        {/* Images Section */}
        <div>
          <label className="block text-sm font-medium text-charcoal mb-2">
            Product Images *
          </label>

          {/* Image Preview Grid */}
          <div className="grid grid-cols-3 sm:grid-cols-4 gap-3 mb-3">
            {images.map((img, index) => (
              <div
                key={index}
                className="relative aspect-square bg-cream-100 rounded-lg overflow-hidden group"
              >
                <Image
                  src={img}
                  alt={`Product ${index + 1}`}
                  fill
                  className="object-cover"
                />
                <button
                  type="button"
                  onClick={() => handleRemoveImage(index)}
                  className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <X className="h-3 w-3" />
                </button>
                {index === 0 && (
                  <span className="absolute bottom-1 left-1 text-xs bg-maroon text-white px-1.5 py-0.5 rounded">
                    Main
                  </span>
                )}
              </div>
            ))}

            {/* Upload Buttons */}
            {images.length < 6 && (
              <div className="aspect-square border-2 border-dashed border-charcoal-200 rounded-lg flex flex-col items-center justify-center gap-2">
                {uploadingImages ? (
                  <Loader2 className="h-6 w-6 animate-spin text-charcoal-400" />
                ) : (
                  <>
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="p-2 bg-cream hover:bg-cream-200 rounded-lg transition-colors"
                        title="Upload from device"
                      >
                        <Upload className="h-5 w-5 text-charcoal-600" />
                      </button>
                      <button
                        type="button"
                        onClick={() => cameraInputRef.current?.click()}
                        className="p-2 bg-cream hover:bg-cream-200 rounded-lg transition-colors"
                        title="Take photo"
                      >
                        <Camera className="h-5 w-5 text-charcoal-600" />
                      </button>
                    </div>
                    <span className="text-xs text-charcoal-400">Add Image</span>
                  </>
                )}
              </div>
            )}
          </div>

          {imageError && (
            <p className="text-sm text-red-500 mt-1">{imageError}</p>
          )}

          {/* Hidden file inputs */}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            multiple
            onChange={(e) => handleImageUpload(e.target.files)}
            className="hidden"
          />
          <input
            ref={cameraInputRef}
            type="file"
            accept="image/*"
            capture="environment"
            onChange={(e) => handleImageUpload(e.target.files)}
            className="hidden"
          />

          <p className="text-xs text-charcoal-400">
            Upload up to 6 images. First image will be the thumbnail. Max 5MB each.
          </p>
        </div>

        {/* Basic Info */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label="Product Name *"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g., Pure Bhimseni Camphor"
            required
          />
          <Input
            label="Name in Tamil"
            value={nameInTamil}
            onChange={(e) => setNameInTamil(e.target.value)}
            placeholder="e.g., தூய பீம்சேனி கர்பூரம்"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-charcoal mb-1">
            Category *
          </label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value as ProductCategory)}
            className="w-full px-4 py-2 border border-charcoal-200 rounded-lg focus:ring-2 focus:ring-maroon focus:border-maroon"
            required
          >
            {categories.map((cat) => (
              <option key={cat.value} value={cat.value}>
                {cat.label}
              </option>
            ))}
          </select>
        </div>

        <Input
          label="Short Description *"
          value={shortDescription}
          onChange={(e) => setShortDescription(e.target.value)}
          placeholder="Brief description for product cards"
          required
        />

        <div>
          <label className="block text-sm font-medium text-charcoal mb-1">
            Full Description
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
            className="w-full px-4 py-2 border border-charcoal-200 rounded-lg focus:ring-2 focus:ring-maroon focus:border-maroon resize-none"
            placeholder="Detailed product description..."
          />
        </div>

        {/* Variants */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <label className="block text-sm font-medium text-charcoal">
              Variants / Sizes *
            </label>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={addVariant}
              leftIcon={<Plus className="h-3 w-3" />}
            >
              Add Variant
            </Button>
          </div>

          <div className="space-y-3">
            {variants.map((variant, index) => (
              <div
                key={variant.id}
                className="p-3 bg-cream-50 rounded-lg space-y-3"
              >
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-charcoal">
                    Variant {index + 1}
                  </span>
                  {variants.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeVariant(index)}
                      className="text-red-500 hover:text-red-600"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <Input
                    label="Name"
                    value={variant.name}
                    onChange={(e) =>
                      updateVariant(index, "name", e.target.value)
                    }
                    placeholder="e.g., 50g"
                    required
                  />
                  <Input
                    label="Weight"
                    value={variant.weight || ""}
                    onChange={(e) =>
                      updateVariant(index, "weight", e.target.value)
                    }
                    placeholder="e.g., 50g"
                  />
                  <Input
                    label="MRP (₹)"
                    type="number"
                    value={variant.mrp || ""}
                    onChange={(e) =>
                      updateVariant(index, "mrp", Number(e.target.value))
                    }
                    placeholder="0"
                    required
                  />
                  <Input
                    label="Price (₹)"
                    type="number"
                    value={variant.price || ""}
                    onChange={(e) =>
                      updateVariant(index, "price", Number(e.target.value))
                    }
                    placeholder="0"
                    required
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Tags */}
        <Input
          label="Tags"
          value={tags}
          onChange={(e) => setTags(e.target.value)}
          placeholder="puja, temple, home (comma separated)"
        />

        {/* Options */}
        <div className="flex flex-wrap gap-4">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={inStock}
              onChange={(e) => setInStock(e.target.checked)}
              className="w-4 h-4 text-maroon border-charcoal-300 rounded focus:ring-maroon"
            />
            <span className="text-sm text-charcoal">In Stock</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={isFeatured}
              onChange={(e) => setIsFeatured(e.target.checked)}
              className="w-4 h-4 text-maroon border-charcoal-300 rounded focus:ring-maroon"
            />
            <span className="text-sm text-charcoal">Featured</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={isBestSeller}
              onChange={(e) => setIsBestSeller(e.target.checked)}
              className="w-4 h-4 text-maroon border-charcoal-300 rounded focus:ring-maroon"
            />
            <span className="text-sm text-charcoal">Best Seller</span>
          </label>
        </div>

        {/* Actions */}
        <div className="flex gap-3 pt-4 border-t border-charcoal-100">
          <Button
            type="button"
            variant="outline"
            className="flex-1"
            onClick={onClose}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            variant="primary"
            className="flex-1"
            isLoading={isSubmitting}
          >
            {isEditing ? "Update Product" : "Add Product"}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
