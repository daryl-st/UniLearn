# UniLearn

University learning platform with course resources, AI-assisted study (chat, summaries, quizzes), and role-based dashboards for students, instructors, and admins.

## Prerequisites

- [Node.js](https://nodejs.org/) 20+
- [pnpm](https://pnpm.io/) 10+
- [Docker](https://www.docker.com/) (for PostgreSQL with pgvector)

## Local development (pnpm)

1. **Install dependencies** (repository root):

   ```bash
   pnpm install
   ```

2. **Start the database**:

   ```bash
   docker compose up db -d
   ```

3. **Configure environment** — copy examples and adjust secrets as needed:

   ```bash
   cp apps/backend/.env.example apps/backend/.env
   cp apps/frontend/.env.example apps/frontend/.env
   ```

   Backend must use port **5433** when using Compose (`DATABASE_URL` in `.env.example`). Set `CLIENT_ORIGIN` to your Vite URL (default `http://localhost:5173`). Frontend needs `VITE_API_BASE_URL=http://localhost:4000`.

4. **Initialize the database**:

   ```bash
   pnpm db:push
   pnpm db:generate
   pnpm db:seed
   ```

5. **Run the app**:

   ```bash
   pnpm dev
   ```

   | Service   | URL                          |
   |-----------|------------------------------|
   | Web app   | http://localhost:5173        |
   | API       | http://localhost:4000        |
   | Postgres  | localhost:5433               |

   **Optional — AI features** (RAG, quizzes): run the Python service per [`apps/ai/README.md`](apps/ai/README.md) on port 8000 and set `AI_SERVICE_URL` / `AI_INTERNAL_API_KEY` in `apps/backend/.env`.

   **Optional — file uploads**: configure Cloudinary in `apps/backend/.env` (see `.env.example`).

## Docker (full stack)

Build and run API, web, database, and AI from the repo root. Provide a root `.env` with the same variables as `apps/backend/.env` (use `DATABASE_URL` pointing at the `db` service host when everything runs in Compose).

```bash
docker compose up --build
```

| Service | URL                   |
|---------|-----------------------|
| Web     | http://localhost:3000 |
| API     | http://localhost:4000 |
| AI      | http://localhost:8000 |

## Demo accounts (after seed)

| Role       | Email              | Password   |
|------------|--------------------|------------|
| Admin      | `Admin@uni.test`   | `12345678` |
| Instructor | `Ins@uni.test`     | `12345678` |

Students register at `/register` with an `@aau.edu.et` email and are signed in immediately.

## Scripts

```bash
pnpm build      # compile all workspace packages
pnpm dev        # backend + frontend in watch mode
pnpm db:push    # apply Prisma schema
pnpm db:seed    # seed demo data
```

The `apps/mobile` package is separate from this web stack.
