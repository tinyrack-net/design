import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs';
import { join, relative } from 'node:path';
import { loadDocsManifest } from '@tinyrack/docs/config';
import ts from 'typescript';
import { describe, expect, it } from 'vitest';
import { componentDocsManifest } from '../app/documentation/shared/component-docs-manifest.js';
import {
  tailwindTokenBridge,
  tailwindTokenGroups,
} from '../app/documentation/shared/tailwind-token-catalog.js';
import config from '../docs.config.js';

const homepageRoot = process.cwd();
const docsManifest = loadDocsManifest(config, { root: homepageRoot });
const staticDocumentRoutes = docsManifest.pages;
const componentNames = componentDocsManifest.map((entry) => entry.id);
const uiComponentsRoot = join(homepageRoot, '..', 'ui', 'src', 'components');

function readText(path: string) {
  const resolved = join(homepageRoot, path);
  if (existsSync(resolved)) return readFileSync(resolved, 'utf8');
  return readFileSync(
    join(homepageRoot, path.replace('app/content/', 'app/content/en/')),
    'utf8',
  );
}

function objectLiteralFromExpression(expression: ts.Expression) {
  let current = expression;
  while (
    ts.isAsExpression(current) ||
    ts.isParenthesizedExpression(current) ||
    ts.isSatisfiesExpression(current)
  ) {
    current = current.expression;
  }
  return ts.isObjectLiteralExpression(current) ? current : null;
}

function demoControlNames(path: string) {
  const text = readText(path);
  const source = ts.createSourceFile(
    path,
    text,
    ts.ScriptTarget.Latest,
    true,
    ts.ScriptKind.TSX,
  );
  let controls: string[] | null = null;

  function visit(node: ts.Node) {
    if (
      ts.isVariableDeclaration(node) &&
      ts.isIdentifier(node.name) &&
      node.name.text === 'meta' &&
      node.initializer
    ) {
      const meta = objectLiteralFromExpression(node.initializer);
      const argTypes = meta?.properties.find(
        (property): property is ts.PropertyAssignment =>
          ts.isPropertyAssignment(property) &&
          ts.isIdentifier(property.name) &&
          property.name.text === 'argTypes',
      );
      const definitions = argTypes
        ? objectLiteralFromExpression(argTypes.initializer)
        : null;
      controls =
        definitions?.properties.flatMap((property) =>
          ts.isPropertyAssignment(property) && ts.isIdentifier(property.name)
            ? [property.name.text]
            : [],
        ) ?? null;
    }
    ts.forEachChild(node, visit);
  }

  visit(source);
  const result = controls as string[] | null;
  if (result === null) throw new Error(`Could not read argTypes from ${path}.`);
  return result;
}

function componentExampleIds(source: string) {
  return Array.from(
    source.matchAll(/<ComponentExampleTabs[\s\S]*?\bid="([a-z0-9-]+)"/g),
    ([, id]) => id as string,
  );
}

function componentExampleItemCount(source: string, id: string) {
  const idOffset = source.indexOf(`id="${id}"`);
  if (idOffset < 0) return 0;
  const nextExampleOffset = source.indexOf('<ComponentExampleTabs', idOffset);
  const apiOffset = source.indexOf('## API', idOffset);
  const endOffset =
    nextExampleOffset >= 0 && nextExampleOffset < apiOffset
      ? nextExampleOffset
      : apiOffset;
  const block = source.slice(idOffset, endOffset);
  const declaredItemCount = block.match(
    /data-docs-example-item-count="(\d+)"/,
  )?.[1];
  if (declaredItemCount !== undefined) return Number(declaredItemCount);
  return block.match(/data-docs-example-item=""/g)?.length ?? 0;
}

function filesUnder(directory: string): string[] {
  return readdirSync(directory).flatMap((name) => {
    const path = join(directory, name);
    if (
      statSync(path).isDirectory() &&
      ['.git', '.react-router', 'build', 'node_modules'].includes(name)
    ) {
      return [];
    }
    return statSync(path).isDirectory() ? filesUnder(path) : [path];
  });
}

