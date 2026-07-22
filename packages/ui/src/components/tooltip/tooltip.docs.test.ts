import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';

const homepageRoot = fileURLToPath(new URL('../../../../homepage/', import.meta.url));

function readHomepage(path: string) {
  return readFileSync(new URL(path, `file://${homepageRoot}/`), 'utf8');
}

describe('tooltip documentation', () => {
  it('keeps every locale on shared paste-ready scenario sources and complete API anatomy', () => {
    const demo = readHomepage('app/documentation/components/tooltip.demo.tsx');
    const sourceNames = [
      'tooltipBasicSource',
      'tooltipSidesSource',
      'tooltipLongContentSource',
      'tooltipDelayGroupSource',
      'tooltipHandleViewportSource',
    ];
    const anatomy = [
      'Provider',
      'Root',
      'Trigger',
      'Portal',
      'Positioner',
      'Popup',
      'Arrow',
      'Viewport',
      'createHandle',
    ];

    for (const sourceName of sourceNames) {
      expect(demo).toContain(`export const ${sourceName}`);
    }
    expect(demo).toContain('onOpenChange={(open) => updateArgs({ open })}');
    expect(demo).toContain('excludeStories: /.*(?:Example|Source)$/');

    for (const locale of ['en', 'ko', 'ja']) {
      const docs = readHomepage(`app/content/${locale}/components/tooltip.mdx`);
      for (const sourceName of sourceNames) {
        expect(docs).toContain(`code: Stories.${sourceName}`);
      }
      for (const part of anatomy) {
        expect(docs).toContain(`\`${part}\``);
      }
      expect(docs).not.toContain('code: String.raw`');
    }
  });
});
