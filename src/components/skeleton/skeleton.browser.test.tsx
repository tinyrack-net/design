import '../../core/core.css';
import './skeleton.css';
import { expect, test } from 'vitest';
import { render } from 'vitest-browser-react';
import { Skeleton } from './react.js';

const themeDatasetKey = 'theme';

test('Skeleton renders an accessible-hidden text placeholder by default', async () => {
  document.documentElement.dataset[themeDatasetKey] = 'tinyrack-light';
  await render(<Skeleton className="custom-skeleton" />);
  const skeleton = document.querySelector<HTMLElement>('.tr-skeleton');

  if (!skeleton) {
    throw new Error('Unable to find text Skeleton.');
  }

  await expect.element(skeleton).toBeVisible();
  await expect.element(skeleton).toHaveAttribute('aria-hidden', 'true');
  await expect.element(skeleton).toHaveAttribute('data-shape', 'text');
  await expect.element(skeleton).toHaveAttribute('data-animate', 'true');
  expect(skeleton.className).toContain('custom-skeleton');
  expect(getComputedStyle(skeleton, '::after').animationDuration).toBe('2.4s');
});

test('Skeleton supports static circular and rectangular placeholders', async () => {
  document.documentElement.dataset[themeDatasetKey] = 'tinyrack-dark';
  await render(
    <div>
      <Skeleton animate={false} shape="circle" />
      <Skeleton animate={false} shape="rectangle" />
    </div>,
  );
  const skeletons = document.querySelectorAll<HTMLElement>('.tr-skeleton');

  const circle = skeletons.item(0);
  const rectangle = skeletons.item(1);

  if (!circle || !rectangle) {
    throw new Error('Unable to find both Skeleton shapes.');
  }

  expect(skeletons).toHaveLength(2);
  await expect.element(circle).toHaveAttribute('data-shape', 'circle');
  await expect.element(circle).toHaveAttribute('data-animate', 'false');
  await expect.element(rectangle).toHaveAttribute('data-shape', 'rectangle');
  expect(getComputedStyle(circle).borderRadius).toBe('9999px');
  expect(getComputedStyle(rectangle).borderRadius).toBe('8px');
});
