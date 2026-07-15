import { afterEach, describe, expect, it } from 'vitest';
import { loadDocsManifest } from '../src/config/index.js';
import { createTestProject, documentSource, withConfig } from './test-project.js';

const dispose: Array<() => void> = [];
afterEach(() => {
  for (const cleanup of dispose.splice(0)) cleanup();
});

describe('docs manifest', () => {
  it('builds localized navigation, alternates, headings, layouts, and redirects', () => {
    const project = createTestProject('/');
    dispose.push(project.dispose);
    const localizedConfig = {
      ...project.config,
      i18n: {
        defaultLocale: 'en',
        locales: {
          en: { label: 'English', language: 'en', openGraph: 'en_US' },
          ko: { label: '한국어', language: 'ko', openGraph: 'ko_KR' },
        },
      },
      navigation: [
        {
          children: [{ contentKey: '/guides/install', type: 'page' as const }],
          label: { en: 'Guides', ko: '가이드' },
          type: 'group' as const,
        },
      ],
      redirects: { '/': '/en/' },
    };
    project.write(
      'en/index.mdx',
      documentSource({ order: 0, slug: '/en', title: 'English home' }),
    );
    project.write(
      'ko/index.mdx',
      documentSource({ order: 0, slug: '/ko', title: '한국어 홈' }),
    );
    project.write(
      'en/guides/install.mdx',
      `${documentSource({ order: 0, section: 'guides', title: 'Install' })}\n## Setup\n### Windows\n## Setup\n`,
    );
    project.write(
      'ko/guides/install.mdx',
      `---\ntitle: 설치\ndescription: 설치 안내.\nsection: guides\norder: 0\nlayout: standalone\nnavigation: false\n---\n\n## 설정\n`,
    );

    const manifest = loadDocsManifest(localizedConfig, { root: project.root });
    const english = manifest.pages.find((page) => page.path === '/en/guides/install');
    const korean = manifest.pages.find((page) => page.path === '/ko/guides/install');
    expect(english).toMatchObject({
      contentKey: '/guides/install',
      headings: [
        { depth: 2, id: 'body', label: 'Body' },
        { depth: 2, id: 'setup', label: 'Setup' },
        { depth: 3, id: 'windows', label: 'Windows' },
        { depth: 2, id: 'setup-2', label: 'Setup' },
      ],
      layout: 'docs',
      locale: 'en',
      navigation: true,
    });
    expect(english?.alternates.map((alternate) => alternate.locale)).toEqual([
      'en',
      'ko',
    ]);
    expect(korean).toMatchObject({ layout: 'standalone', navigation: false });
    expect(manifest.navigation['ko']?.[0]).toMatchObject({ label: '가이드' });
    expect(manifest.redirects).toEqual({ '/': '/en/' });
  });

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
