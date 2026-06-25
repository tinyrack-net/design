import { globSync } from 'node:fs';
import { cp, mkdir } from 'node:fs/promises';
import { dirname, relative, resolve } from 'node:path';

const root = resolve(import.meta.dirname, '..');
const srcRoot = resolve(root, 'src');
const distRoot = resolve(root, 'dist');

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
