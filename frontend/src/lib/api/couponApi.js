import { apiFetch } from "./client.js";

export async function validateCoupon(code, subtotal) {
  return apiFetch("/coupons/validate", {
    method: "POST",
    body: { code, subtotal },
  });
}
