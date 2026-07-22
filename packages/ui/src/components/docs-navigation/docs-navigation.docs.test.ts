import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';

const homepageRoot = fileURLToPath(new URL('../../../../homepage/', import.meta.url));

function readHomepage(path: string) {
  return readFileSync(new URL(path, `file://${homepageRoot}/`), 'utf8');
}

describe('docs-navigation documentation', () => {
  it('omits a no-control Playground while keeping every locale complete and paste-ready', () => {
    const demo = readHomepage('app/documentation/components/docs-navigation.demo.tsx');
    expect(demo).toContain('export const docsNavigationBasicSource');
    expect(demo).toContain('export const docsNavigationRouterSource');
    expect(demo).toContain('export function DocsNavigationPreview');
    expect(demo).toContain('export function DocsNavigationPendingPreview');
    expect(demo).not.toContain('currentPath: { control:');
    expect(demo).not.toContain('pendingPath: {');
    expect(demo).not.toContain('definePlayground');
    expect(demo).not.toContain('export const playground');
    expect(demo).toContain('defaultGroupsOpen');

    for (const locale of ['en', 'ko', 'ja']) {
      const docs = readHomepage(`app/content/${locale}/components/docs-navigation.mdx`);
      expect(docs).toContain('code: Stories.docsNavigationBasicSource');
      expect(docs).toContain('code: Stories.docsNavigationRouterSource');
      expect(docs).not.toContain('code: String.raw`');
      expect(docs).not.toContain('ComponentPlayground');
      expect(docs).not.toContain('Stories.playground');
      expect(docs).toContain('TRDocsNavigationItem');
      expect(docs).toContain('TRDocsNavigationGroup');
      expect(docs).toContain('TRDocsNavigationPage');
      expect(docs).toContain('TRDocsNavigationLinkState');
      expect(docs).toContain('TRDocsNavigationProps');
      expect(docs).toContain('renderLink');
      expect(docs).toContain('onNavigate');
      expect(docs).toContain('aria-current="page"');
      expect(docs).toContain('SSR');
      expect(docs).toContain('--tr-docs-navigation-link-active-border-color');
    }
  });
});
