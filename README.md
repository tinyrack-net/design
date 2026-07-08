<div align="center">

# @tinyrack/themes

**Design-system tokens and theme adapters for Tinyrack interfaces.**

[![npm](https://img.shields.io/npm/v/@tinyrack/themes)](https://www.npmjs.com/package/@tinyrack/themes)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node.js](https://img.shields.io/badge/node-%3E%3D24-brightgreen)](https://nodejs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-ready-3178c6)](https://www.typescriptlang.org/)

[Setup Guide](docs/setup-guide.md) · [Component Galleries](docs/storybook-component-pages.md) · [Storybook Deployment](docs/storybook-deployment.md) · [npm Publishing](docs/npm-publishing.md)

</div>

---

`@tinyrack/themes` keeps Tinyrack's interface language in one package.

It exports shared design tokens and thin adapters for Mantine, daisyUI, Tailwind CSS, and Astro Starlight so product apps, docs, and Storybook review surfaces use the same colors, typography, spacing, radii, shadows, and motion.

This package is intentionally theme-first. It aligns existing UI libraries; it is not a general component library.

## Features

- **Shared design tokens** for colors, typography, spacing, radii, shadows, motion, and semantic surfaces
- **Tailwind CSS 4 presets** for Tinyrack utility tokens, daisyUI composition, and Mantine composition
- **daisyUI 5 themes** with Tinyrack light and dark themes plus JS metadata for tests and tooling
- **Mantine 9 theme adapter** with a scoped provider for extension and embedded roots
- **Astro Starlight theme adapter** for Tinyrack documentation sites
- **Storybook review surface** with onboarding, foundations, adapter guides, product-like demos, and component galleries

## Installation

```bash
pnpm add @tinyrack/themes
```

Install the peer libraries needed by the surface you are using.

For environment-specific setup recipes, see [docs/setup-guide.md](docs/setup-guide.md). It covers Tailwind-only, Tailwind+daisyUI, Mantine-only, Tailwind+Mantine, Tailwind+daisyUI+Mantine, and Astro Starlight integrations.

## Quick Start

### Shared tokens

```ts
import { tinyrackTokens, tinyrackSemanticColors } from '@tinyrack/themes/tokens';
```

Shared tokens are library-agnostic. Mantine, daisyUI, and Starlight adapters map these tokens into each library's native theme shape.

### Tailwind CSS 4

For shared Tinyrack Tailwind tokens without a component library:

```css
@import "tailwindcss";
@import "@tinyrack/themes/tailwind.css";
```

This exposes utilities such as `bg-tinyrack-surface`, `text-tinyrack-text`, `text-tinyrack-primary`, `font-tinyrack-body`, and `rounded-tinyrack-box`.

### Mantine

```tsx
import '@mantine/core/styles.css';
import '@tinyrack/themes/mantine.css';
import { MantineProvider } from '@mantine/core';
import { tinyrackMantineTheme } from '@tinyrack/themes/mantine';

export function App({ children }: { children: React.ReactNode }) {
  return <MantineProvider theme={tinyrackMantineTheme}>{children}</MantineProvider>;
}
```

For extension/content-script roots that need scoped Mantine CSS variables:

```tsx
import { TinyrackMantineProvider } from '@tinyrack/themes/mantine';

<TinyrackMantineProvider cssVariablesSelector="#tiny-translate-root">
  <App />
</TinyrackMantineProvider>;
```

### daisyUI / Tailwind CSS 4

Use the combined preset when you want Tailwind utilities and Tinyrack daisyUI themes together:

```css
@import "tailwindcss";
@import "@tinyrack/themes/tailwind/daisyui.css";
```

Equivalent explicit composition:

```css
@import "tailwindcss";
@import "@tinyrack/themes/tailwind.css";
@import "@tinyrack/themes/daisyui.css";
@plugin "daisyui" {
  themes: tinyrack-light, tinyrack-dark --default --prefersdark;
}
```

For Tailwind plus Mantine, combine the Tailwind preset with Mantine's CSS and provider:

```css
@import "tailwindcss";
@import "@tinyrack/themes/tailwind/mantine.css";
```

```tsx
import '@mantine/core/styles.css';
import { TinyrackMantineProvider } from '@tinyrack/themes/mantine';
```

The package also exports JS metadata for tests and tooling:

```ts
import { tinyrackDaisyUiThemes } from '@tinyrack/themes/daisyui';
```

### Astro Starlight

```js
import starlight from '@astrojs/starlight';
import { defineConfig } from 'astro/config';
import { withTinyrackStarlightTheme } from '@tinyrack/themes/astro/starlight';

export default defineConfig({
  integrations: [
    starlight(
      withTinyrackStarlightTheme({
        title: 'Docs',
        customCss: ['./src/styles/global.css'],
      }),
    ),
  ],
});
```

If your Starlight/Astro version does not resolve package subpath CSS inside `customCss`, import it from your local global CSS instead:

```css
@import "@tinyrack/themes/astro/starlight.css";
```

## Component Galleries

Storybook includes onboarding docs, adapter guides, product-like demo pages, and full-theme review galleries for both UI systems. Cloudflare deployment setup is documented in [docs/storybook-deployment.md](docs/storybook-deployment.md):

- `Mantine/*`: committed manual component pages for Mantine Core components selected for Tinyrack theme review.
- `daisyUI/*`: committed manual component pages for component directories shipped by daisyUI 5.5.

Component pages use docs first, then focused manual stories and explicit controls where they add useful review coverage. See [docs/storybook-component-pages.md](docs/storybook-component-pages.md) for the component-page model and verification commands.

The committed story files are checked so generated-story dependencies, missing per-component files, and stale showcase imports fail CI:

```bash
pnpm test:showcase
```

## Compatibility

| Adapter | Target |
| --- | --- |
| Mantine | 9.x |
| daisyUI | 5.x |
| Tailwind CSS | 4.x |
| Astro | 7.x |
| Starlight | 0.41.x |
| Vitest | 4.x browser mode with Playwright |

## Development

```bash
pnpm install
pnpm test
pnpm build
pnpm storybook
pnpm storybook:build
pnpm biome
```

## Export map

- `@tinyrack/themes`
- `@tinyrack/themes/tokens`
- `@tinyrack/themes/tailwind.css`
- `@tinyrack/themes/tailwind/daisyui.css`
- `@tinyrack/themes/tailwind/mantine.css`
- `@tinyrack/themes/mantine`
- `@tinyrack/themes/mantine.css`
- `@tinyrack/themes/daisyui`
- `@tinyrack/themes/daisyui.css`
- `@tinyrack/themes/astro/starlight`
- `@tinyrack/themes/astro/starlight.css`
