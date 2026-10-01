# Sift

A focused marketplace that helps shoppers find the right product faster and with less noise.

## Apps

- `frontend/` — Next.js on port 3000
- `backend/` — NestJS on port 3001

## Setup

PostgreSQL runs on Windows. This repo runs in WSL and does not create a database.

Edit `backend/.env` and fill in the Windows connection:

```text
DB_HOST=
DB_PORT=
DB_USER=
DB_PASSWORD=
DB_NAME=
```

`DB_HOST` is the Windows machine address, not `localhost`. `backend/.env` is gitignored. `backend/.env.example` lists the same keys with no secrets.

```bash
cd backend && npm run start:dev
cd frontend && npm run dev
```

The frontend calls the API at `NEXT_PUBLIC_API_URL` (`frontend/.env.example`).

## Agent logs

Cursor writes session logs to `.agent-logs/`.
