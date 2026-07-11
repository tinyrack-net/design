import '../../core/core.css';
import './skeleton.css';
import { expect, test } from 'vitest';
import { createRawElement } from '../../../e2e/fixtures/component-browser-harness.js';
import { skeletonShapes } from './contract.js';

const cases = skeletonShapes.flatMap((shape) =>
  [true, false].map((animate) => [shape, animate] as const),
);

test.each(cases)('raw Skeleton supports %s animate=%s', (shape, animate) => {
  const skeleton = createRawElement('div', {
    attributes: { 'aria-hidden': 'true' },
    className: 'tr-skeleton',
    data: { animate: String(animate), shape },
  });
  expect(skeleton).toHaveAttribute('aria-hidden', 'true');
  expect(skeleton.dataset).toMatchObject({ animate: String(animate), shape });
  skeleton.remove();
});
