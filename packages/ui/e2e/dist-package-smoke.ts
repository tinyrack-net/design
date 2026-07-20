import { execFileSync } from 'node:child_process';
import {
  mkdirSync,
  mkdtempSync,
  readdirSync,
  readFileSync,
  rmSync,
  writeFileSync,
} from 'node:fs';
import { createServer } from 'node:http';
import type { AddressInfo } from 'node:net';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import { chromium } from 'playwright';
import { componentNames } from '../scripts/component-catalog.ts';

const repoRoot = process.cwd();
const pnpm = process.platform === 'win32' ? 'pnpm.exe' : 'pnpm';
const consumerRoot = mkdtempSync(join(tmpdir(), 'tinyrack-ui-consumer-'));
const artifactsRoot = join(consumerRoot, 'artifacts');
const appRoot = join(consumerRoot, 'app');

function run(command: string, args: string[], cwd: string) {
  execFileSync(command, args, {
    cwd,
    encoding: 'utf8',
    stdio: 'pipe',
  });
}

async function verifyPackedMdxHydration(root: string) {
  const distRoot = join(root, 'dist');
  const server = createServer((request, response) => {
    const requestPath = new URL(request.url ?? '/', 'http://consumer.local').pathname;
    const path =
      requestPath === '/' ? join(distRoot, 'index.html') : join(distRoot, requestPath);
    try {
      const contentType = path.endsWith('.js')
        ? 'text/javascript; charset=utf-8'
        : path.endsWith('.css')
          ? 'text/css; charset=utf-8'
          : 'text/html; charset=utf-8';
      response.writeHead(200, { 'content-type': contentType });
      response.end(readFileSync(path));
    } catch {
      response.writeHead(404);
      response.end('Not found');
    }
  });

  await new Promise<void>((resolveListen, reject) => {
    server.once('error', reject);
    server.listen(0, '127.0.0.1', () => {
      server.off('error', reject);
      resolveListen();
    });
  });

  const origin = `http://127.0.0.1:${(server.address() as AddressInfo).port}`;
  const browser = await chromium.launch();
  try {
    const page = await browser.newPage();
    const errors: string[] = [];
    page.on('pageerror', (error) => errors.push(error.message));
    page.on('console', (message) => {
      if (message.type() === 'error') errors.push(message.text());
    });
    await page.goto(origin);
    await page.locator('html[data-hydrated="true"]').waitFor();
    await page
      .getByRole('heading', { level: 1, name: 'Packed MDX consumer' })
      .waitFor();
    if ((await page.locator('main').count()) !== 1)
      throw new Error('MDX must expose one main');
    if ((await page.getByRole('table').count()) !== 1)
      throw new Error('GFM table missing');
    if ((await page.getByRole('checkbox').count()) !== 1) {
      throw new Error('GFM task list missing');
    }
    if (!(await page.getByRole('checkbox').isChecked())) {
      throw new Error('GFM task state missing');
    }
    if (
      (await page.getByRole('link', { name: 'Tinyrack' }).getAttribute('href')) !==
      '/docs'
    ) {
      throw new Error('MDX link missing');
    }
    if ((await page.locator('[data-footnote-ref]').count()) !== 1) {
      throw new Error('MDX footnote missing');
    }
    if (errors.length > 0)
      throw new Error(`MDX hydration errors: ${errors.join('\n')}`);
    await page.close();
  } finally {
    await browser.close();
    await new Promise<void>((resolveClose, reject) => {
      server.close((error) => (error === undefined ? resolveClose() : reject(error)));
    });
  }
}

