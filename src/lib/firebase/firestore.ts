import {
  collection,
  doc,
  getDoc,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  limit,
  startAfter,
  DocumentData,
  QueryConstraint,
  Timestamp,
  serverTimestamp,
  writeBatch,
} from "firebase/firestore";
import { db } from "./config";
import { Product, Order, Category, SiteSettings, Testimonial } from "@/types";

// ==================== Generic Helpers ====================

/**
 * Get a single document by ID
 */
export async function getDocument<T>(
  collectionName: string,
  documentId: string
): Promise<T | null> {
  try {
    const docRef = doc(db, collectionName, documentId);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() } as T;
    }
    return null;
  } catch (error) {
    console.error(`Error fetching document ${documentId}:`, error);
    throw error;
  }
}

/**
 * Get all documents from a collection with optional constraints
 */
export async function getDocuments<T>(
  collectionName: string,
  constraints: QueryConstraint[] = []
): Promise<T[]> {
  try {
    const q = query(collection(db, collectionName), ...constraints);
    const snapshot = await getDocs(q);

    return snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as T[];
  } catch (error) {
    console.error(`Error fetching documents from ${collectionName}:`, error);
    throw error;
  }
}

/**
 * Add a new document
 */
export async function addDocument(
  collectionName: string,
  data: Record<string, unknown>
): Promise<string> {
  try {
    const docRef = await addDoc(collection(db, collectionName), {
      ...data,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
    return docRef.id;
  } catch (error) {
    console.error(`Error adding document to ${collectionName}:`, error);
    throw error;
  }
}

/**
 * Update an existing document
 */
export async function updateDocument(
  collectionName: string,
  documentId: string,
  data: Record<string, unknown>
): Promise<void> {
  try {
    const docRef = doc(db, collectionName, documentId);
    await updateDoc(docRef, {
      ...data,
      updatedAt: serverTimestamp(),
    });
  } catch (error) {
    console.error(`Error updating document ${documentId}:`, error);
    throw error;
  }
}

/**
 * Delete a document
 */
export async function deleteDocument(
  collectionName: string,
  documentId: string
): Promise<void> {
  try {
    await deleteDoc(doc(db, collectionName, documentId));
  } catch (error) {
    console.error(`Error deleting document ${documentId}:`, error);
    throw error;
  }
}

// ==================== Products ====================

export async function getProducts(
  options: {
    category?: string;
    featured?: boolean;
    bestSeller?: boolean;
    inStock?: boolean;
    limitCount?: number;
  } = {}
): Promise<Product[]> {
  const constraints: QueryConstraint[] = [];

  if (options.category) {
    constraints.push(where("category", "==", options.category));
  }
  if (options.featured) {
    constraints.push(where("isFeatured", "==", true));
  }
  if (options.bestSeller) {
    constraints.push(where("isBestSeller", "==", true));
  }
  if (options.inStock !== undefined) {
    constraints.push(where("inStock", "==", options.inStock));
  }

  constraints.push(orderBy("createdAt", "desc"));

  if (options.limitCount) {
    constraints.push(limit(options.limitCount));
  }

  return getDocuments<Product>("products", constraints);
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  const products = await getDocuments<Product>("products", [
    where("slug", "==", slug),
    limit(1),
  ]);
  return products[0] || null;
}

export async function getProductById(id: string): Promise<Product | null> {
  return getDocument<Product>("products", id);
}

export async function createProduct(
  data: Omit<Product, "id" | "createdAt" | "updatedAt">
): Promise<string> {
  return addDocument("products", data);
}

export async function updateProduct(
  id: string,
  data: Partial<Product>
): Promise<void> {
  return updateDocument("products", id, data);
}

export async function deleteProduct(id: string): Promise<void> {
  return deleteDocument("products", id);
}

// ==================== Categories ====================

export async function getCategories(): Promise<Category[]> {
  return getDocuments<Category>("categories", [
    where("isActive", "==", true),
    orderBy("displayOrder", "asc"),
  ]);
}

export async function getCategoryBySlug(
  slug: string
): Promise<Category | null> {
  const categories = await getDocuments<Category>("categories", [
    where("slug", "==", slug),
    limit(1),
  ]);
  return categories[0] || null;
}

// ==================== Orders ====================

export async function getOrders(
  options: {
    status?: string;
    limitCount?: number;
    startAfterId?: string;
  } = {}
): Promise<Order[]> {
  const constraints: QueryConstraint[] = [];

  if (options.status) {
    constraints.push(where("status", "==", options.status));
  }

  constraints.push(orderBy("createdAt", "desc"));

  if (options.limitCount) {
    constraints.push(limit(options.limitCount));
  }

  return getDocuments<Order>("orders", constraints);
}

export async function getOrderById(id: string): Promise<Order | null> {
  return getDocument<Order>("orders", id);
}

export async function getOrderByNumber(
  orderNumber: string
): Promise<Order | null> {
  const orders = await getDocuments<Order>("orders", [
    where("orderNumber", "==", orderNumber),
    limit(1),
  ]);
  return orders[0] || null;
}

export async function createOrder(
  data: Omit<Order, "id" | "createdAt" | "updatedAt">
): Promise<string> {
  return addDocument("orders", data);
}

export async function updateOrder(
  id: string,
  data: Partial<Order>
): Promise<void> {
  return updateDocument("orders", id, data);
}

export async function updateOrderStatus(
  id: string,
  status: string,
  note?: string,
  updatedBy?: string
): Promise<void> {
  const order = await getOrderById(id);
  if (!order) throw new Error("Order not found");

  const statusEntry = {
    status,
    timestamp: Timestamp.now(),
    note,
    updatedBy,
  };

  await updateDocument("orders", id, {
    status,
    statusHistory: [...order.statusHistory, statusEntry],
  });
}

// ==================== Settings ====================

export async function getSiteSettings(): Promise<SiteSettings | null> {
  return getDocument<SiteSettings>("settings", "main");
}

export async function updateSiteSettings(
  data: Partial<SiteSettings>
): Promise<void> {
  return updateDocument("settings", "main", data);
}

// ==================== Testimonials ====================

export async function getTestimonials(): Promise<Testimonial[]> {
  return getDocuments<Testimonial>("testimonials", [
    where("isActive", "==", true),
    orderBy("createdAt", "desc"),
  ]);
}

// ==================== Batch Operations ====================

export async function batchUpdateProducts(
  updates: { id: string; data: Partial<Product> }[]
): Promise<void> {
  const batch = writeBatch(db);

  for (const { id, data } of updates) {
    const docRef = doc(db, "products", id);
    batch.update(docRef, {
      ...data,
      updatedAt: serverTimestamp(),
    });
  }

  await batch.commit();
}
