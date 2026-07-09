import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import { tabsActivationModes, tabsOrientations, tabsSizes } from './contract.js';

const repoRoot = process.cwd();

function readTabsCss() {
  return readFileSync(join(repoRoot, 'src/components/tabs/tabs.css'), 'utf8');
}

describe('tabs.css source contract', () => {
  it('is a source-owned component stylesheet without generated core CSS', () => {
    const css = readTabsCss();

    expect(css).toContain('.tr-tabs');
    expect(css).toContain('.tr-tabs-list');
    expect(css).toContain('.tr-tabs-trigger');
    expect(css).toContain('.tr-tabs-panel');
    expect(css).not.toContain('Generated from');
    expect(css).not.toContain('@theme static');
    expect(css).not.toContain('[data-theme="tinyrack-light"]');
    expect(css).not.toContain('[data-theme="tinyrack-dark"]');
    expect(css).not.toContain('.tabs');
    expect(css).not.toContain('.mantine-');
    expect(css).not.toContain('daisyui');
    expect(css).not.toContain('starlight');
  });

  it('covers the full Tabs option contract with CSS selectors', () => {
    const css = readTabsCss();

    for (const size of tabsSizes) {
      expect(css).toContain(`.tr-tabs[data-size="${size}"]`);
    }

    for (const orientation of tabsOrientations) {
      expect(css).toContain(`.tr-tabs[data-orientation="${orientation}"]`);
    }

    for (const activationMode of tabsActivationModes) {
      expect(['automatic', 'manual']).toContain(activationMode);
    }

    expect(css).toContain('.tr-tabs-trigger[aria-selected="true"]');
    expect(css).toContain('.tr-tabs-trigger[data-active="true"]');
    expect(css).toContain('.tr-tabs-panel[data-active="true"]');
    expect(css).toContain('.tr-tabs-panel[hidden]');
  });

  it('keeps Tailwind scale-backed Tabs size values in CSS', () => {
    const css = readTabsCss();

    expect(css).toContain('--tr-tabs-trigger-height: 2rem;');
    expect(css).toContain('--tr-tabs-trigger-padding-x: 0.75rem;');
    expect(css).toContain('--tr-tabs-trigger-height: 3rem;');
    expect(css).toContain('--tr-tabs-trigger-padding-x: 1.25rem;');
    expect(css).toContain('--tr-tabs-panel-padding: 1.25rem;');
  });

  it('keeps Tabs connected to its panel across orientations', () => {
    const css = readTabsCss();

    expect(css).not.toContain('--tr-tabs-gap');
    expect(css).toContain('gap: 0;');
    expect(css).toContain('width: 100%;');
    expect(css).toContain('max-width: 100%;');
    expect(css).toContain('--tr-tabs-list-gap: 0.25rem;');
    expect(css).toContain('border-bottom-color: var(--tinyrack-surface);');
    expect(css).toContain('border-right-color: var(--tinyrack-surface);');
    expect(css).toContain('border-radius: 0 0 0.375rem 0.375rem;');
    expect(css).toContain('.tr-tabs[data-orientation="vertical"] .tr-tabs-panel');
    expect(css).toContain('border-radius: 0 0.375rem 0.375rem 0;');
  });

  it('keeps semantic variable usage in CSS rather than the Tabs TS contract', () => {
    const css = readTabsCss();
    const contractSource = readFileSync(
      join(repoRoot, 'src/components/tabs/contract.ts'),
      'utf8',
    );

    expect(css).toContain('color: var(--tinyrack-text);');
    expect(css).toContain('color: var(--tinyrack-text-muted);');
    expect(css).toContain('border-color: var(--tinyrack-border);');
    expect(css).toContain('.tr-tabs-trigger:focus-visible');
    expect(css).toContain('.tr-tabs-panel:focus-visible');
    expect(css).toContain('.tr-tabs-trigger:disabled');
    expect(contractSource).not.toContain('var(--');
    expect(contractSource).not.toContain('--tinyrack-');
    expect(contractSource).not.toContain('--tr-tabs-');
  });
});