describe('React Router documentation contract', () => {
  it('documents every public component exactly once', () => {
    const publicComponentNames = readdirSync(uiComponentsRoot, { withFileTypes: true })
      .filter(
        (entry) =>
          entry.isDirectory() &&
          existsSync(join(uiComponentsRoot, entry.name, 'index.tsx')),
      )
      .map((entry) => entry.name)
      .sort();

    expect(new Set(componentDocsManifest.map((entry) => entry.id)).size).toBe(
      componentNames.length,
    );
    expect(componentDocsManifest.map((entry) => entry.id).sort()).toEqual(
      publicComponentNames,
    );

    for (const entry of componentDocsManifest) {
      expect(existsSync(join(homepageRoot, entry.file))).toBe(true);
      expect(
        existsSync(
          join(homepageRoot, `app/documentation/components/${entry.id}.demo.tsx`),
        ),
      ).toBe(true);
    }
  });

  it('keeps every localized component page structurally aligned', () => {
    for (const entry of componentDocsManifest) {
      const hasPlayground =
        !('hasPlayground' in entry) || entry.hasPlayground !== false;
      const expectedSections = ['Contract', 'Install'];
      if (hasPlayground) expectedSections.push('Playground');
      expectedSections.push('Usage', 'Examples', 'API');
      const english = readFileSync(
        join(homepageRoot, `app/content/en/components/${entry.id}.mdx`),
        'utf8',
      );
      const expectedExampleIds = componentExampleIds(english);

      for (const locale of ['en', 'ko', 'ja']) {
        const docs = readFileSync(
          join(homepageRoot, `app/content/${locale}/components/${entry.id}.mdx`),
          'utf8',
        );
        const canonicalSection = new Map([
          ['Contract', 'Contract'],
          ['계약', 'Contract'],
          ['コントラクト', 'Contract'],
          ['Install', 'Install'],
          ['설치', 'Install'],
          ['インストール', 'Install'],
          ['Playground', 'Playground'],
          ['플레이그라운드', 'Playground'],
          ['プレイグラウンド', 'Playground'],
          ['Usage', 'Usage'],
          ['사용법', 'Usage'],
          ['使用方法', 'Usage'],
          ['Examples', 'Examples'],
          ['예시', 'Examples'],
          ['例', 'Examples'],
          ['API', 'API'],
        ]);
        const sections = Array.from(docs.matchAll(/^## (.+)$/gm), ([, section]) =>
          section ? canonicalSection.get(section.trim()) : undefined,
        ).filter((section): section is string => section !== undefined);
        const exampleIds = componentExampleIds(docs);

        expect(sections, `${locale}/${entry.id}`).toEqual(expectedSections);
        expect(exampleIds, `${locale}/${entry.id}`).toEqual(expectedExampleIds);

        if ('exampleGroups' in entry && entry.exampleGroups !== undefined) {
          expect(exampleIds, `${locale}/${entry.id}`).toEqual(
            entry.exampleGroups.map((group) => group.id),
          );
          for (const group of entry.exampleGroups) {
            const itemCount = componentExampleItemCount(docs, group.id);
            expect(itemCount, `${locale}/${group.id}`).toBeGreaterThanOrEqual(
              group.minItems,
            );
            expect(itemCount, `${locale}/${group.id}`).toBeLessThanOrEqual(
              group.maxItems,
            );
          }
        }
      }
    }
  });

  it('uses Korean haeyoche in migrated component guides', () => {
    const prohibitedStyle = /니다|십시오|(?:했|됐|됨|함)(?=[.!?。<\n"'])/g;

    for (const entry of componentDocsManifest) {
      if (!('exampleGroups' in entry) || entry.exampleGroups === undefined) continue;
      const docs = readFileSync(
        join(homepageRoot, `app/content/ko/components/${entry.id}.mdx`),
        'utf8',
      );
      const matches = Array.from(docs.matchAll(prohibitedStyle), (match) => ({
        column: match.index - docs.lastIndexOf('\n', match.index),
        line: docs.slice(0, match.index).split('\n').length,
        text: match[0],
      }));

      expect(matches, `ko/${entry.id}`).toEqual([]);
    }
  });

  it.each(
    componentDocsManifest,
  )('$title keeps the required page sections, examples, and exact controls', (entry) => {
    const docs = readText(entry.file);
    const demoPath = `app/documentation/components/${entry.id}.demo.tsx`;
    const demo = readText(demoPath);
    const sections = ['Contract', 'Install', 'Usage', 'Examples', 'API'];
    const hasPlayground = !('hasPlayground' in entry) || entry.hasPlayground !== false;
    if (hasPlayground) sections.splice(2, 0, 'Playground');
    const sectionOffsets = sections.map((section) => docs.indexOf(`## ${section}`));

    expect(sectionOffsets.every((offset) => offset >= 0)).toBe(true);
    expect(sectionOffsets).toEqual([...sectionOffsets].sort((a, b) => a - b));
    if (hasPlayground) {
      expect(entry.controls.length).toBeGreaterThan(0);
      expect(docs).toContain('ComponentPlayground');
      expect(docs).toContain('definition={Stories.playground}');
      expect(demo).toContain('definePlayground(meta)');
    } else {
      expect(entry.controls).toEqual([]);
      expect(docs).not.toContain('ComponentPlayground');
      expect(docs).not.toContain('Stories.playground');
      expect(demo).not.toContain('definePlayground(meta)');
    }
    expect(docs).toContain(`@tinyrack/ui/components/${entry.id}`);
    expect(docs).toContain(`@tinyrack/ui/components/${entry.id}.css`);
    expect(demo).toContain(`@tinyrack/ui/components/${entry.id}`);

    expect(demoControlNames(demoPath).sort()).toEqual([...entry.controls].sort());
    for (const example of entry.requiredExamples) {
      expect(docs).toContain(`id="${example}"`);
    }

    if ('exampleGroups' in entry && entry.exampleGroups !== undefined) {
      expect(entry.exampleGroups.map((group) => group.id)).toEqual(
        entry.requiredExamples,
      );
      expect(entry.exampleGroups.filter((group) => group.section === 'usage')).toEqual([
        expect.objectContaining({ kind: 'basic' }),
      ]);

      const examplesOffset = docs.indexOf('## Examples');
      for (const group of entry.exampleGroups) {
        const idOffset = docs.indexOf(`id="${group.id}"`);
        const itemCount = componentExampleItemCount(docs, group.id);

        expect(idOffset, group.id).toBeGreaterThanOrEqual(0);
        expect(group.section === 'usage' ? idOffset < examplesOffset : idOffset > examplesOffset).toBe(true);
        expect(itemCount, group.id).toBeGreaterThanOrEqual(group.minItems);
        expect(itemCount, group.id).toBeLessThanOrEqual(group.maxItems);
      }
    }
  });

  it('keeps component installation guidance scoped to the UI package and component', () => {
    for (const entry of componentDocsManifest) {
      for (const locale of ['en', 'ko', 'ja']) {
        const docs = readFileSync(
          join(homepageRoot, `app/content/${locale}/components/${entry.id}.mdx`),
          'utf8',
        );
        const install = docs.match(/<ComponentInstall[\s\S]*?\/>/)?.[0];

        expect(install, `${locale}/${entry.id}`).toBeDefined();
        expect(install, `${locale}/${entry.id}`).toContain(
          "install: 'pnpm add @tinyrack/ui'",
        );
        expect(install, `${locale}/${entry.id}`).toContain(
          `import '@tinyrack/ui/components/${entry.id}.css';`,
        );
        expect(install, `${locale}/${entry.id}`).toContain(
          `from '@tinyrack/ui/components/${entry.id}';`,
        );
        expect(install, `${locale}/${entry.id}`).not.toContain(
          "import '@tinyrack/ui/core.css';",
        );
        expect(
          install?.match(/@tinyrack\/ui\/components\/[a-z0-9-]+\.css/g) ?? [],
          `${locale}/${entry.id}`,
        ).toEqual([`@tinyrack/ui/components/${entry.id}.css`]);
      }
    }
  });

  it('omits disabled Playgrounds from every locale', () => {
    const disabledPlaygrounds = componentDocsManifest.filter(
      (entry) => 'hasPlayground' in entry && entry.hasPlayground === false,
    );

    for (const entry of disabledPlaygrounds) {
      for (const locale of ['en', 'ko', 'ja']) {
        const docs = readFileSync(
          join(homepageRoot, `app/content/${locale}/components/${entry.id}.mdx`),
          'utf8',
        );
        expect(docs).not.toContain('ComponentPlayground');
        expect(docs).not.toContain('Stories.playground');
      }
    }
  });

  it('loads every component stylesheet through its public package path', () => {
    const stylesheet = readText('app/styles/app.css');
    for (const component of componentNames) {
      expect(stylesheet).toContain(`@tinyrack/ui/components/${component}.css`);
    }
  });

  it('uses only defined Tinyrack Tailwind text utilities', () => {
    const invalidAliases = filesUnder(join(homepageRoot, 'app'))
      .filter((path) => /\.(?:mdx|tsx)$/.test(path))
      .flatMap((path) => {
        const source = readFileSync(path, 'utf8');
        return [...source.matchAll(/\btext-tinyrack-(?:base|muted)\b/g)].map(
          ([utility]) => `${path}: ${utility}`,
        );
      });

    expect(invalidAliases).toEqual([]);
  });

  it('publishes one shared Tailwind token reference in every locale', () => {
    expect(
      existsSync(
        join(homepageRoot, 'app/documentation/shared/tailwind-token-catalog.ts'),
      ),
    ).toBe(true);
    expect(
      existsSync(
        join(homepageRoot, 'app/documentation/shared/tailwind-token-reference.tsx'),
      ),
    ).toBe(true);

    for (const locale of ['en', 'ko', 'ja'] as const) {
      const path = `app/content/${locale}/foundations/tailwind.mdx`;
      expect(existsSync(join(homepageRoot, path))).toBe(true);
      const docs = readText(path);
      const overview = readText(`app/content/${locale}/foundations/overview.mdx`);
      expect(docs).toContain('order: 11');
      expect(docs).toContain(
        "import { TailwindTokenReference } from '../../../documentation/shared/tailwind-token-reference.js';",
      );
      expect(docs).toContain(`<TailwindTokenReference locale="${locale}" />`);
      expect(docs.match(/^ {2}- \{ depth:/gm)).toHaveLength(14);
      for (const anchor of [
        'setup',
        'choose-utilities',
        'arbitrary-values',
        'reference',
        'breakpoints',
        'colors',
        'typography',
        'spacing-controls',
        'containers',
        'borders-focus',
        'radius-shadows',
        'motion',
        'visual-state',
        'decoration',
      ]) {
        expect(docs).toContain(`id: ${anchor}`);
      }
      expect(overview).toContain(`href="/${locale}/foundations/tailwind/"`);
      expect(overview).toContain(`href="/${locale}/foundations/breakpoints/"`);
      expect(readText(`app/content/${locale}/foundations/breakpoints.mdx`)).toContain(
        `<BreakpointReference locale="${locale}" />`,
      );
      expect(staticDocumentRoutes).toContainEqual(
        expect.objectContaining({
          id: `${locale}-foundations-tailwind`,
          order: 11,
          path: `/${locale}/foundations/tailwind`,
        }),
      );
      expect(staticDocumentRoutes).toContainEqual(
        expect.objectContaining({
          id: `${locale}-foundations-breakpoints`,
          order: 4,
          path: `/${locale}/foundations/breakpoints`,
        }),
      );
    }

    expect(tailwindTokenBridge).toHaveLength(189);
    expect(tailwindTokenGroups).toHaveLength(10);
    for (const group of tailwindTokenGroups) {
      expect(tailwindTokenBridge.some((entry) => entry.group === group.id)).toBe(true);
    }
  });

  it('keeps the localized Foundations learning path aligned', () => {
    const foundationOrder = [
      'overview',
      'colors',
      'typography',
      'spacing',
      'breakpoints',
      'radius',
      'controls',
      'elevation',
      'motion',
      'logo',
      'app-icons',
      'tailwind',
    ];
    const localizedTitles = {
      en: [
        'Foundations',
        'Colors',
        'Typography',
        'Spacing',
        'Breakpoints',
        'Radius',
        'Controls',
        'Elevation',
        'Motion',
        'Logo',
        'App icons',
        'Tailwind tokens',
      ],
      ko: [
        '기초',
        '색상',
        '타이포그래피',
        '간격',
        '브레이크포인트',
        '모서리 반경',
        '컨트롤',
        '고도',
        '모션',
        '로고',
        '앱 아이콘',
        'Tailwind 토큰',
      ],
      ja: [
        '基礎',
        'カラー',
        'タイポグラフィ',
        'スペーシング',
        'ブレークポイント',
        '角丸',
        'コントロール',
        'エレベーション',
        'モーション',
        'ロゴ',
        'アプリアイコン',
        'Tailwind トークン',
      ],
    } as const;

    for (const locale of ['en', 'ko', 'ja'] as const) {
      const routes = staticDocumentRoutes
        .filter((route) => route.path.startsWith(`/${locale}/foundations`))
        .sort((left, right) => left.order - right.order);

      expect(routes.map((route) => route.path)).toEqual(
        foundationOrder.map((slug) =>
          slug === 'overview'
            ? `/${locale}/foundations`
            : `/${locale}/foundations/${slug}`,
        ),
      );
      expect(routes.map((route) => route.title)).toEqual(localizedTitles[locale]);
      expect(routes.map((route) => route.order)).toEqual(
        foundationOrder.map((_, index) => index),
      );
    }
  });

  it('uses SVG chevrons instead of fallback text glyphs', () => {
    const fallbackChevron = String.fromCodePoint(0x2304);
    const fallbackGlyphFiles = filesUnder(join(homepageRoot, 'app'))
      .filter((path) => /\.(?:mdx|ts|tsx)$/.test(path))
      .filter((path) => readFileSync(path, 'utf8').includes(fallbackChevron));

    expect(fallbackGlyphFiles).toEqual([]);
  });

  it('marks anchor-rendered buttons as non-native buttons', () => {
    const invalidAnchorButtons = filesUnder(join(homepageRoot, 'app'))
      .filter((path) => /\.(?:mdx|tsx)$/.test(path))
      .flatMap((path) => {
        const source = readFileSync(path, 'utf8');
        return [
          ...source.matchAll(/<TRButton\b[^>]*render=\{createElement\('a'[^>]*>/g),
        ]
          .filter(([button]) => !button.includes('nativeButton={false}'))
          .map(() => path);
      });

    expect(invalidAnchorButtons).toEqual([]);
  });

  it('renders one localized WelcomePage contract across all splash routes', () => {
    const welcomePage = readText('app/documentation/shared/welcome-page.tsx');
    const appStyles = readText('app/styles/app.css');

    expect(welcomePage).toContain('<span>TINYRACK</span>');
    expect(welcomePage).toContain('<span>DESIGN SYSTEM</span>');
    expect(welcomePage).toContain('nativeButton={false}');
    expect(welcomePage).toContain('data-welcome-gradient=""');
    expect(welcomePage).toContain('<TRAppShell.Root');
    expect(welcomePage).toContain('mobileSidebar="rail"');
    expect(welcomePage).toContain('<TRAppShell.SidebarLabel>');
    expect(welcomePage).not.toContain('welcome-product-layout');
    expect(welcomePage).not.toContain('<aside className="welcome-product-sidebar">');
    expect(welcomePage).not.toContain('data-welcome-composition=""');
    expect(welcomePage).not.toContain('Product composition');
    expect(welcomePage).not.toContain('System principles');
    expect(welcomePage).not.toContain('content.description');
    expect(welcomePage).toContain('01 / Quick start');
    expect(welcomePage).toContain("title: '프로덕션 개요'");
    expect(welcomePage).toContain("title: '本番環境の概要'");
    expect(welcomePage).toContain('motion-safe:animate-welcome-enter');
    expect(welcomePage).toContain('max-md:grid-cols-[minmax(0,1fr)]');
    expect(welcomePage).not.toContain('welcomeStyles');
    expect(welcomePage).not.toMatch(/className=(?:"|')welcome-/);
    expect(
      existsSync(join(homepageRoot, 'app/documentation/shared/welcome-page.css')),
    ).toBe(false);
    expect(appStyles).not.toContain('@import "../content/shared/welcome-page.css"');
    expect(appStyles).toContain('.tr-mdx:has(> [data-welcome-page])');
    expect(appStyles).toContain('@keyframes welcome-enter');

    for (const locale of ['en', 'ko', 'ja'] as const) {
      const index = readText(`app/content/${locale}/index.tsx`);
      expect(index).toContain("import { DocsPage } from '@tinyrack/docs/runtime';");
      expect(index).toContain("layout: 'splash'");
      expect(index).toContain('navigation: false');
      expect(index).toContain(
        "import { WelcomePage } from '../../documentation/shared/welcome-page.js';",
      );
      expect(index).toContain(`<WelcomePage locale="${locale}" />`);
    }
  });

  it('defines all 231 localized content routes as static route modules', () => {
    const routes = readText('app/routes.ts');
    expect(componentDocsManifest).toHaveLength(61);
    expect(staticDocumentRoutes).toHaveLength(231);
    expect(new Set(staticDocumentRoutes.map((entry) => entry.path)).size).toBe(231);
    expect(new Set(staticDocumentRoutes.map((entry) => entry.sourceFile)).size).toBe(
      231,
    );
    for (const locale of ['en', 'ko', 'ja']) {
      expect(staticDocumentRoutes).toContainEqual(
        expect.objectContaining({
          id: `${locale}-installation`,
          order: 1,
          path: `/${locale}/installation`,
          section: 'start',
          sourceFile: `app/content/${locale}/installation.mdx`,
        }),
      );
    }
    expect(staticDocumentRoutes).toContainEqual(
      expect.objectContaining({
        layout: 'splash',
        navigation: false,
        path: '/en',
        sourceFile: 'app/content/en/index.tsx',
      }),
    );
    expect(staticDocumentRoutes).toContainEqual(
      expect.objectContaining({
        id: 'en-foundations-app-icons',
        path: '/en/foundations/app-icons',
        sidebarLabel: 'App icons',
        title: 'App icons',
      }),
    );
    expect(staticDocumentRoutes).toContainEqual(
      expect.objectContaining({
        id: 'en-foundations-logo',
        path: '/en/foundations/logo',
        sidebarLabel: 'Logo',
        title: 'Logo',
      }),
    );
    const logoIndex = staticDocumentRoutes.findIndex(
      (entry) => entry.id === 'en-foundations-logo',
    );
    expect(staticDocumentRoutes[logoIndex + 1]?.id).toBe('en-foundations-app-icons');
    expect(routes).not.toContain(':slug');
    expect(routes).toContain('createDocsRoutes(config');
    expect(routes).toContain("import.meta.resolve('@tinyrack/docs/react-router')");
    expect(readText('react-router.config.ts')).toContain(
      'createDocsRouterConfig(config)',
    );
    expect(readText('react-router.config.ts')).toContain(
      "import.meta.resolve('@tinyrack/docs/react-router')",
    );
  });

  it('uses page metadata as the single route, navigation, and SEO manifest', () => {
    const contentFiles = filesUnder(join(homepageRoot, 'app/content'));
    const mdxFiles = contentFiles.filter((path) => path.endsWith('.mdx'));
    const tsxPages = contentFiles.filter((path) => path.endsWith('.tsx'));
    const routeFiles = [...mdxFiles, ...tsxPages]
      .map((path) => relative(homepageRoot, path).replaceAll('\\', '/'))
      .sort();
    const manifestFiles = staticDocumentRoutes.map((route) => route.sourceFile).sort();
    const assets = contentFiles
      .filter((path) => !/\.(?:mdx|tsx)$/.test(path))
      .map((path) => relative(homepageRoot, path).replaceAll('\\', '/'));

    expect(mdxFiles).toHaveLength(228);
    expect(tsxPages).toHaveLength(3);
    expect(routeFiles).toEqual(manifestFiles);
    expect(assets).toEqual(['app/content/fixtures/tinyrack-avatar.svg']);
    expect(contentFiles.some((path) => path.endsWith('.ts'))).toBe(false);
    expect(contentFiles.some((path) => path.includes('.demo.'))).toBe(false);
    expect(contentFiles.some((path) => /\.docs\.(?:mdx|tsx)$/.test(path))).toBe(false);
    for (const path of mdxFiles) {
      const source = readFileSync(path, 'utf8');
      expect(source).toMatch(/^---\r?\n/);
      expect(source).toContain('\ntitle:');
      expect(source).toContain('\ndescription:');
      expect(source).toContain('\nsection:');
      expect(source).toContain('\norder:');
      expect(source).not.toMatch(/^# [^#]/m);
      expect(source).not.toContain('export const meta');
    }
    for (const path of tsxPages) {
      const source = readFileSync(path, 'utf8');
      expect(source).toContain('<DocsPage');
      expect(source).toContain('frontmatter={{');
      expect(source).toContain('title:');
      expect(source).toContain('description:');
      expect(source).toContain('section:');
      expect(source).toContain('order:');
      expect(source).not.toContain('export const meta');
    }
    expect(
      staticDocumentRoutes.some((route) => route.sourceFile.endsWith('.demo.tsx')),
    ).toBe(false);

    const documentationRoot = join(homepageRoot, 'app/documentation');
    const documentationFiles = filesUnder(documentationRoot)
      .map((path) => relative(documentationRoot, path).replaceAll('\\', '/'))
      .sort();
    expect(
      documentationFiles.filter((path) => /^components\/[^/]+\.demo\.tsx$/.test(path)),
    ).toHaveLength(61);
    expect(documentationFiles.filter((path) => path.startsWith('shared/'))).toEqual([
      'shared/base-ui-example-sources.ts',
      'shared/breakpoint-reference.tsx',
      'shared/component-docs-manifest.ts',
      'shared/component-example-tabs.tsx',
      'shared/component-install.tsx',
      'shared/demo-locale.ts',
      'shared/tailwind-token-catalog.ts',
      'shared/tailwind-token-reference.tsx',
      'shared/welcome-page.tsx',
    ]);
    expect(
      documentationFiles.filter((path) => path.startsWith('foundations/')),
    ).toEqual(['foundations/motion-demo.css', 'foundations/motion-demo.tsx']);
    expect(documentationFiles).not.toContain('shared/component-token-table.tsx');

    const root = readText('app/root.tsx');
    expect(root).toContain("from '@tinyrack/docs/runtime'");
    expect(root).toContain('default, Layout, links, meta');
    expect(readText('docs.config.ts')).toContain(
      "import.meta.resolve('@tinyrack/docs/config')",
    );
    expect(readText('docs.config.ts')).toContain("url: 'https://design.tinyrack.net'");
    expect(readText('docs.config.ts')).toContain("basePath: '/'");
  });

  it('keeps API prefixes out of authored documentation titles', () => {
    const authoredFiles = filesUnder(join(homepageRoot, 'app/content')).filter((path) =>
      /\.(?:mdx|tsx?)$/.test(path),
    );
    const pollutedTitles = authoredFiles.flatMap((path) => {
      const source = readFileSync(path, 'utf8');
      return [...source.matchAll(/(?:^\s*title:\s*|\btitle=)(['"])(.*?)\1/gm)]
        .filter((match) => /TR[A-Z]/.test(match[2] ?? ''))
        .map((match) => `${path}:${match[2]}`);
    });

    expect(pollutedTitles).toEqual([]);
  });

  it('builds a scoped Pagefind index behind the React documentation search', () => {
    const packageJson = JSON.parse(readText('package.json')) as {
      dependencies: Record<string, string>;
      devDependencies: Record<string, string>;
      scripts: Record<string, string>;
    };
    const root = readText('app/root.tsx');
    const examples = readText('app/documentation/shared/component-example-tabs.tsx');
    const install = readText('app/documentation/shared/component-install.tsx');
    const playground = readText('app/playground/playground.tsx');
    const viteConfig = readText('vite.config.ts');

    expect(packageJson.dependencies['@tinyrack/docs']).toBe('workspace:*');
    expect(packageJson.scripts['dev:app']).toContain(
      'NODE_OPTIONS=--conditions=@tinyrack/source',
    );
    expect(packageJson.scripts['dev']).not.toContain('build');
    expect(packageJson.scripts['dev:app']).not.toContain('build');
    expect(packageJson.scripts['dev:app']).toContain('react-router dev');
    expect(packageJson.scripts['build']).toBe(
      'pnpm typegen && tsc -p tsconfig.build.json --noEmit && tsc -p tsconfig.test.json --noEmit && node scripts/generate-app-icons.ts --check && react-router build',
    );
    expect(
      Object.keys(packageJson.scripts)
        .filter((name) => name === 'test' || name.startsWith('test:'))
        .sort(),
    ).toEqual(['test', 'test:e2e', 'test:unit']);
    expect(
      Object.keys(packageJson.scripts).filter((name) => name.startsWith('check')),
    ).toEqual([]);
    expect(packageJson.scripts['preview']).toBe('vite preview');
    expect(JSON.stringify(packageJson.scripts)).not.toContain('tinyrack-docs');
    expect(viteConfig).toContain("import.meta.resolve('@tinyrack/docs/vite')");
    expect(viteConfig).not.toContain('alias:');
    expect(viteConfig).not.toContain('uiSource');
    expect(root).toContain("from '@tinyrack/docs/runtime'");
    expect(examples).toContain('data-pagefind-ignore="all"');
    expect(install).toContain('data-pagefind-ignore="all"');
    expect(playground).toContain('data-pagefind-ignore="all"');
  });

  it('keeps browser audits state-driven and isolated', () => {
    const packageJson = JSON.parse(readText('package.json')) as {
      scripts: Record<string, string>;
    };
    const browserAuditFiles = [
      'tests/browser-rendering.test.ts',
      'tests/browser-navigation.test.ts',
      'tests/browser-playground.test.ts',
      'tests/browser-overlays.test.ts',
    ];
    const browserAudit = browserAuditFiles.map((path) => readText(path)).join('\n');
    const interactiveAudit = browserAudit.slice(
      browserAudit.indexOf(
        "it('keeps code examples, dialogs, selects, and mobile navigation interactive'",
      ),
      browserAudit.indexOf(
        "it('opens TRContextMenu rack commands from pointer, keyboard, and touch fallback'",
      ),
    );
    const browserAuditFile = ts.createSourceFile(
      'browser-audits.test.ts',
      browserAudit,
      ts.ScriptTarget.Latest,
      true,
    );
    const oneShotVisibilityAssertions: string[] = [];
    const visit = (node: ts.Node): void => {
      if (
        ts.isExpressionStatement(node) &&
        /^await expect\(\s*[\s\S]+?\.isVisible\(\),?\s*\)\.resolves\.toBe\((?:true|false)\);$/.test(
          node.getText(browserAuditFile),
        )
      ) {
        oneShotVisibilityAssertions.push(node.getText(browserAuditFile));
      }
      ts.forEachChild(node, visit);
    };
    visit(browserAuditFile);

    expect(packageJson.scripts).not.toHaveProperty('verify');
    expect(packageJson.scripts['test:e2e']).toBe(
      'pnpm build && vitest run --project e2e && vitest run --project e2e-overlays',
    );
    expect(browserAudit).not.toContain('it.concurrent(');
    expect(browserAudit).not.toContain('waitForTimeout(');
    expect(oneShotVisibilityAssertions).toEqual([]);
    expect(interactiveAudit).not.toContain('await page.goto(');
    expect(interactiveAudit).toContain("reactTab.getAttribute('aria-selected')");
  });

  it('uses design-system primitives for executable and copy-ready UI', () => {
    const disallowedTags = new Set([
      'a',
      'button',
      'code',
      'fieldset',
      'form',
      'input',
      'select',
      'table',
      'textarea',
    ]);
    const violations: string[] = [];
    const inspectTsx = (source: string, label: string) => {
      const file = ts.createSourceFile(
        label,
        source,
        ts.ScriptTarget.Latest,
        true,
        ts.ScriptKind.TSX,
      );
      const visit = (node: ts.Node) => {
        if (
          (ts.isNoSubstitutionTemplateLiteral(node) || ts.isStringLiteral(node)) &&
          node.text.includes('<')
        ) {
          inspectTsx(`<>${node.text}</>`, `${label}#copy-source`);
        }
        if (ts.isJsxOpeningElement(node) || ts.isJsxSelfClosingElement(node)) {
          const tag = node.tagName.getText(file);
          if (disallowedTags.has(tag)) violations.push(`${label}: <${tag}>`);
          for (const attribute of node.attributes.properties) {
            if (
              ts.isJsxAttribute(attribute) &&
              attribute.name.getText(file) === 'className' &&
              attribute.initializer &&
              /overflow-(?:auto|scroll|[xy]-(?:auto|scroll))/.test(
                attribute.initializer.getText(file),
              )
            ) {
              violations.push(`${label}: direct scrollbar`);
            }
          }
        }
        ts.forEachChild(node, visit);
      };
      visit(file);
    };

    const authoredTsx = filesUnder(join(homepageRoot, 'app')).filter((path) =>
      path.endsWith('.tsx'),
    );
    for (const path of authoredTsx) inspectTsx(readFileSync(path, 'utf8'), path);

    const docsFiles = filesUnder(join(homepageRoot, 'app/content')).filter((path) =>
      path.endsWith('.mdx'),
    );
    for (const path of docsFiles) {
      const source = readFileSync(path, 'utf8');
      for (const [index, match] of [
        ...source.matchAll(/String\.raw`([\s\S]*?)`/g),
      ].entries()) {
        inspectTsx(`<>${match[1] ?? ''}</>`, `${path}#source-${index + 1}`);
      }
    }

    expect(violations).toEqual([]);
  });

  it('pins the warning-free React Router v8 framework toolchain', () => {
    const packageJson = JSON.parse(readText('package.json')) as {
      dependencies: Record<string, string>;
      devDependencies: Record<string, string>;
    };
    expect(packageJson.dependencies['react-router']).toBe('8.2.0');
    expect(packageJson.dependencies['@react-router/node']).toBe('8.2.0');
    expect(packageJson.devDependencies['@react-router/dev']).toBe('8.2.0');
    expect(readText('react-router.config.ts')).not.toContain('future:');
  });

  it('loads only IBM Plex Sans Latin, Korean, and Japanese web-font subsets', () => {
    const styles = readText('../docs/dist/styles.css');
    const fontImports = [...styles.matchAll(/@fontsource\/[^'"]+/g)].map(
      ([specifier]) => specifier,
    );
    expect(fontImports).toEqual([
      '@fontsource/ibm-plex-sans/latin-400.css',
      '@fontsource/ibm-plex-sans/latin-500.css',
      '@fontsource/ibm-plex-sans/latin-600.css',
      '@fontsource/ibm-plex-sans/latin-700.css',
      '@fontsource/ibm-plex-sans-kr/korean-400.css',
      '@fontsource/ibm-plex-sans-kr/korean-500.css',
      '@fontsource/ibm-plex-sans-kr/korean-600.css',
      '@fontsource/ibm-plex-sans-kr/korean-700.css',
      '@fontsource/ibm-plex-sans-jp/japanese-400.css',
      '@fontsource/ibm-plex-sans-jp/japanese-500.css',
      '@fontsource/ibm-plex-sans-jp/japanese-600.css',
      '@fontsource/ibm-plex-sans-jp/japanese-700.css',
    ]);

    expect(styles.match(/"IBM Plex Sans KR"/g)).toHaveLength(6);
    expect(styles.match(/"IBM Plex Sans JP"/g)).toHaveLength(6);
    expect(styles).toContain(':root:lang(ja)');
  });

  it('preloads only the current locale IBM Plex Sans subsets in prerendered HTML', () => {
    const expectedPreloads = {
      en: 2,
      ko: 4,
      ja: 4,
    } as const;

    for (const [locale, expectedCount] of Object.entries(expectedPreloads)) {
      const html = readFileSync(
        join(homepageRoot, 'build/client', locale, 'index.html'),
        'utf8',
      );
      const preloads = [
        ...html.matchAll(/<link\s+[^>]*as="font"[^>]*rel="preload"[^>]*>/g),
      ].map(([match]) => match);

      expect(preloads).toHaveLength(expectedCount);
      expect(
        preloads.every(
          (link) =>
            link.includes('crossorigin="anonymous"') &&
            link.includes('type="font/woff2"'),
        ),
      ).toBe(true);
      expect(
        preloads.every((link) => {
          const href = link.match(/href="([^"]+\.woff2)"/)?.[1];
          return (
            href !== undefined && existsSync(join(homepageRoot, 'build/client', href))
          );
        }),
      ).toBe(true);

      if (locale === 'en') {
        expect(html).not.toContain('ibm-plex-sans-kr-korean-');
        expect(html).not.toContain('ibm-plex-sans-jp-japanese-');
      }
      if (locale === 'ko') {
        expect(html).toContain('ibm-plex-sans-kr-korean-');
        expect(html).not.toContain('ibm-plex-sans-jp-japanese-');
      }
      if (locale === 'ja') {
        expect(html).toContain('ibm-plex-sans-jp-japanese-');
        expect(html).not.toContain('ibm-plex-sans-kr-korean-');
      }
    }
  });

  it('uses native documentation routes for foundation cross-links', () => {
    const overview = readText('app/content/en/foundations/overview.mdx');
    expect(overview).not.toContain('/?path=/docs/');
    for (const path of [
      'logo',
      'app-icons',
      'colors',
      'typography',
      'spacing',
      'radius',
      'controls',
      'motion',
      'elevation',
    ]) {
      expect(overview).toContain(`href="/en/foundations/${path}/"`);
    }
  });

  it('keeps audited advanced examples copy-ready and their integration guidance complete', () => {
    const previewCard = readText('app/content/en/components/preview-card.mdx');
    expect(previewCard).toContain('`delay` and `closeDelay`');
    expect(previewCard).toContain('tapping it follows its');

    const radioGroupDocs = readText('app/content/en/components/radio-group.mdx');
    const radioGroupDemo = readText(
      'app/documentation/components/radio-group.demo.tsx',
    );
    expect(radioGroupDocs).toContain('code: Stories.radioGroupStatesSource');
    expect(radioGroupDocs).toContain('code: Stories.radioGroupValidationSource');
    expect(radioGroupDemo).toContain(
      "import { TRRadioGroup } from '@tinyrack/ui/components/radio-group';",
    );
    expect(radioGroupDemo).toContain('export function RequiredRack()');

    const selectDocs = readText('app/content/en/components/select.mdx');
    const selectDemo = readText('app/documentation/components/select.demo.tsx');
    expect(selectDocs).toContain('code: Stories.selectStatesSource');
    expect(selectDemo).toContain(
      "import { TRSelect } from '@tinyrack/ui/components/select';",
    );
    expect(selectDemo).toContain('function AvailabilitySelect({');

    const switchDocs = readText('app/content/en/components/switch.mdx');
    const sharedSources = readText(
      'app/documentation/shared/base-ui-example-sources.ts',
    );
    expect(switchDocs).toContain('code: switchStateComparisonSource');
    expect(sharedSources).toContain('function SwitchStateSample({');
    expect(sharedSources).toContain(
      '<SwitchStateSample checked readOnly title="Read only" />',
    );

    const slider = readText('app/content/en/components/slider.mdx');
    expect(slider).toContain('a single slider accepts a number or one-item array');
    expect(slider).toContain('getAriaValueText');
    expect(slider).toContain('`onValueCommitted`');

    const providers = readText('app/content/en/integrations/base-ui-providers.mdx');
    expect(providers).toContain('createRequestCsp');
    expect(providers).toContain('disableStyleElements');
    expect(providers).toContain('<html dir={direction}');

    const mdx = readText('app/content/en/integrations/mdx-renderer.mdx');
    expect(mdx).toContain("import Content from './content.mdx';");
    expect(mdx).toContain('export function MdxArticle()');
    expect(mdx).toContain('function CustomHeading({ children, ...props }');
    expect(mdx).toContain('### Rendered GFM check');
  });
});
