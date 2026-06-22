import { apiFetch } from "./client.js";
import { normalizeOrder } from "./transformers.js";

export async function createOrder(payload) {
  const order = await apiFetch("/orders", {
    method: "POST",
    body: payload,
  });
  return normalizeOrder(order);
}

export async function cancelOrder(orderId) {
  const order = await apiFetch(`/orders/${encodeURIComponent(orderId)}/cancel`, {
    method: "PATCH",
  });
  return normalizeOrder(order);
}

export async function fetchOrder(orderId) {
  const order = await apiFetch(`/orders/${encodeURIComponent(orderId)}`);
  return normalizeOrder(order);
}
