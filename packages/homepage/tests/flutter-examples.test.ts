import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';
import { flutterExamples } from '../app/documentation/flutter/flutter-examples.tsx';

const locales = ['en', 'ja', 'ko'] as const;

const previewExamplesSource = readFileSync(
  fileURLToPath(
    new URL('../../tinyrack_ui/example/lib/preview_examples.dart', import.meta.url),
  ),
  'utf8',
);

const playgroundsSource = readFileSync(
  fileURLToPath(
    new URL('../app/documentation/flutter/playgrounds.tsx', import.meta.url),
  ),
  'utf8',
);

const previewHostSource = readFileSync(
  fileURLToPath(new URL('../../tinyrack_ui/example/lib/main.dart', import.meta.url)),
  'utf8',
);

const entries = Object.values(flutterExamples)
  .flat()
  .filter((entry) => entry !== undefined);

describe('Flutter documentation examples', () => {
  it('registers pilot components with at least one example', () => {
    for (const component of [
      'accordion',
      'button',
      'alert',
      'badge',
      'code',
      'card',
      'tabs',
      'checkbox',
      'checkbox-group',
      'menu',
      'select',
      'dialog',
      'code-block',
      'animated-number',
      'autocomplete',
      'alert-dialog',
    ] as const) {
      expect(flutterExamples[component]?.length ?? 0, component).toBeGreaterThan(0);
    }
  });

  it('lets the Code playground edit the rendered string', () => {
    expect(playgroundsSource).toContain("{ data: 'pnpm verify' }");
    expect(playgroundsSource).toContain("{ data: { control: 'textarea' } }");
    expect(previewHostSource).toContain("'code' => ['data']");
    expect(previewHostSource).toContain("args['data'] is String");
  });

  it('keeps the Accordion examples aligned with the React documentation depth', () => {
    expect(flutterExamples.accordion?.map((entry) => entry.id)).toEqual([
      'accordion-controlled',
      'accordion-expansion-states',
    ]);
  });

  it('keeps Flutter Checkbox examples aligned with the React learning path', () => {
    expect(flutterExamples.checkbox?.map((entry) => entry.id)).toEqual([
      'checkbox-states',
      'checkbox-sizes',
      'checkbox-availability',
      'checkbox-validation',
      'checkbox-form-values',
    ]);
  });

  it('uses unique, localized, copy-ready entries', () => {
    const ids = entries.map((entry) => entry.id);
    expect(new Set(ids).size, 'duplicate example id').toBe(ids.length);

    for (const entry of entries) {
      if (typeof entry.dart === 'string') {
        expect(entry.dart.trim().length, `${entry.id} dart`).toBeGreaterThan(0);
      } else {
        for (const locale of locales) {
          expect(
            entry.dart[locale]?.trim().length,
            `${entry.id} ${locale} dart`,
          ).toBeGreaterThan(0);
        }
      }
      for (const locale of locales) {
        expect(
          entry.title[locale]?.trim().length,
          `${entry.id} ${locale} title`,
        ).toBeGreaterThan(0);
        expect(
          entry.description[locale]?.trim().length,
          `${entry.id} ${locale} description`,
        ).toBeGreaterThan(0);
      }
    }
  });

  it('maps every example id to a Flutter preview scenario', () => {
    // The preview bundle resolves `?example=<id>` against
    // previewExampleScenarios; a missing key would render an error in docs.
    for (const entry of entries) {
      expect(
        previewExamplesSource.includes(`'${entry.id}':`),
        `${entry.id} missing from preview_examples.dart`,
      ).toBe(true);
    }
  });

  it('covers the CheckboxGroup decisions documented by the React surface', () => {
    expect(flutterExamples['checkbox-group']?.map((entry) => entry.id)).toEqual([
      'checkbox-group-options',
      'checkbox-group-disabled',
      'checkbox-group-validation',
      'checkbox-group-parent',
      'checkbox-group-form',
    ]);
  });
});
