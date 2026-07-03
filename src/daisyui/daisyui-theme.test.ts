import { describe, expect, it } from 'vitest';
import { tinyrackDaisyUiThemes } from './index.js';

const requiredVariables = [
  '--color-base-100',
  '--color-base-200',
  '--color-base-content',
  '--color-primary',
  '--color-primary-content',
  '--color-secondary',
  '--color-accent',
  '--color-info',
  '--color-success',
  '--color-warning',
  '--color-error',
] as const;

describe('tinyrack daisyUI themes', () => {
  it('provides light and dark themes with stable names', () => {
    expect(tinyrackDaisyUiThemes.light.name).toBe('tinyrack-light');
    expect(tinyrackDaisyUiThemes.dark.name).toBe('tinyrack-dark');
  });

  it('keeps dark mode as the default generated daisyUI theme', () => {
    expect(tinyrackDaisyUiThemes.light).toMatchObject({
      isDefault: false,
      prefersDark: false,
    });
    expect(tinyrackDaisyUiThemes.dark).toMatchObject({
      isDefault: true,
      prefersDark: true,
    });
  });

  it('contains every required daisyUI variable', () => {
    for (const theme of Object.values(tinyrackDaisyUiThemes)) {
      for (const variable of requiredVariables) {
        expect(theme.tokens[variable]).toEqual(expect.any(String));
      }
    }
  });
});
