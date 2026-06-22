import { apiFetch } from "./client.js";
import { normalizeProduct, normalizeProducts } from "./transformers.js";

// NOTE: These calls used to silently fall back to hardcoded `staticProducts`
// data whenever the backend request failed (server down, DB not connected, wrong
// API URL, etc). That made the storefront *look* like it was working — pages
// rendered with products — while nothing was actually coming from MongoDB.
// Any product added in the admin panel would also vanish on refresh, because it
// only ever lived in memory/localStorage and was never persisted.
//
// We now let the error propagate so the real cause (backend not running, DB not
// connected, wrong VITE_API_URL, etc) is visible instead of being masked.

export async function fetchProducts(params = {}) {
  const qs = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined && value !== "") qs.set(key, String(value));
  }
  const query = qs.toString();
  const data = await apiFetch(`/products${query ? `?${query}` : ""}`);
  return normalizeProducts(data);
}

export async function fetchProduct(id) {
  const data = await apiFetch(`/products/${encodeURIComponent(id)}`);
  return normalizeProduct(data);
}

export async function fetchCategories() {
  return apiFetch("/categories");
}

export async function addProduct(productData) {
  return await apiFetch("/products", {
    method: "POST",
    body: productData,
    admin: true, // Kyunki admin token zaroori hai product add karne ke liye
  });
}