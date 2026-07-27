import { createTRShikiHighlighter } from '@tinyrack/ui/highlighters/shiki';
import { createBundledHighlighter, createSingletonShorthands } from 'shiki/core';
import { createJavaScriptRegexEngine } from 'shiki/engine/javascript';
import { describe, expect, it } from 'vitest';
import type { DocsConfig } from '../src/config/docs-config.js';
import { createDocsHighlighter } from '../src/highlighting/docs-highlighter.js';
import {
  docsHighlighterModuleId,
  docsHighlighterPlugin,
  resolveDocsHighlightLanguages,
} from '../src/vite/docs-highlighter-plugin.js';
import { createTestProject } from './test-project.js';

function generatedHighlighterSource(config: DocsConfig) {
  const plugin = docsHighlighterPlugin(config);
  expect(typeof plugin.resolveId).toBe('function');
  expect(typeof plugin.load).toBe('function');

  const resolveId = plugin.resolveId as (id: string) => string | undefined;
  const load = plugin.load as (id: string) => string | undefined;
  const resolvedId = resolveId(docsHighlighterModuleId);
  expect(resolvedId).toBeTypeOf('string');

  const source = load(resolvedId as string);
  expect(source).toBeTypeOf('string');
  return source as string;
}

describe('docs highlighter Vite plugin', () => {
  it('preserves every shell alias in the default language set', () => {
    const project = createTestProject();
    try {
      expect(resolveDocsHighlightLanguages(project.config)).toEqual(
        expect.arrayContaining(['bash', 'sh', 'shell', 'shellscript']),
      );
    } finally {
      project.dispose();
    }
  });

  it('generates lazy loaders for the configured dark and light themes', () => {
    const project = createTestProject();
    try {
      const source = generatedHighlighterSource({
        ...project.config,
        highlight: {
          languages: ['ts'],
          themes: { dark: 'nord', light: 'min-light' },
        },
      });

      expect(source).toContain(`"nord": () => import('@shikijs/themes/nord')`);
      expect(source).toContain(
        `"min-light": () => import('@shikijs/themes/min-light')`,
      );
    } finally {
      project.dispose();
    }
  });

  it('highlights with only the selected custom theme loaders', async () => {
    const highlighter = createDocsHighlighter({
      langs: {
        ts: () => import('@shikijs/langs/typescript'),
      },
      themeLoaders: {
        'min-light': () => import('@shikijs/themes/min-light'),
        nord: () => import('@shikijs/themes/nord'),
      },
      themes: { dark: 'nord', light: 'min-light' },
    });

    const result = await highlighter({
      code: 'const status = true;',
      language: 'ts',
    });

    expect(
      result?.lines
        .flat()
        .map((token) => token.content)
        .join(''),
    ).toBe('const status = true;');
  });

  it('accepts the documented narrowed Shiki bundle through the public adapter', async () => {
    const { codeToTokens } = createSingletonShorthands<string, string>(
      createBundledHighlighter<string, string>({
        engine: () => createJavaScriptRegexEngine(),
        langs: {
          ts: () => import('@shikijs/langs/typescript'),
          tsx: () => import('@shikijs/langs/tsx'),
        },
        themes: {
          'github-dark-high-contrast': () =>
            import('@shikijs/themes/github-dark-high-contrast'),
          'github-light-high-contrast': () =>
            import('@shikijs/themes/github-light-high-contrast'),
        },
      }),
    );
    const highlighter = createTRShikiHighlighter({
      codeToTokens,
      languages: ['ts', 'tsx'],
    });

    const result = await highlighter({
      code: 'const status = true;',
      language: 'ts',
    });

    expect(
      result?.lines
        .flat()
        .map((token) => token.content)
        .join(''),
    ).toBe('const status = true;');
  });

  it('rejects an unknown configured theme while generating the virtual module', () => {
    const project = createTestProject();
    try {
      const config: DocsConfig = {
        ...project.config,
        highlight: {
          languages: ['ts'],
          themes: {
            dark: 'definitely-not-a-theme',
            light: 'github-light-high-contrast',
          },
        } as unknown as NonNullable<DocsConfig['highlight']>,
      };

      expect(() => generatedHighlighterSource(config)).toThrow(
        /Unknown highlight\.themes entries: definitely-not-a-theme/,
      );
    } finally {
      project.dispose();
    }
  });
});
