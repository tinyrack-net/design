import { globSync } from 'node:fs';
import { cp, mkdir, readFile, writeFile } from 'node:fs/promises';
import { dirname, relative, resolve } from 'node:path';

const root = resolve(import.meta.dirname, '..');
const srcRoot = resolve(root, 'src');
const distRoot = resolve(root, 'dist');
const checkMode = process.argv.includes('--check');

const { createTinyrackThemeCssFiles } = await import(
  '../dist/css/create-tinyrack-theme-css.js'
).catch((error) => {
  throw new Error(
    'CSS generation needs compiled theme helpers. Run `pnpm build:types` before this script.',
    { cause: error },
  );
});

const generatedCssFiles = createTinyrackThemeCssFiles();

await Promise.all(
  Object.entries(generatedCssFiles).map(async ([file, contents]) => {
    const target = resolve(srcRoot, file);

    if (checkMode) {
      const existing = await readFile(target, 'utf8');
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
