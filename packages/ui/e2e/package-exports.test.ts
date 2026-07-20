import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import packageJson from '../package.json' with { type: 'json' };
import { componentNames, providerNames } from '../scripts/component-catalog.js';

const repoRoot = process.cwd();
const workspaceRoot = join(repoRoot, '../..');
const componentsRoot = join(repoRoot, 'src/components');
const providersRoot = join(repoRoot, 'src/providers');

function collectPascalCaseExports(source: string) {
  const exportedNames = new Set<string>();

  for (const match of source.matchAll(/export const\s+([A-Z][A-Za-z0-9]*)/g)) {
    const name = match[1];
    if (name) exportedNames.add(name);
  }
  for (const match of source.matchAll(
    /export(?: type)?\s*\{([\s\S]*?)\}(?:\s+from\s+['"][^'"]+['"])?\s*;/g,
  )) {
    const body = match[1];
    if (!body) continue;
    for (const item of body.split(',')) {
      const names = item
        .trim()
        .split(/\s+as\s+/)
        .map((part) => part.trim());
      const exportedName = names.at(-1);
      if (exportedName && /^[A-Z]/.test(exportedName)) {
        exportedNames.add(exportedName);
      }
    }
  }

  return [...exportedNames];
}

describe('React-only package contract', () => {
  it('exposes suffix-free component, CSS, core, and MDX patterns only', () => {
    expect(packageJson.exports).toEqual({
      './components/*': {
        '@tinyrack/source': './src/components/*/index.tsx',
        types: './dist/components/*/index.d.ts',
        import: './dist/components/*/index.js',
      },
      './components/*.css': {
        '@tinyrack/source': './src/components/*/*.css',
        default: './dist/components/*/*.css',
      },
      './components/*/react': null,
      './components/*/dom': null,
      './components/overlay': null,
      './providers/*': {
        '@tinyrack/source': './src/providers/*/index.tsx',
        types: './dist/providers/*/index.d.ts',
        import: './dist/providers/*/index.js',
      },
      './core': {
        '@tinyrack/source': './src/core/index.ts',
        types: './dist/core/index.d.ts',
        import: './dist/core/index.js',
      },
      './core.css': {
        '@tinyrack/source': './src/core/core.css',
        default: './dist/core.css',
      },
      './mdx': {
        '@tinyrack/source': './src/mdx/index.tsx',
        types: './dist/mdx/index.d.ts',
        import: './dist/mdx/index.js',
      },
      './mdx.css': {
        '@tinyrack/source': './src/mdx/mdx.css',
        default: './dist/mdx.css',
      },
      './package.json': './package.json',
    });
  });

  it('publishes the existing dist-only contract', () => {
    expect(packageJson.publishConfig.exports).toEqual({
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
    expect(JSON.stringify(packageJson.publishConfig)).not.toContain('@tinyrack/source');
    expect(JSON.stringify(packageJson.publishConfig)).not.toContain('./src/');
  });

  it('publishes UI releases through package-specific tags', () => {
    const workflow = readFileSync(
      join(workspaceRoot, '.github/workflows/publish-npm.yml'),
      'utf8',
    );

    expect(workflow).toContain('- "ui-v*.*.*"');
    expect(workflow).toContain(
      'package_version="ui-v$(node -p "require(\'./packages/ui/package.json\').version")"',
    );
    expect(workflow).not.toContain('- "v*.*.*"');
  });

  it('publishes provenance from the current GitHub repository', () => {
    expect(packageJson.repository).toEqual({
      type: 'git',
      url: 'git+https://github.com/tinyrack-net/design.git',
      directory: 'packages/ui',
    });
    expect(packageJson.bugs.url).toBe('https://github.com/tinyrack-net/design/issues');
  });

  it('uses React as a required peer and Base UI as the behavioral dependency', () => {
    expect(packageJson.peerDependencies.react).toBe('>=19.0.0');
    expect(packageJson.peerDependencies['react-dom']).toBe('>=19.0.0');
    expect(packageJson.dependencies['@base-ui/react']).toBe('1.6.0');
    expect(packageJson.dependencies).not.toHaveProperty('@floating-ui/dom');
    expect(packageJson).not.toHaveProperty('peerDependenciesMeta');
  });

  it('publishes UI releases through package-specific tags', () => {
    const workflow = readFileSync(
      join(workspaceRoot, '.github/workflows/publish-npm.yml'),
      'utf8',
    );
    expect(workflow).toContain('- "ui-v*.*.*"');
    expect(workflow).toContain(
      'package_version="ui-v$(node -p "require(\'./packages/ui/package.json\').version")"',
    );
    expect(workflow).not.toContain('- "v*.*.*"');
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

  it.each(componentNames)('%s exposes only TR-prefixed public symbols', (component) => {
    const source = readFileSync(join(componentsRoot, component, 'index.tsx'), 'utf8');

    expect(
      collectPascalCaseExports(source).filter(
        (name) => /^[A-Z]/.test(name) && !name.startsWith('TR'),
      ),
    ).toEqual([]);
  });

  it.each(
    providerNames,
  )('%s provider resolves through its semantic index', (provider) => {
    expect(existsSync(join(repoRoot, 'src/providers', provider, 'index.tsx'))).toBe(
      true,
    );
  });

  it.each(providerNames)('%s exposes only TR-prefixed provider symbols', (provider) => {
    const source = readFileSync(join(providersRoot, provider, 'index.tsx'), 'utf8');
    expect(
      collectPascalCaseExports(source).filter(
        (name) => name !== 'TextDirection' && !name.startsWith('TR'),
      ),
    ).toEqual([]);
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
