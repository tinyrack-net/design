import { cp, mkdir, readFile, writeFile } from 'node:fs/promises';
import { dirname, relative, resolve } from 'node:path';

const root = resolve(import.meta.dirname, '..');
const checkMode = process.argv.includes('--check');
const assets = [{ source: 'src/styles/fonts.css', target: 'dist/fonts.css' }] as const;

const fontAssets = [
  ...[400, 500, 600, 700].map((weight) => ({
    packageName: '@fontsource/ibm-plex-sans-kr',
    file: `ibm-plex-sans-kr-korean-${weight}-normal.woff2`,
  })),
  ...[400, 500, 600, 700].map((weight) => ({
    packageName: '@fontsource/ibm-plex-sans-jp',
    file: `ibm-plex-sans-jp-japanese-${weight}-normal.woff2`,
  })),
] as const;

for (const asset of assets) {
  const source = resolve(root, asset.source);
  const content = await readFile(source, 'utf8');
  if (content.length === 0)
    throw new Error(`${relative(root, source)} must not be empty`);
  if (!checkMode) {
    const target = resolve(root, asset.target);
    await mkdir(dirname(target), { recursive: true });
    await cp(source, target);
  }
  console.log(`${checkMode ? 'checked' : 'copied'} ${relative(root, source)}`);
}

const sourceStylesPath = resolve(root, 'src/styles/styles.css');
const sourceStyles = await readFile(sourceStylesPath, 'utf8');
const distStyles = sourceStyles
  .replace(
    /^@import "@fontsource\/ibm-plex-sans-(?:kr|jp)\/(?:korean|japanese)-\d+\.css";\r?\n/gm,
    '',
  )
  .replace(
    '@import "@tinyrack/ui/core.css";',
    '@import "./fonts.css";\n@import "./runtime-core.css";',
  );
if (
  distStyles === sourceStyles ||
  distStyles.includes('@fontsource/ibm-plex-sans-kr') ||
  distStyles.includes('@fontsource/ibm-plex-sans-jp') ||
  distStyles.includes('@tinyrack/ui/core.css')
) {
  throw new Error('Unable to transform source documentation styles for dist');
}
if (!checkMode) {
  await writeFile(resolve(root, 'dist/styles.css'), distStyles);
}
console.log(
  `${checkMode ? 'checked' : 'generated'} dist/styles.css from src/styles/styles.css`,
);

const uiCoreSource = resolve(root, '../ui/src/core/core.css');
const uiCore = await readFile(uiCoreSource, 'utf8');
const runtimeCore = uiCore.replace(/^@theme static \{[\s\S]*?\r?\n\}\r?\n/, '');
if (runtimeCore === uiCore || runtimeCore.includes('@theme')) {
  throw new Error('Unable to remove the Tailwind-only @theme block from UI core CSS');
}
if (!checkMode) {
  await writeFile(resolve(root, 'dist/runtime-core.css'), runtimeCore);
}
console.log(
  `${checkMode ? 'checked' : 'generated'} dist/runtime-core.css from @tinyrack/ui core`,
);

for (const font of fontAssets) {
  const packageRoot = resolve(
    import.meta.dirname,
    `../node_modules/${font.packageName}`,
  );
  const source = resolve(packageRoot, 'files', font.file);
  await readFile(source);
  if (!checkMode) {
    const target = resolve(root, 'dist/fonts', font.file);
    await mkdir(dirname(target), { recursive: true });
    await cp(source, target);
  }
  console.log(`${checkMode ? 'checked' : 'copied'} ${font.file}`);
}
