import './core.css';
import { afterEach, expect, test } from 'vitest';

afterEach(() => {
  document.documentElement.removeAttribute('data-theme');
  document.querySelector('[data-global-surface-override]')?.remove();
});

test.each([
  ['tinyrack-light', 'rgb(255, 255, 255)', 'rgb(23, 23, 23)'],
  ['tinyrack-dark', 'rgb(10, 10, 10)', 'rgb(250, 250, 250)'],
] as const)('the %s theme paints the document canvas', (theme, surface, text) => {
  document.documentElement.dataset['theme'] = theme;

  for (const element of [document.documentElement, document.body]) {
    const styles = getComputedStyle(element);
    expect(styles.backgroundColor).toBe(surface);
    expect(styles.color).toBe(text);
  }
});

test('consumer document styles can override the global surface', () => {
  document.documentElement.dataset['theme'] = 'tinyrack-dark';
  const override = document.createElement('style');
  override.dataset['globalSurfaceOverride'] = '';
  override.textContent = `
    html, body {
      background-color: rgb(1, 2, 3);
      color: rgb(4, 5, 6);
    }
  `;
  document.head.append(override);

  for (const element of [document.documentElement, document.body]) {
    const styles = getComputedStyle(element);
    expect(styles.backgroundColor).toBe('rgb(1, 2, 3)');
    expect(styles.color).toBe('rgb(4, 5, 6)');
  }
});
