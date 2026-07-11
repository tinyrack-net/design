import '../../core/core.css';
import './badge.css';
import { expect, test } from 'vitest';
import { createRawElement } from '../../../e2e/fixtures/component-browser-harness.js';
import { badgeSizes, badgeVariants } from './contract.js';

const cases = badgeSizes.flatMap((size) =>
  badgeVariants.map((variant) => [size, variant] as const),
);

test.each(cases)('raw Badge supports %s/%s', (size, variant) => {
  const badge = createRawElement('span', {
    className: 'tr-badge',
    data: { size, variant },
    text: 'Ready',
  });
  expect(badge.dataset).toMatchObject({ size, variant });
  expect(getComputedStyle(badge).display).not.toBe('none');
  badge.remove();
});
