import { readdir, readFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';
import {
  defaultMotionParityScenarios,
  motionParityScenarios,
  motionSampleTimes,
  motionSourceCoverage,
  parityComponents,
  parityContract,
  parityLocales,
  parityStates,
  parityThemes,
  textFieldStates,
  visualParityScenarios,
} from './visual-parity-scenarios.ts';

describe('React and Flutter visual parity catalog', () => {
  it('preserves the full endpoint and motion execution counts', () => {
    expect(
      visualParityScenarios.length * parityLocales.length * parityThemes.length,
    ).toBe(12_552);
    expect(defaultMotionParityScenarios.length * parityThemes.length).toBe(430);
    expect(
      defaultMotionParityScenarios.length *
        parityThemes.length *
        motionSampleTimes.length,
    ).toBe(2_580);
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
        expect(actualValues, `${component}.${axis}`).toEqual(new Set(expectedValues));
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
