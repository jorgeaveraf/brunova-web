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
