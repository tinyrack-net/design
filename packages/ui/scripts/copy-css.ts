import { cp, mkdir, readFile } from 'node:fs/promises';
import { dirname, relative, resolve } from 'node:path';
import { componentNames } from './component-catalog.ts';

const root = resolve(import.meta.dirname, '..');
const srcRoot = resolve(root, 'src');
const distRoot = resolve(root, 'dist');

const publicAssets = [
  ...componentNames.map((componentName) => ({
    source: `components/${componentName}/${componentName}.css`,
    target: `components/${componentName}/${componentName}.css`,
  })),
  { source: 'core/core.css', target: 'core.css' },
  { source: 'internal/layer-parts.css', target: 'internal/layer-parts.css' },
  { source: 'mdx/mdx.css', target: 'mdx.css' },
] as const;

await Promise.all(
  publicAssets.map(async ({ source, target }) => {
    const sourceFile = resolve(srcRoot, source);
    const content = await readFile(sourceFile, 'utf8');
    if (content.includes('Generated from')) {
      throw new Error(
        `${relative(root, sourceFile)} must be maintained as source CSS.`,
      );
    }

    const targetFile = resolve(distRoot, target);
    await mkdir(dirname(targetFile), { recursive: true });
    await cp(sourceFile, targetFile);
    console.log(`copied ${relative(root, sourceFile)}`);
  }),
);
