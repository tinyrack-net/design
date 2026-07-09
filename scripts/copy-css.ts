import { cp, mkdir, readFile } from 'node:fs/promises';
import { dirname, relative, resolve } from 'node:path';

const root = resolve(import.meta.dirname, '..');
const srcRoot = resolve(root, 'src');
const distRoot = resolve(root, 'dist');
const checkMode = process.argv.includes('--check');

const publicCssSourcePaths = {
  'core/core.css': 'core/core.css',
  'components/button/button.css': 'components/button/button.css',
} as const;

await Promise.all(
  Object.values(publicCssSourcePaths).map(async (sourcePath) => {
    const target = resolve(srcRoot, sourcePath);

    const existing = await readExistingFile(target);
    if (existing === null) {
      throw new Error(`${relative(root, target)} is missing.`);
    }

    if (existing.includes('Generated from')) {
      throw new Error(`${relative(root, target)} must be maintained as source CSS.`);
    }

    if (checkMode) {
      console.log(`checked ${relative(root, target)}`);
    }
  }),
);

if (checkMode) {
  process.exit(0);
}

await Promise.all(
  Object.entries(publicCssSourcePaths).map(async ([file, sourcePath]) => {
    const source = resolve(srcRoot, sourcePath);
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
