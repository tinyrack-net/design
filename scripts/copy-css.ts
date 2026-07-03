import { globSync } from 'node:fs';
import { cp, mkdir, readFile, writeFile } from 'node:fs/promises';
import { dirname, relative, resolve } from 'node:path';
import { pathToFileURL } from 'node:url';

const root = resolve(import.meta.dirname, '..');
const srcRoot = resolve(root, 'src');
const distRoot = resolve(root, 'dist');
const checkMode = process.argv.includes('--check');
const srcOnly = process.argv.includes('--src-only');

type ThemeCssModule = typeof import('../src/css/create-tinyrack-theme-css.js');

const { createTinyrackThemeCssFiles } = (await import(
  pathToFileURL(resolve(root, 'dist/css/create-tinyrack-theme-css.js')).href
).catch((error: unknown) => {
  throw new Error(
    'CSS generation needs compiled theme helpers. Run `pnpm build:types` before this script.',
    { cause: error },
  );
})) as ThemeCssModule;

const generatedCssFiles = createTinyrackThemeCssFiles();

await Promise.all(
  Object.entries(generatedCssFiles).map(async ([file, contents]) => {
    const target = resolve(srcRoot, file);

    if (checkMode) {
      const existing = await readExistingFile(target);
      if (existing === null) {
        return;
      }
      if (existing !== contents) {
        throw new Error(
          `${relative(root, target)} is out of date. Run \`pnpm build:css\` to regenerate it.`,
        );
      }
      return;
    }

    await mkdir(dirname(target), { recursive: true });
    await writeFile(target, contents);
    console.log(`generated ${relative(root, target)}`);
  }),
);

if (checkMode) {
  process.exit(0);
}

if (srcOnly) {
  process.exit(0);
}

const cssFiles = globSync('**/*.css', { cwd: srcRoot });
await Promise.all(
  cssFiles.map(async (file) => {
    const source = resolve(srcRoot, file);
    const target = resolve(distRoot, file);
    await mkdir(dirname(target), { recursive: true });
    await cp(source, target);
    console.log(`copied ${relative(root, source)} -> ${relative(root, target)}`);
  }),
);

async function readExistingFile(path: string) {
  try {
    return await readFile(path, 'utf8');
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
      return null;
    }
    throw error;
  }
}
