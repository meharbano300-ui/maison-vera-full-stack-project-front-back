import { apiFetch } from "./client.js";
import { normalizeProduct, normalizeProducts, normalizeOrder, toRegisteredUser } from "./transformers.js";

export async function fetchDashboard() {
  return apiFetch("/admin/dashboard", { admin: true });
}

export async function fetchAnalytics() {
  return apiFetch("/admin/analytics", { admin: true });
}

export async function fetchAdminProducts() {
  const data = await apiFetch("/admin/products", { admin: true });
  return normalizeProducts(data);
}

export async function createProduct(product) {
  const data = await apiFetch("/admin/products", {
    admin: true,
    method: "POST",
    body: product,
  });
  return normalizeProduct(data);
}

export async function updateProduct(id, partial) {
  const data = await apiFetch(`/admin/products/${encodeURIComponent(id)}`, {
    admin: true,
    method: "PATCH",
    body: partial,
  });
  return normalizeProduct(data);
}

export async function deleteProduct(id) {
  return apiFetch(`/admin/products/${encodeURIComponent(id)}`, {
    admin: true,
    method: "DELETE",
  });
}

export async function fetchAdminOrders(params = {}) {
  const qs = new URLSearchParams(params).toString();
  const data = await apiFetch(`/admin/orders${qs ? `?${qs}` : ""}`, { admin: true });
  return data.map(normalizeOrder);
}

export async function updateOrderStatus(orderId, status) {
  const data = await apiFetch(`/admin/orders/${encodeURIComponent(orderId)}/status`, {
    admin: true,
    method: "PATCH",
    body: { status },
  });
  return normalizeOrder(data);
}

export async function fetchCustomers(params = {}) {
  const qs = new URLSearchParams(params).toString();
  const data = await apiFetch(`/admin/customers${qs ? `?${qs}` : ""}`, { admin: true });
  return data.map(toRegisteredUser);
}

export async function blockCustomer(email) {
  return apiFetch(`/admin/customers/${encodeURIComponent(email)}/block`, {
    admin: true,
    method: "PATCH",
  });
}

export async function unblockCustomer(email) {
  return apiFetch(`/admin/customers/${encodeURIComponent(email)}/unblock`, {
    admin: true,
    method: "PATCH",
  });
}

export async function deleteCustomer(email) {
  return apiFetch(`/admin/customers/${encodeURIComponent(email)}`, {
    admin: true,
    method: "DELETE",
  });
}

export async function fetchCoupons() {
  return apiFetch("/admin/coupons", { admin: true });
}

export async function createCoupon(coupon) {
  return apiFetch("/admin/coupons", { admin: true, method: "POST", body: coupon });
}

export async function updateCoupon(code, updates) {
  return apiFetch(`/admin/coupons/${encodeURIComponent(code)}`, {
    admin: true,
    method: "PATCH",
    body: updates,
  });
}

export async function deleteCoupon(code) {
  return apiFetch(`/admin/coupons/${encodeURIComponent(code)}`, {
    admin: true,
    method: "DELETE",
  });
}

export async function fetchReviews(pending = false) {
  return apiFetch(`/admin/reviews${pending ? "?pending=true" : ""}`, { admin: true });
}

export async function approveReview(id) {
  return apiFetch(`/admin/reviews/${id}/approve`, { admin: true, method: "PATCH" });
}

export async function replyToReview(id, reply) {
  return apiFetch(`/admin/reviews/${id}/reply`, {
    admin: true,
    method: "PATCH",
    body: { reply },
  });
}

export async function deleteReview(id) {
  return apiFetch(`/admin/reviews/${id}`, { admin: true, method: "DELETE" });
}

export async function fetchInventory() {
  return apiFetch("/admin/inventory", { admin: true });
}

export async function fetchInventoryAlerts() {
  return apiFetch("/admin/inventory/alerts", { admin: true });
}

export async function updateInventory(id, stock, lowStockThreshold) {
  return apiFetch(`/admin/inventory/${encodeURIComponent(id)}`, {
    admin: true,
    method: "PATCH",
    body: { stock, lowStockThreshold },
  });
}

export async function fetchShippingMethods() {
  return apiFetch("/admin/shipping/methods", { admin: true });
}

