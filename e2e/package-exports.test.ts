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
  './components/badge/react': {
    types: './dist/components/badge/react.d.ts',
    import: './dist/components/badge/react.js',
  },
  './components/button/react': {
    types: './dist/components/button/react.d.ts',
    import: './dist/components/button/react.js',
  },
  './components/code-block/react': {
    types: './dist/components/code-block/react.d.ts',
    import: './dist/components/code-block/react.js',
  },
  './components/code-block/shiki-react': {
    types: './dist/components/code-block/shiki-react.d.ts',
    import: './dist/components/code-block/shiki-react.js',
  },
  './components/code/react': {
    types: './dist/components/code/react.d.ts',
    import: './dist/components/code/react.js',
  },
  './components/form/react': {
    types: './dist/components/form/react.d.ts',
    import: './dist/components/form/react.js',
  },
  './components/link/react': {
    types: './dist/components/link/react.d.ts',
    import: './dist/components/link/react.js',
  },
  './components/table/react': {
    types: './dist/components/table/react.d.ts',
    import: './dist/components/table/react.js',
  },
  './components/tabs/react': {
    types: './dist/components/tabs/react.d.ts',
    import: './dist/components/tabs/react.js',
  },
} as const;

const expectedCssExports = {
  './components/badge/badge.css': './dist/components/badge/badge.css',
  './components/button/button.css': './dist/components/button/button.css',
  './components/code-block/code-block.css':
    './dist/components/code-block/code-block.css',
  './components/code/code.css': './dist/components/code/code.css',
  './components/form/form.css': './dist/components/form/form.css',
  './components/link/link.css': './dist/components/link/link.css',
  './components/table/table.css': './dist/components/table/table.css',
  './components/tabs/tabs.css': './dist/components/tabs/tabs.css',
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
      './react/feedback',
      './react/form',
      './react/link',
      './react/table',
      './react/tabs',
      './components/badge/contract',
      './components/table/contract',
      './components/tabs/contract',
      './components/code-block/contract',
      './components/code/contract',
      './components/feedback/contract',
      './components/feedback/react',
      './components/feedback/feedback.css',
      './components/form/contract',
      './components/form/input',
      './components/input/react',
      './components/textarea/react',
      './components/select/react',
      './components/checkbox/react',
      './components/radio/react',
      './components/switch/react',
      './components/link/contract',
      './components/layout/react',
      './components/layout/layout.css',
      './components/layout/contract',
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

  it('keeps Shiki optional for the client syntax highlighter', () => {
    expect(packageJson.peerDependencies.shiki).toBe('^4.3.1');
    expect(packageJson.peerDependenciesMeta?.shiki?.optional).toBe(true);
    expect(packageJson.devDependencies.shiki).toBe('4.3.1');
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
    expect(existsSync(join(repoRoot, 'src/components/badge/react.tsx'))).toBe(true);
    expect(existsSync(join(repoRoot, 'src/components/badge/badge.css'))).toBe(true);
    expect(existsSync(join(repoRoot, 'src/components/button/react.tsx'))).toBe(true);
    expect(existsSync(join(repoRoot, 'src/components/button/button.css'))).toBe(true);
    expect(existsSync(join(repoRoot, 'src/components/code-block/react.tsx'))).toBe(
      true,
    );
    expect(
      existsSync(join(repoRoot, 'src/components/code-block/shiki-react.tsx')),
    ).toBe(true);
    expect(existsSync(join(repoRoot, 'src/components/code-block/code-block.css'))).toBe(
      true,
    );
    expect(existsSync(join(repoRoot, 'src/components/code/react.tsx'))).toBe(true);
    expect(existsSync(join(repoRoot, 'src/components/code/code.css'))).toBe(true);
    expect(existsSync(join(repoRoot, 'src/components/feedback'))).toBe(false);
    expect(existsSync(join(repoRoot, 'src/components/form/react.tsx'))).toBe(true);
    expect(existsSync(join(repoRoot, 'src/components/form/form.css'))).toBe(true);
    expect(existsSync(join(repoRoot, 'src/components/layout'))).toBe(false);
    expect(existsSync(join(repoRoot, 'src/components/link/react.tsx'))).toBe(true);
    expect(existsSync(join(repoRoot, 'src/components/link/link.css'))).toBe(true);
    expect(existsSync(join(repoRoot, 'src/components/table/react.tsx'))).toBe(true);
    expect(existsSync(join(repoRoot, 'src/components/table/table.css'))).toBe(true);
    expect(existsSync(join(repoRoot, 'src/components/tabs/react.tsx'))).toBe(true);
    expect(existsSync(join(repoRoot, 'src/components/tabs/tabs.css'))).toBe(true);
    expect(packageJson.exports).not.toHaveProperty('./components/badge/contract');
    expect(packageJson.exports).not.toHaveProperty('./components/button/contract');
    expect(packageJson.exports).not.toHaveProperty('./components/code-block/contract');
    expect(packageJson.exports).not.toHaveProperty('./components/code/contract');
    expect(packageJson.exports).not.toHaveProperty('./components/feedback/react');
    expect(packageJson.exports).not.toHaveProperty(
      './components/feedback/feedback.css',
    );
    expect(packageJson.exports).not.toHaveProperty('./components/feedback/contract');
    expect(packageJson.exports).not.toHaveProperty('./components/form/contract');
    expect(packageJson.exports).not.toHaveProperty('./components/layout/react');
    expect(packageJson.exports).not.toHaveProperty('./components/layout/layout.css');
    expect(packageJson.exports).not.toHaveProperty('./components/layout/contract');
    expect(packageJson.exports).not.toHaveProperty('./components/link/contract');
    expect(packageJson.exports).not.toHaveProperty('./components/table/contract');
    expect(packageJson.exports).not.toHaveProperty('./components/tabs/contract');

    expect(
      readdirSync(join(repoRoot, 'src/components/badge'))
        .filter(
          (file) =>
            !file.includes('.test.') && (file.endsWith('.ts') || file.endsWith('.tsx')),
        )
        .sort(),
    ).toEqual(['contract.ts', 'react.tsx']);
    expect(
      readdirSync(join(repoRoot, 'src/components/button'))
        .filter(
          (file) =>
            !file.includes('.test.') && (file.endsWith('.ts') || file.endsWith('.tsx')),
        )
        .sort(),
    ).toEqual(['contract.ts', 'react.tsx']);
    expect(
      readdirSync(join(repoRoot, 'src/components/code-block'))
        .filter(
          (file) =>
            !file.includes('.test.') && (file.endsWith('.ts') || file.endsWith('.tsx')),
        )
        .sort(),
    ).toEqual(['contract.ts', 'react.tsx', 'shiki-react.tsx']);
    expect(
      readdirSync(join(repoRoot, 'src/components/code'))
        .filter(
          (file) =>
            !file.includes('.test.') && (file.endsWith('.ts') || file.endsWith('.tsx')),
        )
        .sort(),
    ).toEqual(['contract.ts', 'react.tsx']);
    expect(
      readdirSync(join(repoRoot, 'src/components/form'))
        .filter(
          (file) =>
            !file.includes('.test.') && (file.endsWith('.ts') || file.endsWith('.tsx')),
        )
        .sort(),
    ).toEqual([
      'choice-controls.tsx',
      'contract.ts',
      'field.tsx',
      'react.tsx',
      'text-controls.tsx',
    ]);
    expect(
      readdirSync(join(repoRoot, 'src/components/link'))
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
    expect(
      readdirSync(join(repoRoot, 'src/components/tabs'))
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
