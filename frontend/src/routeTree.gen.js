/* eslint-disable */
// @ts-nocheck

import { createRoute } from "@tanstack/react-router";
import { Route as rootRouteImport } from './routes/__root';
import { Route as SignupRouteImport } from './routes/signup';
import { Route as ShopRouteImport } from './routes/shop';
import { Route as ProfileRouteImport } from './routes/profile';
import { Route as LoginRouteImport } from './routes/login';
import { Route as ContactRouteImport } from './routes/contact';
import { Route as CheckoutRouteImport } from './routes/checkout';
import { Route as CategoriesRouteImport } from './routes/categories';
import { Route as AboutRouteImport } from './routes/about';
import { Route as IndexRouteImport } from './routes/index';
import { Route as ProductIdRouteImport } from './routes/product.$id';
import { Route as CategorySlugRouteImport } from './routes/category.$slug';
import { Route as BoutiqueSlugRouteImport } from './routes/boutique.$slug';

// Admin routes
import { Route as AdminLoginRouteImport } from './routes/admin/login';
import { Route as AdminIndexRouteImport } from './routes/admin/index';
import { Route as AdminProductsIndexRouteImport } from './routes/admin/products/index';
import { Route as AdminProductsNewRouteImport } from './routes/admin/products/new';
import { Route as AdminProductsIdEditRouteImport } from './routes/admin/products/$id/edit';
import { Route as AdminUsersIndexRouteImport } from './routes/admin/users/index';
import { Route as AdminOrdersIndexRouteImport } from './routes/admin/orders/index';
import { Route as AdminReviewsIndexRouteImport } from './routes/admin/reviews/index';
import { Route as AdminCouponsIndexRouteImport } from './routes/admin/coupons/index';
import { Route as AdminMessagesIndexRouteImport } from './routes/admin/messages/index';

// === Public routes (direct children of root) ===

const SignupRoute = SignupRouteImport.update({
  id: '/signup',
  path: '/signup',
  getParentRoute: () => rootRouteImport
});

const ShopRoute = ShopRouteImport.update({
  id: '/shop',
  path: '/shop',
  getParentRoute: () => rootRouteImport
});

const ProfileRoute = ProfileRouteImport.update({
  id: '/profile',
  path: '/profile',
  getParentRoute: () => rootRouteImport
});

const LoginRoute = LoginRouteImport.update({
  id: '/login',
  path: '/login',
  getParentRoute: () => rootRouteImport
});

const ContactRoute = ContactRouteImport.update({
  id: '/contact',
  path: '/contact',
  getParentRoute: () => rootRouteImport
});

const CheckoutRoute = CheckoutRouteImport.update({
  id: '/checkout',
  path: '/checkout',
  getParentRoute: () => rootRouteImport
});

const CategoriesRoute = CategoriesRouteImport.update({
  id: '/categories',
  path: '/categories',
  getParentRoute: () => rootRouteImport
});

const AboutRoute = AboutRouteImport.update({
  id: '/about',
  path: '/about',
  getParentRoute: () => rootRouteImport
});

const IndexRoute = IndexRouteImport.update({
  id: '/',
  path: '/',
  getParentRoute: () => rootRouteImport
});

const ProductIdRoute = ProductIdRouteImport.update({
  id: '/product/$id',
  path: '/product/$id',
  getParentRoute: () => rootRouteImport
});

const CategorySlugRoute = CategorySlugRouteImport.update({
  id: '/category/$slug',
  path: '/category/$slug',
  getParentRoute: () => rootRouteImport
});

const BoutiqueSlugRoute = BoutiqueSlugRouteImport.update({
  id: '/boutique/$slug',
  path: '/boutique/$slug',
  getParentRoute: () => rootRouteImport
});

// === Admin routes — properly nested ===
// Create an invisible layout route for /admin
const adminLayoutRoute = createRoute({
  getParentRoute: () => rootRouteImport,
  path: '/admin'
});

// Create /admin/products layout
const adminProductsLayoutRoute = createRoute({
  getParentRoute: () => adminLayoutRoute,
  path: '/products'
});

