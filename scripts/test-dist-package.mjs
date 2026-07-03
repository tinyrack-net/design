import { existsSync, readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

function assert(condition, message) {
  if (!condition) {
    throw new Error(message);
  }
}

function resolvePackageSubpath(subpath) {
  return fileURLToPath(import.meta.resolve(`@tinyrack/themes${subpath}`));
}

async function assertJsExport(subpath, expectedExports) {
  const resolvedPath = resolvePackageSubpath(subpath);

  assert(
    resolvedPath.includes('/dist/') || resolvedPath.includes('\\dist\\'),
    `${subpath || '/'} should resolve to dist, received ${resolvedPath}`,
  );
  assert(existsSync(resolvedPath), `${subpath || '/'} resolved file is missing`);

  const module = await import(`@tinyrack/themes${subpath}`);

  for (const exportName of expectedExports) {
    assert(exportName in module, `${subpath || '/'} is missing export ${exportName}`);
  }

  return module;
}

function assertCssExport(subpath, expectedContents) {
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

const rootModule = await assertJsExport('', ['tinyrackTokens']);
const tokensModule = await assertJsExport('/tokens', [
  'tinyrackTokens',
  'tinyrackSemanticColors',
]);
const mantineModule = await assertJsExport('/mantine', [
  'createTinyrackMantineTheme',
  'tinyrackMantineTheme',
  'TinyrackMantineProvider',
]);
const daisyUiModule = await assertJsExport('/daisyui', ['tinyrackDaisyUiThemes']);
const starlightModule = await assertJsExport('/astro/starlight', [
  'tinyrackStarlightTheme',
  'withTinyrackStarlightTheme',
]);

assert(
  rootModule.tinyrackTokens === tokensModule.tinyrackTokens,
  'root tokens export should match /tokens',
);
assert(
  tokensModule.tinyrackSemanticColors.dark.primary === '#fafafa',
  'dark primary semantic color changed unexpectedly',
);
assert(
  mantineModule.tinyrackMantineTheme.primaryColor === 'tinyrack',
  'Mantine theme should use the tinyrack primary color',
);
assert(
  daisyUiModule.tinyrackDaisyUiThemes.dark.name === 'tinyrack-dark',
  'daisyUI dark theme name changed unexpectedly',
);

const themedConfig = starlightModule.withTinyrackStarlightTheme({
  title: 'Docs',
  customCss: ['./src/styles/global.css'],
});

assert(
  themedConfig.customCss[0] === '@tinyrack/themes/astro/starlight.css',
  'Starlight helper should prepend the package CSS subpath',
);

assertCssExport('/tailwind.css', ['@theme', '--color-tinyrack-primary']);
assertCssExport('/tailwind/daisyui.css', [
  '@import "./theme.css"',
  '@plugin "daisyui"',
]);
assertCssExport('/tailwind/mantine.css', [
  '@import "./theme.css"',
  '@import "../mantine/styles.css"',
]);
assertCssExport('/mantine.css', ['--tinyrack-surface', '.mantine-focus-auto']);
assertCssExport('/daisyui.css', ['tinyrack-light', 'tinyrack-dark']);
assertCssExport('/astro/starlight.css', ['--sl-color-accent']);

console.log('dist package smoke test passed');
