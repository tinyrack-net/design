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
    expect(source).not.toContain('@custom-media');
    expect(source).not.toContain('@media (--tinyrack-breakpoint-');
  });

  it('copies the authored stylesheet without transformations or vendored fonts', () => {
    const script = read('scripts/copy-css.ts');

    expect(script).toContain("source: 'src/styles/styles.css'");
    expect(script).toContain("target: 'dist/styles.css'");
    expect(script).not.toContain('.replace(');
    expect(script).not.toContain('runtime-core');
    expect(script).not.toContain('../ui/src');
    expect(script).not.toContain('fontAssets');
  });
});
