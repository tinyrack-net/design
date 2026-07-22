import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';

const homepageRoot = fileURLToPath(new URL('../../../../homepage/', import.meta.url));

function readHomepage(path: string) {
  return readFileSync(new URL(path, `file://${homepageRoot}/`), 'utf8');
}

describe('document-pagination documentation', () => {
  it('keeps the direction control functional and resettable', () => {
    const demo = readHomepage(
      'app/documentation/components/document-pagination.demo.tsx',
    );

    expect(demo).toContain("args: { direction: 'both' }");
    expect(demo).toContain("direction: { control: 'select'");
    expect(demo).toContain("options: ['both', 'previous', 'next']");
    expect(demo).toContain('excludeStories: /.*(?:Preview|Source)$/');
  });

  it('shares complete paste-ready sources and API coverage across every locale', () => {
    const demo = readHomepage(
      'app/documentation/components/document-pagination.demo.tsx',
    );
    expect(demo).toContain('export const documentPaginationBasicSource');
    expect(demo).toContain('export const documentPaginationStatesSource');
    expect(demo).toContain("import '@tinyrack/ui/components/document-pagination.css';");
    expect(demo).toContain(
      "import { TRDocumentPagination } from '@tinyrack/ui/components/document-pagination';",
    );

    for (const locale of ['en', 'ko', 'ja']) {
      const docs = readHomepage(
        `app/content/${locale}/components/document-pagination.mdx`,
      );
      expect(docs).toContain('code: Stories.documentPaginationBasicSource');
      expect(docs).toContain('code: Stories.documentPaginationStatesSource');
      expect(docs).toContain('document-pagination-states');
      expect(docs).toContain('`onNavigate`');
      expect(docs).toContain('`renderLink`');
      expect(docs).toContain('`disabled`');
      expect(docs).toContain('`ref`');
      expect(docs).not.toContain('code: String.raw`');
    }
  });
});
