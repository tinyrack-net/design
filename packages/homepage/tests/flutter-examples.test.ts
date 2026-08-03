import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';
import { flutterExamples } from '../app/documentation/flutter/flutter-examples.tsx';

const locales = ['en', 'ja', 'ko'] as const;

const previewExamplesSource = readFileSync(
  fileURLToPath(
    new URL('../../ui_flutter/example/lib/preview_examples.dart', import.meta.url),
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
  fileURLToPath(new URL('../../ui_flutter/example/lib/main.dart', import.meta.url)),
  'utf8',
);

const entries = Object.values(flutterExamples)
  .flat()
  .filter((entry) => entry !== undefined);

/** Splits the top-level arguments of a call that starts at `start` (just past `(`). */
function splitCallArguments(source: string, start: number): string[] {
  const segments: string[] = [];
  let current = '';
  let depth = 0;
  let quote = '';
  for (let index = start; index < source.length; index += 1) {
    const char = source.charAt(index);
    if (quote !== '') {
      current += char;
      if (char === '\\') {
        index += 1;
        current += source.charAt(index);
      } else if (char === quote) quote = '';
      continue;
    }
    if (char === "'" || char === '"' || char === '`') quote = char;
    else if (char === '{' || char === '[' || char === '(') depth += 1;
    else if (char === '}' || char === ']') depth -= 1;
    else if (char === ')') {
      if (depth === 0) break;
      depth -= 1;
    } else if (char === ',' && depth === 0) {
      segments.push(current);
      current = '';
      continue;
    }
    current += char;
  }
  segments.push(current);
  return segments;
}

/** Reads the keys of an object literal at the requested nesting depth. */
function objectKeysAtDepth(literal: string, target: number): string[] {
  const keys: string[] = [];
  let depth = 0;
  let quote = '';
  for (let index = 0; index < literal.length; index += 1) {
    const char = literal.charAt(index);
    if (quote !== '') {
      if (char === '\\') index += 1;
      else if (char === quote) quote = '';
      continue;
    }
    if (char === "'" || char === '"' || char === '`') quote = char;
    else if (char === '{' || char === '[' || char === '(') depth += 1;
    else if (char === '}' || char === ']' || char === ')') depth -= 1;
    else if (depth === target && !/[\w-]/.test(literal.charAt(index - 1))) {
      const key = /^([\w-]+)\s*:/.exec(literal.slice(index))?.[1];
      if (key !== undefined) {
        keys.push(key);
        index += key.length;
      }
    }
  }
  return keys;
}

/** Collects the arg keys each `flutterPlayground` call streams to the preview host. */
function parsePlaygroundArgs(source: string): Map<string, string[]> {
  const playgroundArgs = new Map<string, string[]>();
  for (const match of source.matchAll(/flutterPlayground\(\s*'([\w-]+)',/g)) {
    const [args, , localizedArgs] = splitCallArguments(
      source,
      match.index + match[0].length,
    );
    playgroundArgs.set(match[1] ?? '', [
      ...objectKeysAtDepth(args ?? '', 1),
      // `localizedArgs` keys the overrides by locale, so the arg names sit one
      // level deeper.
      ...objectKeysAtDepth(localizedArgs ?? '', 2),
    ]);
  }
  return playgroundArgs;
}

/**
 * Mirrors `_supportedArgs` in the preview host.
 *
 * The host rejects the whole `updateArgs` message when it carries a key the
 * component does not declare, and the docs frame renders that schema error as a
 * broken preview. Parsing the switch keeps the two sides aligned.
 */
function parseSupportedArgs(source: string): Map<string, string[]> {
  const body = source.match(
    /List<String> _supportedArgs\(String component\) => switch \(component\) \{([\s\S]*?)\n\};/,
  )?.[1];
  if (body === undefined) throw new Error('_supportedArgs switch not found');
  const supported = new Map<string, string[]>();
  const casePattern =
    /((?:'[\w-]+'\s*\|\|\s*)*'[\w-]+')\s*=>\s*(?:const\s*)?\[([^\]]*)\]/g;
  for (const [, keys, args] of body.matchAll(casePattern)) {
    const names = [...(args ?? '').matchAll(/'([\w-]+)'/g)].map(
      ([, name]) => name ?? '',
    );
    for (const [, component] of (keys ?? '').matchAll(/'([\w-]+)'/g)) {
      supported.set(component ?? '', names);
    }
  }
  return supported;
}

describe('Flutter documentation examples', () => {
  it('registers pilot components with at least one example', () => {
    for (const component of [
      'accordion',
      'button',
      'icon-button',
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

  it('declares every playground arg in the preview host schema', () => {
    const supported = parseSupportedArgs(previewHostSource);
    const playgroundArgs = parsePlaygroundArgs(playgroundsSource);
    expect(playgroundArgs.size).toBeGreaterThan(0);
    for (const [component, keys] of playgroundArgs) {
      const declared = new Set(supported.get(component) ?? []);
      expect(
        [...new Set(keys)].filter((key) => !declared.has(key)),
        `${component} sends args the preview host rejects`,
      ).toEqual([]);
    }
  });

  it('lets the CopyButton playground drive the rendered button', () => {
    expect(previewHostSource).toContain("'copy-button' => [");
    expect(previewHostSource).toContain("args['idleLabel'] is String");
    expect(previewHostSource).toContain("args['resetDelay']");
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

  it('keeps the IconButton examples aligned with the React documentation depth', () => {
    expect(flutterExamples['icon-button']?.map((entry) => entry.id)).toEqual([
      'icon-button-states',
      'icon-button-appearances',
      'icon-button-intents',
      'icon-button-sizes',
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
