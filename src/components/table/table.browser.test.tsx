import '../../core/core.css';
import './table.css';
import { expect, test } from 'vitest';
import { render } from 'vitest-browser-react';
import { Table, TableContainer } from './react.js';

const themeDatasetKey = 'theme';

function computedStyleFor(element: Element) {
  return getComputedStyle(element);
}

function tableByCaption(text: string) {
  const caption = Array.from(document.querySelectorAll('caption')).find(
    (element) => element.textContent === text,
  );
  const table = caption?.closest('table');

  if (!table) {
    throw new Error(`Unable to find table: ${text}`);
  }

  return table;
}

function cellByText(text: string) {
  const cell = Array.from(document.querySelectorAll('td, th')).find(
    (element) => element.textContent === text,
  );

  if (!cell) {
    throw new Error(`Unable to find table cell: ${text}`);
  }

  return cell;
}

test('Table renders the CSS-first contract with native table markup', async () => {
  document.documentElement.dataset[themeDatasetKey] = 'tinyrack-dark';
  await render(
    <TableContainer data-testid="table-container">
      <Table>
        <caption>Rack health</caption>
        <thead>
          <tr>
            <th scope="col">Node</th>
            <th scope="col">Load</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>rack-a-01</td>
            <td>41%</td>
          </tr>
        </tbody>
      </Table>
    </TableContainer>,
  );

  const table = tableByCaption('Rack health');
  const container = table.closest('.tr-table-container');
  const caption = table.querySelector('caption');

  if (!container || !caption) {
    throw new Error('Expected TableContainer and caption to render.');
  }

  await expect.element(table).toBeVisible();
  await expect.element(caption).toBeVisible();
  await expect.element(table).toHaveAttribute('data-density', 'normal');
  await expect.element(table).not.toHaveAttribute('data-striped');
  expect(table.tagName).toBe('TABLE');
  expect(container).toHaveClass('tr-table-container');
  expect(table).toHaveClass('tr-table');
  expect(table.querySelectorAll('thead, tbody, tr, th, td')).toHaveLength(8);
});

test('Table density variants control cell spacing and line height', async () => {
  document.documentElement.dataset[themeDatasetKey] = 'tinyrack-dark';
  await render(
    <div>
      <TableContainer>
        <Table density="compact">
          <caption>Compact table</caption>
          <tbody>
            <tr>
              <td>Compact cell</td>
            </tr>
          </tbody>
        </Table>
      </TableContainer>
      <TableContainer>
        <Table density="normal">
          <caption>Normal table</caption>
          <tbody>
            <tr>
              <td>Normal cell</td>
            </tr>
          </tbody>
        </Table>
      </TableContainer>
      <TableContainer>
        <Table density="comfortable">
          <caption>Comfortable table</caption>
          <tbody>
            <tr>
              <td>Comfortable cell</td>
            </tr>
          </tbody>
        </Table>
      </TableContainer>
    </div>,
  );

  const compactStyles = computedStyleFor(cellByText('Compact cell'));
  const normalStyles = computedStyleFor(cellByText('Normal cell'));
  const comfortableStyles = computedStyleFor(cellByText('Comfortable cell'));

  expect(compactStyles.paddingTop).toBe('6px');
  expect(compactStyles.paddingLeft).toBe('12px');
  expect(compactStyles.lineHeight).toBe('20px');
  expect(normalStyles.paddingTop).toBe('10px');
  expect(normalStyles.paddingLeft).toBe('16px');
  expect(normalStyles.lineHeight).toBe('22px');
  expect(comfortableStyles.paddingTop).toBe('14px');
  expect(comfortableStyles.paddingLeft).toBe('20px');
  expect(comfortableStyles.lineHeight).toBe('24px');
});

test('Table follows the active theme and striped row contract', async () => {
  document.documentElement.dataset[themeDatasetKey] = 'tinyrack-light';
  await render(
    <TableContainer>
      <Table striped>
        <caption>Striped table</caption>
        <tbody>
          <tr>
            <td>First row</td>
          </tr>
          <tr>
            <td>Second row</td>
          </tr>
        </tbody>
      </Table>
    </TableContainer>,
  );

  const table = tableByCaption('Striped table');
  const firstRow = cellByText('First row').closest('tr');
  const secondRow = cellByText('Second row').closest('tr');

  if (!firstRow || !secondRow) {
    throw new Error('Expected striped table rows to render.');
  }

  await expect.element(table).toHaveAttribute('data-striped', 'true');

  const tableStyles = computedStyleFor(table);
  const firstRowStyles = computedStyleFor(firstRow);
  const secondRowStyles = computedStyleFor(secondRow);

  expect(tableStyles.backgroundColor).toBe('rgb(255, 255, 255)');
  expect(tableStyles.color).toBe('rgb(23, 23, 23)');
  expect(firstRowStyles.backgroundColor).toBe('rgba(0, 0, 0, 0)');
  expect(secondRowStyles.backgroundColor).toBe('rgb(245, 245, 245)');
});
