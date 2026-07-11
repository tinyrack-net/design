import '../../core/core.css';
import './card.css';
import { expect, test } from 'vitest';
import { render } from 'vitest-browser-react';
import { cardPaddings, cardVariants } from './contract.js';
import { Card } from './react.js';

const cases = cardPaddings.flatMap((padding) =>
  cardVariants.map((variant) => [padding, variant] as const),
);

test.each(cases)('React Card supports %s/%s', async (padding, variant) => {
  const screen = await render(
    <Card data-owner="app" padding={padding} variant={variant}>
      Rack
    </Card>,
  );
  const card = screen.getByText('Rack').element();
  expect(card).toHaveAttribute('data-padding', padding);
  expect(card).toHaveAttribute('data-variant', variant);
  expect(card).toHaveAttribute('data-owner', 'app');
});
