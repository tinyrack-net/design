import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';

const homepageRoot = fileURLToPath(new URL('../../../../homepage/', import.meta.url));

function readHomepage(path: string) {
  return readFileSync(new URL(path, `file://${homepageRoot}/`), 'utf8');
}

describe('table of contents documentation', () => {
  it('keeps Playground selection interactive and resettable', () => {
    const demo = readHomepage(
      'app/documentation/components/table-of-contents.demo.tsx',
    );

    expect(demo).toContain('usePlaygroundArgs as useArgs');
    expect(demo).toContain(
      'onNavigate={(item) => updateArgs({ currentHeading: item.id })}',
    );
    expect(demo).toContain("args: { currentHeading: 'install' }");
    expect(demo).toContain("options: ['install', 'configure']");
  });

  it('shares paste-ready interactive source and an accurate API in every locale', () => {
    const demo = readHomepage(
      'app/documentation/components/table-of-contents.demo.tsx',
    );
    expect(demo).toContain('export const tableOfContentsBasicSource');
    expect(demo).toContain('export function TableOfContentsExample()');
    expect(demo).toContain('window.location.hash = item.id');

    for (const locale of ['en', 'ko', 'ja']) {
      const docs = readHomepage(
        `app/content/${locale}/components/table-of-contents.mdx`,
      );
      expect(docs).toContain('preview={<Stories.TableOfContentsExample />}');
      expect(docs).toContain('code: Stories.tableOfContentsBasicSource');
      expect(docs).not.toContain('code: String.raw`');
      expect(docs).not.toContain('native `details`');
      for (const prop of [
        'currentHeading',
        'items',
        'label',
        'mobileLabel',
        'onNavigate',
        'renderLink',
        'ref',
      ]) {
        expect(docs).toContain(`\`${prop}\``);
      }
    }
  });
});
