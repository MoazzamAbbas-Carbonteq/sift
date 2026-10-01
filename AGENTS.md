# Amazon Rebuild — Agent Rules

This file is the implementation contract for Cursor/Claude/Codex-style coding agents working in this repository.

## Before changing code

1. Read `PLAN.md`.
2. Read `SCHEMA.md`.
3. Read `ARCHITECTURE.md`.
4. Inspect the current repository before creating new files.
5. Follow the current phase only. Do not silently implement later phases.

## Assessment priorities

Optimize in this order:

```text
Working product
  > Product judgement
  > UX/UI polish
  > Clean architecture
  > Test coverage
  > Extra features
```

Never sacrifice the primary purchase journey to build optional infrastructure.

## Product constraints

The product is a focused Amazon-inspired marketplace whose central differentiator is **better discovery**.

Core promise:

> Help shoppers find the right product faster and with less noise.

Do not turn this into a generic Amazon clone.

## Scope control

Do not add any of the following unless explicitly requested:
- real payment provider
- real auth/signup
- seller marketplace
- admin dashboard
- AI/LLM integration
- embeddings
- vector databases
- Elasticsearch
- Redis
- Kafka
- microservices
- event bus
- recommendation model
- complex search infrastructure

Prefer deterministic, explainable logic for Guided Discovery.

## Code quality rules

### General
- TypeScript strict mode.
- Prefer small, focused functions.
- Follow SOLID where practical.
- DRY, but do not create abstractions before repetition exists.
- Avoid clever code.
- Name things by business meaning.
- Avoid giant components/services.
- Avoid premature generic frameworks.

### Frontend
- `page.tsx` should remain a composition/orchestration layer.
- Interactive UI belongs in client components.
- Client components consume server-backed data through custom hooks.
- Do not pass large fetched datasets through props when they should live in TanStack Query.
- Shared fetch logic belongs in `lib/api`.
- Shared query keys belong next to their fetchers.
- Server prefetch logic belongs in server-only `prefetch.ts` helpers.
- Concurrent independent prefetches use `Promise.all`.
- Use `HydrationBoundary` + `dehydrate`.
- Never use a single mutable global server QueryClient.
- Browser may use one QueryClient singleton.
- Do not create a second backend using Next.js Route Handlers.

### Backend
- NestJS modules should reflect business capabilities.
- Controllers are thin.
- Business rules live in application/use-case services.
- Business logic depends on repository interfaces.
- TypeORM implementations belong in infrastructure/persistence.
- Use DTOs and `ValidationPipe`.
- Never trust client-calculated totals.
- Money uses integer cents.
- Order placement is transactional.
- Order items snapshot price/name at purchase time.

## Database rules

- PostgreSQL.
- TypeORM migrations are the source of schema changes.
- Seed data must be deterministic and realistic.
- Never require manual row creation for the demo.
- Avoid nullable columns unless the business case requires null.
- Add indexes only for known query paths.

## UI / design system rules

Use shadcn/ui primitives rather than building a separate UI library.

Follow the three layers:

```text
1. Foundations / tokens
2. Primitives
3. Product patterns / compositions
```

Do not create one-off styling for each page if an existing token/component/pattern can be reused.

### Visual rules
- clear type hierarchy
- consistent spacing
- restrained borders/shadows
- strong primary CTA hierarchy
- readable cards
- predictable interaction states
- no decorative clutter
- responsive layout
- accessible color contrast
- obvious focus states
- no layout jumps from images/content loading

### Product-card rules
A product card should make it easy to answer:
- What is it?
- How much is it?
- Is it well rated?
- Is it available?
- Why should I consider it?
- What action can I take?

Keep the card scannable.

## Guided Discovery rules

Guided Discovery is the main product innovation.

It must:
- ask only a few questions
- use structured selections
- map selections to deterministic criteria
- return a small focused result set
- explain why the products match
- avoid claiming intelligence that is not implemented

Do not describe the rules engine as AI.

## Compare rules

- 2–3 selected products max for the MVP.
- Sticky tray on desktop.
- Bottom sheet or compact tray on mobile.
- Comparison prioritizes decision-relevant differences.
- Avoid tables with dozens of irrelevant rows.

## Review/theme rules

Review themes are seeded structured data.

Do not invent a live review scraping pipeline.

Present themes as product summaries, not as verified independent review research.

## API/query rules

Use one canonical query key per data query.

Good:

```ts
export const productKeys = {
  all: ['products'] as const,
  list: (params: ProductQuery) => ['products', 'list', params] as const,
  detail: (id: string) => ['products', 'detail', id] as const,
};
```

Or a simpler equivalent, as long as server prefetch and client hooks share the exact same key factory.

Do not duplicate fetcher functions just because one caller is server-side and one is client-side.

## Agent behavior

When a requested change conflicts with an existing architectural constraint:
1. Prefer the documented constraint.
2. Make the smallest compatible change.
3. Mention the conflict and resolution in the final summary.

When requirements are ambiguous:
- choose the smallest implementation consistent with `PLAN.md`
- do not invent large new features
- preserve the demo flow

When a package/approach adds significant setup for little assessment value:
- do not add it
- prefer built-in platform capabilities or existing dependencies

## Refactoring rules

Refactor only when it directly improves:
- correctness
- duplication
- readability
- testability
- assessment-visible polish

Do not perform broad rewrites late in the assessment.

## Testing rules

At minimum verify:
- search returns products
- category/filter/sort works
- guided discovery returns expected products
- compare works for 2–3 items
- add/update/remove cart works
- invalid quantity is rejected
- order total is calculated server-side
- order item price is snapshotted
- order confirmation works

## Deployment rules

Before declaring done:
- build frontend
- build backend
- verify environment variables
- verify CORS
- open the deployed URL in an incognito window
- execute the core journey from search to order
- ensure demo data exists in production database

Never tell the reviewer to "run it locally" instead of providing the live URL.

## Repository hygiene

- Keep `.agent-logs/` committed continuously as required by the assessment.
- Never commit `.env` or secrets.
- Keep `README.md` focused on setup, product decisions, and demo instructions.
- Avoid generated clutter.

## Completion response format for agents

At the end of a coding phase, report:

1. What was implemented.
2. Files/directories changed.
3. Commands run.
4. Tests/build status.
5. Any remaining manual check.
6. Whether the current phase is complete.

Do not claim tests passed if they were not actually run.
