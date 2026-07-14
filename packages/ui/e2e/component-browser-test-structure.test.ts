import { existsSync, readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import { componentNames, providerNames } from '../scripts/component-catalog.js';

const repoRoot = process.cwd();
const componentsRoot = join(repoRoot, 'src/components');
const providersRoot = join(repoRoot, 'src/providers');

describe('React-only component structure', () => {
  it('has exactly the supported public component directories', () => {
    const actual = readdirSync(componentsRoot, { withFileTypes: true })
      .filter((entry) => entry.isDirectory())
      .map((entry) => entry.name)
      .sort();

    expect(actual).toEqual([...componentNames].sort());
  });

  it.each(
    componentNames,
  )('%s has a public index, CSS, and one browser suite', (component) => {
    const componentRoot = join(componentsRoot, component);
    expect(existsSync(join(componentRoot, 'index.tsx'))).toBe(true);
    expect(existsSync(join(componentRoot, `${component}.css`))).toBe(true);
    expect(existsSync(join(componentRoot, `${component}.browser.test.tsx`))).toBe(true);
  });

  it('rejects legacy adapters, DOM managers, contracts, and parity suites', () => {
    const forbiddenNames = new Set([
      'contract.ts',
      'dom.ts',
      'react.tsx',
      'shared.ts',
      'utils.ts',
      'types.ts',
    ]);
    const files = componentNames.flatMap((component) =>
      readdirSync(join(componentsRoot, component)).map(
        (file) => `${component}/${file}`,
      ),
    );

    expect(
      files.filter((file) => forbiddenNames.has(file.split('/').at(-1) ?? '')),
    ).toEqual([]);
    expect(
      files.filter((file) => /-(dom|react|parity)\.browser\.test\.tsx$/.test(file)),
    ).toEqual([]);
    expect(existsSync(join(componentsRoot, 'overlay'))).toBe(false);
    expect(existsSync(join(componentsRoot, 'index.tsx'))).toBe(false);
  });

  it.each(componentNames)('%s index is composition-only', (component) => {
    const source = readFileSync(join(componentsRoot, component, 'index.tsx'), 'utf8');

    expect(source).not.toMatch(/\buse(State|Effect|LayoutEffect|Reducer|Ref)\b/);
    expect(source).not.toMatch(/return\s*\(/);
    expect(source).not.toMatch(/className=/);
    expect(source).not.toMatch(/<([A-Za-z]\w*)\b[^>]*>[\s\S]*<\/\1>/);
    expect(source).not.toMatch(/<[A-Za-z]\w*\b[^>]*\/>/);
  });

  it('has exactly the supported provider directories', () => {
    const actual = readdirSync(providersRoot, { withFileTypes: true })
      .filter((entry) => entry.isDirectory())
      .map((entry) => entry.name)
      .sort();

    expect(actual).toEqual([...providerNames].sort());
    for (const provider of providerNames) {
      expect(existsSync(join(providersRoot, provider, 'index.tsx'))).toBe(true);
    }
  });
});
