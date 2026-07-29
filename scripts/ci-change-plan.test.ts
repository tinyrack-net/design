import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join, resolve } from 'node:path';
import { afterEach, describe, it } from 'node:test';
import { classifyChangedPaths } from './ci-change-plan.ts';

const temporaryRepositories: string[] = [];

const none = {
  docs: false,
  docs_contract: false,
  flutter: false,
  flutter_preview: false,
  homepage: false,
  shared: false,
  ui: false,
};

function git(repository: string, ...arguments_: string[]) {
  return execFileSync('git', arguments_, {
    cwd: repository,
    encoding: 'utf8',
  }).trim();
}

function createRepository() {
  const repository = mkdtempSync(join(tmpdir(), 'tinyrack-ci-plan-'));
  temporaryRepositories.push(repository);
  git(repository, 'init');
  git(repository, 'config', 'user.email', 'ci-plan@example.invalid');
  git(repository, 'config', 'user.name', 'CI plan test');
  return repository;
}

function commitFile(repository: string, path: string, contents: string) {
  const file = join(repository, path);
  mkdirSync(dirname(file), { recursive: true });
  writeFileSync(file, contents);
  git(repository, 'add', '--all');
  git(repository, 'commit', '-m', `Update ${path}`);
  return git(repository, 'rev-parse', 'HEAD');
}

function runCli(repository: string, base: string, head: string) {
  const script = resolve(import.meta.dirname, 'ci-change-plan.ts');
  return JSON.parse(
    execFileSync(process.execPath, [script, '--base', base, '--head', head], {
      cwd: repository,
      encoding: 'utf8',
    }),
  );
}

afterEach(() => {
  for (const repository of temporaryRepositories) {
    rmSync(repository, { force: true, recursive: true });
  }
  temporaryRepositories.length = 0;
});

describe('CI change classification', () => {
  it('runs only the gate for repository prose', () => {
    assert.deepEqual(classifyChangedPaths(['README.md']), none);
    assert.deepEqual(classifyChangedPaths([]), none);
  });

  it('propagates UI changes through public consumers', () => {
    assert.deepEqual(
      classifyChangedPaths(['packages/ui/src/components/button/button.tsx']),
      {
        ...none,
        docs: true,
        docs_contract: true,
        homepage: true,
        ui: true,
      },
    );
  });

  it('propagates Docs changes only to Docs and Homepage', () => {
    assert.deepEqual(
      classifyChangedPaths(['packages/docs/src/runtime/docs-site-shell.tsx']),
      { ...none, docs: true, homepage: true },
    );
  });

  it('keeps ordinary Homepage changes out of Flutter jobs', () => {
    assert.deepEqual(
      classifyChangedPaths(['packages/homepage/app/content/en/index.tsx']),
      { ...none, docs_contract: true, homepage: true },
    );
  });

  it('selects the Flutter preview job for preview-specific Homepage changes', () => {
    assert.deepEqual(
      classifyChangedPaths([
        'packages/homepage/tests/browser-flutter-preview-dev.test.ts',
      ]),
      {
        ...none,
        docs_contract: true,
        flutter_preview: true,
        homepage: true,
      },
    );
  });

  it('propagates Flutter changes to platforms, preview, and Homepage', () => {
    assert.deepEqual(
      classifyChangedPaths(['packages/tinyrack_ui/lib/src/components/button.dart']),
      {
        ...none,
        flutter: true,
        flutter_preview: true,
        homepage: true,
      },
    );
  });

  it('combines deleted and renamed paths without losing either dependency', () => {
    assert.deepEqual(
      classifyChangedPaths(['packages/ui/src/old.ts', 'packages/homepage/app/new.ts']),
      {
        ...none,
        docs: true,
        docs_contract: true,
        homepage: true,
        ui: true,
      },
    );
  });

  it('fails open for shared and unknown paths', () => {
    const all = {
      docs: true,
      docs_contract: true,
      flutter: true,
      flutter_preview: true,
      homepage: true,
      shared: true,
      ui: true,
    };
    assert.deepEqual(classifyChangedPaths(['design-tokens/tokens.json']), all);
    assert.deepEqual(classifyChangedPaths(['new-package/source.ts']), all);
  });
});

describe('CI change range resolution', () => {
  it('uses explicit PR and push SHAs, including rename and deletion paths', () => {
    const repository = createRepository();
    const base = commitFile(repository, 'packages/docs/old.ts', 'old docs');
    mkdirSync(join(repository, 'packages/ui'), { recursive: true });
    git(repository, 'mv', 'packages/docs/old.ts', 'packages/ui/new.ts');
    git(repository, 'commit', '-m', 'Move Docs source to UI');
    const head = git(repository, 'rev-parse', 'HEAD');

    assert.deepEqual(runCli(repository, base, head), {
      ...none,
      docs: true,
      docs_contract: true,
      homepage: true,
      ui: true,
    });
    assert.deepEqual(runCli(repository, head, head), none);
  });

  it('falls back from a zero push base and fails open on an invalid range', () => {
    const repository = createRepository();
    commitFile(repository, 'README.md', 'first');
    const head = commitFile(repository, 'packages/tinyrack_ui/lib/button.dart', 'new');

    assert.deepEqual(
      runCli(repository, '0000000000000000000000000000000000000000', head),
      {
        ...none,
        flutter: true,
        flutter_preview: true,
        homepage: true,
      },
    );
    assert.deepEqual(runCli(repository, 'missing-base', head), {
      docs: true,
      docs_contract: true,
      flutter: true,
      flutter_preview: true,
      homepage: true,
      shared: true,
      ui: true,
    });
  });
});
