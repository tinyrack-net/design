import { afterEach, describe, expect, it } from 'vitest';
import { loadDocsManifest } from '../src/config/index.js';
import { createTestProject, documentSource, withConfig } from './test-project.js';

const dispose: Array<() => void> = [];
afterEach(() => {
  for (const cleanup of dispose.splice(0)) cleanup();
});

describe('docs manifest', () => {
  it('derives deterministic routes, navigation, canonical URLs, and assets from MDX', () => {
    const project = createTestProject();
    dispose.push(project.dispose);
    project.write('index.mdx', documentSource());
    project.write(
      'guides/button.docs.mdx',
      documentSource({
        description: 'Button guide.',
        order: 0,
        section: 'guides',
        sidebarLabel: 'Buttons',
        title: 'Button',
      }),
    );

    const manifest = loadDocsManifest(project.config, { root: project.root });
    expect(manifest.pages.map((page) => page.path)).toEqual(['/', '/guides/button']);
    expect(manifest.pages[1]).toMatchObject({
      canonicalPath: '/docs/guides/button/',
      canonicalUrl: 'https://example.com/docs/guides/button/',
      imageUrl: 'https://example.com/docs/og/guides/button.png',
      routeFile: 'guides/button.docs.mdx',
      sidebarLabel: 'Buttons',
    });
  });

  it.each([
    ['title', 'description: "Description"\nsection: start\norder: 0'],
    ['description', 'title: "Home"\nsection: start\norder: 0'],
    ['section', 'title: "Home"\ndescription: "Description"\norder: 0'],
    ['order', 'title: "Home"\ndescription: "Description"\nsection: start'],
  ])('rejects a missing %s field', (field, frontmatter) => {
    const project = createTestProject('/');
    dispose.push(project.dispose);
    project.write('index.mdx', `---\n${frontmatter}\n---\n`);
    expect(() => loadDocsManifest(project.config, { root: project.root })).toThrow(
      field,
    );
  });

  it('rejects unknown sections, duplicate slugs, and duplicate section order', () => {
    const project = createTestProject('/');
    dispose.push(project.dispose);
    project.write('index.mdx', documentSource());
    project.write('unknown.mdx', documentSource({ order: 1, section: 'missing' }));
    expect(() => loadDocsManifest(project.config, { root: project.root })).toThrow(
      'unknown docs section',
    );

    project.write(
      'unknown.mdx',
      documentSource({ order: 1, section: 'start', slug: '/' }),
    );
    expect(() => loadDocsManifest(project.config, { root: project.root })).toThrow(
      'duplicate slug',
    );

    project.write('unknown.mdx', documentSource({ order: 0, section: 'start' }));
    expect(() => loadDocsManifest(project.config, { root: project.root })).toThrow(
      'duplicate order',
    );
  });

  it('rejects content directories outside the consumer project', () => {
    const project = createTestProject('/');
    dispose.push(project.dispose);
    expect(() =>
      loadDocsManifest(withConfig(project.config, '../content'), {
        root: project.root,
      }),
    ).toThrow('must stay inside the project root');
  });
});
