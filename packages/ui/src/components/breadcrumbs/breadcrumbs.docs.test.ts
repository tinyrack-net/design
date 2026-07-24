import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';

const homepageRoot = fileURLToPath(new URL('../../../../homepage/', import.meta.url));

function readHomepage(path: string) {
  return readFileSync(new URL(path, `file://${homepageRoot}/`), 'utf8');
}

describe('breadcrumbs documentation', () => {
  it('keeps the separator control functional and resettable', () => {
    const demo = readHomepage('app/documentation/components/breadcrumbs.demo.tsx');

    expect(demo).toContain("args: { separator: '/' }");
    expect(demo).toContain("separator: { control: 'text' }");
    expect(demo).toContain('excludeStories: /.*(?:Preview|Source)$/');
  });

  it('shares complete paste-ready sources and API coverage across every locale', () => {
    const demo = readHomepage('app/documentation/components/breadcrumbs.demo.tsx');
    expect(demo).toContain('export const breadcrumbsBasicSource');
    expect(demo).toContain('export const breadcrumbsCustomSeparatorSource');
    expect(demo).toContain("import '@tinyrack/ui/components/breadcrumbs.css';");
    expect(demo).toContain(
      "import { TRBreadcrumbs } from '@tinyrack/ui/components/breadcrumbs';",
    );

    for (const locale of ['en', 'ko', 'ja']) {
      const docs = readHomepage(`app/content/${locale}/components/breadcrumbs.mdx`);
      expect(docs).toContain('code: Stories.breadcrumbsBasicSource');
      expect(docs).toContain('code: Stories.breadcrumbsCustomSeparatorSource');
      expect(docs).toContain('breadcrumbs-custom-separator');
      expect(docs).toContain('`renderLink`');
      expect(docs).toContain('`separator`');
      expect(docs).toContain('`items`');
      expect(docs).toContain('`ref`');
      expect(docs).not.toContain('code: String.raw`');
    }
  });
});
