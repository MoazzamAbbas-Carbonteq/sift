# Amazon Rebuild — Architecture

## Repository layout

Do not use Turborepo. Keep the repository simple for a time-boxed assessment.

```text
amazon-rebuild/
├── frontend/                 # Next.js App Router
├── backend/                  # NestJS
├── .agent-logs/              # required by 8x
├── PLAN.md
├── SCHEMA.md
├── ARCHITECTURE.md
├── AGENTS.md
└── README.md
```

## Frontend architecture

### Stack
- Next.js App Router
- TypeScript
- TanStack Query
- shadcn/ui
- Tailwind CSS
- Lucide

### Suggested structure

```text
frontend/src/
├── app/
│   ├── page.tsx
│   ├── search/page.tsx
│   ├── products/[slug]/page.tsx
│   ├── cart/page.tsx
│   ├── checkout/page.tsx
│   ├── orders/page.tsx
│   └── choose/page.tsx
│
├── components/
│   ├── ui/                   # Layer 2 primitives
│   ├── product/              # product patterns
│   ├── discovery/            # Guided Discovery patterns
│   ├── cart/
│   ├── checkout/
│   └── layout/
│
├── hooks/
│   ├── useProducts.ts
│   ├── useProduct.ts
│   ├── useCart.ts
│   ├── useOrders.ts
│   └── useGuidedDiscovery.ts
│
├── lib/
│   ├── api/
│   │   ├── client.ts
│   │   ├── products.ts
│   │   ├── cart.ts
│   │   └── orders.ts
│   ├── query-client.ts
│   └── utils.ts
│
├── server/
│   └── prefetch/
│       ├── products.ts
│       ├── product.ts
│       ├── cart.ts
│       └── orders.ts
│
└── styles/
    └── globals.css
```

## Data fetching / hydration rules

These are mandatory unless there is a compelling reason documented in code.

### 1. Data isolation

**Never use a global QueryClient on the server.**

Create a utility that creates a fresh instance for each server request/prefetch execution:

```ts
export function getQueryClient() {
  return new QueryClient();
}
```

On the client browser, retain one singleton instance.

The implementation must distinguish server and browser execution correctly.

### 2. Clean Server Components

Keep `page.tsx` files clean.

Do not put large multi-query prefetch implementations inside the page.

Move server-only work into dedicated files such as:

```text
server/prefetch/products.ts
```

When multiple independent queries are needed, run them concurrently with `Promise.all`.

### 3. Hydration

Wrap client UI layouts/content with:

```tsx
<HydrationBoundary state={dehydrate(queryClient)}>
  <ClientUI />
</HydrationBoundary>
```

Use server prefetch to prime the same cache keys that client hooks consume.

### 4. Client components + custom hooks

Client components must obtain server-backed data via custom hooks such as:

```ts
const { data, isLoading, error } = useProducts(filters);
```

Do not pass fetched server data down through long prop chains when the data is already intended to live in the TanStack Query cache.

### 5. DRY cache matching

The server prefetcher and client hook must import and use the **same API fetch function** and the **same query key**.

Example concept:

```ts
// lib/api/products.ts
export const productsQueryKey = (params: ProductQuery) => ['products', params] as const;

export async function fetchProducts(params: ProductQuery) {
  // HTTP call to NestJS
}
```

Server:

```ts
queryClient.prefetchQuery({
  queryKey: productsQueryKey(params),
  queryFn: () => fetchProducts(params),
});
```

Client:

```ts
useQuery({
  queryKey: productsQueryKey(params),
  queryFn: () => fetchProducts(params),
});
```

No duplicated fetch URL construction or cache-key definitions.

### 6. Server/client boundary

Rules:
- Server components may prefetch.
- Client components own interactive behavior.
- Do not import server-only modules into client components.
- Do not expose secret backend credentials to the browser.
- API communication goes to NestJS.
- Do not create Next.js API Route Handlers as a second backend.

## Backend architecture

### Stack
- NestJS
- TypeScript
- TypeORM
- PostgreSQL
- class-validator / Nest validation pipe

### Clean Architecture / DDD-inspired structure

Use pragmatic Clean Architecture. Do not over-engineer domain abstractions that do not buy value in a 2–3 hour assessment.

Suggested structure:

