import '../../core/core.css';
import './progress.css';
import { expect, test } from 'vitest';
import { render } from 'vitest-browser-react';
import { progressSizes, progressVariants } from './contract.js';
import { Progress } from './react.js';

const cases = progressSizes.flatMap((size) =>
  progressVariants.map((variant) => [size, variant] as const),
);

test.each(cases)('React Progress supports %s/%s', async (size, variant) => {
  const screen = await render(
    <Progress aria-label="Build" max={10} size={size} value={4} variant={variant} />,
  );
  const progress = screen.getByRole('progressbar').element();
  expect(progress).toHaveAttribute('value', '4');
  expect(progress).toHaveAttribute('data-size', size);
  expect(progress).toHaveAttribute('data-variant', variant);
});
