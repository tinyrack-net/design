import '../../core/core.css';
import './card.css';
import { expect, test } from 'vitest';
import { render } from 'vitest-browser-react';
import { Card } from './react.js';

const themeDatasetKey = 'theme';

function cardByText(text: string) {
  const card = Array.from(document.querySelectorAll<HTMLElement>('.tr-card')).find(
    (element) => element.textContent === text,
  );

  if (!card) {
    throw new Error(`Unable to find card: ${text}`);
  }

  return card;
}

test('Card renders a padded semantic surface with defaults', async () => {
  document.documentElement.dataset[themeDatasetKey] = 'tinyrack-light';
  await render(<Card>Rack overview</Card>);
  const card = cardByText('Rack overview');

  await expect.element(card).toBeVisible();
  await expect.element(card).toHaveAttribute('data-padding', 'md');
  await expect.element(card).toHaveAttribute('data-variant', 'default');

  const styles = getComputedStyle(card);
  expect(styles.padding).toBe('12px');
  expect(styles.borderRadius).toBe('8px');
  expect(styles.backgroundColor).toBe('rgb(255, 255, 255)');
});

test('Card exposes custom padding, variant, and class names', async () => {
  document.documentElement.dataset[themeDatasetKey] = 'tinyrack-dark';
  await render(
    <Card className="custom-card" padding="lg" variant="muted">
      Rack logs
    </Card>,
  );
  const card = cardByText('Rack logs');

  expect(card.className).toContain('custom-card');
  await expect.element(card).toHaveAttribute('data-padding', 'lg');
  await expect.element(card).toHaveAttribute('data-variant', 'muted');
  expect(getComputedStyle(card).padding).toBe('16px');
  expect(getComputedStyle(card).backgroundColor).toBe('rgb(23, 23, 23)');
});
