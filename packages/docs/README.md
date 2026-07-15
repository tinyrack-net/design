# @tinyrack/docs

Tinyrack's React 19 and React Router 8 framework for static MDX documentation
sites. It owns the responsive shell, navigation, theme persistence, Pagefind
search, pagination, SEO assets, OG images, sitemap, robots, GFM, and code
highlighting. A consuming project owns only its config, content, demos, brand
assets, and deployment.

## Install

```bash
pnpm add @tinyrack/docs @tinyrack/ui react react-dom react-router vite
```

Node.js 24 or newer is required.

## Configure

Create `docs.config.ts`:

```ts
import { defineDocsConfig } from '@tinyrack/docs/config';

export default defineDocsConfig({
  contentDir: 'app/content',
  sections: [
    { id: 'start', label: 'Start', order: 0 },
    { id: 'guides', label: 'Guides', order: 1 },
  ],
  site: {
    basePath: '/',
    description: 'Documentation for this project.',
    favicon: '/favicon.svg',
    locale: { language: 'en', openGraph: 'en_US' },
    logo: { dark: '/logo-inverse.svg', light: '/logo.svg' },
    title: 'Project Docs',
    url: 'https://example.com',
  },
  theme: { default: 'dark' },
});
```

Every `.mdx` file must start with frontmatter. The framework renders the page
heading and description, so authored content begins at `##`:

```mdx
---
title: Install
description: Install and configure the project.
section: start
order: 0
---

## Package

Install the package with your package manager.
```

`slug` and `sidebarLabel` are optional. By default, `index.mdx` maps to its
directory root and a `.docs.mdx` suffix is removed from the URL.

## React Router entrypoints

```ts
// app/routes.ts
import { createDocsRoutes } from '@tinyrack/docs/react-router';
import config from '../docs.config.js';

export default createDocsRoutes(config);
```

```ts
// react-router.config.ts
import { createDocsRouterConfig } from '@tinyrack/docs/react-router';
import config from './docs.config.js';

export default createDocsRouterConfig(config);
```

```ts
// vite.config.ts
import { tinyrackDocs } from '@tinyrack/docs/vite';
import { defineConfig } from 'vite';
import config from './docs.config.js';

export default defineConfig({ plugins: tinyrackDocs(config) });
```

```tsx
// app/root.tsx
import '@tinyrack/docs/styles.css';

export { default, Layout, links, meta } from '@tinyrack/docs/runtime';
```

The CSS is explicit and prebuilt; consumers do not scan package source with
Tailwind. Place logo and favicon files under `public/`.

## Commands

```json
{
  "scripts": {
    "dev": "tinyrack-docs dev",
    "build": "tinyrack-docs build",
    "preview": "tinyrack-docs preview"
  }
}
```

`build` runs React Router SSG and then creates the Pagefind index. Both `/` and
a configured subpath such as `/docs` are supported. The package intentionally
does not include a project generator, scaffold command, or Playground API.

Releases use package-specific `docs-vX.Y.Z` Git tags so they remain independent
from `@tinyrack/ui` releases.
