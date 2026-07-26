import { globSync, readFileSync } from 'node:fs';
import { basename, dirname, join } from 'node:path';
import { describe, expect, it } from 'vitest';

const repoRoot = process.cwd();
const stylesheets = globSync('src/components/*/*.css', { cwd: repoRoot }).sort();

/**
 * Component CSS must live in Tailwind's `components` layer.
 *
 * Unlayered CSS outranks every layered rule, so an unlayered `.tr-separator
 * { margin: 0 }` silently beat a consumer's `className="my-tinyrack-xl"` and an
 * unlayered `.tr-btn { display: inline-flex }` beat `className="md:hidden"`.
 * Tailwind registers `theme, base, components, utilities` before our CSS is
 * imported, so landing in `components` keeps component styles above preflight
 * while letting consumer utilities win — which is the whole contract of
 * shipping Tailwind-authored CSS.
 */
describe('component stylesheets', () => {
  it('finds every component stylesheet', () => {
    expect(stylesheets.length).toBeGreaterThan(50);
  });

  it.each(stylesheets)('%s is wrapped in @layer components', (file) => {
    const source = readFileSync(join(repoRoot, file), 'utf8');

    expect(source).toContain('@layer components {');
    expect(source).not.toMatch(/^@layer (?!components\b)/m);
  });

  it.each(stylesheets)('%s declares no rule outside the layer', (file) => {
    const source = readFileSync(join(repoRoot, file), 'utf8');
    const preamble = source.slice(0, source.indexOf('@layer components {'));

    // Only `@import` (which the spec requires to precede other rules),
    // Tailwind's `@reference`, and comments may sit above the layer.
    const leftovers = preamble
      .replace(/@(?:import|reference)\s+[^;]+;/g, '')
      .replace(/\/\*[\s\S]*?\*\//g, '')
      .trim();

    expect(leftovers).toBe('');
  });

  it('names each stylesheet after its directory', () => {
    for (const file of stylesheets) {
      expect(basename(file, '.css')).toBe(basename(dirname(file)));
    }
  });
});
