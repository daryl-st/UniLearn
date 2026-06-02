import { defineConfig } from "vitest/config";

export default defineConfig({
    test: {
        include: ["tests/**/*.test.ts"],
        exclude: ["tests/integration/**"],
        environment: "node",
        globals: false,
        testTimeout: 30000,
        fileParallelism: false,
        restoreMocks: true,
        clearMocks: true,
    },
});