try {
  mkdirSync(artifactsRoot);
  mkdirSync(appRoot);

  run(pnpm, ['pack', '--pack-destination', artifactsRoot], repoRoot);

  const archive = readdirSync(artifactsRoot).find((file) => file.endsWith('.tgz'));
  if (!archive) {
    throw new Error('pnpm pack did not create a package archive');
  }

  const archivePath = join(artifactsRoot, archive).replaceAll('\\', '/');
  writeFileSync(
    join(appRoot, 'package.json'),
    `${JSON.stringify(
      {
        name: 'tinyrack-ui-consumer-smoke',
        private: true,
        type: 'module',
        dependencies: {
          '@mdx-js/mdx': '3.1.1',
          '@mdx-js/react': '3.1.1',
          '@mdx-js/rollup': '3.1.1',
          '@tinyrack/ui': `file:${archivePath}`,
          '@types/react': '19.2.17',
          '@types/react-dom': '19.2.3',
          '@vitejs/plugin-react': '6.0.2',
          react: '19.2.7',
          'react-dom': '19.2.7',
          'remark-gfm': '4.0.1',
          typescript: '6.0.3',
          vite: '8.1.3',
        },
      },
      null,
      2,
    )}\n`,
  );

  run(pnpm, ['install', '--ignore-scripts'], appRoot);

  writeFileSync(
    join(appRoot, 'smoke.mjs'),
    `import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { TRButton } from '@tinyrack/ui/components/button';
import { TRTabs, TRTabsRoot } from '@tinyrack/ui/components/tabs';
import { createTinyrackMdxComponents, tinyrackMdxComponents } from '@tinyrack/ui/mdx';
import { TRCSPProvider } from '@tinyrack/ui/providers/csp';
import { TRDirectionProvider, useDirection } from '@tinyrack/ui/providers/direction';

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

assert(typeof TRButton === 'function', 'TRButton is not a React component');
assert(typeof TRTabsRoot === 'function', 'TRTabsRoot is not a React component');
assert(typeof TRTabs.Root === 'function', 'TRTabs.Root is not a React component');
assert(typeof TRTabs.List === 'function', 'TRTabs.List is not a React component');
assert(typeof TRTabs.Tab === 'function', 'TRTabs.Tab is not a React component');
assert(typeof TRTabs.Panel === 'function', 'TRTabs.Panel is not a React component');
assert(typeof TRCSPProvider === 'function', 'TRCSPProvider is missing');
assert(typeof TRDirectionProvider === 'function', 'TRDirectionProvider is missing');
assert(typeof useDirection === 'function', 'useDirection is missing');
assert(typeof createTinyrackMdxComponents === 'function', 'MDX factory is missing');
assert(typeof tinyrackMdxComponents === 'object', 'MDX component map is missing');

for (const component of ${JSON.stringify(componentNames)}) {
  const module = await import('@tinyrack/ui/components/' + component);
  assert(Object.keys(module).length > 0, component + ' has no public exports');
  for (const name of Object.keys(module)) {
    assert(name.startsWith('TR') || name.startsWith('create') || name.startsWith('use'), component + '.' + name + ' is not TR-prefixed');
  }
  const cssPath = fileURLToPath(
    import.meta.resolve('@tinyrack/ui/components/' + component + '.css'),
  );
  assert(
    readFileSync(cssPath, 'utf8').includes('.tr-'),
    component + ' has invalid CSS',
  );
}

for (const [specifier, marker] of [
  ['@tinyrack/ui/core.css', '--tinyrack-primary'],
  ['@tinyrack/ui/components/button.css', '.tr-btn'],
  ['@tinyrack/ui/components/tabs.css', '.tr-tabs'],
]) {
  const path = fileURLToPath(import.meta.resolve(specifier));
  assert(readFileSync(path, 'utf8').includes(marker), specifier + ' has invalid CSS');
}

for (const specifier of [
  '@tinyrack/ui',
  '@tinyrack/ui/components/button/react',
  '@tinyrack/ui/components/button/dom',
  '@tinyrack/ui/components/overlay',
  '@tinyrack/ui/components/modal',
  '@tinyrack/ui/components/disclosure',
  '@tinyrack/ui/components/pin-input',
  '@tinyrack/ui/components/divider',
  '@tinyrack/ui/mdx/react',
  '@tinyrack/ui/mdx/astro',
]) {
  let resolved = true;
  try {
    await import(specifier);
  } catch {
    resolved = false;
  }
  assert(!resolved, specifier + ' must remain an unsupported breaking path');
}
`,
  );

  writeFileSync(
    join(appRoot, 'consumer.tsx'),
    `import { createRef } from 'react';
import { TRButton, type TRButtonProps } from '@tinyrack/ui/components/button';
import { TRDialog, type TRDialogRootProps } from '@tinyrack/ui/components/dialog';
import { TRTabs, type TRTabsRootProps } from '@tinyrack/ui/components/tabs';
import { createTinyrackMdxComponents } from '@tinyrack/ui/mdx';
import { TRCSPProvider } from '@tinyrack/ui/providers/csp';
import { TRDirectionProvider } from '@tinyrack/ui/providers/direction';

const buttonRef = createRef<HTMLButtonElement>();
const buttonProps: TRButtonProps = { appearance: 'outline', ref: buttonRef };
const tabsProps: TRTabsRootProps = { defaultValue: 'overview' };
const dialogProps: TRDialogRootProps = { defaultOpen: false };

export const fixture = (
  <TRCSPProvider nonce="consumer-nonce">
    <TRDirectionProvider direction="ltr">
      <TRButton {...buttonProps}>Save</TRButton>
      <TRTabs.Root {...tabsProps}>
        <TRTabs.List>
          <TRTabs.Tab value="overview">Overview</TRTabs.Tab>
        </TRTabs.List>
        <TRTabs.Panel value="overview">Content</TRTabs.Panel>
      </TRTabs.Root>
      <TRDialog.Root {...dialogProps} />
    </TRDirectionProvider>
  </TRCSPProvider>
);

export const mdxComponents = createTinyrackMdxComponents();
`,
  );

  writeFileSync(
    join(appRoot, 'tsconfig.json'),
    `${JSON.stringify(
      {
        compilerOptions: {
          exactOptionalPropertyTypes: true,
          jsx: 'react-jsx',
          lib: ['ES2022', 'DOM'],
          module: 'NodeNext',
          moduleResolution: 'NodeNext',
          noEmit: true,
          strict: true,
          target: 'ES2022',
        },
        include: ['consumer.tsx'],
      },
      null,
      2,
    )}\n`,
  );

  run(process.execPath, ['smoke.mjs'], appRoot);
  run(pnpm, ['exec', 'tsc', '--project', 'tsconfig.json'], appRoot);

  writeFileSync(
    join(appRoot, 'content.mdx'),
    `# Packed MDX consumer

[Tinyrack](/docs)

- [x] Hydrated task

| Rack | State |
| --- | --- |
| Alpha | Healthy |

Footnote reference.[^1]

[^1]: Packed package footnote.
`,
  );
  writeFileSync(
    join(appRoot, 'render.mjs'),
    `import { readFile, writeFile } from 'node:fs/promises';
import { pathToFileURL } from 'node:url';
import { compile } from '@mdx-js/mdx';
import { MDXProvider } from '@mdx-js/react';
import { createElement } from 'react';
import { renderToString } from 'react-dom/server';
import remarkGfm from 'remark-gfm';
import { createTinyrackMdxComponents } from '@tinyrack/ui/mdx';

const compiled = await compile(await readFile('content.mdx'), {
  jsxImportSource: 'react',
  outputFormat: 'program',
  providerImportSource: '@mdx-js/react',
  remarkPlugins: [remarkGfm],
});
await writeFile('content.compiled.mjs', String(compiled));
const { default: Content } = await import(pathToFileURL('content.compiled.mjs'));
const tree = createElement(
  MDXProvider,
  { components: createTinyrackMdxComponents() },
  createElement(Content),
);
await writeFile('server-markup.html', renderToString(tree));
`,
  );
  writeFileSync(
    join(appRoot, 'app.jsx'),
    `import { MDXProvider } from '@mdx-js/react';
import { hydrateRoot } from 'react-dom/client';
import { createTinyrackMdxComponents } from '@tinyrack/ui/mdx';
import Content from './content.mdx';

const tree = (
  <MDXProvider components={createTinyrackMdxComponents()}>
    <Content />
  </MDXProvider>
);
hydrateRoot(document.getElementById('root'), tree, {
  onRecoverableError(error) { console.error(error); },
});
requestAnimationFrame(() => { document.documentElement.dataset.hydrated = 'true'; });
`,
  );
  writeFileSync(
    join(appRoot, 'vite.config.mjs'),
    `import mdx from '@mdx-js/rollup';
import react from '@vitejs/plugin-react';
import remarkGfm from 'remark-gfm';
import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [mdx({ providerImportSource: '@mdx-js/react', remarkPlugins: [remarkGfm] }), react()],
});
`,
  );
  run(process.execPath, ['render.mjs'], appRoot);
  const serverMarkup = readFileSync(join(appRoot, 'server-markup.html'), 'utf8');
  writeFileSync(
    join(appRoot, 'index.html'),
    `<!doctype html><html><head><meta charset="utf-8"></head><body><div id="root">${serverMarkup}</div><script type="module" src="/app.jsx"></script></body></html>`,
  );
  run(pnpm, ['exec', 'vite', 'build'], appRoot);
  await verifyPackedMdxHydration(appRoot);

  const packedPackage = JSON.parse(
    readFileSync(resolve(appRoot, 'node_modules/@tinyrack/ui/package.json'), 'utf8'),
  ) as { files?: string[] };
  if (!packedPackage.files?.includes('dist')) {
    throw new Error('installed package does not declare dist as a published file');
  }
  const packedManifest = JSON.stringify(packedPackage);
  if (
    packedManifest.includes('@tinyrack/source') ||
    packedManifest.includes('./src/')
  ) {
    throw new Error('installed package leaked workspace source exports');
  }

  console.log('installed package and compiled MDX hydration consumer smoke passed');
} finally {
  rmSync(consumerRoot, { force: true, recursive: true });
}
