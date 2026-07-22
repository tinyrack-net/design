import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';

const homepageRoot = fileURLToPath(new URL('../../../../homepage/', import.meta.url));

function readHomepage(path: string) {
  return readFileSync(new URL(path, `file://${homepageRoot}/`), 'utf8');
}

describe('autocomplete documentation', () => {
  it('keeps every locale on shared paste-ready scenario sources', () => {
    const demo = readHomepage('app/documentation/components/autocomplete.demo.tsx');
    const sourceNames = [
      'autocompleteBasicSource',
      'autocompleteStatesSource',
      'autocompleteValidationSource',
      'autocompleteBehaviorsSource',
      'autocompleteSizesSource',
      'autocompleteResetSource',
    ];
    const collectionSourceNames = sourceNames.filter(
      (name) => name !== 'autocompleteSizesSource',
    );

    for (const sourceName of sourceNames) {
      expect(demo).toContain(`export const ${sourceName}`);
    }
    for (const sourceName of collectionSourceNames) {
      const sourceStart = demo.indexOf(`export const ${sourceName}`);
      const sourceEnd = demo.indexOf('`;', sourceStart);
      expect(demo.slice(sourceStart, sourceEnd)).toContain(
        '<TRAutocomplete.Collection>',
      );
    }
    expect(demo).toContain(
      "import { TRAutocomplete } from '@tinyrack/ui/components/autocomplete';",
    );

    for (const locale of ['en', 'ko', 'ja']) {
      const docs = readHomepage(`app/content/${locale}/components/autocomplete.mdx`);
      for (const sourceName of sourceNames) {
        expect(docs).toContain(`code: Stories.${sourceName}`);
      }
      expect(docs).not.toContain('code: String.raw`');
    }
  });
});
