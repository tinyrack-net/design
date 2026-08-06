import { expect, test, vi } from 'vitest';
import {
  createTRShikiHighlighter,
  type TRShikiCodeToTokens,
  trShikiDefaultThemes,
} from './shiki/index.js';
import {
  createTRShikiWebHighlighter,
  trShikiWebHighlighter,
} from './shiki-web/index.js';

const tokensResult = {
  bg: '#ffffff;#0a0c10',
  fg: '#1f2328;#f0f6fc',
  tokens: [[{ content: 'const a = 1;', offset: 0 }]],
};

test('adapts Shiki tokens and splits dual-theme color declarations', async () => {
  const codeToTokens = vi.fn<TRShikiCodeToTokens>(async () => tokensResult);
  const highlight = createTRShikiHighlighter({ codeToTokens });

  const result = await highlight({ code: 'const a = 1;', language: 'ts' });

  expect(codeToTokens).toHaveBeenCalledWith('const a = 1;', {
    defaultColor: 'light-dark()',
    lang: 'ts',
    themes: trShikiDefaultThemes,
  });
  // `defaultColor: 'light-dark()'` packs both themes into one declaration; only
  // the first half is a usable bare color value.
  expect(result).toEqual({
    backgroundColor: '#ffffff',
    color: '#1f2328',
    lines: tokensResult.tokens,
  });
});

test('passes a custom theme pair through to Shiki', async () => {
  const codeToTokens = vi.fn<TRShikiCodeToTokens>(async () => tokensResult);
  const themes = { dark: 'nord', light: 'min-light' };
  await createTRShikiHighlighter({ codeToTokens, themes })({
    code: 'x',
    language: 'ts',
  });

  expect(codeToTokens.mock.calls[0]?.[1].themes).toEqual(themes);
});

test('short-circuits a language outside the declared set without calling Shiki', async () => {
  const codeToTokens = vi.fn<TRShikiCodeToTokens>(async () => tokensResult);
  const highlight = createTRShikiHighlighter({ codeToTokens, languages: ['ts'] });

  expect(await highlight({ code: 'x', language: 'python' })).toBeNull();
  expect(codeToTokens).not.toHaveBeenCalled();
  expect(await highlight({ code: 'x', language: 'ts' })).not.toBeNull();
});

test.each([
  'Language `brainfuck` not found, you may need to load it first',
  'Language `brainfuck` is not included in this bundle. You may want to load it from external source.',
])(
  'translates the Shiki unknown-language error %# into an unsupported result',
  async (message) => {
    const highlight = createTRShikiHighlighter({
      codeToTokens: async () => {
        throw new Error(message);
      },
    });

    expect(await highlight({ code: 'x', language: 'brainfuck' })).toBeNull();
  },
);

test('omits root colors when Shiki reports none', async () => {
  const highlight = createTRShikiHighlighter({
    codeToTokens: async () => ({ tokens: [[{ content: 'x', offset: 0 }]] }),
  });

  expect(await highlight({ code: 'x', language: 'ts' })).toEqual({
    backgroundColor: undefined,
    color: undefined,
    lines: [[{ content: 'x', offset: 0 }]],
  });
});

test('recognises an unknown-language rejection that is not an Error', async () => {
  const highlight = createTRShikiHighlighter({
    codeToTokens: async () => {
      // eslint-disable-next-line no-throw-literal -- mirrors a non-Error rejection
      throw 'Language `brainfuck` not found, you may need to load it first';
    },
  });

  expect(await highlight({ code: 'x', language: 'brainfuck' })).toBeNull();
});

test('rethrows a genuine highlighting fault', async () => {
  const error = new Error('regex engine exploded');
  const highlight = createTRShikiHighlighter({
    codeToTokens: async () => {
      throw error;
    },
  });

  await expect(highlight({ code: 'x', language: 'ts' })).rejects.toBe(error);
});

test('resolves an unsupported language against the real Shiki web bundle', async () => {
  // The zero-configuration adapter has no language whitelist, so this exercises
  // the error-message translation against Shiki itself rather than a stub.
  expect(
    await trShikiWebHighlighter({ code: 'x', language: 'definitely-not-a-language' }),
  ).toBeNull();
});

test('highlights against the real Shiki web bundle with a custom theme pair', async () => {
  const highlight = createTRShikiWebHighlighter({
    themes: { dark: 'github-dark', light: 'github-light' },
  });
  const result = await highlight({ code: 'const a = 1;', language: 'ts' });

  expect(result?.lines.length).toBeGreaterThan(0);
  expect(result?.lines[0]?.[0]?.content).toBeDefined();
});
