import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs';
import { join } from 'node:path';
import { loadDocsManifest } from '@tinyrack/docs/config';
import ts from 'typescript';
import { describe, expect, it } from 'vitest';
import { componentNames } from '../../ui/scripts/component-catalog.js';
import { componentDocsManifest } from '../app/content/shared/component-docs-manifest.js';
import config from '../docs.config.js';

const homepageRoot = process.cwd();
const workspaceRoot = join(homepageRoot, '../..');
const docsManifest = loadDocsManifest(config, { root: homepageRoot });
const staticDocumentRoutes = docsManifest.pages;

function readText(path: string) {
  const resolved = join(homepageRoot, path);
  if (existsSync(resolved)) return readFileSync(resolved, 'utf8');
  return readFileSync(
    join(homepageRoot, path.replace('app/content/', 'app/content/en/')),
    'utf8',
  );
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
    expect(componentDocsManifest).toHaveLength(componentNames.length);
    expect(new Set(componentDocsManifest.map((entry) => entry.id)).size).toBe(
      componentNames.length,
    );
    expect(componentDocsManifest.map((entry) => entry.id).sort()).toEqual(
      [...componentNames].sort(),
    );

    for (const entry of componentDocsManifest) {
      expect(existsSync(join(homepageRoot, entry.file))).toBe(true);
      expect(
        existsSync(join(homepageRoot, `app/content/components/${entry.id}.demo.tsx`)),
      ).toBe(true);
    }
  });

  it.each(
    componentDocsManifest,
  )('$title keeps the required page sections, examples, and controls', (entry) => {
    const docs = readText(entry.file);
    const demo = readText(`app/content/components/${entry.id}.demo.tsx`);
    const sections = ['Contract', 'Install', 'Usage', 'Examples', 'API'];
    const hasPlayground = !('hasPlayground' in entry) || entry.hasPlayground !== false;
    if (hasPlayground) sections.splice(2, 0, 'Playground');
    const sectionOffsets = sections.map((section) => docs.indexOf(`## ${section}`));

    expect(sectionOffsets.every((offset) => offset >= 0)).toBe(true);
    expect(sectionOffsets).toEqual([...sectionOffsets].sort((a, b) => a - b));
    if (hasPlayground) {
      expect(docs).toContain('ComponentPlayground');
      expect(docs).toContain('definition={Stories.playground}');
      expect(demo).toContain('definePlayground(meta)');
    }
    expect(docs).toContain(`@tinyrack/ui/components/${entry.id}`);
    expect(docs).toContain(`@tinyrack/ui/components/${entry.id}.css`);
    expect(demo).toContain(`@tinyrack/ui/components/${entry.id}`);

    for (const control of entry.requiredControls) {
      expect(demo).toContain(`${control}: {`);
    }
    for (const example of entry.requiredExamples) {
      expect(docs).toContain(`id="${example}"`);
    }
  });

  it('loads every component stylesheet through its public package path', () => {
    const stylesheet = readText('app/styles/app.css');
    for (const component of componentNames) {
      expect(stylesheet).toContain(`@tinyrack/ui/components/${component}.css`);
    }
  });

  it('uses SVG chevrons instead of fallback text glyphs', () => {
    const fallbackChevron = String.fromCodePoint(0x2304);
    const fallbackGlyphFiles = filesUnder(join(homepageRoot, 'app'))
      .filter((path) => /\.(?:mdx|ts|tsx)$/.test(path))
      .filter((path) => readFileSync(path, 'utf8').includes(fallbackChevron));

    expect(fallbackGlyphFiles).toEqual([]);
  });

  it('contains no removed documentation runtime residue', () => {
    const removedRuntimeName = ['story', 'book'].join('');
    const removedRuntimePattern = new RegExp(removedRuntimeName, 'i');
    expect(existsSync(join(workspaceRoot, `.${removedRuntimeName}`))).toBe(false);

    const authoredFiles = filesUnder(workspaceRoot).filter(
      (path) => !path.endsWith('pnpm-lock.yaml'),
    );
    const legacyDemoSuffix = ['.stori', 'es.tsx'].join('');
    const legacyFiles = authoredFiles.filter(
      (path) => path.endsWith(legacyDemoSuffix) || removedRuntimePattern.test(path),
    );
    expect(legacyFiles).toEqual([]);

    const legacySources = authoredFiles
      .filter((path) => /\.(?:json|md|mdx|ts|tsx|ya?ml)$/.test(path))
      .filter((path) => removedRuntimePattern.test(readFileSync(path, 'utf8')));
    expect(legacySources).toEqual([]);
  });

  it('defines all 222 localized content routes as static route modules', () => {
    const routes = readText('app/routes.ts');
    expect(componentDocsManifest).toHaveLength(61);
    expect(staticDocumentRoutes).toHaveLength(222);
    expect(new Set(staticDocumentRoutes.map((entry) => entry.path)).size).toBe(222);
    expect(new Set(staticDocumentRoutes.map((entry) => entry.sourceFile)).size).toBe(
      222,
    );
    expect(staticDocumentRoutes).toContainEqual(
      expect.objectContaining({
        layout: 'splash',
        navigation: false,
        path: '/en',
        sourceFile: 'app/content/en/index.mdx',
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

  it('uses frontmatter as the single route, navigation, and SEO manifest', () => {
    const docsFiles = filesUnder(join(homepageRoot, 'app/content')).filter((path) =>
      path.endsWith('.mdx'),
    );
    expect(docsFiles).toHaveLength(staticDocumentRoutes.length);
    for (const path of docsFiles) {
      const source = readFileSync(path, 'utf8');
      expect(source).toMatch(/^---\r?\n/);
      expect(source).toContain('\ntitle:');
      expect(source).toContain('\ndescription:');
      expect(source).toContain('\nsection:');
      expect(source).toContain('\norder:');
      expect(source).not.toMatch(/^# [^#]/m);
      expect(source).not.toContain('export const meta');
    }

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
    const examples = readText('app/content/shared/component-example-tabs.tsx');
    const install = readText('app/content/shared/component-install.tsx');
    const playground = readText('app/playground/playground.tsx');
    const viteConfig = readText('vite.config.ts');

    expect(packageJson.dependencies['@tinyrack/docs']).toBe('workspace:*');
    expect(packageJson.scripts['dev']).toContain(
      'NODE_OPTIONS=--conditions=@tinyrack/source',
    );
    const verifySteps = packageJson.scripts['verify:static']?.split(' && ') ?? [];
    expect(verifySteps.indexOf('pnpm build')).toBeLessThan(
      verifySteps.indexOf('pnpm check:structure'),
    );
    expect(packageJson.scripts['dev']).not.toContain('build');
    expect(packageJson.scripts['build:app']).toContain('tinyrack-docs build');
    expect(packageJson.scripts['preview:search']).toContain('tinyrack-docs preview');
    expect(viteConfig).toContain("import.meta.resolve('@tinyrack/docs/vite')");
    expect(viteConfig).not.toContain('alias:');
    expect(viteConfig).not.toContain('uiSource');
    expect(root).toContain("from '@tinyrack/docs/runtime'");
    expect(examples).toContain('data-pagefind-ignore="all"');
    expect(install).toContain('data-pagefind-ignore="all"');
    expect(playground).toContain('data-pagefind-ignore="all"');
  });

  it('keeps browser audits state-driven and preserves first CI failures', () => {
    const packageJson = JSON.parse(readText('package.json')) as {
      scripts: Record<string, string>;
    };
    const browserAudit = readText('tests/browser.test.ts');
    const workflow = readFileSync(
      join(workspaceRoot, '.github/workflows/ci.yml'),
      'utf8',
    );
    const browserAuditFile = ts.createSourceFile(
      'browser.test.ts',
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

    expect(packageJson.scripts['verify:static']).toBe(
      'pnpm check:types && pnpm check:app-icons && pnpm build && pnpm check:structure',
    );
    expect(packageJson.scripts['verify']).toBe('pnpm verify:static && pnpm test:audit');
    expect(browserAudit).not.toContain('it.concurrent(');
    expect(browserAudit).not.toContain('waitForTimeout(');
    expect(oneShotVisibilityAssertions).toEqual([]);
    expect(workflow).toContain('id: ui-firefox-test');
    expect(workflow).toContain("if: steps.ui-firefox-test.outcome == 'failure'");
    expect(workflow).toContain('name: Preserve UI Firefox first failure');
    expect(workflow).toContain('id: homepage-audit');
    expect(workflow).toContain("if: steps.homepage-audit.outcome == 'failure'");
    expect(workflow).toContain('name: Preserve homepage audit first failure');
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
    const styles = readText('../docs/src/styles/styles.css');
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

    const cjkFonts = readText('../docs/src/styles/fonts.css');
    expect(cjkFonts.match(/ibm-plex-sans-kr-korean-/g)).toHaveLength(4);
    expect(cjkFonts.match(/ibm-plex-sans-jp-japanese-/g)).toHaveLength(4);
    expect(cjkFonts.match(/font-family: "IBM Plex Sans"/g)).toHaveLength(8);
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
    const previewCard = readText('app/content/en/components/preview-card.docs.mdx');
    expect(previewCard).toContain('`delay` and `closeDelay`');
    expect(previewCard).toContain('tapping it follows its');

    const radioGroupDocs = readText('app/content/en/components/radio-group.docs.mdx');
    const radioGroupDemo = readText('app/content/components/radio-group.demo.tsx');
    expect(radioGroupDocs).toContain('code: Stories.radioGroupStatesSource');
    expect(radioGroupDocs).toContain('code: Stories.radioGroupValidationSource');
    expect(radioGroupDemo).toContain(
      "import { TRRadioGroup } from '@tinyrack/ui/components/radio-group';",
    );
    expect(radioGroupDemo).toContain('export function RequiredRack()');

    const selectDocs = readText('app/content/en/components/select.docs.mdx');
    const selectDemo = readText('app/content/components/select.demo.tsx');
    expect(selectDocs).toContain('code: Stories.selectStatesSource');
    expect(selectDemo).toContain(
      "import { TRSelect } from '@tinyrack/ui/components/select';",
    );
    expect(selectDemo).toContain('function AvailabilitySelect({');

    const switchDocs = readText('app/content/en/components/switch.docs.mdx');
    const sharedSources = readText('app/content/shared/base-ui-example-sources.ts');
    expect(switchDocs).toContain('code: switchStateComparisonSource');
    expect(sharedSources).toContain('function SwitchStateSample({');
    expect(sharedSources).toContain(
      '<SwitchStateSample checked readOnly title="Read only" />',
    );

    const slider = readText('app/content/en/components/slider.docs.mdx');
    expect(slider).toContain('a single slider accepts a number or one-item array');
    expect(slider).toContain('getAriaValueText');
    expect(slider).toContain('`onValueCommitted`');

    const providers = readText(
      'app/content/en/integrations/base-ui-providers.docs.mdx',
    );
    expect(providers).toContain('createRequestCsp');
    expect(providers).toContain('disableStyleElements');
    expect(providers).toContain('<html dir={direction}');

    const mdx = readText('app/content/en/integrations/mdx-renderer.docs.mdx');
    expect(mdx).toContain("import Content from './content.mdx';");
    expect(mdx).toContain('export function MdxArticle()');
    expect(mdx).toContain('function CustomHeading({ children, ...props }');
    expect(mdx).toContain('### Rendered GFM check');
  });
});
