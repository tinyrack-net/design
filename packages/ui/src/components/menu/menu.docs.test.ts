import { readFileSync } from 'node:fs';
import { expect, test } from 'vitest';

const homepage = new URL('../../../../homepage/app/', import.meta.url);

function readHomepage(path: string) {
  return readFileSync(new URL(path, homepage), 'utf8');
}

test('keeps the menu playground and detached-handle sources type-safe and copy-ready', () => {
  const demo = readHomepage('documentation/components/menu.demo.tsx');
  expect(demo).toContain('{({ payload }) => (');
  expect(demo).toContain('payload?.rack');
  expect(demo).not.toContain('payload as { rack?: string }');
  expect(demo).toContain('open: false');
  expect(demo).toContain('onOpenChange={(open) => updateArgs({ open })}');

  for (const locale of ['en', 'ko', 'ja']) {
    const docs = readHomepage(`content/${locale}/components/menu.mdx`);
    const handleSource = docs.slice(docs.indexOf('const menuHandle'));
    expect(handleSource).toContain('{({ payload }) => (');
    expect(handleSource).toContain('{payload?.rack}');
    expect(handleSource).not.toContain('{(payload) => (');
  }
});

test('documents the complete public menu anatomy in every locale', () => {
  const parts = [
    'Root',
    'Trigger',
    'Portal',
    'Backdrop',
    'Positioner',
    'Popup',
    'Arrow',
    'Viewport',
    'Group',
    'GroupLabel',
    'Item',
    'LinkItem',
    'CheckboxItem',
    'CheckboxItemIndicator',
    'RadioGroup',
    'RadioItem',
    'RadioItemIndicator',
    'Separator',
    'SubmenuRoot',
    'SubmenuTrigger',
    'createHandle',
  ];

  for (const locale of ['en', 'ko', 'ja']) {
    const docs = readHomepage(`content/${locale}/components/menu.mdx`);
    const api = docs.slice(docs.indexOf('## API'));
    for (const part of parts) expect(api).toContain(`\`${part}\``);
  }
});
