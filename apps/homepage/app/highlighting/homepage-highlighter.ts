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

export const homepageHighlightLanguages = [
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

export const homepageHighlightThemes = [
  'github-dark',
  'github-light',
  'dark-plus',
  'light-plus',
] as const;

const createHomepageHighlighter = createBundledHighlighter({
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
    'dark-plus': () => import('@shikijs/themes/dark-plus'),
    'github-dark': () => import('@shikijs/themes/github-dark'),
    'github-light': () => import('@shikijs/themes/github-light'),
    'light-plus': () => import('@shikijs/themes/light-plus'),
  },
  engine: () => createJavaScriptRegexEngine(),
});

export const { codeToTokens } = createSingletonShorthands(createHomepageHighlighter);
