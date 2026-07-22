import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';

const homepageRoot = fileURLToPath(new URL('../../../../homepage/', import.meta.url));

function readHomepage(path: string) {
  return readFileSync(new URL(path, `file://${homepageRoot}/`), 'utf8');
}

describe('code-block documentation', () => {
  it('exposes every visible Playground state and its reset defaults', () => {
    const demo = readHomepage('app/documentation/components/code-block.demo.tsx');

    expect(demo).toContain("code: { control: 'textarea' }");
    expect(demo).toContain(
      "options: ['plain text', 'ts', 'tsx', 'js', 'json', 'css', 'html', 'shellscript']",
    );
    expect(demo).toContain("language: 'ts'");
    expect(demo).toContain('wrap: false');
    expect(demo).toContain("playgroundLayout: 'fill'");
  });

  it('shares paste-ready source and complete API, accessibility, and style guidance across locales', () => {
    const demo = readHomepage('app/documentation/components/code-block.demo.tsx');
    expect(demo).toContain('export const codeBlockBasicSource');
    expect(demo).toContain('export const codeBlockModesSource');
    expect(demo).toContain('export const copyableCodeBlockSource');
    expect(demo).toContain('navigator.clipboard.writeText(code)');
    expect(demo).toContain('<output aria-live="polite">{copyResult}</output>');

    for (const locale of ['en', 'ko', 'ja'] as const) {
      const docs = readHomepage(`app/content/${locale}/components/code-block.mdx`);
      expect(docs).toContain('code: Stories.codeBlockBasicSource');
      expect(docs).toContain('code: Stories.codeBlockModesSource');
      expect(docs).toContain('code: Stories.copyableCodeBlockSource');
      expect(docs).not.toContain('code: String.raw`');
      for (const prop of ['code', 'language', 'wrap', 'ref', 'className', 'style']) {
        expect(docs).toContain(`\`${prop}\``);
      }
      for (const token of [
        '--tr-code-block-background',
        '--tr-code-block-border',
        '--tr-code-block-border-width',
        '--tr-code-block-color',
        '--tr-code-block-font-family',
        '--tr-code-block-font-size',
        '--tr-code-block-line-height',
        '--tr-code-block-padding-x',
        '--tr-code-block-padding-y',
        '--tr-code-block-radius',
      ]) {
        expect(docs).toContain(`\`${token}\``);
      }
      expect(docs).toContain('aria-label');
      expect(docs).toContain('<pre><code>');
      expect(docs).toContain('SSR');
      const [scrollTerm, hydrationTerm] =
        locale === 'ko'
          ? ['가로 스크롤', '하이드레이션']
          : locale === 'ja'
            ? ['水平スクロール', 'ハイドレーション']
            : ['overflow', 'hydration'];
      expect(docs).toContain(scrollTerm);
      expect(docs).toContain(hydrationTerm);
    }
  });
});
