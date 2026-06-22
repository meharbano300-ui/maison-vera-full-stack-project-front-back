import { apiFetch } from "./client.js";

export async function fetchProductReviews(productId) {
  try {
    return apiFetch(`/reviews/product/${encodeURIComponent(productId)}`);
  } catch {
    return [];
  }
}

export async function submitReview({ productId, productName, userName, userEmail, rating, comment }) {
  return apiFetch("/reviews", {
    method: "POST",
    body: { productId, productName, userName, userEmail, rating, comment },
  });
}
