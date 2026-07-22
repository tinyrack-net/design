import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';

const homepageRoot = fileURLToPath(new URL('../../../../homepage/', import.meta.url));

function readHomepage(path: string) {
  return readFileSync(new URL(path, `file://${homepageRoot}/`), 'utf8');
}

describe('menubar documentation', () => {
  it('keeps the Playground behavioral controls and reset-safe local state explicit', () => {
    const demo = readHomepage('app/documentation/components/menubar.demo.tsx');

    expect(demo).toContain("disabled: { control: 'boolean' }");
    expect(demo).toContain("orientation: { options: ['horizontal', 'vertical']");
    expect(demo).toContain('loopFocus: true');
    expect(demo).not.toContain("loopFocus: { control: 'boolean' }");
  });

  it('keeps every locale on shared paste-ready sources and the accurate root API', () => {
    const demo = readHomepage('app/documentation/components/menubar.demo.tsx');
    const css = readFileSync(new URL('./menubar.css', import.meta.url), 'utf8');
    const sourceNames = [
      'menubarBasicSource',
      'menubarApplicationSource',
      'menubarConfigurationsSource',
    ];

    for (const sourceName of sourceNames) {
      expect(demo).toContain(`export const ${sourceName}`);
    }
    expect(css).toContain('@import "../menu/menu.css";');
    expect(demo).toContain("import '@tinyrack/ui/components/menubar.css';");
    expect(demo).not.toContain("import '@tinyrack/ui/components/menu.css';");
    expect(demo).toContain('excludeStories: /.*(?:Preview|Matrix|Source)$/');

    for (const locale of ['en', 'ko', 'ja']) {
      const docs = readHomepage(`app/content/${locale}/components/menubar.mdx`);
      expect(docs).toContain("import '@tinyrack/ui/components/menubar.css';");
      expect(docs).not.toContain("import '@tinyrack/ui/components/menu.css';");
      expect(docs.match(/import '@tinyrack\/ui\/components\/[^']+\.css';/g)).toEqual([
        "import '@tinyrack/ui/components/menubar.css';",
      ]);
      expect(docs).toContain('`TRMenubar`');
      expect(docs).toContain('`TRMenubarProps`');
      expect(docs).toContain('`TRMenubarState`');
      expect(docs).not.toContain('compound part');
      expect(docs).not.toContain('baseUiExampleSources');
      expect(docs).not.toContain('code: String.raw`');
      for (const sourceName of sourceNames) {
        expect(docs).toContain(`code: Stories.${sourceName}`);
      }
    }
  });
});
