# UniLearn Mobile

Flutter client for [UniLearn](.) — a PNPM monorepo that also includes the Node API (`apps/backend`), React web app (`apps/frontend`), and Python AI service (`apps/ai`). The mobile app talks only to the **backend API** on port **4000**.

```
UniLearn/
├── apps/mobile/      ← Flutter (Dart 3.10+, package name: mobile)
├── apps/backend/     ← Express API :4000
├── apps/frontend/    ← Vite web (not required for mobile)
├── apps/ai/          ← FastAPI (required when backend runs in Docker Compose)
└── docker-compose.yml
```

## Prerequisites

- [Flutter](https://docs.flutter.dev/get-started/install) (SDK **^3.10.8** per `apps/mobile/pubspec.yaml`)
- Android Studio / Xcode toolchain for a device or emulator
- A running backend at **`http://<host>:4000`** (see below)
- For Docker-based API: Docker Compose + root `.env` (see [Backend for mobile](#backend-for-mobile))

## Configure the API URL

The app reads `API_BASE_URL` at build time ([`apps/mobile/lib/core/config/api_config.dart`](apps/mobile/lib/core/config/api_config.dart)). Default if unset:

**`http://127.0.0.1:4000`**

| Target | `API_BASE_URL` |
|--------|----------------|
| Android emulator | `http://10.0.2.2:4000` |
| iOS Simulator / desktop | `http://127.0.0.1:4000` |
| Physical Android (USB + `adb reverse`) | `http://127.0.0.1:4000` |
| Physical device (same Wi‑Fi as PC) | `http://<your-lan-ip>:4000` |

HTTP is allowed on Android (`android:usesCleartextTraffic="true"` in `AndroidManifest.xml`).

**Physical Android over USB** (backend on your machine, e.g. Docker or `pnpm dev`):

```bash
adb reverse tcp:4000 tcp:4000
cd apps/mobile
flutter run --dart-define=API_BASE_URL=http://127.0.0.1:4000
```

**Android emulator:**

```bash
cd apps/mobile
flutter run --dart-define=API_BASE_URL=http://10.0.2.2:4000
```

**Default (127.0.0.1, no extra flag):**

```bash
cd apps/mobile
flutter run
```

Verify the API from your machine:

```bash
curl http://127.0.0.1:4000/
# → Express API running...
```

Auth uses Dio against paths such as `auth/login`, `auth/me`, and `auth/refresh` with Bearer tokens and refresh cookies ([`apps/mobile/lib/core/providers/dio_provider.dart`](apps/mobile/lib/core/providers/dio_provider.dart)). CORS / `CLIENT_ORIGIN` only affect the web app, not Flutter.

## Backend for mobile

You need Postgres + the API. Pick one approach.

### Option A — Docker (API only)

From the repo root, create **`.env`** (Compose loads it). Minimum for `db`, `ai`, and `backend`:

```env
DATABASE_URL=postgresql://postgres:password@db:5432/unilearn?schema=public
AI_SERVICE_URL=http://ai:8000
AI_INTERNAL_API_KEY=change-me-in-development
ACCESS_TOKEN_SECRET=change-me-access
REFRESH_TOKEN_SECRET=change-me-refresh
CLIENT_ORIGIN=http://localhost:3000
```

Start services (backend depends on `db` and `ai` in [`docker-compose.yml`](docker-compose.yml)):

```bash
docker compose up --build db ai backend
```

API: **http://127.0.0.1:4000**

**First time — migrations** (DB exposed on host port **5433**):

```bash
cd apps/backend
DATABASE_URL="postgresql://postgres:password@localhost:5433/unilearn?schema=public" npx prisma migrate deploy
```

Optional seed: `npx prisma db seed`

### Option B — Local API, Docker Postgres

```bash
# Repo root — database only
docker compose up db -d

cd apps/backend
cp .env.example .env
# DATABASE_URL in .env.example already uses localhost:5433
npx prisma migrate dev
pnpm dev
```

API: **http://127.0.0.1:4000** (`pnpm dev` → `tsx watch src/server.ts`).

## Run the Flutter app

```bash
cd apps/mobile
flutter pub get
flutter run
# add --dart-define=API_BASE_URL=... when needed (see table above)
```

Release-style run example:

```bash
flutter run --release --dart-define=API_BASE_URL=http://10.0.2.2:4000
```

Android application id: **`com.unilearn.mobile.mobile`**

## Tests

```bash
cd apps/mobile
flutter test
```

## Rest of the monorepo

| Piece | Location |
|-------|----------|
| Backend env reference | [`apps/backend/.env.example`](apps/backend/.env.example) |
| Web app | `cd apps/frontend && pnpm dev` → http://localhost:5173 |
| Full stack in Docker | `docker compose up --build` → web :3000, API :4000 |
| OpenAPI | [`packages/api-contracts/openapi.json`](packages/api-contracts/openapi.json) |
| AI service | [`apps/ai/README.md`](apps/ai/README.md) |

Do not commit `.env` files.
