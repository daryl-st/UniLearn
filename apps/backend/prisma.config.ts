import "dotenv/config";
import { defineConfig } from "prisma/config";

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
    seed: "tsx prisma/seed.ts"
  },
  datasource: {
    // process.env (not env()) so `prisma generate` works in Docker/CI without DATABASE_URL.
    url: process.env.DATABASE_URL ?? "",
  },
});
