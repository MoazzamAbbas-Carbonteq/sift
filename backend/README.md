# Backend

NestJS API for Sift. Setup and environment variables are in the repository root README.

## Catalog data

From `backend/`, with `backend/.env` already filled in:

```bash
npm run build
npm run migration:run
npm run seed
```

`migration:run` and `seed` read `backend/.env` and do not print credentials. If the Windows PostgreSQL host cannot be reached, those commands fail and stop.

## API docs

With the API running, Swagger UI is at `GET /docs`.
