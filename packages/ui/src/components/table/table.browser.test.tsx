import '../../core/core.css';
import './table.css';
import { createRef } from 'react';
import { expect, test } from 'vitest';
import { page } from 'vitest/browser';
import { render } from 'vitest-browser-react';
import { Table, TableRoot } from './index.js';

test('assembles a semantic table and forwards the table ref', async () => {
  const ref = createRef<HTMLTableElement>();
  expect(Table.Root).toBe(TableRoot);
  await render(
    <Table.Root ref={ref} density="compact" striped>
      <Table.Caption>Services</Table.Caption>
      <Table.Header>
        <Table.Row>
          <Table.Head>Name</Table.Head>
        </Table.Row>
      </Table.Header>
      <Table.Body>
        <Table.Row>
          <Table.Cell>API</Table.Cell>
        </Table.Row>
      </Table.Body>
      <Table.Footer>
        <Table.Row>
          <Table.Cell>Total</Table.Cell>
        </Table.Row>
      </Table.Footer>
    </Table.Root>,
  );
  expect(ref.current?.dataset['density']).toBe('compact');
  expect(ref.current?.closest('.tr-table-container')).not.toBeNull();
  expect(ref.current?.querySelector('caption')?.textContent).toBe('Services');
});

test('applies every public density value', async () => {
  await render(
    <div>
      <Table.Root data-testid="compact" density="compact">
        <Table.Body>
          <Table.Row>
            <Table.Cell>Compact</Table.Cell>
          </Table.Row>
        </Table.Body>
      </Table.Root>
      <Table.Root data-testid="spacious" density="spacious">
        <Table.Body>
          <Table.Row>
            <Table.Cell>Spacious</Table.Cell>
          </Table.Row>
        </Table.Body>
      </Table.Root>
    </div>,
  );
  const compactCell = document.querySelector<HTMLElement>('[data-testid="compact"] td');
  const spaciousCell = document.querySelector<HTMLElement>(
    '[data-testid="spacious"] td',
  );
  expect(
    Number.parseFloat(getComputedStyle(spaciousCell as HTMLElement).paddingTop),
  ).toBeGreaterThan(
    Number.parseFloat(getComputedStyle(compactCell as HTMLElement).paddingTop),
  );
});

test('lets hover feedback override the even striped row surface', async () => {
  document.documentElement.dataset['theme'] = 'tinyrack-light';
  await render(
    <Table.Root striped>
      <Table.Body>
        <Table.Row>
          <Table.Cell>Odd</Table.Cell>
        </Table.Row>
        <Table.Row data-testid="even-row">
          <Table.Cell>Even</Table.Cell>
        </Table.Row>
      </Table.Body>
    </Table.Root>,
  );
  const row = document.querySelector<HTMLElement>('[data-testid="even-row"]');
  const stripedColor = getComputedStyle(row as HTMLElement).backgroundColor;
  await page.getByTestId('even-row').hover();
  await expect
    .poll(() => getComputedStyle(row as HTMLElement).backgroundColor)
    .not.toBe(stripedColor);
  delete document.documentElement.dataset['theme'];
});

test('names and focuses the overflow container through container props and ref', async () => {
  const containerRef = createRef<HTMLDivElement>();
  await render(
    <Table.Root
      containerProps={{
        'aria-label': 'Service inventory',
        className: 'consumer-container',
        tabIndex: 0,
      }}
      containerRef={containerRef}
    >
      <Table.Body>
        <Table.Row>
          <Table.Cell>API</Table.Cell>
        </Table.Row>
      </Table.Body>
    </Table.Root>,
  );
  containerRef.current?.focus();
  expect(containerRef.current).toBe(document.activeElement);
  expect(containerRef.current?.getAttribute('aria-label')).toBe('Service inventory');
  expect(containerRef.current?.classList.contains('consumer-container')).toBe(true);
  expect(getComputedStyle(containerRef.current as HTMLElement).overflowX).toBe('auto');
});

test('accepts a container ref through containerProps when containerRef is omitted', async () => {
  const containerRef = createRef<HTMLDivElement>();
  await render(
    <Table.Root containerProps={{ ref: containerRef }}>
      <Table.Body>
        <Table.Row>
          <Table.Cell>Worker</Table.Cell>
        </Table.Row>
      </Table.Body>
    </Table.Root>,
  );
  expect(containerRef.current?.classList.contains('tr-table-container')).toBe(true);
});

test('17 uses the subtle divider token for the table perimeter', async () => {
  document.documentElement.dataset['theme'] = 'tinyrack-light';
  await render(
    <Table.Root>
      <Table.Body>
        <Table.Row>
          <Table.Cell>Rack</Table.Cell>
        </Table.Row>
      </Table.Body>
    </Table.Root>,
  );
  const container = document.querySelector<HTMLElement>('.tr-table-container');
  const probe = document.createElement('div');
  probe.style.color = 'var(--tinyrack-border)';
  document.body.append(probe);
  expect(getComputedStyle(container as HTMLElement).borderTopColor).toBe(
    getComputedStyle(probe).color,
  );
  probe.remove();
  delete document.documentElement.dataset['theme'];
});
