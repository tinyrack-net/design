import { readFileSync } from 'node:fs';
import { expect, test } from 'vitest';

const homepage = new URL('../../../../homepage/app/', import.meta.url);

function readHomepage(path: string) {
  return readFileSync(new URL(path, homepage), 'utf8');
}

test('keeps context menu examples paste-ready and API-complete in every locale', () => {
  const demo = readHomepage('documentation/components/context-menu.demo.tsx');

  for (const sourceName of ['contextMenuBasicSource', 'contextMenuSelectionSource']) {
    expect(demo).toContain(`export const ${sourceName}`);
  }
  expect(demo).toContain("import '@tinyrack/ui/components/context-menu.css';");
  expect(demo).toContain('setShowLabels(true);');
  expect(demo).toContain("setDensity('comfortable');");
  for (const control of ['disabledItem', 'label', 'variant']) {
    expect(demo).toMatch(new RegExp(`\\n    ${control}: \\{ control:`));
  }
  expect(demo).not.toMatch(/\n {4}open: \{ control:/);
  expect(demo).toContain('onOpenChange={(open) => updateArgs({ open })}');
  expect(demo).toContain('previousOpen.current = nextOpen;');

  for (const locale of ['en', 'ko', 'ja']) {
    const docs = readHomepage(`content/${locale}/components/context-menu.mdx`);

    expect(docs).toContain('code: Stories.contextMenuBasicSource');
    expect(docs).toContain('code: Stories.contextMenuSelectionSource');
    expect(docs).not.toContain('code: String.raw`');
    for (const part of [
      'Root',
      'Trigger',
      'Portal',
      'Backdrop',
      'Positioner',
      'Popup',
      'Arrow',
      'Group',
      'GroupLabel',
      'Item',
      'LinkItem',
      'CheckboxItem',
      'CheckboxItemIndicator',
      'RadioGroup',
      'RadioItem',
      'RadioItemIndicator',
      'SubmenuRoot',
      'SubmenuTrigger',
      'Separator',
    ]) {
      expect(docs).toContain(`### \`TRContextMenu.${part}\``);
    }
  }
});

test('exports the complete public context menu root type contract', () => {
  const entry = readFileSync(new URL('./index.tsx', import.meta.url), 'utf8');

  for (const typeName of [
    'ContextMenuRootActions as TRContextMenuRootActions',
    'ContextMenuRootChangeEventDetails as TRContextMenuRootChangeEventDetails',
    'ContextMenuRootChangeEventReason as TRContextMenuRootChangeEventReason',
  ]) {
    expect(entry).toContain(typeName);
  }
});
