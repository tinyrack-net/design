import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs';
import { join, relative } from 'node:path';
import ts from 'typescript';
import { describe, expect, it } from 'vitest';

const repoRoot = process.cwd();
const allowedPreviewImports = [
  '@import "tailwindcss";',
  '@import "../src/core/core.css";',
  '@import "../src/components/badge/badge.css";',
  '@import "../src/components/button/button.css";',
  '@import "../src/components/code-block/code-block.css";',
  '@import "../src/components/code/code.css";',
  '@import "../src/components/form/form.css";',
  '@import "../src/components/link/link.css";',
  '@import "../src/components/table/table.css";',
  '@import "../src/components/tabs/tabs.css";',
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
        '.storybook/tinyrack-mdx-components.tsx',
      ]),
    );
  });

  it('keeps the Storybook preview bound to the allowed Tinyrack CSS imports', () => {
    const mainSource = readText('.storybook/main.ts');
    const previewSource = readText('.storybook/preview.tsx');
    const docsContainerSource = readText('.storybook/tinyrack-docs-container.tsx');
    const mdxComponentsSource = readText('.storybook/tinyrack-mdx-components.tsx');
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
    expect(previewSource).toContain(
      "import { TinyrackDocsContainer } from './tinyrack-docs-container.js';",
    );
    expect(previewSource).toContain(
      "import { tinyrackMdxComponents } from './tinyrack-mdx-components.js';",
    );
    expect(previewSource).toContain('container: TinyrackDocsContainer');
    expect(previewSource).toContain('components: tinyrackMdxComponents');
    expect(docsContainerSource).toContain("from '@mdx-js/react'");
    expect(docsContainerSource).toContain('MDXProvider');
    expect(docsContainerSource).toContain('DocsContainer');
    expect(docsContainerSource).toContain('components={tinyrackMdxComponents}');
    expect(mdxComponentsSource).toContain('ShikiCodeBlock');
    expect(mdxComponentsSource).toContain('Code');
    expect(mdxComponentsSource).toContain('TableContainer');
    expect(mdxComponentsSource).toContain('Table density="compact"');
    expect(mdxComponentsSource).toContain('textFromReactNode');
    expect(mdxComponentsSource).toContain('languageFromClassName');
    expect(mdxComponentsSource).toContain('language-');
    expect(mdxComponentsSource).toContain('wrapper: TinyrackMdxWrapper');
    expect(mdxComponentsSource).toContain('pre: TinyrackMdxPre');
    expect(mdxComponentsSource).toContain('code: TinyrackMdxCode');
    expect(mdxComponentsSource).toContain('table: TinyrackMdxTable');
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
  });

  it('keeps documentation in markdown-first MDX with Tinyrack renderer overrides', () => {
    const files = collectFiles('stories');
    const docsFiles = [
      'stories/welcome.mdx',
      'stories/foundations/colors.mdx',
      'stories/foundations/typography.mdx',
      'stories/foundations/spacing.mdx',
      'stories/foundations/radius.mdx',
      'stories/components/badge.docs.mdx',
      'stories/components/button.docs.mdx',
      'stories/components/code-block.docs.mdx',
      'stories/components/code.docs.mdx',
      'stories/components/form-checkbox.docs.mdx',
      'stories/components/form-field.docs.mdx',
      'stories/components/form-input.docs.mdx',
      'stories/components/form-radio.docs.mdx',
      'stories/components/form-select.docs.mdx',
      'stories/components/form-switch.docs.mdx',
      'stories/components/form-textarea.docs.mdx',
      'stories/components/form.docs.mdx',
      'stories/components/link.docs.mdx',
      'stories/components/table.docs.mdx',
      'stories/components/tabs.docs.mdx',
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
        const proseAndJsxSource = stripMarkdownCodeFences(source);

        expect(proseAndJsxSource).not.toContain(
          "from '../../src/components/code-block/shiki-react.js'",
        );
        expect(proseAndJsxSource).not.toMatch(/<ShikiCodeBlock\s+code=/);
      }
    }

    const codeBlockDocs = readText('stories/components/code-block.docs.mdx');
    const codeDocs = readText('stories/components/code.docs.mdx');
    const radiusDocs = readText('stories/foundations/radius.mdx');
    const welcomeDocs = readText('stories/welcome.mdx');

    expect(codeBlockDocs).toContain('```typescript');
    expect(codeBlockDocs).toContain('```tsx');
    expect(codeBlockDocs).toContain('```html');
    expect(codeDocs).toContain('Run `pnpm verify` before publishing.');
    expect(radiusDocs).toContain('| Token | Value | Use |');
    expect(welcomeDocs).toContain('```sh');
    expect(welcomeDocs).toContain('```css');
    expect(welcomeDocs).toContain('```html');
    expect(welcomeDocs).toContain('```tsx');
  });

  it('keeps Welcome as the installation and usage entry point', () => {
    const welcomeSource = readText('stories/welcome.mdx');
    const previewSource = readText('.storybook/preview.tsx');

    expect(welcomeSource).toContain('Installation');
    expect(welcomeSource).toContain('Usage');
    expect(welcomeSource).toContain('pnpm add @tinyrack/ui');
    expect(welcomeSource).toContain('pnpm add tailwindcss');
    expect(welcomeSource).toContain('pnpm add react react-dom');
    expect(welcomeSource).toContain('pnpm add shiki');
    expect(welcomeSource).toContain('@tinyrack/ui/components/badge/react');
    expect(welcomeSource).toContain('@tinyrack/ui/components/badge/badge.css');
    expect(welcomeSource).toContain('@tinyrack/ui/components/code-block/react');
    expect(welcomeSource).toContain('@tinyrack/ui/components/code-block/shiki-react');
    expect(welcomeSource).toContain(
      '@tinyrack/ui/components/code-block/code-block.css',
    );
    expect(welcomeSource).toContain('@tinyrack/ui/components/code/react');
    expect(welcomeSource).toContain('@tinyrack/ui/components/code/code.css');
    expect(welcomeSource).toContain('@tinyrack/ui/core/core.css');
    expect(welcomeSource).toContain('@tinyrack/ui/components/button/button.css');
    expect(welcomeSource).toContain('@tinyrack/ui/components/button/react');
    expect(welcomeSource).toContain('@tinyrack/ui/components/form/form.css');
    expect(welcomeSource).toContain('@tinyrack/ui/components/form/react');
    expect(welcomeSource).toContain('Use Tailwind utilities directly for layout');
    expect(welcomeSource).toContain('@tinyrack/ui/components/link/link.css');
    expect(welcomeSource).toContain('@tinyrack/ui/components/link/react');
    expect(welcomeSource).toContain('@tinyrack/ui/components/table/table.css');
    expect(welcomeSource).toContain('@tinyrack/ui/components/table/react');
    expect(welcomeSource).toContain('@tinyrack/ui/components/tabs/tabs.css');
    expect(welcomeSource).toContain('@tinyrack/ui/components/tabs/react');
    expect(previewSource).not.toContain("'CSS'");
    expect(previewSource).not.toContain("'Tailwind'");
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
      'badge.stories.tsx',
      'button.stories.tsx',
      'code-block.stories.tsx',
      'code.stories.tsx',
      'form-checkbox.stories.tsx',
      'form-field.stories.tsx',
      'form-input.stories.tsx',
      'form-radio.stories.tsx',
      'form-select.stories.tsx',
      'form-switch.stories.tsx',
      'form-textarea.stories.tsx',
      'link.stories.tsx',
      'table.stories.tsx',
      'tabs.stories.tsx',
    ]);
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
    expect(storySource).toContain('highlighted');
    expect(storySource).toContain('wrap');
    expect(storySource).toContain('args:');
    expect(storySource).toContain('argTypes:');
    expect(storySource).toContain('ShikiCodeBlock');
    expect(storySource).not.toContain('function CodeBlockDocsPage');
    expect(storySource).not.toContain('page: CodeBlockDocsPage');
    expect(storySource).not.toContain('@mantine/core');
    expect(storySource).not.toContain('daisyui');
    expect(docsSource).toContain('@tinyrack/ui/components/code-block/react');
    expect(docsSource).toContain('@tinyrack/ui/components/code-block/shiki-react');
    expect(docsSource).toContain('@tinyrack/ui/components/code-block/code-block.css');
    expect(docsSource).toContain('pnpm add shiki');
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
    expect(storySource).not.toContain('function ButtonDocsPage');
    expect(storySource).not.toContain('page: ButtonDocsPage');
    expect(storySource).not.toContain('buttonTones');
    expect(storySource).not.toContain('@mantine/core');
    expect(storySource).not.toContain('daisyui');
    expect(docsSource).toContain('@tinyrack/ui/components/button/react');
    expect(docsSource).toContain('@tinyrack/ui/components/button/button.css');
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
    expect(overviewDocsSource).toContain('className="tr-input"');
    expect(overviewDocsSource).toContain('className="tr-checkbox"');
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
    expect(readme).toContain('https://design.tinyrack.net');
    expect(readme).not.toContain('docs/');
    expect(readme).not.toContain('@tinyrack/themes');
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
});
