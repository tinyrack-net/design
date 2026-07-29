import { afterEach, describe, expect, it } from 'vitest';
import { getDocumentPagination } from '../src/components/pagination/pagination.state.js';
import { loadDocsManifest } from '../src/entrypoints/config.js';
import {
  createDocumentMeta,
  docsAssetPath,
  findDocsInstance,
  findDocsPage,
} from '../src/runtime/document-seo.js';
import { createTestProject, docsPageSource, documentSource } from './test-project.js';

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

  it('resolves URL prefixes and keeps pagination inside the current instance', () => {
    const project = createTestProject('/docs', [
      { id: 'home', label: 'Home', order: 0 },
      { id: 'foundations', label: 'Foundations', order: 1 },
      { id: 'web', label: 'Web', order: 2 },
    ]);
    dispose.push(project.dispose);
    project.write(
      'index.tsx',
      docsPageSource({
        layout: 'splash',
        navigation: false,
        section: 'home',
        slug: '/',
      }),
    );
    project.write(
      'foundations/index.mdx',
      documentSource({ section: 'foundations', title: 'Foundations' }),
    );
    project.write(
      'foundations/colors.mdx',
      documentSource({
        order: 1,
        section: 'foundations',
        title: 'Colors',
      }),
    );
    project.write('web/index.mdx', documentSource({ section: 'web', title: 'Web' }));
    const docs = loadDocsManifest(
      {
        ...project.config,
        instances: [
          {
            id: 'foundations',
            label: 'Foundations',
            routeBasePath: '/foundations',
            sections: ['foundations'],
          },
          {
            id: 'web',
            label: 'Web',
            routeBasePath: '/web',
            sections: ['web'],
          },
        ],
      },
      { root: project.root },
    );

    expect(findDocsInstance('/docs/foundations/missing', docs)?.id).toBe('foundations');
    expect(getDocumentPagination('/docs/foundations', docs)).toMatchObject({
      next: { path: '/foundations/colors/', title: 'Colors' },
    });
    expect(getDocumentPagination('/docs/foundations/colors', docs)).toMatchObject({
      previous: { path: '/foundations/', title: 'Foundations' },
    });
    expect(
      getDocumentPagination('/docs/foundations/colors', docs).next,
    ).toBeUndefined();
  });
});
