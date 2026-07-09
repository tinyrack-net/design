import { existsSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import packageJson from '../package.json' with { type: 'json' };

const repoRoot = process.cwd();
const expectedJsExports = {
  './core': {
    types: './dist/core/index.d.ts',
    import: './dist/core/index.js',
  },
  './components/button/react': {
    types: './dist/components/button/react.d.ts',
    import: './dist/components/button/react.js',
  },
  './components/table/react': {
    types: './dist/components/table/react.d.ts',
    import: './dist/components/table/react.js',
  },
} as const;

const expectedCssExports = {
  './components/button/button.css': './dist/components/button/button.css',
  './components/table/table.css': './dist/components/table/table.css',
  './core/core.css': './dist/core/core.css',
} as const;

describe('package exports', () => {
  it('exposes only the domain-owned public surface', () => {
    expect(packageJson.name).toBe('@tinyrack/ui');
    expect(packageJson.version).toBe('0.1.0');
    expect(packageJson.exports).toEqual({
      ...expectedJsExports,
      ...expectedCssExports,
      './package.json': './package.json',
    });
  });

  it('does not expose removed root, token, aggregate, or adapter subpaths', () => {
    for (const subpath of [
      '.',
      './tokens',
      './styles.css',
      './tailwind.css',
      './react/button',
      './react/table',
      './mantine',
      './mantine.css',
      './daisyui',
      './daisyui.css',
      './astro/starlight',
      './astro/starlight.css',
      './tailwind/mantine.css',
      './tailwind/daisyui.css',
    ]) {
      expect(Object.hasOwn(packageJson.exports, subpath)).toBe(false);
    }
  });

  it('marks css files as side effects', () => {
    expect(packageJson.sideEffects).toContain('**/*.css');
  });

  it('keeps source modules owned by their domains', () => {
    expect(existsSync(join(repoRoot, 'src/exports'))).toBe(false);
    expect(existsSync(join(repoRoot, 'src/index.ts'))).toBe(false);
    expect(existsSync(join(repoRoot, 'src/tokens.ts'))).toBe(false);
    expect(existsSync(join(repoRoot, 'src/react'))).toBe(false);
    expect(existsSync(join(repoRoot, 'src/button'))).toBe(false);
    expect(existsSync(join(repoRoot, 'src/theme'))).toBe(false);
    expect(existsSync(join(repoRoot, 'src/integrations'))).toBe(false);
    expect(existsSync(join(repoRoot, 'src/core/css'))).toBe(false);
    expect(existsSync(join(repoRoot, 'src/tailwind.css'))).toBe(false);
    expect(existsSync(join(repoRoot, 'src/package-exports.test.ts'))).toBe(false);
    expect(existsSync(join(repoRoot, 'src/core/index.ts'))).toBe(true);
    expect(existsSync(join(repoRoot, 'src/core/core.css'))).toBe(true);
    expect(existsSync(join(repoRoot, 'src/components/button/react.tsx'))).toBe(true);
    expect(existsSync(join(repoRoot, 'src/components/button/button.css'))).toBe(true);
    expect(existsSync(join(repoRoot, 'src/components/table/react.tsx'))).toBe(true);
    expect(existsSync(join(repoRoot, 'src/components/table/table.css'))).toBe(true);
    expect(packageJson.exports).not.toHaveProperty('./components/button/contract');
    expect(packageJson.exports).not.toHaveProperty('./components/table/contract');

    expect(
      readdirSync(join(repoRoot, 'src/components/button'))
        .filter(
          (file) =>
            !file.includes('.test.') && (file.endsWith('.ts') || file.endsWith('.tsx')),
        )
        .sort(),
    ).toEqual(['contract.ts', 'react.tsx']);
    expect(
      readdirSync(join(repoRoot, 'src/components/table'))
        .filter(
          (file) =>
            !file.includes('.test.') && (file.endsWith('.ts') || file.endsWith('.tsx')),
        )
        .sort(),
    ).toEqual(['contract.ts', 'react.tsx']);
  });

  it('keeps root executable checks out of scripts', () => {
    expect(existsSync(join(repoRoot, 'scripts/test-dist-package.ts'))).toBe(false);
    expect(existsSync(join(repoRoot, 'e2e/dist-package-smoke.ts'))).toBe(true);
    expect(existsSync(join(repoRoot, 'scripts/audit-storybook-scenarios.ts'))).toBe(
      false,
    );
  });
});
