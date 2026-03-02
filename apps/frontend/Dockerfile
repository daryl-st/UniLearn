FROM node:20-bullseye as builder

WORKDIR /app

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
RUN corepack enable
RUN pnpm install

COPY . .

WORKDIR /app/apps/frontend
RUN pnpm build

FROM nginx:alpine

COPY --from=builder /app/apps/frontend/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]