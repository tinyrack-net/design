import { type ChildProcess, execFileSync, spawn } from 'node:child_process';
import {
  existsSync,
  mkdirSync,
  mkdtempSync,
  readdirSync,
  readFileSync,
  rmSync,
  writeFileSync,
} from 'node:fs';
import { type AddressInfo, createServer } from 'node:net';
import { dirname, isAbsolute, join, resolve } from 'node:path';

const docsRoot = resolve(import.meta.dirname, '..');
const pnpm = process.platform === 'win32' ? 'pnpm.exe' : 'pnpm';
const smokeParent = join(docsRoot, '.tmp');
mkdirSync(smokeParent, { recursive: true });
const smokeRoot = mkdtempSync(join(smokeParent, 'consumer-'));
const artifactsRoot = join(smokeRoot, 'artifacts');
const suppliedUiArchive = process.env['TINYRACK_UI_TARBALL'];
if (
  suppliedUiArchive === undefined ||
  !isAbsolute(suppliedUiArchive) ||
  !existsSync(suppliedUiArchive)
) {
  throw new Error('TINYRACK_UI_TARBALL must point to a prepared UI package archive');
}

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
        scripts: {
          build: 'react-router build',
          dev: 'react-router dev',
          preview: 'vite preview',
        },
        dependencies: {
          '@react-router/dev': '8.2.0',
          '@tailwindcss/vite': '4.3.2',
          '@tinyrack/docs': `file:${docsArchive}`,
          '@tinyrack/ui': `file:${uiArchive}`,
          '@types/node': '24.13.3',
          '@types/react': '19.2.17',
          '@types/react-dom': '19.2.3',
          isbot: '5.2.0',
          react: '19.2.7',
          'react-dom': '19.2.7',
          'react-router': '8.2.0',
          tailwindcss: '4.3.2',
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
    `import tailwindcss from '@tailwindcss/vite';
import { tinyrackDocs } from '@tinyrack/docs/vite';
import { defineConfig } from 'vite';
import config from './docs.config.js';

export default defineConfig({
  plugins: [...tinyrackDocs(config, { root: import.meta.dirname }), tailwindcss()],
});
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
    join(root, 'app/content/index.tsx'),
    `import { DocsPage } from '@tinyrack/docs/runtime';

export default function HomePage() {
  return (
    <DocsPage
      frontmatter={{
        title: 'Packed Docs',
        description: 'A documentation site built from an installed tarball.',
        section: 'start',
        order: 0,
      }}
      headings={[{ depth: 2, id: 'welcome', label: 'Welcome' }]}
    >
      <h2 id="welcome">Welcome</h2>
      <p>This TSX content belongs to the consumer.</p>
    </DocsPage>
  );
}
`,
  );
  write(
    join(root, 'app/content/guides/install.mdx'),
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
  const uiPackageJson = JSON.parse(
    readFileSync(join(root, 'node_modules/@tinyrack/ui/package.json'), 'utf8'),
  ) as { version: string };
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
      if (packageJson.bin !== undefined) {
        throw new Error('packed @tinyrack/docs still exposes a CLI');
      }
      if (existsSync(join(root, 'node_modules/@tinyrack/docs/dist/cli'))) {
        throw new Error('packed @tinyrack/docs still contains CLI output');
      }
      for (const obsoleteAsset of [
        'docs.css',
        'fonts.css',
        'runtime-core.css',
        'fonts',
      ]) {
        if (existsSync(join(root, 'node_modules/@tinyrack/docs/dist', obsoleteAsset))) {
          throw new Error(`packed @tinyrack/docs still contains ${obsoleteAsset}`);
        }
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
  if (!home.includes('This TSX content belongs to the consumer.')) {
    throw new Error(`${basePath} build did not render the TSX page body`);
  }
  if (!home.includes('data-pagefind-body=""')) {
    throw new Error(`${basePath} TSX homepage is not indexed by Pagefind`);
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
    throw new Error(`${basePath} build did not index the TSX and MDX pages`);
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
  for (const path of [
    join(root, 'node_modules', '@tinyrack', 'docs', 'dist', 'styles.css'),
    join(root, 'node_modules', '@tinyrack', 'ui', 'dist', 'core.css'),
  ]) {
    const css = readFileSync(path, 'utf8');
    if (
      css.includes('@custom-media') ||
      css.includes('@media (--tinyrack-breakpoint-')
    ) {
      throw new Error(`${path} leaked custom media`);
    }
  }
}

async function availablePort() {
  const server = createServer();
  await new Promise<void>((resolveListen, reject) => {
    server.once('error', reject);
    server.listen(0, '127.0.0.1', () => resolveListen());
  });
  const port = (server.address() as AddressInfo).port;
  await new Promise<void>((resolveClose, reject) => {
    server.close((error) => (error === undefined ? resolveClose() : reject(error)));
  });
  return port;
}

async function stopProcess(child: ChildProcess) {
  if (child.exitCode !== null || child.pid === undefined) return;
  const exited = new Promise<void>((resolveExit) =>
    child.once('exit', () => resolveExit()),
  );
  child.kill('SIGTERM');
  await Promise.race([
    exited,
    new Promise((resolveWait) => setTimeout(resolveWait, 2_000)),
  ]);
  if (child.exitCode === null) child.kill('SIGKILL');
}

async function waitForPreview(url: string, child: ChildProcess, output: () => string) {
  const deadline = Date.now() + 30_000;
  while (Date.now() < deadline) {
    if (child.exitCode !== null) {
      throw new Error(`preview exited with ${child.exitCode}\n${output()}`);
    }
    try {
      const response = await fetch(url);
      if (response.ok) return response;
    } catch {
      // Preview is still starting.
    }
    await new Promise((resolveWait) => setTimeout(resolveWait, 200));
  }
  throw new Error(`timed out waiting for ${url}\n${output()}`);
}

async function verifyConsumerPreview(root: string, basePath: '/' | '/docs') {
  const port = await availablePort();
  const origin = `http://127.0.0.1:${port}`;
  const homePath = basePath === '/' ? '/' : '/docs/';
  const documentPath = `${basePath === '/' ? '' : basePath}/guides/install/`;
  const deploymentRoot =
    basePath === '/' ? join(root, 'build/client') : join(root, 'build/client/docs');
  const pagefindRoot = join(deploymentRoot, 'pagefind');
  const wasm = readdirSync(pagefindRoot).find((file) => file.startsWith('wasm.'));
  const fragment = readdirSync(join(pagefindRoot, 'fragment')).find((file) =>
    file.endsWith('.pf_fragment'),
  );
  if (wasm === undefined || fragment === undefined) {
    throw new Error(`${basePath} build has incomplete Pagefind output`);
  }

  const child = spawn(
    process.execPath,
    [
      join(root, 'node_modules/vite/bin/vite.js'),
      'preview',
      '--host',
      '127.0.0.1',
      '--port',
      String(port),
      '--strictPort',
    ],
    {
      cwd: root,
      env: { ...process.env, CI: 'true', FORCE_COLOR: '0' },
      stdio: ['ignore', 'pipe', 'pipe'],
    },
  );
  let output = '';
  const appendOutput = (chunk: Buffer) => {
    output = `${output}${chunk.toString()}`.slice(-20_000);
  };
  child.stdout?.on('data', appendOutput);
  child.stderr?.on('data', appendOutput);

  try {
    await waitForPreview(`${origin}${homePath}`, child, () => output);
    const document = await fetch(`${origin}${documentPath}`);
    if (!document.ok || !/<h1[^>]*>Install<\/h1>/.test(await document.text())) {
      throw new Error(`${basePath} preview did not serve a prerendered document`);
    }

    const pagefindPrefix = basePath === '/' ? '/pagefind' : '/docs/pagefind';
    for (const path of [
      `${pagefindPrefix}/pagefind.js`,
      `${pagefindPrefix}/${wasm}`,
      `${pagefindPrefix}/fragment/${fragment}`,
    ]) {
      const response = await fetch(`${origin}${path}`);
      if (!response.ok) throw new Error(`${basePath} preview did not serve ${path}`);
    }

    if (basePath !== '/') {
      const rootRedirect = await fetch(`${origin}/`);
      const baseRedirect = await fetch(`${origin}/docs`);
      if (
        rootRedirect.url !== `${origin}/docs/` ||
        baseRedirect.url !== `${origin}/docs/`
      ) {
        throw new Error('/docs preview did not normalize its root URL');
      }
      if ((await fetch(`${origin}/pagefind/pagefind.js`)).ok) {
        throw new Error('/docs preview exposed unscoped Pagefind assets');
      }
    }

    const missing = await fetch(
      `${origin}${basePath === '/' ? '/missing/' : '/docs/missing/'}`,
      { headers: { accept: 'text/html' } },
    );
    if (
      missing.status !== 404 ||
      !(await missing.text()).includes('noindex,nofollow')
    ) {
      throw new Error(`${basePath} preview did not serve the generated 404 page`);
    }
  } finally {
    await stopProcess(child);
  }
}

let completed = false;
try {
  mkdirSync(artifactsRoot);
  run(
    pnpm,
    ['--config.ignore-scripts=true', 'pack', '--pack-destination', artifactsRoot],
    docsRoot,
  );
  const uiArchive = suppliedUiArchive.replaceAll('\\', '/');
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
    await verifyConsumerPreview(consumerRoot, basePath);
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
