import { describe, expect, it } from 'vitest';
import { htmlToPlainText, languageFromClassName, mergeClassNames } from './shared.js';

describe('MDX shared helpers', () => {
  it('extracts fenced code languages from class names', () => {
    expect(languageFromClassName('foo language-typescript bar')).toBe('typescript');
    expect(languageFromClassName('language-tsx')).toBe('tsx');
    expect(languageFromClassName('language-')).toBe('text');
    expect(languageFromClassName('tr-code')).toBeUndefined();
    expect(languageFromClassName(undefined)).toBeUndefined();
  });

  it('decodes HTML entities while preserving code text', () => {
    expect(htmlToPlainText('&lt;script /&gt;&#10;&amp;')).toBe('<script />\n&');
    expect(htmlToPlainText('<code>&quot;safe&quot;</code>')).toBe('"safe"');
  });

  it('merges only present class names', () => {
    expect(mergeClassNames('tr-mdx', undefined, false, 'custom')).toBe('tr-mdx custom');
  });
});
