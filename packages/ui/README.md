# @tinyrack/ui

React-only Tinyrack UI components and design tokens for compact operational
interfaces.

## Install

```bash
pnpm add @tinyrack/ui tailwindcss react react-dom
```

React 19 and Tailwind CSS 4.3 or newer are required. Register the Tailwind
integration for your build tool before importing Tinyrack styles. For Vite:

```bash
pnpm add -D @tailwindcss/vite
```

```ts
import tailwindcss from '@tailwindcss/vite';
import { defineConfig } from 'vite';

export default defineConfig({ plugins: [tailwindcss()] });
```

## Agent skill

The package includes a version-matched consumer skill. To install or update
skills from npm dependencies automatically, add the skills CLI to the consuming
project:

```bash
pnpm add -D skills@1.5.9
```

Then run the node_modules sync from the consuming project's install lifecycle:

```json
{
  "scripts": {
    "postinstall": "skills experimental_sync --agent codex --yes"
  }
}
```

The skill guides coding agents through Tinyrack component selection, public
imports, explicit CSS setup, composition, and consumer-side verification. The
sync command installs it at the Codex project path and updates it when the npm
package contents change. Keep the skills CLI pinned while this command remains
experimental. If the project already has a `postinstall` script, compose the
sync command with the existing work instead of replacing it.

Interactive components use Base UI internally for accessible focus, keyboard,
portal, positioning, and dismissal behavior.

## Use a component

Components are available only through suffix-free per-component subpaths. Import
the component CSS explicitly.

```tsx
import '@tinyrack/ui/core.css';
import '@tinyrack/ui/components/button.css';
import { TRButton } from '@tinyrack/ui/components/button';

export function DeployButton() {
  return <TRButton variant="primary">Deploy</TRButton>;
}
```

Compound components expose semantic parts from the same path.

```tsx
import '@tinyrack/ui/components/tabs.css';
import { TRTabs } from '@tinyrack/ui/components/tabs';

export function Settings() {
  return (
    <TRTabs.Root defaultValue="general">
      <TRTabs.List>
        <TRTabs.Tab value="general">General</TRTabs.Tab>
        <TRTabs.Tab value="network">Network</TRTabs.Tab>
      </TRTabs.List>
      <TRTabs.Panel value="general">General settings</TRTabs.Panel>
      <TRTabs.Panel value="network">Network settings</TRTabs.Panel>
    </TRTabs.Root>
  );
}
```

## Public paths

| Surface | Path |
| --- | --- |
| Component | `@tinyrack/ui/components/<component>` |
| Component CSS | `@tinyrack/ui/components/<component>.css` |
| Token metadata | `@tinyrack/ui/core` |
| Foundation CSS | `@tinyrack/ui/core.css` |
| React MDX map | `@tinyrack/ui/mdx` |
| React MDX CSS | `@tinyrack/ui/mdx.css` |
| Brand artwork | `@tinyrack/ui/brand/<asset>` |
| Product app icons | `@tinyrack/ui/brand/apps/<asset>` |
| CSP provider | `@tinyrack/ui/providers/csp` |
| Color scheme provider | `@tinyrack/ui/providers/color-scheme` |
| Direction provider | `@tinyrack/ui/providers/direction` |
| Highlighter provider | `@tinyrack/ui/providers/highlighter` |
| Shiki highlighter adapter | `@tinyrack/ui/highlighters/shiki` |
| Shiki web-bundle highlighter | `@tinyrack/ui/highlighters/shiki-web` |

## Brand assets

Tinyrack logo artwork and the Tinyrack, Dotweave, Proxer, and TinyAuth app icons
ship as static SVG and PNG files. Import them through the package so the build tool
copies and fingerprints the selected asset.

```tsx
import tinyrackLogoUrl from '@tinyrack/ui/brand/tinyrack-lockup.svg';
import proxerIconUrl from '@tinyrack/ui/brand/apps/proxer-app-icon-512.png';
```

