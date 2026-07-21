import { mkdirSync, writeFileSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { describe, expect, it, vi } from 'vitest';
import { docsAssetsPlugin, isDocsContentFile } from '../src/vite/docs-assets-plugin.js';
import { createTestProject, docsPageSource } from './test-project.js';

describe('docs asset HMR scope', () => {
  const root = resolve('/workspace/project/./packages/../packages/homepage');
  const contentDir = './app/content/../content';
  const content = resolve(root, contentDir);

  it.each([
    [join(content, 'index.mdx'), true],
    [join(content, 'index.tsx'), true],
    [join(content, 'en/guides/install.tsx'), true],
    ['app/content/en/components/button.mdx', true],
    [join(root, 'app/content-extra/index.tsx'), false],
    [join(root, 'app/documentation/components/button.demo.tsx'), false],
    [join(root, 'app/documentation/readme.mdx'), false],
    [join(content, 'metadata.ts'), false],
  ])('classifies %s', (file, expected) => {
    expect(isDocsContentFile(file, root, contentDir)).toBe(expected);
  });
});

describe('docs asset HMR routing', () => {
  it('restarts the dev server when a page is added to the route config', async () => {
    const project = createTestProject();
    const routeFile = join(project.root, 'content', 'guide.tsx');
    mkdirSync(join(project.root, 'public'), { recursive: true });
    writeFileSync(
      join(project.root, 'public', 'favicon.svg'),
      '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" />',
    );
    project.write('index.tsx', docsPageSource());

    try {
      const plugin = docsAssetsPlugin(project.config, project.root);
      const hotUpdate = plugin.hotUpdate;
      if (typeof hotUpdate !== 'function') {
        throw new Error('Expected docs assets plugin to define hotUpdate');
      }
      const restart = vi.fn(async () => {});
      project.write(
        'guide.tsx',
        docsPageSource({ order: 1, slug: '/guide', title: 'Guide' }),
      );

      await hotUpdate.call(
        {
          environment: {
            hot: { send: vi.fn() },
            moduleGraph: {
              getModuleById: vi.fn(),
              invalidateModule: vi.fn(),
            },
          },
        } as never,
        {
          file: routeFile,
          server: { restart },
          type: 'create',
        } as never,
      );

      expect(restart).toHaveBeenCalledOnce();
    } finally {
      project.dispose();
    }
  });
});
