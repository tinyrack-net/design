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

const curatedScenarioIds = [
  'states',
  'composition',
  'tokens',
  'accessibility',
  'playground',
] as const;

const formAndFeedbackScenarioMatrix = [
  {
    library: 'mantine',
    id: 'mantine-textinput',
    words: ['input', 'label', 'error'],
  },
  {
    library: 'mantine',
    id: 'mantine-input',
    words: ['input', 'label', 'error'],
  },
  {
    library: 'mantine',
    id: 'mantine-alert',
    words: ['alert', 'status'],
  },
  {
    library: 'mantine',
    id: 'mantine-badge',
    words: ['badge', 'status'],
  },
  {
    library: 'mantine',
    id: 'mantine-checkbox',
    words: ['checkbox', 'label'],
  },
  {
    library: 'mantine',
    id: 'mantine-switch',
    words: ['switch', 'label'],
  },
  {
    library: 'daisyui',
    id: 'daisyui-input',
    words: ['input', 'label', 'error'],
  },
  {
    library: 'daisyui',
    id: 'daisyui-alert',
    words: ['alert', 'status'],
  },
  {
    library: 'daisyui',
    id: 'daisyui-badge',
    words: ['badge', 'status'],
  },
  {
    library: 'daisyui',
    id: 'daisyui-checkbox',
    words: ['checkbox', 'label'],
  },
  {
    library: 'daisyui',
    id: 'daisyui-toggle',
    words: ['toggle', 'label'],
  },
  {
    library: 'daisyui',
    id: 'daisyui-radio',
    words: ['radio', 'label'],
  },
] as const;

const layoutAndContainerScenarioMatrix = [
  {
    library: 'mantine',
    id: 'mantine-card',
    words: ['card', 'surface', 'action'],
  },
  {
    library: 'mantine',
    id: 'mantine-modal',
    words: ['modal', 'dialog', 'confirm'],
  },
  {
    library: 'mantine',
    id: 'mantine-tabs',
    words: ['tabs', 'panel', 'navigation'],
  },
  {
    library: 'mantine',
    id: 'mantine-table',
    words: ['table', 'status', 'row'],
  },
  {
    library: 'mantine',
    id: 'mantine-stepper',
    words: ['step', 'flow', 'progress'],
  },
  {
    library: 'daisyui',
    id: 'daisyui-card',
    words: ['card', 'surface', 'action'],
  },
  {
    library: 'daisyui',
    id: 'daisyui-modal',
    words: ['modal', 'dialog', 'confirm'],
  },
  {
    library: 'daisyui',
    id: 'daisyui-tab',
    words: ['tabs', 'panel', 'navigation'],
  },
  {
    library: 'daisyui',
    id: 'daisyui-table',
    words: ['table', 'status', 'row'],
  },
  {
    library: 'daisyui',
    id: 'daisyui-navbar',
    words: ['navigation', 'menu', 'action'],
  },
  {
    library: 'daisyui',
    id: 'daisyui-dropdown',
    words: ['navigation', 'menu', 'action'],
  },
  {
    library: 'daisyui',
    id: 'daisyui-steps',
    words: ['step', 'flow', 'progress'],
  },
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

  it('provides curated full-page scenarios for form and feedback components', () => {
    for (const { library, id, words } of formAndFeedbackScenarioMatrix) {
      const entry =
        library === 'mantine'
          ? mantineShowcaseEntries.find((showcaseEntry) => showcaseEntry.id === id)
          : daisyUiShowcaseEntries.find((showcaseEntry) => showcaseEntry.id === id);

      expect(entry).toBeDefined();

      if (!entry) {
        throw new Error(`Expected ${id} showcase entry to exist`);
      }

      for (const scenarioId of curatedScenarioIds) {
        const scenario = getShowcaseScenario({ entry, library, scenarioId });
        const content = renderToStaticMarkup(
          library === 'mantine'
            ? createElement(TinyrackMantineProvider, null, scenario.render())
            : scenario.render(),
        ).toLowerCase();

        expect(content).toContain(scenarioId);
        expect(content).not.toContain('fallback documentation');

        for (const word of words) {
          expect(content).toContain(word);
        }
      }
    }
  });

  it('provides curated full-page scenarios for layout and container components', () => {
    for (const { library, id, words } of layoutAndContainerScenarioMatrix) {
      const entry =
        library === 'mantine'
          ? mantineShowcaseEntries.find((showcaseEntry) => showcaseEntry.id === id)
          : daisyUiShowcaseEntries.find((showcaseEntry) => showcaseEntry.id === id);

      expect(entry).toBeDefined();

      if (!entry) {
        throw new Error(`Expected ${id} showcase entry to exist`);
      }

      for (const scenarioId of curatedScenarioIds) {
        const scenario = getShowcaseScenario({ entry, library, scenarioId });
        const content = renderToStaticMarkup(
          library === 'mantine'
            ? createElement(TinyrackMantineProvider, null, scenario.render())
            : scenario.render(),
        ).toLowerCase();

        expect(content).toContain(scenarioId);
        expect(content).not.toContain('fallback documentation');

        for (const word of words) {
          expect(content).toContain(word);
        }
      }
    }
  });
});
