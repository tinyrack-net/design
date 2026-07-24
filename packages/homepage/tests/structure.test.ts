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

function canonicalDocumentPath(path: string) {
  const pathname = path.split(/[?#]/, 1)[0] ?? path;
  if (pathname === '/') return pathname;
  return pathname.replace(/\/+$/, '');
}

function tailwindThemeCandidates(utility: string) {
  const match = /^(.*)-tinyrack-(.+)$/.exec(utility);
  if (!match) return [];
  const [, prefix = '', name = ''] = match;
  const suffix = `tinyrack-${name}`;

  if (['bg', 'text', 'border'].includes(prefix) || /^border-[trblsexy]$/.test(prefix)) {
    return [`--color-${suffix}`, `--text-${suffix}`, `--border-width-${suffix}`];
  }
  if (prefix === 'font') return [`--font-${suffix}`, `--font-weight-${suffix}`];
  if (prefix === 'leading') return [`--leading-${suffix}`];
  if (prefix === 'tracking') return [`--tracking-${suffix}`];
  if (prefix === 'outline') return [`--outline-width-${suffix}`];
  if (prefix === 'outline-offset') return [`--outline-offset-${suffix}`];
  if (prefix.startsWith('rounded')) return [`--radius-${suffix}`];
  if (prefix === 'shadow') return [`--shadow-${suffix}`];
  if (prefix === 'duration') return [`--transition-duration-${suffix}`];
  if (prefix === 'ease') return [`--ease-${suffix}`];
  if (prefix === 'opacity') return [`--opacity-${suffix}`];
  if (prefix === 'z') return [`--z-index-${suffix}`];
  if (prefix === 'scale') return [`--scale-${suffix}`];
  if (prefix === 'decoration') return [`--text-decoration-thickness-${suffix}`];
  if (prefix === 'underline-offset') return [`--text-underline-offset-${suffix}`];
  if (
    /^(?:gap|space-[xy]|[mp][trblsexy]?|size|[wh]|min-[wh]|max-[wh]|inset(?:-[xy])?|top|right|bottom|left|start|end)$/.test(
      prefix,
    )
  ) {
    return [`--spacing-${suffix}`];
  }
  return [];
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

function demoLiteralControlOptions(path: string) {
  const text = readText(path);
  const source = ts.createSourceFile(
    path,
    text,
    ts.ScriptTarget.Latest,
    true,
    ts.ScriptKind.TSX,
  );
  const literalArrays = new Map<string, string[]>();
  const options = new Map<string, string[]>();

  function literalArray(expression: ts.Expression) {
    let current = expression;
    while (
      ts.isAsExpression(current) ||
      ts.isParenthesizedExpression(current) ||
      ts.isSatisfiesExpression(current)
    ) {
      current = current.expression;
    }
    if (ts.isIdentifier(current)) return literalArrays.get(current.text);
    if (!ts.isArrayLiteralExpression(current)) return undefined;
    const values = current.elements.flatMap((element) => {
      if (ts.isStringLiteralLike(element) || ts.isNumericLiteral(element)) {
        return [element.text];
      }
      if (element.kind === ts.SyntaxKind.TrueKeyword) return ['true'];
      if (element.kind === ts.SyntaxKind.FalseKeyword) return ['false'];
      return [];
    });
    return values.length === current.elements.length ? values : undefined;
  }

  function visit(node: ts.Node) {
    if (
      ts.isVariableDeclaration(node) &&
      ts.isIdentifier(node.name) &&
      node.initializer
    ) {
      const values = literalArray(node.initializer);
      if (values !== undefined) literalArrays.set(node.name.text, values);
    }
    ts.forEachChild(node, visit);
  }

  visit(source);
  for (const statement of source.statements) {
    if (!ts.isVariableStatement(statement)) continue;
    for (const declaration of statement.declarationList.declarations) {
      if (
        !ts.isIdentifier(declaration.name) ||
        declaration.name.text !== 'meta' ||
        !declaration.initializer
      ) {
        continue;
      }
      const meta = objectLiteralFromExpression(declaration.initializer);
      const argTypes = meta?.properties.find(
        (property): property is ts.PropertyAssignment =>
          ts.isPropertyAssignment(property) &&
          ts.isIdentifier(property.name) &&
          property.name.text === 'argTypes',
      );
      const definitions = argTypes
        ? objectLiteralFromExpression(argTypes.initializer)
        : null;
      for (const definition of definitions?.properties ?? []) {
        if (!ts.isPropertyAssignment(definition)) continue;
        const name = ts.isIdentifier(definition.name)
          ? definition.name.text
          : ts.isStringLiteralLike(definition.name)
            ? definition.name.text
            : undefined;
        const config = objectLiteralFromExpression(definition.initializer);
        const optionsProperty = config?.properties.find(
          (property): property is ts.PropertyAssignment =>
            ts.isPropertyAssignment(property) &&
            ts.isIdentifier(property.name) &&
            property.name.text === 'options',
        );
        const values = optionsProperty
          ? literalArray(optionsProperty.initializer)
          : undefined;
        if (name !== undefined && values !== undefined) options.set(name, values);
      }
    }
  }

  return options;
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
  const declaredItemCount = block.match(/data-docs-example-item-count="(\d+)"/)?.[1];
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
          ['핵심 속성', 'Contract'],
          ['主なプロパティ', 'Contract'],
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

  it('shows every literal playground option in migrated examples', () => {
    const demoOnlyControls = new Set(['avatar.imageState', 'progress.format']);
    const demoOnlyOptions = new Set(['alert.role=none']);

    for (const entry of componentDocsManifest) {
      if (!('exampleGroups' in entry) || entry.exampleGroups === undefined) continue;
      const docs = readFileSync(join(homepageRoot, entry.file), 'utf8');
      const usageOffset = docs.indexOf('## Usage');
      const apiOffset = docs.indexOf('## API', usageOffset);
      const examples = docs.slice(usageOffset, apiOffset);
      const demoPath = `app/documentation/components/${entry.id}.demo.tsx`;
      const demo = readText(demoPath);
      const metaOffset = demo.indexOf('const meta =');
      const renderedExamples =
        `${examples}\n${demo.slice(0, metaOffset)}`.toLowerCase();

      for (const [control, values] of demoLiteralControlOptions(demoPath)) {
        if (demoOnlyControls.has(`${entry.id}.${control}`)) continue;
        for (const value of values) {
          const option = `${entry.id}.${control}=${value}`;
          if (demoOnlyOptions.has(option)) continue;
          expect(renderedExamples, option).toContain(value.toLowerCase());
        }
      }
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
        expect(
          group.section === 'usage'
            ? idOffset < examplesOffset
            : idOffset > examplesOffset,
        ).toBe(true);
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
        const install = docs.match(/<ComponentInstall[\s\S]*?\/>/)?.[0] ?? '';

        expect(install, `${locale}/${entry.id}`).toContain(
          "install: 'pnpm add @tinyrack/ui'",
        );
        expect(install, `${locale}/${entry.id}`).toContain(
          `from '@tinyrack/ui/components/${entry.id}';`,
        );
        expect(install, `${locale}/${entry.id}`).not.toContain(
          "import '@tinyrack/ui/core.css';",
        );
        expect(
          install.match(/@tinyrack\/ui\/components\/[a-z0-9-]+\.css/g) ?? [],
          `${locale}/${entry.id}`,
        ).toEqual([`@tinyrack/ui/components/${entry.id}.css`]);
        expect(install, `${locale}/${entry.id}`).toMatch(
          new RegExp(
            `styleImports:\\s*\\[\\s*"@import '@tinyrack/ui/components/${entry.id}\\.css';"`,
          ),
        );
        expect(install, `${locale}/${entry.id}`).toMatch(
          new RegExp(
            `codeImports:\\s*\\[[^\\]]*"import \\{ TR[A-Za-z]+[^\\]]*\\} from '@tinyrack/ui/components/${entry.id}';"`,
          ),
        );
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
      expect(docs).toContain('order: 10');
      expect(docs).toContain(
        "import { TailwindTokenReference } from '../../../documentation/shared/tailwind-token-reference.js';",
      );
      expect(docs).toContain(`<TailwindTokenReference locale="${locale}" />`);
      const requiredHeadingIds = [
        'setup',
        'choose-utilities',
        'practical-example',
        'arbitrary-values',
        'reference',
        ...tailwindTokenGroups.map((group) => group.anchor),
      ];
      expect(docs.match(/^ {2}- \{ depth:/gm)).toHaveLength(requiredHeadingIds.length);
      for (const anchor of requiredHeadingIds) {
        expect(docs).toContain(`id: ${anchor}`);
      }
      expect(overview).toContain(`(/${locale}/foundations/tailwind/)`);
      expect(overview).toContain(`(/${locale}/foundations/breakpoints/)`);
      expect(readText(`app/content/${locale}/foundations/breakpoints.mdx`)).toContain(
        `<BreakpointReference locale="${locale}" />`,
      );
      expect(staticDocumentRoutes).toContainEqual(
        expect.objectContaining({
          id: `${locale}-foundations-tailwind`,
          order: 10,
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

    for (const group of tailwindTokenGroups) {
      expect(tailwindTokenBridge.some((entry) => entry.group === group.id)).toBe(true);
    }
  });

  it('keeps the localized Foundations and Brand learning paths aligned', () => {
    const learningPath = {
      foundations: [
        { contentKey: '/foundations', stem: 'overview' },
        { contentKey: '/foundations/colors', stem: 'colors' },
        { contentKey: '/foundations/typography', stem: 'typography' },
        { contentKey: '/foundations/spacing', stem: 'spacing' },
        { contentKey: '/foundations/breakpoints', stem: 'breakpoints' },
        { contentKey: '/foundations/radius', stem: 'radius' },
        { contentKey: '/foundations/controls', stem: 'controls' },
        { contentKey: '/foundations/elevation', stem: 'elevation' },
        { contentKey: '/foundations/motion', stem: 'motion' },
        { contentKey: '/foundations/accessibility', stem: 'accessibility' },
        { contentKey: '/foundations/tailwind', stem: 'tailwind' },
      ],
      brand: [
        { contentKey: '/foundations/logo', stem: 'logo' },
        { contentKey: '/foundations/app-icons', stem: 'app-icons' },
      ],
    } as const;

    for (const locale of ['en', 'ko', 'ja'] as const) {
      for (const [section, items] of Object.entries(learningPath)) {
        const routes = staticDocumentRoutes
          .filter((route) => route.locale === locale && route.section === section)
          .sort((left, right) => (left.order ?? 0) - (right.order ?? 0));
        expect(
          routes.map(
            ({ contentKey, order, path, section: routeSection, sourceFile }) => ({
              contentKey,
              order,
              path,
              section: routeSection,
              sourceFile,
            }),
          ),
        ).toEqual(
          items.map((item, order) => ({
            contentKey: item.contentKey,
            order,
            path: `/${locale}${item.contentKey}`,
            section,
            sourceFile: `app/content/${locale}/foundations/${item.stem}.mdx`,
          })),
        );
      }
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
    const welcomeCopy = readText('app/documentation/shared/welcome-copy.ts');
    const appStyles = readText('app/styles/app.css');

    expect(welcomePage).toContain("from './welcome-copy.js'");
    expect(welcomeCopy).toContain('satisfies Record<WelcomeLocale, WelcomeCopy>');
    expect(welcomeCopy).toContain("title: ['TINYRACK', 'DESIGN SYSTEM']");
    expect(welcomeCopy).toContain("title: ['TINYRACK', '디자인 시스템']");
    expect(welcomeCopy).toContain("title: ['TINYRACK', 'デザインシステム']");
    expect(welcomeCopy).toContain(
      'Accessible React UI for dashboards and internal tools.',
    );
    expect(welcomeCopy).toContain(
      '대시보드와 사내 도구를 위한 접근성 높은 React UI예요.',
    );
    expect(welcomeCopy).toContain(
      'ダッシュボードや社内ツール向けの、アクセシブルな React UI です。',
    );
    expect(welcomePage).toContain('nativeButton={false}');
    expect(welcomePage).toContain('data-welcome-gradient=""');
    expect(welcomePage).toContain('<TRAppShell.Root');
    expect(welcomePage).toContain('mobileSidebar="rail"');
    expect(welcomePage).toContain('<TRAppShell.SidebarLabel>');
    expect(welcomePage).not.toContain('welcome-product-layout');
    expect(welcomePage).not.toContain('<aside className="welcome-product-sidebar">');
    expect(welcomePage).not.toContain('data-welcome-composition=""');
    expect(welcomePage).not.toContain('Product composition');
    expect(welcomePage).toContain('data-welcome-system=""');
    expect(welcomePage).toContain('data-welcome-components=""');
    expect(welcomePage).toContain('data-welcome-start=""');
    expect(welcomePage).toContain('data-welcome-explore=""');
    expect(welcomePage).toContain('<TRInput');
    expect(welcomePage).toContain('<TRSwitch.Root');
    expect(welcomePage).toContain('<TRTabs.Root');
    expect(welcomePage).toContain('<TRBadge');
    expect(welcomePage).toContain('<TRAlert.Root');
    expect(welcomeCopy).toContain("eyebrow: '01 / System'");
    expect(welcomeCopy).toContain("eyebrow: '01 / 시스템'");
    expect(welcomeCopy).toContain("eyebrow: '01 / システム'");
    expect(welcomePage).toMatch(/href: `\$\{localeRoot\}\/installation\/`/);
    expect(welcomePage).toContain('content.hero.componentCount');
    expect(welcomePage).toContain('aria-label={content.hero.label}');
    expect(welcomePage).toContain("title: '프로덕션 개요'");
    expect(welcomePage).toContain("title: '本番環境の概要'");
    expect(welcomePage).not.toContain('motion-safe:animate-welcome-enter');
    expect(welcomePage).toContain('data-welcome-simulation-running={running');
    expect(welcomePage).toContain(
      'data-welcome-deployment-phase={frame.deploymentPhase}',
    );
    expect(welcomePage).toContain('sampleWelcomeMotion(elapsedMs)');
    expect(welcomePage).not.toContain('data-welcome-simulation-phase');
    expect(welcomePage).not.toContain('SIMULATION_STEP_MS');
    expect(welcomePage).not.toContain('simulationFrames');
    expect(welcomePage).toContain('max-lg:grid-cols-1');
    expect(welcomePage).toContain('max-md:grid-cols-1');
    expect(welcomePage).not.toContain('welcomeStyles');
    expect(welcomePage).not.toMatch(/className=(?:"|')welcome-/);
    expect(
      existsSync(join(homepageRoot, 'app/documentation/shared/welcome-page.css')),
    ).toBe(false);
    expect(appStyles).not.toContain('@import "../content/shared/welcome-page.css"');
    expect(appStyles).toContain('.tr-mdx:has(> [data-welcome-page])');
    expect(appStyles).not.toContain('@keyframes welcome-enter');
    expect(appStyles).toContain('@keyframes welcome-feed-enter');
    expect(appStyles).toContain('@keyframes welcome-throughput-wave');

    for (const locale of ['en', 'ko', 'ja'] as const) {
      const index = readText(`app/content/${locale}/index.tsx`);
      expect(index).toContain("import { DocsPage } from '@tinyrack/docs/runtime';");
      expect(index).toContain("layout: 'splash'");
      expect(index).toContain('navigation: false');
      expect(index).toContain("title: 'Tinyrack Design System'");
      expect(index).toContain(
        "import { WelcomePage } from '../../documentation/shared/welcome-page.js';",
      );
      expect(index).toContain(`<WelcomePage locale="${locale}" />`);
    }
  });

  it('defines all 249 localized content routes as static route modules', () => {
    const routes = readText('app/routes.ts');
    expect(componentDocsManifest).toHaveLength(66);
    expect(staticDocumentRoutes).toHaveLength(255);
    expect(new Set(staticDocumentRoutes.map((entry) => entry.path)).size).toBe(255);
    expect(new Set(staticDocumentRoutes.map((entry) => entry.sourceFile)).size).toBe(
      255,
    );
    expect(new Set(staticDocumentRoutes.map((entry) => entry.contentKey)).size).toBe(
      85,
    );
    const expectedSectionCounts = {
      brand: 2,
      components: 66,
      docs: 1,
      foundations: 11,
      integrations: 3,
      start: 2,
    } as const;
    for (const locale of ['en', 'ko', 'ja']) {
      expect(
        Object.fromEntries(
          Object.keys(expectedSectionCounts).map((section) => [
            section,
            staticDocumentRoutes.filter(
              (route) => route.locale === locale && route.section === section,
            ).length,
          ]),
        ),
      ).toEqual(expectedSectionCounts);
      expect(staticDocumentRoutes).toContainEqual(
        expect.objectContaining({
          id: `${locale}-installation`,
          order: 1,
          path: `/${locale}/installation`,
          section: 'start',
          sourceFile: `app/content/${locale}/installation.mdx`,
        }),
      );
      expect(staticDocumentRoutes).toContainEqual(
        expect.objectContaining({
          contentKey: '/docs',
          id: `${locale}-docs`,
          order: 0,
          path: `/${locale}/docs`,
          section: 'docs',
          sourceFile: `app/content/${locale}/docs.mdx`,
        }),
      );
      for (const [order, slug] of ['csp', 'text-direction', 'mdx'].entries()) {
        expect(staticDocumentRoutes).toContainEqual(
          expect.objectContaining({
            contentKey: `/integrations/${slug}`,
            order,
            path: `/${locale}/integrations/${slug}`,
            section: 'integrations',
            sourceFile: `app/content/${locale}/integrations/${slug}.mdx`,
          }),
        );
      }
      expect(staticDocumentRoutes).not.toContainEqual(
        expect.objectContaining({ path: `/${locale}/integrations/base-ui-providers` }),
      );
      expect(staticDocumentRoutes).not.toContainEqual(
        expect.objectContaining({ path: `/${locale}/integrations/mdx-renderer` }),
      );
    }
    for (const contentKey of new Set(
      staticDocumentRoutes.map((entry) => entry.contentKey),
    )) {
      const siblings = staticDocumentRoutes.filter(
        (entry) => entry.contentKey === contentKey,
      );
      expect(siblings.map((entry) => entry.locale).sort()).toEqual(['en', 'ja', 'ko']);
      expect(new Set(siblings.map((entry) => entry.section)).size).toBe(1);
      expect(new Set(siblings.map((entry) => entry.order)).size).toBe(1);
      expect(new Set(siblings.map((entry) => entry.group)).size).toBe(1);
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
        contentKey: '/foundations/app-icons',
        order: 1,
        path: '/en/foundations/app-icons',
        section: 'brand',
        sidebarLabel: 'App icons',
        title: 'App icons',
      }),
    );
    expect(staticDocumentRoutes).toContainEqual(
      expect.objectContaining({
        id: 'en-foundations-logo',
        contentKey: '/foundations/logo',
        order: 0,
        path: '/en/foundations/logo',
        section: 'brand',
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

  it('keeps the localized Tinyrack Docs guide aligned with public entrypoints', () => {
    const english = readText('app/content/en/docs.mdx');
    const headingCount = [...english.matchAll(/^## /gm)].length;
    const requiredContracts = [
      "from '@tinyrack/docs/config'",
      "from '@tinyrack/docs/react-router'",
      "from '@tinyrack/docs/vite'",
      "from '@tinyrack/docs/runtime'",
      '@import "@tinyrack/docs/styles.css"',
      'pnpm add @tinyrack/docs @tinyrack/ui react react-dom react-router',
      '"build": "react-router build"',
    ];
    const docsPackage = JSON.parse(
      readFileSync(join(homepageRoot, '..', 'docs', 'package.json'), 'utf8'),
    ) as { exports: Record<string, unknown> };

    expect(Object.keys(docsPackage.exports)).toEqual(
      expect.arrayContaining([
        './config',
        './react-router',
        './runtime',
        './vite',
        './styles.css',
      ]),
    );
    for (const locale of ['en', 'ko', 'ja']) {
      const source = readText(`app/content/${locale}/docs.mdx`);
      expect(source).toContain('title: "Tinyrack Docs"');
      expect(source).toContain('section: docs');
      expect(source).toContain('order: 0');
      expect([...source.matchAll(/^## /gm)]).toHaveLength(headingCount);
      for (const contract of requiredContracts) {
        expect(source, `${locale}: ${contract}`).toContain(contract);
      }
    }
  });

  it('keeps locale-invariant route metadata and foundation section depth aligned', () => {
    const locales = ['en', 'ko', 'ja'] as const;
    const localeInvariantShape = (
      route: (typeof staticDocumentRoutes)[number],
      locale: (typeof locales)[number],
    ) => ({
      contentKey: route.contentKey,
      group: route.group,
      layout: route.layout,
      navigation: route.navigation,
      order: route.order,
      section: route.section,
      sourceFile: route.sourceFile.replace(
        `app/content/${locale}/`,
        'app/content/{locale}/',
      ),
    });
    // Unordered pages sort by their localized sidebar label, so the sidebar
    // sequence is locale-specific; only the per-page metadata must match.
    const byContentKey = (shapes: ReturnType<typeof localeInvariantShape>[]) =>
      [...shapes].sort((a, b) => a.contentKey.localeCompare(b.contentKey));
    const englishShape = byContentKey(
      staticDocumentRoutes
        .filter((route) => route.locale === 'en')
        .map((route) => localeInvariantShape(route, 'en')),
    );

    for (const locale of locales) {
      expect(
        byContentKey(
          staticDocumentRoutes
            .filter((route) => route.locale === locale)
            .map((route) => localeInvariantShape(route, locale)),
        ),
      ).toEqual(englishShape);
    }

    for (const contentKey of new Set(
      staticDocumentRoutes
        .filter((route) => ['foundations', 'brand'].includes(route.section))
        .map((route) => route.contentKey),
    )) {
      const siblings = staticDocumentRoutes.filter(
        (route) => route.contentKey === contentKey,
      );
      const englishHeadingDepths = siblings
        .find((route) => route.locale === 'en')
        ?.headings.map(({ depth }) => depth);
      for (const sibling of siblings) {
        expect(
          sibling.headings.map(({ depth }) => depth),
          `${sibling.locale}${contentKey}`,
        ).toEqual(englishHeadingDepths);
      }
    }
  });

  it('groups the components section into alphabetized navigation subgroups', () => {
    const componentsSection = config.sections.find(
      (section) => section.id === 'components',
    );
    const groups = componentsSection?.groups ?? [];
    expect(groups.map((group) => group.id)).toEqual([
      'actions',
      'forms-inputs',
      'selection-controls',
      'navigation',
      'overlays',
      'feedback-status',
      'layout-structure',
      'data-content',
      'docs-site',
    ]);

    const componentRoutes = staticDocumentRoutes.filter(
      (route) => route.locale === 'en' && route.section === 'components',
    );
    expect(componentRoutes).toHaveLength(66);
    for (const route of componentRoutes) {
      expect(route.order, route.sourceFile).toBeUndefined();
      expect(
        groups.some((group) => group.id === route.group),
        route.sourceFile,
      ).toBe(true);
    }
    for (const group of groups) {
      expect(
        componentRoutes.some((route) => route.group === group.id),
        `unused group ${group.id}`,
      ).toBe(true);
    }

    for (const locale of ['en', 'ko', 'ja'] as const) {
      const sectionNav = docsManifest.navigation[locale]?.[3];
      if (sectionNav?.type !== 'group') throw new Error('components nav missing');
      expect(sectionNav.label).toBe(
        { en: 'Components', ko: '컴포넌트', ja: 'コンポーネント' }[locale],
      );
      expect(sectionNav.children.map((child) => child.type)).toEqual(
        Array.from({ length: 9 }, () => 'group'),
      );
      const collator = new Intl.Collator(locale, {
        numeric: true,
        sensitivity: 'base',
      });
      const pageCounts: number[] = [];
      for (const child of sectionNav.children) {
        if (child.type !== 'group') continue;
        const labels = child.children.map((item) =>
          item.type === 'page' ? item.label : '',
        );
        pageCounts.push(labels.length);
        expect([...labels].sort(collator.compare), child.label).toEqual(labels);
      }
      expect(pageCounts).toEqual([6, 8, 8, 8, 7, 6, 7, 7, 9]);
      expect(pageCounts.reduce((sum, count) => sum + count, 0)).toBe(66);
    }
  });

  it('keeps revised entry, foundation, and brand docs on public contracts', () => {
    const revisedRoutes = staticDocumentRoutes.filter((route) =>
      ['start', 'foundations', 'brand'].includes(route.section),
    );
    const authoredPaths = [
      ...revisedRoutes.map((route) => join(homepageRoot, route.sourceFile)),
      join(homepageRoot, 'app/documentation/shared/welcome-page.tsx'),
      join(homepageRoot, 'app/documentation/shared/getting-started-contract.tsx'),
      join(homepageRoot, 'app/documentation/shared/breakpoint-reference.tsx'),
      join(homepageRoot, 'app/documentation/shared/tailwind-token-reference.tsx'),
      ...filesUnder(join(homepageRoot, 'app/documentation/foundations')).filter(
        (path) => /\.tsx?$/.test(path),
      ),
    ];
    const publicTrVariables = new Set(
      [
        ...filesUnder(join(homepageRoot, '..', 'ui', 'src')),
        ...filesUnder(join(homepageRoot, 'app/documentation/foundations')),
      ]
        .filter((path) => path.endsWith('.css'))
        .flatMap((path) =>
          Array.from(
            readFileSync(path, 'utf8').matchAll(/--tr-[a-z0-9-]+/g),
            ([variable]) => variable as string,
          ),
        ),
    );
    const coreCss = readFileSync(
      join(homepageRoot, '..', 'ui', 'src', 'core', 'core.css'),
      'utf8',
    );
    const coreTheme = coreCss.match(/@theme static\s*\{([\s\S]*?)\r?\n\}/)?.[1];
    if (coreTheme === undefined)
      throw new Error('Could not find @theme static in core.css.');
    const publicTailwindThemeVariables = new Set(
      Array.from(
        coreTheme.matchAll(/^\s*(--[a-z0-9-]+):/gm),
        ([, variable]) => variable,
      ),
    );
    const manifestPaths = new Set(staticDocumentRoutes.map((route) => route.path));
    const invalidTrVariables: Array<{ file: string; line: number; text: string }> = [];
    const fakeBreakpoints: Array<{ file: string; line: number; text: string }> = [];
    const deprecatedButtonVariants: Array<{
      file: string;
      line: number;
      text: string;
    }> = [];
    const invalidInternalLinks: Array<{ file: string; line: number; text: string }> =
      [];
    const invalidTailwindUtilities: Array<{
      file: string;
      line: number;
      text: string;
    }> = [];

    for (const path of new Set(authoredPaths)) {
      const source = readFileSync(path, 'utf8');
      const file = relative(homepageRoot, path).replaceAll('\\', '/');
      const collect = (
        pattern: RegExp,
        destination: Array<{ file: string; line: number; text: string }>,
      ) => {
        for (const match of source.matchAll(pattern)) {
          destination.push({
            file,
            line: source.slice(0, match.index).split(/\r?\n/).length,
            text: match[0],
          });
        }
      };

      for (const match of source.matchAll(/--tr-[a-z0-9-]+/g)) {
        if (publicTrVariables.has(match[0])) continue;
        invalidTrVariables.push({
          file,
          line: source.slice(0, match.index).split(/\r?\n/).length,
          text: match[0],
        });
      }
      collect(
        /@custom-media\s+--[a-z0-9-]+|--tinyrack-breakpoint-[a-z0-9-]+(?:-(?:min|max))?|\b(?:xs|sm|md|lg|xl)-at-most\b/g,
        fakeBreakpoints,
      );
      collect(/<TRButton\b[^>]*\bvariant\s*=/g, deprecatedButtonVariants);

      const internalLinkMatches = [
        ...source.matchAll(/\]\((\/(?:en|ko|ja)\/[^)\s]*)\)/g),
        ...source.matchAll(/\bhref\s*=\s*["'](\/(?:en|ko|ja)\/[^"']*)["']/g),
      ];
      for (const match of internalLinkMatches) {
        const href = match[1];
        if (href === undefined || manifestPaths.has(canonicalDocumentPath(href)))
          continue;
        invalidInternalLinks.push({
          file,
          line: source.slice(0, match.index).split(/\r?\n/).length,
          text: href,
        });
      }
      for (const match of source.matchAll(/\$\{localeRoot\}(\/[^`"'{}\s]*)/g)) {
        const suffix = match[1];
        if (suffix === undefined) continue;
        for (const locale of ['en', 'ko', 'ja'] as const) {
          const href = `/${locale}${suffix}`;
          if (manifestPaths.has(canonicalDocumentPath(href))) continue;
          invalidInternalLinks.push({
            file,
            line: source.slice(0, match.index).split(/\r?\n/).length,
            text: href,
          });
        }
      }

      const utilityPattern = /(?<!--)\b[a-z][a-z0-9-]*-tinyrack-[a-z0-9-]+\b/g;
      for (const match of source.matchAll(utilityPattern)) {
        if (
          tailwindThemeCandidates(match[0]).some((candidate) =>
            publicTailwindThemeVariables.has(candidate),
          )
        ) {
          continue;
        }
        invalidTailwindUtilities.push({
          file,
          line: source.slice(0, match.index).split(/\r?\n/).length,
          text: match[0],
        });
      }
    }

    for (const locale of ['en', 'ko', 'ja'] as const) {
      for (const group of tailwindTokenGroups) {
        const href = `/${locale}/foundations/${group.guide}/`;
        if (manifestPaths.has(canonicalDocumentPath(href))) continue;
        invalidInternalLinks.push({
          file: 'app/documentation/shared/tailwind-token-catalog.ts',
          line: 1,
          text: href,
        });
      }
    }

    expect(invalidTrVariables).toEqual([]);
    expect(fakeBreakpoints).toEqual([]);
    expect(deprecatedButtonVariants).toEqual([]);
    expect(invalidInternalLinks).toEqual([]);
    expect(invalidTailwindUtilities).toEqual([]);
  });

  it('uses Korean haeyoche in revised entry, foundation, and brand copy', () => {
    const prohibitedStyle =
      /(?:니다|습니까|십시오)|(?:했음|됐음|있음|없음|않음|였음|이었음|아니었음|(?<![가-힣])(?:함|됨|임|아님))(?=\s*(?:[.!?。"'`<]|$))/gm;
    const paths = [
      ...staticDocumentRoutes
        .filter(
          (route) =>
            route.locale === 'ko' &&
            ['start', 'foundations', 'brand', 'docs'].includes(route.section),
        )
        .map((route) => join(homepageRoot, route.sourceFile)),
      join(homepageRoot, 'app/documentation/shared/welcome-page.tsx'),
      join(homepageRoot, 'app/documentation/shared/getting-started-contract.tsx'),
      ...filesUnder(join(homepageRoot, 'app/documentation/foundations')).filter(
        (path) => /\.tsx?$/.test(path),
      ),
    ];
    const matches = [...new Set(paths)].flatMap((path) => {
      const source = readFileSync(path, 'utf8');
      return Array.from(source.matchAll(prohibitedStyle), (match) => ({
        file: relative(homepageRoot, path).replaceAll('\\', '/'),
        line: source.slice(0, match.index).split(/\r?\n/).length,
        text: match[0],
      }));
    });

    expect(matches).toEqual([]);
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

    expect(mdxFiles).toHaveLength(252);
    expect(tsxPages).toHaveLength(3);
    expect(routeFiles).toEqual(manifestFiles);
    expect(assets).toEqual(['app/content/fixtures/tinyrack-avatar.svg']);
    expect(contentFiles.some((path) => path.endsWith('.ts'))).toBe(false);
    expect(contentFiles.some((path) => path.includes('.demo.'))).toBe(false);
    expect(contentFiles.some((path) => /\.docs\.(?:mdx|tsx)$/.test(path))).toBe(false);
    for (const path of mdxFiles) {
      const source = readFileSync(path, 'utf8');
      const isComponentDoc = /[\\/]components[\\/][^\\/]+\.mdx$/.test(path);
      expect(source).toMatch(/^---\r?\n/);
      expect(source).toContain('\ntitle:');
      expect(source).toContain('\ndescription:');
      expect(source).toContain('\nsection:');
      if (isComponentDoc) {
        expect(source, path).toContain('\ngroup:');
        expect(source, path).not.toContain('\norder:');
      } else {
        expect(source, path).toContain('\norder:');
        expect(source, path).not.toContain('\ngroup:');
      }
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
    ).toHaveLength(66);
    expect(documentationFiles.filter((path) => path.startsWith('shared/'))).toEqual([
      'shared/base-ui-example-sources.ts',
      'shared/breakpoint-reference.tsx',
      'shared/component-docs-manifest.ts',
      'shared/component-example-tabs.tsx',
      'shared/component-install.tsx',
      'shared/demo-locale.ts',
      'shared/getting-started-contract.tsx',
      'shared/tailwind-token-catalog.ts',
      'shared/tailwind-token-reference.tsx',
      'shared/welcome-copy.ts',
      'shared/welcome-motion.ts',
      'shared/welcome-page.tsx',
    ]);
    expect(
      documentationFiles.filter((path) => path.startsWith('foundations/')),
    ).toEqual(['foundations/motion-demo.css', 'foundations/motion-demo.tsx']);
    expect(
      documentationFiles.filter((path) => path.startsWith('integrations/')),
    ).toEqual([
      'integrations/csp.sources.ts',
      'integrations/mdx-component-map.demo.tsx',
      'integrations/mdx-component-map.sources.ts',
      'integrations/mdx-sample.en.mdx',
      'integrations/mdx-sample.ja.mdx',
      'integrations/mdx-sample.ko.mdx',
      'integrations/text-direction.demo.tsx',
    ]);
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
      'tests/browser-integrations.test.ts',
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
      'accessibility',
      'tailwind',
    ]) {
      expect(overview).toContain(`(/en/foundations/${path}/)`);
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

    const csp = readText('app/content/en/integrations/csp.mdx');
    expect(csp).toContain('style-src-elem');
    expect(csp).toContain('disableStyleElements');
    expect(csp).toContain('inline `style` attributes');
    const cspSources = readText('app/documentation/integrations/csp.sources.ts');
    expect(cspSources).toContain('createRequestCsp');
    expect(cspSources).toContain('.base-ui-disable-scrollbar');

    const direction = readText('app/content/en/integrations/text-direction.mdx');
    expect(direction).toContain('lang` identifies the content language');
    expect(direction).toContain('dir` sets native document direction');
    expect(direction).toContain('id="text-direction-demo"');
    expect(direction).toContain('Outside a provider it returns `ltr`');

    const mdx = readText('app/content/en/integrations/mdx.mdx');
    expect(mdx).toContain('id="mdx-component-map-demo"');
    const mdxSources = readText(
      'app/documentation/integrations/mdx-component-map.sources.ts',
    );
    expect(mdxSources).toContain("import Content from './content.mdx';");
    expect(mdxSources).toContain('export function MdxArticle()');
    expect(mdxSources).toContain('<Content components={tinyrackMdxComponents} />');
    expect(mdxSources).toContain("ComponentPropsWithoutRef<'article'>");
    expect(mdxSources).not.toContain('@mdx-js/react');
    expect(mdxSources).not.toContain('providerImportSource');
  });
});
