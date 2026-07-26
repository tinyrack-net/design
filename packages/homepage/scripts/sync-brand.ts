/**
 * Mirrors the published brand artwork into this site's `public/` directory.
 *
 * `@tinyrack/ui/src/brand` is the source of truth — it is what ships to npm.
 * The documentation pages link to `/brand/*.svg` as plain URLs (including
 * download links), so the files also have to exist as static assets here.
 * Copies are committed so the unit tests can read them without a build, and
 * `--check` keeps them from drifting away from the package.
 *
 *   pnpm --filter @tinyrack/homepage sync:brand
 *   pnpm --filter @tinyrack/homepage sync:brand --check
 */

import { readdir, readFile, writeFile } from 'node:fs/promises';
import { createRequire } from 'node:module';
import { dirname, join } from 'node:path';

const require = createRequire(import.meta.url);
const checkOnly = process.argv.includes('--check');

const packageRoot = dirname(require.resolve('@tinyrack/ui/package.json'));
const sourceDir = join(packageRoot, 'src/brand');
const targetDir = join(process.cwd(), 'public/brand');

const files = (await readdir(sourceDir)).filter((name) => name.endsWith('.svg'));
if (files.length === 0) {
  throw new Error(`No brand artwork found in ${sourceDir}`);
}

let stale = false;
for (const name of files.sort()) {
  const source = await readFile(join(sourceDir, name), 'utf8');
  const target = join(targetDir, name);

  if (checkOnly) {
    const existing = await readFile(target, 'utf8').catch(() => '');
    if (existing !== source) {
      console.error(`Brand asset is out of sync with @tinyrack/ui: ${name}`);
      stale = true;
    }
    continue;
  }

  await writeFile(target, source, 'utf8');
}

if (stale) {
  console.error('Run `pnpm --filter @tinyrack/homepage sync:brand` to refresh.');
  process.exitCode = 1;
} else {
  console.log(
    checkOnly
      ? `Brand artwork matches @tinyrack/ui (${files.length} files).`
      : `Synced ${files.length} brand files into public/brand.`,
  );
}
