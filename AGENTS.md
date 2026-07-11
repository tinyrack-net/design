# Tinyrack UI Component Development Guidelines

This file applies to the entire repository. Use these rules when creating,
changing, documenting, or publishing components.

## Architecture

Tinyrack UI is Web Platform-first. The canonical component contract is semantic
HTML, Tinyrack-prefixed CSS, and framework-neutral DOM behavior when native HTML
is not sufficient.

- Do not make Astro or React the source of truth for a component.
- Do not require React for HTML or Astro consumption.
- Treat Astro as a representative HTML consumer, not as a separate component
  implementation target.
- Provide a React adapter only when React ergonomics add real value.
- Do not add an Astro-specific component API by default. Prefer documented HTML
  markup and one processed layout script.
- Do not introduce Web Components merely to share code between Astro and React.
  Use them only when the custom-element lifecycle is itself required.

The intended dependency direction is:

```text
contract.ts + component.css + optional dom.ts
                    |
          +---------+---------+
          |                   |
      HTML / Astro        React adapter
      direct use          thin wrapper
```

There must be one behavioral implementation. Shared algorithms such as overlay
stacking, focus management, keyboard handling, positioning, selection, and
cleanup belong in the framework-neutral DOM layer. A framework adapter must not
reimplement them.

## Component Ownership Boundaries

Use the smallest workable, colocated component folder:

```text
src/components/<component>/
  contract.ts
  <component>.css
  dom.ts                 # only when shared client behavior is required
  react.tsx              # only when a React adapter is public
  *.test.ts
  *.browser.test.tsx
```

- `contract.ts` owns public values, literal unions, class names, defaults, and
  event/reason types. It must not import React, Astro, or browser-only modules.
- `<component>.css` owns the public visual contract and must work independently
  of React. Use `tr-` class prefixes and existing Tinyrack tokens.
- `dom.ts` owns reusable browser behavior. It must not import React or Astro and
  must avoid browser-global access during module evaluation so SSR imports stay
  safe.
- `react.tsx` owns only React-specific concerns: JSX rendering, refs, `asChild`,
  controlled/uncontrolled state, and React event composition.
- Keep tests beside the implementation. Do not create new test-only directory
  layers unless the test is a repository-level fixture or E2E check.
- Do not add aggregate barrels or alternate folder hierarchies without a clear
  public API need.

## HTML and CSS Contract

- Start from semantic native elements and browser APIs before adding custom
  behavior. Prefer `button`, `dialog`, `popover`, form semantics, and ARIA state
  over div-based simulations.
- HTML class names and `data-*` attributes are public API. Keep them explicit,
  stable, and documented.
- Use `data-*` attributes for component variants, sizes, placement, and state
  that must be shared by HTML and framework adapters.
- Accessibility must be present in the HTML contract, not patched only by a
  React effect.
- Keep generated markup valid when consumers place forms, headings, or other
  semantic elements inside the component.
- SSR output must be deterministic and must not claim browser state that has not
  been activated. Serialize deferred intent through data attributes when needed.
- Convenience sizing and placement must remain overrideable by consumer classes
  or styles. Use cascade layers or custom properties where component CSS would
  otherwise defeat Tailwind utilities.
- Prefer native top-layer behavior over a public global z-index scale.

## Color System

Use the color system in one direction only:

```text
base colors -> functional/semantic tokens -> component/pattern tokens
```

- Base palettes (`tinyrackPalettes`) are documented token-authoring material.
  Use them only to construct functional tokens or a colocated component/pattern
  token. Do not use Base values directly in component CSS, React or Astro
  markup, or product Storybook examples.
- Product UI and component defaults must choose functional `--tinyrack-*`
  colors by meaning, not because a value happens to look correct in the current
  theme. Base palettes are TypeScript-only and must not be added to the public
  CSS variables or Tailwind theme bridge.
