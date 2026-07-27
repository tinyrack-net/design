import { themeNames } from '@shikijs/themes';
import type { BundledTheme } from 'shiki/themes';

/**
 * Catalog of grammars a Tinyrack docs site can enable, as plain data.
 *
 * This module deliberately contains no `import()` calls. The Vite plugin reads
 * it to *generate* loaders for the languages a site declares in
 * `docs.config.ts`, so an undeclared grammar has no static import anywhere and
 * therefore never becomes a build chunk. A filtered record of literal loaders
 * would not achieve that — Rollup cannot drop a dynamic import that is reachable
 * through an object it cannot analyse.
 *
 * To offer a new language, add its alias here. Everything else is derived.
 */
export const docsHighlightLanguageGrammars = {
  bash: 'shellscript',
  css: 'css',
  diff: 'diff',
  go: 'go',
  html: 'html',
  java: 'java',
  javascript: 'javascript',
  js: 'javascript',
  json: 'json',
  jsx: 'jsx',
  markdown: 'markdown',
  md: 'markdown',
  mdx: 'mdx',
  py: 'python',
  python: 'python',
  rs: 'rust',
  rust: 'rust',
  sh: 'shellscript',
  shell: 'shellscript',
  shellscript: 'shellscript',
  sql: 'sql',
  toml: 'toml',
  ts: 'typescript',
  tsx: 'tsx',
  typescript: 'typescript',
  yaml: 'yaml',
  yml: 'yaml',
} as const satisfies Record<string, string>;

export type DocsHighlightLanguage = keyof typeof docsHighlightLanguageGrammars;

export const docsHighlightLanguages = Object.keys(
  docsHighlightLanguageGrammars,
) as readonly DocsHighlightLanguage[];

export type DocsHighlightTheme = BundledTheme;

export const docsHighlightThemes = themeNames as readonly DocsHighlightTheme[];

export type DocsHighlightThemePair = {
  dark: DocsHighlightTheme;
  light: DocsHighlightTheme;
};

export const docsHighlightDefaultThemes: DocsHighlightThemePair = {
  dark: 'github-dark-high-contrast',
  light: 'github-light-high-contrast',
};

export function isDocsHighlightLanguage(value: string): value is DocsHighlightLanguage {
  return Object.hasOwn(docsHighlightLanguageGrammars, value);
}

export function isDocsHighlightTheme(value: string): value is DocsHighlightTheme {
  return (docsHighlightThemes as readonly string[]).includes(value);
}
