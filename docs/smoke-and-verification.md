# Smoke and Verification System

This project has a lightweight verification gate for build integrity, local runtime health, and Vercel deployment health.

## Local commands

```bash
pnpm build
pnpm smoke:local
pnpm verify
```

## URL smoke test

```bash
SMOKE_URL=https://thedrinkingcog-git-main-theblucogs-projects.vercel.app pnpm smoke:url
```

The URL smoke test checks that the target page returns HTTP 2xx and contains both:

- `The Drinking Cog`
- `home-ready`

## CI workflow

GitHub Actions runs `.github/workflows/smoke-and-verification.yml` on:

- pushes to `main`
- pull requests
- manual workflow dispatch

The workflow has two gates:

1. `build-and-local-smoke`
   - installs dependencies
   - runs `pnpm verify:ci`
   - builds the Next.js app
   - starts the production server locally
   - probes the app for the smoke marker

2. `vercel-deployment-verification`
   - runs only after pushes to `main`
   - waits for the Vercel commit status to report success
   - smoke-tests the deployed Vercel branch alias

## Failure interpretation

- Build failure means the app does not compile.
- Local smoke failure means the app compiled but did not serve the expected page.
- Vercel status failure means Vercel rejected the deployment.
- Deployed URL smoke failure means deployment succeeded but the public route is not returning expected content.
