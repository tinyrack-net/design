<div align="center">

# Tinyrack Themes

**Organization design system for Tinyrack interfaces.**

[![CI](https://github.com/tinyrack-net/themes/actions/workflows/ci.yml/badge.svg)](https://github.com/tinyrack-net/themes/actions/workflows/ci.yml)
[![npm](https://img.shields.io/npm/v/@tinyrack/themes)](https://www.npmjs.com/package/@tinyrack/themes)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node.js](https://img.shields.io/badge/node-%3E%3D24-brightgreen)](https://nodejs.org/)

[Storybook](https://design.tinyrack.net) · [Setup Guide](docs/setup-guide.md) · [Publishing](docs/npm-publishing.md)

</div>

---

Tinyrack Themes is the shared design system package for Tinyrack product interfaces, documentation sites, and review surfaces.

It packages organization-wide design tokens and thin adapters for Tailwind CSS, daisyUI, Mantine, and Astro Starlight so Tinyrack apps use the same colors, typography, spacing, radii, shadows, motion, and semantic surfaces.

This package is theme-first. It aligns existing UI libraries; it is not a general component library.

## Features

- **Shared design tokens** for colors, typography, spacing, radii, shadows, motion, and semantic surfaces
- **Tailwind CSS 4 presets** for Tinyrack utility tokens and adapter composition
- **daisyUI 5 themes** with Tinyrack light and dark themes plus JS metadata for tests and tooling
- **Mantine 9 theme adapter** with a scoped provider for embedded roots and extension surfaces
- **Astro Starlight adapter** for Tinyrack documentation sites
- **Storybook review surface** with foundations, adapter guides, product-like demos, and component galleries

## Installation

```bash
pnpm add @tinyrack/themes
```

Install the peer libraries needed by the surface you are using.

### Tailwind CSS / daisyUI

```bash
pnpm add tailwindcss daisyui
```

### Mantine

```bash
pnpm add @mantine/core @mantine/hooks react react-dom
```

### Astro Starlight

```bash
pnpm add astro @astrojs/starlight
```

## Quick Start

### Shared tokens

```ts
import { tinyrackTokens, tinyrackSemanticColors } from '@tinyrack/themes/tokens';
```

### Tailwind CSS and daisyUI

```css
@import "tailwindcss";
@import "@tinyrack/themes/tailwind/daisyui.css";
```

```html
<html data-theme="tinyrack-dark">
```

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

Use `TinyrackMantineProvider` when an embedded root needs scoped Mantine CSS variables.

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

## Documentation

For setup recipes, component parity notes, committed manual component pages, deployment notes, and publishing instructions, start with the **[Tinyrack Themes setup guide](docs/setup-guide.md)**.

The hosted Storybook is available at **[design.tinyrack.net](https://design.tinyrack.net)**.

## License

[MIT](LICENSE)
