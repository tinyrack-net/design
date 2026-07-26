import { existsSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { afterEach, describe, expect, it } from 'vitest';
import { finalizeStaticSiteBuild } from './site-build.ts';

const roots: string[] = [];

function temporaryRoot() {
  const root = mkdtempSync(join(tmpdir(), 'tinyrack-site-build-'));
  roots.push(root);
  return root;
}

afterEach(() => {
  for (const root of roots.splice(0)) rmSync(root, { force: true, recursive: true });
});

describe('finalizeStaticSiteBuild', () => {
  it('copies React Router fallback output to 404.html', () => {
    const root = temporaryRoot();
    writeFileSync(join(root, '__spa-fallback.html'), 'fallback');
    finalizeStaticSiteBuild(root, { mode: 'spa-fallback' });
    expect(readFileSync(join(root, '404.html'), 'utf8')).toBe('fallback');
  });

  it('writes an explicitly supplied 404 page', () => {
    const root = temporaryRoot();
    finalizeStaticSiteBuild(root, { html: '<h1>Missing</h1>', mode: 'html' });
    expect(readFileSync(join(root, '404.html'), 'utf8')).toBe('<h1>Missing</h1>');
  });

  it('fails when the requested SPA fallback does not exist', () => {
    const root = temporaryRoot();
    expect(() => finalizeStaticSiteBuild(root, { mode: 'spa-fallback' })).toThrow(
      'SPA fallback was not found',
    );
    expect(existsSync(join(root, '404.html'))).toBe(false);
  });
});