export async function createShippingMethod(method) {
  return apiFetch("/admin/shipping/methods", {
    admin: true,
    method: "POST",
    body: method,
  });
}

export async function updateShippingMethod(id, updates) {
  return apiFetch(`/admin/shipping/methods/${id}`, {
    admin: true,
    method: "PATCH",
    body: updates,
  });
}

export async function deleteShippingMethod(id) {
  return apiFetch(`/admin/shipping/methods/${id}`, {
    admin: true,
    method: "DELETE",
  });
}

export async function fetchVendors() {
  return apiFetch("/admin/vendors", { admin: true });
}

export async function createVendor(vendor) {
  return apiFetch("/admin/vendors", { admin: true, method: "POST", body: vendor });
}

export async function updateVendor(slug, updates) {
  return apiFetch(`/admin/vendors/${encodeURIComponent(slug)}`, {
    admin: true,
    method: "PATCH",
    body: updates,
  });
}

export async function assignVendorProducts(slug, productIds, action = "assign") {
  return apiFetch(`/admin/vendors/${encodeURIComponent(slug)}/products`, {
    admin: true,
    method: "PATCH",
    body: { productIds, action },
  });
}

export async function fetchCmsPages() {
  return apiFetch("/admin/cms/pages", { admin: true });
}

export async function createCmsPage(page) {
  return apiFetch("/admin/cms/pages", { admin: true, method: "POST", body: page });
}

export async function updateCmsPage(slug, updates) {
  return apiFetch(`/admin/cms/pages/${encodeURIComponent(slug)}`, {
    admin: true,
    method: "PATCH",
    body: updates,
  });
}

export async function deleteCmsPage(slug) {
  return apiFetch(`/admin/cms/pages/${encodeURIComponent(slug)}`, {
    admin: true,
    method: "DELETE",
  });
}

export async function fetchSalesReport(params = {}) {
  const qs = new URLSearchParams(params).toString();
  return apiFetch(`/admin/reports/sales${qs ? `?${qs}` : ""}`, { admin: true });
}

export async function fetchInventoryReport() {
  return apiFetch("/admin/reports/inventory", { admin: true });
}

export async function fetchCustomerReport() {
  return apiFetch("/admin/reports/customers", { admin: true });
}

export async function fetchRoles() {
  return apiFetch("/admin/roles", { admin: true });
}

export async function fetchPermissions() {
  return apiFetch("/admin/permissions", { admin: true });
}

export async function createRole(role) {
  return apiFetch("/admin/roles", { admin: true, method: "POST", body: role });
}

export async function updateRole(id, updates) {
  return apiFetch(`/admin/roles/${id}`, { admin: true, method: "PATCH", body: updates });
}

export async function deleteRole(id) {
  return apiFetch(`/admin/roles/${id}`, { admin: true, method: "DELETE" });
}

export async function fetchContactMessages(unreadOnly = false) {
  return apiFetch(`/admin/contact-messages${unreadOnly ? "?unread=true" : ""}`, { admin: true });
}

export async function markContactMessageRead(id) {
  return apiFetch(`/admin/contact-messages/${id}/read`, { admin: true, method: "PATCH" });
}

export async function deleteContactMessage(id) {
  return apiFetch(`/admin/contact-messages/${id}`, { admin: true, method: "DELETE" });
}

export async function fetchShipments() {
  return apiFetch("/admin/shipping/shipments", { admin: true });
}

export async function createShipment(shipment) {
  return apiFetch("/admin/shipping/shipments", { admin: true, method: "POST", body: shipment });
}

export async function fetchAdminOrder(orderId) {
  const data = await apiFetch(`/admin/orders/${encodeURIComponent(orderId)}`, { admin: true });
  return normalizeOrder(data);
}

export async function fetchCustomerOrders(email) {
  const data = await apiFetch(`/admin/customers/${encodeURIComponent(email)}/orders`, { admin: true });
  return data.map(normalizeOrder);
}

export async function deleteVendor(slug) {
  return apiFetch(`/admin/vendors/${encodeURIComponent(slug)}`, { admin: true, method: "DELETE" });
}

export async function fetchAdminShippingMethods() {
  return apiFetch("/admin/shipping/methods", { admin: true });
}
