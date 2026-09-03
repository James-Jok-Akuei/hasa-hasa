# @hasahasa/api

Fastify + Prisma backend. Passwordless email OTP, and restaurants are an
application that ops approves before the dashboard opens.

## Running it

```sh
pnpm db:up          # local Postgres on 5433 (needs Docker)
cp .env.example .env
# generate AUTH_SECRET: openssl rand -hex 32
pnpm db:migrate
pnpm db:seed        # creates the first platform admin
pnpm dev            # http://localhost:4000
```

`EMAIL_PROVIDER=console` prints one-time codes to the terminal, so nothing
blocks on a transactional email account.

Set `EMAIL_PROVIDER=resend` with `RESEND_API_KEY` and `RESEND_FROM` before
staging — **login does not work without a real provider**, since the code
never reaches the user. The API refuses to boot with `console` when
`NODE_ENV=production`, rather than starting and locking everyone out.

Deployment, secrets and the Railway setup are in [docs/DEPLOY.md](../../docs/DEPLOY.md).

## Docker

```sh
docker build -f apps/api/Dockerfile -t hasahasa-api .   # from the repo root
```

The build context is the **repository root**, not `apps/api` — pnpm needs the
workspace manifests and `packages/shared`. `prisma migrate deploy` runs in the
container's start command, so schema and code ship together.

## The approval gate

```
signup ──▶ PENDING ──approve──▶ APPROVED   dashboard opens
                    └─reject──▶ REJECTED   reason shown to the merchant
```

Signing in and being approved are separate. A PENDING owner authenticates
normally and `GET /auth/me` returns their status — the dashboard routes them
to a holding screen. Blocking login outright would leave them unable to check
their own status.

## API documentation

Swagger UI at **http://localhost:4000/docs**, raw spec at `/docs/json`.

The spec is generated from the same Zod schemas the routes validate against,
so it cannot drift from actual behaviour — change a schema and the docs move
with it.

## Endpoints

| Method | Path | Notes |
| --- | --- | --- |
| POST | `/auth/signup` | Step one. Writes no rows — details ride on the OTP |
| POST | `/auth/signup/verify` | Creates User + Restaurant(PENDING) + Membership(OWNER) |
| POST | `/auth/login` | Always 202, whether or not the account exists |
| POST | `/auth/login/verify` | Returns a session |
| GET | `/auth/me` | Session + restaurant status |
| POST | `/auth/logout` | Revokes the session |
| GET | `/admin/restaurants?status=` | Review queue, cursor paginated |
| POST | `/admin/restaurants/:id/approve` | |
| POST | `/admin/restaurants/:id/reject` | Requires a reason |

Admin routes answer **404** to non-admins, not 403 — the ops surface should
not confirm it exists.

## Decisions worth knowing

- **Signup writes nothing until the code is verified.** Otherwise anyone could
  fill the review queue with applications for addresses they do not control.
- **Signup details are stored on the OTP row**, so step two trusts what was
  captured at step one rather than whatever the client re-sends.
- **OTP codes are HMAC-hashed with `AUTH_SECRET`.** Six digits is a million
  guesses, so a plain hash in a leaked database gives up every live code.
- **Login never reveals whether an address has an account.** Same 202 either way.
- **Approve and reject are guarded on the current status**, so a double-click
  cannot overwrite the original reviewer and timestamp.
- **`isPlatformAdmin` has no endpoint that grants it.** Use `pnpm db:seed`.
- **The API resolves modules like a bundler and ships via tsup**, because
  `@hasahasa/shared` uses extensionless imports for Next. Do not switch this
  to NodeNext without giving the shared package a build step.

## Not done yet

- Per-route rate limits on the OTP endpoints (only a global 100/min today)
- Admin UI — the endpoints exist, the screens do not
- Wiring the web forms to these endpoints; they still simulate
