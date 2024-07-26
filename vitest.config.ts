import { defineConfig } from "vitest/config";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  plugins: [tsconfigPaths()],
  test: {
    watch: false,
    globalSetup: ["test/setup.ts"],
    coverage: {
      include: ["src/**/*.ts"],
      exclude: ["src/main**", "src/migrate.ts", "src/infrastructure/migration"],
    },
  },
});
