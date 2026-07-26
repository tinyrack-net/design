import { copyFileSync, existsSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

export type StaticSiteNotFoundStrategy =
  | { html: string; mode: 'html' }
  | { mode: 'spa-fallback' };

export function finalizeStaticSiteBuild(
  clientRoot: string,
  notFound: StaticSiteNotFoundStrategy,
) {
  const target = join(clientRoot, '404.html');
  if (notFound.mode === 'html') {
    writeFileSync(target, notFound.html, 'utf8');
    return;
  }

  const fallback = join(clientRoot, '__spa-fallback.html');
  if (!existsSync(fallback)) {
    throw new Error(
      `React Router SPA fallback was not found at ${fallback}; cannot create 404.html`,
    );
  }
  copyFileSync(fallback, target);
}
