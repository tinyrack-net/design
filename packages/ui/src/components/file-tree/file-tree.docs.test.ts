import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';

const homepageRoot = fileURLToPath(new URL('../../../../homepage/', import.meta.url));

function readHomepage(path: string) {
  return readFileSync(new URL(path, `file://${homepageRoot}/`), 'utf8');
}

describe('file tree documentation', () => {
  it('keeps the Playground omitted because there is no meaningful scalar control', () => {
    const demo = readHomepage('app/documentation/components/file-tree.demo.tsx');

    expect(demo).toContain('type Args = Record<string, never>');
    expect(demo).toContain('args: {}');
    expect(demo).toContain('argTypes: {}');
    expect(demo).not.toContain('usePlaygroundArgs');
  });

  it('shares diverse paste-ready sources and an accurate API in every locale', () => {
    const demo = readHomepage('app/documentation/components/file-tree.demo.tsx');
    expect(demo).toContain('export const fileTreeBasicSource');
    expect(demo).toContain('export const fileTreeAuthoredContentSource');
    expect(demo).toContain("import '@tinyrack/ui/components/file-tree.css';");
    expect(demo).toContain(
      "import { TRFileTree } from '@tinyrack/ui/components/file-tree';",
    );
    for (const component of ['code', 'link']) {
      expect(demo).toContain(`import '@tinyrack/ui/components/${component}.css';`);
    }
    expect(demo).toContain("import { TRCode } from '@tinyrack/ui/components/code';");
    expect(demo).toContain("import { TRLink } from '@tinyrack/ui/components/link';");
    expect(demo).toContain('<TRLink href="#src">');
    expect(demo).toContain('<TRCode>routes/$locale.components.tsx</TRCode>');
    expect(demo).not.toMatch(/<(?:a|code)(?:\s|>)/);

    for (const locale of ['en', 'ko', 'ja']) {
      const docs = readHomepage(`app/content/${locale}/components/file-tree.mdx`);
      expect(docs).toContain('preview={<Stories.FileTreePreview />}');
      expect(docs).toContain('code: Stories.fileTreeBasicSource');
      expect(docs).toContain('preview={<Stories.FileTreeAuthoredContentPreview />}');
      expect(docs).toContain('code: Stories.fileTreeAuthoredContentSource');
      expect(docs).not.toContain('code: String.raw`');
      for (const contract of [
        '`children`',
        '`className`',
        '`ref`',
        '`aria-label`',
        '`--tr-file-tree-indent`',
      ]) {
        expect(docs).toContain(contract);
      }
    }
  });
});
