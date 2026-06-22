import { apiFetch } from "./client.js";

export async function submitContactMessage(payload) {
  return apiFetch("/cms/contact", {
    method: "POST",
    body: payload,
  });
}

export async function fetchPublishedPage(slug) {
  return apiFetch(`/cms/pages/${encodeURIComponent(slug)}`);
}

export async function fetchPublishedPages() {
  return apiFetch("/cms/pages");
}
