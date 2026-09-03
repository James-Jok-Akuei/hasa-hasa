# Deploying

The API ships as a Docker image, so Railway, Render and Fly all work. The
workflow below assumes Railway; the image is the portable part.

| Branch    | Environment  | Railway service  |
| --------- | ------------ | ---------------- |
| `staging` | `staging`    | `api-staging`    |
| `main`    | `production` | `api-production` |

**Nothing deploys until `RAILWAY_TOKEN` is set.** Without it the workflow
builds the Docker image to prove it still works, then exits green. That keeps
every push from going red before hosting exists.

## Secrets and variables

Repository → Settings → Secrets and variables → Actions.

| Name | Kind | Notes |
| --- | --- | --- |
| `RAILWAY_TOKEN` | secret | Railway project token. Enables deploys. |
| `HEALTH_URL` | variable | e.g. `https://api-staging.up.railway.app/health`. Optional — without it the deploy is not verified. |

Set per environment where they differ, not repo-wide.

## What the API needs at runtime

Set these on the Railway service, not in the repo.

| Variable | Notes |
| --- | --- |
| `DATABASE_URL` | Postgres connection string |
| `AUTH_SECRET` | `openssl rand -hex 32`. **Different per environment.** Sharing it means a staging session token works in production. |
| `EMAIL_PROVIDER` | `resend` |
| `RESEND_API_KEY` | From the Resend dashboard |
| `RESEND_FROM` | `HASA HASA <noreply@yourdomain.com>` — the domain must be verified |
| `WEB_ORIGIN` | The dashboard's origin. CORS rejects everything else, so a wrong value breaks the browser client while curl keeps working. |
| `NODE_ENV` | `production` |

The API validates all of these at boot and **exits rather than starting**
half-configured. In particular `EMAIL_PROVIDER=console` is refused in
production — it would start cleanly and then let nobody sign in.

## Email

Login does not work without a real provider. Codes are the only way in.

1. Create a Resend account and add your sending domain.
2. Add the DNS records it gives you and wait for verification. **A sender on
   an unverified domain fails at send time, not at boot**, so the API will
   look healthy while every sign-in fails.
3. Set `RESEND_API_KEY` and `RESEND_FROM`.

Send failures answer `502` with `SEND_FAILED`, and the unsent code is removed
so the user can retry at once instead of waiting out a cooldown for a code
that never arrived.

To swap providers, add a case to `apps/api/src/lib/email.ts` — it is one
interface with one method.

## Migrations

`prisma migrate deploy` runs in the container's start command, so the schema
and the code that needs it ship as one unit. There is no separate migration
step to forget.

The trade-off: a failed migration means the container will not start. That is
deliberate — serving requests against a schema the code does not expect is
worse than being down.

## First-time Railway setup

1. New project, then two services from this repo: `api-staging`, `api-production`.
2. Both: set the Dockerfile path to `apps/api/Dockerfile` and the build
   context to the **repository root** — the build needs the workspace
   manifests and `packages/shared`.
3. Add a Postgres database per environment, or point `DATABASE_URL` at Supabase.
4. Set the variables above on each service.
5. Create the project token and add it as `RAILWAY_TOKEN`.

## Gating production

Settings → Environments → `production` → add yourself as a required reviewer.
A push to `main` then waits for a human before it ships.

## Rolling back

Redeploy the previous image from the Railway dashboard. Note that migrations
do **not** roll back — a deploy that changed the schema needs a new migration
to reverse it, so prefer additive changes (add a column, backfill, then drop
in a later release) over destructive ones.
