import { test } from 'vitest';
import { render } from 'vitest-browser-react';
import {
  createRawElement,
  expectElementParity,
} from '../../../e2e/fixtures/component-browser-harness.js';
import { badgeSizes, badgeVariants } from './contract.js';
import { Badge } from './react.js';

const cases = badgeSizes.flatMap((size) =>
  badgeVariants.map((variant) => [size, variant] as const),
);

test.each(cases)('Badge DOM/React parity for %s/%s', async (size, variant) => {
  const raw = createRawElement('span', {
    className: 'tr-badge',
    data: { size, variant },
    text: 'Ready',
  });
  const rendered = await render(
    <Badge size={size} variant={variant}>
      Ready
    </Badge>,
  );
  expectElementParity(raw, rendered.container.querySelector('.tr-badge')!);
  raw.remove();
});
