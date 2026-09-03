import path from "node:path";
import { defineConfig } from "prisma/config";

// prisma.config.ts does not load .env on its own, unlike the old
// package.json#prisma key. Node 20.12+ can do it without a dependency.
try {
  process.loadEnvFile(path.join(import.meta.dirname, ".env"));
} catch {
  // No .env yet (CI, fresh clone) — the CLI will report the missing var.
}

export default defineConfig({
  schema: path.join("prisma", "schema.prisma"),
});
