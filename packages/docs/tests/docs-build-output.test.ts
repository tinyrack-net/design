import { mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { afterEach, describe, expect, it } from 'vitest';
import { restoreRedirectFiles } from '../src/cli/docs-build-output.js';

const roots: string[] = [];

afterEach(() => {
  for (const root of roots.splice(0)) rmSync(root, { force: true, recursive: true });
});

describe('documentation build output', () => {
  it('restores redirect files after React Router prerender overwrites them', () => {
    const root = mkdtempSync(join(tmpdir(), 'tinyrack-docs-redirect-'));
    roots.push(root);
    mkdirSync(join(root, 'legacy'), { recursive: true });
    writeFileSync(join(root, 'index.html'), '<title>Page not found</title>');
    writeFileSync(join(root, 'legacy', 'index.html'), '<title>Page not found</title>');

    restoreRedirectFiles(root, {
      'index.html': '<meta content="0;url=/en/" http-equiv="refresh" />',
      'legacy/index.html': '<meta content="0;url=/en/intro/" http-equiv="refresh" />',
    });

    expect(readFileSync(join(root, 'index.html'), 'utf8')).toContain('url=/en/');
    expect(readFileSync(join(root, 'legacy', 'index.html'), 'utf8')).toContain(
      'url=/en/intro/',
    );
  });

  it('rejects redirect paths outside the build root', () => {
    const root = mkdtempSync(join(tmpdir(), 'tinyrack-docs-redirect-'));
    roots.push(root);
    expect(() => restoreRedirectFiles(root, { '../escape.html': 'unsafe' })).toThrow(
      'Redirect output must stay inside the client build',
    );
  });
});
