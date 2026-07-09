# Storybook component pages

Storybook is the visual review surface for the Tinyrack theme adapters. Component pages follow a Spectrum-style model: docs first, then a small set of meaningful stories that describe real component axes.

The goal is a browsable catalog, not exhaustive per-component documentation. Each component gets concise docs and a clean default canvas, with additional stories only when they answer a useful design or implementation question.

## Manual component stories

Component stories live under `stories/{mantine,daisyui}/components/`.
They are committed source files and should be edited directly.

CI verifies those manual files with:

```bash
pnpm check:stories
```

Individual stories should render a minimal component preview directly in the story file. Do not route through a shared showcase registry, gallery renderer, generated story wrapper, or aggregate catalog chrome.

When a component has useful controls, declare `args` and `argTypes` in that component's story file. Controls should map to the underlying component API or class modifiers, such as Mantine `variant`, `size`, `color`, `radius`, `disabled`, and `loading`, or daisyUI tone, size, style, shape, placement, and checked/open states.

## Story types

| Story type | Purpose |
| --- | --- |
| Docs | Always included. Provides an overview, quick preview, and concise notes. |
| Default | Always included. Shows a clean component canvas for the recommended baseline usage. |
| Variants | Included only when the component has real visual variants. |
| Sizes | Included only when size or density is a real axis. |
| States | Included only when disabled, loading, invalid, selected, or similar states matter. |
| Examples | Included only for high-value product-like examples that clarify real usage. |

Do not add universal `Tokens`, `Accessibility`, `Playground`, or `Composition` pages for every component. Put system-level token and adapter guidance in foundations or adapter docs. Add accessibility or composition notes to component docs only when they are specific and useful.

## Storybook docs pages

Storybook also includes static design-system documentation pages outside the component story files. The Storybook sidebar starts with onboarding, then moves from foundations to adapter guidance and component pages:

- `Welcome/*` for package purpose, installation, and the recommended review route.
- `Foundations/*` for colors, typography, spacing, radius, and shadows.
- `Adapters/*` for Tailwind, daisyUI, Mantine, and Astro Starlight integration notes.

Use those pages for system-level guidance. Use manual component pages for adapter-specific component review.

Adapter docs should answer integration questions directly: which export to import,
which provider or data attribute is required, when to use combined presets, when to
switch to explicit composition, and which common mistakes to check before shipping.

## Verification

Run story checks after changing component story files:

```bash
pnpm check:stories
```

Build Storybook before shipping documentation or component story changes:

```bash
pnpm storybook:build
```

Audit Storybook output for missing, blank, narrow, or broken story pages:

```bash
pnpm storybook:audit
```

The audit also flags missing manual component stories and forbidden generated-story or showcase-registry dependencies.
