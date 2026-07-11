import '../../core/core.css';
import './code.css';
import { expect, test } from 'vitest';
import { render } from 'vitest-browser-react';
import { Code } from './react.js';

const themeDatasetKey = 'theme';

function computedStyleFor(element: Element) {
  return getComputedStyle(element);
}

test('Code renders semantic inline code with class merging', async () => {
  document.documentElement.dataset[themeDatasetKey] = 'tinyrack-dark';
  await render(<Code className="custom-code">pnpm verify</Code>);
  const code = document.querySelector<HTMLElement>('.tr-code');

  if (code === null) {
    throw new Error('Unable to find inline Code.');
  }

  await expect.element(code).toBeVisible();
  expect(code.tagName).toBe('CODE');
  expect(code.className).toContain('custom-code');

  const styles = computedStyleFor(code);

  expect(styles.backgroundColor).toBe('rgb(23, 23, 23)');
  expect(styles.color).toBe('rgb(250, 250, 250)');
  expect(styles.borderRadius).toBe('4px');
  expect(styles.overflowWrap).toBe('anywhere');
});
