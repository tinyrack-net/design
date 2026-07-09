import { existsSync, readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

type DistTokenModule = Record<string, unknown> & {
  tinyrackSemanticColors: {
    dark: {
      primary: string;
    };
  };
};

type DistButtonModule = Record<string, unknown> & {
  Button: unknown;
};

type DistBadgeModule = Record<string, unknown> & {
  Badge: unknown;
};

type DistCodeModule = Record<string, unknown> & {
  Code: unknown;
};

type DistCodeBlockModule = Record<string, unknown> & {
  CodeBlock: unknown;
};

type DistShikiCodeBlockModule = Record<string, unknown> & {
  ShikiCodeBlock: unknown;
};

type DistTableModule = Record<string, unknown> & {
  Table: unknown;
  TableContainer: unknown;
};

type DistTabsModule = Record<string, unknown> & {
  Tabs: unknown;
  TabsList: unknown;
  TabsPanel: unknown;
  TabsTrigger: unknown;
};

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) {
    throw new Error(message);
  }
}

function resolvePackageSubpath(subpath: string) {
  return fileURLToPath(import.meta.resolve(`@tinyrack/ui${subpath}`));
}

async function assertJsExport<TModule extends Record<string, unknown>>(
  subpath: string,
  expectedExports: readonly string[],
) {
  const resolvedPath = resolvePackageSubpath(subpath);

  assert(
    resolvedPath.includes('/dist/') || resolvedPath.includes('\\dist\\'),
    `${subpath || '/'} should resolve to dist, received ${resolvedPath}`,
  );
  assert(existsSync(resolvedPath), `${subpath || '/'} resolved file is missing`);

  const module = (await import(`@tinyrack/ui${subpath}`)) as TModule;

  for (const exportName of expectedExports) {
    assert(exportName in module, `${subpath || '/'} is missing export ${exportName}`);
  }

  return module;
}

function assertCssExport(subpath: string, expectedContents: readonly string[]) {
  const resolvedPath = resolvePackageSubpath(subpath);

  assert(
    resolvedPath.includes('/dist/') || resolvedPath.includes('\\dist\\'),
    `${subpath} should resolve to dist, received ${resolvedPath}`,
  );
  assert(existsSync(resolvedPath), `${subpath} resolved file is missing`);

  const css = readFileSync(resolvedPath, 'utf8');

  for (const expectedContent of expectedContents) {
    assert(
      css.includes(expectedContent),
      `${subpath} does not include expected content: ${expectedContent}`,
    );
  }
}

async function assertMissingExport(subpath: string) {
  let resolved = false;

  try {
    await import(`@tinyrack/ui${subpath}`);
    resolved = true;
  } catch {
    resolved = false;
  }

  assert(!resolved, `${subpath || '/'} should not resolve`);
}

function assertMissingResolvedExport(subpath: string) {
  let resolved = false;

  try {
    resolvePackageSubpath(subpath);
    resolved = true;
  } catch {
    resolved = false;
  }

  assert(!resolved, `${subpath || '/'} should not resolve`);
}

const coreModule = await assertJsExport<DistTokenModule>('/core', [
  'tinyrackPalettes',
  'tinyrackSemanticColors',
]);
const badgeModule = await assertJsExport<DistBadgeModule>('/components/badge/react', [
  'Badge',
]);
const buttonModule = await assertJsExport<DistButtonModule>(
  '/components/button/react',
  ['Button'],
);
const codeModule = await assertJsExport<DistCodeModule>('/components/code/react', [
  'Code',
]);
const codeBlockModule = await assertJsExport<DistCodeBlockModule>(
  '/components/code-block/react',
  ['CodeBlock'],
);
const shikiCodeBlockModule = await assertJsExport<DistShikiCodeBlockModule>(
  '/components/code-block/shiki-react',
  ['ShikiCodeBlock'],
);
const tableModule = await assertJsExport<DistTableModule>('/components/table/react', [
  'Table',
  'TableContainer',
]);
const tabsModule = await assertJsExport<DistTabsModule>('/components/tabs/react', [
  'Tabs',
  'TabsList',
  'TabsPanel',
  'TabsTrigger',
]);

await assertMissingExport('');
await assertMissingExport('/tokens');
await assertMissingExport('/react/button');
await assertMissingExport('/react/table');
assertMissingResolvedExport('/tailwind.css');
assert(!('Button' in coreModule), '/core export should not include React Button');
assert(!('Badge' in coreModule), '/core export should not include React Badge');
assert(!('Code' in coreModule), '/core export should not include React Code');
assert(!('CodeBlock' in coreModule), '/core export should not include React CodeBlock');
assert(!('Table' in coreModule), '/core export should not include React Table');
assert(!('Tabs' in coreModule), '/core export should not include React Tabs');
assert(!('tinyrackShadows' in coreModule), '/core export should not include shadows');
assert(
  coreModule.tinyrackSemanticColors.dark.primary === '#fafafa',
  'dark primary semantic color changed unexpectedly',
);
assert(
  typeof badgeModule.Badge === 'object' || typeof badgeModule.Badge === 'function',
  'Badge export should be a React component',
);
assert(
  typeof buttonModule.Button === 'object' || typeof buttonModule.Button === 'function',
  'Button export should be a React component',
);
assert(
  typeof codeModule.Code === 'object' || typeof codeModule.Code === 'function',
  'Code export should be a React component',
);
assert(
  typeof codeBlockModule.CodeBlock === 'object' ||
    typeof codeBlockModule.CodeBlock === 'function',
  'CodeBlock export should be a React component',
);
assert(
  typeof shikiCodeBlockModule.ShikiCodeBlock === 'function',
  'ShikiCodeBlock export should be a React component',
);
assert(
  typeof tableModule.Table === 'object' || typeof tableModule.Table === 'function',
  'Table export should be a React component',
);
assert(
  typeof tableModule.TableContainer === 'object' ||
    typeof tableModule.TableContainer === 'function',
  'TableContainer export should be a React component',
);
assert(
  typeof tabsModule.Tabs === 'object' || typeof tabsModule.Tabs === 'function',
  'Tabs export should be a React component',
);
assert(
  typeof tabsModule.TabsList === 'object' || typeof tabsModule.TabsList === 'function',
  'TabsList export should be a React component',
);

assertCssExport('/core/core.css', ['@theme', '--color-tinyrack-primary']);
assertCssExport('/components/badge/badge.css', ['.tr-badge', 'data-size="sm"']);
assertCssExport('/components/button/button.css', [
  '.tr-btn',
  'data-appearance="solid"',
]);
assertCssExport('/components/code/code.css', ['.tr-code']);
assertCssExport('/components/code-block/code-block.css', [
  '.tr-code-block',
  'data-wrap="true"',
]);
assertCssExport('/components/table/table.css', ['.tr-table', 'data-density="normal"']);
assertCssExport('/components/tabs/tabs.css', ['.tr-tabs', 'aria-selected="true"']);

console.log('dist package smoke test passed');
