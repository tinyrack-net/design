import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';

const homepageRoot = fileURLToPath(new URL('../../../../homepage/', import.meta.url));

function readHomepage(path: string) {
  return readFileSync(new URL(path, `file://${homepageRoot}/`), 'utf8');
}

describe('docs-shell documentation', () => {
  it('keeps Playground controls appearance-only, resettable, and fill-sized', () => {
    const demo = readHomepage('app/documentation/components/docs-shell.demo.tsx');

    expect(demo).toContain('type Args = { layout: TRDocsShellLayout }');
    expect(demo).not.toContain("pending: { control: 'boolean' }");
    expect(demo).not.toContain('pendingPath: { control:');
    expect(demo).toContain("...(pending ? { pendingPath: '/next' } : {})");
    expect(demo).not.toContain("pendingPath={pending ? '/next' : undefined}");
    expect(demo).not.toContain('pendingPath={undefined}');
    expect(demo).toContain(
      "parameters: { layout: 'centered', playgroundLayout: 'fill' }",
    );
    expect(demo).toContain("'--tr-docs-shell-block-size': '100%'");
  });

  it('shares complete paste-ready composition and layout examples in every locale', () => {
    const demo = readHomepage('app/documentation/components/docs-shell.demo.tsx');
    expect(demo).toContain('export const docsShellCompositionSource');
    expect(demo).toContain('export const docsShellLayoutsSource');
    expect(demo).toContain("import '@tinyrack/ui/components/docs-shell.css';");
    expect(demo).toContain(
      "import { TRDocsShell } from '@tinyrack/ui/components/docs-shell';",
    );
    expect(demo).toContain("import '@tinyrack/ui/components/button.css';");
    expect(demo).toContain(
      "import { TRButton } from '@tinyrack/ui/components/button';",
    );
    expect(demo).toContain("import '@tinyrack/ui/components/link.css';");
    expect(demo).toContain("import { TRLink } from '@tinyrack/ui/components/link';");
    expect(demo).not.toContain('<a ');
    expect(demo).not.toContain('<button');
    expect(demo).toContain('excludeStories: /.*(?:Preview|Source)$/');

    const anatomy = [
      'Root',
      'Header',
      'Brand',
      'Actions',
      'Sidebar',
      'Main',
      'Outline',
    ];
    const api = [
      'currentPath',
      'locationKey',
      'hash',
      'navigationKind',
      'pendingPath',
      'layout',
      'contentClassName',
      'viewportLabel',
    ];

    for (const locale of ['en', 'ko', 'ja']) {
      const docs = readHomepage(`app/content/${locale}/components/docs-shell.mdx`);
      expect(docs.match(/^## .+$/gm)).toEqual([
        '## Contract',
        '## Install',
        '## Playground',
        '## Usage',
        '## Examples',
        '## API',
      ]);
      expect(docs).toContain('preview={<Stories.DocsShellDocsPreview />}');
      expect(docs).toContain('code: Stories.docsShellCompositionSource');
      expect(docs).toContain('code: Stories.docsShellLayoutsSource');
      expect(docs).not.toContain('code: String.raw`');
      for (const part of anatomy) expect(docs).toContain(`\`${part}\``);
      for (const prop of api) expect(docs).toContain(`\`${prop}\``);
    }
  });
});
