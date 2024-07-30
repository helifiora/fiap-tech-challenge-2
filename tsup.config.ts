import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["src/main.ts"],
  format: "esm",
  clean: true,
  splitting: false,
  treeshake: true,
  skipNodeModulesBundle: false,
});
