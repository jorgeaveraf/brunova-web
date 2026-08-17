# Brunova Website

Production corporate website foundation for Brunova systems engineering and operational intelligence.

The canonical production model is a portable Next.js standalone container managed with Docker Compose. The current application includes the production homepage, core routes and the server-mediated contact conversion path.

## Requirements

- Node.js 24 Active LTS for local application development.
- Corepack.
- Docker with Compose v2 for production verification and VPS operation.
- Git and GitHub SSH access for repository work.

The project pins the exact pnpm 11.x release in `package.json` and the exact Node container image in `Dockerfile`.

## Local development

```bash
corepack enable
corepack pnpm install --frozen-lockfile
corepack pnpm dev
```

Open `http://localhost:3000`.

The local server uses `http://localhost:3000` as the fallback `SITE_URL`. To test another canonical origin, create an uncommitted `.env` from `.env.example`.

## Quality commands

```bash
corepack pnpm lint
corepack pnpm typecheck
corepack pnpm test
corepack pnpm exec playwright install chromium
corepack pnpm test:e2e
corepack pnpm build
corepack pnpm format:check
```

The host must use Node 24 for the supported local toolchain. Docker is the authoritative production-runtime verification.

## Environment configuration

Create the local runtime file:

```bash
cp .env.example .env
```

Application values:

| Variable                     |           Required | Purpose                                                    |
| ---------------------------- | -----------------: | ---------------------------------------------------------- |
| `SITE_URL`                   |         Production | Server-only canonical origin used during build and runtime |
| `N8N_CONTACT_WEBHOOK_URL`    | Contact activation | HTTPS production webhook URL                               |
| `N8N_CONTACT_WEBHOOK_SECRET` | Contact activation | Bearer secret for server-to-server authentication          |
| `CONTACT_RATE_LIMIT_SALT`    | Contact activation | At least 16 characters; hashes client addresses in memory  |
| `PORTAL_URL`                 |                 No | External client portal destination                         |

Compose controls:

| Variable       | Default     | Purpose                                 |
| -------------- | ----------- | --------------------------------------- |
| `BIND_ADDRESS` | `127.0.0.1` | Host interface exposed by Compose       |
| `PORT`         | `3000`      | Host port mapped to container port 3000 |
| `IMAGE_TAG`    | `local`     | Local image tag                         |

Never commit `.env` or secrets. `SITE_URL` is passed as a non-secret build argument so statically generated canonical metadata uses the deployment origin. Contact credentials remain runtime-only and never enter Docker build arguments.

The contact page remains available when these three contact values are absent, but submissions fail closed with a controlled service-unavailable response. Production activation requires all three values. External production webhook URLs must use HTTPS; loopback HTTP is accepted only for controlled local verification.

## Production container verification

```bash
cp .env.example .env
docker compose config
docker compose build
docker compose up -d
docker compose ps
curl --fail http://127.0.0.1:3000/api/health
docker compose logs -f web
```

Expected health response:

```json
{ "status": "ok" }
```

Stop the local stack:

```bash
docker compose down
```

The runtime container:

- uses Next.js standalone output,
- runs as non-root user `nextjs`,
- has a read-only filesystem with an ephemeral `/tmp`,
- restarts unless explicitly stopped,
- exposes no persistent application volume,
- checks only application health, not n8n availability.

## VPS first deployment

```bash
git clone git@github.com:jorgeaveraf/brunova-web.git
cd brunova-web
cp .env.example .env
# Edit .env with the production SITE_URL and runtime configuration.
docker compose up -d --build
docker compose ps
```

With the default `BIND_ADDRESS=127.0.0.1`, the container is reachable only from the VPS itself. Point Nginx or another host reverse proxy at `http://127.0.0.1:3000`.

## Reverse proxy boundary

The reverse proxy should:

- terminate HTTPS/TLS,
- route the Brunova domain to `127.0.0.1:3000`,
- forward `Host` and `X-Forwarded-Proto`,
- overwrite, rather than append user-controlled values to, `X-Real-IP` and `X-Forwarded-For`,
- optionally apply compression and additional security headers,
- preserve the `/api/contact` 16 KiB request limit and allow its bounded eight-second upstream timeout.

`SITE_URL` is the authoritative allowed browser origin. The application does not infer the public origin from forwarded headers. Keep the Compose port bound to loopback and ensure the trusted reverse proxy replaces client-address headers before they reach the container; the application uses a validated address only to produce a short-lived HMAC rate-limit key and never persists or forwards the raw address.

The application does not require Nginx for local or container operation. Do not expose the container directly to the public internet when a host reverse proxy is expected.

## Routine VPS operations

Status and health:

```bash
docker compose ps
curl --fail http://127.0.0.1:3000/api/health
```

Logs:

```bash
docker compose logs -f web
```

Restart:

```bash
docker compose restart web
```

Deploy an accepted update:

```bash
git fetch origin
git checkout main
git pull --ff-only origin main
docker compose up -d --build
docker compose ps
```

Do not use `docker compose pull` as the primary update operation while the VPS builds images from the repository. It becomes relevant only if a future pipeline publishes versioned images.

## Rollback

Identify the previously accepted tag or commit, then rebuild that source:

```bash
git log --oneline --decorate -n 20
git checkout <known-good-tag-or-commit>
docker compose up -d --build
docker compose ps
curl --fail http://127.0.0.1:3000/api/health
```

After the incident is resolved, return to an accepted branch or release tag. Do not force-reset shared remote branches as a deployment shortcut.

## Branch policy

```text
feature/* → develop → main
```

- `main` represents production-ready accepted state.
- `develop` is the integration branch.
- implementation occurs on `feature/*` branches.
- arbitrary feature branches do not deploy to production.
- merges into `develop` and `main` require review.

BR-017 Phase 0–4 are integrated into `develop`. Phase 5 work is performed on `feature/br-017-contact-conversion` and remains unmerged until approved.

## Current limitations

- Production pages, global navigation and the contact conversion experience are implemented.
- Contact delivery requires production n8n values and downstream deduplication keyed by the forwarded browser `idempotency_key`.
- The in-memory rate limiter is instance-local defense-in-depth. A reverse-proxy or provider-level limit remains recommended for production, but is not required for application startup.
- Favicon and production Open Graph artwork are not yet supplied.
- The approved logo is a dark-backed raster source; a future vector/transparent source is recommended.
