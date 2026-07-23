---
name: tinyrack-docs
description: Build and maintain static React Router documentation sites that consume the published @tinyrack/docs package. Use when configuring a Tinyrack docs site, authoring MDX or TSX routes, wiring React Router and Vite entrypoints, adding locales or navigation, or diagnosing consumer-side docs builds.
---

# Tinyrack Docs

Build the documentation site from config and route content. Let the package own
the reusable shell, navigation, search, pagination, SEO assets, and static build
pipeline; keep product-specific content, branding, landing visuals, and
deployment in the consuming project.

## Set up the site

1. Inspect the installed package's README, `package.json` exports, and relevant
   type declarations before changing code. Treat that installed version as the
   source of truth; do not infer APIs from memory or another Tinyrack version.
2. Use Node.js 24 or newer, React 19, React Router 8, Vite 8, Tailwind CSS 4,
   and `@tailwindcss/vite`.
3. Create `docs.config.ts` with `defineDocsConfig` from
   `@tinyrack/docs/config`. Define `contentDir`, sections or navigation, site
   metadata, redirects, locale configuration, header links, and theme settings
   required by the project.
4. Connect the public entrypoints:
   - `createDocsRoutes` and `createDocsRouterConfig` from
     `@tinyrack/docs/react-router`
   - `tinyrackDocs` from `@tinyrack/docs/vite`, before the Tailwind Vite plugin
   - `@tinyrack/docs/styles.css` and the runtime root exports from
     `@tinyrack/docs/runtime`
5. Use the standard `react-router dev`, `react-router build`, and `vite preview`
   commands. Do not look for a Tinyrack CLI or scaffold generator.

## Author routes

- Put only route-producing `.mdx` and `.tsx` files under `contentDir`. Keep
  imported components, helpers, and demos outside it.
- Start every MDX file with YAML frontmatter containing at least `title`,
  `description`, `section`, and a non-negative `order`. Begin authored content
  at `##`; the framework renders the page title and description.
- Render custom TSX routes with `DocsPage` from `@tinyrack/docs/runtime`. Pass
  `frontmatter` as an inline static object literal. When supplied, `headings`
  must also be an inline static array and its IDs must match rendered headings.
- Use `index.mdx` or `index.tsx` for a directory root. Use `layout` values
  `docs`, `splash`, or `standalone`, and use `navigation: false` only when the
  route should be omitted from navigation.
- For localized sites, keep locale content under locale directories and use a
  shared `contentKey` for language alternates. Override built-in UI messages
  only when the site needs product-specific wording.

## Verify changes

- Run the consumer project's typecheck and focused content or configuration
  tests.
- Run the full static `react-router build`; treat manifest, frontmatter,
  redirect, Pagefind, or asset errors as build failures.
- Preview the generated site at its configured base path and verify navigation,
  search, locale alternates, metadata, and static assets relevant to the change.
- Fix consumer configuration and content in the consumer project. Do not patch
  installed package files under `node_modules`.
