import '../../core/core.css';
import './badge.css';
import { expect, test } from 'vitest';
import { render } from 'vitest-browser-react';
import { badgeSizes, badgeVariants } from './contract.js';
import { Badge } from './react.js';

const cases = badgeSizes.flatMap((size) =>
  badgeVariants.map((variant) => [size, variant] as const),
);

test.each(cases)('React Badge supports %s/%s', async (size, variant) => {
  const screen = await render(
    <Badge size={size} title="state" variant={variant}>
      Ready
    </Badge>,
  );
  const badge = screen.getByText('Ready').element();
  expect(badge).toHaveAttribute('data-size', size);
  expect(badge).toHaveAttribute('data-variant', variant);
  expect(badge).toHaveAttribute('title', 'state');
});
