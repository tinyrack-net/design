---
name: tinyrack-component-development
description: Maintain Tinyrack UI's public React component contracts. Use when adding a public component or changing its public API, behavior, styling contract, component architecture, or package subpath. Do not invoke for standalone documentation copy edits, generic test review, dependency maintenance, or release-only work.
---

# Tinyrack Component Development

Preserve the project-specific contracts below. Infer routine implementation
details from neighboring components and scale verification to the change.

## React and Behavior

- Keep the public component API React-only. Do not add Astro components,
  framework-neutral DOM managers, adapters, Web Components, or raw-HTML APIs.
- Prefer Base UI for accessible interactive behavior such as focus, keyboard,
  portals, positioning, dismissal, and controlled state. Wrap it with Tinyrack
  names, classes, tokens, defaults, and types rather than re-exporting it raw.
- Target React 19: accept `ref` as a normal prop and do not add new `forwardRef`
  wrappers. Preserve native attributes, refs, styles, classes, and user events.
- Use Base UI's `render` contract for polymorphism; do not introduce `asChild`.
- Keep controlled and uncontrolled behavior aligned with the underlying
  primitive. Keep module evaluation SSR-safe and add `"use client"` only when
  client behavior requires it.

## Files and Public Surface

- Give each public component a colocated directory and one `index.tsx` entry.
  Keep implementation in semantic files such as `button.tsx`, `tabs-root.tsx`,
  or `toast-store.ts`.
- Keep `index.tsx` limited to imports, exports, types, and compound namespace
  assembly. Do not put JSX behavior, state, effects, event handling, or styles
  there.
- Do not add an aggregate component barrel. Export public components through
  `@tinyrack/ui/components/<component>`.
- Export compound parts and their prop types individually as well as through
  the semantic namespace. Preserve Base UI public anatomy when wrapping a Base
  UI module; do not present a misleading partial implementation as the module.
- Keep providers under `@tinyrack/ui/providers/<provider>` and React MDX under
  `@tinyrack/ui/mdx`.
- Keep `@base-ui/react` pinned exactly. Treat its upgrade as a reviewed design-
  system migration.

## Styling

- Follow `base colors -> functional/semantic tokens -> component tokens`.
  Component CSS must consume semantic `--tinyrack-*` tokens; customizable
  `--tr-*` tokens must fall back to them.
- Do not introduce direct palette usage or literal design values in component
  declarations. Add a named foundation token when the existing set is
  insufficient.
- Preserve light and dark behavior, visible focus, and required contrast.
- Ship CSS separately at `@tinyrack/ui/components/<component>.css`; component
  JavaScript must not auto-import it.

## Packaging and Documentation

- When a public subpath changes, update source and published exports together,
  wire CSS copying in `packages/ui/tsdown.config.ts`, and verify a packed
  consumer.
- When consumer-visible API or behavior changes, update the component demo and
  localized component pages. Keep examples paste-ready and wire controlled demo
  args to actual component events.
- Keep component and documentation catalogs filesystem-derived. Do not add a
  second hand-maintained catalog.

## Verification by Change Type

Run the narrowest checks that cover the changed contract:

- Behavior or accessibility: targeted browser tests plus relevant UI unit tests.
- Keyboard, focus, forms, portals, or controlled state: exercise those paths in
  the browser; do not duplicate Base UI's internal test matrix.
- Client lifecycle changes: add or run relevant SSR and hydration coverage.
- Styling contract changes: verify computed CSS and the affected light/dark and
  responsive surfaces.
- Public subpath, build, or packaging changes: run `pnpm pack:ui` and the packed
  consumer coverage included by the UI workflow.
- Component documentation changes: run the homepage package's relevant unit and
  browser checks; inspect affected visual modes when layout changed.
- A new component or broad public-contract change: run the full UI gates:

```bash
pnpm --filter @tinyrack/ui test:unit
pnpm --filter @tinyrack/ui test:e2e
pnpm pack:ui
```

Do not require every full-repository check for a localized change. Before
handoff, report the checks selected and why they cover the affected contract.
