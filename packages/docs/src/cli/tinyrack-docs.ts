#!/usr/bin/env node
import { spawnSync } from 'node:child_process';
import {
  existsSync,
  mkdirSync,
  readdirSync,
  readFileSync,
  renameSync,
  rmSync,
  writeFileSync,
} from 'node:fs';
import { createRequire } from 'node:module';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const require = createRequire(import.meta.url);
const reactRouterPackage = require.resolve('@react-router/dev/package.json');
const pagefindEntry = fileURLToPath(import.meta.resolve('pagefind'));
const reactRouterBin = join(dirname(reactRouterPackage), 'bin.cjs');
const pagefindBin = join(dirname(pagefindEntry), 'runner/bin.cjs');
const clientRoot = join(process.cwd(), 'build/client');
const emittedMetadataPath = join(clientRoot, '.tinyrack-docs.json');
const buildMetadataPath = join(process.cwd(), 'build/tinyrack-docs.json');

type BuildMetadata = {
  basePath: string;
};

function readBuildMetadata(path: string): BuildMetadata {
  const value: unknown = JSON.parse(readFileSync(path, 'utf8'));
  if (
    typeof value !== 'object' ||
    value === null ||
    !('basePath' in value) ||
    typeof value.basePath !== 'string' ||
    !value.basePath.startsWith('/')
  ) {
    throw new Error(`Invalid Tinyrack docs build metadata at ${path}`);
  }
  return { basePath: value.basePath };
}

function removeSpaFallbacks(directory: string) {
  for (const entry of readdirSync(directory, { withFileTypes: true })) {
    const path = join(directory, entry.name);
    if (entry.isDirectory()) {
      removeSpaFallbacks(path);
      continue;
    }
    if (entry.name === '__spa-fallback.html') rmSync(path, { force: true });
  }
}

function relocateClientAssets(basePath: string) {
  if (basePath === '/') return;
  const segments = basePath.split('/').filter(Boolean);
  const firstSegment = segments[0];
  if (firstSegment === undefined) return;

  const targetRoot = join(clientRoot, ...segments);
  mkdirSync(targetRoot, { recursive: true });
  for (const entry of readdirSync(clientRoot, { withFileTypes: true })) {
    if (entry.name === firstSegment || entry.name === '.tinyrack-docs.json') continue;
    if (entry.isFile() && entry.name === 'index.html') {
      rmSync(join(clientRoot, entry.name), { force: true });
      continue;
    }
    renameSync(join(clientRoot, entry.name), join(targetRoot, entry.name));
  }
}

function pagefindOutputSubdirectory(basePath: string) {
  return basePath === '/' ? 'pagefind' : `${basePath.slice(1)}/pagefind`;
}

function run(command: string, args: string[], captureWarnings = false) {
  const result = spawnSync(process.execPath, [command, ...args], {
    cwd: process.cwd(),
    encoding: 'utf8',
    env: { ...process.env, FORCE_COLOR: '0' },
    stdio: captureWarnings ? 'pipe' : 'inherit',
  });
  if (captureWarnings) {
    process.stdout.write(result.stdout ?? '');
    process.stderr.write(result.stderr ?? '');
  }
  if (result.error) throw result.error;
  if (result.status !== 0) process.exit(result.status ?? 1);

  if (captureWarnings) {
    const output = `${result.stdout ?? ''}\n${result.stderr ?? ''}`;
    const warnings = output
      .split(/\r?\n/)
      .filter((line) => /\bwarn(?:ing)?\b|deprecated|\[PLUGIN_TIMINGS\]/i.test(line));
    if (warnings.length > 0) {
      throw new Error(`Documentation build emitted warnings:\n${warnings.join('\n')}`);
    }
  }
}

const [command, ...args] = process.argv.slice(2);

switch (command) {
  case 'dev':
    run(reactRouterBin, ['dev', ...args]);
    break;
  case 'build':
    run(reactRouterBin, ['build', ...args], true);
    if (!existsSync(emittedMetadataPath)) {
      throw new Error('The Vite build did not emit Tinyrack docs metadata');
    }
    {
      const metadata = readBuildMetadata(emittedMetadataPath);
      removeSpaFallbacks(clientRoot);
      run(pagefindBin, [
        '--site',
        'build/client',
        '--output-subdir',
        pagefindOutputSubdirectory(metadata.basePath),
      ]);
      relocateClientAssets(metadata.basePath);
      rmSync(emittedMetadataPath, { force: true });
      writeFileSync(buildMetadataPath, `${JSON.stringify(metadata)}\n`);
    }
    break;
  case 'preview': {
    const metadata = readBuildMetadata(buildMetadataPath);
    run(pagefindBin, [
      '--site',
      'build/client',
      '--output-subdir',
      pagefindOutputSubdirectory(metadata.basePath),
      '--serve',
      ...args,
    ]);
    break;
  }
  default:
    process.stderr.write('Usage: tinyrack-docs <dev|build|preview> [options]\n');
    process.exitCode = 1;
}
