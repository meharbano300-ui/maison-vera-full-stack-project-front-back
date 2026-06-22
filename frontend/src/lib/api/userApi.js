import { apiFetch } from "./client.js";
import { normalizeUser, normalizeOrder } from "./transformers.js";

export async function fetchUser(email) {
  const user = await apiFetch(`/users/${encodeURIComponent(email)}`);
  return normalizeUser(user);
}

export async function updateProfile(email, profile) {
  const user = await apiFetch(`/users/${encodeURIComponent(email)}/profile`, {
    method: "PATCH",
    body: profile,
  });
  return normalizeUser(user);
}

export async function addAddress(email, address) {
  const user = await apiFetch(`/users/${encodeURIComponent(email)}/addresses`, {
    method: "POST",
    body: address,
  });
  return normalizeUser(user);
}

export async function updateAddress(email, addressId, address) {
  const user = await apiFetch(`/users/${encodeURIComponent(email)}/addresses/${addressId}`, {
    method: "PATCH",
    body: address,
  });
  return normalizeUser(user);
}

export async function removeAddress(email, addressId) {
  const user = await apiFetch(`/users/${encodeURIComponent(email)}/addresses/${addressId}`, {
    method: "DELETE",
  });
  return normalizeUser(user);
}

export async function setDefaultAddress(email, addressId) {
  const user = await apiFetch(`/users/${encodeURIComponent(email)}/addresses/${addressId}/default`, {
    method: "PATCH",
  });
  return normalizeUser(user);
}

export async function addCard(email, card) {
  const user = await apiFetch(`/users/${encodeURIComponent(email)}/cards`, {
    method: "POST",
    body: card,
  });
  return normalizeUser(user);
}

export async function removeCard(email, cardId) {
  const user = await apiFetch(`/users/${encodeURIComponent(email)}/cards/${cardId}`, {
    method: "DELETE",
  });
  return normalizeUser(user);
}

export async function setDefaultCard(email, cardId) {
  const user = await apiFetch(`/users/${encodeURIComponent(email)}/cards/${cardId}/default`, {
    method: "PATCH",
  });
  return normalizeUser(user);
}

export async function updateWishlist(email, wishlist) {
  const user = await apiFetch(`/users/${encodeURIComponent(email)}/wishlist`, {
    method: "PATCH",
    body: { wishlist },
  });
  return normalizeUser(user);
}

export async function deleteAccount(email) {
  return apiFetch(`/users/${encodeURIComponent(email)}`, { method: "DELETE" });
}

export async function fetchUserOrders(email) {
  const orders = await apiFetch(`/orders/user/${encodeURIComponent(email)}`);
  return orders.map(normalizeOrder);
}
