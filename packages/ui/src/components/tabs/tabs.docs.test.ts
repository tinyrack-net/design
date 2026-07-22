import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';

const homepageRoot = fileURLToPath(new URL('../../../../homepage/', import.meta.url));

function readHomepage(path: string) {
  return readFileSync(new URL(path, `file://${homepageRoot}/`), 'utf8');
}

describe('tabs documentation', () => {
  it('keeps the Playground uncontrolled so reset does not own selection state', () => {
    const demo = readHomepage('app/documentation/components/tabs.demo.tsx');

    expect(demo).not.toContain('value: string | null');
    expect(demo).not.toContain('usePlaygroundArgs');
    expect(demo).toContain('defaultValue="overview"');
    expect(demo).toContain('disabledTab: false');
  });

  it('shares paste-ready examples and complete anatomy across every locale', () => {
    const demo = readHomepage('app/documentation/components/tabs.demo.tsx');
    const sourceNames = [
      'tabsControlledSource',
      'tabsSizesSource',
      'tabsVerticalSource',
      'tabsOverflowIndicatorSource',
    ];
    const anatomy = ['Root', 'List', 'Tab', 'Indicator', 'Panel'];

    for (const sourceName of sourceNames) {
      expect(demo).toContain(`export const ${sourceName}`);
    }
    expect(demo).toContain('<TRTabs.Indicator />');
    expect(demo).toContain('excludeStories: /.*(?:Preview|Example|Source)$/');

    for (const locale of ['en', 'ko', 'ja']) {
      const docs = readHomepage(`app/content/${locale}/components/tabs.mdx`);
      for (const sourceName of sourceNames) {
        expect(docs).toContain(`code: Stories.${sourceName}`);
      }
      for (const part of anatomy) {
        expect(docs).toContain(`\`${part}\``);
      }
      expect(docs).toContain('<TRTabs.Panel key={label} value={label}>');
      expect(docs).not.toContain('code: String.raw`');
    }
  });
});
