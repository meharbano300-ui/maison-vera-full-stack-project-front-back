import { apiFetch } from "./client.js";

export async function registerVendor({ name, email, phone, description }) {
  return apiFetch("/auth/vendors/register", {
    method: "POST",
    body: { name, email, phone, description },
  });
}
