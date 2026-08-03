import { createContext, useContext, useState, useCallback } from 'react';
import { getProductPrice } from '../api';
import { toastCart } from '../utils/toast.js';

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const [items, setItems] = useState([]);
  const [wishlist, setWishlist] = useState([]);

  const addToCart = useCallback((product, count = 1, selectedSize = null) => {
    const chosenSize = selectedSize || product.selectedSize || 'Standard';
    setItems((prev) => {
      const existing = prev.find(
        (i) => i._id === product._id && (i.selectedSize || 'Standard') === chosenSize
      );
      if (existing) {
        return prev.map((i) =>
          i._id === product._id && (i.selectedSize || 'Standard') === chosenSize
            ? { ...i, quantity: i.quantity + count }
            : i
        );
      }
      return [...prev, { ...product, quantity: count, selectedSize: chosenSize }];
    });
    toastCart(`${product.name} (${chosenSize})`, null);
  }, []);

  // Silent version — no toast
  const addToCartSilent = useCallback((product, count = 1, selectedSize = null) => {
    const chosenSize = selectedSize || product.selectedSize || 'Standard';
    setItems((prev) => {
      const existing = prev.find(
        (i) => i._id === product._id && (i.selectedSize || 'Standard') === chosenSize
      );
      if (existing) {
        return prev.map((i) =>
          i._id === product._id && (i.selectedSize || 'Standard') === chosenSize
            ? { ...i, quantity: i.quantity + count }
            : i
        );
      }
      return [...prev, { ...product, quantity: count, selectedSize: chosenSize }];
    });
  }, []);

  const removeFromCart = useCallback((productId) => {
    setItems((prev) => prev.filter((i) => i._id !== productId));
  }, []);

  const updateQuantity = useCallback((productId, quantity) => {
    if (quantity < 1) return;
    setItems((prev) =>
      prev.map((i) => (i._id === productId ? { ...i, quantity } : i))
    );
  }, []);

  const clearCart = useCallback(() => setItems([]), []);

  const toggleWishlist = useCallback((product) => {
    setWishlist((prev) => {
      const exists = prev.some((p) => p._id === product._id);
      if (exists) return prev.filter((p) => p._id !== product._id);
      return [...prev, product];
    });
  }, []);

  const isInWishlist = useCallback(
    (productId) => wishlist.some((p) => p._id === productId),
    [wishlist]
  );

  const cartCount = items.reduce((sum, i) => sum + i.quantity, 0);
  const cartTotal = items.reduce((sum, i) => sum + getProductPrice(i) * i.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        items,
        cartItems: items,
        wishlist,
        cartCount,
        cartTotal,
        addToCart,
        addToCartSilent,
        removeFromCart,
        updateQuantity,
        clearCart,
        toggleWishlist,
        isInWishlist,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within CartProvider');
  return ctx;
}
