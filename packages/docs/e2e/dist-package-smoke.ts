import { execFileSync } from 'node:child_process';
import {
  existsSync,
  mkdirSync,
  mkdtempSync,
  readdirSync,
  readFileSync,
  rmSync,
  writeFileSync,
} from 'node:fs';
import { dirname, join, resolve } from 'node:path';

const docsRoot = resolve(import.meta.dirname, '..');
const uiRoot = resolve(docsRoot, '../ui');
const uiPackageJson = JSON.parse(
  readFileSync(join(uiRoot, 'package.json'), 'utf8'),
) as { version: string };
const pnpm = process.platform === 'win32' ? 'pnpm.exe' : 'pnpm';
const smokeParent = join(docsRoot, '.tmp');
mkdirSync(smokeParent, { recursive: true });
const smokeRoot = mkdtempSync(join(smokeParent, 'consumer-'));
const artifactsRoot = join(smokeRoot, 'artifacts');

function run(command: string, args: string[], cwd: string) {
  execFileSync(command, args, {
    cwd,
    encoding: 'utf8',
    env: { ...process.env, CI: 'true' },
    stdio: 'pipe',
  });
}

function write(path: string, source: string) {
  mkdirSync(dirname(path), { recursive: true });
  writeFileSync(path, source);
}

function packageArchive(prefix: string) {
  const archive = readdirSync(artifactsRoot).find(
    (file) => file.startsWith(prefix) && file.endsWith('.tgz'),
  );
  if (archive === undefined) throw new Error(`Missing packed ${prefix} archive`);
  return join(artifactsRoot, archive).replaceAll('\\', '/');
}

function writeDocsConfig(root: string, basePath: '/' | '/docs') {
  write(
    join(root, 'docs.config.ts'),
    `import { defineDocsConfig } from '@tinyrack/docs/config';

export default defineDocsConfig({
  contentDir: 'app/content',
  sections: [
    { id: 'start', label: 'Start', order: 0 },
    { id: 'guides', label: 'Guides', order: 1 },
  ],
  site: {
    basePath: ${JSON.stringify(basePath)},
    description: 'Packed documentation fixture.',
    favicon: '/favicon.svg',
    locale: { language: 'en', openGraph: 'en_US' },
    logo: { dark: '/logo.svg', light: '/logo.svg' },
    title: 'Packed Docs',
    url: 'https://example.com',
  },
  theme: { default: 'dark' },
});
`,
  );
}

