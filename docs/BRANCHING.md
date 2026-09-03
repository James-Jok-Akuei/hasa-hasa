# Branching and releases

Two long-lived branches. Everything else is short-lived and gets deleted after merge.

| Branch    | Deploys to | Protected | Who merges |
| --------- | ---------- | --------- | ---------- |
| `main`    | production | yes       | PR + 1 approval + green CI |
| `staging` | staging    | yes       | PR + green CI |

There is deliberately **no `develop` branch**. GitFlow's `develop` exists for teams
running several release trains at once. With two people deploying continuously it
would hold the same commits as `staging` and gate nothing, while doubling the
merge-conflict surface across every app in the monorepo.

## The flow

```
feature/otp-endpoints ──PR──▶ staging ──PR──▶ main
                                 │              │
                          staging deploy    production
```

1. Branch off `staging`:
   ```sh
   git checkout staging && git pull
   git checkout -b feature/otp-endpoints
   ```
2. Work, commit, push. Open a PR into `staging`. CI must pass.
3. Merge. The staging deploy runs. Test it there.
4. When staging is good, open a PR from `staging` into `main`. That is the promotion.
5. Merge. Production deploys.

### Branch names

| Prefix     | For                        | Example                    |
| ---------- | -------------------------- | -------------------------- |
| `feature/` | new work                   | `feature/otp-endpoints`    |
| `fix/`     | bug fixes                  | `fix/order-total-rounding` |
| `chore/`   | tooling, deps, config      | `chore/bump-prisma`        |
| `hotfix/`  | urgent production fix      | `hotfix/momo-callback-500` |

### Hotfixes

Branch from `main`, PR into `main`, then **immediately** merge `main` back into
`staging` so the branches don't drift:

```sh
git checkout main && git pull
git checkout -b hotfix/momo-callback-500
# ...fix, PR into main, merge...
git checkout staging && git merge main && git push
```

## The monorepo trap — read this

Environment branches couple release cadence across **every app in the repo**.

If a half-finished landing page is sitting in `staging` and you need to promote a
backend fix to production, you cannot: merging `staging → main` drags the unfinished
frontend work along with it.

Two mitigations, in order of effort:

1. **Keep promotions small and frequent.** Merge `staging → main` often, so the
   window where the two branches differ stays short. This is enough at our size.
2. **Promote by tag instead of branch** (`api-v0.3.0`, `web-v0.3.0`) once the two
   apps genuinely need independent release cadence. The branches above stay as they
   are; only the deploy trigger changes.

Do not let `staging` sit unmerged for days. That is what turns the trap into an outage.

## CI

`.github/workflows/ci.yml` runs `lint`, `typecheck` and `build` on every PR into
`main` or `staging`.

It uses Turbo's `--filter=...[base]` so only the workspaces affected since the base
commit are built — a web-only change will not build the API or, later, the mobile
app. If the base commit can't be resolved (first push, force-push) it falls back to
building everything rather than skipping checks.

> If the API lands under `services/api` rather than `apps/api`, add `services/*` to
> `pnpm-workspace.yaml` or pnpm and Turbo will not see it.

## Never force-push a shared branch

On 2026-09-03 a force-push to `main` rewrote history from the root commit, leaving
every clone with a branch that had no common ancestor with the remote. Recovering
meant `git reset --hard origin/main` and getting lucky that no unique work existed
locally.

The rulesets in `scripts/setup-branch-protection.sh` block this on `main` and
`staging`. Set `git config pull.ff only` locally so a rewritten history fails loudly
instead of silently creating a merge mess.
