import { afterEach, describe, expect, it } from 'vitest';
import { loadDocsManifest } from '../src/config/index.js';
import {
  createTestProject,
  docsPageSource,
  documentSource,
  withConfig,
} from './test-project.js';

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
      header: {
        links: [
          { label: 'Components', path: '/components/accordion' },
          { label: 'GitHub', path: 'https://github.com/tinyrack-net/design' },
        ],
        version: '0.3',
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
    expect(manifest.header).toEqual(localizedConfig.header);
    expect(manifest.locales['en']?.messages.headerNavigation).toBe(
      'Primary navigation',
    );
    expect(manifest.locales['en']?.messages.backToMainMenu).toBe('Back to docs menu');
    expect(manifest.locales['en']?.messages.siteNavigation).toBe('Main menu');
    expect(manifest.locales['en']?.messages.useDarkColorScheme).toBe(
      'Use dark color scheme',
    );
    expect(manifest.locales['ko']?.messages.search).toBe('문서 검색');
    expect(manifest.locales['ko']?.messages.nextDocument).toBe('다음 문서');
    expect(manifest.locales['ko']?.messages.useLightColorScheme).toBe(
      '밝은 색상 모드 사용',
    );
    expect(manifest.redirects).toEqual({ '/': '/en/' });
  });

  it('allows consumers to override the built-in locale messages', () => {
    const project = createTestProject('/');
    dispose.push(project.dispose);
    const config = {
      ...project.config,
      i18n: {
        defaultLocale: 'en',
        locales: {
          en: {
            label: 'English',
            language: 'en',
            openGraph: 'en_US',
            messages: { search: 'Find docs' },
          },
        },
      },
    };
    project.write('en/index.mdx', documentSource({ slug: '/en' }));

    const manifest = loadDocsManifest(config, { root: project.root });
    expect(manifest.locales['en']?.messages.search).toBe('Find docs');
    expect(manifest.locales['en']?.messages.nextDocument).toBe('Next document');
    expect(manifest.locales['en']?.messages.useDarkColorScheme).toBe(
      'Use dark color scheme',
    );
  });

  it('allows MDX frontmatter to override generated headings', () => {
    const project = createTestProject('/');
    dispose.push(project.dispose);
    project.write(
      'index.mdx',
      `---
title: Home
description: A test document.
section: start
order: 0
headings:
  - depth: 2
    id: generated-reference
    label: Generated reference
  - depth: 3
    id: generated-colors
    label: Colors
---

## Authored heading
`,
    );

    const manifest = loadDocsManifest(project.config, { root: project.root });
    expect(manifest.pages[0]?.headings).toEqual([
      { depth: 2, id: 'generated-reference', label: 'Generated reference' },
      { depth: 3, id: 'generated-colors', label: 'Colors' },
    ]);
  });

  it.each([
    ['invalid depth', '  - depth: 4\n    id: invalid\n    label: Invalid', 'depth'],
    ['empty id', '  - depth: 2\n    id: ""\n    label: Empty', 'id'],
    [
      'duplicate id',
      '  - depth: 2\n    id: duplicate\n    label: First\n  - depth: 3\n    id: duplicate\n    label: Second',
      'duplicate heading id',
    ],
  ])('rejects MDX frontmatter headings with %s', (_name, headings, message) => {
    const project = createTestProject('/');
    dispose.push(project.dispose);
    project.write(
      'index.mdx',
      `---
title: Home
description: A test document.
section: start
order: 0
headings:
${headings}
---
`,
    );

    expect(() => loadDocsManifest(project.config, { root: project.root })).toThrow(
      message,
    );
  });

  it('derives deterministic routes, navigation, canonical URLs, and assets from MDX', () => {
    const project = createTestProject();
    dispose.push(project.dispose);
    project.write('index.mdx', documentSource());
    project.write(
      'guides/button.mdx',
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
      routeFile: 'guides/button.mdx',
      sidebarLabel: 'Buttons',
    });
  });

  it('discovers plain TSX pages alongside MDX', () => {
    const project = createTestProject();
    dispose.push(project.dispose);
    project.write('index.tsx', docsPageSource());
    project.write(
      'guides/install.tsx',
      docsPageSource({
        headings: [
          { depth: 2, id: 'package', label: 'Package' },
          { depth: 3, id: 'pnpm', label: 'pnpm' },
        ],
        order: 0,
        section: 'guides',
        title: 'Install',
      }),
    );
    const manifest = loadDocsManifest(project.config, { root: project.root });

    expect(manifest.pages.map((page) => page.path)).toEqual(['/', '/guides/install']);
    expect(manifest.pages[0]).toMatchObject({
      headings: [],
      moduleStem: 'index',
      routeFile: 'index.tsx',
      sourceFile: 'content/index.tsx',
    });
    expect(manifest.pages[1]).toMatchObject({
      headings: [
        { depth: 2, id: 'package', label: 'Package' },
        { depth: 3, id: 'pnpm', label: 'pnpm' },
      ],
      moduleStem: 'install',
      routeFile: 'guides/install.tsx',
    });
  });

  it('does not specially strip a literal docs basename segment', () => {
    const project = createTestProject('/');
    dispose.push(project.dispose);
    project.write('index.mdx', documentSource());
    project.write(
      'guides/button.docs.mdx',
      documentSource({ order: 0, section: 'guides', title: 'Button docs' }),
    );

    const manifest = loadDocsManifest(project.config, { root: project.root });

    expect(manifest.pages[1]).toMatchObject({
      moduleStem: 'button.docs',
      path: '/guides/button.docs',
      routeFile: 'guides/button.docs.mdx',
    });
  });

  it('uses TSX pages for localized homepages and all page layouts', () => {
    const project = createTestProject('/');
    dispose.push(project.dispose);
    const config = {
      ...project.config,
      i18n: {
        defaultLocale: 'en',
        locales: {
          en: { label: 'English', language: 'en', openGraph: 'en_US' },
          ko: { label: '한국어', language: 'ko', openGraph: 'ko_KR' },
        },
      },
    };
    project.write(
      'en/index.tsx',
      docsPageSource({ layout: 'splash', navigation: false, slug: '/en' }),
    );
    project.write(
      'ko/index.tsx',
      docsPageSource({
        layout: 'standalone',
        navigation: false,
        slug: '/ko',
        title: '한국어',
      }),
    );

    const manifest = loadDocsManifest(config, { root: project.root });
    expect(manifest.pages).toMatchObject([
      { contentKey: '/', layout: 'splash', locale: 'en', navigation: false },
      { contentKey: '/', layout: 'standalone', locale: 'ko', navigation: false },
    ]);
  });

  it('rejects duplicate routes across MDX and TSX pages', () => {
    const project = createTestProject('/');
    dispose.push(project.dispose);
    project.write('index.mdx', documentSource());
    project.write('index.tsx', docsPageSource());

    expect(() => loadDocsManifest(project.config, { root: project.root })).toThrow(
      'duplicate slug',
    );
  });

  it.each([
    [
      'missing DocsPage',
      'export default function Page() { return <p>Body</p>; }',
      'DocsPage',
    ],
    [
      'dynamic frontmatter',
      `const metadata = { title: 'Home' };\nexport default function Page() { return <DocsPage frontmatter={metadata} />; }`,
      'inline static object literal',
    ],
    [
      'spread frontmatter',
      `export default function Page() { return <DocsPage frontmatter={{ ...metadata, title: 'Home' }} />; }`,
      'spread',
    ],
    [
      'dynamic headings',
      `export default function Page() { return <DocsPage frontmatter={{ title: 'Home', description: 'Description', section: 'start', order: 0 }} headings={headings} />; }`,
      'headings must be an inline static array literal',
    ],
    [
      'JSX spread attributes',
      `export default function Page() { return <DocsPage frontmatter={{ title: 'Home', description: 'Description', section: 'start', order: 0 }} {...props} />; }`,
      'must not use spread attributes',
    ],
  ])('rejects TSX pages with %s', (_name, source, message) => {
    const project = createTestProject('/');
    dispose.push(project.dispose);
    project.write('index.tsx', source);

    expect(() => loadDocsManifest(project.config, { root: project.root })).toThrow(
      message,
    );
  });

  it('rejects malformed explicit TSX headings', () => {
    const project = createTestProject('/');
    dispose.push(project.dispose);
    project.write(
      'index.tsx',
      docsPageSource({ headings: [{ depth: 2, id: '', label: 'Body' }] }),
    );

    expect(() => loadDocsManifest(project.config, { root: project.root })).toThrow(
      'heading field "id" must be a string',
    );
  });

  it('parses comments and JavaScript string escapes without changing metadata', () => {
    const project = createTestProject('/');
    dispose.push(project.dispose);
    project.write(
      'index.tsx',
      `export default function Page() {
  return (
    <DocsPage frontmatter={{
      // Metadata is extracted before compilation.
      title: '\\x48ome',
      description: 'Line\\nBreak',
      section: 'start',
      order: 0,
    }} />
  );
}`,
    );

    const [page] = loadDocsManifest(project.config, { root: project.root }).pages;
    expect(page).toMatchObject({ description: 'Line\nBreak', title: 'Home' });
  });

  it('ignores DocsPage-like regexes and braces in ordinary prop expressions', () => {
    const project = createTestProject('/');
    dispose.push(project.dispose);
    project.write(
      'index.tsx',
      `const docsPagePattern = /<DocsPage\\b/;

export default function Page() {
  return (
    <DocsPage
      frontmatter={{ title: 'Home', description: 'Description', section: 'start', order: 0 }}
      onClick={() => /* a normal prop expression */ /}/.test(String(docsPagePattern))}
    />
  );
}`,
    );

    expect(loadDocsManifest(project.config, { root: project.root }).pages).toHaveLength(
      1,
    );
  });

  it('does not treat apostrophes in JSX text as string delimiters', () => {
    const project = createTestProject('/');
    dispose.push(project.dispose);
    project.write(
      'index.tsx',
      `export default function Page() {
  return <><p>'Tis static.</p><DocsPage frontmatter={{ title: 'Home', description: 'Description', section: 'start', order: 0 }} /></>;
}`,
    );

    expect(loadDocsManifest(project.config, { root: project.root }).pages).toHaveLength(
      1,
    );
  });

  it('rejects heading IDs that collide after normalization', () => {
    const project = createTestProject('/');
    dispose.push(project.dispose);
    project.write(
      'index.tsx',
      docsPageSource({
        headings: [
          { depth: 2, id: 'body', label: 'Body' },
          { depth: 3, id: ' body ', label: 'Nested body' },
        ],
      }),
    );

    expect(() => loadDocsManifest(project.config, { root: project.root })).toThrow(
      'duplicate heading id "body"',
    );
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
