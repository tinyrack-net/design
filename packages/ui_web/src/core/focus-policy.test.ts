import { readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';

const componentsRoot = join(process.cwd(), 'src/components');
const pointerState =
  /:hover|\[data-(?:active|highlighted|open|popup-open|pressed|selected)(?:[\]=])|\[aria-(?:expanded|pressed|selected)(?:[\]=])/;
const focusChrome =
  /(?:border(?:-(?:color|top|right|bottom|left))?|outline)\s*:[^;]*(?:--tinyrack-focus|--tr-[a-z0-9-]*focus)/;

function componentCssFiles() {
  return readdirSync(componentsRoot, { recursive: true })
    .filter(
      (entry): entry is string => typeof entry === 'string' && entry.endsWith('.css'),
    )
    .map((entry) => join(componentsRoot, entry));
}

function pointerFocusChromeViolations(css: string) {
  const violations: string[] = [];
  for (const match of css.matchAll(/([^{}]+)\{([^{}]*)\}/g)) {
    const selector = match[1]?.trim() ?? '';
    const declarations = match[2] ?? '';
    if (pointerState.test(selector) && focusChrome.test(declarations)) {
      violations.push(selector);
    }
  }
  return violations;
}

describe('focus chrome policy', () => {
  it('rejects focus borders driven by pointer and selection states', () => {
    expect(
      pointerFocusChromeViolations(`
        .option[data-highlighted] {
          border: var(--tinyrack-focus-width) solid var(--tinyrack-focus);
        }
      `),
    ).toEqual(['.option[data-highlighted]']);
  });

  it('keeps every public pointer state free of focus chrome', () => {
    const violations = componentCssFiles().flatMap((file) =>
      pointerFocusChromeViolations(readFileSync(file, 'utf8')).map(
        (selector) => `${file}: ${selector}`,
      ),
    );

    expect(violations).toEqual([]);
  });
});
