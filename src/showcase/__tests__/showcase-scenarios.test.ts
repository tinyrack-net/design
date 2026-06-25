import { describe, expect, it } from 'vitest';
import { daisyUiShowcaseEntries } from '../daisyui-showcase.js';
import { mantineShowcaseEntries } from '../mantine-showcase.js';
import { getShowcaseScenarioIds } from '../scenarios.js';

describe('component showcase scenarios', () => {
  it('exposes preview and variants scenarios for every component entry', () => {
    for (const entry of [...mantineShowcaseEntries, ...daisyUiShowcaseEntries]) {
      expect(getShowcaseScenarioIds(entry)).toEqual(['preview', 'variants']);
    }
  });

  it('provides useful named variant matrices for core button components', () => {
    const mantineButton = mantineShowcaseEntries.find(
      (entry) => entry.id === 'mantine-button',
    );
    const daisyButton = daisyUiShowcaseEntries.find(
      (entry) => entry.id === 'daisyui-button',
    );

    expect(mantineButton).toBeDefined();
    expect(daisyButton).toBeDefined();

    if (!mantineButton || !daisyButton) {
      throw new Error('Expected button showcase entries to exist');
    }

    expect(getShowcaseScenarioIds(mantineButton)).toContain('variants');
    expect(getShowcaseScenarioIds(daisyButton)).toContain('variants');
  });
});
