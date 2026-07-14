import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import {
  baseUiComponentNames,
  baseUiSingleComponentNames,
} from '../scripts/component-catalog.js';

const repoRoot = process.cwd();
const baseUiRoot = join(repoRoot, 'node_modules/@base-ui/react');
const singleComponents = new Set<string>(baseUiSingleComponentNames);

function namespaceParts(component: string) {
  const partsFile = join(baseUiRoot, component, 'index.parts.d.ts');
  if (!existsSync(partsFile)) {
    return [];
  }

  const source = readFileSync(partsFile, 'utf8').replaceAll(/^export type .*$/gm, '');
  const aliases = Array.from(
    source.matchAll(/\bas\s+([A-Z][A-Za-z0-9]*)/g),
    ([, alias]) => alias,
  );
  const direct = Array.from(
    source.matchAll(/^export \{ ([A-Z][A-Za-z0-9]*) \}/gm),
    ([, name]) => name,
  );

  return [...new Set([...aliases, ...direct])]
    .filter((part) => part !== 'Handle' && part !== 'Orientation')
    .sort();
}

describe('Base UI 1.6.0 catalog parity', () => {
  it('pins the exact Base UI version used to define the catalog', () => {
    const packageJson = JSON.parse(
      readFileSync(join(baseUiRoot, 'package.json'), 'utf8'),
    ) as { version: string };

    expect(packageJson.version).toBe('1.6.0');
  });

  it.each(
    baseUiComponentNames,
  )('%s exists in the installed Base UI package', (component) => {
    expect(existsSync(join(baseUiRoot, component, 'index.d.ts'))).toBe(true);
  });

  it.each(
    baseUiComponentNames.filter((component) => !singleComponents.has(component)),
  )('%s exposes every public React anatomy part', (component) => {
    const expectedParts = namespaceParts(component);
    const indexSource = readFileSync(
      join(repoRoot, 'src/components', component, 'index.tsx'),
      'utf8',
    );

    expect(expectedParts.length).toBeGreaterThan(0);
    for (const part of expectedParts) {
      expect(indexSource, `${component}.${part}`).toContain(`${part}:`);
      expect(indexSource, `${component}${part}`).toContain(
        `${component
          .split('-')
          .map((segment) =>
            segment === 'otp'
              ? 'OTP'
              : `${segment[0]?.toUpperCase()}${segment.slice(1)}`,
          )
          .join('')}${part}`,
      );
    }
  });
});
