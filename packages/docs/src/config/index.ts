export type {
  DocsBreadcrumb,
  DocsConfig,
  DocsFrontmatter,
  DocsI18nConfig,
  DocsI18nLocaleConfig,
  DocsLocale,
  DocsLocalizedLabel,
  DocsLogo,
  DocsManifest,
  DocsPage,
  DocsSection,
  DocsSectionConfig,
  DocsSiteConfig,
  DocsTheme,
  DocsUiMessages,
  ResolvedDocsSiteConfig,
} from './docs-config.ts';
export {
  canonicalDocumentPath,
  defineDocsConfig,
  normalizeBasePath,
  normalizeDocumentPathname,
} from './docs-config.ts';
export type { LoadDocsManifestOptions } from './docs-manifest.ts';
export { loadDocsManifest } from './docs-manifest.ts';
