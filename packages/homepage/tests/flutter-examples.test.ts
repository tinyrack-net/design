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

const entries = Object.values(flutterExamples)
  .flat()
  .filter((entry) => entry !== undefined);

describe('Flutter documentation examples', () => {
  it('registers pilot components with at least one example', () => {
    for (const component of [
      'button',
      'alert',
      'badge',
      'card',
      'tabs',
      'checkbox-group',
      'menu',
      'select',
      'dialog',
    ] as const) {
      expect(flutterExamples[component]?.length ?? 0, component).toBeGreaterThan(0);
    }
  });

  it('uses unique, localized, copy-ready entries', () => {
    const ids = entries.map((entry) => entry.id);
    expect(new Set(ids).size, 'duplicate example id').toBe(ids.length);

    for (const entry of entries) {
      expect(entry.dart.trim().length, `${entry.id} dart`).toBeGreaterThan(0);
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
});
