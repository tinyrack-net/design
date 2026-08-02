import '../../core/core.css';
import './table.css';
import { type CSSProperties, createRef } from 'react';
import { hydrateRoot } from 'react-dom/client';
import { renderToString } from 'react-dom/server.browser';
import { expect, test } from 'vitest';
import { page } from 'vitest/browser';
import { render } from 'vitest-browser-react';
import {
  TRTable,
  TRTableBody,
  TRTableCaption,
  TRTableCell,
  TRTableFooter,
  TRTableHead,
  TRTableHeader,
  TRTableRoot,
  TRTableRow,
} from './index.js';

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

test('exports every native anatomy part through named and compound APIs', () => {
  expect(TRTable.Root).toBe(TRTableRoot);
  expect(TRTable.Caption).toBe(TRTableCaption);
  expect(TRTable.Header).toBe(TRTableHeader);
  expect(TRTable.Body).toBe(TRTableBody);
  expect(TRTable.Footer).toBe(TRTableFooter);
  expect(TRTable.Row).toBe(TRTableRow);
  expect(TRTable.Head).toBe(TRTableHead);
  expect(TRTable.Cell).toBe(TRTableCell);
});

test('forwards refs, classes, native props, and events from every part', async () => {
  const captionRef = createRef<HTMLTableCaptionElement>();
  const headerRef = createRef<HTMLTableSectionElement>();
  const bodyRef = createRef<HTMLTableSectionElement>();
  const footerRef = createRef<HTMLTableSectionElement>();
  const rowRef = createRef<HTMLTableRowElement>();
  const headRef = createRef<HTMLTableCellElement>();
  const cellRef = createRef<HTMLTableCellElement>();
  let clicks = 0;

  await render(
    <TRTable.Root aria-describedby="table-help" className="consumer-table">
      <TRTable.Caption className="consumer-caption" ref={captionRef}>
        Deployments
      </TRTable.Caption>
      <TRTable.Header data-section="header" ref={headerRef}>
        <TRTable.Row ref={rowRef}>
          <TRTable.Head abbr="Service name" ref={headRef} scope="col">
            Service
          </TRTable.Head>
        </TRTable.Row>
      </TRTable.Header>
      <TRTable.Body ref={bodyRef}>
        <TRTable.Row>
          <TRTable.Cell colSpan={1} onClick={() => clicks++} ref={cellRef}>
            Gateway
          </TRTable.Cell>
        </TRTable.Row>
      </TRTable.Body>
      <TRTable.Footer ref={footerRef}>
        <TRTable.Row>
          <TRTable.Cell>Total</TRTable.Cell>
        </TRTable.Row>
      </TRTable.Footer>
    </TRTable.Root>,
  );

  cellRef.current?.click();
  expect(clicks).toBe(1);
  expect(captionRef.current).toHaveClass('tr-table-caption', 'consumer-caption');
  expect(headerRef.current).toHaveAttribute('data-section', 'header');
  expect(bodyRef.current).toHaveClass('tr-table-body');
  expect(footerRef.current).toHaveClass('tr-table-footer');
  expect(rowRef.current).toHaveClass('tr-table-row');
  expect(headRef.current).toHaveAttribute('abbr', 'Service name');
  expect(cellRef.current).toHaveAttribute('colspan', '1');
  expect(captionRef.current?.closest('table')).toHaveClass(
    'tr-table',
    'consumer-table',
  );
});

test('styles captions as readable table metadata', async () => {
  document.documentElement.dataset['theme'] = 'tinyrack-light';
  await render(
    <TRTable.Root>
      <TRTable.Caption data-testid="caption">Updated every minute</TRTable.Caption>
    </TRTable.Root>,
  );
  const caption = document.querySelector<HTMLElement>('[data-testid="caption"]');
  const captionStyle = getComputedStyle(caption as HTMLElement);
  const probe = document.createElement('div');
  probe.style.color = 'var(--tinyrack-text-muted)';
  document.body.append(probe);

  expect(captionStyle.color).toBe(getComputedStyle(probe).color);
  expect(Number.parseFloat(captionStyle.paddingTop)).toBeGreaterThan(0);
  expect(captionStyle.textAlign).toBe('left');

  probe.remove();
  delete document.documentElement.dataset['theme'];
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

test('preserves container and cell style overrides', async () => {
  await render(
    <TRTable.Root
      containerClassName="consumer-overflow"
      containerProps={{ style: { maxWidth: 240 } }}
      style={
        {
          '--tr-table-cell-padding-x': '31px',
          '--tr-table-cell-padding-y': '17px',
        } as CSSProperties
      }
    >
      <TRTable.Body>
        <TRTable.Row>
          <TRTable.Cell data-testid="custom-cell">Rack</TRTable.Cell>
        </TRTable.Row>
      </TRTable.Body>
    </TRTable.Root>,
  );
  const container = document.querySelector<HTMLElement>('.tr-table-container');
  const cell = document.querySelector<HTMLElement>('[data-testid="custom-cell"]');

  expect(container).toHaveClass('consumer-overflow');
  expect(container?.style.maxWidth).toBe('240px');
  expect(getComputedStyle(cell as HTMLElement).paddingLeft).toBe('31px');
  expect(getComputedStyle(cell as HTMLElement).paddingTop).toBe('17px');
});

test('contains wide tables in the horizontal overflow region', async () => {
  await render(
    <div style={{ width: 240 }}>
      <TRTable.Root style={{ minWidth: 640 }}>
        <TRTable.Body>
          <TRTable.Row>
            <TRTable.Cell>Long deployment record</TRTable.Cell>
          </TRTable.Row>
        </TRTable.Body>
      </TRTable.Root>
    </div>,
  );
  const container = document.querySelector<HTMLElement>('.tr-table-container');

  expect(container?.clientWidth).toBeLessThan(container?.scrollWidth as number);
  expect(document.documentElement.scrollWidth).toBe(
    document.documentElement.clientWidth,
  );
});

test('renders and hydrates stable semantic table markup', async () => {
  const fixture = (
    <TRTable.Root density="spacious" striped>
      <TRTable.Caption>Services</TRTable.Caption>
      <TRTable.Header>
        <TRTable.Row>
          <TRTable.Head scope="col">Name</TRTable.Head>
        </TRTable.Row>
      </TRTable.Header>
      <TRTable.Body>
        <TRTable.Row>
          <TRTable.Cell>Gateway</TRTable.Cell>
        </TRTable.Row>
      </TRTable.Body>
    </TRTable.Root>
  );
  const host = document.createElement('div');
  host.innerHTML = renderToString(fixture);
  document.body.append(host);
  const errors: unknown[] = [];
  const root = hydrateRoot(host, fixture, {
    onRecoverableError: (error) => errors.push(error),
  });

  await expect
    .poll(() => host.querySelector('table')?.dataset['density'])
    .toBe('spacious');
  expect(
    host.querySelectorAll('table > caption, table > thead, table > tbody'),
  ).toHaveLength(3);
  expect(errors).toHaveLength(0);

  root.unmount();
  host.remove();
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
