import { products as staticProducts } from "../products";

const imageById = Object.fromEntries(staticProducts.map((p) => [p.id, p.image]));
const imageByFilename = Object.fromEntries(
  staticProducts.map((p) => {
    const filename = p.image.split("/").pop();
    return [filename, p.image];
  }),
);

export function resolveProductImage(product) {
  if (!product) return "";
  const { image, id } = product;
  if (!image) return imageById[id] || "";
  if (image.startsWith("data:") || image.startsWith("http") || image.startsWith("/src/")) return image;
  if (imageById[id]) return imageById[id];
  const filename = image.split("/").pop();
  if (filename && imageByFilename[filename]) return imageByFilename[filename];
  return image;
}

export function normalizeProduct(product) {
  if (!product) return product;
  return {
    ...product,
    image: resolveProductImage(product),
    oldPrice: product.oldPrice ?? undefined,
    badge: product.badge ?? undefined,
    sizes: product.sizes?.length ? product.sizes : undefined,
  };
}

export function normalizeProducts(products) {
  return (products || []).map(normalizeProduct);
}

export function normalizeOrder(order) {
  if (!order) return order;
  return {
    id: order.orderId || order.id,
    orderId: order.orderId || order.id,
    date: order.date,
    total: order.total,
    status: order.status,
    items: (order.items || []).map((item) => ({
      name: item.name,
      qty: item.qty,
      price: item.price,
      image: item.image ? resolveProductImage({ image: item.image, id: item.productId }) : undefined,
      productId: item.productId,
      size: item.size,
    })),
    userEmail: order.userEmail,
    userName: order.userName,
    subtotal: order.subtotal,
    shippingCost: order.shippingCost,
    discount: order.discount,
    couponCode: order.couponCode,
    deliveryMethod: order.deliveryMethod,
    paymentMethod: order.paymentMethod,
    shippingAddress: order.shippingAddress,
  };
}

export function normalizeUser(user) {
  if (!user) return user;
  return {
    profile: {
      name: user.name || "Maison Member",
      email: user.email,
      phone: user.phone || "",
      dob: user.dob || "",
      language: user.language || "English (UK)",
      currency: user.currency || "EUR · €",
      memberSince: user.memberSince || new Date(user.createdAt).getFullYear().toString(),
      twoFactor: user.twoFactor || false,
    },
    addresses: (user.addresses || []).map((a) => ({
      id: a._id || a.id,
      label: a.label || "Address",
      name: a.name || "",
      line1: a.line1 || "",
      city: a.city || "",
      zip: a.zip || "",
      country: a.country || "",
      phone: a.phone || "",
      isDefault: !!a.isDefault,
    })),
    cards: (user.cards || []).map((c) => ({
      id: c._id || c.id,
      brand: c.brand || "Card",
      last4: c.last4 || "0000",
      exp: c.exp || "",
      name: c.name || "",
      isDefault: !!c.isDefault,
    })),
    wishlist: user.wishlist || [],
    orderCount: user.orderCount || 0,
  };
}

export function toRegisteredUser(user) {
  return {
    email: user.email,
    name: user.name,
    phone: user.phone || "",
    joinedAt: user.memberSince || user.joinedAt || user.createdAt,
    lastSeen: user.lastSeen || "",
    status: user.status || "active",
    wishlist: user.wishlist || [],
    orderCount: user.orderCount || 0,
  };
}
