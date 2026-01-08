"use client";

import {
  createContext,
  useContext,
  useCallback,
  useMemo,
  useEffect,
  useState,
  ReactNode,
} from "react";

// Cart item input when adding to cart
export interface AddToCartItem {
  productId: string;
  productName: string;
  productSlug: string;
  productImage?: string;
  variantId: string;
  variantName: string;
  price: number;
  quantity: number;
}

// Stored cart item with id
export interface CartItem {
  id: string;
  productId: string;
  productName: string;
  productSlug: string;
  productImage?: string;
  variantId: string;
  variantName: string;
  price: number;
  quantity: number;
}

interface CartContextType {
  items: CartItem[];
  addItem: (item: AddToCartItem) => void;
  removeItem: (productId: string, variantId: string) => void;
  updateQuantity: (productId: string, variantId: string, quantity: number) => void;
  clearCart: () => void;
  subtotal: number;
  itemCount: number;
  isInCart: (productId: string, variantId?: string) => boolean;
  getItemQuantity: (productId: string, variantId: string) => number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const CART_STORAGE_KEY = "gsaan-cart";

function getStoredCart(): CartItem[] {
  if (typeof window === "undefined") return [];
  try {
    const stored = localStorage.getItem(CART_STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

function storeCart(items: CartItem[]): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
  } catch (error) {
    console.error("Failed to save cart to localStorage:", error);
  }
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isHydrated, setIsHydrated] = useState(false);

  // Hydrate cart from localStorage on mount
  useEffect(() => {
    const storedItems = getStoredCart();
    setItems(storedItems);
    setIsHydrated(true);
  }, []);

  // Persist cart to localStorage on changes
  useEffect(() => {
    if (isHydrated) {
      storeCart(items);
    }
  }, [items, isHydrated]);

  const addItem = useCallback((item: AddToCartItem) => {
    setItems((current) => {
      const itemId = `${item.productId}-${item.variantId}`;
      const existingIndex = current.findIndex((i) => i.id === itemId);

      if (existingIndex > -1) {
        // Update existing item quantity
        const updated = [...current];
        updated[existingIndex] = {
          ...updated[existingIndex],
          quantity: updated[existingIndex].quantity + item.quantity,
        };
        return updated;
      }

      // Add new item
      return [
        ...current,
        {
          id: itemId,
          productId: item.productId,
          productName: item.productName,
          productSlug: item.productSlug,
          productImage: item.productImage,
          variantId: item.variantId,
          variantName: item.variantName,
          price: item.price,
          quantity: item.quantity,
        },
      ];
    });
  }, []);

  const removeItem = useCallback((productId: string, variantId: string) => {
    const itemId = `${productId}-${variantId}`;
    setItems((current) => current.filter((i) => i.id !== itemId));
  }, []);

  const updateQuantity = useCallback(
    (productId: string, variantId: string, quantity: number) => {
      if (quantity < 1) {
        removeItem(productId, variantId);
        return;
      }

      const itemId = `${productId}-${variantId}`;
      setItems((current) =>
        current.map((item) =>
          item.id === itemId ? { ...item, quantity } : item
        )
      );
    },
    [removeItem]
  );

  const clearCart = useCallback(() => {
    setItems([]);
  }, []);

  const subtotal = useMemo(
    () => items.reduce((sum, item) => sum + item.price * item.quantity, 0),
    [items]
  );

  const itemCount = useMemo(
    () => items.reduce((count, item) => count + item.quantity, 0),
    [items]
  );

  const isInCart = useCallback(
    (productId: string, variantId?: string) => {
      if (variantId) {
        return items.some(
          (i) => i.productId === productId && i.variantId === variantId
        );
      }
      // If no variantId, check if any variant of the product is in cart
      return items.some((i) => i.productId === productId);
    },
    [items]
  );

  const getItemQuantity = useCallback(
    (productId: string, variantId: string) => {
      const item = items.find(
        (i) => i.productId === productId && i.variantId === variantId
      );
      return item?.quantity || 0;
    },
    [items]
  );

  const value = useMemo(
    () => ({
      items,
      addItem,
      removeItem,
      updateQuantity,
      clearCart,
      subtotal,
      itemCount,
      isInCart,
      getItemQuantity,
    }),
    [
      items,
      addItem,
      removeItem,
      updateQuantity,
      clearCart,
      subtotal,
      itemCount,
      isInCart,
      getItemQuantity,
    ]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
