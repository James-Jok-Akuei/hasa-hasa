# Built from the repo root, not apps/api — pnpm needs the workspace manifests
# and packages/shared to resolve. See the build context in deploy.yml.
FROM node:22-alpine AS build
RUN corepack enable
WORKDIR /app

COPY . .

# `...` pulls in the workspace packages the API depends on, and nothing else,
# so the web app's Next toolchain never gets installed.
RUN pnpm install --frozen-lockfile --filter @hasahasa/api...
RUN pnpm --filter @hasahasa/api exec prisma generate
RUN pnpm --filter @hasahasa/api build

# Production dependencies only. The build stage carries tsup, esbuild and
# TypeScript; none of that belongs in the shipped image.
FROM node:22-alpine AS deps
RUN corepack enable
WORKDIR /app
COPY . .
RUN pnpm install --frozen-lockfile --prod --filter @hasahasa/api...
# pnpm generates the client inside its own store path, so copying it across
# stages is brittle. Generating here keeps it wherever pnpm expects it.
RUN pnpm --filter @hasahasa/api exec prisma generate

FROM node:22-alpine AS runtime
RUN corepack enable
WORKDIR /app
ENV NODE_ENV=production

# The Prisma CLI is a runtime dependency, not a dev one: migrations run at
# container start, so the schema and the code needing it deploy as one unit.
COPY --from=deps /app/node_modules ./node_modules
COPY --from=build /app/package.json /app/pnpm-workspace.yaml /app/pnpm-lock.yaml ./
COPY --from=build /app/packages ./packages
COPY --from=deps /app/apps/api/node_modules ./apps/api/node_modules
COPY --from=build /app/apps/api/dist ./apps/api/dist
COPY --from=build /app/apps/api/prisma ./apps/api/prisma
COPY --from=build /app/apps/api/package.json ./apps/api/package.json

WORKDIR /app/apps/api
EXPOSE 4000

# --schema is explicit so the CLI never looks for prisma.config.ts, which is
# TypeScript and is not shipped to the runtime image.
CMD ["sh", "-c", "pnpm exec prisma migrate deploy --schema=prisma/schema.prisma && node dist/server.js"]
