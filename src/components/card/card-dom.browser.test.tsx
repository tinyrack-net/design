import '../../core/core.css';
import './card.css';
import { expect, test } from 'vitest';
import { createRawElement } from '../../../e2e/fixtures/component-browser-harness.js';
import { cardPaddings, cardVariants } from './contract.js';

const cases = cardPaddings.flatMap((padding) =>
  cardVariants.map((variant) => [padding, variant] as const),
);

test.each(cases)('raw Card supports %s/%s', (padding, variant) => {
  const card = createRawElement('div', {
    className: 'tr-card',
    data: { padding, variant },
    text: 'Rack',
  });
  expect(card.dataset).toMatchObject({ padding, variant });
  expect(getComputedStyle(card).padding).not.toBe('0px');
  card.remove();
});
