# Tinyrack UI workspace

This repository contains the public React component package, the reusable
Tinyrack documentation framework, and the statically generated design-system
documentation that consumes both packages.

## Workspaces

- `packages/ui` — the published `@tinyrack/ui` package
- `packages/docs` — the published `@tinyrack/docs` React Router framework
- `packages/homepage` — the thin documentation site for `design.tinyrack.net`

## Development

```bash
pnpm install
pnpm dev
```

## Validation

```bash
pnpm test:component
pnpm test:coverage
pnpm verify
pnpm test:docs
pnpm verify:release
pnpm pack:ui
pnpm pack:docs
```
