import { existsSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import packageJson from '../../package.json' with { type: 'json' };

const repoRoot = process.cwd();
const expectedJsExports = {
  '.': {
    types: './dist/exports/index.d.ts',
    import: './dist/exports/index.js',
  },
  './tokens': {
    types: './dist/exports/tokens.d.ts',
    import: './dist/exports/tokens.js',
  },
  './mantine': {
    types: './dist/exports/mantine.d.ts',
    import: './dist/exports/mantine.js',
  },
  './daisyui': {
    types: './dist/exports/daisyui.d.ts',
    import: './dist/exports/daisyui.js',
  },
  './astro/starlight': {
    types: './dist/exports/astro/starlight.d.ts',
    import: './dist/exports/astro/starlight.js',
  },
} as const;

const expectedCssExports = {
  './tailwind.css': './dist/tailwind/theme.css',
  './tailwind/daisyui.css': './dist/tailwind/daisyui.css',
  './tailwind/mantine.css': './dist/tailwind/mantine.css',
  './mantine.css': './dist/mantine/styles.css',
  './daisyui.css': './dist/daisyui/theme.css',
  './astro/starlight.css': './dist/astro/starlight/theme.css',
} as const;

describe('package exports', () => {
  it('exposes granular theme subpaths', () => {
    for (const subpath of [
      ...Object.keys(expectedJsExports),
      ...Object.keys(expectedCssExports),
    ]) {
      expect(packageJson.exports).toHaveProperty(subpath);
    }
  });

  it('maps public JavaScript exports through export modules', () => {
    expect(packageJson.exports).toMatchObject(expectedJsExports);
  });

  it('keeps public CSS exports on generated CSS paths', () => {
    expect(packageJson.exports).toMatchObject(expectedCssExports);
  });

  it('marks css files as side effects', () => {
    expect(packageJson.sideEffects).toContain('**/*.css');
  });

  it('keeps source exports isolated from implementation modules', () => {
    expect(existsSync(join(repoRoot, 'src/index.ts'))).toBe(false);
    expect(existsSync(join(repoRoot, 'src/theme/index.ts'))).toBe(false);
    expect(existsSync(join(repoRoot, 'src/integrations/mantine/index.ts'))).toBe(false);
    expect(existsSync(join(repoRoot, 'src/integrations/daisyui/index.ts'))).toBe(false);
    expect(existsSync(join(repoRoot, 'src/integrations/starlight/index.ts'))).toBe(
      false,
    );

    expect(
      readdirSync(join(repoRoot, 'src/exports'))
        .filter((file) => !file.endsWith('.test.ts'))
        .sort(),
    ).toEqual(['astro', 'daisyui.ts', 'index.ts', 'mantine.ts', 'tokens.ts']);
    expect(readdirSync(join(repoRoot, 'src/exports/astro')).sort()).toEqual([
      'starlight.ts',
    ]);
  });
});
