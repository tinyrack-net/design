import { rm } from 'node:fs/promises';
import { relative, resolve } from 'node:path';

const root = resolve(import.meta.dirname, '..');
const distRoot = resolve(root, 'dist');
const distRelativePath = relative(root, distRoot);

if (distRelativePath !== 'dist') {
  throw new Error(`Refusing to remove unexpected dist path: ${distRoot}`);
}

await rm(distRoot, { force: true, recursive: true });
console.log(`removed ${distRelativePath}`);
