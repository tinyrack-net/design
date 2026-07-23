---
name: tinyrack-ui
description: Build and maintain React interfaces that consume the published @tinyrack/ui package. Use when selecting Tinyrack components, adding component imports and styles, configuring Tailwind CSS, composing component anatomy, or correcting consumer-side Tinyrack UI integration.
---

# Tinyrack UI

Use the installed package's public subpaths and preserve its explicit styling
contract. Treat the application as the owner of product behavior and Tinyrack as
the owner of reusable component semantics.

## Integrate the package

1. Inspect the installed package's README, `package.json` exports, and relevant
   type declarations before changing code. Treat that installed version as the
   source of truth; do not infer APIs from memory or another Tinyrack version.
2. Confirm the project uses React 19 or newer, React DOM 19 or newer, Tailwind
   CSS 4.3 or newer, and a Tailwind integration for its build tool.
3. Import foundation CSS before component CSS:

   ```tsx
   import '@tinyrack/ui/core.css';
   import '@tinyrack/ui/components/button.css';
   import { TRButton } from '@tinyrack/ui/components/button';
   ```

4. Import only the public subpath needed by the interface. Do not invent a root
   barrel, `/react` or `/dom` suffix, overlay-manager path, or Astro renderer.
5. Compose compound components through their semantic namespace parts, such as
   `TRTabs.Root`, `TRTabs.List`, `TRTabs.Tab`, and `TRTabs.Panel`.
6. Preserve the component's native props, events, refs, state callbacks, focus
   behavior, and accessibility semantics. Add application-specific labels and
   status text where the product context requires them.

## Use public paths

| Purpose | Path |
| --- | --- |
| Component | `@tinyrack/ui/components/<component>` |
| Component CSS | `@tinyrack/ui/components/<component>.css` |
| Token metadata | `@tinyrack/ui/core` |
| Foundation CSS | `@tinyrack/ui/core.css` |
| React MDX map | `@tinyrack/ui/mdx` |
| React MDX CSS | `@tinyrack/ui/mdx.css` |
| Provider | `@tinyrack/ui/providers/<provider>` |

Import component CSS explicitly. Ensure `core.css` reaches the Tailwind build
before component styles so Tinyrack tokens, responsive variants, and authored
Tailwind CSS resolve correctly.

## Verify changes

- Run the consumer project's typecheck and relevant component or browser tests.
- Build the consumer application to exercise Tailwind processing and package
  export resolution.
- Inspect interactive states for keyboard operation, focus, dismissal, portal
  placement, disabled behavior, and accessible naming when applicable.
- Fix consumer integration in the consumer project. Do not patch installed
  package files under `node_modules`.
