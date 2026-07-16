# @tinyrack/docs

Tinyrack's React 19 and React Router 8 adapter for static MDX documentation
sites. It turns config and MDX into routes, manifests, locale-filtered Pagefind
data, redirects, SEO assets, OG images, sitemap, robots, GFM, and highlighted
code. The visual shell, navigation, search, pagination, and MDX components live
in `@tinyrack/ui`; a consuming project owns its config, content, product-specific
landing visuals, brand assets, and deployment.

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
  header: {
    links: [
      { label: 'Guides', path: '/guides/' },
      { label: 'GitHub', path: 'https://github.com/example/project' },
    ],
    version: '1.0',
  },
  i18n: {
    defaultLocale: 'en',
    locales: {
      en: { label: 'English', language: 'en', openGraph: 'en_US' },
      ko: { label: '한국어', language: 'ko', openGraph: 'ko_KR' },
    },
  },
  redirects: { '/': '/en/' },
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

`slug`, `sidebarLabel`, `contentKey`, `layout: docs | splash | standalone`, and
`navigation: false` are optional. By default, `index.mdx` maps to its directory
root and a `.docs.mdx` suffix is removed from the URL. Multi-locale sites put
content below locale directories; pages with the same `contentKey` become
language alternates. A recursive `navigation` tree can replace section-derived
navigation and accepts locale-specific labels.

Container directives map to the UI Callout component:

```mdx
:::caution
Back up the configuration before replacing it.
:::
```

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

The default navbar renders the site brand, optional `header.version` and
`header.links`, search, theme, and language controls. Internal paths use React
Router navigation; absolute URLs render as normal links. The navbar is shown on
`docs` and `splash` layouts and omitted from `standalone` pages.

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
