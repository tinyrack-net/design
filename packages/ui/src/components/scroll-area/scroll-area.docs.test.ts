import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';

const homepageRoot = fileURLToPath(new URL('../../../../homepage/', import.meta.url));

function readHomepage(path: string) {
  return readFileSync(new URL(path, `file://${homepageRoot}/`), 'utf8');
}

describe('scroll area documentation', () => {
  it('keeps content, orientation, auto-hide, and variant controls resettable', () => {
    const demo = readHomepage('app/documentation/components/scroll-area.demo.tsx');

    expect(demo).toContain("content: 'Rack event log'");
    expect(demo).toContain("orientation: 'both'");
    expect(demo).toContain("variant: 'surface'");
    expect(demo).toContain('autoHide: false');
    expect(demo).toContain(
      "orientation: { options: ['vertical', 'horizontal', 'both']",
    );
    expect(demo).toContain("variant: { options: ['surface', 'plain']");
    expect(demo).not.toContain('usePlaygroundArgs');
    expect(demo).toContain('excludeStories: /.*(?:Preview|Source)$/');
  });

  it('shares paste-ready vertical, horizontal, two-axis, auto-hide, and RTL sources', () => {
    const demo = readHomepage('app/documentation/components/scroll-area.demo.tsx');
    const sourceNames = [
      'scrollAreaVerticalSource',
      'scrollAreaHorizontalSource',
      'scrollAreaBothSource',
      'scrollAreaAutoHideSource',
      'scrollAreaRTLSource',
    ];

    expect(demo).toContain("import '@tinyrack/ui/components/scroll-area.css';");
    for (const sourceName of sourceNames) {
      expect(demo).toContain(`export const ${sourceName}`);
    }

    for (const locale of ['en', 'ko', 'ja']) {
      const docs = readHomepage(`app/content/${locale}/components/scroll-area.mdx`);
      for (const sourceName of sourceNames) {
        expect(docs).toContain(`code: Stories.${sourceName}`);
      }
      expect(docs).not.toContain('code: String.raw`');
    }
  });

  it('documents the complete public anatomy, behavior, state, and customization API', () => {
    for (const locale of ['en', 'ko', 'ja']) {
      const docs = readHomepage(`app/content/${locale}/components/scroll-area.mdx`);
      for (const part of [
        'Root',
        'Viewport',
        'Content',
        'Scrollbar',
        'Thumb',
        'Corner',
      ]) {
        expect(docs).toContain(`\`${part}\``);
      }
      for (const contract of [
        'autoHide',
        'variant',
        'overflowEdgeThreshold',
        'orientation',
        'keepMounted',
        'render',
        'ref',
        'data-overflow-x-start',
        'data-overflow-y-end',
        '--tr-scroll-area-color',
        '--tr-scroll-area-indicator-background',
      ]) {
        expect(docs).toContain(`\`${contract}\``);
      }
      expect(docs).toContain('TRScrollAreaRootProps');
      expect(docs).toContain('TRScrollAreaViewportState');
    }
  });
});
