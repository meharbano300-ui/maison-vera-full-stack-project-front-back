import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import { products as staticProducts } from "./products";
import { toast } from "sonner";
import { adminPasswordLogin, adminLogout } from "./api/authApi";
import { fetchAdminProducts, createProduct, updateProduct as apiUpdateProduct, deleteProduct as apiDeleteProduct } from "./api/adminApi";
import { fetchProducts } from "./api/productApi";
import { getAdminToken } from "./api/client";

const AUTH_KEY = "maison_admin_auth";

// Added _id optional extension to the type to handle MongoDB Object IDs safely















const AdminCtx = createContext(null);

export function AdminProvider({ children }) {
  const [isAuth, setIsAuth] = useState(() => {
    try {
      return localStorage.getItem(AUTH_KEY) === "1" && !!getAdminToken();
    } catch {
      return false;
    }
  });
  // NOTE: We intentionally do NOT seed this with the static dummy catalog
  // anymore. Doing that made the storefront flash a full fake product list
  // on every load, which then got replaced (and looked like it "vanished")
  // the moment the real backend response came in. Starting from an empty
  // array + loading=true gives an honest loading state instead.
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  // True only until the very first product load finishes (success OR
  // failure). The root layout uses this to hold off rendering any page —
  // every page on the site reads `products` from this context, so if a
  // page rendered before the first load finished, it could crash on an
  // empty array (e.g. code that assumes "there's at least 1 product").
  // This flag is NOT reused for later refreshes (add/edit/delete), so the
  // rest of the app doesn't flicker to a loading screen after the first load.
  const [initializing, setInitializing] = useState(true);

  // Use a ref to always have current isAuth value without causing refreshProducts to change
  const isAuthRef = useRef(isAuth);
  useEffect(() => {
    isAuthRef.current = isAuth;
  }, [isAuth]);

  // refreshProducts does NOT depend on isAuth in its dep array —
  // it reads isAuthRef.current instead, so it stays stable and avoids
  // the infinite re-render / race condition on the login page.
  const refreshProducts = useCallback(async () => {
    setLoading(true);
    try {
      const data = isAuthRef.current ? await fetchAdminProducts() : await fetchProducts();
      setProducts(data);
    } catch (err) {
      // Show a toast but do NOT re-throw — throwing here propagates up to
      // TanStack Router's error boundary and replaces the login page with
      // the root errorComponent, which is the intermittent blank / error
      // screen users were seeing.
      toast.error(
        err instanceof Error ?
        `Could not load products from the server: ${err.message}` :
        "Could not load products from the server. Is the backend running and connected to MongoDB?"
      );
    } finally {
      setLoading(false);
    }
  }, []); // stable — no deps

  // Only run once on mount
  useEffect(() => {
    refreshProducts().finally(() => setInitializing(false));
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const value = useMemo(() => ({
    isAuth,
    loading,
    initializing,
    login: async (password) => {
      try {
        await adminPasswordLogin(password);
        setIsAuth(true);
        isAuthRef.current = true;
        localStorage.setItem(AUTH_KEY, "1");
        await refreshProducts();
        return true;
      } catch {
        return false;
      }
    },
    logout: () => {
      adminLogout();
      setIsAuth(false);
      isAuthRef.current = false;
      localStorage.removeItem(AUTH_KEY);
      refreshProducts();
    },
    products,
    refreshProducts,
    addProduct: async (p) => {
      try {
        const id = `admin-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
        await createProduct({ ...p, id, isActive: true, stock: 100, lowStockThreshold: 10 });
        await refreshProducts();
        toast.success("Product added to the Maison");
      } catch (err) {
        toast.error(err instanceof Error ? err.message : "Failed to add product");
      }
    },
    updateProduct: async (id, partial) => {
      try {
        // Find the product in local state first to see if it has a MongoDB _id
        const targetProduct = products.find((p) => p.id === id || p._id === id);
        const actualId = targetProduct?._id || targetProduct?.id || id;

        await apiUpdateProduct(actualId, partial);
        await refreshProducts();
        toast.success("Product updated");
      } catch (err) {
        toast.error(err instanceof Error ? err.message : "Failed to update product");
      }
    },
    deleteProduct: async (id) => {
      try {
        // Backend uses custom 'id' field (e.g. "admin-1234567"), not MongoDB _id
        // Always find the product and use its custom 'id' field
        const targetProduct = products.find((p) => p.id === id || p._id === id);
        const actualId = targetProduct?.id || id;

        await apiDeleteProduct(actualId);
        await refreshProducts();
        toast.success("Product removed from the Maison");
      } catch (err) {
        toast.error(err instanceof Error ? err.message : "Failed to delete product");
      }
    },
    resetToDefaults: () => {
      toast.info("Catalogue is managed in the database. Re-seed via npm run seed.");
    }
  }), [isAuth, loading, initializing, products, refreshProducts]);

  return <AdminCtx.Provider value={value}>{children}</AdminCtx.Provider>;
}

export function useAdmin() {
  const ctx = useContext(AdminCtx);
  if (!ctx) throw new Error("useAdmin must be used inside AdminProvider");
  return ctx;
}

export function useAdminProducts() {
  const ctx = useContext(AdminCtx);
  return ctx?.products ?? staticProducts;
}

export async function getAdminProducts() {
  return await fetchProducts();
}