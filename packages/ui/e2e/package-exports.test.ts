import { existsSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import packageJson from '../package.json' with { type: 'json' };
import { componentNames, providerNames } from '../scripts/component-catalog.js';

const repoRoot = process.cwd();
describe('React-only package contract', () => {
  it('exposes suffix-free component, CSS, core, and MDX patterns only', () => {
    expect(packageJson.exports).toEqual({
      './components/*': {
        types: './dist/components/*/index.d.ts',
        import: './dist/components/*/index.js',
      },
      './components/*.css': './dist/components/*/*.css',
      './components/*/react': null,
      './components/*/dom': null,
      './components/overlay': null,
      './providers/*': {
        types: './dist/providers/*/index.d.ts',
        import: './dist/providers/*/index.js',
      },
      './core': {
        types: './dist/core/index.d.ts',
        import: './dist/core/index.js',
      },
      './core.css': './dist/core.css',
      './mdx': {
        types: './dist/mdx/index.d.ts',
        import: './dist/mdx/index.js',
      },
      './mdx.css': './dist/mdx.css',
      './package.json': './package.json',
    });
  });

  it('uses React as a required peer and Base UI as the behavioral dependency', () => {
    expect(packageJson.peerDependencies.react).toBe('>=19.0.0');
    expect(packageJson.peerDependencies['react-dom']).toBe('>=19.0.0');
    expect(packageJson.dependencies['@base-ui/react']).toBe('1.6.0');
    expect(packageJson.dependencies).not.toHaveProperty('@floating-ui/dom');
    expect(packageJson).not.toHaveProperty('peerDependenciesMeta');
  });

  it('contains no Astro dependency, script, or source surface', () => {
    expect(packageJson.peerDependencies).not.toHaveProperty('astro');
    expect(packageJson.devDependencies).not.toHaveProperty('astro');
    expect(packageJson.devDependencies).not.toHaveProperty('@astrojs/mdx');
    expect(packageJson.scripts).not.toHaveProperty('check:astro');
    expect(packageJson.scripts.verify).not.toContain('astro');
    expect(existsSync(join(repoRoot, 'astro.config.mjs'))).toBe(false);
    expect(existsSync(join(repoRoot, 'tsconfig.astro.json'))).toBe(false);
    expect(existsSync(join(repoRoot, 'src/mdx/astro.ts'))).toBe(false);
  });

  it.each(
    componentNames,
  )('%s resolves through its semantic index entry', (component) => {
    expect(existsSync(join(repoRoot, 'src/components', component, 'index.tsx'))).toBe(
      true,
    );
  });

  it.each(
    providerNames,
  )('%s provider resolves through its semantic index', (provider) => {
    expect(existsSync(join(repoRoot, 'src/providers', provider, 'index.tsx'))).toBe(
      true,
    );
  });

  it('does not expose compatibility aliases', () => {
    const publicExports = Object.fromEntries(
      Object.entries(packageJson.exports).filter(([, target]) => target !== null),
    );
    const exportSource = JSON.stringify(publicExports);
    expect(exportSource).not.toContain('/react');
    expect(exportSource).not.toContain('/dom');
    expect(exportSource).not.toContain('astro');
    expect(packageJson.exports['./components/*/react']).toBeNull();
    expect(packageJson.exports['./components/*/dom']).toBeNull();
    expect(Object.hasOwn(packageJson.exports, '.')).toBe(false);
  });
});
