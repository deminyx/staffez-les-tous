"use client";

import { createContext, useContext, useState, useCallback } from "react";

import type { CartItem } from "@/types";

interface CartContextType {
  items: CartItem[];
  addItem: (item: CartItem) => void;
  removeItem: (variantId: string) => void;
  updateQuantity: (variantId: string, quantity: number) => void;
  clearCart: () => void;
  totalCents: number;
  itemCount: number;
}

const CartContext = createContext<CartContextType | null>(null);

export const useCart = () => {
  const ctx = useContext(CartContext);
  if (!ctx) {
    throw new Error("useCart doit etre utilise dans un CartProvider");
  }
  return ctx;
};

interface CartProviderProps {
  children: React.ReactNode;
}

export const CartProvider = ({ children }: CartProviderProps) => {
  const [items, setItems] = useState<CartItem[]>([]);

  const addItem = useCallback((item: CartItem) => {
    setItems((prev) => {
      const existing = prev.find((i) => i.variantId === item.variantId);
      if (existing) {
        return prev.map((i) =>
          i.variantId === item.variantId
            ? { ...i, quantity: Math.min(i.quantity + item.quantity, i.stock) }
            : i,
        );
      }
      return [...prev, item];
    });
  }, []);

  const removeItem = useCallback((variantId: string) => {
    setItems((prev) => prev.filter((i) => i.variantId !== variantId));
  }, []);

  const updateQuantity = useCallback((variantId: string, quantity: number) => {
    if (quantity <= 0) {
      setItems((prev) => prev.filter((i) => i.variantId !== variantId));
      return;
    }
    setItems((prev) =>
      prev.map((i) =>
        i.variantId === variantId ? { ...i, quantity: Math.min(quantity, i.stock) } : i,
      ),
    );
  }, []);

  const clearCart = useCallback(() => {
    setItems([]);
  }, []);

  const totalCents = items.reduce((sum, i) => sum + i.unitPrice * i.quantity, 0);
  const itemCount = items.reduce((sum, i) => sum + i.quantity, 0);

  return (
    <CartContext.Provider
      value={{ items, addItem, removeItem, updateQuantity, clearCart, totalCents, itemCount }}
    >
      {children}
    </CartContext.Provider>
  );
};
