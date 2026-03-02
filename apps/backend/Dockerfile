FROM node:20-alpine

WORKDIR /app

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
RUN corepack enable
RUN pnpm install

COPY . .

WORKDIR /app/apps/backend

RUN pnpm build

EXPOSE 4000

CMD ["node", "dist/server.js"]