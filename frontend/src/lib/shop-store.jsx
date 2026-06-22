import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { toast } from "sonner";

import { updateWishlist } from "./api/userApi";
import { getStoredUserEmail } from "./api/client";

















const ShopCtx = createContext(null);

export function ShopProvider({ children }) {
  const [cart, setCart] = useState([]);
  const [wishlist, setWishlist] = useState([]);

  useEffect(() => {
    try {
      const c = localStorage.getItem("maison_cart");
      const w = localStorage.getItem("maison_wish");
      if (c) setCart(JSON.parse(c));
      if (w) setWishlist(JSON.parse(w));
    } catch {}
  }, []);

  useEffect(() => {
    localStorage.setItem("maison_cart", JSON.stringify(cart));
  }, [cart]);
  useEffect(() => {
    localStorage.setItem("maison_wish", JSON.stringify(wishlist));
    const email = getStoredUserEmail();
    if (email) {
      updateWishlist(email, wishlist).catch(() => {});
    }
  }, [wishlist]);

  const value = useMemo(() => ({
    cart,
    wishlist,
    cartCount: cart.reduce((s, i) => s + i.qty, 0),
    wishlistCount: wishlist.length,
    subtotal: cart.reduce((s, i) => s + i.qty * i.product.price, 0),
    addToCart: (p, size) => {
      setCart((prev) => {
        const found = prev.find((x) => x.product.id === p.id && x.size === size);
        if (found) return prev.map((x) => x === found ? { ...x, qty: x.qty + 1 } : x);
        return [...prev, { product: p, qty: 1, size }];
      });
      toast.success("Added to your atelier bag", { description: p.name });
    },
    removeFromCart: (id) => setCart((prev) => prev.filter((x) => x.product.id !== id)),
    updateQty: (id, size, qty) =>
    setCart((prev) =>
    qty <= 0 ?
    prev.filter((x) => !(x.product.id === id && x.size === size)) :
    prev.map((x) => x.product.id === id && x.size === size ? { ...x, qty } : x)
    ),
    clearCart: () => setCart([]),
    toggleWishlist: (p) => {
      setWishlist((prev) => {
        if (prev.includes(p.id)) {
          toast("Removed from wishlist");
          return prev.filter((x) => x !== p.id);
        }
        toast.success("Saved to wishlist", { description: p.name });
        return [...prev, p.id];
      });
    },
    inWishlist: (id) => wishlist.includes(id)
  }), [cart, wishlist]);

  return <ShopCtx.Provider value={value}>{children}</ShopCtx.Provider>;
}

export function useShop() {
  const ctx = useContext(ShopCtx);
  if (!ctx) throw new Error("useShop must be used inside ShopProvider");
  return ctx;
}