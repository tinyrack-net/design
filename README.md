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

## Tailwind CSS 4

For shared Tinyrack Tailwind tokens without a component library:

```css
@import "tailwindcss";
@import "@tinyrack/themes/tailwind.css";
```

This exposes utilities such as `bg-tinyrack-surface`, `text-tinyrack-text`, `text-tinyrack-primary`, `font-tinyrack-body`, and `rounded-tinyrack-box`.

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
  themes: tinyrack-light --default, tinyrack-dark --prefersdark;
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


## Storybook component galleries

Storybook includes full-theme review galleries for both UI systems:

- `Mantine/Components/*`: one Storybook story per Mantine Core component selected for Tinyrack theme review.
- `daisyUI/Components/*`: one Storybook story per component directory shipped by daisyUI 5.5.

The same registries are covered by browser-mode Vitest so missing/broken previews and missing per-component story files fail CI:

```bash
pnpm test:showcase
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
- `@tinyrack/themes/tailwind.css`
- `@tinyrack/themes/tailwind/daisyui.css`
- `@tinyrack/themes/tailwind/mantine.css`
- `@tinyrack/themes/mantine`
- `@tinyrack/themes/mantine.css`
- `@tinyrack/themes/daisyui`
- `@tinyrack/themes/daisyui.css`
- `@tinyrack/themes/astro/starlight`
- `@tinyrack/themes/astro/starlight.css`
