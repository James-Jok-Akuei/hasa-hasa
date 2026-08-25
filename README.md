# Cieng

Restaurant platform monorepo — Turborepo + pnpm workspaces, TypeScript everywhere.

## Structure

```
apps/
  web/        Business dashboard — Next.js (App Router), TailwindCSS v4, TanStack Query
  admin/      Admin web — Next.js (planned)
  mobile/     Customer app — React Native + Expo, NativeWind, Android first (planned)
  api/        Backend — Node (NestJS or Fastify, TBD), Prisma + PostgreSQL, Redis/BullMQ (planned)
packages/
  shared/            Zod schemas and types shared by all apps
  typescript-config/ Shared tsconfig presets (base, nextjs, react-library)
```

## Getting started

```sh
pnpm install
pnpm dev          # run all dev servers (currently: web on http://localhost:3000)
pnpm build        # build everything
pnpm lint         # lint everything
pnpm typecheck    # typecheck everything
```

Run a single app: `pnpm --filter @cieng/web dev`

## Notes

- `.npmrc` sets `node-linker=hoisted` — required by Expo/React Native tooling when the mobile app lands.
- Shared validation lives in `@cieng/shared` (Zod) and is imported by both client and server code.
- External services planned: MTN MoMo (payments, behind a provider interface), Africa's Talking (SMS), MapLibre + OpenStreetMap (maps), Firebase Cloud Messaging (push).
- Deploy targets: Vercel (web), Railway/Render (backend), Neon/Supabase (Postgres), GitHub Actions (CI).
