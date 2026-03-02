# UniLearn

## Overview

UniLearn is a production-grade, modular monolith academic system designed for students, instructors, and administrators. It supports structured course management, learning progress tracking, analytics, and AI-assisted learning features through an isolated AI service.

The system is designed with strong architectural boundaries, clear service separation, and future scalability in mind.

---

## Architecture

The platform follows a three-tier architecture with logical service separation.

Presentation Layer:
- Web Frontend (React + TypeScript + Vite)
- Optional Mobile App (Flutter, consumes same API)

Application Layer:
- Node.js + Express backend (API Gateway and orchestration layer)
- Modular service structure (users, content, learning, analytics, AI orchestration)

AI Layer:
- FastAPI-based stateless AI service
- No direct database access
- Invoked only through the backend

Data Layer:
- PostgreSQL
- Prisma ORM
- UUID primary keys
- Versioned migrations

All client communication flows through the Node backend. The frontend never communicates directly with the database or the AI service.

---

## Monorepo Structure

```
UniLearn/
├── apps/
│   ├── frontend/
│   ├── backend/
│   └── ai/
├── packages/
│   ├── shared-types/
│   ├── api-contracts/
│   ├── eslint-config/
│   └── tsconfig/
├── infrastructure/
│   ├── docker/
│   └── scripts/
├── docker-compose.yml
├── pnpm-workspace.yaml
└── README.md
```

### apps/
Contains deployable applications.

### packages/
Contains shared logic, configuration, and type contracts used across applications.

### infrastructure/
Contains Docker configuration, initialization scripts, and deployment-related files.

---

## Technology Stack

Frontend:
- React
- TypeScript
- Vite
- Tailwind / shadcn UI

Backend:
- Node.js
- Express
- Prisma ORM
- PostgreSQL

AI Service:
- Python
- FastAPI

Infrastructure:
- Docker
- Docker Compose
- PNPM (workspace package manager)

---

## Getting Started

### Prerequisites

- Node.js (LTS)
- PNPM
- Docker + Docker Compose
- Python 3.10+ (for AI service local development)

---

## Installation

### 1. Clone the Repository

```
git clone <repository-url>
cd UniLearn
```

### 2. Install Dependencies

```
pnpm install
```

---

## Environment Configuration

Copy the example environment file:

```
cp .env.example .env
```

Configure:

- DATABASE_URL
- JWT_SECRET
- AI_SERVICE_URL

Do not commit .env files.

---

## Database Setup (Prisma)

Navigate to backend:

```
cd apps/backend
```

Run migrations:

```
npx prisma migrate dev
```

Generate Prisma client:

```
npx prisma generate
```

---

## Running the System (Docker Recommended)

From root:

```
docker compose up --build
```

Services:

- Frontend: http://localhost:3000
- Backend API: http://localhost:4000
- AI Service: internal container
- PostgreSQL: internal container

---

## Running Services Individually (Development Mode)

### Frontend

```
cd apps/frontend
pnpm dev
```

### Backend

```
cd apps/backend
pnpm dev
```

### AI Service

```
cd apps/ai
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
uvicorn app.main:app --reload
```

---

## Architectural Principles

- Modular monolith backend with logical service separation
- Clear boundaries between persistence, business logic, and transport layers
- Shared TypeScript DTOs for API contracts
- AI service is isolated and stateless
- Frontend never directly accesses database or AI
- Prisma schema is internal to backend

---

## API Contracts

OpenAPI specification is maintained in:

packages/api-contracts/openapi.json

The backend is the source of truth for API structure.

---

## Security

- JWT Authentication
- Role-Based Access Control
- Password hashing (bcrypt)
- Request validation
- Rate limiting for AI endpoints
- Centralized error handling

---

## Testing

Backend tests:

```
cd apps/backend
pnpm test
```

AI service tests:

```
cd apps/ai
pytest
```

---

## Scalability Strategy

The architecture supports:

- Independent AI service scaling
- Horizontal backend scaling
- Future migration to Kubernetes
- Clean separation for microservice extraction if required

---

## Contribution Guidelines

1. Create feature branch from main
2. Follow ESLint and TypeScript standards
3. Ensure tests pass
4. Submit pull request with description

---

## License


---

## Design Philosophy

This system is designed as a structured academic platform, not a prototype. It emphasizes maintainability, extensibility, and clear subsystem boundaries while allowing AI to function as an enhancement rather than a dependency.

