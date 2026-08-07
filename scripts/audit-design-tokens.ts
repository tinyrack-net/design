import assert from 'node:assert/strict';
import { readdirSync, readFileSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { loadDesignTokens } from './design-token-source.ts';

const root = resolve(import.meta.dirname, '..');
const web = await loadDesignTokens(root, 'web');
await loadDesignTokens(root, 'flutter');

function sourceFiles(directory: string): string[] {
  return readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const path = join(directory, entry.name);
    if (entry.isDirectory()) return sourceFiles(path);
    return entry.isFile() &&
      /\.(?:css|ts|tsx)$/.test(entry.name) &&
      !entry.name.includes('.test.')
      ? [path]
      : [];
  });
}

const componentText = [
  ...sourceFiles(resolve(root, 'packages/ui_web/src/components')),
  ...sourceFiles(resolve(root, 'packages/ui_web/src/mdx')),
]
  .map((path) => readFileSync(path, 'utf8'))
  .join('\n');
const generatedCss = readFileSync(
  resolve(root, 'packages/ui_web/src/core/tokens.generated.css'),
  'utf8',
);
const declarations = [
  ...new Set(
    Array.from(
      generatedCss.matchAll(/^\s*(--tinyrack-[a-z0-9-]+):/gm),
      (match) => match[1] as string,
    ),
  ),
];
const unused = declarations.filter((name) => !componentText.includes(name));
assert.deepEqual(
  unused,
  [],
  `Tokens without a product-code consumer:\n${unused.join('\n')}`,
);

const serialized = JSON.stringify(web);
for (const removed of [
  'measure-2xl',
  'page-gutter',
  'reading-width-sm',
  'brand-mark-sm',
  'control-width-md',
  'overlay-width-lg',
]) {
  assert.equal(
    serialized.includes(removed),
    false,
    `Removed token returned: ${removed}`,
  );
}

console.log(
  `Design token audit passed: ${declarations.length} Web runtime tokens have product consumers.`,
);
