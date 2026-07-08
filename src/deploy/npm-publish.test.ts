import { existsSync, readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

function readText(path: string) {
  return readFileSync(path, 'utf8');
}

describe('npm package publishing', () => {
  it('runs the package verification gate on pull requests and main pushes', () => {
    expect(existsSync('.github/workflows/ci.yml')).toBe(true);

    const packageJson = JSON.parse(readText('package.json'));
    const workflow = readText('.github/workflows/ci.yml');
    const setupAction = readText('.github/actions/setup-js/action.yml');

    expect(workflow).toContain('name: CI');
    expect(workflow).toContain('pull_request:');
    expect(workflow).toContain('branches:');
    expect(workflow).toContain('- main');
    expect(workflow).toContain('uses: ./.github/actions/setup-js');
    expect(workflow).toContain('pnpm install --frozen-lockfile');
    expect(workflow).toContain('pnpm exec playwright install --with-deps chromium');
    expect(workflow).toContain('pnpm run verify');
    expect(setupAction).toContain("require('./package.json').packageManager");
    expect(setupAction).toContain('node-version-file: .node-version');
    expect(readText('.node-version').trim()).toBe('24');

    expect(packageJson.scripts.verify).toContain('pnpm biome');
    expect(packageJson.scripts.verify).toContain('pnpm check:css');
    expect(packageJson.scripts.verify).toContain('pnpm check:stories');
    expect(packageJson.scripts).not.toHaveProperty('generate:stories');
    expect(packageJson.scripts.verify).toContain('pnpm test');
    expect(packageJson.scripts.verify).toContain('pnpm build');
    expect(packageJson.scripts.verify).toContain('pnpm test:dist');
    expect(packageJson.scripts.verify).toContain('pnpm test:astro-fixture:built');
    expect(packageJson.scripts['test:dist']).toBe('node scripts/test-dist-package.ts');
  });

  it('declares the package as a public scoped npm package', async () => {
    const packageJson = await import('../../package.json', {
      with: { type: 'json' },
    });

    expect(packageJson.default.name).toBe('@tinyrack/themes');
    expect(packageJson.default.publishConfig).toEqual({
      access: 'public',
    });
    expect(packageJson.default.repository).toEqual({
      type: 'git',
      url: 'https://github.com/tinyrack-net/themes.git',
    });
    expect(packageJson.default.files).toEqual(['dist', 'README.md', 'docs']);
  });

  it('publishes to npm only from version tags with trusted publishing provenance', () => {
    expect(existsSync('.github/workflows/publish-npm.yml')).toBe(true);

    const workflow = readText('.github/workflows/publish-npm.yml');

    expect(workflow).toContain('name: Publish npm package');
    expect(workflow).toContain('tags:');
    expect(workflow).toContain('- "v*.*.*"');
    expect(workflow).toContain('permissions:');
    expect(workflow).toContain('contents: read');
    expect(workflow).toContain('id-token: write');
    expect(workflow).toContain('uses: ./.github/actions/setup-js');
    expect(workflow).toContain('registry-url: https://registry.npmjs.org');
    expect(workflow).toContain('pnpm install --frozen-lockfile');
    expect(workflow).toContain('pnpm exec playwright install --with-deps chromium');
    expect(workflow).toContain('pnpm run verify');
    expect(workflow).not.toContain('pnpm pack --dry-run');
    expect(workflow).toContain(
      'pnpm publish --provenance --access public --no-git-checks',
    );
    expect(workflow).not.toContain('NPM_TOKEN');
  });
});
