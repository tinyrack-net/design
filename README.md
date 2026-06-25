# @tinyrack/themes

Tinyrack design-system themes for Mantine, daisyUI, and Astro Starlight.

This package is intentionally theme-first. It exports shared design tokens and thin adapters for UI libraries used across Tinyrack products. It is not a general component library.

## Install

```bash
pnpm add @tinyrack/themes
```

Install the peer libraries needed by the surface you are using.

## Shared tokens

```ts
import { tinyrackTokens, tinyrackSemanticColors } from '@tinyrack/themes/tokens';
```

Shared tokens are library-agnostic. Mantine, daisyUI, and Starlight adapters map these tokens into each library's native theme shape.

## Mantine

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

## daisyUI / Tailwind CSS 4

```css
@import "tailwindcss";
@plugin "daisyui" {
  themes: tinyrack-light --default, tinyrack-dark --prefersdark;
}
@import "@tinyrack/themes/daisyui.css";
```

The package also exports JS metadata for tests and tooling:

```ts
import { tinyrackDaisyUiThemes } from '@tinyrack/themes/daisyui';
```

## Astro Starlight

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

## Development

```bash
pnpm install
pnpm test
pnpm build
pnpm storybook
pnpm storybook:build
pnpm biome
```

On this Windows workstation, if mise shims are present but `mise` itself is not on `PATH`, run pnpm through Corepack with the mise shim path removed:

```bash
PATH_CLEAN=$(printf '%s' "$PATH" | tr ':' '\n' | grep -v '/mise/shims' | paste -sd: -)
PATH="$PATH_CLEAN" '/c/Program Files/nodejs/corepack.cmd' pnpm test
```

## Compatibility target

| Adapter | Target |
| --- | --- |
| Mantine | 9.x |
| daisyUI | 5.x |
| Tailwind CSS | 4.x |
| Astro | 6.x |
| Starlight | 0.40.x |
| Vitest | 4.x browser mode with Playwright |

## Export map

- `@tinyrack/themes`
- `@tinyrack/themes/tokens`
- `@tinyrack/themes/mantine`
- `@tinyrack/themes/mantine.css`
- `@tinyrack/themes/daisyui`
- `@tinyrack/themes/daisyui.css`
- `@tinyrack/themes/astro/starlight`
- `@tinyrack/themes/astro/starlight.css`