function createConsumer(
  basePath: '/' | '/docs',
  docsArchive: string,
  uiArchive: string,
) {
  const root = join(smokeRoot, 'fixture');
  write(
    join(root, 'package.json'),
    `${JSON.stringify(
      {
        name: 'tinyrack-docs-consumer-smoke',
        private: true,
        type: 'module',
        scripts: { build: 'tinyrack-docs build' },
        dependencies: {
          '@react-router/dev': '8.2.0',
          '@tinyrack/docs': `file:${docsArchive}`,
          '@tinyrack/ui': `file:${uiArchive}`,
          '@types/node': '24.13.3',
          '@types/react': '19.2.17',
          '@types/react-dom': '19.2.3',
          isbot: '5.2.0',
          react: '19.2.7',
          'react-dom': '19.2.7',
          'react-router': '8.2.0',
          typescript: '6.0.3',
          vite: '8.1.3',
        },
      },
      null,
      2,
    )}\n`,
  );
  write(
    join(root, 'pnpm-workspace.yaml'),
    `overrides:\n  '@tinyrack/ui': 'file:${uiArchive}'\npackages:\n  - '.'\n`,
  );
  writeDocsConfig(root, basePath);
  write(
    join(root, 'app/routes.ts'),
    `import { resolve } from 'node:path';
import { createDocsRoutes } from '@tinyrack/docs/react-router';
import config from '../docs.config.js';

export default createDocsRoutes(config, { root: resolve(import.meta.dirname, '..') });
`,
  );
  write(
    join(root, 'app/root.tsx'),
    `import '@tinyrack/docs/styles.css';

export { default, Layout, links, meta } from '@tinyrack/docs/runtime';
`,
  );
  write(
    join(root, 'app/env.d.ts'),
    `/// <reference types="vite/client" />

declare module '*.mdx' {
  import type { JSX } from 'react';
  export default function MdxContent(props: Record<string, unknown>): JSX.Element;
}
`,
  );
  write(
    join(root, 'react-router.config.ts'),
    `import { createDocsRouterConfig } from '@tinyrack/docs/react-router';
import config from './docs.config.js';

export default createDocsRouterConfig(config);
`,
  );
  write(
    join(root, 'vite.config.ts'),
    `import { tinyrackDocs } from '@tinyrack/docs/vite';
import { defineConfig } from 'vite';
import config from './docs.config.js';

export default defineConfig({ plugins: tinyrackDocs(config, { root: import.meta.dirname }) });
`,
  );
  write(
    join(root, 'tsconfig.json'),
    `${JSON.stringify(
      {
        compilerOptions: {
          allowImportingTsExtensions: true,
          exactOptionalPropertyTypes: true,
          isolatedModules: true,
          jsx: 'react-jsx',
          lib: ['ES2022', 'DOM', 'DOM.Iterable'],
          module: 'ESNext',
          moduleResolution: 'Bundler',
          noEmit: true,
          rootDirs: ['.', '.react-router/types'],
          strict: true,
          target: 'ES2022',
          types: ['node', 'vite/client'],
        },
        include: ['app', '.react-router/types', '*.ts'],
      },
      null,
      2,
    )}\n`,
  );
  write(
    join(root, 'app/content/index.mdx'),
    `---
title: "Packed Docs"
description: "A documentation site built from an installed tarball."
section: start
order: 0
---

## Welcome

This content belongs to the consumer.
`,
  );
  write(
    join(root, 'app/content/guides/install.docs.mdx'),
    `---
title: "Install"
description: "Install the packed documentation package."
section: guides
order: 0
---

## Command

\`\`\`shell
pnpm add @tinyrack/docs
\`\`\`
`,
  );
  const logo =
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32"><path fill="#0a0a0a" d="M4 4h24v24H4z"/></svg>\n';
  write(join(root, 'public/logo.svg'), logo);
  write(join(root, 'public/favicon.svg'), logo);
  return root;
}

function prepareConsumer(root: string) {
  run(pnpm, ['install', '--ignore-scripts'], root);
  for (const packageName of ['docs', 'ui']) {
    const manifestPath = join(
      root,
      'node_modules',
      '@tinyrack',
      packageName,
      'package.json',
    );
    const manifest = readFileSync(manifestPath, 'utf8');
    if (manifest.includes('@tinyrack/source') || manifest.includes('./src/')) {
      throw new Error(
        `packed @tinyrack/${packageName} leaked workspace source exports`,
      );
    }
    if (packageName === 'docs') {
      const packageJson = JSON.parse(manifest) as {
        bin?: Record<string, string>;
        dependencies?: Record<string, string>;
      };
      if (packageJson.bin?.['tinyrack-docs'] !== './dist/cli/tinyrack-docs.js') {
        throw new Error('packed @tinyrack/docs CLI does not target dist');
      }
      if (packageJson.dependencies?.['@tinyrack/ui'] !== `^${uiPackageJson.version}`) {
        throw new Error('packed @tinyrack/docs does not depend on the released UI');
      }
    }
  }
  run(pnpm, ['exec', 'react-router', 'typegen'], root);
  run(pnpm, ['exec', 'tsc', '--noEmit'], root);
}

