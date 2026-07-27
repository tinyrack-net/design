declare module 'virtual:tinyrack-docs/manifest' {
  export const docsManifest: import('../config/docs-config.ts').DocsManifest;
}

declare module 'virtual:tinyrack-docs/highlighter' {
  export const docsHighlightLanguages: readonly import('../highlighting/docs-languages.ts').DocsHighlightLanguage[];
  export const docsHighlighter: import('@tinyrack/ui/components/code-block').TRCodeHighlighter;
}
