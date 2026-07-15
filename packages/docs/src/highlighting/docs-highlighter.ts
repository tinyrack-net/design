import { createBundledHighlighter, createSingletonShorthands } from 'shiki/core';
import { createJavaScriptRegexEngine } from 'shiki/engine/javascript';

const loadTypeScript = () => import('@shikijs/langs/typescript');
const loadTsx = () => import('@shikijs/langs/tsx');
const loadJavaScript = () => import('@shikijs/langs/javascript');
const loadJsx = () => import('@shikijs/langs/jsx');
const loadJson = () => import('@shikijs/langs/json');
const loadCss = () => import('@shikijs/langs/css');
const loadHtml = () => import('@shikijs/langs/html');
const loadShell = () => import('@shikijs/langs/shellscript');

export const docsHighlightLanguages = [
  'typescript',
  'ts',
  'tsx',
  'javascript',
  'js',
  'jsx',
  'json',
  'css',
  'html',
  'shellscript',
  'bash',
  'sh',
  'shell',
] as const;

export const docsHighlightThemes = [
  'github-dark-high-contrast',
  'github-light-high-contrast',
] as const;

const createDocsHighlighter = createBundledHighlighter({
  langs: {
    bash: loadShell,
    css: loadCss,
    html: loadHtml,
    javascript: loadJavaScript,
    js: loadJavaScript,
    jsx: loadJsx,
    json: loadJson,
    sh: loadShell,
    shell: loadShell,
    shellscript: loadShell,
    ts: loadTypeScript,
    tsx: loadTsx,
    typescript: loadTypeScript,
  },
  themes: {
    'github-dark-high-contrast': () =>
      import('@shikijs/themes/github-dark-high-contrast'),
    'github-light-high-contrast': () =>
      import('@shikijs/themes/github-light-high-contrast'),
  },
  engine: () => createJavaScriptRegexEngine(),
});

export const { codeToTokens } = createSingletonShorthands(createDocsHighlighter);
