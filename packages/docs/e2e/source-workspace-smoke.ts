import { type ChildProcess, execFileSync, spawn } from 'node:child_process';
import { existsSync } from 'node:fs';
import { createServer } from 'node:http';
import { createRequire } from 'node:module';
import type { AddressInfo } from 'node:net';
import { dirname, join, resolve } from 'node:path';

const repoRoot = resolve(import.meta.dirname, '../../..');
const homepageRoot = resolve(repoRoot, 'packages/homepage');
const require = createRequire(join(homepageRoot, 'package.json'));
const reactRouterPackage = require.resolve('@react-router/dev/package.json');
const reactRouterBin = join(dirname(reactRouterPackage), 'bin.cjs');
const distPaths = [
  resolve(repoRoot, 'packages/docs/dist'),
  resolve(repoRoot, 'packages/ui/dist'),
] as const;

function resolvesFromWorkspacePackage(
  path: string,
  packageName: 'docs' | 'ui',
  directory: 'dist' | 'src',
) {
  return (
    path.includes(`/packages/${packageName}/${directory}/`) ||
    path.includes(`/node_modules/@tinyrack/${packageName}/${directory}/`)
  );
}

function verifyWorkspaceResolutions() {
  const specifiers = [
    '@tinyrack/docs/config',
    '@tinyrack/docs/react-router',
    '@tinyrack/docs/runtime',
    '@tinyrack/docs/vite',
    '@tinyrack/docs/styles.css',
    '@tinyrack/ui/components/button',
    '@tinyrack/ui/components/button.css',
    '@tinyrack/ui/core',
    '@tinyrack/ui/core.css',
    '@tinyrack/ui/mdx',
    '@tinyrack/ui/mdx.css',
    '@tinyrack/ui/providers/direction',
  ];
  const source = `for (const specifier of ${JSON.stringify(specifiers)}) console.log(specifier + '=' + import.meta.resolve(specifier));`;
  const resolveEntries = (conditions: string[]) => {
    const output = execFileSync(
      process.execPath,
      [...conditions, '--input-type=module', '--eval', source],
      { cwd: homepageRoot, encoding: 'utf8' },
    );
    return new Map(
      output
        .trim()
        .split(/\r?\n/)
        .map((line) => {
          const separator = line.indexOf('=');
          return [line.slice(0, separator), line.slice(separator + 1)] as const;
        }),
    );
  };
  const sourceResolutions = resolveEntries(['--conditions=@tinyrack/source']);
  const defaultResolutions = resolveEntries([]);

  for (const specifier of specifiers) {
    const sourcePath = sourceResolutions
      .get(specifier)
      ?.replaceAll('\\', '/')
      .toLowerCase();
    const defaultPath = defaultResolutions
      .get(specifier)
      ?.replaceAll('\\', '/')
      .toLowerCase();
    const packageName = specifier.startsWith('@tinyrack/docs') ? 'docs' : 'ui';
    if (
      sourcePath === undefined ||
      !resolvesFromWorkspacePackage(sourcePath, packageName, 'src')
    ) {
      throw new Error(
        `${specifier} did not resolve from workspace source: ${sourcePath}`,
      );
    }
    if (
      defaultPath === undefined ||
      !resolvesFromWorkspacePackage(defaultPath, packageName, 'dist')
    ) {
      throw new Error(
        `${specifier} did not resolve from workspace dist: ${defaultPath}`,
      );
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

async function waitForResponse(url: string, child: ChildProcess, output: () => string) {
  const deadline = Date.now() + 60_000;
  while (Date.now() < deadline) {
    if (child.exitCode !== null) {
      throw new Error(`source dev server exited with ${child.exitCode}\n${output()}`);
    }
    let response: Response | undefined;
    try {
      response = await fetch(url);
    } catch {
      // The development server is still starting.
    }
    if (response?.ok) return response;
    if (
      response !== undefined &&
      response.status >= 500 &&
      output().includes('Internal server error')
    ) {
      throw new Error(`source dev server failed to serve ${url}\n${output()}`);
    }
    await new Promise((resolveWait) => setTimeout(resolveWait, 250));
  }
  throw new Error(`timed out waiting for ${url}\n${output()}`);
}

async function verifySourceDevServer() {
  const port = await availablePort();
  const origin = `http://127.0.0.1:${port}`;
  const child = spawn(
    process.execPath,
    [reactRouterBin, 'dev', '--host', '127.0.0.1', '--port', String(port)],
    {
      cwd: homepageRoot,
      env: {
        ...process.env,
        FORCE_COLOR: '0',
        NODE_OPTIONS: [process.env['NODE_OPTIONS'], '--conditions=@tinyrack/source']
          .filter(Boolean)
          .join(' '),
      },
      stdio: ['ignore', 'pipe', 'pipe'],
    },
  );
  let output = '';
  const appendOutput = (chunk: Buffer) => {
    output = `${output}${chunk.toString()}`.slice(-20_000);
  };
  child.stdout?.on('data', (chunk: Buffer) => {
    appendOutput(chunk);
  });
  child.stderr?.on('data', (chunk: Buffer) => {
    appendOutput(chunk);
  });

  try {
    await waitForResponse(`${origin}/`, child, () => output);
    await waitForResponse(`${origin}/en/components/button`, child, () => output);
    const styles = await waitForResponse(
      `${origin}/app/styles/app.css`,
      child,
      () => output,
    );
    const sourceCss = await styles.text();
    if (!sourceCss.includes('tinyrack')) {
      throw new Error(`source development CSS was not served\n${output}`);
    }
    if (
      sourceCss.includes('@custom-media') ||
      sourceCss.includes('@media (--tinyrack-breakpoint-')
    ) {
      throw new Error(`source development CSS leaked custom media\n${output}`);
    }
    const brand = await waitForResponse(
      `${origin}/brand/tinyrack-lockup.svg`,
      child,
      () => output,
    );
    if (!(await brand.text()).includes('<svg')) {
      throw new Error(`source development brand asset was not served\n${output}`);
    }
  } finally {
    await stopProcess(child);
  }
}

const initialDistState = distPaths.map((path) => existsSync(path));
verifyWorkspaceResolutions();
await verifySourceDevServer();
for (const [index, path] of distPaths.entries()) {
  if (!initialDistState[index] && existsSync(path)) {
    throw new Error(`source development unexpectedly created ${path}`);
  }
}
console.log('workspace source exports and build-free homepage development passed');
