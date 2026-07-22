import { readFileSync } from 'node:fs';
import { expect, test } from 'vitest';

const homepage = new URL('../../../../homepage/app/', import.meta.url);

function readHomepage(path: string) {
  return readFileSync(new URL(path, homepage), 'utf8');
}

test('keeps the toolbar Playground interactive and resettable', () => {
  const demo = readHomepage('documentation/components/toolbar.demo.tsx');

  expect(demo).toContain('boldPressed: true');
  expect(demo).toContain("disabled: { control: 'boolean' }");
  expect(demo).toContain(
    "orientation: { options: ['horizontal', 'vertical'], control: 'radio' }",
  );
  expect(demo).toContain(
    'onBoldPressedChange={(pressed) => updateArgs({ boldPressed: pressed })}',
  );
  expect(demo).toContain('pressed={boldPressed}');
});

test('keeps all locale examples paste-ready and the public contract complete', () => {
  const demo = readHomepage('documentation/components/toolbar.demo.tsx');

  for (const sourceName of ['toolbarBasicSource', 'toolbarStatesSource']) {
    expect(demo).toContain(`export const ${sourceName}`);
  }

  const headings = {
    en: ['### Anatomy', '### Root props', '### Appearance'],
    ko: ['### 구조', '### Root 속성', '### 모양'],
    ja: ['### 構造', '### Root のプロパティ', '### 外観'],
  } as const;

  for (const locale of ['en', 'ko', 'ja'] as const) {
    const docs = readHomepage(`content/${locale}/components/toolbar.mdx`);
    expect(docs).toContain('code: Stories.toolbarBasicSource');
    expect(docs).toContain('code: Stories.toolbarStatesSource');
    expect(docs).not.toContain('code: String.raw`');
    for (const heading of headings[locale]) expect(docs).toContain(heading);
    for (const part of ['Root', 'Group', 'Button', 'Link', 'Input', 'Separator']) {
      expect(docs).toContain(`\`${part}\``);
    }
    expect(docs).toContain('`--tr-toolbar-control-background-hover`');
  }
});
