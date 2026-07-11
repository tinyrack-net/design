import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';

const repoRoot = process.cwd();

function readAccordionCss() {
  return readFileSync(join(repoRoot, 'src/components/accordion/accordion.css'), 'utf8');
}

describe('accordion.css source contract', () => {
  it('builds the grouped surface on the Disclosure CSS contract', () => {
    const css = readAccordionCss();

    expect(css).toContain('@import "../disclosure/disclosure.css";');
    expect(css).toContain('.tr-accordion');
    expect(css).toContain('.tr-accordion > .tr-accordion-item');
    expect(css).toContain('.tr-accordion > .tr-accordion-item + .tr-accordion-item');
    expect(css).toContain('.tr-accordion > .tr-accordion-item > .tr-accordion-content');
    expect(css).toContain('var(--tr-accordion-radius, var(--tinyrack-radius-md))');
    expect(css).toContain('var(--tr-accordion-background, var(--tinyrack-surface))');
    expect(css).not.toContain('Generated from');
    expect(css).not.toContain('@theme static');
    expect(css).not.toContain('.accordion:not(.tr-accordion)');
  });

  it('keeps grouped item overrides stronger than standalone Disclosure rules', () => {
    const css = readAccordionCss();

    expect(css).toContain('border: 0;');
    expect(css).toContain('border-radius: 0;');
    expect(css).not.toMatch(/(^|\n)\.tr-accordion-item\s*\{/);
  });
});
