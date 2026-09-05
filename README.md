# Brunova Website

Production public website for Brunova systems engineering and operational intelligence.

## Local development

Supported local toolchain: Node 24, Corepack and the pnpm version pinned in `package.json`.

```bash
corepack pnpm install --frozen-lockfile
corepack pnpm dev
```

Open `http://localhost:3000`.

## Quality gates

```bash
corepack pnpm format:check
corepack pnpm lint
corepack pnpm typecheck
corepack pnpm test
corepack pnpm test:e2e
SITE_URL=http://localhost:3000 corepack pnpm build
corepack pnpm bundle:report
corepack pnpm lighthouse
```

Docker is the authoritative production build/runtime boundary; the VPS does not require host Node or pnpm.

## Production deployment

The canonical architecture is a Next.js standalone image managed by Docker Compose behind a trusted HTTPS reverse proxy. The application port is bound to loopback, the container runs non-root with a read-only filesystem, and no persistent application data is stored locally.

Do not deploy until the production approval gate is complete. The canonical command for an approved revision is:

```bash
cp .env.example .env
# Configure approved production values.
./scripts/deploy.sh
```

Full architecture, environment contract, proxy/TLS requirements, operator commands, rollback, backups and launch checklist:

- [Production deployment](docs/operations/PRODUCTION_DEPLOYMENT.md)
- [Application hardening](docs/operations/HARDENING.md)

Never commit `.env`, credentials, QA artifacts, private specifications or VPS-specific values.

## Branch policy

```text
feature/* → develop → main
```

Feature branches are reviewed through `develop`. `main` represents the explicitly approved production line; deployment work must not bypass that policy.
# Acquisition Portal (3G)

`/portal/acquisition` is dynamically authenticated against the existing Portal
Backend session before rendering. It is noindex/private/no-store. API traffic is
same-origin `/api/acquisition/v1`; no DB/Gateway access or business decisions live
in Web. The typed client validates schema version 1 and the `3g-v1` surface handshake.
The existing operator can inspect evidence and submit confirmed CONTINUE/HOLD/REJECT
with CSRF, stable command identity and expected version. A conflict refreshes detail
without automatically retrying the decision. A network retry retains the original
payload. Counts, eligibility, permitted actions and refill come from Engine.

Cycle, Accounts (outcome filter and cursor pages), primary Attention, and Work/Health
are bounded surfaces. Empty capacity is intentional; no enable-gate, arbitrary CRUD,
buyer/contact, message, email or HubSpot action is present. Refresh is explicit.

For isolated local server-rendered auth checks, `PORTAL_BACKEND_INTERNAL_URL` may
point to a trusted local backend; production defaults to `https://brunova.mx`.
Never point this server-only value at an untrusted origin: it receives the session
cookie for validation. Runtime production uses the existing nginx API boundary.
`tests/unit/acquisition.test.tsx` covers empty/gate/loading/auth states, epistemic
presentation, confirmation/refill, stale conflicts, stable retries and contract drift.

3G validation (2026-09-05): 84 tests, typecheck, lint and production build pass.
Local real-PostgreSQL browser QA completed CONTINUE/HOLD/REJECT with deterministic
refill (five active; overflow 14 to 11). Wide desktop (1440), laptop (1280) and mobile
(390) layouts showed no horizontal overflow; axe found no violations in the tested
dialog states. This local harness used a synthetic identity, not Google production auth.
Production authenticated empty state, health and logout were observed. The populated
deployed Google trace is still blocked by operator reauthentication, so 3G is NOT
COMPLETE and 3H must not begin. Temporary production routing was restored and its
synthetic database removed; production remains empty with both safety gates disabled.
