import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';

const homepageRoot = fileURLToPath(new URL('../../../../homepage/', import.meta.url));

function readHomepage(path: string) {
  return readFileSync(new URL(path, `file://${homepageRoot}/`), 'utf8');
}

describe('language-select documentation', () => {
  it('keeps locale state interaction-owned and offers appearance controls only', () => {
    const demo = readHomepage('app/documentation/components/language-select.demo.tsx');

    expect(demo).toContain("useState('en')");
    expect(demo).toContain('onValueChange={setValue}');
    expect(demo).toContain("language: 'en'");
    expect(demo).toContain("language: 'ko'");
    expect(demo).toContain("language: 'ja'");
    expect(demo).toContain("args: { uiSize: 'md' }");
    expect(demo).not.toMatch(/argTypes:\s*{[^}]*value:/s);
    expect(demo).toContain('excludeStories: /.*Source$/');
  });

  it('uses one paste-ready React Router example and documents the public API in every locale', () => {
    const demo = readHomepage('app/documentation/components/language-select.demo.tsx');
    expect(demo).toContain('export const languageSelectRouterSource');
    expect(demo).toContain("from 'react-router'");
    expect(demo).toContain('if (nextLocale === locale) return;');
    expect(demo).toContain('navigate({ hash, pathname: nextPathname, search });');

    for (const locale of ['en', 'ko', 'ja']) {
      const docs = readHomepage(`app/content/${locale}/components/language-select.mdx`);
      expect(docs).toContain('code: Stories.languageSelectRouterSource');
      expect(docs).not.toContain('code: String.raw`');
      for (const api of [
        '`options`',
        '`value`',
        '`onValueChange`',
        '`label`',
        '`uiSize`',
        '`portalContainer`',
        '`onOpenChange`',
        '`ref`',
      ]) {
        expect(docs).toContain(api);
      }
      expect(docs).toContain('BCP 47');
      expect(docs).toContain('English');
      expect(docs).toContain('한국어');
      expect(docs).toContain('日本語');
    }
  });
});
