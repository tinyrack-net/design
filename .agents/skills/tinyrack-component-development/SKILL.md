---
name: tinyrack-component-development
description: Develop, change, document, test, review, package, or publish Tinyrack UI components using the repository's React-only architecture, Base UI behavior boundaries, semantic component files, package subpath exports, color-token rules, React Router documentation, browser coverage requirements, and release checks.
---

# Tinyrack UI Component Development Guidelines

Apply these rules throughout the repository.

## Architecture

Tinyrack UI is React-only. React is the public component contract and Base UI is
the preferred behavioral foundation for accessible interactive primitives.

- Do not add Astro components, framework-neutral DOM managers, React adapters,
  Web Components, or raw-HTML component APIs.
- Use Base UI for focus management, keyboard interaction, portals, positioning,
  dismissal, and controlled/uncontrolled state when it supplies the primitive.
- Wrap Base UI with Tinyrack classes, tokens, defaults, types, and semantic part
  names. Do not re-export a Base UI module unchanged.
- Prefer semantic native elements for presentational components.
- Keep module evaluation SSR-safe and add `"use client"` only to modules that
  actually require client behavior.

## Component Ownership and Naming

Every public component owns one colocated directory and one public entry point.

```text
packages/ui/src/components/button/
  button.tsx
  button.css
  button.browser.test.tsx
  index.tsx
```

Compound components use responsibility-specific part files and are assembled in
`index.tsx`.

```text
packages/ui/src/components/tabs/
  tabs-root.tsx
  tabs-list.tsx
  tabs-tab.tsx
  tabs-indicator.tsx
  tabs-panel.tsx
  tabs.css
  tabs.browser.test.tsx
  index.tsx
```

- `index.tsx` is the only allowed generic filename. Every public component
  directory has one.
- A leaf component's `index.tsx` only re-exports its semantic implementation and
  public types.
- A compound component's `index.tsx` imports its public parts, exports the parts
  individually, and assembles the namespace object such as `Tabs.Root`.
- Never put state, effects, event handling, styling, or JSX implementation in
  `index.tsx`.
- Do not create `packages/ui/src/components/index.tsx` or another aggregate component barrel.
- Do not create files named `react.tsx`, `dom.ts`, `contract.ts`, `shared.ts`,
  `utils.ts`, or `types.ts`. Name internal files by responsibility, such as
  `toast-store.ts` or `tabs-context.ts`.

## Base UI Catalog

- Pin `@base-ui/react` to an exact version. A Base UI upgrade is a reviewed
  design-system migration, not an automatic dependency refresh.
- Treat `packages/ui/scripts/component-catalog.ts` as the single source of truth for Base UI,
  Tinyrack-native, and provider module names. Do not duplicate component lists in
  build or test scripts.
- Every public React anatomy part in the pinned Base UI version must have a
  semantic Tinyrack wrapper, named export, prop type, and compound namespace
  member. Do not expose an incomplete subset under a Base UI module name.
- Match Base UI public names exactly (`Tabs.Tab`, `Dialog`, `Collapsible`,
  `OTPField`, `Separator`). Do not add aliases for displaced Tinyrack names.
- Keep application providers under `@tinyrack/ui/providers/<provider>`; providers
  are not components and are not re-exported from a root barrel.

## React Contract

- Target React 19. Accept `ref` as a normal prop; do not add new `forwardRef`
  wrappers.
- Extend the appropriate native or Base UI props and preserve `className`,
  `style`, refs, native attributes, and user event handlers.
- Use Base UI's `render` contract for polymorphism. Do not add `asChild` or a
  `cloneElement` abstraction.
- Keep controlled and uncontrolled state aligned with the underlying Base UI
  primitive.
- Compound namespaces use semantic part names. Export both the namespace and
  each explicitly named part and prop type from the component `index.tsx`.
- Keep public DOM state in stable `tr-` classes and Base UI `data-*` attributes.

## Color and CSS

Use the color system in one direction only:

```text
base colors -> functional/semantic tokens -> component/pattern tokens
```

