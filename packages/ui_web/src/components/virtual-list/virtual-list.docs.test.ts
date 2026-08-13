import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';

const homepageRoot = fileURLToPath(new URL('../../../../homepage/', import.meta.url));

function readHomepage(path: string) {
  return readFileSync(new URL(path, `file://${homepageRoot}/`), 'utf8');
}

describe('virtual list documentation', () => {
  it('keeps the large-collection playground controls resettable', () => {
    const demo = readHomepage('app/documentation/components/virtual-list.demo.tsx');

    expect(demo).toContain("axis: 'vertical'");
    expect(demo).toContain("follow: 'none'");
    expect(demo).toContain('itemCount: 10_000');
    expect(demo).toContain("axis: { options: ['vertical', 'horizontal']");
    expect(demo).toContain("follow: { options: ['none', 'trailing']");
    expect(demo).toContain('excludeStories: /.*(?:Preview|Source)$/');
  });

  it('shares paste-ready large, streaming, and horizontal sources', () => {
    const demo = readHomepage('app/documentation/components/virtual-list.demo.tsx');
    const sourceNames = [
      'virtualListBasicSource',
      'virtualListStreamingSource',
      'virtualListHorizontalSource',
    ];

    expect(demo).toContain("import '@tinyrack/ui/components/virtual-list.css';");
    for (const sourceName of sourceNames) {
      expect(demo).toContain(`export const ${sourceName}`);
    }
    for (const locale of ['en', 'ko', 'ja']) {
      const docs = readHomepage(
        `app/content/${locale}/web/components/virtual-list.mdx`,
      );
      for (const sourceName of sourceNames) {
        expect(docs).toContain(`code: Stories.${sourceName}`);
      }
      expect(docs).not.toContain('code: String.raw`');
    }
  });

  it('documents the public behavior without exposing TanStack contracts', () => {
    const contracts = [
      'TRVirtualList<T, K>',
      'TRVirtualListController<K>',
      'TRVirtualListSnapshot<K>',
      'TRVirtualListInitialPosition<K>',
      'TRVirtualListFollow',
      'TRVirtualListEdgeRequest',
      'TRVirtualListTriggerExtent',
      'TRVirtualListRange<K>',
      'useTRVirtualListController<K>()',
      'onVisibleRangeChanged',
      'holdVisibleAnchorForNextLayout',
      'ssrFallback',
      'TRScrollArea',
    ];
    for (const locale of ['en', 'ko', 'ja']) {
      const docs = readHomepage(
        `app/content/${locale}/web/components/virtual-list.mdx`,
      );
      for (const contract of contracts) expect(docs).toContain(contract);
      expect(docs).not.toContain('@tanstack/react-virtual');
    }
  });
});
