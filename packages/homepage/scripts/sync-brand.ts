/**
 * Mirrors the published brand artwork into this site's `public/` directory.
 *
 * `@tinyrack/ui/src/brand` is the source of truth — it is what ships to npm.
 * The documentation pages link to `/brand/*` as plain URLs (including download
 * links), so the complete SVG and PNG tree also has to exist as static assets
 * here. Copies are committed so the unit tests can read them without a build,
 * and `--check` keeps the trees from drifting apart.
 *
 *   pnpm --filter @tinyrack/homepage sync:brand
 *   pnpm --filter @tinyrack/homepage sync:brand --check
 */

import { mkdir, readdir, readFile, unlink, writeFile } from 'node:fs/promises';
import { createRequire } from 'node:module';
import { dirname, join } from 'node:path';

const require = createRequire(import.meta.url);
const checkOnly = process.argv.includes('--check');

const packageRoot = dirname(require.resolve('@tinyrack/ui/package.json'));
const sourceDir = join(packageRoot, 'src/brand');
const targetDir = join(process.cwd(), 'public/brand');

async function listFiles(root: string, relativeDir = ''): Promise<string[]> {
  const directory = join(root, relativeDir);
  const entries = await readdir(directory, { withFileTypes: true }).catch(
    (error: NodeJS.ErrnoException) => {
      if (error.code === 'ENOENT') return [];
      throw error;
    },
  );
  const files = await Promise.all(
    entries.map(async (entry) => {
      const relativePath = join(relativeDir, entry.name);
      return entry.isDirectory() ? listFiles(root, relativePath) : [relativePath];
    }),
  );
  return files.flat().sort();
}

const sourceEntries = await listFiles(sourceDir);
const unexpectedSource = sourceEntries.filter(
  (name) => !name.endsWith('.svg') && !name.endsWith('.png'),
);
if (unexpectedSource.length > 0) {
  throw new Error(
    `Unexpected non-artwork files in ${sourceDir}: ${unexpectedSource.join(', ')}`,
  );
}
if (sourceEntries.length === 0) {
  throw new Error(`No brand artwork found in ${sourceDir}`);
}

let stale = false;
for (const name of sourceEntries) {
  const source = await readFile(join(sourceDir, name));
  const target = join(targetDir, name);

  if (checkOnly) {
    const existing = await readFile(target).catch(() => undefined);
    if (existing === undefined || !existing.equals(source)) {
      console.error(`Brand asset is out of sync with @tinyrack/ui: ${name}`);
      stale = true;
    }
    continue;
  }

  await mkdir(dirname(target), { recursive: true });
  await writeFile(target, source);
}

const sourceSet = new Set(sourceEntries);
const extraTargets = (await listFiles(targetDir)).filter(
  (name) => !sourceSet.has(name),
);
for (const name of extraTargets) {
  if (checkOnly) {
    console.error(`Brand asset is not published by @tinyrack/ui: ${name}`);
    stale = true;
  } else {
    await unlink(join(targetDir, name));
  }
}

if (stale) {
  console.error('Run `pnpm --filter @tinyrack/homepage sync:brand` to refresh.');
  process.exitCode = 1;
} else {
  console.log(
    checkOnly
      ? `Brand artwork matches @tinyrack/ui (${sourceEntries.length} files).`
      : `Synced ${sourceEntries.length} brand files into public/brand.`,
  );
}
