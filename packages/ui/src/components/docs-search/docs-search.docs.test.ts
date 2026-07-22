import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';

const homepageRoot = fileURLToPath(new URL('../../../../homepage/', import.meta.url));

function readHomepage(path: string) {
  return readFileSync(new URL(path, `file://${homepageRoot}/`), 'utf8');
}

describe('docs-search documentation', () => {
  it('keeps the Playground limited to visible trigger controls', () => {
    const demo = readHomepage('app/documentation/components/docs-search.demo.tsx');

    for (const control of ['compact', 'disabled', 'label', 'shortcutLabel', 'uiSize']) {
      expect(demo).toContain(`${control}: { control:`);
    }
    expect(demo).not.toContain('fallback: { control:');
    expect(demo).not.toContain('open: { control:');
    expect(demo).toContain('const [open, setOpen] = useState(false)');
    expect(demo).toContain('onOpenChange={setOpen}');
    expect(demo).toContain('onClick={() => setOpen(true)}');
  });

  it('shares a complete paste-ready integration source across every locale', () => {
    const demo = readHomepage('app/documentation/components/docs-search.demo.tsx');
    expect(demo).toContain('export const docsSearchBasicSource');
    expect(demo).toContain("import '@tinyrack/ui/components/docs-search.css';");
    expect(demo).toContain("import { useRef, useState } from 'react';");
    expect(demo).toContain('async function searchDocs(');
    expect(demo).toContain('if (signal.aborted)');
    expect(demo).toContain('window.location.assign(result.url)');

    for (const locale of ['en', 'ko', 'ja']) {
      const docs = readHomepage(`app/content/${locale}/components/docs-search.mdx`);
      expect(docs).toContain('code: Stories.docsSearchBasicSource');
      expect(docs).not.toContain('code: String.raw`');
      expect(docs).toContain('TRDocsSearch.Trigger');
      expect(docs).toContain('TRDocsSearch.Dialog');
      expect(docs).toContain('TRDocsSearchMessages');
      expect(docs).toContain('AbortSignal');

      const headings = [
        'Contract',
        'Install',
        'Playground',
        'Usage',
        'Examples',
        'API',
      ];
      let previousIndex = -1;
      for (const heading of headings) {
        const index = docs.indexOf(`## ${heading}`);
        expect(index).toBeGreaterThan(previousIndex);
        previousIndex = index;
      }
    }
  });
});