```text
backend/src/
├── main.ts
├── app.module.ts
│
├── modules/
│   ├── products/
│   │   ├── domain/
│   │   │   ├── entities/
│   │   │   └── repositories/
│   │   ├── application/
│   │   │   ├── dto/
│   │   │   └── use-cases/
│   │   ├── infrastructure/
│   │   │   ├── persistence/
│   │   │   └── repositories/
│   │   └── presentation/
│   │       └── products.controller.ts
│   │
│   ├── cart/
│   ├── orders/
│   └── categories/
│
├── database/
│   ├── migrations/
│   └── seed/
│
└── common/
    ├── exceptions/
    ├── filters/
    ├── interceptors/
    └── pipes/
```

### Repository pattern

Business logic should depend on repository contracts, not directly on TypeORM repositories.

Example:

```ts
export interface ProductRepository {
  findById(id: string): Promise<Product | null>;
  search(criteria: ProductSearchCriteria): Promise<PaginatedResult<Product>>;
}
```

Infrastructure implements the contract with TypeORM.

Keep controllers thin:

```text
HTTP -> Controller -> Use Case -> Repository -> PostgreSQL
```

### Service/use-case rules

Examples:
- `SearchProductsUseCase`
- `GetProductUseCase`
- `AddCartItemUseCase`
- `UpdateCartItemUseCase`
- `PlaceOrderUseCase`
- `GetOrdersUseCase`
- `RunGuidedDiscoveryUseCase`

Avoid a giant `ProductsService` containing every concern.

## API design

Use REST.

### Products

```text
GET /products
GET /products/:id
GET /categories
```

Query parameters for `/products` may include:

```text
q
category
minPrice
maxPrice
minRating
inStock
freeShipping
sortBy
sortOrder
page
limit
attributes[]
```

### Cart

```text
GET    /cart
POST   /cart/items
PATCH  /cart/items/:id
DELETE /cart/items/:id
```

### Orders

```text
POST /orders
GET  /orders
GET  /orders/:id
```

### Guided Discovery

```text
POST /discovery/match
```

Input should be structured preferences, not free-form AI prompts.

### Compare

Comparison may be performed client-side after fetching the selected product records unless server-side comparison becomes useful. Keep it simple.

## Error handling

Backend:
- global validation pipe
- consistent HTTP errors
- no leaking stack traces
- meaningful 4xx messages

Frontend:
- inline form errors
- empty states
- retry states where appropriate
- toast only for transient action feedback

## Transaction handling

Order placement must use a DB transaction.

The order creation transaction should:
- load cart and items
- validate products
- snapshot prices/names
- compute totals
- create order and items
- mark cart checked_out / clear items
- commit

## Security baseline

Even for a demo:
- validate DTOs
- reject invalid quantities and negative prices
- never trust totals supplied by the client
- calculate order totals server-side
- keep secrets in environment variables
- configure CORS for the frontend origin
- avoid logging credentials

## UI architecture

### Three-layer design system

```text
Layer 1: Foundations / tokens
        ↓
Layer 2: UI primitives
        ↓
Layer 3: product patterns / composed sections
```

### UX principles

1. **One obvious primary action per section.**
2. **Show decision-critical information early:** price, rating, availability, delivery, key attributes.
3. **Use progressive disclosure:** show enough information to decide; keep secondary detail behind drawers/dialogs/details.
4. **Contextual filters:** only show attributes that make sense for the current category/search context.
5. **Comparison should be obvious:** selected products remain visible in a sticky tray.
6. **Every async action has feedback:** loading, success, failure, disabled state.
7. **Responsive from the beginning:** desktop and mobile should use the same information hierarchy.
8. **Avoid decorative complexity:** animation should support comprehension, not compete with the product.

## Performance rules

For the assessment:
- parallelize independent server prefetches
- paginate product listings
- avoid fetching full catalogs unnecessarily
- use image dimensions/aspect ratios to reduce layout shift
- use React/Next.js caching only where it is clearly safe
- do not premature-optimize database queries that are not on the primary flow

## Deployment architecture

Recommended free-tier-friendly shape:

```text
Vercel
  -> Next.js frontend

Render / similar managed host
  -> NestJS backend

Neon / Supabase / similar managed Postgres
  -> PostgreSQL
```

Use environment variables for production API URLs and database configuration.

Deploy early enough to catch CORS, build, and environment problems before final submission.

## Testing priority

Given the time limit, prioritize:
1. Product search/filter API
2. Place-order use case
3. Critical cart rules
4. One frontend happy-path smoke/e2e test if time permits

Do not spend the assessment building exhaustive test coverage.