// Create /admin/products/$id layout
const adminProductsIdLayoutRoute = createRoute({
  getParentRoute: () => adminProductsLayoutRoute,
  path: '/$id'
});

const AdminLoginRoute = AdminLoginRouteImport.update({
  id: '/admin/login',
  path: '/login',
  getParentRoute: () => adminLayoutRoute
});

const AdminIndexRoute = AdminIndexRouteImport.update({
  id: '/admin/',
  path: '/',
  getParentRoute: () => adminLayoutRoute
});

const AdminProductsIndexRoute = AdminProductsIndexRouteImport.update({
  id: '/admin/products/',
  path: '/',
  getParentRoute: () => adminProductsLayoutRoute
});

const AdminProductsNewRoute = AdminProductsNewRouteImport.update({
  id: '/admin/products/new',
  path: '/new',
  getParentRoute: () => adminProductsLayoutRoute
});

const AdminProductsIdEditRoute = AdminProductsIdEditRouteImport.update({
  id: '/admin/products/$id/edit',
  path: '/edit',
  getParentRoute: () => adminProductsIdLayoutRoute
});

// Create /admin/users layout
const adminUsersLayoutRoute = createRoute({
  getParentRoute: () => adminLayoutRoute,
  path: '/users'
});

const AdminUsersIndexRoute = AdminUsersIndexRouteImport.update({
  id: '/admin/users/',
  path: '/',
  getParentRoute: () => adminUsersLayoutRoute
});

// Create /admin/orders layout
const adminOrdersLayoutRoute = createRoute({
  getParentRoute: () => adminLayoutRoute,
  path: '/orders'
});

const AdminOrdersIndexRoute = AdminOrdersIndexRouteImport.update({
  id: '/admin/orders/',
  path: '/',
  getParentRoute: () => adminOrdersLayoutRoute
});

// Create /admin/reviews layout
const adminReviewsLayoutRoute = createRoute({
  getParentRoute: () => adminLayoutRoute,
  path: '/reviews'
});

const AdminReviewsIndexRoute = AdminReviewsIndexRouteImport.update({
  id: '/admin/reviews/',
  path: '/',
  getParentRoute: () => adminReviewsLayoutRoute
});

// Create /admin/coupons layout
const adminCouponsLayoutRoute = createRoute({
  getParentRoute: () => adminLayoutRoute,
  path: '/coupons'
});

const AdminCouponsIndexRoute = AdminCouponsIndexRouteImport.update({
  id: '/admin/coupons/',
  path: '/',
  getParentRoute: () => adminCouponsLayoutRoute
});

// Create /admin/messages layout
const adminMessagesLayoutRoute = createRoute({
  getParentRoute: () => adminLayoutRoute,
  path: '/messages'
});

const AdminMessagesIndexRoute = AdminMessagesIndexRouteImport.update({
  id: '/admin/messages/',
  path: '/',
  getParentRoute: () => adminMessagesLayoutRoute
});

export const routeTree = rootRouteImport.addChildren([
IndexRoute,
AboutRoute,
CategoriesRoute,
CheckoutRoute,
ContactRoute,
LoginRoute,
ProfileRoute,
ShopRoute,
SignupRoute,
ProductIdRoute,
CategorySlugRoute,
BoutiqueSlugRoute,
adminLayoutRoute.addChildren([
AdminLoginRoute,
AdminIndexRoute,
adminProductsLayoutRoute.addChildren([
AdminProductsIndexRoute,
AdminProductsNewRoute,
adminProductsIdLayoutRoute.addChildren([
AdminProductsIdEditRoute]
)]
),
adminUsersLayoutRoute.addChildren([
AdminUsersIndexRoute]
),
adminOrdersLayoutRoute.addChildren([
AdminOrdersIndexRoute]
),
adminReviewsLayoutRoute.addChildren([
AdminReviewsIndexRoute]
),
adminCouponsLayoutRoute.addChildren([
AdminCouponsIndexRoute]
),
adminMessagesLayoutRoute.addChildren([
AdminMessagesIndexRoute]
)]
)]
);