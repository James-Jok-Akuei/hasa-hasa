import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["src/server.ts"],
  format: ["esm"],
  target: "node22",
  outDir: "dist",
  sourcemap: true,
  clean: true,
  // Bundling @hasahasa/shared in is the point: it is a workspace package with
  // no build step of its own, so it cannot be resolved at runtime.
  noExternal: ["@hasahasa/shared"],
});
