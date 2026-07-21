import { afterEach, describe, expect, it } from 'vitest';
import { loadDocsManifest } from '../src/config/index.js';
import { getDocumentPagination } from '../src/runtime/document-pagination-state.js';
import {
  createDocumentMeta,
  docsAssetPath,
  findDocsPage,
} from '../src/runtime/document-seo.js';
import { createTestProject, documentSource } from './test-project.js';

const dispose: Array<() => void> = [];
afterEach(() => {
  for (const cleanup of dispose.splice(0)) cleanup();
});

function manifest() {
  const project = createTestProject();
  dispose.push(project.dispose);
  project.write('index.mdx', documentSource());
  project.write(
    'guides/index.mdx',
    documentSource({ order: 0, section: 'guides', title: 'Guides' }),
  );
  project.write(
    'guides/button.mdx',
    documentSource({ order: 1, section: 'guides', title: 'Button' }),
  );
  return loadDocsManifest(project.config, { root: project.root });
}

describe('docs runtime state', () => {
  it('resolves base paths and creates complete SEO metadata', () => {
    const docs = manifest();
    expect(findDocsPage('/docs/guides/button/', docs)?.title).toBe('Button');
    expect(createDocumentMeta('/docs/guides/button/', docs)).toContainEqual({
      href: 'https://example.com/docs/guides/button/',
      rel: 'canonical',
      tagName: 'link',
    });
    expect(createDocumentMeta('/docs/missing', docs)).toContainEqual({
      content: 'noindex,nofollow',
      name: 'robots',
    });
    expect(docsAssetPath('/favicon.svg', docs)).toBe('/docs/favicon.svg');
    expect(docsAssetPath('https://cdn.example.com/logo.svg', docs)).toBe(
      'https://cdn.example.com/logo.svg',
    );
  });

  it('paginates in manifest order across section boundaries', () => {
    const docs = manifest();
    expect(getDocumentPagination('/docs', docs)).toMatchObject({
      next: { path: '/guides/', title: 'Guides' },
    });
    expect(getDocumentPagination('/docs/guides/', docs)).toMatchObject({
      next: { path: '/guides/button/', title: 'Button' },
      previous: { path: '/', title: 'Home' },
    });
    expect(getDocumentPagination('/docs/missing', docs)).toEqual({});
  });
});
