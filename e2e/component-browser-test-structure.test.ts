import { readdirSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';

const componentsRoot = join(process.cwd(), 'src', 'components');
const componentNames = readdirSync(componentsRoot, { withFileTypes: true })
  .filter((entry) => entry.isDirectory())
  .map((entry) => entry.name)
  .sort();

describe('component browser test structure', () => {
  it('keeps DOM, React and parity browser suites beside every component', () => {
    expect(componentNames).toHaveLength(22);

    for (const componentName of componentNames) {
      const files = readdirSync(join(componentsRoot, componentName));

      expect(files, `${componentName} is missing its raw DOM browser suite`).toContain(
        `${componentName}-dom.browser.test.tsx`,
      );
      expect(files, `${componentName} is missing its React browser suite`).toContain(
        `${componentName}-react.browser.test.tsx`,
      );
      expect(files, `${componentName} is missing its DOM/React parity suite`).toContain(
        `${componentName}-parity.browser.test.tsx`,
      );
    }
  });
});
