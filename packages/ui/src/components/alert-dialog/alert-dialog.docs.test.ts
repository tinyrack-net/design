import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';

const homepageRoot = fileURLToPath(new URL('../../../../homepage/', import.meta.url));

function readHomepage(path: string) {
  return readFileSync(new URL(path, `file://${homepageRoot}/`), 'utf8');
}

describe('alert-dialog documentation', () => {
  it('targets rendered anatomy for focus-visible styles', () => {
    const css = readFileSync(new URL('./alert-dialog.css', import.meta.url), 'utf8');

    expect(css).toContain('.tr-alert-dialog-trigger:focus-visible');
    expect(css).toContain('.tr-alert-dialog-close:focus-visible');
    expect(css).toContain('.tr-alert-dialog-popup:focus-visible');
    expect(css).not.toContain('.tr-alert-dialog :focus-visible');
  });

  it('keeps open preview-owned while exposing label and disabled controls', () => {
    const demo = readHomepage('app/documentation/components/alert-dialog.demo.tsx');

    expect(demo).not.toContain("open: { control: 'boolean' }");
    expect(demo).toContain("label: { control: 'text' }");
    expect(demo).toContain("disabled: { control: 'boolean' }");
    expect(demo).toContain('open: false');
    expect(demo).toContain('onOpenChange={(open) => updateArgs({ open })}');
  });

  it('keeps all locales on complete, paste-ready destructive confirmation sources', () => {
    const demo = readHomepage('app/documentation/components/alert-dialog.demo.tsx');
    expect(demo).toContain('export const alertDialogBasicSource');
    expect(demo).toContain('export const alertDialogStatesSource');
    expect(demo).toContain("import '@tinyrack/ui/components/alert-dialog.css';");
    expect(demo).toContain(
      "import { TRAlertDialog } from '@tinyrack/ui/components/alert-dialog';",
    );
    expect(demo).toContain(
      "import { TRButton } from '@tinyrack/ui/components/button';",
    );

    for (const locale of ['en', 'ko', 'ja']) {
      const docs = readHomepage(`app/content/${locale}/components/alert-dialog.mdx`);
      expect(docs).toContain('code: Stories.alertDialogBasicSource');
      expect(docs).toContain('code: Stories.alertDialogStatesSource');
      expect(docs).toContain('TRAlertDialog.createHandle');
      expect(docs).toContain('`Root`');
      expect(docs).toContain('`Trigger`');
      expect(docs).toContain('`Portal`');
      expect(docs).toContain('`Backdrop`');
      expect(docs).toContain('`Viewport`');
      expect(docs).toContain('`Popup`');
      expect(docs).toContain('`Title`');
      expect(docs).toContain('`Description`');
      expect(docs).toContain('`Close`');
      expect(docs).not.toContain('code: String.raw`');
      expect(docs).not.toContain("baseUiExampleSources['alert-dialog']");
    }
  });
});
