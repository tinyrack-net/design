import { readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';

const componentsRoot = new URL('../components', import.meta.url).pathname.replace(
  /^\/([A-Za-z]:)/,
  '$1',
);

function componentStylesheets() {
  return readdirSync(componentsRoot, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .flatMap((entry) =>
      readdirSync(join(componentsRoot, entry.name))
        .filter((file) => file.endsWith('.css'))
        .map((file) => ({
          path: join(componentsRoot, entry.name, file),
          name: `${entry.name}/${file}`,
        })),
    );
}

describe('component motion', () => {
  it('gives every animated component a reduced-motion escape', () => {
    // A component that animates without honouring the preference is an
    // accessibility defect, and it also removes the only lever a test has for
    // taking motion out of a measurement. `tree-nav` reached this state with a
    // `rotate` transition on its chevron, the same shape as the navigation
    // menu icon that produced a real flake.
    const missing = componentStylesheets()
      .filter(({ path }) => {
        const css = readFileSync(path, 'utf8');
        return (
          /^\s*(?:transition|animation):/m.test(css) &&
          !css.includes('prefers-reduced-motion')
        );
      })
      .map(({ name }) => name);

    expect(missing).toEqual([]);
  });
});
