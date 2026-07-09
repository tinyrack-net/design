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
const buttonModule = await assertJsExport<DistButtonModule>(
  '/components/button/react',
  ['Button'],
);

await assertMissingExport('');
await assertMissingExport('/tokens');
await assertMissingExport('/react/button');
assertMissingResolvedExport('/tailwind.css');
assert(!('Button' in coreModule), '/core export should not include React Button');
assert(!('tinyrackShadows' in coreModule), '/core export should not include shadows');
assert(
  coreModule.tinyrackSemanticColors.dark.primary === '#fafafa',
  'dark primary semantic color changed unexpectedly',
);
assert(
  typeof buttonModule.Button === 'object' || typeof buttonModule.Button === 'function',
  'Button export should be a React component',
);

assertCssExport('/core/core.css', ['@theme', '--color-tinyrack-primary']);
assertCssExport('/components/button/button.css', [
  '.tr-btn',
  'data-appearance="solid"',
]);

console.log('dist package smoke test passed');
