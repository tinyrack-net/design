import '../../core/core.css';
import './table.css';
import { createRef } from 'react';
import { expect, test } from 'vitest';
import { page } from 'vitest/browser';
import { render } from 'vitest-browser-react';
import { TRTable, TRTableRoot } from './index.js';

test('assembles a semantic table and forwards the table ref', async () => {
  const ref = createRef<HTMLTableElement>();
  expect(TRTable.Root).toBe(TRTableRoot);
  await render(
    <TRTable.Root ref={ref} density="compact" striped>
      <TRTable.Caption>Services</TRTable.Caption>
      <TRTable.Header>
        <TRTable.Row>
          <TRTable.Head>Name</TRTable.Head>
        </TRTable.Row>
      </TRTable.Header>
      <TRTable.Body>
        <TRTable.Row>
          <TRTable.Cell>API</TRTable.Cell>
        </TRTable.Row>
      </TRTable.Body>
      <TRTable.Footer>
        <TRTable.Row>
          <TRTable.Cell>Total</TRTable.Cell>
        </TRTable.Row>
      </TRTable.Footer>
    </TRTable.Root>,
  );
  expect(ref.current?.dataset['density']).toBe('compact');
  expect(ref.current?.closest('.tr-table-container')).not.toBeNull();
  expect(ref.current?.querySelector('caption')?.textContent).toBe('Services');
});

test('applies every public density value', async () => {
  await render(
    <div>
      <TRTable.Root data-testid="compact" density="compact">
        <TRTable.Body>
          <TRTable.Row>
            <TRTable.Cell>Compact</TRTable.Cell>
          </TRTable.Row>
        </TRTable.Body>
      </TRTable.Root>
      <TRTable.Root data-testid="spacious" density="spacious">
        <TRTable.Body>
          <TRTable.Row>
            <TRTable.Cell>Spacious</TRTable.Cell>
          </TRTable.Row>
        </TRTable.Body>
      </TRTable.Root>
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
    <TRTable.Root striped>
      <TRTable.Body>
        <TRTable.Row>
          <TRTable.Cell>Odd</TRTable.Cell>
        </TRTable.Row>
        <TRTable.Row data-testid="even-row">
          <TRTable.Cell>Even</TRTable.Cell>
        </TRTable.Row>
      </TRTable.Body>
    </TRTable.Root>,
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
    <TRTable.Root
      containerProps={{
        'aria-label': 'Service inventory',
        className: 'consumer-container',
        tabIndex: 0,
      }}
      containerRef={containerRef}
    >
      <TRTable.Body>
        <TRTable.Row>
          <TRTable.Cell>API</TRTable.Cell>
        </TRTable.Row>
      </TRTable.Body>
    </TRTable.Root>,
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
    <TRTable.Root containerProps={{ ref: containerRef }}>
      <TRTable.Body>
        <TRTable.Row>
          <TRTable.Cell>Worker</TRTable.Cell>
        </TRTable.Row>
      </TRTable.Body>
    </TRTable.Root>,
  );
  expect(containerRef.current?.classList.contains('tr-table-container')).toBe(true);
});

test('17 uses the subtle divider token for the table perimeter', async () => {
  document.documentElement.dataset['theme'] = 'tinyrack-light';
  await render(
    <TRTable.Root>
      <TRTable.Body>
        <TRTable.Row>
          <TRTable.Cell>Rack</TRTable.Cell>
        </TRTable.Row>
      </TRTable.Body>
    </TRTable.Root>,
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
