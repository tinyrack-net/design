# Tinyrack UI workspace

This repository contains the public React component package and its statically
generated design-system documentation.

## Workspaces

- `packages/ui` — the published `@tinyrack/ui` package
- `packages/homepage` — the React Router documentation site for `design.tinyrack.net`

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
```
