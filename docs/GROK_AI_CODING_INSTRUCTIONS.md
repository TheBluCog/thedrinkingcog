# Grok.AI Coding Instructions — The Drinking Cog

This document is written for Grok.AI or any AI coding assistant working on `TheBluCog/thedrinkingcog`.

## Mission

Build, debug, and maintain a small Next.js app called **The Drinking Cog**.

The app is not a Shopify storefront anymore. It is a single-page interactive drinking-bird simulation. The goal is simple:

> The bird must visibly drink when the user presses **Start Simulation**.

The UI should remain dark, cyan, cinematic, mobile-friendly, and playful.

## Current product intent

The app should show:

- A title: `The Drinking Cog`
- A Start/Pause button
- A Reset button
- A simulation speed slider
- Status panels for cycles, speed, tilt, and phase
- An SVG drinking bird
- A cup beside the bird
- A visible drinking animation:
  - bird pivots forward
  - beak moves toward the cup
  - water glow/ripple/bubbles appear during drink phase
  - bird resets upright after drinking

## Active app surface

Treat these as the active production surface:

```txt
app/page.tsx
app/layout.tsx
app/globals.css
app/sitemap.ts
app/robots.ts or app/robots.txt route if present
app/opengraph-image.tsx
next.config.ts
package.json
tsconfig.json
scripts/smoke-url.mjs
scripts/smoke-local.mjs
scripts/verify-vercel-status.mjs
.github/workflows/smoke-and-verification.yml
```

The actual drinking animation lives primarily in:

```txt
app/page.tsx
```

## Critical rule: do not rebuild Shopify

This repository originally contained a Shopify Commerce scaffold. That scaffold is stale and has repeatedly broken Vercel builds under Next 16.

Do **not** reintroduce Shopify storefront functionality unless George explicitly asks.

Avoid touching or importing:

```txt
lib/shopify/**
components/cart/**
components/product/**
components/grid/**
components/layout/**
components/icons/**
components/opengraph-image.tsx
```

If those files are still present, they are legacy code. They should either be ignored, deleted, or stubbed. They should not block the Drinking Cog app.

## Known legacy failure patterns

The following failures have already occurred and should not be reintroduced.

### 1. Missing client directive

`app/page.tsx` uses React client hooks. It must begin with:

```tsx
'use client';
```

This must be the first executable line before imports.

### 2. Stale Shopify dynamic routes

These routes caused prerender failures and should stay removed/disabled:

```txt
app/[page]/page.tsx
app/[page]/opengraph-image.tsx
app/search/page.tsx
app/search/[collection]/page.tsx
app/search/[collection]/opengraph-image.tsx
app/product/[handle]/page.tsx
app/api/revalidate/route.ts
```

### 3. Shopify cache directives

`lib/shopify/index.ts` used canary-only or version-sensitive patterns such as:

```ts
'use cache';
cacheTag(...);
cacheLife(...);
revalidateTag(TAGS.collections);
```

Under modern Next.js versions, stale Shopify code can break type-checking or compilation.

The Drinking Cog app should not depend on this code.

### 4. Dead cart/product components

Dead storefront components caused TypeScript errors such as:

```txt
components/cart/add-to-cart.tsx
components/cart/delete-item-button.tsx
components/cart/actions.ts
```

These are not needed for the app. Do not spend time making cart/product commerce work unless explicitly requested.

### 5. Missing dependency whack-a-mole

Old components may reference:

```txt
@heroicons/react
@headlessui/react
clsx
geist
sonner
```

If active code does not require them, prefer removing/stubbing the old component instead of adding dependencies solely to support dead commerce code.

## Package and build expectations

The app currently targets:

```json
{
  "next": "16.2.6",
  "react": "19.2.0",
  "react-dom": "19.2.0"
}
```

Use npm for deployment consistency unless the repo is intentionally changed back to pnpm.

Expected commands:

```bash
npm install
npm run build
npm run smoke:local
```

If you generate a new `package-lock.json`, commit it for deterministic installs.

## TypeScript strategy

