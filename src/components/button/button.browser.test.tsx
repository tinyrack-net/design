import '../../core/core.css';
import './button.css';
import { expect, test } from 'vitest';
import { render } from 'vitest-browser-react';
import { Button, IconButton } from './react.js';

const themeDatasetKey = 'theme';

function computedStyleFor(element: Element) {
  return getComputedStyle(element);
}

function buttonByText(text: string) {
  const button = Array.from(document.querySelectorAll('button')).find(
    (element) => element.textContent === text,
  );

  if (!button) {
    throw new Error(`Unable to find button: ${text}`);
  }

  return button;
}

test('Button renders the CSS-first contract with defaults', async () => {
  document.documentElement.dataset[themeDatasetKey] = 'tinyrack-dark';
  await render(<Button>Deploy</Button>);
  const button = buttonByText('Deploy');

  await expect.element(button).toBeVisible();
  await expect.element(button).toHaveAttribute('type', 'button');
  await expect.element(button).toHaveAttribute('data-appearance', 'solid');
  await expect.element(button).toHaveAttribute('data-size', 'md');
  await expect.element(button).toHaveAttribute('data-variant', 'neutral');

  const styles = computedStyleFor(button);

  expect(styles.height).toBe('40px');
  expect(styles.paddingLeft).toBe('16px');
  expect(styles.gap).toBe('8px');
  expect(styles.fontSize).toBe('14px');
  expect(styles.borderRadius).toBe('6px');
});

test('Button size variants use the Tailwind default scale values', async () => {
  document.documentElement.dataset[themeDatasetKey] = 'tinyrack-dark';
  await render(
    <div>
      <Button size="sm">Small</Button>
      <Button size="lg">Large</Button>
    </div>,
  );

  const smallStyles = computedStyleFor(buttonByText('Small'));
  const largeStyles = computedStyleFor(buttonByText('Large'));

  expect(smallStyles.height).toBe('32px');
  expect(smallStyles.paddingLeft).toBe('12px');
  expect(smallStyles.gap).toBe('6px');
  expect(smallStyles.fontSize).toBe('14px');
  expect(largeStyles.height).toBe('48px');
  expect(largeStyles.paddingLeft).toBe('20px');
  expect(largeStyles.gap).toBe('10px');
  expect(largeStyles.fontSize).toBe('16px');
});

test('Button variant and appearance combinations resolve from semantic theme variables', async () => {
  document.documentElement.dataset[themeDatasetKey] = 'tinyrack-dark';
  await render(
    <div>
      <Button appearance="solid" variant="primary">
        Primary
      </Button>
      <Button appearance="outline" variant="danger">
        Danger outline
      </Button>
      <Button appearance="ghost" variant="primary">
        Primary ghost
      </Button>
    </div>,
  );

  const primaryStyles = computedStyleFor(buttonByText('Primary'));
  const dangerStyles = computedStyleFor(buttonByText('Danger outline'));
  const ghostStyles = computedStyleFor(buttonByText('Primary ghost'));

  expect(primaryStyles.backgroundColor).toBe('rgb(250, 250, 250)');
  expect(primaryStyles.color).toBe('rgb(10, 10, 10)');
  expect(dangerStyles.backgroundColor).toBe('rgba(0, 0, 0, 0)');
  expect(dangerStyles.borderColor).toBe('rgb(248, 113, 113)');
  expect(dangerStyles.color).toBe('rgb(248, 113, 113)');
  expect(ghostStyles.backgroundColor).toBe('rgba(0, 0, 0, 0)');
  expect(ghostStyles.borderColor).toBe('rgba(0, 0, 0, 0)');
  expect(ghostStyles.color).toBe('rgb(250, 250, 250)');
});

test('Button follows the active theme and disabled state', async () => {
  document.documentElement.dataset[themeDatasetKey] = 'tinyrack-light';
  await render(
    <Button disabled variant="primary">
      Disabled
    </Button>,
  );
  const button = buttonByText('Disabled');
  const styles = computedStyleFor(button);

  await expect.element(button).toBeDisabled();
  expect(styles.backgroundColor).toBe('rgb(23, 23, 23)');
  expect(styles.color).toBe('rgb(250, 250, 250)');
  expect(styles.opacity).toBe('0.5');
});

test('IconButton renders an accessible square action with the Button contract', async () => {
  document.documentElement.dataset[themeDatasetKey] = 'tinyrack-dark';
  await render(
    <IconButton aria-label="ignored label" label="Refresh rack" size="sm">
      R
    </IconButton>,
  );
  const button = document.querySelector<HTMLButtonElement>('.tr-icon-btn');

  if (!button) {
    throw new Error('Unable to find IconButton.');
  }

  await expect.element(button).toBeVisible();
  await expect.element(button).toHaveAttribute('aria-label', 'Refresh rack');
  await expect.element(button).toHaveAttribute('type', 'button');
  await expect.element(button).toHaveAttribute('data-size', 'sm');

  const styles = computedStyleFor(button);

  expect(styles.width).toBe('32px');
  expect(styles.height).toBe('32px');
  expect(styles.paddingLeft).toBe('0px');
});
