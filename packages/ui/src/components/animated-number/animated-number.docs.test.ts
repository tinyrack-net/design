import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';

const homepageRoot = fileURLToPath(new URL('../../../../homepage/', import.meta.url));

function readHomepage(path: string) {
  return readFileSync(new URL(path, `file://${homepageRoot}/`), 'utf8');
}

describe('animated number documentation', () => {
  it('owns interactive, paste-ready examples', () => {
    const demo = readHomepage('app/documentation/components/animated-number.demo.tsx');

    expect(demo).toContain('AnimatedNumberCounterPreview');
    expect(demo).toContain('AnimatedNumberModesPreview');
    expect(demo).toContain('AnimatedNumberFormatsPreview');
    expect(demo).toContain('AnimatedNumberDirectionsPreview');
    expect(demo).toContain("import '@tinyrack/ui/components/animated-number.css';");
    expect(demo).toContain('excludeStories: /.*(?:Preview|Source)$/');
  });

  it('keeps API, accessibility, and example contracts aligned in every locale', () => {
    for (const locale of ['en', 'ko', 'ja']) {
      const docs = readHomepage(
        `app/content/${locale}/web/components/animated-number.mdx`,
      );

      expect(docs).toContain('`TRAnimatedNumber`');
      expect(docs).toContain('`animation`');
      expect(docs).toContain('`duration`');
      expect(docs).toContain('`rollDirection`');
      expect(docs).toContain('`format`');
      expect(docs).toContain('`locale`');
      expect(docs).toContain('`aria-live`');
      expect(docs).toContain('`prefers-reduced-motion`');
      expect(docs).toContain('animated-number-basic');
      expect(docs).toContain('animated-number-modes');
      expect(docs).toContain('animated-number-formats');
      expect(docs).toContain('animated-number-direction');
      expect(docs).toContain('code: Stories.animatedNumberBasicSource');
      expect(docs).toContain('code: Stories.animatedNumberModesSource');
      expect(docs).toContain('code: Stories.animatedNumberFormatsSource');
      expect(docs).toContain('code: Stories.animatedNumberDirectionsSource');
    }
  });
});
