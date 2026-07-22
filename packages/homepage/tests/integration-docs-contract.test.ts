import { execFileSync } from 'node:child_process';
import {
  existsSync,
  mkdirSync,
  mkdtempSync,
  readdirSync,
  readFileSync,
  rmdirSync,
  rmSync,
  writeFileSync,
} from 'node:fs';
import { join } from 'node:path';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import {
  cspDisableStyleElementsSource,
  cspNonceSource,
  cspScrollbarSource,
} from '../app/documentation/integrations/csp.sources.js';
import {
  mdxArticleSource,
  mdxCssSource,
  mdxInstallSource,
  mdxNestedArticleSource,
  mdxSampleSource,
  mdxSampleSources,
  mdxViteConfigSource,
} from '../app/documentation/integrations/mdx-component-map.sources.js';

let fixtureRoot = '';
const homepageRoot = join(import.meta.dirname, '..');
const fixtureParent = join(homepageRoot, '.tmp');
const viteCli = join(homepageRoot, 'node_modules', 'vite', 'bin', 'vite.js');

function write(path: string, source: string) {
  writeFileSync(join(fixtureRoot, path), source);
}

function filesUnder(path: string): string[] {
  return readdirSync(path, { withFileTypes: true }).flatMap((entry) => {
    const resolved = join(path, entry.name);
    return entry.isDirectory() ? filesUnder(resolved) : [resolved];
  });
}

beforeAll(() => {
  mkdirSync(fixtureParent, { recursive: true });
  fixtureRoot = mkdtempSync(join(fixtureParent, 'integration-mdx-'));
  mkdirSync(join(fixtureRoot, 'src'));
  write('vite.config.ts', mdxViteConfigSource);
  write('src/app.css', mdxCssSource);
  write('src/content.mdx', mdxSampleSource);
  write('src/mdx-article.tsx', mdxArticleSource);
  write('src/product-page.tsx', mdxNestedArticleSource);
  write(
    'src/main.tsx',
    `import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { MdxArticle } from './mdx-article.js';
import { ProductPage } from './product-page.js';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <MdxArticle />
    <ProductPage />
  </StrictMode>,
);
`,
  );
  write(
    'index.html',
    '<div id="root"></div><script type="module" src="/src/main.tsx"></script>',
  );
});

afterAll(() => {
  if (fixtureRoot !== '') rmSync(fixtureRoot, { force: true, recursive: true });
  try {
    rmdirSync(fixtureParent);
  } catch {
    // Preserve unrelated fixtures when the shared temporary directory is not empty.
  }
});

