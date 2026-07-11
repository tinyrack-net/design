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
  expect(styles.backgroundColor).toBe('rgb(23, 23, 23)');
  expect(styles.color).toBe('rgb(250, 250, 250)');
});

test('Badge variants and sizes resolve from semantic theme variables', async () => {
  document.documentElement.dataset[themeDatasetKey] = 'tinyrack-light';
  await render(
    <div>
      <Badge className="custom-badge" size="md" variant="info">
        Info
      </Badge>
      <Badge variant="danger">Danger</Badge>
    </div>,
  );

  const info = badgeByText('Info');
  const danger = badgeByText('Danger');
  const infoStyles = computedStyleFor(info);
  const dangerStyles = computedStyleFor(danger);

  expect(info.className).toContain('custom-badge');
  expect(infoStyles.fontSize).toBe('14px');
  expect(infoStyles.backgroundColor).toBe('rgb(239, 246, 255)');
  expect(infoStyles.borderColor).toBe('rgb(37, 99, 235)');
  expect(infoStyles.color).toBe('rgb(29, 78, 216)');
  expect(dangerStyles.backgroundColor).toBe('rgb(254, 242, 242)');
  expect(dangerStyles.borderColor).toBe('rgb(220, 38, 38)');
  expect(dangerStyles.color).toBe('rgb(185, 28, 28)');
});
