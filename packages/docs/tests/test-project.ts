import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join } from 'node:path';
import { type DocsConfig, defineDocsConfig } from '../src/config/index.js';

export function createTestProject(basePath = '/docs') {
  const root = mkdtempSync(join(tmpdir(), 'tinyrack-docs-'));
  const config = defineDocsConfig({
    contentDir: 'content',
    sections: [
      { id: 'start', label: 'Start', order: 0 },
      { id: 'guides', label: 'Guides', order: 1 },
    ],
    site: {
      basePath,
      description: 'Test documentation.',
      favicon: '/favicon.svg',
      locale: { language: 'en', openGraph: 'en_US' },
      logo: { dark: '/logo-dark.svg', light: '/logo-light.svg' },
      title: 'Test Docs',
      url: 'https://example.com',
    },
    theme: { default: 'dark' },
  });

  return {
    config,
    dispose: () => rmSync(root, { force: true, recursive: true }),
    root,
    write(relativePath: string, source: string) {
      const path = join(root, 'content', relativePath);
      mkdirSync(dirname(path), { recursive: true });
      writeFileSync(path, source);
    },
  };
}

export function documentSource(
  fields: Partial<{
    description: string;
    order: number;
    section: string;
    sidebarLabel: string;
    slug: string;
    title: string;
  }> = {},
) {
  const values = {
    description: 'A test document.',
    order: 0,
    section: 'start',
    title: 'Home',
    ...fields,
  };
  return [
    '---',
    `title: ${JSON.stringify(values.title)}`,
    `description: ${JSON.stringify(values.description)}`,
    `section: ${values.section}`,
    `order: ${values.order}`,
    ...(values.slug === undefined ? [] : [`slug: ${JSON.stringify(values.slug)}`]),
    ...(values.sidebarLabel === undefined
      ? []
      : [`sidebarLabel: ${JSON.stringify(values.sidebarLabel)}`]),
    '---',
    '',
    '## Body',
    '',
  ].join('\n');
}

export function withConfig(config: DocsConfig, contentDir: string): DocsConfig {
  return { ...config, contentDir };
}
