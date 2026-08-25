# @tinyrack/docs

Tinyrack's React 19 and React Router 8 framework for static MDX and TSX
documentation sites. It turns config and content into routes, manifests, locale-filtered Pagefind
data, redirects, SEO assets, OG images, sitemap, robots, GFM, and highlighted
code. The visual shell, navigation, search, pagination, and MDX components live
in `@tinyrack/ui`; a consuming project owns its config, content, product-specific
landing visuals, brand assets, and deployment.

## Install

```bash
pnpm add @tinyrack/docs @tinyrack/ui react react-dom react-router
pnpm add --save-dev @react-router/dev @tailwindcss/vite tailwindcss vite
```

Node.js 24 or newer is required.

## Static-site primitives

Sites that provide their own React Router shell can use the package's reusable
SEO and static-build primitives without adopting the documentation shell:

```ts
import { finalizeStaticSiteBuild } from '@tinyrack/docs/react-router';
import { createRss, createSiteMeta, createSitemap } from '@tinyrack/docs/site';
import { tinyrackSiteAssets } from '@tinyrack/docs/vite';
```

`tinyrackSiteAssets` emits sitemap, robots, and configured feed assets during
the Vite client build. `finalizeStaticSiteBuild` turns React Router's SPA
fallback into `404.html`; the `site` entrypoint provides the corresponding SEO,
RSS, sitemap, robots, and asset URL helpers.

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

The skill guides coding agents through site configuration, route authoring,
React Router and Vite integration, and static-build verification. The sync
command installs it at the Codex project path and updates it when the npm
package contents change. Keep the skills CLI pinned while this command remains
experimental. If the project already has a `postinstall` script, compose the
sync command with the existing work instead of replacing it.

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
  theme: { default: 'auto' },
});
```

`theme.default` accepts `auto`, `light`, or `dark`. Automatic mode follows the
operating system color scheme. A visitor's saved header selection overrides the
configured default on later visits.

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

## Syntax highlighting

Code fences and `TRCodeBlock` blocks highlight only the grammars declared in `highlight.languages`. Each distinct grammar becomes a lazily loaded chunk, so aliases such as `bash`, `sh`, `shell`, and `shellscript` share one grammar payload:

```ts
export default defineDocsConfig({
  contentDir: 'app/content',
  highlight: {
    languages: ['ts', 'tsx', 'json', 'css', 'html', 'shellscript', 'mdx'],
    themes: { dark: 'github-dark-high-contrast', light: 'github-light-high-contrast' },
  },
});
```

Omitting `highlight.languages` enables a web-oriented default set: `css`, `html`, `javascript`, `js`, `json`, `jsx`, `bash`, `sh`, `shell`, `shellscript`, `ts`, `tsx`, and `typescript`.

The bundle uses Shiki's JavaScript regex engine, so no Oniguruma WebAssembly payload ships. An identifier that is not in the catalog fails the build with the list of supported ids. A fence whose language is valid but not declared renders as readable plain text and logs a warning naming the missing grammar.

`highlight.themes` accepts any dark and light pair from Shiki's bundled theme catalog. Only the selected theme chunks are built. Import `docsHighlightLanguages` and `docsHighlightThemes` from `@tinyrack/docs/config` for the supported catalogs.

Custom React pages use a plain `.tsx` filename and the `DocsPage` component:

```tsx
import { DocsPage } from '@tinyrack/docs/runtime';

export default function InstallPage() {
  return (
    <DocsPage
      frontmatter={{
        title: 'Install',
        description: 'Install and configure the project.',
        section: 'start',
        order: 0,
      }}
      headings={[{ depth: 2, id: 'package', label: 'Package' }]}
    >
      <h2 id="package">Package</h2>
      <p>Install the package with your package manager.</p>
    </DocsPage>
  );
}
```

`frontmatter` must be an inline static object literal because Tinyrack reads it
before route modules are compiled. Variables, object or JSX prop spreads,
computed values, function calls, and template expressions are rejected with a
build error. `headings` is
optional and follows the same inline-literal rule; when provided, each `id` must
match the rendered heading. Omitted headings produce no table of contents.

Every `*.mdx` and `*.tsx` file below `contentDir` becomes a route recursively.
Keep imported components, helpers, and demos outside `contentDir`; there is no
filename marker or compatibility exception for support files. `index.tsx` maps
to its directory root. TSX pages support the same `docs`, `splash`, and
`standalone` layouts and receive the same shell, SEO, navigation, pagination,
Pagefind, and locale behavior as MDX pages.

`slug`, `sidebarLabel`, `contentKey`, `layout: docs | splash | standalone`, and
`navigation: false` are optional. By default, `index.mdx` and `index.tsx` map to
their directory root, and only the final `.mdx` or `.tsx` extension is removed
from the URL. A literal `.docs` basename segment is retained. Multi-locale sites put
content below locale directories; pages with the same `contentKey` become
language alternates. A recursive `navigation` tree can replace section-derived
navigation and accepts locale-specific labels. Section labels may also be
locale maps. Header link paths can use `/{locale}` to target the current
language.

The docs runtime provides built-in UI messages for English (`en`), Korean
(`ko`), and Japanese (`ja`). Other locales fall back to English. A consuming
site does not need to declare UI text; use `messages` on a locale only when a
site needs to override one or more defaults:

```ts
ko: {
  label: '한국어',
  language: 'ko',
  openGraph: 'ko_KR',
  messages: { search: '문서 찾기' },
},
```

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
import tailwindcss from '@tailwindcss/vite';
import { tinyrackDocs } from '@tinyrack/docs/vite';
import { defineConfig } from 'vite';
import config from './docs.config.js';

export default defineConfig({
  plugins: [...tinyrackDocs(config), tailwindcss()],
});
```

```tsx
// app/root.tsx
import '@tinyrack/docs/styles.css';

export { default, Layout, links, meta } from '@tinyrack/docs/runtime';
```

Tailwind CSS 4 and `@tailwindcss/vite` are required. The published stylesheet
registers Tinyrack's Tailwind theme and imports prebuilt component CSS; consumers
do not scan package source. Place logo and favicon files under `public/`.

The default navbar renders the site brand, optional `header.version` and
`header.links`, search, theme, and language controls. Internal paths use React
Router navigation; absolute URLs render as normal links. The navbar is shown on
`docs` and `splash` layouts and omitted from `standalone` pages.

## Commands

```json
{
  "scripts": {
    "dev": "react-router dev",
    "build": "react-router build",
    "preview": "vite preview"
  }
}
```

`createDocsRouterConfig` finalizes the static output through React Router's
`buildEnd` hook: it restores redirects, removes the SPA fallback, creates the
Pagefind index, and colocates output under a configured base path. The
`tinyrackDocs` Vite plugins configure standard preview behavior for both `/` and
a subpath such as `/docs`. The package intentionally does not include a custom
CLI, project generator, scaffold command, or Playground API.

Releases use package-specific `docs-vX.Y.Z` Git tags so they remain independent
from `@tinyrack/ui` releases.
