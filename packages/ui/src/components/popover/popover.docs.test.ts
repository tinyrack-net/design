import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';

const homepageRoot = fileURLToPath(new URL('../../../../homepage/', import.meta.url));

function readHomepage(path: string) {
  return readFileSync(new URL(path, `file://${homepageRoot}/`), 'utf8');
}

describe('popover documentation', () => {
  it('keeps locale examples on shared paste-ready sources with complete public APIs', () => {
    const demo = readHomepage('app/documentation/components/popover.demo.tsx');
    const sourceNames = [
      'popoverBasicSource',
      'popoverSidesSource',
      'popoverCollisionSource',
      'popoverHandleSource',
    ];

    for (const sourceName of sourceNames) {
      expect(demo).toContain(`export const ${sourceName}`);
    }
    expect(demo).toContain("import '@tinyrack/ui/components/popover.css';");
    expect(demo).toContain("collisionAvoidance={{ align: 'flip', side: 'flip' }}");
    for (const control of [
      'align',
      'alignOffset',
      'description',
      'side',
      'sideOffset',
      'title',
    ]) {
      expect(demo).toMatch(new RegExp(`\\n    ${control}: \\{ control:`));
    }
    expect(demo).not.toMatch(/\n {4}open: \{ control:/);
    expect(demo).toContain('onOpenChange={(open) => updateArgs({ open })}');

    for (const locale of ['en', 'ko', 'ja']) {
      const docs = readHomepage(`app/content/${locale}/components/popover.mdx`);

      for (const sourceName of sourceNames) {
        expect(docs).toContain(`code: Stories.${sourceName}`);
      }
      expect(docs).not.toContain('code: String.raw`');
      expect(docs).toContain('id="popover-handle"');
      for (const part of [
        'Root',
        'Trigger',
        'Portal',
        'Positioner',
        'Popup',
        'Arrow',
        'Backdrop',
        'Title',
        'Description',
        'Close',
        'Viewport',
      ]) {
        expect(docs).toContain(`### \`TRPopover.${part}\``);
      }
      expect(docs).toContain('### `TRPopover.createHandle`');
      expect(docs).toContain('`disableAnchorTracking`');
      expect(docs).not.toContain('`trackAnchor`');
    }
  });
});
