# @tinyrack/ui

React-only Tinyrack UI components and design tokens for compact operational
interfaces.

## Install

```bash
pnpm add @tinyrack/ui react react-dom
```

React 19 or newer is required. Interactive components use Base UI internally for
accessible focus, keyboard, portal, positioning, and dismissal behavior.

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
| CSP provider | `@tinyrack/ui/providers/csp` |
| Direction provider | `@tinyrack/ui/providers/direction` |

Supported Base UI modules:

`accordion`, `alert-dialog`, `autocomplete`, `avatar`, `button`, `checkbox`,
`checkbox-group`, `collapsible`, `combobox`, `context-menu`, `dialog`, `drawer`,
`field`, `fieldset`, `form`, `input`, `menu`, `menubar`, `meter`,
`navigation-menu`, `number-field`, `otp-field`, `popover`, `preview-card`,
`progress`, `radio`, `radio-group`, `scroll-area`, `select`, `separator`,
`slider`, `switch`, `tabs`, `toast`, `toggle`, `toggle-group`, `toolbar`, and
`tooltip`.

Tinyrack-native modules are `alert`, `app-shell`, `badge`, `card`, `code`,
`code-block`, `copy-button`, `icon-button`, `link`, `skeleton`, `spinner`,
`table`, and `textarea`.

There is no component root barrel, `/react` or `/dom` compatibility suffix,
public overlay manager, or Astro renderer.

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
pnpm test:component
pnpm test:coverage
pnpm verify
pnpm --filter @tinyrack/homepage build
pnpm docs:audit
pnpm verify:release
pnpm --dir packages/ui pack --dry-run
```

Every component directory owns semantic implementation files, a composition-only
`index.tsx`, colocated CSS, and one React browser suite. Interactive documentation
and Playgrounds live in the homepage workspace. See
`.agents/skills/tinyrack-component-development/SKILL.md` for the complete
contract.

Releases use package-specific `ui-vX.Y.Z` Git tags so they remain independent
from the repository's legacy `@tinyrack/themes` tags and `@tinyrack/docs`
releases.
