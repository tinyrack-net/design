import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import { TinyrackMantineProvider } from '../../mantine/index.js';
import { daisyUiShowcaseEntries } from '../daisyui-showcase.js';
import { mantineShowcaseEntries } from '../mantine-showcase.js';
import { getShowcaseScenario, getShowcaseScenarioIds } from '../scenarios.js';

const requiredScenarios = [
  'preview',
  'variants',
  'states',
  'composition',
  'tokens',
  'accessibility',
  'playground',
] as const;

describe('component showcase scenarios', () => {
  it('exposes all design-system page scenarios for every component entry', () => {
    for (const entry of [...mantineShowcaseEntries, ...daisyUiShowcaseEntries]) {
      expect(getShowcaseScenarioIds(entry)).toEqual(requiredScenarios);
    }
  });

  it('renders generic fallback content for every scenario on uncurated components', () => {
    const mantineAccordion = mantineShowcaseEntries.find(
      (entry) => entry.id === 'mantine-accordion',
    );

    expect(mantineAccordion).toBeDefined();

    if (!mantineAccordion) {
      throw new Error('Expected accordion showcase entry to exist');
    }

    for (const scenarioId of requiredScenarios) {
      const scenario = getShowcaseScenario({
        entry: mantineAccordion,
        library: 'mantine',
        scenarioId,
      });

      expect(scenario.id).toBe(scenarioId);
      expect(scenario.name.length).toBeGreaterThan(0);
      expect(scenario.description.length).toBeGreaterThan(0);
      expect(scenario.render()).toBeTruthy();
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

  it('provides curated full-page scenarios for core button components', () => {
    const entries = [
      [
        'mantine',
        mantineShowcaseEntries.find((entry) => entry.id === 'mantine-button'),
      ],
      [
        'daisyui',
        daisyUiShowcaseEntries.find((entry) => entry.id === 'daisyui-button'),
      ],
    ] as const;

    for (const [library, entry] of entries) {
      expect(entry).toBeDefined();

      if (!entry) {
        throw new Error(`Expected ${library} button showcase entry to exist`);
      }

      for (const scenarioId of [
        'states',
        'composition',
        'tokens',
        'accessibility',
        'playground',
      ] as const) {
        const scenario = getShowcaseScenario({ entry, library, scenarioId });
        const content = renderToStaticMarkup(
          library === 'mantine'
            ? createElement(TinyrackMantineProvider, null, scenario.render())
            : scenario.render(),
        );

        expect(content.toLowerCase()).toContain(scenarioId);
        expect(content.toLowerCase()).toContain('button');
      }
    }
  });
});
