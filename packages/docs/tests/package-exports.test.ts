import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';
import packageJson from '../package.json' with { type: 'json' };

const sourceExports = {
  './config': {
    '@tinyrack/source': './src/entrypoints/config.ts',
    types: './dist/entrypoints/config.d.ts',
    import: './dist/entrypoints/config.js',
  },
  './react-router': {
    '@tinyrack/source': './src/entrypoints/react-router.ts',
    types: './dist/entrypoints/react-router.d.ts',
    import: './dist/entrypoints/react-router.js',
  },
  './runtime': {
    '@tinyrack/source': './src/entrypoints/runtime.ts',
    types: './dist/entrypoints/runtime.d.ts',
    import: './dist/entrypoints/runtime.js',
  },
  './vite': {
    '@tinyrack/source': './src/entrypoints/vite.ts',
    types: './dist/entrypoints/vite.d.ts',
    import: './dist/entrypoints/vite.js',
  },
  './styles.css': {
    '@tinyrack/source': './src/styles/styles.css',
    default: './dist/styles/styles.css',
  },
  './package.json': './package.json',
} as const;

const publishedExports = {
  './config': {
    types: './dist/entrypoints/config.d.ts',
    import: './dist/entrypoints/config.js',
  },
  './react-router': {
    types: './dist/entrypoints/react-router.d.ts',
    import: './dist/entrypoints/react-router.js',
  },
  './runtime': {
    types: './dist/entrypoints/runtime.d.ts',
    import: './dist/entrypoints/runtime.js',
  },
  './vite': {
    types: './dist/entrypoints/vite.d.ts',
    import: './dist/entrypoints/vite.js',
  },
  './styles.css': './dist/styles/styles.css',
  './package.json': './package.json',
} as const;

describe('@tinyrack/docs package exports', () => {
  it('publishes its consumer skill without exposing it as a JavaScript subpath', () => {
    const readme = readFileSync(resolve(import.meta.dirname, '../README.md'), 'utf8');

    expect(packageJson.files).toContain('skills');
    expect(
      existsSync(resolve(import.meta.dirname, '../skills/tinyrack-docs/SKILL.md')),
    ).toBe(true);
    expect(
      existsSync(
        resolve(import.meta.dirname, '../skills/tinyrack-docs/agents/openai.yaml'),
      ),
    ).toBe(true);
    expect(
      Object.keys(packageJson.exports).some((path) => path.startsWith('./skills')),
    ).toBe(false);
    expect(
      Object.keys(packageJson.publishConfig.exports).some((path) =>
        path.startsWith('./skills'),
      ),
    ).toBe(false);
    expect(readme).toContain('skills experimental_sync --agent codex --yes');
    expect(readme).not.toContain('skills add ./node_modules');
  });

  it('keeps package-local test and build commands', () => {
    expect(
      Object.keys(packageJson.scripts)
        .filter((name) => name === 'test' || name.startsWith('test:'))
        .sort(),
    ).toEqual(['test', 'test:e2e', 'test:prepared', 'test:unit']);
    expect(
      Object.keys(packageJson.scripts).filter((name) => name.startsWith('check')),
    ).toEqual([]);
    expect(packageJson.scripts.build).not.toContain('--filter');
    expect(packageJson.scripts).not.toHaveProperty('verify');
    expect(packageJson.scripts['test:e2e']).toBe(
      'pnpm build && vitest run --project e2e',
    );
    expect(packageJson.scripts['test:prepared']).toBe(
      'pnpm test:unit && vitest run --project e2e',
    );
  });

  it('exports the React Router runtime Layout', () => {
    const runtimeEntry = readFileSync(
      resolve(import.meta.dirname, '../src/entrypoints/runtime.ts'),
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

describe('@tinyrack/docs entrypoints boundary', () => {
  const abs = (relativePath: string) =>
    resolve(import.meta.dirname, '..', relativePath);
  const readSource = (relativePath: string) => readFileSync(abs(relativePath), 'utf8');

  const publicAreas = ['config', 'react-router', 'runtime', 'vite'] as const;

  it('routes every public subpath through the entrypoints directory', () => {
    for (const target of [
      ...Object.values(packageJson.exports),
      ...Object.values(packageJson.publishConfig.exports),
    ]) {
      if (typeof target === 'string') continue;
      for (const value of Object.values(target)) {
        // Styles ship as a raw CSS asset, not through entrypoints.
        if (value.endsWith('.css')) continue;
        expect(value).toMatch(/^\.\/(src|dist)\/entrypoints\//);
      }
    }
  });

  it('keeps the entrypoints directory as the only public barrel location', () => {
    for (const area of publicAreas) {
      expect(existsSync(abs(`src/entrypoints/${area}.ts`))).toBe(true);
      // Implementation folders must not reintroduce a public barrel.
      expect(existsSync(abs(`src/${area}/index.ts`))).toBe(false);
    }
    // The half-applied internal/ boundary was folded back into implementation.
    expect(existsSync(abs('src/internal'))).toBe(false);
  });

  it('drops the internalized symbols from the entrypoint barrels', () => {
    const removedBySymbol: Record<string, readonly string[]> = {
      'src/entrypoints/config.ts': [
        'normalizeBasePath',
        'normalizeDocumentPathname',
        // The highlighting catalog folded into config, but its engine and guards
        // stay internal.
        'createDocsHighlighter',
        'CreateDocsHighlighterOptions',
        'isDocsHighlightLanguage',
        'isDocsHighlightTheme',
      ],
      'src/entrypoints/react-router.ts': [
        'finalizeStaticSiteBuild',
        'StaticSiteNotFoundStrategy',
      ],
      'src/entrypoints/vite.ts': [
        'tinyrackSiteAssets',
        'createSiteAssetSources',
        'docsManifestModuleId',
      ],
    };

    for (const [file, symbols] of Object.entries(removedBySymbol)) {
      const barrel = readSource(file);
      for (const symbol of symbols) {
        expect(barrel).not.toContain(symbol);
      }
    }
  });

  it('no longer exposes the non-documentation-site subpath', () => {
    expect('./site' in packageJson.exports).toBe(false);
    expect('./site' in packageJson.publishConfig.exports).toBe(false);
  });
});
