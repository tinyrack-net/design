# Storybook component pages

Storybook is the visual review surface for the Tinyrack theme adapters. Component pages follow a Spectrum-style model: docs first, then a small set of meaningful stories that describe real component axes.

The goal is a browsable catalog, not exhaustive per-component documentation. Each component gets concise docs and a clean default canvas, with additional stories only when they answer a useful design or implementation question.

## Generated stories

Generated component stories live under `stories/{mantine,daisyui}/components/`.

Do not hand-edit those files directly. Update the showcase registry, story metadata, or generator source instead, then regenerate stories.

```bash
pnpm generate:stories
```

CI verifies those generated files with:

```bash
pnpm check:stories
```

Individual generated stories must render a minimal component preview through `SingleComponentStory`. Do not wrap single component stories in gallery-only `showcase-card` chrome such as category headers, entry IDs, preview panels, or repeated descriptions. The generated Storybook canvas should show the component story itself; catalog cards belong only on aggregate showcase gallery pages.

When a showcase entry has original component variants, the registry must declare component controls and the generated story must expose those controls through Storybook `args/argTypes`. Controls should map to the underlying component API or class modifiers, such as Mantine `variant`, `size`, `color`, `radius`, `disabled`, and `loading`, or daisyUI tone, size, style, shape, placement, and checked/open states. Do not use a single story switch as the primary way to inspect component variants.

## Story types

| Story type | Purpose |
| --- | --- |
| Docs | Always included. Provides an overview, quick preview, and concise notes. |
| Default | Always included. Shows a clean component canvas for the recommended baseline usage. |
| Variants | Included only when the component has real visual variants. |
| Sizes | Included only when size or density is a real axis. |
| States | Included only when disabled, loading, invalid, selected, or similar states matter. |
| Examples | Included only for high-value product-like examples that clarify real usage. |

Do not generate universal `Tokens`, `Accessibility`, `Playground`, or `Composition` pages for every component. Put system-level token and adapter guidance in foundations or adapter docs. Add accessibility or composition notes to component docs only when they are specific and useful.

## Storybook docs pages

Storybook also includes static design-system documentation pages outside the generated component files. The Storybook sidebar starts with onboarding, then moves from foundations to adapter guidance and product-like demos:

- `Welcome/*` for package purpose, installation, and the recommended review route.
- `Foundations/*` for colors, typography, spacing, radius, and shadows.
- `Adapters/*` for Tailwind, daisyUI, Mantine, and Astro Starlight integration notes.
- `Demo/*` for product-like Mantine, daisyUI, and Starlight pages that show how the adapters feel in real surfaces.

Use those pages for system-level guidance. Use generated component pages for adapter-specific component review.

Adapter docs should answer integration questions directly: which export to import,
which provider or data attribute is required, when to use combined presets, when to
switch to explicit composition, and which common mistakes to check before shipping.

Demo pages are not component API documentation. They should look like realistic
Tinyrack product or docs screens and should combine multiple primitives so spacing,
contrast, hierarchy, and theme inheritance are visible at page level.

## Verification

Run showcase tests after changing registries, story renderers, or generated stories:

```bash
pnpm check:stories
pnpm test:showcase
```

Build Storybook before shipping documentation or showcase changes:

```bash
pnpm storybook:build
```

Audit generated Storybook output for missing, blank, narrow, or broken story pages:

```bash
pnpm storybook:audit
```

The audit also flags individual stories that still include gallery card clutter or generated story files that do not use `SingleComponentStory` with registry-backed args/argTypes.
