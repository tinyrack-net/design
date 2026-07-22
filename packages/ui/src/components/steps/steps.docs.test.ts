import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';

const homepageRoot = fileURLToPath(new URL('../../../../homepage/', import.meta.url));

function readHomepage(path: string) {
  return readFileSync(new URL(path, `file://${homepageRoot}/`), 'utf8');
}

describe('steps documentation', () => {
  it('omits an empty Playground and owns shared paste-ready examples', () => {
    const demo = readHomepage('app/documentation/components/steps.demo.tsx');

    expect(demo).not.toContain('ComponentPlayground');
    expect(demo).toContain('argTypes: {}');
    expect(demo).toContain('export const stepsBasicSource');
    expect(demo).toContain('export const stepsRichContentSource');
    expect(demo).toContain("import '@tinyrack/ui/components/steps.css';");
    expect(demo).toContain('excludeStories: /.*(?:Preview|Source)$/');
  });

  it('documents complete anatomy, state boundaries, API, and examples in every locale', () => {
    for (const locale of ['en', 'ko', 'ja']) {
      const docs = readHomepage(`app/content/${locale}/components/steps.mdx`);

      expect(docs).toContain('`Root`');
      expect(docs).toContain('`Item`');
      expect(docs).toContain('`TRStepsRoot`');
      expect(docs).toContain('`TRStepsItem`');
      expect(docs).toContain('`TRStepsRootProps`');
      expect(docs).toContain('`TRStepsItemProps`');
      expect(docs).toContain('`aria-current`');
      expect(docs).toContain('`current`');
      expect(docs).toContain('`completed`');
      expect(docs).toContain('`disabled`');
      expect(docs).toContain('code: Stories.stepsBasicSource');
      expect(docs).toContain('code: Stories.stepsRichContentSource');
      expect(docs).not.toContain('code: String.raw`');
    }
  });
});
