import { test } from 'vitest';
import { render } from 'vitest-browser-react';
import {
  createRawElement,
  expectElementParity,
} from '../../../e2e/fixtures/component-browser-harness.js';
import { tableDensities } from './contract.js';
import { Table } from './react.js';

const cases = tableDensities.flatMap((density) =>
  [true, false].map((striped) => [density, striped] as const),
);

test.each(
  cases,
)('Table DOM/React parity for %s striped=%s', async (density, striped) => {
  const raw = createRawElement('table', {
    className: 'tr-table',
    data: { density, striped: striped ? 'true' : undefined },
  });
  raw.innerHTML = '<tbody><tr><td>Rack</td></tr></tbody>';
  const rendered = await render(
    <Table density={density} striped={striped}>
      <tbody>
        <tr>
          <td>Rack</td>
        </tr>
      </tbody>
    </Table>,
  );
  expectElementParity(raw, rendered.container.querySelector('.tr-table')!);
  raw.remove();
});
