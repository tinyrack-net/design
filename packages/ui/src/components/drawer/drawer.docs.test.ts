import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';

const homepageRoot = fileURLToPath(new URL('../../../../homepage/', import.meta.url));

function readHomepage(path: string) {
  return readFileSync(new URL(path, `file://${homepageRoot}/`), 'utf8');
}

describe('drawer documentation', () => {
  it('keeps complete paste-ready scenarios and API coverage in every locale', () => {
    const demo = readHomepage('app/documentation/components/drawer.demo.tsx');
    const sourceNames = [
      'drawerBasicSource',
      'drawerSnapPointsSource',
      'drawerDirectionsSource',
      'drawerProviderHandleSource',
      'drawerVirtualKeyboardSource',
    ];

    for (const sourceName of sourceNames) {
      expect(demo).toContain(`export const ${sourceName}`);
    }
    const virtualKeyboardSource = demo.slice(
      demo.indexOf('export const drawerVirtualKeyboardSource'),
      demo.indexOf('export function DrawerProviderHandlePreview'),
    );
    const virtualKeyboardPreview = demo.slice(
      demo.indexOf('export function DrawerVirtualKeyboardPreview'),
      demo.indexOf('const meta ='),
    );
    expect(virtualKeyboardSource.indexOf('<TRDrawer.Root>')).toBeLessThan(
      virtualKeyboardSource.indexOf('<TRDrawer.VirtualKeyboardProvider>'),
    );
    expect(virtualKeyboardPreview.indexOf('<TRDrawer.Root')).toBeLessThan(
      virtualKeyboardPreview.indexOf('<TRDrawer.VirtualKeyboardProvider>'),
    );

    const anatomy = [
      'Root',
      'Trigger',
      'Portal',
      'Backdrop',
      'Viewport',
      'Popup',
      'Content',
      'Title',
      'Description',
      'Close',
      'SwipeArea',
      'Provider',
      'Indent',
      'IndentBackground',
      'VirtualKeyboardProvider',
      'createHandle',
    ];
    const contracts = [
      'open',
      'snapPoint',
      'swipeDirection',
      'disablePointerDismissal',
      'initialFocus',
      'finalFocus',
      'modal',
      'actionsRef',
    ];

    for (const locale of ['en', 'ko', 'ja']) {
      const docs = readHomepage(`app/content/${locale}/components/drawer.mdx`);
      for (const sourceName of sourceNames) {
        expect(docs).toContain(`code: Stories.${sourceName}`);
      }
      for (const part of anatomy) {
        expect(docs).toContain(`\`${part}\``);
      }
      for (const contract of contracts) {
        expect(docs).toContain(`\`${contract}\``);
      }
      expect(docs).not.toContain('code: String.raw`');
      expect(docs).not.toContain("baseUiExampleSources['drawer']");
    }
  });
});