- Colocated `--tr-*` component/pattern tokens must fall back to an appropriate
  functional `--tinyrack-*` token. Keep a color component-specific when it does
  not express a reusable, independently themeable role.
- Keep action hierarchy separate from status meaning. Action-control variants
  such as Button use `secondary`, `primary`, and `danger`. Status variants use
  `neutral`, `info`, `success`, `warning`, and `danger`. Do not add a global
  secondary color merely to implement a secondary action.
- Add a global functional color only when multiple components share its meaning
  and themes may need to change it independently. Add a Base color only for a
  concrete functional or component/pattern consumer.
- Define light and dark values together. Add contrast coverage for text/content
  pairs at 4.5:1 and for essential borders and focus indicators at 3:1.
- Do not add arbitrary hex, rgb, hsl, or other literal colors to component CSS.
  External content colors such as syntax-highlighter output and transparent
  backdrop composition are allowed exceptions when the reason remains explicit
  in the implementation and is covered by tests.

## DOM Behavior

Add a framework-neutral DOM module only when native HTML and CSS cannot provide
the complete contract.

- Prefer event delegation at a stable document or component root over attaching
  one listener per rendered instance.
- Preserve native declarative behavior as the no-JavaScript or pre-hydration
  baseline whenever possible.
- Clean up observers, timers, subscriptions, and positioning work when elements
  disconnect or when the manager is destroyed.
- Support DOM replacement and client-side navigation without requiring a full
  page reload when the consuming framework can replace page content.
- Emit DOM events for observable state changes so framework adapters and plain
  HTML consumers share the same behavior contract.
- Keep focus restoration, keyboard order, and nested teardown deterministic.

## React Adapter

React is an adapter, not the behavioral core.

- Render the same semantic elements, classes, attributes, and DOM part order as
  the HTML contract.
- Delegate shared behavior to the DOM implementation.
- Keep React and React DOM as optional peers when non-React exports can operate
  without them.
- Support controlled and uncontrolled APIs only for state that consumers
  reasonably need to own.
- When `asChild` is supported, merge refs and user events. If a user event calls
  `preventDefault()`, do not run the internal action.
- Preserve useful native attributes in server-rendered output so supported
  browser behavior can work before hydration.
- Do not add React-only variants or dismissal behavior without first defining
  the equivalent HTML/DOM contract.

## Astro and HTML Consumption

Do not create a parallel Astro implementation for ordinary components.

- HTML and Astro consume the public CSS and DOM contracts directly.
- Put one framework-neutral manager initialization in a shared Astro layout when
  document-level behavior is required.
- Use a processed Astro `<script>` with no extra attributes so npm imports are
  bundled and the script is deduplicated.
- An Astro application that already uses React may choose the React adapter as a
  hydrated island, but this is an optional consumer decision, not the default
  Tinyrack API.
- Documentation should lead with the HTML/DOM path for Astro. Do not require
  `@astrojs/react`, React hydration, or a React runtime for the default example.
- Astro coverage should prove that the public DOM export builds and runs without
  importing React.

## Packaging

Every new public component must be wired through the real package boundary.

- Add explicit `package.json` `files` and `exports` entries. Do not expose a root
  aggregate export unless the package contract changes intentionally.
- Add standalone CSS to `scripts/copy-css.ts`.
- Keep framework-neutral dependencies in `dependencies`; keep renderer runtimes
  as optional peers when possible.
- Update `e2e/package-exports.test.ts` and `e2e/dist-package-smoke.ts` for public
  subpaths.
- Import the CSS in `.storybook/preview.css` and register docs in
  `stories/shared/component-docs-manifest.ts`.
- Update README examples when a new consumption surface or public package path
  is introduced.

## Testing

Test each concern once at its source of truth.

- Contract tests lock public values, class names, native semantics, and forbidden
  legacy contracts.
- Browser tests verify computed styles, keyboard behavior, accessibility state,
  logical RTL behavior, overflow, and real native APIs.
