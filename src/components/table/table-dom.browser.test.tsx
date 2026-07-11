import '../../core/core.css';
import './table.css';
import { expect, test } from 'vitest';
import { createRawElement } from '../../../e2e/fixtures/component-browser-harness.js';
import { tableDensities } from './contract.js';

const cases = tableDensities.flatMap((density) =>
  [true, false].map((striped) => [density, striped] as const),
);

test.each(cases)('raw Table supports %s striped=%s', (density, striped) => {
  const table = createRawElement('table', {
    className: 'tr-table',
    data: { density, striped: striped ? 'true' : undefined },
  });
  table.innerHTML = '<tbody><tr><td>Rack</td></tr></tbody>';
  expect(table.dataset['density']).toBe(density);
  expect(table.dataset['striped']).toBe(striped ? 'true' : undefined);
  table.remove();
});
