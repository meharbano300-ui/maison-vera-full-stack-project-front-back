export const PERMISSIONS = {
  DASHBOARD: "dashboard:read",
  ANALYTICS: "analytics:read",
  ORDERS: "orders:manage",
  CUSTOMERS: "customers:manage",
  PRODUCTS: "products:manage",
  COUPONS: "coupons:manage",
  REVIEWS: "reviews:manage",
  INVENTORY: "inventory:manage",
  SHIPPING: "shipping:manage",
  VENDORS: "vendors:manage",
  CMS: "cms:manage",
  REPORTS: "reports:read",
  ROLES: "roles:manage",
  ALL: "*",
};

export const DEFAULT_ROLES = [
  {
    name: "Super Admin",
    description: "Full access to all admin features",
    permissions: [PERMISSIONS.ALL],
    isSystem: true,
  },
  {
    name: "Catalogue Manager",
    description: "Manage products, inventory and reviews",
    permissions: [
      PERMISSIONS.DASHBOARD,
      PERMISSIONS.PRODUCTS,
      PERMISSIONS.INVENTORY,
      PERMISSIONS.REVIEWS,
    ],
    isSystem: true,
  },
  {
    name: "Commerce Manager",
    description: "Manage orders, customers, coupons and shipping",
    permissions: [
      PERMISSIONS.DASHBOARD,
      PERMISSIONS.ORDERS,
      PERMISSIONS.CUSTOMERS,
      PERMISSIONS.COUPONS,
      PERMISSIONS.SHIPPING,
      PERMISSIONS.REPORTS,
    ],
    isSystem: true,
  },
  {
    name: "Content Editor",
    description: "Manage CMS pages and reviews",
    permissions: [PERMISSIONS.CMS, PERMISSIONS.REVIEWS],
    isSystem: true,
  },
];