- Test shared behavior with raw HTML plus the DOM manager. Do not repeat the full
  behavior matrix through every adapter.
- React tests cover SSR markup parity, controlled/uncontrolled synchronization,
  `asChild`, refs, and event composition.
- Astro tests are public-import build and browser smoke tests. They should verify
  DOM replacement when document-level managers are involved.
- Storybook documentation must include Contract, Install, Usage, Examples,
  Guidance, and API sections with Preview, HTML, and React source where relevant.
- Add the component to the Storybook browser audit when interaction or responsive
  layout is part of the contract.

### Component Browser Test Requirements

Every directory under `src/components` must keep these three colocated Vitest
Browser Mode suites. `e2e/component-browser-test-structure.test.ts` enforces the
structure for existing and newly added components.

```text
src/components/<component>/
  <component>-dom.browser.test.tsx
  <component>-react.browser.test.tsx
  <component>-parity.browser.test.tsx
```

- The DOM suite renders raw semantic HTML and, where applicable, initializes the
  framework-neutral DOM manager. It owns native semantics, DOM events, form
  behavior, focus and keyboard interaction, computed CSS, real browser APIs,
  cleanup, DOM replacement, and ShadowRoot behavior.
- The React suite owns adapter-specific behavior: prop and native-attribute
  forwarding, controlled and uncontrolled state, refs and imperative handles,
  `asChild`, user/internal event composition, prop updates, unmount cleanup, and
  behavior after deterministic server markup is hydrated.
- The parity suite renders equivalent raw DOM and React cases and compares the
  normalized public contract: tag and part order, classes, `data-*`, ARIA and
  native attributes, state, observable events, and contract-relevant computed
  styles. Ignore only nondeterministic generated IDs through the shared harness.
- Contract and Node tests may cover public literals, SSR output, source-level CSS
  boundaries, and browser-global-free module evaluation, but they must not stand
  in for behavior that can be exercised in Browser Mode.

Exhaust the public contract instead of sampling representative happy paths.

- Iterate every public literal-union value with `test.each`. Exercise both values
  of boolean and native states, every documented transition and dismissal/change
  reason, and every supported input method.
- Cover each independent option and all meaningful interactions between options.
  Use the complete Cartesian product for small bounded matrices such as component
  size, variant, and appearance combinations.
- Verify success, cancellation, invalid input, disabled/read-only behavior,
  fallback behavior, lifecycle cleanup, controlled rejection, and dynamic DOM or
  prop replacement whenever the component contract exposes those paths.
- Use Browser Mode locators and user events with native browser behavior. Control
  timers deterministically; do not use arbitrary sleeps, snapshot-only assertions,
  `skip`, `todo`, `only`, or coverage-ignore directives.

`pnpm test:component` must pass the complete browser suite in both Chromium and
Firefox. `pnpm test:coverage` runs unit tests plus Chromium Browser Mode coverage
and requires statements, branches, functions, and lines to each reach at least
95% for every component directory and for all components combined. Do not lower
or bypass these thresholds. If a branch is unreachable, preserve public behavior,
remove the dead code, and add a regression test.

Before handoff, run:

```bash
pnpm test:component
pnpm test:coverage
pnpm verify
```

For component documentation or visual changes, also run:

```bash
pnpm storybook:build
pnpm storybook:audit
```

## Review Checklist

Before accepting a component change, confirm:

- Is the canonical contract semantic HTML rather than framework syntax?
- Is shared behavior implemented exactly once?
- Can HTML and Astro use the component without React?
- Does the React adapter render the same DOM contract?
- Is module evaluation SSR-safe?
- Are consumer utility and style overrides preserved?
- Are package exports, copied CSS, Storybook, README, and smoke tests wired?
- Are tests concentrated at the owning layer instead of duplicated per adapter?

Exceptions require an explicit product or platform reason documented in the
change. Framework convenience alone is not sufficient.
