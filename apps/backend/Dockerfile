FROM node:20-alpine

WORKDIR /app

RUN corepack enable

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY apps/backend/package.json ./apps/backend/
COPY packages/shared-types/package.json ./packages/shared-types/

RUN pnpm install --frozen-lockfile

COPY packages/shared-types ./packages/shared-types
COPY packages/tsconfig ./packages/tsconfig
COPY apps/backend ./apps/backend

RUN pnpm --filter @unilearn/shared-types build

WORKDIR /app/apps/backend

RUN pnpm exec prisma generate
RUN pnpm build

EXPOSE 4000

CMD ["node", "dist/server.js"]