describe('integration documentation contracts', () => {
  it('matches the installed CSP and direction provider contracts', () => {
    const baseUiStyles = readFileSync(
      join(
        homepageRoot,
        '..',
        'ui',
        'node_modules',
        '@base-ui',
        'react',
        'utils',
        'styles.mjs',
      ),
      'utf8',
    );
    const baseUiDirection = readFileSync(
      join(
        homepageRoot,
        '..',
        'ui',
        'node_modules',
        '@base-ui',
        'react',
        'internals',
        'direction-context',
        'DirectionContext.mjs',
      ),
      'utf8',
    );

    expect(cspNonceSource).toContain("`style-src-elem 'self' 'nonce-");
    expect(cspDisableStyleElementsSource).toContain(
      '<TRCSPProvider disableStyleElements nonce={nonce}>',
    );
    expect(cspScrollbarSource).toContain('scrollbar-width: none');
    expect(cspScrollbarSource).toContain('::-webkit-scrollbar');
    expect(baseUiStyles).toContain("'base-ui-disable-scrollbar'");
    expect(baseUiStyles).toContain('scrollbar-width:none');
    expect(baseUiStyles).toContain('::-webkit-scrollbar{display:none}');
    expect(baseUiDirection).toContain("context?.direction ?? 'ltr'");
    const cspGuide = readFileSync(
      join(homepageRoot, 'app/content/en/integrations/csp.mdx'),
      'utf8',
    );
    expect(cspGuide).toContain('Configure its two capabilities independently');
    expect(cspGuide).toContain('does not suppress Base UI script elements');
    expect(cspGuide).toContain('`Select.List`');
  });

  it('keeps the three locale routes structurally aligned and removes old slugs', () => {
    const documents = [
      { id: 'csp', order: 0 },
      { id: 'text-direction', order: 1 },
      { id: 'mdx', order: 2 },
    ] as const;

    for (const document of documents) {
      const english = readFileSync(
        join(homepageRoot, `app/content/en/integrations/${document.id}.mdx`),
        'utf8',
      );
      const englishHeadings = [...english.matchAll(/^## (.+)$/gm)];
      const englishExampleIds = [
        ...english.matchAll(/<ComponentExampleTabs[\s\S]*?\bid="([a-z0-9-]+)"/g),
      ].map((match) => match[1]);

      for (const locale of ['en', 'ko', 'ja'] as const) {
        const source = readFileSync(
          join(homepageRoot, `app/content/${locale}/integrations/${document.id}.mdx`),
          'utf8',
        );
        const headings = [...source.matchAll(/^## (.+)$/gm)];
        const exampleIds = [
          ...source.matchAll(/<ComponentExampleTabs[\s\S]*?\bid="([a-z0-9-]+)"/g),
        ].map((match) => match[1]);

        expect(source, `${locale}/${document.id}`).toContain('section: integrations');
        expect(source, `${locale}/${document.id}`).toContain(
          `order: ${document.order}`,
        );
        expect(headings, `${locale}/${document.id}`).toHaveLength(
          englishHeadings.length,
        );
        expect(exampleIds, `${locale}/${document.id}`).toEqual(englishExampleIds);
      }
    }

    for (const locale of ['en', 'ko', 'ja']) {
      expect(
        existsSync(
          join(
            homepageRoot,
            `app/content/${locale}/integrations/base-ui-providers.mdx`,
          ),
        ),
      ).toBe(false);
      expect(
        existsSync(
          join(homepageRoot, `app/content/${locale}/integrations/mdx-renderer.mdx`),
        ),
      ).toBe(false);
    }
    expect(readFileSync(join(homepageRoot, 'docs.config.ts'), 'utf8')).toContain(
      "ja: '連携'",
    );
  });

  it('keeps the canonical MDX setup direct, ordered, and provider-free', () => {
    expect(mdxInstallSource).toContain('@mdx-js/rollup');
    expect(mdxInstallSource).toContain('@types/mdx');
    expect(mdxInstallSource).toContain('remark-gfm');
    expect(mdxInstallSource).not.toContain('@mdx-js/react');
    expect(mdxViteConfigSource).toContain("enforce: 'pre'");
    expect(mdxViteConfigSource.indexOf('...mdx(')).toBeLessThan(
      mdxViteConfigSource.indexOf('react({'),
    );
    expect(mdxViteConfigSource).toContain('md|mdx');
    expect(mdxViteConfigSource).not.toContain('providerImportSource');
    expect(mdxArticleSource).toContain(
      '<Content components={tinyrackMdxComponents} />',
    );
    expect(mdxNestedArticleSource).toContain("ComponentPropsWithoutRef<'article'>");
    expect(mdxNestedArticleSource).toContain('components: { wrapper: ArticleWrapper }');
    expect(mdxNestedArticleSource).toContain("['tr-mdx', className]");
    for (const locale of ['en', 'ko', 'ja'] as const) {
      expect(
        readFileSync(
          join(homepageRoot, `app/documentation/integrations/mdx-sample.${locale}.mdx`),
          'utf8',
        ),
      ).toBe(mdxSampleSources[locale]);
    }
  });

  it('uses Korean haeyoche in integration prose and demo copy', () => {
    const prohibitedStyle =
      /(?:니다|습니까|십시오)|(?:했음|됐음|있음|없음|않음|였음|이었음|아니었음|(?<![가-힣])(?:함|됨|임|아님))(?=\s*(?:[.!?。"'`<]|$))/gm;
    const paths = [
      'app/content/ko/integrations/csp.mdx',
      'app/content/ko/integrations/text-direction.mdx',
      'app/content/ko/integrations/mdx.mdx',
      'app/documentation/integrations/mdx-sample.ko.mdx',
      'app/documentation/integrations/mdx-component-map.sources.ts',
      'app/documentation/integrations/text-direction.demo.tsx',
    ];
    const matches = paths.flatMap((path) => {
      const source = readFileSync(join(homepageRoot, path), 'utf8');
      return [...source.matchAll(prohibitedStyle)].map((match) => ({
        line: source.slice(0, match.index).split(/\r?\n/).length,
        path,
        text: match[0],
      }));
    });

    expect(matches).toEqual([]);
  });

  it('builds GFM and both wrapper contracts in a minimal Vite consumer', () => {
    execFileSync(process.execPath, [viteCli, 'build'], {
      cwd: fixtureRoot,
      encoding: 'utf8',
      env: { ...process.env, CI: 'true' },
      stdio: 'pipe',
    });

    const output = filesUnder(join(fixtureRoot, 'dist'));
    const css = output
      .filter((path) => path.endsWith('.css'))
      .map((path) => readFileSync(path, 'utf8'))
      .join('\n');
    const javascript = output
      .filter((path) => path.endsWith('.js'))
      .map((path) => readFileSync(path, 'utf8'))
      .join('\n');

    expect(css).toContain('.tr-mdx');
    expect(css).toContain('.tr-code-block');
    expect(css).toContain('.tr-link');
    expect(css).toContain('.tr-table');
    expect(javascript).toContain('Release checklist');
    expect(javascript).toContain('Component map');
    expect(javascript).toContain('contains-task-list');
    expect(javascript).toContain('article');
    expect(javascript).toContain('main');
  });
});
