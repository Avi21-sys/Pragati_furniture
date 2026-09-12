# CI/CD Plan — Pragati Furniture Website

> **Revision note:** The Spring Boot backend workflow is gone. Both remaining apps (`frontend`, `notification-service`) are now Node-based, so CI is simpler and more uniform than the original three-workflow plan.

## 1. Approach (unchanged)
Phased, starting minimal, using **GitHub Actions**. Don't skip ahead — each phase builds on the last.

## 2. Phase 1 — Build & Test Only (start here)

### `.github/workflows/frontend-ci.yml`
```yaml
name: Frontend CI
on:
  pull_request:
    paths:
      - 'frontend/**'
  push:
    branches: [main]
    paths:
      - 'frontend/**'

jobs:
  build:
    runs-on: ubuntu-latest
    defaults:
      run:
        working-directory: frontend
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
      - run: npm ci
      - run: npx prisma generate
      - run: npm run build
```

### `.github/workflows/notification-service-ci.yml`
```yaml
name: Notification Service CI
on:
  pull_request:
    paths:
      - 'notification-service/**'
  push:
    branches: [main]
    paths:
      - 'notification-service/**'

jobs:
  build-and-test:
    runs-on: ubuntu-latest
    defaults:
      run:
        working-directory: notification-service
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
      - run: npm ci
      - run: npm test --if-present
```

Path filters still matter — changing only the notification service shouldn't trigger a frontend build, and vice versa.

### What "done" looks like
Same as before: a broken PR fails the check, a clean one passes. This is a real, demonstrable CI skill regardless of stack.

## 3. Phase 2 — Containerize with Docker
Add a `Dockerfile` to `notification-service` (simple — it's a small Express app) and optionally to `frontend` (though if deploying frontend to Vercel, Vercel doesn't need a Dockerfile at all — see Phase 3).

```yaml
- name: Build Docker image
  run: docker build -t pragati-notification:${{ github.sha }} .
```

## 4. Phase 3 — Deploy
- **Frontend (Next.js)** → connect the repo directly to **Vercel**. Vercel builds and deploys automatically on push to `main` — no custom Docker/deploy workflow needed for this part at all. Your `frontend-ci.yml` still runs on PRs for test/build validation, but production deploy is Vercel's job.
- **Notification Service** → push its Docker image to GitHub Container Registry, then deploy to Render/Railway (webhook or native GitHub integration triggers redeploy on new image).

```yaml
- name: Log in to GitHub Container Registry
  uses: docker/login-action@v3
  with:
    registry: ghcr.io
    username: ${{ github.actor }}
    password: ${{ secrets.GITHUB_TOKEN }}

- name: Push image
  run: |
    docker tag pragati-notification:${{ github.sha }} ghcr.io/YOUR_USERNAME/pragati-notification:latest
    docker push ghcr.io/YOUR_USERNAME/pragati-notification:latest
```

## 5. Phase 4 — Polish
- Confirm no secrets are hardcoded — all pulled from GitHub Actions secrets / Vercel & Render env var settings
- Run `npx prisma migrate deploy` as a CI/CD step before the new frontend version goes live in production (keeps DB schema in sync with code automatically)
- Add a staging environment (separate Vercel preview + separate Render service + separate DB) before promoting to production
- Slack/email notification on deploy failure

## 6. What NOT to do yet (unchanged)
- No Kubernetes
- Don't try to unify both apps' pipelines before each works independently
