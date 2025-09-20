import React, { createContext, useContext, useEffect, useMemo, useState, useCallback } from 'react';
import { addToCart as apiAdd, getCart as apiGet, removeFromCart as apiRemove, updateCartItem as apiUpdate } from '../api/cart';
import { STORAGE_KEYS, calculateCartSubtotal, calculateTotalCartQuantity, findCartItem } from '../utils/cart';

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const [items, setItems] = useState(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEYS.CART_ITEMS);
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  });
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const persist = useCallback(next => {
    setItems(next);
    try {
      localStorage.setItem(STORAGE_KEYS.CART_ITEMS, JSON.stringify(next));
    } catch {}
  }, []);

  const refresh = useCallback(async () => {
    setLoading(true);
    try {
      const data = await apiGet();
      persist(Array.isArray(data) ? data : []);
    } finally {
      setLoading(false);
    }
  }, [persist]);

  useEffect(() => {
    refresh();
  }, []);

  const subtotal = useMemo(() => calculateCartSubtotal(items), [items]);
  const totalQuantity = useMemo(() => calculateTotalCartQuantity(items), [items]);

  const add = useCallback(async (productId, { quantity = 1, color, size } = {}) => {
    setItems(prev => {
      const existing = findCartItem(prev, productId, { color, size });
      if (existing) {
        return prev.map(it =>
          it.id === productId && (it.color || '') === (color || '') && (it.size || '') === (size || '')
            ? { ...it, quantity: (it.quantity || 0) + quantity }
            : it,
        );
      }
      return [
        ...prev,
        { id: productId, quantity, color, size },
      ];
    });
    try {
      await apiAdd(productId, { quantity, color, size });
      await refresh();
    } finally {
      setOpen(true);
    }
  }, [refresh]);

  const increment = useCallback(async (productId, currentQuantity) => {
    await apiUpdate(productId, { quantity: currentQuantity + 1 });
    await refresh();
  }, [refresh]);

  const decrement = useCallback(async (productId, currentQuantity) => {
    const next = Math.max(1, currentQuantity - 1);
    await apiUpdate(productId, { quantity: next });
    await refresh();
  }, [refresh]);

  const remove = useCallback(async (productId) => {
    await apiRemove(productId);
    await refresh();
  }, [refresh]);

  const value = { items, subtotal, totalQuantity, open, setOpen, loading, add, increment, decrement, remove, refresh };
  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCartContext() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCartContext must be used within CartProvider');
  return ctx;
}


