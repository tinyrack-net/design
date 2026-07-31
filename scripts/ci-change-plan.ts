import { spawnSync } from 'node:child_process';
import { appendFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

export type CiChangePlan = {
  docs: boolean;
  docs_contract: boolean;
  flutter: boolean;
  flutter_preview: boolean;
  homepage: boolean;
  shared: boolean;
  ui: boolean;
};

const emptyPlan = (): CiChangePlan => ({
  docs: false,
  docs_contract: false,
  flutter: false,
  flutter_preview: false,
  homepage: false,
  shared: false,
  ui: false,
});

const fullPlan = (): CiChangePlan => ({
  docs: true,
  docs_contract: true,
  flutter: true,
  flutter_preview: true,
  homepage: true,
  shared: true,
  ui: true,
});

const ignoredRepositoryFiles = new Set([
  '.gitignore',
  'AGENTS.md',
  'LICENSE',
  'README.md',
]);

function normalizePath(path: string) {
  return path.replaceAll('\\', '/').replace(/^\.\/+/, '');
}

function enableUi(plan: CiChangePlan) {
  plan.ui = true;
  plan.docs = true;
  plan.docs_contract = true;
  plan.homepage = true;
}

function enableDocs(plan: CiChangePlan) {
  plan.docs = true;
  plan.homepage = true;
}

function enableHomepage(plan: CiChangePlan) {
  plan.docs_contract = true;
  plan.homepage = true;
}

function enableFlutter(plan: CiChangePlan) {
  plan.flutter = true;
  plan.flutter_preview = true;
  plan.homepage = true;
}

export function classifyChangedPaths(paths: readonly string[]): CiChangePlan {
  const plan = emptyPlan();

  for (const rawPath of paths) {
    const path = normalizePath(rawPath);
    if (path === '') continue;

    if (
      ignoredRepositoryFiles.has(path) ||
      path.startsWith('.agents/') ||
      path.startsWith('.codex/')
    ) {
      continue;
    }

    if (
      path.startsWith('.github/') ||
      path.startsWith('design-tokens/') ||
      path.startsWith('scripts/') ||
      [
        '.node-version',
        'biome.json',
        'package.json',
        'pnpm-lock.yaml',
        'pnpm-workspace.yaml',
        'tsconfig.scripts.json',
      ].includes(path)
    ) {
      return fullPlan();
    }

    if (path.startsWith('packages/ui/')) {
      enableUi(plan);
      continue;
    }

    if (path.startsWith('packages/docs/')) {
      enableDocs(plan);
      continue;
    }

    if (path.startsWith('packages/homepage/')) {
      enableHomepage(plan);
      if (
        path.startsWith('packages/homepage/app/documentation/flutter/') ||
        path.startsWith('packages/homepage/scripts/flutter-preview') ||
        path.startsWith('packages/homepage/tests/browser-flutter-preview') ||
        path.startsWith('packages/homepage/tests/flutter-preview')
      ) {
        plan.flutter_preview = true;
      }
      continue;
    }

    if (path.startsWith('packages/tinyrack_ui/')) {
      enableFlutter(plan);
      continue;
    }

    return fullPlan();
  }

  return plan;
}

function argument(name: string) {
  const index = process.argv.indexOf(name);
  return index === -1 ? undefined : process.argv[index + 1];
}

function changedPaths(base: string, head: string) {
  const result = spawnSync(
    'git',
    ['diff', '--name-only', '--no-renames', '-z', base, head],
    { encoding: 'utf8' },
  );
  if (result.status !== 0) {
    throw new Error(result.stderr.trim() || `git diff exited with ${result.status}`);
  }
  return result.stdout.split('\0').filter((path) => path !== '');
}

function writeOutputs(plan: CiChangePlan) {
  const output = process.env['GITHUB_OUTPUT'];
  if (output === undefined) return;
  appendFileSync(
    output,
    `${Object.entries(plan)
      .map(([key, value]) => `${key}=${String(value)}`)
      .join('\n')}\n`,
  );
}

function main() {
  const base = argument('--base');
  const head = argument('--head') ?? 'HEAD';
  let plan: CiChangePlan;

  try {
    if (base === undefined || /^0+$/.test(base)) {
      const fallback = spawnSync('git', ['rev-parse', `${head}^`], {
        encoding: 'utf8',
      });
      if (fallback.status !== 0) throw new Error('Unable to resolve the diff base');
      plan = classifyChangedPaths(changedPaths(fallback.stdout.trim(), head));
    } else {
      plan = classifyChangedPaths(changedPaths(base, head));
    }
  } catch (error) {
    console.error(
      `Unable to classify CI changes; running the complete matrix: ${
        error instanceof Error ? error.message : String(error)
      }`,
    );
    plan = fullPlan();
  }

  writeOutputs(plan);
  console.log(JSON.stringify(plan));
}

if (resolve(process.argv[1] ?? '') === fileURLToPath(import.meta.url)) {
  main();
}
