# Maison Vera — Full Stack Setup

This project has two parts that must **both be running** for anything (products, signups,
orders, etc) to actually be saved to MongoDB:

- **Frontend** — React + Vite, in `frontend/` (`frontend/src/`)
- **Backend** — Express + MongoDB API, in `backend/`

> All `npm run ...` commands below should be run from inside the **`frontend/`** folder
> (that's where `package.json` lives). So always `cd frontend` first.

If you only run the frontend (`npm run dev` in the root) and never start the backend, the
site will still *look* like it works — but nothing you add in the admin panel, and no
signups, will be saved anywhere. They'll disappear on refresh. This was the bug reported:
the admin panel and the storefront would silently keep working off of fallback demo data
whenever the backend/MongoDB wasn't reachable, instead of showing an error. That silent
fallback has now been removed — if the backend isn't running, you'll see a clear error
instead of fake data.

## 1. One-time setup

```bash
cd frontend
npm run install:all
```

This installs both the frontend and backend dependencies.

> Note: this template pins a beta version of Tailwind v4, which causes an npm peer-dependency
> warning. If `npm install` complains with `ERESOLVE`, use:
> `npm install --legacy-peer-deps` (root) — this is unrelated to the MongoDB issue.

## 2. Configure the backend

```bash
cd backend
cp .env.example .env
```

Open `backend/.env` and confirm `MONGODB_URI` points at your MongoDB instance. The default
assumes MongoDB is running locally:

```
MONGODB_URI=mongodb://127.0.0.1:27017/maison-vera
```

If you're using MongoDB Atlas (cloud), paste your Atlas connection string here instead.

**Make sure MongoDB is actually running** before starting the backend. If it isn't, the
backend will now fail immediately with a clear error explaining what to check (instead of
hanging silently or letting the frontend fall back to fake data).

## 3. Seed the database (first time only)

```bash
npm run seed
```

This creates the admin user, sample products, categories, etc. in MongoDB. You can re-run
this any time to reset the catalogue back to the demo data.

## 4. Run everything together

From the **`frontend/`** folder:

```bash
npm run dev
```

This starts **both** the frontend (http://localhost:5173) and the backend
(http://localhost:5000) together, in one terminal, with labelled output (`FRONTEND` /
`BACKEND`). This is the command you should always use during development — it prevents the
"backend isn't running and nobody noticed" problem.

If you ever do want to run them separately (e.g. in two terminals for clearer logs):

```bash
npm run dev:frontend   # just the Vite dev server
npm run dev:backend    # just the Express API
```

## 5. Confirm it's actually talking to MongoDB

- Visit `http://localhost:5000/api/health` — it should report `"mongodb": "connected"`.
- Add a product from the admin panel (`/admin` → Products → Add to the Maison).
- Stop and restart the backend (`Ctrl+C`, then `npm run dev:backend` again) — if the product
  is still there after restart, it's genuinely saved in MongoDB (the in-memory/demo fallback
  cannot survive a server restart).
- Sign up a new user from the storefront, then check **Admin Panel → Users** — the new user
  should appear there, and also be visible to anyone querying the `users` collection directly
  in MongoDB (e.g. via `mongosh` or MongoDB Compass).

## Admin login

| Field    | Value                    |
|----------|--------------------------|
| Email    | `admin@maisonvera.com`   |
| Password | `admin123`               |

(See `backend/README.md` for the full list of API endpoints.)

---

### اردو میں مختصر نوٹ

اس پراجیکٹ میں دو حصے ہیں: frontend اور backend۔ جب تک backend اور MongoDB دونوں چل نہ رہے
ہوں، admin panel سے add کی گئی product یا کسی user کا signup ڈیٹا بیس میں محفوظ نہیں ہوتا —
صرف frontend پر عارضی طور پر نظر آتا ہے اور refresh کرنے پر غائب ہو جاتا ہے۔

ہمیشہ **frontend** فولڈر میں جا کر صرف یہ کمانڈ چلائیں تاکہ frontend اور backend دونوں ایک ساتھ چلیں:

```bash
npm run dev
```

اور یقینی بنائیں کہ MongoDB واقعی چل رہا ہے، اور `backend/.env` میں `MONGODB_URI` درست ہے۔
