<div align="center">

# Tinyrack UI

**CSS-first UI tokens and components for Tinyrack interfaces.**

[![CI](https://github.com/tinyrack-net/themes/actions/workflows/ci.yml/badge.svg)](https://github.com/tinyrack-net/themes/actions/workflows/ci.yml)
[![npm](https://img.shields.io/npm/v/@tinyrack/ui)](https://www.npmjs.com/package/@tinyrack/ui)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node.js](https://img.shields.io/badge/node-%3E%3D24-brightgreen)](https://nodejs.org/)

[Storybook](https://design.tinyrack.net)

</div>

---

Tinyrack UI packages organization-wide design tokens, Tailwind CSS 4 token
utilities, framework-neutral component CSS, and isolated React component exports.

The package is intentionally small. Owned component primitives are exposed as
framework-neutral CSS classes and isolated React wrappers through component
subpaths.

## Features

- **Shared design tokens** for colors, typography, spacing, radii, and semantic surfaces
- **Core token metadata** through `@tinyrack/ui/core`
- **Tailwind CSS 4 token base** with `text-tinyrack-*`, `leading-tinyrack-*`, `tracking-tinyrack-*`, and `bg-tinyrack-*` utilities
- **Framework-neutral Button CSS** through `@tinyrack/ui/components/button/button.css`
- **Independent React Button and IconButton export** through `@tinyrack/ui/components/button/react`
- **Framework-neutral Link CSS** through `@tinyrack/ui/components/link/link.css`
- **Independent React Link export** through `@tinyrack/ui/components/link/react`
- **Framework-neutral Form CSS** through `@tinyrack/ui/components/form/form.css`
- **Independent React Form primitives** through `@tinyrack/ui/components/form/react`
- **Framework-neutral Table CSS** through `@tinyrack/ui/components/table/table.css`
- **Independent React Table export** through `@tinyrack/ui/components/table/react`
- **Framework-neutral Tabs CSS** through `@tinyrack/ui/components/tabs/tabs.css`
- **Independent React Tabs export** through `@tinyrack/ui/components/tabs/react`
- **Storybook review surface** with foundations and owned component contracts

## Installation

```bash
pnpm add @tinyrack/ui
```

Install the peer libraries needed by the surface you use.

```bash
pnpm add tailwindcss
pnpm add react react-dom
```

## Icons

Tinyrack UI recommends Lucide for product icons, but does not bundle,
re-export, or declare an icon package as a peer. Install the Lucide package
that matches the renderer in each app.

| Surface | Install | Use |
| --- | --- | --- |
| React, CRA, SSR React | `pnpm add lucide-react` | Named imports render inline SVGs inside Tinyrack components. |
| Astro pages | `pnpm add @lucide/astro` | Use in `.astro` files; use `lucide-react` inside React islands. |
| HTML and non-React | `pnpm add lucide-static` | Inline or copy the SVG when no component runtime is available. |

Use `IconButton label="..."` for icon-only actions and mark the decorative
icon child with `aria-hidden="true"`. Match the icon to the button size:
`16` for `sm`, `18` for `md`, and `20` for `lg`.

## Quick Start

### Core metadata

```ts
import { tinyrackSemanticColors } from '@tinyrack/ui/core';
```

### CSS tokens only

```css
@import "tailwindcss";
@import "@tinyrack/ui/core/core.css";
```

```html
<section data-theme="tinyrack-dark" class="bg-tinyrack-surface text-tinyrack-text">
  <h1 class="font-tinyrack-heading text-tinyrack-primary">Tinyrack</h1>
</section>
```

### CSS Button

```css
@import "@tinyrack/ui/core/core.css";
@import "@tinyrack/ui/components/button/button.css";
```

```html
<button class="tr-btn" data-size="md" data-variant="primary" data-appearance="solid">
  Deploy
</button>
```

### React Button

```tsx
import '@tinyrack/ui/core/core.css';
import '@tinyrack/ui/components/button/button.css';
import { RefreshCw } from 'lucide-react';
import { Button, IconButton } from '@tinyrack/ui/components/button/react';

export function DeployButton() {
  return (
    <div>
      <Button size="md" variant="primary" appearance="solid">
        Deploy
      </Button>
      <IconButton label="Refresh rack">
        <RefreshCw aria-hidden="true" size={18} />
      </IconButton>
    </div>
  );
}
```

### React Form

```tsx
import '@tinyrack/ui/core/core.css';
import '@tinyrack/ui/components/form/form.css';
import { Field, FormMessage, Input, Label } from '@tinyrack/ui/components/form/react';

export function RackField() {
  return (
    <Field>
      <Label htmlFor="rack-name">Rack name</Label>
      <Input id="rack-name" placeholder="rack-a-01" />
      <FormMessage>Use a stable rack identifier.</FormMessage>
    </Field>
  );
}
```

### CSS Table

```css
@import "@tinyrack/ui/core/core.css";
@import "@tinyrack/ui/components/table/table.css";
```

```html
<div class="tr-table-container">
  <table class="tr-table" data-density="normal">
    <thead>
      <tr>
        <th scope="col">Node</th>
        <th scope="col">Load</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>rack-a-01</td>
        <td>41%</td>
      </tr>
    </tbody>
  </table>
</div>
```

### React Table

```tsx
import '@tinyrack/ui/core/core.css';
import '@tinyrack/ui/components/table/table.css';
import { Table, TableContainer } from '@tinyrack/ui/components/table/react';

export function RackTable() {
  return (
    <TableContainer>
      <Table density="normal">
        <thead>
          <tr>
            <th scope="col">Node</th>
            <th scope="col">Load</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>rack-a-01</td>
            <td>41%</td>
          </tr>
        </tbody>
      </Table>
    </TableContainer>
  );
}
```

### React Tabs

```tsx
import '@tinyrack/ui/core/core.css';
import '@tinyrack/ui/components/tabs/tabs.css';
import { Tabs, TabsList, TabsPanel, TabsTrigger } from '@tinyrack/ui/components/tabs/react';

export function RackSections() {
  return (
    <Tabs defaultValue="overview">
      <TabsList aria-label="Rack sections">
        <TabsTrigger value="overview">Overview</TabsTrigger>
        <TabsTrigger value="logs">Logs</TabsTrigger>
      </TabsList>
      <TabsPanel value="overview">Rack A is healthy.</TabsPanel>
      <TabsPanel value="logs">03:18 backup completed.</TabsPanel>
    </Tabs>
  );
}
```

## Storybook

The hosted Storybook is available at [design.tinyrack.net](https://design.tinyrack.net).

## License

[MIT](LICENSE)
