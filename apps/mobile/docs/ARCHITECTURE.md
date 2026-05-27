# UniLearn mobile architecture

This document is the **source of truth** for how the Flutter app is structured, how API shapes are treated, and **what to build next**. Keep it updated when contracts or navigation change.

## Product principle: vertical slices, not screen hoarding

**Do not** add many disconnected screens. Ship **usable flows** end-to-end, then extend.

### Phase 1 (current focus — stabilize and finish)

1. **Splash** – bootstrap + restore session.
2. **Login / Register** – forms + validation; align with backend auth contract.
3. **Authentication persistence** – access token + user snapshot (today: `shared_preferences`; later: secure storage + refresh strategy).
4. **Dashboard** – home tab backed by shared mock/API models.
5. **Course list** – courses tab from the same catalog as the API contract.
6. **Course detail** – route `/courses/:courseId`, one screen wired to the same `ApiCourse` model.

### Phase 2

- PDF/PPT viewer  
- AI chat  
- Notes  
- Quiz  

### Phase 3

- Notifications  
- Analytics  
- Settings  

## Stack (frozen for this codebase)

| Layer | Package | Role |
|--------|---------|------|
| Routing | `go_router` | Declarative routes, shell tabs, redirects. Router instance provided by Riverpod (`routerProvider`). |
| State | `flutter_riverpod` | Session, DI, future feature controllers. Avoid ad-hoc `setState` for cross-screen state. |
| HTTP | `dio` | Single configured client (`dioProvider`); interceptors and base URL live here later. |
| Persistence (v1) | `shared_preferences` | Mock session + onboarding flag; replace with secure storage before production secrets. |

## API contracts (versioned, backend-aligned)

Dart types live under **`lib/core/contracts/`**. They intentionally mirror:

- Auth: [`apps/frontend/src/api/auth.ts`](../../frontend/src/api/auth.ts) — `POST auth/login` → `{ accessToken, user }`, `user` = `{ id, email, name, role }`, `role` ∈ `STUDENT` | `INSTRUCTOR` | `ADMIN`.
- Courses: [`packages/shared-types/src/Course.ts`](../../../packages/shared-types/src/Course.ts) — course entity fields (`id`, `name`, `code`, `instructorId`, `academicYear`, `departmentId`).

**Rule:** When the backend or `shared-types` changes, bump **`apiContractVersion`** in `contracts.dart` and update Dart models + `MockCatalog` in the same PR.

## Centralized mock data

**`lib/core/testing/mock_catalog.dart`** holds all **static** demo data (courses, dashboard copy, activity, deadlines). Feature screens should **import `MockCatalog`** (or thin re-exports under `features/*/data/`) instead of duplicating lists.

Runtime auth state belongs in **`AuthSessionNotifier`** (`lib/core/providers/auth_session_provider.dart`), not in a second global mock singleton.

## Shared widgets

Reusable UI lives in **`lib/core/widgets/`** (e.g. `GlassPanel`, `GradientCtaButton`, `LabeledTextField`, `SectionHeader`). **Rule:** If two features need the same widget, it belongs in `core/widgets/`, not copy-pasted under `features/*/presentation/widgets/`.

Feature folders may still contain **screen-specific** composition widgets that are not reused.

## Feature folders

```
lib/features/<feature>/
  presentation/     # Screens + feature-only widgets
  data/             # Optional: repository impl, thin exports to MockCatalog
```

No network calls inside `presentation/`; use providers / repositories that call `Dio`.

## Routing conventions

- Public: `/splash`, `/onboarding`, `/login`, `/register`.
- Authenticated shell: `/home`, `/courses`, `/courses/:courseId`, `/stats`, `/profile`.
- Redirects are defined next to `GoRouter` in `router_provider.dart` (session-aware).

## Misalignments we corrected

- **Single course source**: Home and Courses tabs both use **`MockCatalog.apiCourses`** + enrollment summaries instead of separate `courses_mock` / divergent home course rows.
- **User model**: **`AuthUser`** matches web login response; mock sign-in builds that shape for persistence.
- **Router + state**: **`MaterialApp.router`** uses **`routerProvider`** so redirects react to **`AuthSessionNotifier`**.
- **Placeholder tabs** (stats/profile): Kept as lightweight shells until Phase 3; documented above.

## Related docs

- Visual tokens: [`DESIGN.md`](DESIGN.md)
