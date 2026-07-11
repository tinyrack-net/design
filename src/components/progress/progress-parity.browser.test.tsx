import { test } from 'vitest';
import { render } from 'vitest-browser-react';
import {
  createRawElement,
  expectElementParity,
} from '../../../e2e/fixtures/component-browser-harness.js';
import { progressSizes, progressVariants } from './contract.js';
import { Progress } from './react.js';

const cases = progressSizes.flatMap((size) =>
  progressVariants.map((variant) => [size, variant] as const),
);

test.each(cases)('Progress DOM/React parity for %s/%s', async (size, variant) => {
  const raw = createRawElement('progress', {
    attributes: { max: '10', value: '4' },
    className: 'tr-progress',
    data: { size, variant },
  });
  const rendered = await render(
    <Progress max={10} size={size} value={4} variant={variant} />,
  );
  expectElementParity(raw, rendered.container.querySelector('progress')!);
  raw.remove();
});
