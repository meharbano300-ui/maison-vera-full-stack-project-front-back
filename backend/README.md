# Maison Vera — Backend API

Complete MongoDB + Express backend for the Maison Vera e-commerce website.

**Frontend is untouched** — this backend runs independently. Connect when ready.

## Requirements

- Node.js 18+
- MongoDB running locally (default: `mongodb://127.0.0.1:27017`)

## Quick Start

```bash
cd backend
npm install
copy .env.example .env
npm run seed
npm run dev
```

API runs at **http://localhost:5000**

Health check: **http://localhost:5000/api/health**

## Admin Login

| Field | Value |
|-------|-------|
| Email | `admin@maisonvera.com` |
| Password | `admin123` |

Legacy password-only login (matches frontend admin): `POST /api/auth/admin/password-login` with `{ "password": "admin123" }`

## MongoDB Seed

```bash
npm run seed
```

This clears and repopulates:
- 38 products (matching frontend catalogue)
- 6 categories
- 3 vendors
- 3 coupons
- 5 CMS pages
- Sample users, orders, reviews, shipments
- Admin user + 4 roles with permissions

## MongoDB Import (JSON export)

After seeding, export JSON files for mongoimport:

```bash
npm run seed
npm run export-mongo
```

Files are saved in `backend/mongo-import/`.

## API Endpoints

### Store (Public)

- `GET /api/health` — Health check
- `GET /api/products` — List products
- `GET /api/products/:id` — Single product
- `GET /api/categories` — All categories
- `POST /api/orders` — Place order
- `POST /api/coupons/validate` — Validate coupon

### Admin (Bearer token)

- Revenue Dashboard: `GET /api/admin/dashboard`
- Analytics: `GET /api/admin/analytics`
- Orders: `GET/PATCH /api/admin/orders`
- Customers: `GET/PATCH/DELETE /api/admin/customers`
- Products: `GET/POST/PATCH/DELETE /api/admin/products`
- Coupons: `GET/POST/PATCH/DELETE /api/admin/coupons`
- Reviews: `GET/PATCH/DELETE /api/admin/reviews`
- Inventory: `GET/PATCH /api/admin/inventory`
- Shipping: `GET/POST/PATCH/DELETE /api/admin/shipping/methods` & `GET/POST /api/admin/shipping/shipments`
- Vendors: `GET/POST/PATCH /api/admin/vendors`
- CMS: `GET/POST/PATCH/DELETE /api/admin/cms/pages`
- Contact messages: `GET/PATCH/DELETE /api/admin/contact-messages`
- Admin users: `GET/POST/PATCH /api/admin/admins`
- Categories (admin): `GET/POST/PATCH/DELETE /api/admin/categories`
- Reports: `GET /api/admin/reports/sales|inventory|customers`
- Roles: `GET/POST/PATCH /api/admin/roles`

## Environment Variables

See `.env.example` for all options.
