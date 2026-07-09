import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs';
import { join, relative } from 'node:path';
import ts from 'typescript';
import { describe, expect, it } from 'vitest';

const repoRoot = process.cwd();
const allowedPreviewImports = [
  '@import "tailwindcss";',
  '@import "../src/core/core.css";',
  '@import "../src/components/button/button.css";',
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
      ]),
    );
  });

  it('keeps the Storybook preview bound to the allowed Tinyrack CSS imports', () => {
    const mainSource = readText('.storybook/main.ts');
    const previewSource = readText('.storybook/preview.tsx');
    const previewCss = readText('.storybook/preview.css');
    const previewImports = previewCss
      .split('\n')
      .map((line) => line.trim())
      .filter((line) => line.startsWith('@import'));

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
    expect(previewSource).not.toContain('globalTypes');
    expect(previewSource).not.toContain('document.documentElement.dataset');
    expect(previewSource).not.toContain('data-theme={theme}');
    expect(previewSource).not.toContain('MantineProvider');
    expect(previewSource).not.toContain('daisyUI/');
    expect(previewSource).not.toContain('Mantine/');
    expect(previewImports).toEqual(allowedPreviewImports);
    expect(previewCss).toContain(':root[data-theme="tinyrack-light"]');
    expect(previewCss).toContain(':root[data-theme="tinyrack-dark"]');
    expect(previewCss).toContain(`body[data-theme] .sbdocs.sbdocs-wrapper {
  padding: 0;
  background: var(--tinyrack-surface);
}`);
    expect(previewCss).not.toContain('@import "../src/integrations/styles.css";');
    expect(previewCss).not.toContain('@plugin "daisyui"');
    expect(previewCss).not.toContain('@mantine');
  });

  it('keeps documentation in MDX without shared docs component wrappers', () => {
    const files = collectFiles('stories');
    const docsFiles = [
      'stories/welcome.mdx',
      'stories/foundations/colors.mdx',
      'stories/foundations/typography.mdx',
      'stories/foundations/spacing.mdx',
      'stories/foundations/radius.mdx',
      'stories/components/button.docs.mdx',
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
    }
  });

  it('keeps Welcome as the installation and usage entry point', () => {
    const welcomeSource = readText('stories/welcome.mdx');
    const previewSource = readText('.storybook/preview.tsx');

    expect(welcomeSource).toContain('## Installation');
    expect(welcomeSource).toContain('## Usage');
    expect(welcomeSource).toContain('pnpm add @tinyrack/ui');
    expect(welcomeSource).toContain('pnpm add tailwindcss');
    expect(welcomeSource).toContain('pnpm add react react-dom');
    expect(welcomeSource).toContain('@tinyrack/ui/core/core.css');
    expect(welcomeSource).toContain('@tinyrack/ui/components/button/button.css');
    expect(welcomeSource).toContain('@tinyrack/ui/components/button/react');
    expect(welcomeSource).toContain('@tinyrack/ui/components/table/table.css');
    expect(welcomeSource).toContain('@tinyrack/ui/components/table/react');
    expect(welcomeSource).toContain('@tinyrack/ui/components/tabs/tabs.css');
    expect(welcomeSource).toContain('@tinyrack/ui/components/tabs/react');
    expect(previewSource).not.toContain("'CSS'");
    expect(previewSource).not.toContain("'Tailwind'");
  });

  it('keeps owned component stories in the component gallery', () => {
    expect(existsSync(join(repoRoot, 'stories/components/button.stories.tsx'))).toBe(
      true,
    );
    expect(existsSync(join(repoRoot, 'stories/components/button.docs.mdx'))).toBe(true);
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
    ).toEqual(['button.stories.tsx', 'table.stories.tsx', 'tabs.stories.tsx']);
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
    expect(storySource).toContain('caption');
    expect(storySource).toContain('striped');
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
