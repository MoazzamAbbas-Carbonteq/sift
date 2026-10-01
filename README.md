# Sift

Sift is a focused marketplace that helps shoppers find the right product faster and with less noise. Search, filters, and sort stay familiar. The difference is a short Help Me Choose flow and a three-product comparison, both driven by seeded catalog facts. There is no AI, no account signup, and no real payment.

## Architecture

The repository is two apps and one database.

- `frontend/` is a Next.js App Router app. Pages prefetch data on the server and hydrate it with TanStack Query. Interactive screens read that cache through hooks. The browser talks only to the NestJS API.
- `backend/` is a NestJS API. Controllers stay thin. Cart totals, stock checks, and order placement live in use cases. PostgreSQL is accessed through TypeORM, and schema changes live in migrations.
- Money is stored as integer cents. Placing an order runs in a transaction, copies the product name and unit price onto each order line, and clears the cart.

One demo user is seeded. The app does not ask the reviewer to sign in.

## Local setup

PostgreSQL runs on Windows. This repo runs in WSL and does not create a database. From WSL, `DB_HOST` is the Windows machine address, not `localhost`.

```bash
cd backend && npm install
cd frontend && npm install
```

Create `backend/.env` from `backend/.env.example` and `frontend/.env.local` from `frontend/.env.example`. Then build the backend once so the migration and seed scripts exist, apply the schema, and load the catalog:

```bash
cd backend && npm run build && npm run migration:run && npm run seed
```

Start both apps:

```bash
cd backend && npm run start:dev
cd frontend && npm run dev
```

The frontend is at `http://localhost:3000`. The API is at `http://localhost:3001`.

## Environment variables

`backend/.env` and `frontend/.env.local` are gitignored. Do not commit them.

Backend (`backend/.env.example`):

| Variable | Purpose |
|---|---|
| `PORT` | API port. Local default is `3001`. |
| `FRONTEND_ORIGIN` | Browser origin allowed by CORS. Local value is `http://localhost:3000`. |
| `DB_HOST` | PostgreSQL host. From WSL this is the Windows address. |
| `DB_PORT` | PostgreSQL port. |
| `DB_USER` | Database user. |
| `DB_PASSWORD` | Database password. |
| `DB_NAME` | Database name. |

Frontend (`frontend/.env.example`):

| Variable | Purpose |
|---|---|
| `NEXT_PUBLIC_API_URL` | NestJS base URL. Local value is `http://localhost:3001`. |

## Seed

`npm run seed` in `backend/` loads a deterministic catalog: Headphones, Laptops, Smartphones, Monitors, and Keyboards, plus one demo user and an empty active cart. Run it after `npm run build` and `npm run migration:run`. The demo does not require inserting rows by hand.

## Walkthrough

1. Open the home page and search for `headphones`, or open a category.
2. On the results page, change a filter or the sort order.
3. Open a product. The page shows one image, price, rating, stock, shipping, returns, catalog facts under “Why this product,” and seeded review themes.
4. Choose **Help me choose**. Answer use case (Travel, Work, Gaming, or Fitness), then priority (Noise cancellation, Battery, or Lower price), then budget (Under $100, $100–$200, or $200+). The short list includes a factual reason for each match.
5. Select two or three products and open Compare. A fourth selection stays blocked. The table compares price, rating, review count, battery, noise cancellation, weight, shipping, returns, and availability.
6. Add a product to the cart and change the quantity. Totals are calculated on the server.
7. Open checkout, enter a name and address, and place the order. Payment is the static demo option **Card ending in 4242.** No card number is collected.
8. The confirmation page shows the order number, the purchased lines, the server total, and the shipping name and address.
9. Open Orders. Each row shows status, date, total, and a short item summary. The detail page shows the full lines.

## Deployed URL

**Not deployed.** Replace this section with the public frontend URL after the app is deployed. Do not treat any local address as the live URL.

## Agent logs

Cursor writes session logs to `.agent-logs/`.
