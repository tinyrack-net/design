import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

function readText(path: string) {
  return readFileSync(path, 'utf8');
}

describe('Cloudflare Storybook deployment', () => {
  it('configures Workers static assets for the Storybook build output', () => {
    const wranglerConfig = JSON.parse(readText('wrangler.jsonc'));

    expect(wranglerConfig.name).toBe('tinyrack-themes-storybook');
    expect(wranglerConfig.compatibility_date).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    expect(wranglerConfig.assets).toEqual({
      directory: './storybook-static',
      html_handling: 'auto-trailing-slash',
      not_found_handling: '404-page',
    });
  });

  it('exposes explicit scripts for Storybook deployment and dry-run validation', async () => {
    const packageJson = await import('../../../package.json', {
      with: { type: 'json' },
    });

    expect(packageJson.default.scripts['deploy:storybook']).toBe('wrangler deploy');
    expect(packageJson.default.scripts['deploy:storybook:dry-run']).toBe(
      'wrangler deploy --dry-run',
    );
    expect(packageJson.default.devDependencies.wrangler).toBeDefined();
  });

  it('deploys Storybook only from version tags with the same Cloudflare secret contract as sibling projects', () => {
    const packageJson = JSON.parse(readText('package.json'));
    const workflow = readText('.github/workflows/deploy-storybook.yml');

    expect(workflow).toContain('name: Deploy Storybook');
    expect(workflow).toContain('tags:');
    expect(workflow).toContain('- "v*.*.*"');
    expect(workflow).not.toContain('branches:');
    expect(workflow).not.toContain('- main');
    expect(workflow).not.toContain('workflow_dispatch:');
    expect(workflow).toContain('node-version: 24');
    expect(workflow).toContain('pnpm install --frozen-lockfile');
    expect(workflow).toContain('pnpm exec playwright install --with-deps chromium');
    expect(workflow).toContain('pnpm run verify:release');
    expect(packageJson.scripts['verify:release']).toContain('pnpm verify');
    expect(packageJson.scripts['verify:release']).toContain('pnpm test:storybook');
    expect(packageJson.scripts['test:storybook']).toContain('pnpm storybook:build');
    expect(packageJson.scripts['test:storybook']).toContain('pnpm storybook:audit');
    expect(packageJson.scripts['test:storybook']).toContain(
      'pnpm storybook:audit:environments',
    );
    expect(workflow).not.toContain('pnpm run deploy:storybook:dry-run');
    expect(workflow).toContain('pnpm run deploy:storybook');
    expect(workflow).toMatch(
      /CLOUDFLARE_API_TOKEN: \$\{\{ secrets\.CLOUDFLARE_API_TOKEN \}\}/,
    );
    expect(workflow).toMatch(
      /CLOUDFLARE_ACCOUNT_ID: \$\{\{ secrets\.CLOUDFLARE_ACCOUNT_ID \}\}/,
    );
    expect(workflow).toContain('group: storybook-deploy');
  });
});
