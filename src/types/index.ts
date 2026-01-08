import { Timestamp } from "firebase/firestore";

// ==================== Product Types ====================

export type ProductCategory =
  | "camphor"
  | "agarbatti"
  | "sambrani-dhoop"
  | "deepam-oil"
  | "pooja-powders"
  | "accessories";

export interface ProductVariant {
  id: string;
  name: string;
  weight?: string;
  packSize?: number;
  price: number;
  mrp: number;
  sku?: string;
  inStock: boolean;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  nameInTamil?: string;
  category: ProductCategory;
  description: string;
  shortDescription: string;
  basePrice: number;
  sellingPrice: number;
  discount?: number;
  variants: ProductVariant[];
  images: string[];
  thumbnailUrl: string;
  inStock: boolean;
  stockQuantity?: number;
  tags: string[];
  isFeatured: boolean;
  isBestSeller: boolean;
  isNewArrival: boolean;
  metaTitle?: string;
  metaDescription?: string;
  createdAt: Timestamp | Date;
  updatedAt: Timestamp | Date;
}

export interface Category {
  id: string;
  name: string;
  nameInTamil: string;
  slug: string;
  description: string;
  imageUrl: string;
  iconName?: string;
  displayOrder: number;
  isActive: boolean;
  productCount?: number;
  createdAt: Timestamp | Date;
  updatedAt: Timestamp | Date;
}

// ==================== Cart Types ====================

export interface CartItem {
  id: string; // `${productId}-${variantId}`
  productId: string;
  productName: string;
  productSlug: string;
  variantId: string;
  variantName: string;
  price: number;
  mrp: number;
  quantity: number;
  thumbnailUrl: string;
}

export interface Cart {
  items: CartItem[];
  subtotal: number;
  itemCount: number;
}

// ==================== Order Types ====================

export type OrderStatus =
  | "pending"
  | "confirmed"
  | "packed"
  | "shipped"
  | "delivered"
  | "cancelled";

export interface Address {
  line1: string;
  line2?: string;
  city: string;
  state: string;
  pincode: string;
  country: string;
}

export interface CustomerInfo {
  name: string;
  phone: string;
  whatsapp?: string;
  email?: string;
  address: Address;
}

export interface OrderItem {
  productId: string;
  productName: string;
  productSlug: string;
  variantId: string;
  variantName: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  thumbnailUrl: string;
}

export interface StatusHistoryEntry {
  status: OrderStatus;
  timestamp: Timestamp | Date;
  note?: string;
  updatedBy?: string;
}

export interface Order {
  id: string;
  orderNumber: string;
  customer: CustomerInfo;
  items: OrderItem[];
  subtotal: number;
  deliveryCharge: number;
  discount: number;
  total: number;
  status: OrderStatus;
  statusHistory: StatusHistoryEntry[];
  whatsappMessageSent: boolean;
  whatsappMessageId?: string;
  estimatedDelivery?: Timestamp | Date;
  actualDelivery?: Timestamp | Date;
  trackingNumber?: string;
  customerNotes?: string;
  adminNotes?: string;
  createdAt: Timestamp | Date;
  updatedAt: Timestamp | Date;
}

// ==================== Admin Types ====================

export type AdminRole = "super_admin" | "admin" | "staff";

export interface Admin {
  id: string;
  email: string;
  displayName: string;
  role: AdminRole;
  permissions: string[];
  isActive: boolean;
  lastLogin?: Timestamp | Date;
  createdAt: Timestamp | Date;
}

// ==================== Settings Types ====================

export interface BusinessSettings {
  name: string;
  tagline: string;
  whatsappNumber: string;
  email: string;
  phone: string;
  address: Address;
  gstNumber?: string;
}

export interface DeliverySettings {
  freeDeliveryThreshold: number;
  defaultDeliveryCharge: number;
  servicablePincodes: string[];
}

export interface SocialSettings {
  facebook?: string;
  instagram?: string;
  youtube?: string;
}

export interface SEOSettings {
  defaultTitle: string;
  defaultDescription: string;
  ogImage: string;
}

export interface FeatureSettings {
  showNewsletter: boolean;
  showTestimonials: boolean;
  enableReviews: boolean;
}

export interface SiteSettings {
  id: string;
  business: BusinessSettings;
  delivery: DeliverySettings;
  social: SocialSettings;
  seo: SEOSettings;
  features: FeatureSettings;
  updatedAt: Timestamp | Date;
}

// ==================== Testimonial Types ====================

export interface Testimonial {
  id: string;
  name: string;
  role?: string;
  organization?: string;
  content: string;
  rating: number;
  imageUrl?: string;
  isActive: boolean;
  createdAt: Timestamp | Date;
}

// ==================== Newsletter Types ====================

export interface NewsletterSubscriber {
  id: string;
  phone: string;
  email?: string;
  name?: string;
  isActive: boolean;
  createdAt: Timestamp | Date;
}

// ==================== Form Types ====================

export interface ContactFormData {
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
}

export interface CheckoutFormData {
  name: string;
  phone: string;
  whatsapp?: string;
  email?: string;
  pincode: string;
  address: string;
  city: string;
  state: string;
  landmark?: string;
  notes?: string;
}

// ==================== API Response Types ====================

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  hasMore: boolean;
}

// ==================== Filter Types ====================

export interface ProductFilters {
  category?: ProductCategory;
  minPrice?: number;
  maxPrice?: number;
  inStock?: boolean;
  isFeatured?: boolean;
  search?: string;
  sortBy?: "price-asc" | "price-desc" | "name" | "newest" | "popular";
}

export interface OrderFilters {
  status?: OrderStatus;
  dateFrom?: Date;
  dateTo?: Date;
  search?: string;
}
