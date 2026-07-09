import '../../core/core.css';
import './badge.css';
import { expect, test } from 'vitest';
import { render } from 'vitest-browser-react';
import { Badge } from './react.js';

const themeDatasetKey = 'theme';

function computedStyleFor(element: Element) {
  return getComputedStyle(element);
}

function badgeByText(text: string) {
  const badge = Array.from(document.querySelectorAll<HTMLElement>('.tr-badge')).find(
    (element) => element.textContent === text,
  );

  if (!badge) {
    throw new Error(`Unable to find badge: ${text}`);
  }

  return badge;
}

test('Badge renders the CSS-first contract with defaults', async () => {
  document.documentElement.dataset[themeDatasetKey] = 'tinyrack-dark';
  await render(<Badge>Healthy</Badge>);
  const badge = badgeByText('Healthy');

  await expect.element(badge).toBeVisible();
  await expect.element(badge).toHaveAttribute('data-size', 'sm');
  await expect.element(badge).toHaveAttribute('data-variant', 'neutral');
  expect(badge.className).toContain('tr-badge');

  const styles = computedStyleFor(badge);

  expect(styles.borderRadius).toBe('9999px');
  expect(styles.fontSize).toBe('12px');
  expect(styles.backgroundColor).toBe('rgb(38, 38, 38)');
  expect(styles.color).toBe('rgb(250, 250, 250)');
});

test('Badge variants and sizes resolve from semantic theme variables', async () => {
  document.documentElement.dataset[themeDatasetKey] = 'tinyrack-light';
  await render(
    <div>
      <Badge className="custom-badge" size="md" variant="primary">
        Primary
      </Badge>
      <Badge variant="danger">Danger</Badge>
    </div>,
  );

  const primary = badgeByText('Primary');
  const danger = badgeByText('Danger');
  const primaryStyles = computedStyleFor(primary);
  const dangerStyles = computedStyleFor(danger);

  expect(primary.className).toContain('custom-badge');
  expect(primaryStyles.fontSize).toBe('14px');
  expect(primaryStyles.backgroundColor).toBe('rgb(23, 23, 23)');
  expect(primaryStyles.color).toBe('rgb(250, 250, 250)');
  expect(dangerStyles.backgroundColor).toBe('rgb(220, 38, 38)');
  expect(dangerStyles.color).toBe('rgb(255, 255, 255)');
});
