import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';

const homepageRoot = fileURLToPath(new URL('../../../../homepage/', import.meta.url));

function readHomepage(path: string) {
  return readFileSync(new URL(path, `file://${homepageRoot}/`), 'utf8');
}

describe('preview-card documentation', () => {
  it('keeps interaction state and timing out of Playground controls', () => {
    const demo = readHomepage('app/documentation/components/preview-card.demo.tsx');
    const argTypes = demo.slice(
      demo.indexOf('argTypes: {'),
      demo.indexOf('render: function Render'),
    );

    expect(demo).toContain('const [open, setOpen] = useState(defaultOpen);');
    expect(demo).toContain('<TRPreviewCard.Root onOpenChange={setOpen} open={open}>');
    expect(argTypes).not.toContain('open:');
    expect(argTypes).not.toContain('delay:');
    expect(argTypes).not.toContain('closeDelay:');
    for (const control of ['align', 'description', 'label', 'side', 'title']) {
      expect(argTypes).toContain(`${control}:`);
    }

    for (const locale of ['en', 'ko', 'ja']) {
      const docs = readHomepage(`app/content/${locale}/components/preview-card.mdx`);
      expect(docs).not.toMatch(/Playground control[s]?[^\n]*`open`/);
      expect(docs).not.toMatch(/Playground control[s]?[^\n]*`delay`/);
      expect(docs).not.toMatch(/Playground control[s]?[^\n]*`closeDelay`/);
    }
  });

  it('keeps locale examples noninteractive and on shared paste-ready sources', () => {
    const demo = readHomepage('app/documentation/components/preview-card.demo.tsx');
    for (const sourceName of [
      'previewCardBasicSource',
      'previewCardHandleSource',
      'previewCardPositioningSource',
    ]) {
      expect(demo).toContain(`export const ${sourceName}`);
    }

    for (const locale of ['en', 'ko', 'ja']) {
      const docs = readHomepage(`app/content/${locale}/components/preview-card.mdx`);
      expect(docs).toContain('TRPreviewCard.createHandle');
      expect(docs).toContain('Backdrop');
      expect(docs).toContain('Viewport');
      expect(docs).toContain('non-interactive');
      expect(docs).toContain('code: Stories.previewCardBasicSource');
      expect(docs).toContain('code: Stories.previewCardHandleSource');
      expect(docs).toContain('code: Stories.previewCardPositioningSource');
      expect(docs).not.toContain('<TRLink');
      expect(docs).not.toContain('code: String.raw`');
      expect(docs).not.toContain('baseUiExampleSources');
    }

    const handlePreview = demo.slice(
      demo.indexOf('export function PreviewCardHandlePreview()'),
      demo.indexOf('export const previewCardBasicSource'),
    );
    expect(handlePreview).not.toContain('defaultOpen');
    expect(handlePreview).not.toContain('defaultTriggerId');
  });

  it('disables preview motion when reduced motion is requested', () => {
    const css = readFileSync(new URL('./preview-card.css', import.meta.url), 'utf8');
    expect(css).toContain('@media (prefers-reduced-motion: reduce)');
    expect(css).toMatch(/\.tr-preview-card-popup\s*\{\s*animation: none;/);
  });
});
