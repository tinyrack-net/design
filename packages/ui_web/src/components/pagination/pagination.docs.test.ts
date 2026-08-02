import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';

const homepageRoot = fileURLToPath(new URL('../../../../homepage/', import.meta.url));

function readHomepage(path: string) {
  return readFileSync(new URL(path, `file://${homepageRoot}/`), 'utf8');
}

describe('pagination documentation', () => {
  it('keeps the window controls functional and resettable', () => {
    const demo = readHomepage('app/documentation/components/pagination.demo.tsx');

    expect(demo).toContain(
      'args: { boundaryCount: 1, currentPage: 3, siblingCount: 1, totalPages: 12 }',
    );
    for (const control of [
      'boundaryCount',
      'currentPage',
      'siblingCount',
      'totalPages',
    ]) {
      expect(demo).toContain(`${control}: { control: 'number' }`);
    }
    expect(demo).toContain('excludeStories: /.*(?:Preview|Source)$/');
  });

  it('shares complete paste-ready sources and API coverage across every locale', () => {
    const demo = readHomepage('app/documentation/components/pagination.demo.tsx');
    expect(demo).toContain('export const paginationBasicSource');
    expect(demo).toContain('export const paginationWindowSource');
    expect(demo).toContain("import '@tinyrack/ui/components/pagination.css';");
    expect(demo).toContain(
      "import { TRPagination } from '@tinyrack/ui/components/pagination';",
    );

    for (const locale of ['en', 'ko', 'ja']) {
      const docs = readHomepage(`app/content/${locale}/web/components/pagination.mdx`);
      expect(docs).toContain('code: Stories.paginationBasicSource');
      expect(docs).toContain('code: Stories.paginationWindowSource');
      expect(docs).toContain('pagination-window');
      expect(docs).toContain('`currentPage`');
      expect(docs).toContain('`totalPages`');
      expect(docs).toContain('`hrefFor`');
      expect(docs).toContain('`boundaryCount`');
      expect(docs).toContain('`siblingCount`');
      expect(docs).toContain('`renderLink`');
      expect(docs).toContain('`pageLabel(page)`');
      expect(docs).toContain('`getPaginationRange`');
      expect(docs).toContain('`ref`');
      expect(docs).not.toContain('code: String.raw`');
    }
  });

  it('documents every public component custom property', () => {
    const css = readFileSync(new URL('./pagination.css', import.meta.url), 'utf8');
    const declared = new Set(css.match(/--tr-pagination-[a-z-]+/g) ?? []);
    expect(declared.size).toBeGreaterThan(0);

    for (const locale of ['en', 'ko', 'ja']) {
      const docs = readHomepage(`app/content/${locale}/web/components/pagination.mdx`);
      for (const property of declared) {
        expect(docs).toContain(`\`${property}\``);
      }
    }
  });
});
