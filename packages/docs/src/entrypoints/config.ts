export type {
  DocsBreadcrumb,
  DocsConfig,
  DocsFrontmatter,
  DocsHeading,
  DocsI18nConfig,
  DocsI18nLocaleConfig,
  DocsLocale,
  DocsLocalizedLabel,
  DocsLogo,
  DocsManifest,
  DocsPage,
  DocsPageLayout,
  DocsSection,
  DocsSectionConfig,
  DocsSectionGroupConfig,
  DocsSiteConfig,
  DocsTheme,
  DocsUiMessages,
  ResolvedDocsSiteConfig,
} from '../config/docs-config.ts';
export { defineDocsConfig } from '../config/docs-config.ts';
export type { LoadDocsManifestOptions } from '../config/docs-manifest.ts';
export { loadDocsManifest } from '../config/docs-manifest.ts';
export { canonicalDocumentPath } from '../config/document-path.ts';
// Syntax-highlighting catalog: the metadata describing what `highlight.languages`
// and `highlight.themes` accept, co-located with the config authoring surface.
export type {
  DocsHighlightLanguage,
  DocsHighlightTheme,
  DocsHighlightThemePair,
} from '../highlighting/docs-languages.ts';
export {
  docsHighlightDefaultThemes,
  docsHighlightLanguageGrammars,
  docsHighlightLanguages,
  docsHighlightThemes,
} from '../highlighting/docs-languages.ts';
