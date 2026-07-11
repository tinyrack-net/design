import '../../core/core.css';
import './progress.css';
import { expect, test } from 'vitest';
import { createRawElement } from '../../../e2e/fixtures/component-browser-harness.js';
import { progressSizes, progressVariants } from './contract.js';

const cases = progressSizes.flatMap((size) =>
  progressVariants.map((variant) => [size, variant] as const),
);

test.each(cases)('raw Progress supports %s/%s', (size, variant) => {
  const progress = createRawElement('progress', {
    attributes: { max: '10', value: '4' },
    className: 'tr-progress',
    data: { size, variant },
  });
  expect(progress.value).toBe(4);
  expect(progress.dataset).toMatchObject({ size, variant });
  progress.remove();
});
