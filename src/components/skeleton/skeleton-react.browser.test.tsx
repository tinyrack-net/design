import '../../core/core.css';
import './skeleton.css';
import { expect, test } from 'vitest';
import { render } from 'vitest-browser-react';
import { skeletonShapes } from './contract.js';
import { Skeleton } from './react.js';

const cases = skeletonShapes.flatMap((shape) =>
  [true, false].map((animate) => [shape, animate] as const),
);

test.each(cases)('React Skeleton supports %s animate=%s', async (shape, animate) => {
  const screen = await render(
    <Skeleton animate={animate} data-owner="app" shape={shape} />,
  );
  const skeleton = screen.container.querySelector('.tr-skeleton')!;
  expect(skeleton).toHaveAttribute('aria-hidden', 'true');
  expect(skeleton).toHaveAttribute('data-animate', String(animate));
  expect(skeleton).toHaveAttribute('data-shape', shape);
});
