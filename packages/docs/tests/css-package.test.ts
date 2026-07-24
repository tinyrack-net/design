import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';

const root = resolve(import.meta.dirname, '..');

function read(path: string) {
  return readFileSync(resolve(root, path), 'utf8');
}

describe('documentation CSS packaging', () => {
  it('uses one Tailwind-processed stylesheet in source and published packages', () => {
    const source = read('src/styles/styles.css');

    expect(source).toContain('@import "@tinyrack/ui/core.css";');
    expect(source).toContain('@fontsource/ibm-plex-sans-kr');
    expect(source).toContain('@fontsource/ibm-plex-sans-jp');
    expect(source).toContain('"IBM Plex Sans KR"');
    expect(source).toContain('"IBM Plex Sans JP"');
    expect(source).toContain('@variant lg');
    expect(source).not.toContain('@custom-media');
    expect(source).not.toContain('@media (--tinyrack-breakpoint-');
  });

  it('copies the authored stylesheet through tsdown without transformations', () => {
    const config = read('tsdown.config.ts');

    expect(config).toMatch(/from:\s*'src\/styles\/styles\.css'/);
    expect(config).toMatch(/to:\s*'dist/);
    expect(config).not.toContain('.replace(');
    expect(config).not.toContain('runtime-core');
    expect(config).not.toContain('../ui/src');
    expect(config).not.toContain('fontAssets');
  });
});
