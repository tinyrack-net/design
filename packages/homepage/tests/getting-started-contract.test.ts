import { execFileSync } from 'node:child_process';
import {
  mkdirSync,
  mkdtempSync,
  readdirSync,
  readFileSync,
  rmdirSync,
  rmSync,
  writeFileSync,
} from 'node:fs';
import { join } from 'node:path';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { gettingStartedContract } from '../app/documentation/shared/getting-started-contract.js';

let fixtureRoot = '';
const fixtureParent = join(import.meta.dirname, '..', '.tmp');
const viteCli = join(
  import.meta.dirname,
  '..',
  'node_modules',
  'vite',
  'bin',
  'vite.js',
);

function write(path: string, source: string) {
  writeFileSync(join(fixtureRoot, path), source);
}

function filesUnder(path: string): string[] {
  return readdirSync(path, { withFileTypes: true }).flatMap((entry) => {
    const resolved = join(path, entry.name);
    return entry.isDirectory() ? filesUnder(resolved) : [resolved];
  });
}

beforeAll(() => {
  mkdirSync(fixtureParent, { recursive: true });
  fixtureRoot = mkdtempSync(join(fixtureParent, 'getting-started-'));
  mkdirSync(join(fixtureRoot, 'src'));
  write('vite.config.ts', gettingStartedContract.vite);
  write('src/styles.css', gettingStartedContract.styles);
  write(
    'src/main.jsx',
    `import React from 'react';
import { createRoot } from 'react-dom/client';
import './styles.css';
${gettingStartedContract.button}

createRoot(document.getElementById('root')).render(<DeployButton />);
`,
  );
  write(
    'index.html',
    `${gettingStartedContract.theme}<head></head><body><div id="root"></div><script type="module" src="/src/main.jsx"></script></body></html>`,
  );
});

afterAll(() => {
  if (fixtureRoot !== '') rmSync(fixtureRoot, { force: true, recursive: true });
  try {
    rmdirSync(fixtureParent);
  } catch {
    // Preserve unrelated fixtures when the shared temporary directory is not empty.
  }
});

describe('canonical getting-started contract', () => {
  it('builds a minimal Vite and Tailwind consumer with themed button styles', () => {
    execFileSync(process.execPath, [viteCli, 'build'], {
      cwd: fixtureRoot,
      encoding: 'utf8',
      env: { ...process.env, CI: 'true' },
      stdio: 'pipe',
    });

    const output = filesUnder(join(fixtureRoot, 'dist'));
    const html = readFileSync(join(fixtureRoot, 'dist/index.html'), 'utf8');
    const css = output
      .filter((path) => path.endsWith('.css'))
      .map((path) => readFileSync(path, 'utf8'))
      .join('\n');
    const javascript = output
      .filter((path) => path.endsWith('.js'))
      .map((path) => readFileSync(path, 'utf8'))
      .join('\n');

    expect(html).toContain('data-theme="tinyrack-light"');
    expect(css).not.toContain('@theme');
    expect(css).toMatch(/\[data-theme=["']?tinyrack-light["']?\]/);
    expect(css).toContain('.tr-btn');
    expect(css).toContain('.tr-btn:focus-visible');
    expect(css).toContain('--color-tinyrack-primary');
    expect(javascript).toContain('data-intent');
    expect(javascript).toContain('primary');
  });
});
