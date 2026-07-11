import '../../core/core.css';
import './alert.css';
import { expect, test } from 'vitest';
import { render } from 'vitest-browser-react';
import { Alert } from './react.js';

const themeDatasetKey = 'theme';

function alertByText(text: string) {
  const alert = Array.from(document.querySelectorAll<HTMLElement>('.tr-alert')).find(
    (element) => element.textContent === text,
  );

  if (!alert) {
    throw new Error(`Unable to find alert: ${text}`);
  }

  return alert;
}

test('Alert renders a neutral message without forcing a live-region role', async () => {
  document.documentElement.dataset[themeDatasetKey] = 'tinyrack-dark';
  await render(<Alert>Backup is scheduled.</Alert>);
  const alert = alertByText('Backup is scheduled.');

  await expect.element(alert).toBeVisible();
  await expect.element(alert).toHaveAttribute('data-variant', 'neutral');
  expect(alert.getAttribute('role')).toBeNull();
  expect(getComputedStyle(alert).borderColor).toBe('rgb(64, 64, 64)');
});

test('Alert exposes danger styling and caller-provided semantics', async () => {
  document.documentElement.dataset[themeDatasetKey] = 'tinyrack-light';
  await render(
    <Alert className="custom-alert" role="alert" variant="danger">
      Node is offline.
    </Alert>,
  );
  const alert = alertByText('Node is offline.');

  expect(alert.className).toContain('custom-alert');
  await expect.element(alert).toHaveAttribute('role', 'alert');
  await expect.element(alert).toHaveAttribute('data-variant', 'danger');
  expect(getComputedStyle(alert).borderColor).toBe('rgb(220, 38, 38)');
  expect(getComputedStyle(alert).color).toBe('rgb(185, 28, 28)');
});
