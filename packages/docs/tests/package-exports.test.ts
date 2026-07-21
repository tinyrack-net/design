import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';
import packageJson from '../package.json' with { type: 'json' };

const sourceExports = {
  './config': {
    '@tinyrack/source': './src/config/index.ts',
    types: './dist/config/index.d.ts',
    import: './dist/config/index.js',
  },
  './react-router': {
    '@tinyrack/source': './src/react-router/index.ts',
    types: './dist/react-router/index.d.ts',
    import: './dist/react-router/index.js',
  },
  './runtime': {
    '@tinyrack/source': './src/runtime/index.ts',
    types: './dist/runtime/index.d.ts',
    import: './dist/runtime/index.js',
  },
  './vite': {
    '@tinyrack/source': './src/vite/index.ts',
    types: './dist/vite/index.d.ts',
    import: './dist/vite/index.js',
  },
  './styles.css': {
    '@tinyrack/source': './src/styles/styles.css',
    default: './dist/styles.css',
  },
  './package.json': './package.json',
} as const;

const publishedExports = {
  './config': {
    types: './dist/config/index.d.ts',
    import: './dist/config/index.js',
  },
  './react-router': {
    types: './dist/react-router/index.d.ts',
    import: './dist/react-router/index.js',
  },
  './runtime': {
    types: './dist/runtime/index.d.ts',
    import: './dist/runtime/index.js',
  },
  './vite': {
    types: './dist/vite/index.d.ts',
    import: './dist/vite/index.js',
  },
  './styles.css': './dist/styles.css',
  './package.json': './package.json',
} as const;

describe('@tinyrack/docs package exports', () => {
  it('keeps package-local test and build commands', () => {
    expect(
      Object.keys(packageJson.scripts)
        .filter((name) => name === 'test' || name.startsWith('test:'))
        .sort(),
    ).toEqual(['test', 'test:e2e', 'test:unit']);
    expect(
      Object.keys(packageJson.scripts).filter((name) => name.startsWith('check')),
    ).toEqual([]);
    expect(packageJson.scripts.build).not.toContain('--filter');
    expect(packageJson.scripts).not.toHaveProperty('verify');
  });

  it('exports the React Router runtime Layout', () => {
    const runtimeEntry = readFileSync(
      resolve(import.meta.dirname, '../src/runtime/index.ts'),
      'utf8',
    );
    expect(runtimeEntry).toMatch(/\bLayout\b/);
    expect(runtimeEntry).not.toContain('TRLayout');
  });

  it('declares the UI dependency through the release workspace protocol', () => {
    expect(packageJson.dependencies['@tinyrack/ui']).toBe('workspace:^');
  });

  it('requires consumers to configure Tailwind through the Vite plugin', () => {
    expect(packageJson.peerDependencies['tailwindcss']).toBe('>=4.3.0 <5.0.0');
    expect(packageJson.peerDependencies['@tailwindcss/vite']).toBe('>=4.3.0 <5.0.0');
    expect(packageJson.dependencies).not.toHaveProperty('tailwindcss');
  });

  it('uses source-first workspace entries for every public subpath without a CLI', () => {
    expect(packageJson.exports).toEqual(sourceExports);
    expect('bin' in packageJson).toBe(false);

    for (const target of Object.values(sourceExports)) {
      if (typeof target === 'string') continue;
      const sourceTarget = target['@tinyrack/source'];
      expect(existsSync(resolve(import.meta.dirname, '..', sourceTarget))).toBe(true);
    }
  });

  it('rewrites the packed manifest to dist-only entries', () => {
    expect('bin' in packageJson.publishConfig).toBe(false);
    expect(packageJson.publishConfig.exports).toEqual(publishedExports);
    expect(JSON.stringify(packageJson.publishConfig)).not.toContain('@tinyrack/source');
    expect(JSON.stringify(packageJson.publishConfig)).not.toContain('./src/');
  });

  it('publishes provenance from the current GitHub repository', () => {
    expect(packageJson.repository).toEqual({
      type: 'git',
      url: 'git+https://github.com/tinyrack-net/design.git',
      directory: 'packages/docs',
    });
    expect(packageJson.bugs.url).toBe('https://github.com/tinyrack-net/design/issues');
  });
});
