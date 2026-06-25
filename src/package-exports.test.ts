import { describe, expect, it } from 'vitest';
import packageJson from '../package.json' with { type: 'json' };

describe('package exports', () => {
  it('exposes granular theme subpaths', () => {
    expect(packageJson.exports).toHaveProperty('./tokens');
    expect(packageJson.exports).toHaveProperty('./tailwind.css');
    expect(packageJson.exports).toHaveProperty('./tailwind/daisyui.css');
    expect(packageJson.exports).toHaveProperty('./tailwind/mantine.css');
    expect(packageJson.exports).toHaveProperty('./mantine');
    expect(packageJson.exports).toHaveProperty('./mantine.css');
    expect(packageJson.exports).toHaveProperty('./daisyui');
    expect(packageJson.exports).toHaveProperty('./daisyui.css');
    expect(packageJson.exports).toHaveProperty('./astro/starlight');
    expect(packageJson.exports).toHaveProperty('./astro/starlight.css');
  });

  it('marks css files as side effects', () => {
    expect(packageJson.sideEffects).toContain('**/*.css');
  });
});