The product icon SVG is canonical. PNG derivatives are available at 16, 32, 48,
128, and 512 pixels. The Tinyrack app icon includes 180 and 512 pixel PNGs.

## Color scheme

Use the provider when a site lets people choose automatic, light, or dark
appearance. Put the generated script in the document head before styles that
depend on `data-theme` so the stored preference is applied before first paint.

```tsx
import {
  createTinyrackColorSchemeScript,
  TRColorSchemeProvider,
  useTinyrackColorScheme,
} from '@tinyrack/ui/providers/color-scheme';
```

`useTinyrackColorScheme()` returns the current `preference`, the resolved
`applied` theme, and `setPreference`. The provider accepts a custom storage key
and default preference.

`createTinyrackFontPreloadLinks` from `@tinyrack/ui/core` turns consumer-owned
Latin, Korean, and Japanese font URLs into language-aware preload descriptors.

## Breakpoints

The public breakpoint scale is available as TypeScript metadata and as explicit
Tailwind v4 responsive thresholds.

```ts
import { tinyrackBreakpoints } from '@tinyrack/ui/core';

// { xs: '24rem', sm: '40rem', md: '48rem', lg: '64rem', xl: '80rem' }
```

Tinyrack styles use Tailwind's `@variant` directive for responsive rules. Import
`@tinyrack/ui/core.css` before component styles so Tailwind can resolve the
matching `xs` through `xl` and `max-*` variants. Published CSS is intentionally
authored Tailwind CSS and must pass through the consumer's Tailwind build.

Supported Base UI modules:

`accordion`, `alert-dialog`, `autocomplete`, `avatar`, `button`, `checkbox`,
`checkbox-group`, `collapsible`, `combobox`, `context-menu`, `dialog`, `drawer`,
`field`, `fieldset`, `form`, `input`, `menu`, `menubar`, `meter`,
`navigation-menu`, `number-field`, `otp-field`, `popover`, `preview-card`,
`progress`, `radio`, `radio-group`, `scroll-area`, `select`, `separator`,
`slider`, `switch`, `tabs`, `toast`, `toggle`, `toggle-group`, `toolbar`, and
`tooltip`.

Tinyrack-native modules are `alert`, `animated-number`, `app-shell`, `badge`,
`card`, `code`, `code-block`, `copy-button`, `icon-button`, `link`,
`link-button`, `skeleton`, `spinner`, `table`, and `textarea`.

There is no component root barrel, `/react` or `/dom` compatibility suffix,
public overlay manager, or Astro renderer.

`TRCodeBlock` ships no syntax grammars. Pass a `TRCodeHighlighter` through its
`highlighter` prop or `TRCodeHighlighterProvider`; `shiki` is an optional peer
dependency required only by the `highlighters/*` adapters.

## React MDX

```tsx
import { MDXProvider } from '@mdx-js/react';
import '@tinyrack/ui/mdx.css';
import { tinyrackMdxComponents } from '@tinyrack/ui/mdx';

<MDXProvider components={tinyrackMdxComponents}>
  <Content />
</MDXProvider>;
```

## Development

```bash
pnpm --filter @tinyrack/ui test:unit
pnpm --filter @tinyrack/ui test:e2e
pnpm --config.ignore-scripts=true --dir packages/ui pack --dry-run
```

`test:e2e` runs Chromium with coverage, Firefox, and the packed consumer smoke.

Every component directory owns semantic implementation files, a composition-only
`index.tsx`, colocated CSS, and one React browser suite. Interactive documentation
and Playgrounds live in the homepage workspace. See
`.agents/skills/tinyrack-component-development/SKILL.md` for the complete
contract.

Releases use package-specific `ui-vX.Y.Z` Git tags so they remain independent
from the repository's legacy `@tinyrack/themes` tags and `@tinyrack/docs`
releases.
