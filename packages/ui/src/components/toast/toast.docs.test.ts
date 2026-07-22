import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';

const homepageRoot = fileURLToPath(new URL('../../../../homepage/', import.meta.url));

function readHomepage(path: string) {
  return readFileSync(new URL(path, `file://${homepageRoot}/`), 'utf8');
}

describe('toast documentation', () => {
  it('keeps generic exit motion from overriding directional swipe transforms', () => {
    const css = readFileSync(new URL('./toast.css', import.meta.url), 'utf8');
    const exitKeyframes = css.match(/@keyframes tr-toast-exit \{([\s\S]*?)\n\}/)?.[1];

    expect(exitKeyframes).toContain('opacity: 0');
    expect(exitKeyframes).not.toContain('transform:');
  });

  it('keeps lifecycle preview-owned and resettable with only meaningful controls visible', () => {
    const demo = readHomepage('app/documentation/components/toast.demo.tsx');

    expect(demo).not.toContain("initiallyOpen: { control: 'boolean' }");
    expect(demo).toContain("description: { control: 'text' }");
    expect(demo).toContain("position: {\n      control: 'select'");
    expect(demo).toContain("title: { control: 'text' }");
    expect(demo).toContain("variant: {\n      control: 'select'");
    expect(demo).toContain('<TRToast.Provider>\n        <ToastDemo {...args} />');
  });

  it('shares complete paste-ready sources and API anatomy across every locale', () => {
    const demo = readHomepage('app/documentation/components/toast.demo.tsx');
    const sourceNames = [
      'toastBasicSource',
      'toastVariantsSource',
      'toastPositionsSource',
      'toastLifecycleSource',
      'toastAnchoredSource',
    ];
    const anatomy = [
      'Provider',
      'Portal',
      'Viewport',
      'Root',
      'Content',
      'Title',
      'Description',
      'Action',
      'Close',
      'Positioner',
      'Arrow',
      'createToastManager',
      'useToastManager',
    ];

    expect(demo).toContain("import '@tinyrack/ui/components/toast.css';");
    expect(demo).toContain(
      "import { TRToast, useToastManager } from '@tinyrack/ui/components/toast';",
    );
    expect(demo).toContain('excludeStories: /.*Source$/');
    for (const sourceName of sourceNames) {
      expect(demo).toContain(`export const ${sourceName}`);
    }
    expect(demo).toContain('<TRToast.Viewport aria-label="Anchored notifications">');

    for (const locale of ['en', 'ko', 'ja']) {
      const docs = readHomepage(`app/content/${locale}/components/toast.mdx`);
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
