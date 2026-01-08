import {
  collection,
  doc,
  addDoc,
  getDoc,
  getDocs,
  updateDoc,
  query,
  orderBy,
  where,
  Timestamp,
  onSnapshot,
  Unsubscribe,
} from "firebase/firestore";
import { db } from "@/lib/firebase/config";
import { Order } from "@/types";

const ORDERS_COLLECTION = "orders";

export interface FirestoreOrder extends Omit<Order, "createdAt" | "updatedAt"> {
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

/**
 * Convert Firestore document to Order object
 */
function convertToOrder(doc: { id: string; data: () => FirestoreOrder }): Order {
  const data = doc.data();
  return {
    ...data,
    id: doc.id,
    createdAt: data.createdAt?.toDate() || new Date(),
    updatedAt: data.updatedAt?.toDate() || new Date(),
  };
}

/**
 * Create a new order in Firestore
 */
export async function createOrder(order: Omit<Order, "id">): Promise<string> {
  try {
    const orderData = {
      ...order,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
    };

    const docRef = await addDoc(collection(db, ORDERS_COLLECTION), orderData);
    console.log("Order created with ID:", docRef.id);
    return docRef.id;
  } catch (error) {
    console.error("Error creating order:", error);
    throw error;
  }
}

/**
 * Get a single order by ID
 */
export async function getOrderById(orderId: string): Promise<Order | null> {
  try {
    const docRef = doc(db, ORDERS_COLLECTION, orderId);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      return convertToOrder({ id: docSnap.id, data: () => docSnap.data() as FirestoreOrder });
    }
    return null;
  } catch (error) {
    console.error("Error getting order:", error);
    throw error;
  }
}

/**
 * Get all orders (with optional status filter)
 */
export async function getOrders(status?: string): Promise<Order[]> {
  try {
    let q = query(
      collection(db, ORDERS_COLLECTION),
      orderBy("createdAt", "desc")
    );

    if (status && status !== "all") {
      q = query(
        collection(db, ORDERS_COLLECTION),
        where("status", "==", status),
        orderBy("createdAt", "desc")
      );
    }

    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map((doc) =>
      convertToOrder({ id: doc.id, data: () => doc.data() as FirestoreOrder })
    );
  } catch (error) {
    console.error("Error getting orders:", error);
    throw error;
  }
}

/**
 * Update order status
 */
export async function updateOrderStatus(
  orderId: string,
  status: Order["status"]
): Promise<void> {
  try {
    const docRef = doc(db, ORDERS_COLLECTION, orderId);
    await updateDoc(docRef, {
      status,
      updatedAt: Timestamp.now(),
    });
    console.log("Order status updated:", orderId, status);
  } catch (error) {
    console.error("Error updating order status:", error);
    throw error;
  }
}

/**
 * Subscribe to real-time order updates
 */
export function subscribeToOrders(
  callback: (orders: Order[]) => void,
  status?: string
): Unsubscribe {
  let q = query(
    collection(db, ORDERS_COLLECTION),
    orderBy("createdAt", "desc")
  );

  if (status && status !== "all") {
    q = query(
      collection(db, ORDERS_COLLECTION),
      where("status", "==", status),
      orderBy("createdAt", "desc")
    );
  }

  return onSnapshot(q, (querySnapshot) => {
    const orders = querySnapshot.docs.map((doc) =>
      convertToOrder({ id: doc.id, data: () => doc.data() as FirestoreOrder })
    );
    callback(orders);
  });
}

/**
 * Get order statistics
 */
export async function getOrderStats(): Promise<{
  total: number;
  pending: number;
  confirmed: number;
  shipped: number;
  delivered: number;
  totalRevenue: number;
}> {
  try {
    const orders = await getOrders();

    const stats = {
      total: orders.length,
      pending: 0,
      confirmed: 0,
      shipped: 0,
      delivered: 0,
      totalRevenue: 0,
    };

    orders.forEach((order) => {
      switch (order.status) {
        case "pending":
          stats.pending++;
          break;
        case "confirmed":
          stats.confirmed++;
          break;
        case "shipped":
          stats.shipped++;
          break;
        case "delivered":
          stats.delivered++;
          stats.totalRevenue += order.total;
          break;
      }
    });

    return stats;
  } catch (error) {
    console.error("Error getting order stats:", error);
    throw error;
  }
}
