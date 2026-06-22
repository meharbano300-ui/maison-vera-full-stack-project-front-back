import { apiFetch } from "./client.js";

const FALLBACK_METHODS = [
  { code: "standard", label: "Standard delivery", eta: "5 — 7 working days", price: 0, note: "Complimentary on all orders" },
  { code: "express", label: "Express delivery", eta: "2 — 3 working days", price: 35, note: "Insured, signature required" },
  { code: "concierge", label: "White glove concierge", eta: "Next working day", price: 95, note: "Hand delivered in Milan, Paris, Geneva, London, New York" },
];

export async function fetchShippingMethods() {
  try {
    const methods = await apiFetch("/shipping");
    return methods.length ? methods : FALLBACK_METHODS;
  } catch {
    return FALLBACK_METHODS;
  }
}
