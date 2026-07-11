import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs';
import { join, relative } from 'node:path';
import ts from 'typescript';
import { describe, expect, it } from 'vitest';
import {
  componentDocCapabilities,
  componentDocsManifest,
} from '../stories/shared/component-docs-manifest.js';

const repoRoot = process.cwd();
const allowedPreviewImports = [
  '@import "tailwindcss";',
  '@import "../src/core/core.css";',
  '@import "../src/components/accordion/accordion.css";',
  '@import "../src/components/alert/alert.css";',
  '@import "../src/components/avatar/avatar.css";',
  '@import "../src/components/badge/badge.css";',
  '@import "../src/components/button/button.css";',
  '@import "../src/components/combobox/combobox.css";',
  '@import "../src/components/card/card.css";',
  '@import "../src/components/code-block/code-block.css";',
  '@import "../src/components/code/code.css";',
  '@import "../src/components/divider/divider.css";',
  '@import "../src/components/disclosure/disclosure.css";',
  '@import "../src/components/form/form.css";',
  '@import "../src/components/link/link.css";',
  '@import "../src/components/menu/menu.css";',
  '@import "../src/components/overlay/overlay.css";',
  '@import "../src/components/pin-input/pin-input.css";',
  '@import "../src/mdx/mdx.css";',
  '@import "../src/components/progress/progress.css";',
  '@import "../src/components/skeleton/skeleton.css";',
  '@import "../src/components/spinner/spinner.css";',
  '@import "../src/components/table/table.css";',
  '@import "../src/components/tabs/tabs.css";',
  '@import "../src/components/toast/toast.css";',
  '@import "../src/components/tooltip/tooltip.css";',
];

function readText(path: string) {
  return readFileSync(join(repoRoot, path), 'utf8');
}

function collectFiles(path: string): string[] {
  const absolutePath = join(repoRoot, path);

  return readdirSync(absolutePath).flatMap((entry) => {
    const entryPath = join(absolutePath, entry);
    const relativePath = relative(repoRoot, entryPath).replaceAll('\\', '/');

    return statSync(entryPath).isDirectory()
      ? collectFiles(relativePath)
      : [relativePath];
  });
}

function formatTsConfigErrors(errors: ts.Diagnostic[]) {
  return errors
    .map((error) => ts.flattenDiagnosticMessageText(error.messageText, '\n'))
    .join('\n');
}

function collectTypeCheckedFiles(tsconfigPath: string) {
  const absoluteTsconfigPath = join(repoRoot, tsconfigPath);
  const configFile = ts.readConfigFile(absoluteTsconfigPath, ts.sys.readFile);

  if (configFile.error) {
    throw new Error(formatTsConfigErrors([configFile.error]));
  }

  const parsedConfig = ts.parseJsonConfigFileContent(
    configFile.config,
    ts.sys,
    repoRoot,
    undefined,
    absoluteTsconfigPath,
  );

  if (parsedConfig.errors.length > 0) {
    throw new Error(formatTsConfigErrors(parsedConfig.errors));
  }

  return parsedConfig.fileNames
    .map((fileName) => relative(repoRoot, fileName).replaceAll('\\', '/'))
    .sort();
}

function stripMarkdownCodeFences(source: string) {
  return source.replace(/```[\s\S]*?```/g, '');
}

function stripMdxExampleSourceStrings(source: string) {
  return source.replace(/String\.raw`[\s\S]*?`/g, '');
}

function expectSnippetsInOrder(source: string, snippets: string[]) {
  let previousIndex = -1;

  for (const snippet of snippets) {
    const index = source.indexOf(snippet);

    expect(index, `Expected to find ${snippet}`).toBeGreaterThan(previousIndex);
    previousIndex = index;
  }
}

const componentDocsFiles = componentDocsManifest.map(({ file }) => file);

const standardComponentDocSections = [
  '## Contract',
  '## Install',
  '## Usage',
  '## Examples',
  '## Guidance',
  '## API',
] as const;

const storybookFontWeights = ['400', '500', '600', '700'] as const;
const remoteFontUrlPattern = /fonts\.(gstatic|googleapis)\.com|https:\/\/fonts/;

