import { readdir, readFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';
import { renderConditions } from './visual-parity-conditions.ts';
import {
  endpointScenarioManifest,
  manifestDrift,
  motionScenarioManifest,
} from './visual-parity-manifest.ts';
import {
  heavilyMaskedComponents,
  parityMaskBudgets,
} from './visual-parity-mask-budgets.ts';
import {
  defaultMotionParityScenarios,
  fieldAppearanceComponents,
  motionParityScenarios,
  motionSampleTimes,
  motionSourceCoverage,
  parityComponents,
  parityContract,
  parityLocales,
  parityStates,
  parityThemes,
  representativeOnlySizes,
  representativeParityScenarios,
  textFieldStates,
  visualParityScenarios,
} from './visual-parity-scenarios.ts';
import {
  parityGeometryTolerances,
  parityInertStates,
} from './visual-parity-tolerances.ts';

describe('React and Flutter visual parity catalog', () => {
  it('preserves per-component scenario coverage', () => {
    expect(
      manifestDrift(endpointScenarioManifest, visualParityScenarios),
      'endpoint catalog drifted from the manifest',
    ).toEqual([]);
    expect(
      manifestDrift(motionScenarioManifest, defaultMotionParityScenarios),
      'motion catalog drifted from the manifest',
    ).toEqual([]);
  });

  it('preserves the execution multipliers the manifest is counted against', () => {
    // The manifest counts scenarios; these are what each scenario is multiplied
    // by to become a run. Trimming a locale or a theme would leave every
    // manifest entry intact while halving what actually executes.
    expect(parityLocales.length, 'locales').toBe(3);
    expect(parityThemes.length, 'themes').toBe(2);
    expect(motionSampleTimes.length, 'motion samples per scenario').toBe(6);
  });
  it('covers every common component and canonical variant value', () => {
    expect(new Set(visualParityScenarios.map(({ component }) => component))).toEqual(
      new Set(parityComponents),
    );

    for (const component of parityComponents) {
      const scenarios = visualParityScenarios.filter(
        (scenario) => scenario.component === component,
      );
      for (const [axis, expectedValues] of Object.entries(parityContract[component])) {
        const actualValues = new Set(
          scenarios
            .map(({ args }) => args[axis])
            .filter((value) => value !== undefined),
        );
        // uiSize carries representative-only values (sm on the button family)
        // that are deliberately not crossed with intent and state. They are real
        // coverage, so they appear in the catalog, but they are not part of the
        // fully crossed contract; fold them in before the exact comparison.
        const permitted =
          axis === 'uiSize'
            ? new Set([
                ...expectedValues,
                ...(representativeOnlySizes[component] ?? []),
              ])
            : new Set(expectedValues);
        expect(actualValues, `${component}.${axis}`).toEqual(permitted);
      }
    }
  });

  it('maps every public CSS motion source to a sampled Flutter scenario', () => {
    const sampledComponents = new Set(
      motionParityScenarios.map(({ component }) => component),
    );
    for (const [source, component] of Object.entries(motionSourceCoverage)) {
      expect(sampledComponents.has(component), source).toBe(true);
    }
  });

  it('keeps the motion source catalog synchronized with component CSS', async () => {
    const componentsRoot = resolve(import.meta.dirname, '../../ui_web/src/components');
    const entries = await readdir(componentsRoot, { withFileTypes: true });
    const discovered = new Set<string>();
    for (const entry of entries) {
      if (!entry.isDirectory()) continue;
      const files = await readdir(resolve(componentsRoot, entry.name));
      for (const file of files.filter((name) => name.endsWith('.css'))) {
        const css = await readFile(resolve(componentsRoot, entry.name, file), 'utf8');
        if (/\b(?:animation|transition)(?:-[\w-]+)?\s*:/.test(css)) {
          discovered.add(entry.name);
        }
      }
    }
    expect(discovered).toEqual(new Set(Object.keys(motionSourceCoverage)));
  });

  // The quick and smoke modes render only the representatives, so if a generator
  // change ever emitted a component's state scenarios before its base grid, CI
  // would silently turn into a disabled-state-only run.
  it('keeps every representative a solid, default-state scenario', () => {
    for (const scenario of representativeParityScenarios) {
      expect(scenario.state ?? 'default', scenario.id).toBe('default');
      if (fieldAppearanceComponents.has(scenario.component)) {
        expect(scenario.args['appearance'], scenario.id).toBe('solid');
      }
    }
  });

  // `text-pair-N` ids are positional, so inserting one axis value renumbers all
  // 311 of them. Pin the count to the all-pairs sum so an axis change fails
  // loudly with the intended new number instead of renumbering in silence.
  it('pins the positional text pair count to its axis cardinalities', () => {
    const cardinalities = Object.values(parityContract.text).map(
      (values) => values.length,
    );
    const pairSum = cardinalities.reduce(
      (total, left, index) =>
        total +
        cardinalities.slice(index + 1).reduce((sum, right) => sum + left * right, 0),
      0,
    );
    expect(
      visualParityScenarios.filter(({ component }) => component === 'text'),
    ).toHaveLength(pairSum);
  });

  // Every entry here is a divergence the suite knowingly does not enforce, so the
  // list has to stay small, justified, and visible in review.
  it('justifies and bounds every geometry tolerance', () => {
    const ids = parityGeometryTolerances.map(({ id }) => id);
    expect(new Set(ids).size, 'tolerance ids must be unique').toBe(ids.length);

    const scenarioIds = new Set(visualParityScenarios.map(({ id }) => id));
    for (const tolerance of parityGeometryTolerances) {
      expect(tolerance.reason.trim().length, `${tolerance.id} reason`).toBeGreaterThan(
        40,
      );
      expect(tolerance.review.trim().length, `${tolerance.id} review`).toBeGreaterThan(
        20,
      );
      expect(tolerance.scenarios.length, `${tolerance.id} scenarios`).toBeGreaterThan(
        0,
      );
      // A budget wide enough to swallow a layout mistake is not a tolerance.
      expect(tolerance.maxDelta, `${tolerance.id} maxDelta`).toBeGreaterThan(0);
      expect(tolerance.maxDelta, `${tolerance.id} maxDelta`).toBeLessThanOrEqual(3);
      for (const id of tolerance.scenarios) {
        expect(scenarioIds, `${tolerance.id} covers unknown scenario ${id}`).toContain(
          id,
        );
      }
    }
  });

  // A mask budget caps how much of each component the comparison may skip. The
  // table has to cover every component and stay bounded, or a green result could
  // be hiding an arbitrary fraction of the render.
  it('gives every component a bounded mask budget', () => {
    const budgeted = new Set(Object.keys(parityMaskBudgets));
    for (const component of parityComponents) {
      expect(budgeted, `${component} has no mask budget`).toContain(component);
    }
    for (const [component, budget] of Object.entries(parityMaskBudgets)) {
      // A budget of 100 would mask the whole render and assert nothing.
      expect(budget, `${component} budget`).toBeGreaterThan(0);
      expect(budget, `${component} budget`).toBeLessThan(95);
      // Anything above this is a component the mask nearly swallows; it must be
      // named so the list of what still needs tightening cannot grow in silence.
      if (budget > 55) {
        expect(
          heavilyMaskedComponents,
          `${component} masks ${budget}% but is not listed for tightening`,
        ).toContain(component);
      }
    }
    for (const component of heavilyMaskedComponents) {
      expect(
        parityMaskBudgets[component],
        `${component} is listed as heavily masked but its budget is modest`,
      ).toBeGreaterThan(45);
    }
  });

  // An inert declaration flips a fail-closed assertion, so a wrong entry hides
  // exactly the bug the assertion exists to catch: a forced state that never
  // landed. It carries the same justification burden as a geometry tolerance.
  it('justifies every declared-inert pair and keeps it real', () => {
    const ids = parityInertStates.map(({ id }) => id);
    expect(new Set(ids).size, 'inert ids must be unique').toBe(ids.length);

    const declared = new Set<string>();
    for (const entry of parityInertStates) {
      expect(entry.reason.trim().length, `${entry.id} reason`).toBeGreaterThan(40);
      expect(entry.review.trim().length, `${entry.id} review`).toBeGreaterThan(20);
      expect(entry.components.length, `${entry.id} components`).toBeGreaterThan(0);
      expect(entry.states.length, `${entry.id} states`).toBeGreaterThan(0);
      for (const component of entry.components) {
        for (const state of entry.states) {
          const pair = `${component}/${state}`;
          expect(declared, `${entry.id} declares ${pair} twice`).not.toContain(pair);
          declared.add(pair);
          // A pair nothing renders is a stale entry, not a tolerance.
          expect(
            visualParityScenarios.some(
              (scenario) =>
                scenario.component === component &&
                (scenario.state ?? 'default') === state &&
                (entry.appliesTo?.(scenario) ?? true),
            ),
            `${entry.id} covers unrendered pair ${pair}`,
          ).toBe(true);
          // Declaring a state inert that the harness never forces would be a
          // no-op entry that reads as a real exception.
          expect(
            renderConditions[state].paint,
            `${entry.id} lists ${pair}, which the harness already expects inert`,
          ).toBe('changes');
        }
      }
    }
  });

  it('keeps the tolerated scenario count from growing unnoticed', () => {
    const tolerated = new Set(
      parityGeometryTolerances.flatMap(({ scenarios }) => scenarios),
    );
    // Raise this deliberately, with the reason in the diff, or not at all.
    expect(tolerated.size).toBe(10);
  });

  it('uses stable unique scenario ids', () => {
    const ids = visualParityScenarios.map(({ id }) => id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('covers every pair of independent text modifiers', () => {
    const axes = Object.entries(parityContract.text);
    const scenarios = visualParityScenarios.filter(
      ({ component }) => component === 'text',
    );
    for (let left = 0; left < axes.length; left += 1) {
      for (let right = left + 1; right < axes.length; right += 1) {
        const leftAxis = axes[left];
        const rightAxis = axes[right];
        if (leftAxis === undefined || rightAxis === undefined) {
          throw new Error('Text parity axis index is out of bounds.');
        }
        const [leftName, leftValues] = leftAxis;
        const [rightName, rightValues] = rightAxis;
        for (const leftValue of leftValues) {
          for (const rightValue of rightValues) {
            expect(
              scenarios.some(
                ({ args }) =>
                  args[leftName] === leftValue && args[rightName] === rightValue,
              ),
              `${leftName}:${leftValue} × ${rightName}:${rightValue}`,
            ).toBe(true);
          }
        }
      }
    }
  });

  it('covers every interactive Button and IconButton state', () => {
    for (const component of ['button', 'icon-button'] as const) {
      expect(
        new Set(
          visualParityScenarios
            .filter((scenario) => scenario.component === component)
            .map((scenario) => scenario.state),
        ),
      ).toEqual(new Set(parityStates));
      for (const appearance of parityContract[component].appearance) {
        for (const intent of parityContract[component].intent) {
          for (const uiSize of parityContract[component].uiSize) {
            expect(
              new Set(
                visualParityScenarios
                  .filter(
                    (scenario) =>
                      scenario.component === component &&
                      scenario.args['appearance'] === appearance &&
                      scenario.args['intent'] === intent &&
                      scenario.args['uiSize'] === uiSize,
                  )
                  .map((scenario) => scenario.state),
              ),
              `${component}.${appearance}.${intent}.${uiSize}`,
            ).toEqual(new Set(parityStates));
          }
        }
      }
    }
  });

  it('covers every TextField state at every size', () => {
    for (const uiSize of parityContract['text-field'].uiSize) {
      expect(
        new Set(
          visualParityScenarios
            .filter(
              (scenario) =>
                scenario.component === 'text-field' &&
                scenario.args['uiSize'] === uiSize,
            )
            .map((scenario) => scenario.state),
        ),
      ).toEqual(new Set(textFieldStates));
    }
  });

  it('covers every interaction transition and sample time', () => {
    expect(motionSampleTimes).toEqual([0, 30, 60, 90, 120, 140]);
    for (const component of ['button', 'icon-button'] as const) {
      for (const appearance of parityContract[component].appearance) {
        for (const intent of parityContract[component].intent) {
          for (const transition of ['hover-in', 'hover-out', 'press-in', 'press-out']) {
            expect(
              motionParityScenarios.some(
                (scenario) =>
                  scenario.component === component &&
                  scenario.args['appearance'] === appearance &&
                  scenario.args['intent'] === intent &&
                  scenario.args['uiSize'] === 'md' &&
                  scenario.transition === transition,
              ),
            ).toBe(true);
          }
        }
        for (const uiSize of ['sm', 'lg']) {
          expect(
            motionParityScenarios.some(
              (scenario) =>
                scenario.component === component &&
                scenario.args['appearance'] === appearance &&
                scenario.args['uiSize'] === uiSize,
            ),
          ).toBe(true);
        }
      }
    }
    for (const uiSize of parityContract['text-field'].uiSize) {
      for (const transition of ['hover-in', 'hover-out']) {
        expect(
          motionParityScenarios.some(
            (scenario) =>
              scenario.component === 'text-field' &&
              scenario.args['uiSize'] === uiSize &&
              scenario.transition === transition,
          ),
        ).toBe(true);
      }
    }
  });

  it('covers every Alert icon, description, and actions combination', () => {
    const alerts = visualParityScenarios.filter(
      (scenario) => scenario.component === 'alert',
    );
    for (const showIcon of [false, true]) {
      for (const showDescription of [false, true]) {
        for (const showActions of [false, true]) {
          expect(
            alerts.some(
              ({ args }) =>
                args['showIcon'] === showIcon &&
                args['showDescription'] === showDescription &&
                args['showActions'] === showActions,
            ),
          ).toBe(true);
        }
      }
    }
  });
});
