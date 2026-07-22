import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';

const homepageRoot = fileURLToPath(new URL('../../../../homepage/', import.meta.url));

function readHomepage(path: string) {
  return readFileSync(new URL(path, `file://${homepageRoot}/`), 'utf8');
}

describe('table documentation', () => {
  it('keeps every Playground control wired to a resettable default', () => {
    const demo = readHomepage('app/documentation/components/table.demo.tsx');

    expect(demo).toContain(
      "args: { caption: 'Rack status', density: 'comfortable', striped: true }",
    );
    expect(demo).toContain("caption: { control: 'text' }");
    expect(demo).toContain("options: ['compact', 'comfortable', 'spacious']");
    expect(demo).toContain("striped: { control: 'boolean' }");
    expect(demo).toContain('<TRTable.Caption>{caption}</TRTable.Caption>');
    expect(demo).toContain('{...rootProps}');
  });

  it('keeps varied paste-ready examples and the complete API in every locale', () => {
    for (const locale of ['en', 'ko', 'ja']) {
      const docs = readHomepage(`app/content/${locale}/components/table.mdx`);
      expect(docs.match(/code: String.raw`/g)).toHaveLength(4);
      expect(
        docs.match(/import '@tinyrack\/ui\/components\/table.css';/g),
      ).toHaveLength(5);
      expect(
        docs.match(/import \{ TRTable \} from '@tinyrack\/ui\/components\/table';/g),
      ).toHaveLength(6);
      for (const contract of [
        '`TRTable.Root`',
        '`TRTable.Caption`',
        '`TRTable.Header`',
        '`TRTable.Body`',
        '`TRTable.Footer`',
        '`TRTable.Row`',
        '`TRTable.Head`',
        '`TRTable.Cell`',
        '`containerClassName`',
        '`containerProps`',
        '`containerRef`',
        '`density`',
        '`striped`',
        '`ref`',
      ]) {
        expect(docs).toContain(contract);
      }
    }
  });
});
