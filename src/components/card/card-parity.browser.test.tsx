import { test } from 'vitest';
import { render } from 'vitest-browser-react';
import {
  createRawElement,
  expectElementParity,
} from '../../../e2e/fixtures/component-browser-harness.js';
import { cardPaddings, cardVariants } from './contract.js';
import { Card } from './react.js';

const cases = cardPaddings.flatMap((padding) =>
  cardVariants.map((variant) => [padding, variant] as const),
);

test.each(cases)('Card DOM/React parity for %s/%s', async (padding, variant) => {
  const raw = createRawElement('div', {
    className: 'tr-card',
    data: { padding, variant },
    text: 'Rack',
  });
  const rendered = await render(
    <Card padding={padding} variant={variant}>
      Rack
    </Card>,
  );
  expectElementParity(raw, rendered.container.querySelector('.tr-card')!);
  raw.remove();
});