The build should type-check the active app only.

`tsconfig.json` should keep TypeScript focused on active Next app files. A good scope is:

```json
{
  "include": [
    "next-env.d.ts",
    "next.config.ts",
    "app/**/*.ts",
    "app/**/*.tsx",
    ".next/types/**/*.ts",
    ".next/dev/types/**/*.ts"
  ],
  "exclude": [
    "node_modules",
    "lib/shopify/**",
    "components/cart/**",
    "components/product/**"
  ]
}
```

If Next modifies `tsconfig.json` during build, keep the mandatory Next 16 settings:

```json
{
  "moduleResolution": "bundler",
  "jsx": "react-jsx"
}
```

## Animation implementation guidance

The bird is an SVG in `app/page.tsx`.

The important phase logic should roughly behave like this:

```ts
const phase = useMemo<BirdPhase>(() => {
  if (!isRunning) return 'idle';

  const step = cycleCount % 4;
  if (step === 1) return 'drinking';
  if (step === 2) return 'resetting';
  if (step === 3) return 'cooling';
  return 'drinking';
}, [cycleCount, isRunning]);
```

Start should immediately trigger the drinking phase:

```tsx
onClick={() => {
  setIsRunning((value) => {
    if (!value) {
      setCycleCount(1);
    }
    return !value;
  });
}}
```

The visual drinking state should be obvious:

```ts
const tilt = phase === 'drinking' ? 40 : phase === 'resetting' ? 8 : phase === 'cooling' ? -4 : 0;
const isDrinking = phase === 'drinking';
```

SVG guidance:

- Use a pivot near the bird base so the entire body tips forward.
- Put the cup near the beak, not at the bird’s feet.
- During drinking phase, show water contact:
  - ripple ellipse
  - glow circle
  - bubbles or droplets
- The bird should not merely bob vertically. It must rotate enough for the beak to approach the cup.

Current desirable SVG transform pattern:

```tsx
<g
  style={{
    transformBox: 'fill-box',
    transformOrigin: '160px 350px',
    transform: `rotate(${tilt}deg) translateY(${bob}px)`,
    transition: 'transform 700ms cubic-bezier(.2,.8,.2,1)'
  }}
>
```

If it still does not look like drinking on mobile, increase one or more of:

```ts
tilt: 48 to 55 degrees
cup y-position: move upward
cup x-position: move closer to beak
transition duration: 500-700ms
```

## Smoke-test contract

The app must render these strings/markers:

```txt
The Drinking Cog
home-ready
```

The smoke scripts depend on this.

Do not remove:

```tsx
<span data-smoke="home-ready" className="sr-only">
  home-ready
</span>
```

## Deployment verification

Vercel deploys on pushes to `main`.

Check GitHub commit status for the `Vercel` context. The deployment is not done until it says `success`.

The public URL may show `DEPLOYMENT_NOT_FOUND` until a successful deployment is promoted.

## Preferred repair order

When Vercel fails, use this order:

1. Read the exact Vercel error.
2. If it references `app/page.tsx`, patch the app directly.
3. If it references Shopify/cart/product code, remove, stub, or exclude that dead code.
4. If it references dependencies missing from active app code, add only what is needed.
5. If it references dead commerce code, do **not** rebuild commerce. Remove/stub/exclude it.
6. Re-run build.
7. Verify with smoke test.
8. Commit with a clear message.

## Commit message style

Use direct commit messages:

```txt
Make bird visibly drink from cup
Remove stale Shopify route
Disable stale cart component
Narrow TypeScript include scope
Fix Vercel build after Next upgrade
```

## Final acceptance criteria

A successful change must satisfy:

```txt
npm run build passes
Vercel status is success
The page loads on mobile
Start Simulation makes the bird visibly drink
Reset returns the bird upright
Smoke marker remains present
No Shopify route is required for production
```

## Operator note

George wants fast, practical fixes. Do not over-architect. Do not rebuild the old storefront. Keep the app simple, visible, fun, and deployable.

The bird must drink. That is the mission.
