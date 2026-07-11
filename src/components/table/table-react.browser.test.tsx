import '../../core/core.css';
import './table.css';
import { expect, test } from 'vitest';
import { render } from 'vitest-browser-react';
import { tableDensities } from './contract.js';
import { Table, TableContainer } from './react.js';

const cases = tableDensities.flatMap((density) =>
  [true, false].map((striped) => [density, striped] as const),
);

test.each(cases)('React Table supports %s striped=%s', async (density, striped) => {
  const screen = await render(
    <TableContainer className="scroll">
      <Table density={density} striped={striped}>
        <tbody>
          <tr>
            <td>Rack</td>
          </tr>
        </tbody>
      </Table>
    </TableContainer>,
  );
  const table = screen.getByRole('table').element();
  expect(table).toHaveAttribute('data-density', density);
  expect(table.getAttribute('data-striped')).toBe(striped ? 'true' : null);
  expect(table.parentElement).toHaveClass('tr-table-container', 'scroll');
});
