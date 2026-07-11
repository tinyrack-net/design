import '../../core/core.css';
import './spinner.css';
import { expect, test } from 'vitest';
import { createRawElement } from '../../../e2e/fixtures/component-browser-harness.js';
import { spinnerSizes, spinnerVariants } from './contract.js';

const cases = spinnerSizes.flatMap((size) =>
  spinnerVariants.map((variant) => [size, variant] as const),
);

test.each(
  cases,
)('raw Spinner supports %s/%s decorative and labeled states', (size, variant) => {
  const decorative = createRawElement('span', {
    attributes: { 'aria-hidden': 'true', role: 'presentation' },
    className: 'tr-spinner',
    data: { size, variant },
  });
  const labeled = createRawElement('span', {
    attributes: { 'aria-label': 'Loading', role: 'status' },
    className: 'tr-spinner',
    data: { size, variant },
  });
  expect(decorative).toHaveAttribute('aria-hidden', 'true');
  expect(labeled).toHaveAttribute('role', 'status');
  decorative.remove();
  labeled.remove();
});
