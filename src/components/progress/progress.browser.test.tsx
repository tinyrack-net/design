import '../../core/core.css';
import './progress.css';
import { expect, test } from 'vitest';
import { render } from 'vitest-browser-react';
import { Progress } from './react.js';

const themeDatasetKey = 'theme';

test('Progress renders a native determinate progress element', async () => {
  document.documentElement.dataset[themeDatasetKey] = 'tinyrack-light';
  await render(<Progress aria-label="Deploy progress" max={100} value={42} />);
  const progress = document.querySelector<HTMLProgressElement>('.tr-progress');

  if (!progress) {
    throw new Error('Unable to find determinate Progress.');
  }

  await expect.element(progress).toBeVisible();
  await expect.element(progress).toHaveAttribute('max', '100');
  await expect.element(progress).toHaveAttribute('value', '42');
  await expect.element(progress).toHaveAttribute('data-size', 'md');
  await expect.element(progress).toHaveAttribute('data-variant', 'primary');
  expect(progress.getAttribute('aria-label')).toBe('Deploy progress');
  expect(getComputedStyle(progress).height).toBe('8px');
});

test('Progress supports indeterminate, size, and danger variant states', async () => {
  document.documentElement.dataset[themeDatasetKey] = 'tinyrack-dark';
  await render(<Progress aria-label="Syncing" size="lg" variant="danger" />);
  const progress = document.querySelector<HTMLProgressElement>('.tr-progress');

  if (!progress) {
    throw new Error('Unable to find indeterminate Progress.');
  }

  expect(progress.hasAttribute('value')).toBe(false);
  await expect.element(progress).toHaveAttribute('data-size', 'lg');
  await expect.element(progress).toHaveAttribute('data-variant', 'danger');
  expect(getComputedStyle(progress).height).toBe('12px');
  expect(
    getComputedStyle(progress).getPropertyValue('--tinyrack-duration-loading'),
  ).toBe('2.4s');
});