- Do not use Base values directly in component CSS. Use Base palettes only to
  author functional or component tokens.
- Product components choose `--tinyrack-*` functional colors by meaning.
- Colocated `--tr-*` tokens fall back to functional tokens.
- Action-control variants use `secondary`, `primary`, and `danger`; status variants use
  `neutral`, `info`, `success`, `warning`, and `danger`.
- Define light and dark values together. Cover text at 4.5:1 and essential
  borders/focus indicators at 3:1.
- Do not add literal colors to component CSS except documented external content
  such as syntax highlighting or transparent backdrop composition.
- Do not add literal spacing, size, radius, border, shadow, layer, opacity, or
  motion values to component declarations. Reuse a `--tinyrack-*` token or add a
  named token to the appropriate foundation group; component customization tokens
  use a `--tr-*` property with a Tinyrack-token fallback.
- Ship CSS separately at `@tinyrack/ui/components/<component>.css`; component JS
  must not auto-import CSS.

## Packaging

- Public JS imports use `@tinyrack/ui/components/<component>` and resolve to the
  component directory's compiled `index.js` and `index.d.ts`.
- Do not expose `/react`, `/dom`, root component barrels, or compatibility aliases.
- Keep React and React DOM as required peers and Base UI as a runtime dependency.
- Wire new CSS through `scripts/copy-css.ts` and validate the packed package with
  a real consumer fixture.
- Keep React MDX at `@tinyrack/ui/mdx`. Do not add an Astro renderer.
- Update README, homepage documentation, package export tests, and dist smoke tests whenever a
  public subpath changes.

## Homepage Documentation

- Every component module owns one `<component>.demo.tsx` definition and one
  `<component>.docs.mdx` page under `apps/homepage/app/content/components`.
- Expose meaningful public behavior through `ComponentPlayground`. Controlled demo
  args must be wired to rendered component events rather than shown as inert metadata.
- Documentation compares relevant variants, sizes, orientations, validation and
  disabled/read-only states at a glance.
- Every rendered example uses `ComponentExampleTabs` with paste-ready React source
  and explicit installation/import guidance.
- Keep the component docs manifest aligned with the package component catalog.
- Validate docs and Playgrounds in light desktop and dark mobile modes. The
  preview canvas must use `--tinyrack-canvas`, stay inside the viewport, and avoid
  page-level horizontal overflow.

## Testing

Test each concern once in React.

- Every component directory contains `<component>.browser.test.tsx`.
- Browser tests cover semantic rendering, props and refs, controlled and
  uncontrolled state, keyboard and focus behavior, disabled/read-only behavior,
  form integration, portals/dismissal, accessibility names, and computed CSS as
  applicable.
- Test Tinyrack wrappers and integration points; do not duplicate Base UI's own
  internal test matrix.
- Add SSR and hydration tests to interactive components.
- Structure tests must reject legacy `contract.ts`, `dom.ts`, `react.tsx`,
  `*-dom`, `*-react`, and `*-parity` suites, and must ensure `index.tsx` remains a
  composition-only entry point.
- `pnpm test:component` runs Chromium and Firefox.
- `pnpm test:coverage` requires statements, branches, functions, and lines to
  reach at least 95% for Tinyrack-owned component code and for all components
  combined. Do not lower or bypass the thresholds.

Before handoff, run:

```bash
pnpm test:component
pnpm test:coverage
pnpm verify
pnpm docs:build
pnpm docs:audit
pnpm verify:release
pnpm pack:ui
```

## Review Checklist

- Is the public contract React-only and imported without a framework suffix?
- Does every component have a composition-only `index.tsx`?
- Are implementation and internal filenames semantic?
- Does Base UI own complex accessible behavior where available?
- Are React refs, events, native attributes, SSR, and hydration preserved?
- Are Tinyrack tokens and consumer style overrides preserved?
- Are Astro, DOM manager, adapter, parity, and compatibility surfaces absent?
- Do package exports, CSS, homepage docs, tests, and packed-package smoke checks agree?