function verifyConsumerBuild(root: string, basePath: '/' | '/docs') {
  rmSync(join(root, 'build'), { force: true, recursive: true });
  writeDocsConfig(root, basePath);
  run(pnpm, ['run', 'build'], root);

  const clientRoot = join(root, 'build/client');
  const deploymentRoot =
    basePath === '/' ? clientRoot : join(clientRoot, basePath.slice(1));
  const homePath = join(deploymentRoot, 'index.html');
  if (!existsSync(homePath)) throw new Error(`${basePath} build has no homepage`);
  const home = readFileSync(homePath, 'utf8');
  const canonical = `https://example.com${basePath === '/' ? '/' : '/docs/'}`;
  if (!home.includes(`<link href="${canonical}" rel="canonical"/>`)) {
    throw new Error(`${basePath} build has an invalid canonical URL`);
  }
  if (!/<h1[^>]*>Packed Docs<\/h1>/.test(home)) {
    throw new Error(`${basePath} build did not render the frontmatter title`);
  }
  if (!home.includes('A documentation site built from an installed tarball.')) {
    throw new Error(`${basePath} build did not render the frontmatter description`);
  }
  const expectedAssetPrefix = basePath === '/' ? '/assets/' : '/docs/assets/';
  if (!home.includes(expectedAssetPrefix)) {
    throw new Error(`${basePath} build has an invalid Vite asset base`);
  }

  if (!existsSync(join(deploymentRoot, 'guides/install/index.html'))) {
    throw new Error(`${basePath} build has no direct guide entry`);
  }
  if (!existsSync(join(deploymentRoot, 'pagefind/pagefind.js'))) {
    throw new Error(`${basePath} build has no Pagefind runtime`);
  }
  if (
    readdirSync(join(deploymentRoot, 'pagefind/fragment')).filter((file) =>
      file.endsWith('.pf_fragment'),
    ).length !== 2
  ) {
    throw new Error(`${basePath} build did not index both MDX pages`);
  }
  if (!existsSync(join(deploymentRoot, 'sitemap.xml'))) {
    throw new Error(`${basePath} build has no sitemap`);
  }
  if (!existsSync(join(deploymentRoot, 'assets'))) {
    throw new Error(`${basePath} build has no colocated Vite assets`);
  }
  if (!existsSync(join(deploymentRoot, 'favicon.svg'))) {
    throw new Error(`${basePath} build has no colocated public assets`);
  }
  const notFound = readFileSync(join(deploymentRoot, '404.html'), 'utf8');
  if (!notFound.includes('content="noindex,nofollow"')) {
    throw new Error(`${basePath} build has no noindex 404 page`);
  }
  if (basePath !== '/' && existsSync(join(clientRoot, 'assets'))) {
    throw new Error(`${basePath} build leaked Vite assets outside the base path`);
  }
}

let completed = false;
try {
  mkdirSync(artifactsRoot);
  run(pnpm, ['pack', '--pack-destination', artifactsRoot], uiRoot);
  run(pnpm, ['pack', '--pack-destination', artifactsRoot], docsRoot);
  const uiArchive = packageArchive('tinyrack-ui-');
  const docsArchive = packageArchive('tinyrack-docs-');

  const fixtures = [
    ['root', '/'],
    ['subpath', '/docs'],
  ] as const;
  const selectedFixtures = fixtures.filter(
    ([fixtureName]) =>
      process.env['TINYRACK_DOCS_SMOKE_ONLY'] === undefined ||
      process.env['TINYRACK_DOCS_SMOKE_ONLY'] === fixtureName,
  );
  const consumerRoot = createConsumer(
    selectedFixtures[0]?.[1] ?? '/',
    docsArchive,
    uiArchive,
  );
  prepareConsumer(consumerRoot);
  for (const [, basePath] of selectedFixtures) {
    verifyConsumerBuild(consumerRoot, basePath);
  }
  completed = true;
  console.log(
    `packed @tinyrack/docs fixture passed for ${selectedFixtures.map(([, basePath]) => basePath).join(' and ')}`,
  );
} finally {
  if (completed || process.env['TINYRACK_DOCS_KEEP_SMOKE'] !== 'true') {
    rmSync(smokeRoot, { force: true, recursive: true });
    rmSync(smokeParent, { force: true, recursive: true });
  } else {
    console.error(`Kept failing docs fixture at ${smokeRoot}`);
  }
}
