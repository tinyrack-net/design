import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import packageJson from '../package.json' with { type: 'json' };
import { componentNames } from '../scripts/component-catalog.js';

const repoRoot = process.cwd();
describe('component CSS distribution', () => {
  it('maps suffix-free CSS subpaths to colocated semantic files', () => {
    expect(packageJson.exports['./components/*.css']).toBe('./dist/components/*/*.css');
    expect(packageJson.exports['./core.css']).toBe('./dist/core.css');
    expect(packageJson.exports['./mdx.css']).toBe('./dist/mdx.css');
  });

  it.each(componentNames)('%s keeps source-owned CSS', (component) => {
    const path = join(repoRoot, 'src/components', component, `${component}.css`);
    expect(existsSync(path)).toBe(true);
    expect(readFileSync(path, 'utf8')).not.toContain('Generated from');
  });

  it('copy script has no Astro or overlay assets', () => {
    const source = readFileSync(join(repoRoot, 'scripts/copy-css.ts'), 'utf8');
    expect(source).not.toContain('.astro');
    expect(source).not.toContain("'overlay'");
    expect(source).toContain("{ source: 'core/core.css', target: 'core.css' }");
    expect(source).toContain("{ source: 'mdx/mdx.css', target: 'mdx.css' }");
  });
});
