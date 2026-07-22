import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';

const homepageRoot = fileURLToPath(new URL('../../../../homepage/', import.meta.url));

function readHomepage(path: string) {
  return readFileSync(new URL(path, `file://${homepageRoot}/`), 'utf8');
}

describe('color scheme toggle documentation', () => {
  it('keeps the Playground controlled internally with visible controls and reset support', () => {
    const demo = readHomepage(
      'app/documentation/components/color-scheme-toggle.demo.tsx',
    );

    expect(demo).toContain("disabled: { control: 'boolean' }");
    expect(demo).toContain("uiSize: { control: 'select'");
    expect(demo).not.toContain('value: { control:');
    expect(demo).toContain('usePlaygroundArgs');
    expect(demo).toContain('onValueChange={(value) => updateArgs({ value })}');
  });

  it('keeps all locales on paste-ready sources, adapter guidance, and a complete API', () => {
    const demo = readHomepage(
      'app/documentation/components/color-scheme-toggle.demo.tsx',
    );
    for (const sourceName of [
      'colorSchemeToggleBasicSource',
      'colorSchemeToggleAdapterSource',
      'colorSchemeToggleStatesSource',
    ]) {
      expect(demo).toContain(`export const ${sourceName}`);
    }
    expect(demo).toContain("media.addEventListener('change'");
    expect(demo).toContain("media.removeEventListener('change'");

    for (const locale of ['en', 'ko', 'ja'] as const) {
      const docs = readHomepage(
        `app/content/${locale}/components/color-scheme-toggle.mdx`,
      );
      expect(docs).toContain('code: Stories.colorSchemeToggleBasicSource');
      expect(docs).toContain('code: Stories.colorSchemeToggleAdapterSource');
      expect(docs).toContain('code: Stories.colorSchemeToggleStatesSource');
      expect(docs).not.toContain('code: String.raw`');
      expect(docs).toContain('`system`');
      expect(docs).toContain('localStorage');
      expect(docs).toContain(
        locale === 'ko'
          ? '하이드레이션'
          : locale === 'ja'
            ? 'ハイドレーション'
            : 'hydration',
      );
      for (const prop of [
        'value',
        'onValueChange',
        'darkLabel',
        'lightLabel',
        'aria-labelledby',
        'disabled',
        'uiSize',
        'ref',
        'onClick',
      ]) {
        expect(docs).toContain(`| \`${prop}\``);
      }
    }
  });
});
