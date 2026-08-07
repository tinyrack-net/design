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

/**
 * Collects every arg key `_validateArgs` gives a value check.
 *
 * The switch ends in `_ => false`, so a key missing here is rejected even when
 * `_supportedArgs` lists it, and the frame renders a schema error instead of
 * the component. Value sets, `when component == '...'` guards, and other
 * braced literals are stripped so only case patterns remain.
 */
function parseValidatedArgKeys(source: string): Set<string> {
  const body = source.match(
    /final valid = switch \(key\) \{([\s\S]*?)\n\s*_ => false,/,
  )?.[1];
  if (body === undefined) throw new Error('_validateArgs switch not found');
  const patterns = body
    .replaceAll(/const\s*\{[^{}]*\}/g, '')
    .replaceAll(/\{[^{}]*\}/g, '')
    .replaceAll(/when[\s\S]*?(?==>)/g, '');
  return new Set([...patterns.matchAll(/'([\w-]+)'/g)].map(([, key]) => key ?? ''));
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
      'fieldset',
      'otp-field',
      'menu',
      'select',
      'dialog',
      'code-block',
      'animated-number',
      'autocomplete',
      'alert-dialog',
      'switch',
      'toggle',
      'toggle-group',
      'form',
      'textarea',
      'combobox',
      'slider',
      'radio',
      'radio-group',
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

  it('gives every playground arg a value check in the preview host', () => {
    const validated = parseValidatedArgKeys(previewHostSource);
    const playgroundArgs = parsePlaygroundArgs(playgroundsSource);
    expect(playgroundArgs.size).toBeGreaterThan(0);
    for (const [component, keys] of playgroundArgs) {
      expect(
        [...new Set(keys)].filter((key) => !validated.has(key)),
        `${component} sends args _validateArgs falls through to '_ => false'`,
      ).toEqual([]);
    }
  });

  it('lets the CopyButton playground drive the rendered button', () => {
    expect(previewHostSource).toContain("'copy-button' => [");
    expect(previewHostSource).toContain("args['idleLabel'] is String");
    expect(previewHostSource).toContain("args['resetDelay']");
  });

  it('lets Toggle and ToggleGroup previews report their own interaction', () => {
    expect(previewHostSource).toContain("'args': {'pressed': next}");
    expect(previewHostSource).toContain("'toggle-group' => TRToggleGroup");
    expect(previewHostSource).toContain("args['selectedValues'] is List");
    expect(previewHostSource).toContain("args['loopFocus'] != false");
  });

  it('keeps the Toggle examples aligned with the React documentation depth', () => {
    expect(flutterExamples.toggle?.map((entry) => entry.id)).toEqual([
      'toggle-controlled',
      'toggle-states',
      'toggle-sizes',
    ]);
    expect(flutterExamples['toggle-group']?.map((entry) => entry.id)).toEqual([
      'toggle-group-controlled',
      'toggle-group-multiple',
      'toggle-group-orientation',
    ]);
  });

  it('lets the Switch preview report its own interaction', () => {
    expect(previewHostSource).toContain("'args': {'checked': next}");
    expect(previewHostSource).toContain(
      "'switch' => ['checked', 'disabled', 'invalid', 'readOnly']",
    );
  });

  it('keeps the Switch examples aligned with the React documentation depth', () => {
    expect(flutterExamples.switch?.map((entry) => entry.id)).toEqual([
      'switch-controlled',
      'switch-availability',
      'switch-validation',
    ]);
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

  it('keeps the Form examples aligned with the React documentation depth', () => {
    expect(flutterExamples.form?.map((entry) => entry.id)).toEqual([
      'form-basic',
      'form-states',
      'form-server-errors',
      'form-actions',
    ]);
  });

  it('keeps the Fieldset examples aligned with the React documentation depth', () => {
    expect(flutterExamples.fieldset?.map((entry) => entry.id)).toEqual([
      'fieldset-basic',
      'fieldset-states',
      'fieldset-composition',
    ]);
  });

  it('keeps the Textarea examples aligned with the React documentation depth', () => {
    expect(flutterExamples.textarea?.map((entry) => entry.id)).toEqual([
      'textarea-basic',
      'textarea-states',
      'textarea-sizes',
      'textarea-form',
      'textarea-validation',
    ]);
  });

  it('keeps the Combobox examples aligned with the React documentation depth', () => {
    expect(flutterExamples.combobox?.map((entry) => entry.id)).toEqual([
      'combobox-basic',
      'combobox-sizes',
      'combobox-option-states',
      'combobox-filter-modes',
      'combobox-multiple-anatomy',
      'combobox-validation',
      'combobox-controlled-filter-hooks',
      'combobox-overlay',
      'combobox-keyboard',
      'combobox-form',
    ]);
  });

  it('keeps the Slider examples aligned with the React documentation depth', () => {
    expect(flutterExamples.slider?.map((entry) => entry.id)).toEqual([
      'slider-basic',
      'slider-sizes',
      'slider-states',
      'slider-disabled',
      'slider-range',
      'slider-form',
      'slider-validation',
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

  it('lets Radio and RadioGroup previews report their own selection', () => {
    expect(previewHostSource).toContain("'radio' => TRRadioGroup");
    expect(previewHostSource).toContain("'args': {'checked': next == 'on'}");
    expect(previewHostSource).toContain("'radio-group' => TRRadioGroup");
    expect(previewHostSource).toContain("'args': {'selectedValue': next}");
  });

  it('keeps the Radio examples aligned with the React documentation depth', () => {
    expect(flutterExamples.radio?.map((entry) => entry.id)).toEqual([
      'radio-states',
      'radio-sizes',
      'radio-availability',
    ]);
    expect(flutterExamples['radio-group']?.map((entry) => entry.id)).toEqual([
      'radio-group-states',
      'radio-group-validation',
      'radio-group-form',
    ]);
  });
});
