import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';

const homepageRoot = fileURLToPath(new URL('../../../../homepage/', import.meta.url));

function readHomepage(path: string) {
  return readFileSync(new URL(path, `file://${homepageRoot}/`), 'utf8');
}

describe('collapsible documentation', () => {
  it('keeps every locale on shared paste-ready sources and complete part APIs', () => {
    const demo = readHomepage('app/documentation/components/collapsible.demo.tsx');

    expect(demo).toContain('export const collapsibleBasicSource');
    expect(demo).toContain('export const collapsibleLifecycleSource');
    expect(demo).toContain("import '@tinyrack/ui/components/collapsible.css';");
    expect(demo).toContain("lifecycle: 'unmount'");
    expect(demo).toContain("options: ['unmount', 'keepMounted', 'hiddenUntilFound']");
    expect(demo).toContain('onOpenChange={(open) => updateArgs({ open })}');
    expect(demo).not.toMatch(/argTypes:\s*\{[^}]*open:/s);

    for (const locale of ['en', 'ko', 'ja']) {
      const docs = readHomepage(`app/content/${locale}/components/collapsible.mdx`);

      expect(docs).toContain('code: Stories.collapsibleBasicSource');
      expect(docs).toContain('code: Stories.collapsibleLifecycleSource');
      expect(docs).not.toContain('code: String.raw`');
      expect(docs).toContain('### `TRCollapsible.Root`');
      expect(docs).toContain('### `TRCollapsible.Trigger`');
      expect(docs).toContain('### `TRCollapsible.Panel`');
      expect(docs).toContain('`hiddenUntilFound`');
      expect(docs).toContain('`--collapsible-panel-height`');
    }
  });
});
