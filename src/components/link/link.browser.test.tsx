import '../../core/core.css';
import './link.css';
import { expect, test } from 'vitest';
import { render } from 'vitest-browser-react';
import { Link } from './react.js';

const themeDatasetKey = 'theme';

test('Link renders a native anchor with the CSS-first contract', async () => {
  document.documentElement.dataset[themeDatasetKey] = 'tinyrack-dark';
  await render(
    <Link href="/racks" underline="always" variant="primary">
      Rack inventory
    </Link>,
  );
  const link = document.querySelector<HTMLAnchorElement>('.tr-link');

  if (!link) {
    throw new Error('Unable to find Link.');
  }

  await expect.element(link).toBeVisible();
  await expect.element(link).toHaveAttribute('href', '/racks');
  await expect.element(link).toHaveAttribute('data-variant', 'primary');
  await expect.element(link).toHaveAttribute('data-underline', 'always');

  const styles = getComputedStyle(link);

  expect(styles.color).toBe('rgb(250, 250, 250)');
  expect(styles.textDecorationLine).toBe('underline');
});
