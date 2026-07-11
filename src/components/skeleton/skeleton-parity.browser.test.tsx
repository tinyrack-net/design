import { test } from 'vitest';
import { render } from 'vitest-browser-react';
import {
  createRawElement,
  expectElementParity,
} from '../../../e2e/fixtures/component-browser-harness.js';
import { skeletonShapes } from './contract.js';
import { Skeleton } from './react.js';

const cases = skeletonShapes.flatMap((shape) =>
  [true, false].map((animate) => [shape, animate] as const),
);

test.each(
  cases,
)('Skeleton DOM/React parity for %s animate=%s', async (shape, animate) => {
  const raw = createRawElement('div', {
    attributes: { 'aria-hidden': 'true' },
    className: 'tr-skeleton',
    data: { animate: String(animate), shape },
  });
  const rendered = await render(<Skeleton animate={animate} shape={shape} />);
  expectElementParity(raw, rendered.container.querySelector('.tr-skeleton')!);
  raw.remove();
});