describe('Storybook structure', () => {
  it('keeps Storybook TypeScript files covered by the root typecheck', () => {
    const tsconfig = JSON.parse(readText('tsconfig.json')) as { include?: string[] };

    expect(tsconfig.include).toEqual(
      expect.arrayContaining(['.storybook/**/*.ts', '.storybook/**/*.tsx']),
    );
    expect(collectTypeCheckedFiles('tsconfig.json')).toEqual(
      expect.arrayContaining([
        '.storybook/main.ts',
        '.storybook/manager.ts',
        '.storybook/preview.tsx',
        '.storybook/tinyrack-docs-container.tsx',
      ]),
    );
  });

  it('keeps the Storybook preview bound to the allowed Tinyrack CSS imports', () => {
    const mainSource = readText('.storybook/main.ts');
    const previewSource = readText('.storybook/preview.tsx');
    const docsContainerSource = readText('.storybook/tinyrack-docs-container.tsx');
    const mdxComponentsSource = readText('src/mdx/react.tsx');
    const reactMdxComponentsSource = collectFiles('src/mdx/react-components')
      .filter((file) => /\.(ts|tsx)$/.test(file))
      .sort()
      .map(readText)
      .join('\n');
    const mdxSharedSource = readText('src/mdx/shared.ts');
    const astroMdxSource = readText('src/mdx/astro.ts');
    const mdxCss = readText('src/mdx/mdx.css');
    const previewCss = readText('.storybook/preview.css');
    const fontsCss = readText('.storybook/fonts.css');
    const packageSource = readText('package.json');
    const previewImports = previewCss
      .split('\n')
      .map((line) => line.trim())
      .filter((line) => line.startsWith('@import'));
    const previewCssImportIndex = previewSource.indexOf("import './preview.css';");
    const fontsCssImportIndex = previewSource.indexOf("import './fonts.css';");

    expect(mainSource).toContain("'../stories/**/*.mdx'");
    expect(mainSource).toContain("'../stories/**/*.stories.@(ts|tsx)'");
    expect(mainSource).toContain('backgrounds: false');
    expect(mainSource).toContain("import remarkGfm from 'remark-gfm';");
    expect(mainSource).toContain("name: '@storybook/addon-docs'");
    expect(mainSource).toContain('remarkPlugins: [remarkGfm]');
    expect(mainSource).toContain("'@storybook/addon-themes'");
    expect(previewSource).toContain("from '@storybook/addon-themes'");
    expect(previewSource).toContain('DecoratorHelpers.pluckThemeFromContext');
    expect(previewSource).toContain('withThemeByDataAttribute({');
    expect(previewSource).toContain(
      "const defaultTinyrackTheme: TinyrackTheme = 'tinyrack-dark';",
    );
    expect(previewSource).toContain('defaultTheme: defaultTinyrackTheme');
    expect(previewSource).toContain("attributeName: 'data-theme'");
    expect(previewSource).toContain("'tinyrack-light': 'tinyrack-light'");
    expect(previewSource).toContain("'tinyrack-dark': 'tinyrack-dark'");
    expect(previewSource).toContain('syncTinyrackDocumentTheme(theme)');
    expect(previewSource).toContain(
      "document.documentElement.setAttribute('data-theme'",
    );
    expect(previewSource).toContain("document.body.setAttribute('data-theme'");
    expect(previewSource).toContain('resolveTinyrackThemeFromLocation');
    expect(previewSource).toContain("searchParams.get('globals')");
    expect(previewSource).toContain('theme: themes.dark');
    expect(previewSource).toContain("context.title.startsWith('Components/')");
    expect(previewSource).toContain('!isDocs && isComponentStory');
    expect(previewSource).toContain("from './tinyrack-docs-container.js';");
    expect(previewSource).toContain('storybookTinyrackMdxComponents');
    expect(previewSource).toContain('TinyrackDocsContainer');
    expect(previewSource).not.toContain(
      "import { tinyrackMdxComponents } from '../src/mdx/react.js';",
    );
    expect(previewSource).not.toContain('./tinyrack-mdx-components.js');
    expect(previewSource).toContain('container: TinyrackDocsContainer');
    expect(previewSource).toContain('components: storybookTinyrackMdxComponents');
    expect(docsContainerSource).toContain("from '@mdx-js/react'");
    expect(docsContainerSource).toContain("from '../src/mdx/react.js'");
    expect(docsContainerSource).toContain(
      "from '../src/mdx/react-components/Wrapper.js'",
    );
    expect(docsContainerSource).toContain("from '../src/mdx/shared.js'");
    expect(docsContainerSource).toContain('MDXProvider');
    expect(docsContainerSource).toContain('DocsContainer');
    expect(docsContainerSource).toContain('createTinyrackMdxComponents');
    expect(docsContainerSource).toContain('StorybookTinyrackMdxWrapper');
    expect(docsContainerSource).toContain("'sb-unstyled'");
    expect(docsContainerSource).toContain(
      'components={storybookTinyrackMdxComponents}',
    );
    expect(mdxComponentsSource).toContain('./react-components/Code.js');
    expect(mdxComponentsSource).toContain('./react-components/Input.js');
    expect(mdxComponentsSource).toContain('./react-components/Table.js');
    expect(reactMdxComponentsSource).toContain('CodeBlock');
    expect(reactMdxComponentsSource).toContain('Code');
    expect(reactMdxComponentsSource).toContain('CodeBlock');
    expect(reactMdxComponentsSource).toContain('Link');
    expect(reactMdxComponentsSource).toContain('Checkbox');
    expect(reactMdxComponentsSource).toContain('TableContainer');
    expect(reactMdxComponentsSource).toContain('density="normal"');
    expect(reactMdxComponentsSource).toContain('tr-mdx-table-container');
    expect(reactMdxComponentsSource).toContain('tr-mdx-table');
    expect(reactMdxComponentsSource).toContain('tr-mdx-code-block');
    expect(reactMdxComponentsSource).toContain('textFromReactNode');
    expect(reactMdxComponentsSource).toContain('languageFromClassName');
    expect(mdxSharedSource).toContain('language-');
    expect(mdxComponentsSource).toContain('createTinyrackMdxComponents');
    expect(mdxComponentsSource).toContain('wrapper: TinyrackMdxWrapper');
    expect(mdxComponentsSource).not.toContain('sb-unstyled');
    expect(mdxComponentsSource).toContain('pre: TinyrackMdxPre');
    expect(mdxComponentsSource).toContain('code: TinyrackMdxCode');
    expect(mdxComponentsSource).toContain('table: TinyrackMdxTable');
    expect(mdxComponentsSource).toContain('h4: TinyrackMdxH4');
    expect(mdxComponentsSource).toContain('h5: TinyrackMdxH5');
    expect(mdxComponentsSource).toContain('h6: TinyrackMdxH6');
    expect(mdxComponentsSource).toContain('del: TinyrackMdxDel');
    expect(mdxComponentsSource).toContain('input: TinyrackMdxInput');
    expect(mdxComponentsSource).toContain('section: TinyrackMdxSection');
    expect(mdxComponentsSource).toContain('sup: TinyrackMdxSup');
    expect(astroMdxSource).toContain('tinyrackAstroMdxComponents');
    expect(astroMdxSource).toContain('./astro-components/Code.astro');
    expect(astroMdxSource).toContain('./astro-components/Input.astro');
    expect(astroMdxSource).toContain('./astro-components/Section.astro');
    expect(astroMdxSource).toContain('TinyrackAstroMdxComponentKey');
    expect(astroMdxSource).toContain('TinyrackAstroMdxComponents');
    expect(astroMdxSource).toContain('satisfies TinyrackAstroMdxComponents');
    expect(astroMdxSource).not.toContain('Record<string, unknown>');
    expect(astroMdxSource).toContain('code: Code');
    expect(astroMdxSource).toContain('table: Table');
    expect(astroMdxSource).toContain('h6: Heading6');
    expect(astroMdxSource).toContain('del: Delete');
    expect(astroMdxSource).toContain('input: Input');
    expect(astroMdxSource).toContain('td: TableCell');
    expect(mdxCss).toContain('.tr-mdx');
    expect(mdxCss).toContain('.tr-mdx-h1');
    expect(mdxCss).toContain('.tr-mdx-h6');
    expect(mdxCss).toContain('.tr-mdx-blockquote');
    expect(mdxCss).toContain('.tr-mdx-task-list');
    expect(mdxCss).toContain('.tr-mdx-code-block');
    expect(mdxCss).toContain('.tr-mdx-table-container');
    expect(mdxCss).toContain('.tr-mdx-table');
    expect(mdxCss).toContain('.tr-mdx-footnotes');
    expect(fontsCssImportIndex).toBeGreaterThanOrEqual(0);
    expect(fontsCssImportIndex).toBeLessThan(previewCssImportIndex);
    for (const fontWeight of storybookFontWeights) {
      const fontsourceImport = `import '@fontsource/ibm-plex-sans/${fontWeight}.css';`;

      expect(previewSource).toContain(fontsourceImport);
      expect(previewSource.indexOf(fontsourceImport)).toBeLessThan(
        previewCssImportIndex,
      );
      expect(fontsCss).toContain(`ibm-plex-sans-kr-korean-${fontWeight}-normal.woff2`);
      expect(fontsCss).toContain(
        `ibm-plex-sans-jp-japanese-${fontWeight}-normal.woff2`,
      );
    }
    expect(packageSource).toContain('"@fontsource/ibm-plex-sans":');
    expect(packageSource).toContain('"@fontsource/ibm-plex-sans-kr":');
    expect(packageSource).toContain('"@fontsource/ibm-plex-sans-jp":');
    expect(packageSource).toContain('"@mdx-js/react":');
    expect(packageSource).toContain('"check:astro":');
    expect(packageSource).toContain('"@astrojs/check":');
    expect(packageSource).toContain('"@astrojs/mdx":');
    expect(packageSource).toContain('"@astrojs/ts-plugin":');
    expect(packageSource).toContain('"astro":');
    expect(fontsCss).toContain('font-family: "IBM Plex Sans";');
    expect(fontsCss).toContain('unicode-range: U+1100-11FF, U+3130-318F, U+AC00-D7AF;');
    expect(fontsCss).toContain(
      'unicode-range: U+3000-303F, U+3040-30FF, U+4E00-9FFF, U+FF00-FFEF;',
    );
    expect(fontsCss).not.toContain('IBM Plex Sans KR');
    expect(fontsCss).not.toContain('IBM Plex Sans JP');
    expect(previewCss).not.toContain('@font-face');
    expect(`${previewSource}\n${previewCss}\n${fontsCss}`).not.toMatch(
      remoteFontUrlPattern,
    );
    expect(previewSource).not.toContain('globalTypes');
    expect(previewSource).not.toContain('document.documentElement.dataset');
    expect(previewSource).not.toContain('data-theme={theme}');
    expect(previewSource).not.toContain('MantineProvider');
    expect(previewSource).not.toContain('daisyUI/');
    expect(previewSource).not.toContain('Mantine/');
    expect(previewImports).toEqual(allowedPreviewImports);
    expect(previewCss).toContain(':root[data-theme="tinyrack-light"]');
    expect(previewCss).toContain(':root[data-theme="tinyrack-dark"]');
    expect(previewCss).toContain('body[data-theme] .sbdocs.sbdocs-wrapper,');
    expect(previewCss).toContain('body[data-theme] .sbdocs.sbdocs-content {');
    expect(previewCss).toContain('padding: 0;');
    expect(previewCss).toContain('background: var(--tinyrack-surface);');
    expect(previewCss).not.toContain('.tr-doc-');
    expect(previewCss).not.toContain('.docs-story');
    expect(previewCss).not.toContain('--tinyrack-storybook-preview-');
    expect(previewCss).not.toContain('body[data-theme] .sbdocs-content h1');
    expect(previewCss).not.toContain('body[data-theme] .sbdocs-content h2');
    expect(previewCss).not.toContain('body[data-theme] .sbdocs-content h3');
    expect(previewCss).not.toContain('body[data-theme] .sbdocs-content p');
    expect(previewCss).not.toContain('body[data-theme] .sbdocs-content li');
    expect(previewCss).not.toContain('body[data-theme] .sbdocs-content code');
    expect(previewCss).not.toContain('body[data-theme] .sbdocs-content pre');
    expect(previewCss).not.toContain('body[data-theme] .sbdocs-content table');
    expect(previewCss).not.toContain('body[data-theme] .sbdocs-content th');
    expect(previewCss).not.toContain('body[data-theme] .sbdocs-content td');
    expect(previewCss).not.toContain('body[data-theme] .sbdocs-content hr');
    expect(previewCss).not.toContain('@import "../src/integrations/styles.css";');
    expect(previewCss).not.toContain('@plugin "daisyui"');
    expect(previewCss).not.toContain('@mantine');
    expect(existsSync(join(repoRoot, '.storybook/tinyrack-mdx-components.tsx'))).toBe(
      false,
    );
  });

  it('keeps the Astro MDX adapter covered by a real Astro typecheck fixture', () => {
    const packageSource = readText('package.json');
    const astroConfig = readText('astro.config.mjs');
    const astroTsconfig = readText('tsconfig.astro.json');
    const astroPage = readText('e2e/fixtures/astro-mdx/src/pages/index.astro');
    const astroFixtureMdx = readText('e2e/fixtures/astro-mdx/src/content/sample.mdx');
    const astroShim = readText('src/astro.d.ts');
    const astroProps = readText('src/mdx/astro-components/props.ts');

    expect(packageSource).toContain(
      '"check:astro": "astro check --root . --tsconfig tsconfig.astro.json"',
    );
    expect(packageSource).toContain('pnpm check:astro');
    expect(astroConfig).toContain("from '@astrojs/mdx'");
    expect(astroConfig).toContain('integrations: [mdx()]');
    expect(astroConfig).toContain("srcDir: './e2e/fixtures/astro-mdx/src'");
    expect(astroTsconfig).toContain('astro/tsconfigs/strictest');
    expect(astroTsconfig).toContain('"@astrojs/ts-plugin"');
    expect(astroTsconfig).toContain('"src/**/*.astro"');
    expect(astroTsconfig).toContain('"e2e/fixtures/**/*.astro"');
    expect(astroPage).toContain('ComponentProps');
    expect(astroPage).toContain('TinyrackAstroMdxComponentKey');
    expect(astroPage).toContain('TinyrackAstroMdxComponents');
    expect(astroPage).toContain('ComponentProps<typeof tinyrackAstroMdxComponents.a>');
    expect(astroPage).toContain(
      '<Content components={{ ...tinyrackAstroMdxComponents, ...components }} />',
    );
    expect(astroPage).toContain('@ts-expect-error Tinyrack link variants');
    expect(astroPage).toContain('@ts-expect-error Tinyrack table density');
    expect(astroPage).toContain('@ts-expect-error The default MDX map');
    expect(astroFixtureMdx).toContain('```typescript');
    expect(astroFixtureMdx).toContain('- [x] Task list checkbox');
    expect(astroFixtureMdx).toContain('Footnote reference[^tinyrack-fixture].');
    expect(astroShim).toContain('AstroComponentFactory');
    expect(astroShim).not.toContain('unknown');
    expect(astroProps).toContain("HTMLAttributes, HTMLTag } from 'astro/types'");
    expect(astroProps).toContain('LinkVariant');
    expect(astroProps).toContain('TableDensity');
    expect(astroProps).toContain('TinyrackAstroMdxComponent');
  });

  it('keeps documentation in markdown-first MDX with Tinyrack renderer overrides', () => {
    const files = collectFiles('stories');
    const docsFiles = [
      'stories/welcome.mdx',
      'stories/foundations/overview.mdx',
      'stories/foundations/colors.mdx',
      'stories/foundations/typography.mdx',
      'stories/foundations/spacing.mdx',
      'stories/foundations/radius.mdx',
      ...componentDocsFiles,
      'stories/integrations/mdx-renderer.docs.mdx',
    ];
    const removedStoryDocs = [
      'stories/welcome.stories.tsx',
      'stories/foundations/colors.stories.tsx',
      'stories/foundations/typography.stories.tsx',
      'stories/foundations/spacing.stories.tsx',
      'stories/foundations/radius.stories.tsx',
      'stories/adapters/tailwind.mdx',
      'stories/adapters/tailwind.stories.tsx',
      'stories/docs-components.tsx',
    ];

    for (const docsFile of docsFiles) {
      expect(existsSync(join(repoRoot, docsFile))).toBe(true);
      expect(readText(docsFile)).toContain('import { Meta } from');
    }

    for (const removedStoryDoc of removedStoryDocs) {
      expect(existsSync(join(repoRoot, removedStoryDoc))).toBe(false);
    }

    for (const file of files.filter((name) => /\.(mdx|tsx?)$/.test(name))) {
      const source = readText(file);

      expect(source).not.toContain('docs-components');
      expect(source).not.toContain('DocsPage');
      expect(source).not.toContain('ExampleFrame');
      expect(source).not.toContain('TokenReference');
      expect(source).not.toContain('tr-doc-');

      if (file.endsWith('.mdx')) {
        const proseAndJsxSource = stripMdxExampleSourceStrings(
          stripMarkdownCodeFences(source),
        );

        expect(proseAndJsxSource).not.toContain(
          "from '../../src/components/code-block/shiki-react.js'",
        );
        expect(proseAndJsxSource).not.toMatch(/<ShikiCodeBlock\s+code=/);
      }
    }

    const codeBlockDocs = readText('stories/components/code-block.docs.mdx');
    const codeDocs = readText('stories/components/code.docs.mdx');
    const componentExampleTabsSource = readText(
      'stories/shared/component-example-tabs.tsx',
    );
    const componentGuidanceSource = readText('stories/shared/component-guidance.tsx');
    const componentInstallSource = readText('stories/shared/component-install.tsx');
    const componentManifestSource = readText(
      'stories/shared/component-docs-manifest.ts',
    );
    const mdxRendererDocs = readText('stories/integrations/mdx-renderer.docs.mdx');
    const radiusDocs = readText('stories/foundations/radius.mdx');
    const welcomeDocs = readText('stories/welcome.mdx');

    expect(codeBlockDocs).toContain('<ComponentExampleTabs');
    expect(codeBlockDocs).toContain('title="Highlighted block with plain fallback"');
    expect(codeDocs).toContain('title="Inline Contexts"');
    expect(componentExampleTabsSource).toContain(
      "from '../../src/components/tabs/react.js'",
    );
    expect(componentExampleTabsSource).toContain(
      "from '../../src/components/code-block/react.js'",
    );
    expect(componentExampleTabsSource).toContain('<CodeBlock');
    expect(componentExampleTabsSource).toContain('function formatNestedMarkupSource');
    expect(componentExampleTabsSource).toContain(
      'normalizeCode(source.code, source.language)',
    );
    expect(componentExampleTabsSource).toContain('data-component-example=""');
    expect(componentExampleTabsSource).toContain('data-component-example-tabs=""');
    expect(componentExampleTabsSource).toContain('<TabsTrigger value="preview">');
    expect(componentExampleTabsSource).toContain('Preview');
    expect(componentExampleTabsSource).toContain("['HTML', 0]");
    expect(componentExampleTabsSource).toContain("['React', 1]");
    expect(componentExampleTabsSource).toContain('id: string;');
    expect(componentExampleTabsSource).toContain("'center' | 'start' | 'stretch'");
    expect(componentExampleTabsSource).toContain('min-h-40');
    expect(componentExampleTabsSource).toContain('navigator.clipboard.writeText');
    expect(componentExampleTabsSource).toContain("unavailable: 'Copy unavailable'");
    expect(componentExampleTabsSource).toContain('data-copy-source={label}');
    expect(componentExampleTabsSource).toContain('data-copy-status={copyStatus}');
    expect(componentExampleTabsSource).toContain('aria-live="polite"');
    expect(componentExampleTabsSource).not.toContain('@storybook/addon-docs');
    expect(componentExampleTabsSource).not.toContain('Canvas');
    expect(componentExampleTabsSource).not.toContain('<Source');
    expect(componentExampleTabsSource).not.toContain('daisyui');
    expect(componentInstallSource).toContain('data-component-install=""');
    expect(componentInstallSource).toContain('Installation options');
    expect(componentInstallSource).toContain('Installation target');
    expect(componentInstallSource).toContain('CodeBlock');
    expect(componentInstallSource).toContain('language="shellscript"');
    expect(componentInstallSource).toContain('language?: BundledLanguage;');
    expect(componentInstallSource).toContain('surface.language');
    expect(componentInstallSource).toContain("surface.imports.join('\\n')");
    expect(componentInstallSource).toContain('data-install-copy-status');
    expect(componentInstallSource).not.toContain('md:grid-cols-2');
    expect(componentInstallSource).not.toContain('import { Code }');
    expect(componentGuidanceSource).toContain('data-component-guidance=""');
    expect(componentGuidanceSource).toContain("title: 'When to use'");
    expect(componentGuidanceSource).toContain("title: 'Avoid'");
    expect(componentGuidanceSource).toContain("title: 'Accessibility'");
    expect(componentManifestSource).toContain('componentDocsManifest');
    expect(mdxRendererDocs).toContain('@tinyrack/ui/mdx/react');
    expect(mdxRendererDocs).toContain('<Meta title="Integrations/MDX Renderer" />');
    expect(mdxRendererDocs).toContain('@tinyrack/ui/mdx/astro');
    expect(mdxRendererDocs).toContain('@tinyrack/ui/mdx/mdx.css');
    expect(mdxRendererDocs).toContain('@tinyrack/ui/components/form/form.css');
    expect(mdxRendererDocs).toContain('@tinyrack/ui/components/link/link.css');
    expect(mdxRendererDocs).toContain('tinyrackAstroMdxComponents');
    expect(mdxRendererDocs).toContain(
      '<Content components={{ ...tinyrackAstroMdxComponents, ...components }} />',
    );
    expect(mdxRendererDocs).toContain('| Headings `h1`-`h6` |');
    expectSnippetsInOrder(mdxRendererDocs, [
      '### Third level heading',
      '#### Fourth level heading',
      '##### Fifth level heading',
      '###### Sixth level heading',
    ]);
    expect(mdxRendererDocs).toContain('#### Fourth level heading');
    expect(mdxRendererDocs).toContain('- [x] Task lists reuse the checkbox contract.');
    expect(mdxRendererDocs).toContain('Footnote reference[^tinyrack-mdx].');
    expect(radiusDocs).toContain('data-foundation-reference="radius"');
    expect(welcomeDocs).toContain('<ComponentInstall');
    expect(welcomeDocs).toContain('<ComponentExampleTabs');
    expect(welcomeDocs).toContain("language: 'astro'");
  });

  it('keeps component docs in a daisyUI-style reference and example structure', () => {
    const qualitySnippets: Record<(typeof componentDocsFiles)[number], string[]> = {
      'stories/components/badge.docs.mdx': [
        'Size x Variant Matrix',
        'badgeSizes.map',
        'badgeVariants.map',
        'class="tr-badge"',
      ],
      'stories/components/alert.docs.mdx': [
        'Variant Matrix',
        'alertVariants.map',
        'role="alert"',
        'class="tr-alert"',
      ],
      'stories/components/avatar.docs.mdx': [
        'Size x Shape Matrix',
        'avatarSizes.map',
        'avatarShapes.map',
        'class="tr-avatar"',
      ],
      'stories/components/button.docs.mdx': [
        'Solid Appearance',
        'Outline Appearance',
        'Ghost Appearance',
        'buttonVariants.map',
        'States and Icon Actions',
        'IconButton',
      ],
      'stories/components/card.docs.mdx': [
        'Padding x Variant Matrix',
        'cardPaddings.map',
        'cardVariants.map',
        'class="tr-card"',
      ],
      'stories/components/code-block.docs.mdx': [
        'Highlighted block with plain fallback',
        '@tinyrack/ui/components/code-block/react',
        'Languages',
        'Wrapped and Unwrapped',
      ],
      'stories/components/code.docs.mdx': [
        'React MDX',
        'Astro MDX',
        'Inline Contexts',
        'Command, Path, and Token Names',
      ],
      'stories/components/divider.docs.mdx': [
        'Orientation Matrix',
        'dividerOrientations.map',
        'aria-orientation="vertical"',
        'class="tr-divider"',
      ],
      'stories/components/form-checkbox.docs.mdx': [
        'React MDX',
        'Astro MDX',
        'title="Size"',
        'title="State"',
        'class="tr-checkbox"',
      ],
      'stories/components/form-field.docs.mdx': [
        'formMessageVariants.map',
        'title="Size"',
        'title="Message Variant"',
        'class="tr-field"',
      ],
      'stories/components/form-input.docs.mdx': [
        'Type Gallery',
        "['text', 'email'",
        'title="Size"',
        'title="State"',
        'class="tr-input"',
      ],
      'stories/components/form-radio.docs.mdx': [
        'radioGroupOrientations.map',
        'title="Orientation"',
        'title="Size"',
        'title="State"',
        'class="tr-radio-group"',
      ],
      'stories/components/form-select.docs.mdx': [
        'title="Size"',
        'title="State"',
        'class="tr-select"',
      ],
      'stories/components/form-switch.docs.mdx': [
        'title="Size"',
        'title="State"',
        'class="tr-switch"',
      ],
      'stories/components/form-textarea.docs.mdx': [
        'title="Size"',
        'title="Rows and State"',
        'class="tr-textarea"',
      ],
      'stories/components/form.docs.mdx': [
        'Primitive Gallery',
        'Size Matrix',
        'State Matrix',
        'React MDX',
        'Astro MDX',
      ],
      'stories/components/link.docs.mdx': [
        'Underline x Variant Matrix',
        'linkUnderlines.map',
        'linkVariants.map',
        'React MDX',
        'Astro MDX',
      ],
      'stories/components/progress.docs.mdx': [
        'Size x Variant Matrix',
        'progressSizes.map',
        'progressVariants.map',
        'Indeterminate',
        'class="tr-progress"',
      ],
      'stories/components/skeleton.docs.mdx': [
        'Shape Matrix',
        'skeletonShapes.map',
        'prefers-reduced-motion',
        'class="tr-skeleton"',
      ],
      'stories/components/overlay.docs.mdx': [
        'title="Modal"',
        'title="Placement"',
        'title="Anchored Layer"',
        'createOverlayManager(document)',
      ],
      'stories/components/table.docs.mdx': [
        'title="Density"',
        'tableDensities.map',
        'Striped Operational Table',
        'React MDX',
        'Astro MDX',
      ],
      'stories/components/tabs.docs.mdx': [
        'tabsSizes.map',
        'tabsOrientations.map',
        'tabsActivationModes.map',
        'Activation Mode',
      ],
      'stories/components/spinner.docs.mdx': ['Labeled progress', 'class="tr-spinner"'],
      'stories/components/disclosure.docs.mdx': [
        'Initially open',
        'details class="tr-disclosure"',
      ],
      'stories/components/accordion.docs.mdx': [
        'Single expansion',
        'Multiple expansion',
        'Required open item',
        'createAccordionManager(document)',
      ],
      'stories/components/tooltip.docs.mdx': ['Logical placement', 'role="tooltip"'],
      'stories/components/menu.docs.mdx': [
        'Labels, links and disabled items',
        'role="menuitem"',
      ],
      'stories/components/combobox.docs.mdx': [
        'Freeform autocomplete',
        'role="combobox"',
      ],
      'stories/components/pin-input.docs.mdx': [
        'Six-digit verification',
        'data-tr-pin-input',
      ],
      'stories/components/toast.docs.mdx': [
        'Stable update and action',
        'createToastManager',
      ],
    };

    const manifestFiles = componentDocsManifest.map(({ file }) => file).sort();
    const actualComponentDocs = collectFiles('stories/components')
      .filter((file) => file.endsWith('.docs.mdx'))
      .sort();
    const allowedContractCategories = [
      'Component',
      'Part',
      'Variant',
      'Size',
      'Padding',
      'Shape',
      'Orientation',
      'Motion',
      'Image',
      'State',
      'Behavior',
      'Native',
    ];

    expect(componentDocsManifest).toHaveLength(30);
    expect(new Set(componentDocsManifest.map(({ id }) => id)).size).toBe(30);
    expect(new Set(componentDocsManifest.map(({ storyId }) => storyId)).size).toBe(30);
    expect(manifestFiles).toEqual(actualComponentDocs);

    for (const entry of componentDocsManifest) {
      const docsFile = entry.file;
      const docsSource = readText(docsFile);

      expectSnippetsInOrder(docsSource, [...standardComponentDocSections]);
      expect(docsSource).toContain(
        '| Category | CSS / HTML | React | Values & default | Guidance |',
      );
      expect(docsSource).toContain('CSS / HTML');
      expect(docsSource).toContain('React');
      expect(docsSource).toContain('@tinyrack/ui/core/core.css');
      expect(docsSource).toContain(
        "import { ComponentExampleTabs } from '../shared/component-example-tabs.js';",
      );
      expect(docsSource).toContain(
        "import { ComponentGuidance } from '../shared/component-guidance.js';",
      );
      expect(docsSource).toContain(
        "import { ComponentInstall } from '../shared/component-install.js';",
      );
      expect(docsSource).toContain('<ComponentExampleTabs');
      expect(docsSource).toContain('<ComponentInstall');
      expect(docsSource).toContain('<ComponentGuidance');
      expect(docsSource).toContain("label: 'React'");
      expect(docsSource).toContain("label: 'HTML'");

      const sourceSamples = [
        ...docsSource.matchAll(/code:\s*String\.raw`([\s\S]*?)`/g),
      ].map(([, sample]) => sample ?? '');

      expect(sourceSamples).not.toHaveLength(0);
      expect(sourceSamples.join('\n')).not.toMatch(
        /\.(?:map|forEach|filter|reduce)\s*\(/,
      );
      expect(sourceSamples.join('\n')).not.toMatch(/\b(?:for|while)\s*\(/);
      expect(sourceSamples.join('\n')).not.toContain('...');

      for (const exampleId of entry.requiredExamples) {
        expect(docsSource).toContain(`id="${exampleId}"`);
      }

      const contractSource = docsSource.match(
        /## Contract\s+([\s\S]*?)\n## Install/,
      )?.[1];
      const contractCategories = (contractSource ?? '')
        .split('\n')
        .filter(
          (line) =>
            line.startsWith('| ') &&
            !line.startsWith('| Category ') &&
            !line.startsWith('| ---'),
        )
        .map((line) => line.split('|')[1]?.trim())
        .filter((category): category is string => category !== undefined);

      expect(contractCategories.length).toBeGreaterThan(0);

      for (const category of contractCategories) {
        expect(allowedContractCategories).toContain(category);
      }

      for (const capability of entry.capabilities) {
        expect(componentDocCapabilities).toContain(capability);
      }

      for (const snippet of qualitySnippets[docsFile] ?? []) {
        expect(docsSource).toContain(snippet);
      }
    }
  });

  it('keeps Welcome as a guided implementation entry point', () => {
    const welcomeSource = readText('stories/welcome.mdx');
    const previewSource = readText('.storybook/preview.tsx');

    expectSnippetsInOrder(welcomeSource, [
      '## Principles',
      '## Start in 5 minutes',
      '## Build one operational surface',
      '## Where next',
      '## Package map',
      '## Use boundary',
    ]);
    expect(welcomeSource).toContain("label: 'CSS / HTML'");
    expect(welcomeSource).toContain("label: 'React'");
    expect(welcomeSource).toContain("label: 'React MDX'");
    expect(welcomeSource).toContain("label: 'Astro MDX'");
    expect(welcomeSource).toContain('pnpm add @tinyrack/ui');
    expect(welcomeSource).toContain(
      'pnpm add @tinyrack/ui tailwindcss react react-dom',
    );
    expect(welcomeSource).toContain('pnpm add @tinyrack/ui astro @astrojs/mdx');
    expect(welcomeSource).toContain('@tinyrack/ui/components/badge/react');
    expect(welcomeSource).toContain('@tinyrack/ui/components/badge/badge.css');
    expect(welcomeSource).toContain('@tinyrack/ui/components/alert/react');
    expect(welcomeSource).toContain('@tinyrack/ui/components/alert/alert.css');
    expect(welcomeSource).toContain('@tinyrack/ui/components/avatar/react');
    expect(welcomeSource).toContain('@tinyrack/ui/components/avatar/avatar.css');
    expect(welcomeSource).toContain('@tinyrack/ui/components/code-block/react');
    expect(welcomeSource).toContain(
      '@tinyrack/ui/components/code-block/code-block.css',
    );
    expect(welcomeSource).toContain('@tinyrack/ui/components/code/react');
    expect(welcomeSource).toContain('@tinyrack/ui/components/code/code.css');
    expect(welcomeSource).toContain('@tinyrack/ui/components/divider/react');
    expect(welcomeSource).toContain('@tinyrack/ui/components/divider/divider.css');
    expect(welcomeSource).toContain('@tinyrack/ui/mdx/react');
    expect(welcomeSource).toContain('@tinyrack/ui/mdx/astro');
    expect(welcomeSource).toContain('@tinyrack/ui/mdx/mdx.css');
    expect(welcomeSource).toContain('@tinyrack/ui/core/core.css');
    expect(welcomeSource).toContain('@tinyrack/ui/components/button/button.css');
    expect(welcomeSource).toContain('@tinyrack/ui/components/button/react');
    expect(welcomeSource).toContain('@tinyrack/ui/components/card/react');
    expect(welcomeSource).toContain('@tinyrack/ui/components/card/card.css');
    expect(welcomeSource).toContain('@tinyrack/ui/components/form/form.css');
    expect(welcomeSource).toContain('@tinyrack/ui/components/form/react');
    expect(welcomeSource).toContain('Use Tailwind utilities directly for layout');
    expect(welcomeSource).toContain('@tinyrack/ui/components/link/link.css');
    expect(welcomeSource).toContain('@tinyrack/ui/components/link/react');
    expect(welcomeSource).toContain('@tinyrack/ui/components/progress/react');
    expect(welcomeSource).toContain('@tinyrack/ui/components/progress/progress.css');
    expect(welcomeSource).toContain('@tinyrack/ui/components/skeleton/react');
    expect(welcomeSource).toContain('@tinyrack/ui/components/skeleton/skeleton.css');
    expect(welcomeSource).toContain('@tinyrack/ui/components/table/table.css');
    expect(welcomeSource).toContain('@tinyrack/ui/components/table/react');
    expect(welcomeSource).toContain('@tinyrack/ui/components/tabs/tabs.css');
    expect(welcomeSource).toContain('@tinyrack/ui/components/tabs/react');
    expect(welcomeSource).toContain('data-docs-route="foundations"');
    expect(welcomeSource).toContain('/?path=/docs/foundations-overview--docs');
    expect(welcomeSource).toContain('/?path=/docs/components-button--docs');
    expect(welcomeSource).toContain('/?path=/docs/components-form-overview--docs');
    expect(welcomeSource).toContain('/?path=/docs/integrations-mdx-renderer--docs');
    expect(welcomeSource).not.toContain('Supported Surfaces');
    expect(welcomeSource).not.toContain('Component Docs');
    expect(welcomeSource).not.toContain('pnpm add lucide-react');
    expect(previewSource).not.toContain("'CSS'");
    expect(previewSource).not.toContain("'Tailwind'");
  });

  it('keeps Foundations source-backed and ordered as a learning path', () => {
    const previewSource = readText('.storybook/preview.tsx');
    const overviewSource = readText('stories/foundations/overview.mdx');
    const elevationSource = readText('stories/foundations/elevation.mdx');
    const foundationDocs = [
      {
        source: readText('stories/foundations/colors.mdx'),
        token: 'tinyrackSemanticColors',
        reference: 'colors',
      },
      {
        source: readText('stories/foundations/typography.mdx'),
        token: 'tinyrackTypography',
        reference: 'typography',
      },
      {
        source: readText('stories/foundations/spacing.mdx'),
        token: 'tinyrackSpacing',
        reference: 'spacing',
      },
      {
        source: readText('stories/foundations/radius.mdx'),
        token: 'tinyrackRadii',
        reference: 'radius',
      },
    ];

    expect(previewSource).toContain("'Controls'");
    expect(previewSource).toContain("'Motion'");
    expect(previewSource).toContain("'Elevation'");
    expect(overviewSource).toContain('<Meta title="Foundations/Overview" />');
    expect(overviewSource).toContain('## Model');
    expect(overviewSource).toContain('## System in one surface');
    expect(overviewSource).toContain('## Consumption');
    expect(overviewSource).toContain('## Next');
    expect(overviewSource).toContain('Runtime foundation tokens');
    expect(overviewSource).toContain('Shared component decisions');

    foundationDocs.push(
      {
        source: readText('stories/foundations/controls.mdx'),
        token: 'tinyrackControlMetrics',
        reference: 'controls',
      },
      {
        source: readText('stories/foundations/motion.mdx'),
        token: 'tinyrackMotion',
        reference: 'motion',
      },
      {
        source: elevationSource,
        token: 'tinyrackShadows',
        reference: 'elevation',
      },
    );

    for (const { source, token, reference } of foundationDocs) {
      expectSnippetsInOrder(
        source,
        reference === 'colors'
          ? [
              '## Architecture',
              '## Base colors',
              '## Functional colors',
              '## Base-to-functional mapping',
              '## Component/pattern tokens',
              '## Custom primary theme',
              "## Do and don't",
            ]
          : [
              '## Principle',
              reference === 'elevation' ? '## Token comparison' : '## Visual scale',
              '## Applied pattern',
              '## Implementation',
              '## Reference',
            ],
      );
      expect(source).toContain(`data-foundation-reference="${reference}"`);
      expect(source).toContain(token);
      expect(source).toContain("from '../../src/core/index.js'");
    }

    expect(foundationDocs[0]?.source).toContain('tinyrackPalettes');
    expect(foundationDocs[0]?.source).toContain('never used directly in product code');
    expect(foundationDocs[2]?.source).toContain('--tinyrack-space-*');
    expect(foundationDocs[3]?.source).toContain('--tinyrack-radius-*');
    expect(elevationSource).toContain('No elevation · normal content');
    expect(elevationSource).toContain('Layer and Toast');
    expect(elevationSource).toContain('Modal surfaces');
    expect(elevationSource).toContain('data-elevation-example="none"');
    expect(elevationSource).toContain('data-elevation-example="raised"');
    expect(elevationSource).toContain('data-elevation-example="overlay"');
    expect(elevationSource).not.toContain(
      '<section class="rounded-tinyrack-lg shadow-tinyrack-raised">',
    );
    expect(foundationDocs[5]?.source).toContain('<MotionDurationComparison />');
    expect(foundationDocs[5]?.source).toContain('<MotionEasingComparison />');
    expect(foundationDocs[5]?.source).toContain('<ReducedMotionPreview />');
    expect(foundationDocs[5]?.source).toContain('prefers-reduced-motion');
  });

  it('documents component-level CSS token overrides on every component page', () => {
    const helperSource = readText('stories/shared/component-token-table.tsx');

    expect(helperSource).toContain('data-component-token-table');
    expect(helperSource).toContain('--tinyrack-*');
    expect(helperSource).toContain('--tr-*');
    expect(helperSource).toContain('<h2 className="tr-mdx-h2">');
    expect(helperSource).toContain('<p className="tr-mdx-p">');
    expect(helperSource).toContain(
      '<div className="tr-table-container tr-mdx-table-container">',
    );

    for (const docsFile of componentDocsFiles) {
      const docsSource = readText(docsFile);

      expect(docsSource, docsFile).toContain('ComponentTokenTable');
      expect(docsSource, docsFile).toContain(
        "from '../shared/component-token-table.js'",
      );
    }
  });

  it('keeps owned component stories in the component gallery', () => {
    expect(existsSync(join(repoRoot, 'stories/components/badge.stories.tsx'))).toBe(
      true,
    );
    expect(existsSync(join(repoRoot, 'stories/components/badge.docs.mdx'))).toBe(true);
    expect(existsSync(join(repoRoot, 'stories/components/button.stories.tsx'))).toBe(
      true,
    );
    expect(existsSync(join(repoRoot, 'stories/components/button.docs.mdx'))).toBe(true);
    expect(
      existsSync(join(repoRoot, 'stories/components/code-block.stories.tsx')),
    ).toBe(true);
    expect(existsSync(join(repoRoot, 'stories/components/code-block.docs.mdx'))).toBe(
      true,
    );
    expect(existsSync(join(repoRoot, 'stories/components/code.stories.tsx'))).toBe(
      true,
    );
    expect(existsSync(join(repoRoot, 'stories/components/code.docs.mdx'))).toBe(true);
    expect(existsSync(join(repoRoot, 'stories/components/table.stories.tsx'))).toBe(
      true,
    );
    expect(existsSync(join(repoRoot, 'stories/components/table.docs.mdx'))).toBe(true);
    expect(existsSync(join(repoRoot, 'stories/components/tabs.stories.tsx'))).toBe(
      true,
    );
    expect(existsSync(join(repoRoot, 'stories/components/tabs.docs.mdx'))).toBe(true);
    expect(existsSync(join(repoRoot, 'stories/mantine'))).toBe(false);
    expect(existsSync(join(repoRoot, 'stories/daisyui'))).toBe(false);
    expect(existsSync(join(repoRoot, 'stories/adapters/mantine.stories.tsx'))).toBe(
      false,
    );
    expect(existsSync(join(repoRoot, 'stories/adapters/daisyui.stories.tsx'))).toBe(
      false,
    );
    expect(
      existsSync(join(repoRoot, 'stories/adapters/astro-starlight.stories.tsx')),
    ).toBe(false);

    expect(
      readdirSync(join(repoRoot, 'stories/components'))
        .filter((file) => file.endsWith('.stories.tsx'))
        .sort(),
    ).toEqual([
      'accordion.stories.tsx',
      'alert.stories.tsx',
      'avatar.stories.tsx',
      'badge.stories.tsx',
      'button.stories.tsx',
      'card.stories.tsx',
      'code-block.stories.tsx',
      'code.stories.tsx',
      'combobox.stories.tsx',
      'disclosure.stories.tsx',
      'divider.stories.tsx',
      'form-checkbox.stories.tsx',
      'form-field.stories.tsx',
      'form-input.stories.tsx',
      'form-radio.stories.tsx',
      'form-select.stories.tsx',
      'form-switch.stories.tsx',
      'form-textarea.stories.tsx',
      'link.stories.tsx',
      'menu.stories.tsx',
      'overlay.stories.tsx',
      'pin-input.stories.tsx',
      'progress.stories.tsx',
      'skeleton.stories.tsx',
      'spinner.stories.tsx',
      'table.stories.tsx',
      'tabs.stories.tsx',
      'toast.stories.tsx',
      'tooltip.stories.tsx',
    ]);
  });

  it('exposes controls and docs for the operational primitive public APIs', () => {
    const components = [
      {
        name: 'Alert',
        contract: 'alertVariants',
        css: '@tinyrack/ui/components/alert/alert.css',
        react: '@tinyrack/ui/components/alert/react',
        className: 'class="tr-alert"',
      },
      {
        name: 'Avatar',
        contract: 'avatarSizes',
        css: '@tinyrack/ui/components/avatar/avatar.css',
        react: '@tinyrack/ui/components/avatar/react',
        className: 'class="tr-avatar"',
      },
      {
        name: 'Card',
        contract: 'cardPaddings',
        css: '@tinyrack/ui/components/card/card.css',
        react: '@tinyrack/ui/components/card/react',
        className: 'class="tr-card"',
      },
      {
        name: 'Divider',
        contract: 'dividerOrientations',
        css: '@tinyrack/ui/components/divider/divider.css',
        react: '@tinyrack/ui/components/divider/react',
        className: 'class="tr-divider"',
      },
      {
        name: 'Progress',
        contract: 'progressSizes',
        css: '@tinyrack/ui/components/progress/progress.css',
        react: '@tinyrack/ui/components/progress/react',
        className: 'class="tr-progress"',
      },
      {
        name: 'Skeleton',
        contract: 'skeletonShapes',
        css: '@tinyrack/ui/components/skeleton/skeleton.css',
        react: '@tinyrack/ui/components/skeleton/react',
        className: 'class="tr-skeleton"',
      },
    ] as const;

    for (const component of components) {
      const storySource = readText(
        `stories/components/${component.name.toLowerCase()}.stories.tsx`,
      );
      const docsSource = readText(
        `stories/components/${component.name.toLowerCase()}.docs.mdx`,
      );

      expect(storySource).toContain(`title: 'Components/${component.name}'`);
      expect(storySource).toContain('argTypes:');
      expect(storySource).toContain(component.contract);
      expect(docsSource).toContain(component.react);
      expect(docsSource).toContain(component.css);
      expect(docsSource).toContain(component.className);
    }
  });

  it('exposes Badge story controls for the supported public API', () => {
    const storySource = readText('stories/components/badge.stories.tsx');
    const docsSource = readText('stories/components/badge.docs.mdx');

    expect(storySource).toContain("title: 'Components/Badge'");
    expect(storySource).not.toContain("tags: ['autodocs']");
    expect(storySource).toContain('ComponentStoryProps');
    expect(storySource).toContain('controlValues');
    expect(storySource).toContain('args:');
    expect(storySource).toContain('argTypes:');
    expect(storySource).toContain('badgeSizes');
    expect(storySource).toContain('badgeVariants');
    expect(storySource).not.toContain('function BadgeDocsPage');
    expect(storySource).not.toContain('page: BadgeDocsPage');
    expect(storySource).not.toContain('@mantine/core');
    expect(storySource).not.toContain('daisyui');
    expect(docsSource).toContain('@tinyrack/ui/components/badge/react');
    expect(docsSource).toContain('@tinyrack/ui/components/badge/badge.css');
    expect(docsSource).toContain('class="tr-badge"');
  });

  it('exposes Code story controls for the supported public API', () => {
    const storySource = readText('stories/components/code.stories.tsx');
    const docsSource = readText('stories/components/code.docs.mdx');

    expect(storySource).toContain("title: 'Components/Code'");
    expect(storySource).not.toContain("tags: ['autodocs']");
    expect(storySource).toContain('ComponentStoryProps');
    expect(storySource).toContain('controlValues');
    expect(storySource).toContain('args:');
    expect(storySource).toContain('argTypes:');
    expect(storySource).not.toContain('CodeBlock');
    expect(storySource).not.toContain('function CodeDocsPage');
    expect(storySource).not.toContain('page: CodeDocsPage');
    expect(storySource).not.toContain('@mantine/core');
    expect(storySource).not.toContain('daisyui');
    expect(docsSource).toContain('@tinyrack/ui/components/code/react');
    expect(docsSource).toContain('@tinyrack/ui/components/code/code.css');
    expect(docsSource).toContain('class="tr-code"');
    expect(docsSource).not.toContain('class="tr-code-block"');
  });

  it('exposes CodeBlock story controls for the supported public API', () => {
    const storySource = readText('stories/components/code-block.stories.tsx');
    const docsSource = readText('stories/components/code-block.docs.mdx');

    expect(storySource).toContain("title: 'Components/CodeBlock'");
    expect(storySource).not.toContain("tags: ['autodocs']");
    expect(storySource).toContain('ComponentStoryProps');
    expect(storySource).toContain('codeBlockLanguages');
    expect(storySource).toContain('codeBlockThemes');
    expect(storySource).toContain('wrap');
    expect(storySource).toContain('args:');
    expect(storySource).toContain('argTypes:');
    expect(storySource).not.toContain('ShikiCodeBlock');
    expect(storySource).not.toContain('function CodeBlockDocsPage');
    expect(storySource).not.toContain('page: CodeBlockDocsPage');
    expect(storySource).not.toContain('@mantine/core');
    expect(storySource).not.toContain('daisyui');
    expect(docsSource).toContain('@tinyrack/ui/components/code-block/react');
    expect(docsSource).toContain('@tinyrack/ui/components/code-block/code-block.css');
    expect(docsSource).not.toContain('@tinyrack/ui/components/code-block/shiki-react');
    expect(docsSource).not.toContain('pnpm add shiki');
    expect(docsSource).toContain('class="tr-code-block"');
  });

  it('exposes Button story controls for the supported public API', () => {
    const storySource = readText('stories/components/button.stories.tsx');
    const docsSource = readText('stories/components/button.docs.mdx');

    expect(storySource).toContain("title: 'Components/Button'");
    expect(storySource).not.toContain("tags: ['autodocs']");
    expect(storySource).toContain('ComponentStoryProps');
    expect(storySource).toContain('controlValues');
    expect(storySource).toContain('args:');
    expect(storySource).toContain('argTypes:');
    expect(storySource).toContain('buttonAppearances');
    expect(storySource).toContain('buttonSizes');
    expect(storySource).toContain('buttonVariants');
    expect(storySource).toContain("import { RefreshCw } from 'lucide-react';");
    expect(storySource).not.toContain('function RefreshIcon');
    expect(storySource).not.toContain('function ButtonDocsPage');
    expect(storySource).not.toContain('page: ButtonDocsPage');
    expect(storySource).not.toContain('buttonTones');
    expect(storySource).not.toContain('@mantine/core');
    expect(storySource).not.toContain('daisyui');
    expect(docsSource).toContain('@tinyrack/ui/components/button/react');
    expect(docsSource).toContain('@tinyrack/ui/components/button/button.css');
    expect(docsSource).toContain("import { RefreshCw } from 'lucide-react';");
    expect(docsSource).toContain('aria-hidden="true"');
    expect(docsSource).toContain('size={18}');
    expect(docsSource).toContain('class="tr-btn"');
    expect(docsSource).toContain('IconButton');
  });

  it('exposes Link story controls for the supported public API', () => {
    const storySource = readText('stories/components/link.stories.tsx');
    const docsSource = readText('stories/components/link.docs.mdx');

    expect(storySource).toContain("title: 'Components/Link'");
    expect(storySource).toContain('argTypes:');
    expect(storySource).toContain('linkUnderlines');
    expect(storySource).toContain('linkVariants');
    expect(storySource).not.toContain('@mantine/core');
    expect(storySource).not.toContain('daisyui');
    expect(docsSource).toContain('@tinyrack/ui/components/link/react');
    expect(docsSource).toContain('@tinyrack/ui/components/link/link.css');
    expect(docsSource).toContain('class="tr-link"');
  });

  it('exposes Form story controls for the supported public API', () => {
    const overviewDocsSource = readText('stories/components/form.docs.mdx');
    const fieldStorySource = readText('stories/components/form-field.stories.tsx');
    const inputStorySource = readText('stories/components/form-input.stories.tsx');
    const textareaStorySource = readText(
      'stories/components/form-textarea.stories.tsx',
    );
    const selectStorySource = readText('stories/components/form-select.stories.tsx');
    const checkboxStorySource = readText(
      'stories/components/form-checkbox.stories.tsx',
    );
    const radioStorySource = readText('stories/components/form-radio.stories.tsx');
    const switchStorySource = readText('stories/components/form-switch.stories.tsx');
    const splitStorySources = [
      fieldStorySource,
      inputStorySource,
      textareaStorySource,
      selectStorySource,
      checkboxStorySource,
      radioStorySource,
      switchStorySource,
    ];
    const docsFiles = [
      'stories/components/form-field.docs.mdx',
      'stories/components/form-input.docs.mdx',
      'stories/components/form-textarea.docs.mdx',
      'stories/components/form-select.docs.mdx',
      'stories/components/form-checkbox.docs.mdx',
      'stories/components/form-radio.docs.mdx',
      'stories/components/form-switch.docs.mdx',
    ];

    expect(existsSync(join(repoRoot, 'stories/components/form.stories.tsx'))).toBe(
      false,
    );
    expect(overviewDocsSource).toContain('<Meta title="Components/Form/Overview" />');
    expect(overviewDocsSource).toContain('@tinyrack/ui/components/form/react');
    expect(overviewDocsSource).toContain('@tinyrack/ui/components/form/form.css');
    expect(overviewDocsSource).toContain('Primitive Gallery');
    expect(overviewDocsSource).toContain('Size Matrix');
    expect(overviewDocsSource).toContain('State Matrix');
    expect(overviewDocsSource).toContain('class="tr-input"');
    expect(overviewDocsSource).toContain('class="tr-checkbox"');
    expect(fieldStorySource).toContain("title: 'Components/Form/Field'");
    expect(inputStorySource).toContain("title: 'Components/Form/Input'");
    expect(inputStorySource).toContain('inputTypes');
    expect(inputStorySource).toContain("'email'");
    expect(inputStorySource).toContain("'date'");
    expect(textareaStorySource).toContain("title: 'Components/Form/Textarea'");
    expect(selectStorySource).toContain("title: 'Components/Form/Select'");
    expect(checkboxStorySource).toContain("title: 'Components/Form/Checkbox'");
    expect(radioStorySource).toContain("title: 'Components/Form/Radio'");
    expect(radioStorySource).toContain('radioGroupOrientations');
    expect(switchStorySource).toContain("title: 'Components/Form/Switch'");

    for (const storySource of splitStorySources) {
      expect(storySource).toContain('argTypes:');
      expect(storySource).toContain('formControlSizes');
      expect(storySource).not.toContain('Combobox');
      expect(storySource).not.toContain('@mantine/core');
      expect(storySource).not.toContain('daisyui');
    }

    for (const docsFile of docsFiles) {
      const docsSource = readText(docsFile);

      expect(docsSource).toContain('@tinyrack/ui/components/form/react');
      expect(docsSource).toContain('@tinyrack/ui/components/form/form.css');
    }
    expect(readText('stories/components/form-input.docs.mdx')).toContain(
      'class="tr-input"',
    );
    expect(readText('stories/components/form-checkbox.docs.mdx')).toContain(
      'class="tr-checkbox"',
    );
  });

  it('exposes Table story controls for the supported public API', () => {
    const storySource = readText('stories/components/table.stories.tsx');
    const docsSource = readText('stories/components/table.docs.mdx');

    expect(storySource).toContain("title: 'Components/Table'");
    expect(storySource).not.toContain("tags: ['autodocs']");
    expect(storySource).toContain('ComponentStoryProps');
    expect(storySource).toContain('controlValues');
    expect(storySource).toContain('args:');
    expect(storySource).toContain('argTypes:');
    expect(storySource).toContain('tableDensities');
    expect(storySource).not.toContain('caption');
    expect(storySource).toContain('striped');
    expect(storySource).toContain('striped: false');
    expect(storySource).not.toContain('TableHead');
    expect(storySource).not.toContain('TableRow');
    expect(storySource).not.toContain('TableCell');
    expect(storySource).not.toContain('@mantine/core');
    expect(storySource).not.toContain('daisyui');
    expect(docsSource).toContain('@tinyrack/ui/components/table/react');
    expect(docsSource).toContain('@tinyrack/ui/components/table/table.css');
    expect(docsSource).toContain('class="tr-table"');
    expect(docsSource).toContain('class="tr-table-container"');
  });

  it('exposes Tabs story controls for the supported public API', () => {
    const storySource = readText('stories/components/tabs.stories.tsx');
    const docsSource = readText('stories/components/tabs.docs.mdx');

    expect(storySource).toContain("title: 'Components/Tabs'");
    expect(storySource).not.toContain("tags: ['autodocs']");
    expect(storySource).toContain('ComponentStoryProps');
    expect(storySource).toContain('argTypes:');
    expect(storySource).toContain('tabsActivationModes');
    expect(storySource).toContain('tabsOrientations');
    expect(storySource).toContain('tabsSizes');
    expect(storySource).toContain('defaultValue');
    expect(storySource).not.toContain('function TabsDocsPage');
    expect(storySource).not.toContain('page: TabsDocsPage');
    expect(storySource).not.toContain('@mantine/core');
    expect(storySource).not.toContain('daisyui');
    expect(docsSource).toContain('@tinyrack/ui/components/tabs/react');
    expect(docsSource).toContain('@tinyrack/ui/components/tabs/tabs.css');
    expect(docsSource).toContain('class="tr-tabs"');
    expect(docsSource).toContain('role="tablist"');
  });

  it('keeps README focused on owned components instead of docs pages', () => {
    const readme = readText('README.md');

    expect(existsSync(join(repoRoot, 'docs'))).toBe(false);
    expect(readme).toContain('@tinyrack/ui/components/button/react');
    expect(readme).toContain('@tinyrack/ui/components/button/button.css');
    expect(readme).toContain('@tinyrack/ui/components/form/react');
    expect(readme).toContain('@tinyrack/ui/components/form/form.css');
    expect(readme).toContain('@tinyrack/ui/components/link/react');
    expect(readme).toContain('@tinyrack/ui/components/link/link.css');
    expect(readme).toContain('@tinyrack/ui/components/table/react');
    expect(readme).toContain('@tinyrack/ui/components/table/table.css');
    expect(readme).toContain('@tinyrack/ui/components/tabs/react');
    expect(readme).toContain('@tinyrack/ui/components/tabs/tabs.css');
    expect(readme).toContain('lucide-react');
    expect(readme).toContain('@lucide/astro');
    expect(readme).toContain('lucide-static');
    expect(readme).toContain('https://design.tinyrack.net');
    expect(readme).not.toContain('docs/');
    expect(readme).not.toContain('@tinyrack/themes');
    expect(readme).not.toContain('@tinyrack/ui/icons');
    expect(readme).not.toContain('@tinyrack/ui/styles.css');
  });

  it('deploys Storybook to the documented public domain', () => {
    const wranglerConfig = readText('wrangler.jsonc');
    const deployWorkflow = readText('.github/workflows/deploy-storybook.yml');

    expect(wranglerConfig).toContain('"name": "tinyrack-ui-storybook"');
    expect(wranglerConfig).toContain('"routes"');
    expect(wranglerConfig).toContain('"pattern": "design.tinyrack.net"');
    expect(wranglerConfig).toContain('"custom_domain": true');
    expect(deployWorkflow).toContain('pnpm run deploy:storybook');
    expect(deployWorkflow).toContain('CLOUDFLARE_API_TOKEN');
    expect(deployWorkflow).toContain('CLOUDFLARE_ACCOUNT_ID');
  });

  it('runs the built component docs audit in pull requests and deploys', () => {
    const packageJson = JSON.parse(readText('package.json')) as {
      scripts: Record<string, string>;
    };
    const ciWorkflow = readText('.github/workflows/ci.yml');
    const deployWorkflow = readText('.github/workflows/deploy-storybook.yml');
    const vitestConfig = readText('vitest.config.ts');
    const browserAudit = readText('e2e/storybook-docs-browser.test.ts');

    expect(packageJson.scripts['storybook:audit']).toBe(
      'vitest run --project storybook-docs',
    );
    expect(packageJson.scripts['test:storybook']).toBe(
      'pnpm storybook:build && pnpm storybook:audit',
    );
    expect(ciWorkflow).toContain('pnpm exec playwright install --with-deps chromium');
    expect(ciWorkflow).toContain('pnpm run test:storybook');
    expect(deployWorkflow).toContain(
      'pnpm exec playwright install --with-deps chromium',
    );
    expect(deployWorkflow).toContain('pnpm run test:storybook');
    expect(vitestConfig).toContain("name: 'storybook-docs'");
    expect(vitestConfig).toContain("include: ['e2e/storybook-docs-browser.test.ts']");
    expect(browserAudit).toContain('componentDocsManifest');
    expect(browserAudit).toContain('guidedDocsManifest');
    expect(browserAudit).toContain(
      "permissions: ['clipboard-read', 'clipboard-write']",
    );
    expect(browserAudit).toContain('viewport: { height: 844, width: 390 }');
  });
});
