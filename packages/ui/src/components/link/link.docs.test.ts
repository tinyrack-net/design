import { readFileSync } from 'node:fs';
import { expect, test } from 'vitest';

const homepage = new URL('../../../../homepage/app/', import.meta.url);

function readHomepage(path: string) {
  return readFileSync(new URL(path, homepage), 'utf8');
}

test('keeps the Link Playground complete and resettable', () => {
  const demo = readHomepage('documentation/components/link.demo.tsx');

  expect(demo).toContain("disabled: { control: 'boolean' }");
  expect(demo).toContain("options: ['always', 'hover', 'none']");
  expect(demo).toContain("options: ['default', 'muted', 'danger']");
  expect(demo).toContain('<TRLink {...props} href="#rack-inventory">');
});

test('keeps all locale examples paste-ready and the public contract complete', () => {
  const demo = readHomepage('documentation/components/link.demo.tsx');

  for (const sourceName of [
    'linkBasicSource',
    'linkMatrixSource',
    'linkDestinationsSource',
  ]) {
    expect(demo).toContain(`export const ${sourceName}`);
  }
  expect(demo).toContain("import '@tinyrack/ui/components/link.css';");
  expect(demo).toContain("import { Link as RouterLink } from 'react-router';");

  for (const locale of ['en', 'ko', 'ja']) {
    const docs = readHomepage(`content/${locale}/components/link.mdx`);

    expect(docs).toContain('code: Stories.linkBasicSource');
    expect(docs).toContain('code: Stories.linkMatrixSource');
    expect(docs).toContain('code: Stories.linkDestinationsSource');
    expect(docs).not.toContain('code: String.raw`');
    expect(docs).toContain('aria-current="page"');
    expect(docs).toContain('render={<RouterLink to="/racks/new" />}');
    expect(docs).toContain('| `href` |');
    expect(docs).toContain('| `render` |');
    expect(docs).toContain('`--tr-link-color`');
    expect(docs).not.toContain('All twelve combinations');
  }
});
