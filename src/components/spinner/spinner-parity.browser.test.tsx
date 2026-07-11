import { test } from 'vitest';
import { render } from 'vitest-browser-react';
import {
  createRawElement,
  expectElementParity,
} from '../../../e2e/fixtures/component-browser-harness.js';
import { spinnerSizes, spinnerVariants } from './contract.js';
import { Spinner } from './react.js';

const cases = spinnerSizes.flatMap((size) =>
  spinnerVariants.map((variant) => [size, variant] as const),
);

test.each(cases)('Spinner DOM/React parity for %s/%s', async (size, variant) => {
  const raw = createRawElement('span', {
    attributes: { 'aria-label': 'Loading', role: 'status' },
    className: 'tr-spinner',
    data: { size, variant },
  });
  const rendered = await render(
    <Spinner aria-label="Loading" size={size} variant={variant} />,
  );
  expectElementParity(raw, rendered.container.querySelector('.tr-spinner')!);
  raw.remove();
});
