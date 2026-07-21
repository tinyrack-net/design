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

`pnpm dev` assigns a stable initial port from the canonical Git worktree path,
so registered worktrees use distinct ports and keep them across restarts. If
that port is occupied, Vite continues with the next available port. Override
the assignment when needed with `pnpm dev -- --port 4173`.

The assignment can change if the checkout is moved. The same assignment applies
when running the homepage package's `dev` script directly.

## Validation

Each package owns its builds and tests. Build workspace dependencies in order,
then run only the package you changed:

```bash
pnpm build
pnpm --filter @tinyrack/ui test
pnpm --filter @tinyrack/docs test:unit
pnpm --filter @tinyrack/homepage test
pnpm pack:ui
pnpm pack:docs
```

Every package exposes only `test`, `test:unit`, and `test:e2e`. CI prepares the
ordered build once and runs the three package test jobs in parallel.
