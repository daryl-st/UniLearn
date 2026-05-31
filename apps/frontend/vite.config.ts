import { defineConfig } from "vite"
import react from "@vitejs/plugin-react"
import tailwindcss from "@tailwindcss/vite"
import path from "node:path"

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    proxy: {
      "/users": "http://localhost:4000",
      "/auth": "http://localhost:4000",
      "/course": "http://localhost:4000",
      "/dashboard": "http://localhost:4000",
      "/instructor": "http://localhost:4000",
      "/student": "http://localhost:4000",
    },
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      "@unilearn/shared-types": path.resolve(
        __dirname,
        "../../packages/shared-types/src/index.ts",
      ),
    },
  },
})
