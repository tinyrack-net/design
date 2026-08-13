import '../../core/core.css';
import './virtual-list.css';
import { act, createRef, type ReactNode, useState } from 'react';
import { hydrateRoot } from 'react-dom/client';
import { renderToString } from 'react-dom/server.browser';
import { expect, test, vi } from 'vitest';
import { render } from 'vitest-browser-react';
import {
  TRVirtualList,
  type TRVirtualListController,
  type TRVirtualListSnapshot,
  useTRVirtualListController,
} from './index.js';

type Item = { id: string; label: string; size?: number };

const makeItems = (count: number, start = 0): Item[] =>
  Array.from({ length: count }, (_, index) => ({
    id: `item-${start + index}`,
    label: `Item ${start + index}`,
  }));

function List({
  controller,
  items,
  axis = 'vertical',
  follow = 'none',
  children,
}: {
  controller?: TRVirtualListController<string>;
  items: readonly Item[];
  axis?: 'horizontal' | 'vertical';
  follow?: 'leading' | 'none' | 'trailing';
  children?: ReactNode;
}) {
  return (
    <TRVirtualList<Item, string>
      axis={axis}
      {...(controller === undefined ? {} : { controller })}
      estimateSize={(item) => item.size ?? 40}
      follow={follow}
      itemKey={(item) => item.id}
      itemProps={(item) => ({
        style:
          axis === 'vertical'
            ? { height: item.size ?? 40 }
            : { width: item.size ?? 40 },
      })}
      items={items}
      renderItem={(item) => (
        <button type="button" style={{ blockSize: '100%', inlineSize: '100%' }}>
          {item.label}
        </button>
      )}
      rootProps={{ 'data-testid': 'root' }}
      viewportProps={{
        'aria-label': 'Virtual rack events',
        'data-testid': 'viewport',
        style:
          axis === 'vertical'
            ? { height: 240, width: 320 }
            : { height: 120, width: 320 },
      }}
    >
      {children}
    </TRVirtualList>
  );
}

test('virtualizes a 100k item list and preserves native props, classes, and refs', async () => {
  const rootRef = createRef<HTMLDivElement>();
  const viewportRef = createRef<HTMLDivElement>();
  const itemRef = vi.fn();
  const itemProps = vi.fn((item: Item) => ({
    'aria-label': `Row ${item.label}`,
    className: 'consumer-item',
  }));

  await render(
    <TRVirtualList<Item, string>
      estimateSize={() => 40}
      itemKey={(item) => item.id}
      itemProps={itemProps}
      itemRef={itemRef}
      items={makeItems(100_000)}
      renderItem={(item) => item.label}
      rootProps={{ className: 'consumer-root', 'data-testid': 'root' }}
      rootRef={rootRef}
      viewportProps={{
        'aria-label': 'Virtual rack events',
        className: 'consumer-viewport',
        style: { height: 240, width: 320 },
      }}
      viewportRef={viewportRef}
    />,
  );

  await expect
    .poll(() => document.querySelectorAll('.tr-virtual-list-item').length)
    .toBeGreaterThan(0);
  const renderedItems = document.querySelectorAll('.tr-virtual-list-item');
  expect(renderedItems.length).toBeLessThan(30);
  expect(rootRef.current).toHaveClass('tr-virtual-list', 'consumer-root');
  expect(rootRef.current).toHaveClass('tr-scroll-area');
  expect(rootRef.current).toHaveAttribute('data-variant', 'plain');
  expect(viewportRef.current).toHaveClass(
    'tr-virtual-list-viewport',
    'consumer-viewport',
  );
  expect(viewportRef.current).toHaveAttribute('aria-label', 'Virtual rack events');
  expect(getComputedStyle(viewportRef.current as HTMLDivElement).overflowAnchor).toBe(
    'none',
  );
  expect(renderedItems[0]).toHaveClass('consumer-item');
  expect(renderedItems[0]).toHaveAttribute('aria-label', 'Row Item 0');
  expect(itemProps).toHaveBeenCalled();
  expect(itemRef).toHaveBeenCalledWith(expect.any(HTMLDivElement), itemsAt(0), 0);
  expect(document.querySelector('.tr-scroll-area-scrollbar')).toHaveAttribute(
    'data-orientation',
    'vertical',
  );
  expect(document.querySelector('.tr-scroll-area-thumb')).not.toBeNull();
});

function itemsAt(index: number) {
  return expect.objectContaining({ id: `item-${index}` });
}

test('controller navigates by index, stable key, and edge without leaking TanStack types', async () => {
  let controller: TRVirtualListController<string> | undefined;
  function Harness() {
    controller = useTRVirtualListController<string>();
    return <List controller={controller} items={makeItems(100)} />;
  }
  await render(<Harness />);
  const viewport = document.querySelector<HTMLElement>('.tr-virtual-list-viewport');

  await act(async () => controller?.scrollToIndex(40, { alignment: 'leading' }));
  await expect.poll(() => document.body.textContent).toContain('Item 40');
  const afterIndex = viewport?.scrollTop ?? 0;
  expect(afterIndex).toBeGreaterThan(1_000);

  await act(async () => controller?.scrollToKey('item-60', { alignment: 'center' }));
  await expect.poll(() => document.body.textContent).toContain('Item 60');
  expect(viewport?.scrollTop ?? 0).toBeGreaterThan(afterIndex);

  await act(async () => controller?.scrollToEdge('trailing'));
  await expect.poll(() => document.body.textContent).toContain('Item 99');
  expect((viewport?.scrollHeight ?? 0) - (viewport?.scrollTop ?? 0)).toBeCloseTo(
    viewport?.clientHeight ?? 0,
    0,
  );

  const snapshot = controller?.takeSnapshot();
  expect(snapshot?.version).toBe(1);
  expect(snapshot?.anchorKey).toMatch(/^item-/u);
  expect(snapshot?.anchorOffset).toEqual(expect.any(Number));
  expect(snapshot?.itemSizes).toEqual(expect.any(Array));
});

test('ignores an incompatible snapshot version and applies the initial position', async () => {
  const incompatibleSnapshot = {
    anchorKey: 'item-40',
    anchorOffset: 0,
    itemSizes: [],
    version: 2,
  } as unknown as TRVirtualListSnapshot<string>;
  await render(
    <TRVirtualList<Item, string>
      estimateSize={() => 40}
      initialPosition={{ alignment: 'leading', key: 'item-5' }}
      initialSnapshot={incompatibleSnapshot}
      itemKey={(item) => item.id}
      items={makeItems(50)}
      renderItem={(item) => item.label}
      viewportProps={{ style: { height: 240, width: 320 } }}
    />,
  );
  await expect.poll(() => document.body.textContent).toContain('Item 5');
  const viewportTop = document
    .querySelector<HTMLElement>('.tr-virtual-list-viewport')
    ?.getBoundingClientRect().top;
  const item5Top = Array.from(
    document.querySelectorAll<HTMLElement>('.tr-virtual-list-item'),
  )
    .find((element) => element.textContent === 'Item 5')
    ?.getBoundingClientRect().top;
  expect(item5Top).toBeCloseTo(viewportTop ?? 0, 0);
});

test('preserves the visible anchor across a same-count interior key diff and size change', async () => {
  let setItems: ((items: Item[]) => void) | undefined;
  const controller = {
    current: undefined as TRVirtualListController<string> | undefined,
  };
  function Harness() {
    const [items, updateItems] = useState(makeItems(50));
    setItems = updateItems;
    controller.current = useTRVirtualListController<string>();
    return <List controller={controller.current} items={items} />;
  }
  await render(<Harness />);
  await act(async () => controller.current?.scrollToKey('item-20'));
  await expect.poll(() => document.body.textContent).toContain('Item 20');
  const anchor = Array.from(
    document.querySelectorAll<HTMLElement>('.tr-virtual-list-item'),
  ).find((element) => element.textContent === 'Item 20') as HTMLElement;
  const anchorTop = anchor.getBoundingClientRect().top;

  await act(async () =>
    setItems?.(
      makeItems(50).map((item) =>
        item.id === 'item-3'
          ? { id: 'replacement-3', label: 'Replacement 3', size: 96 }
          : item,
      ),
    ),
  );
  await expect
    .poll(
      () =>
        Array.from(document.querySelectorAll<HTMLElement>('.tr-virtual-list-item'))
          .find((element) => element.textContent === 'Item 20')
          ?.getBoundingClientRect().top,
    )
    .toBeCloseTo(anchorTop, 0);
});

test('falls back to the next surviving visible key when the anchor is removed', async () => {
  let setItems: ((items: Item[]) => void) | undefined;
  let controller: TRVirtualListController<string> | undefined;
  function Harness() {
    const [items, updateItems] = useState(makeItems(50));
    setItems = updateItems;
    controller = useTRVirtualListController<string>();
    return <List controller={controller} items={items} />;
  }
  await render(<Harness />);
  await act(async () => controller?.scrollToKey('item-20', { alignment: 'leading' }));
  await expect.poll(() => document.body.textContent).toContain('Item 21');
  const nextItem = Array.from(
    document.querySelectorAll<HTMLElement>('.tr-virtual-list-item'),
  ).find((element) => element.textContent === 'Item 21') as HTMLElement;
  const nextItemTop = nextItem.getBoundingClientRect().top;

  await act(async () =>
    setItems?.([
      ...makeItems(50).filter((item) => item.id !== 'item-20'),
      { id: 'item-50', label: 'Item 50' },
    ]),
  );
  await expect
    .poll(
      () =>
        Array.from(document.querySelectorAll<HTMLElement>('.tr-virtual-list-item'))
          .find((element) => element.textContent === 'Item 21')
          ?.getBoundingClientRect().top,
    )
    .toBeCloseTo(nextItemTop, 0);
});

test('falls back by old key order when the entire visible range is removed', async () => {
  let setItems: ((items: Item[]) => void) | undefined;
  let controller: TRVirtualListController<string> | undefined;
  function Harness() {
    const [items, updateItems] = useState(makeItems(60));
    setItems = updateItems;
    controller = useTRVirtualListController<string>();
    return <List controller={controller} items={items} />;
  }
  await render(<Harness />);
  await act(async () => controller?.scrollToKey('item-20', { alignment: 'leading' }));
  await expect.poll(() => document.body.textContent).toContain('Item 25');
  const firstVisibleTop = Array.from(
    document.querySelectorAll<HTMLElement>('.tr-virtual-list-item'),
  )
    .find((element) => element.textContent === 'Item 20')
    ?.getBoundingClientRect().top as number;
  const removedIds = new Set(makeItems(6, 20).map((item) => item.id));
  const successorLabel = 'Item 26';

  await act(async () =>
    setItems?.(
      makeItems(60)
        .filter((item) => !removedIds.has(item.id))
        .map((item) => (item.id === 'item-3' ? { ...item, size: 96 } : item)),
    ),
  );
  await expect
    .poll(
      () =>
        Array.from(document.querySelectorAll<HTMLElement>('.tr-virtual-list-item'))
          .find((element) => element.textContent === successorLabel)
          ?.getBoundingClientRect().top,
    )
    .toBeCloseTo(firstVisibleTop, 0);
});

test('follows trailing growth only while pinned and supports a one-shot anchor hold', async () => {
  let append: ((item: Item) => void) | undefined;
  let resizeLast: (() => void) | undefined;
  let controller: TRVirtualListController<string> | undefined;
  function Harness() {
    const [items, setItems] = useState(makeItems(30));
    append = (item) => setItems((current) => [...current, item]);
    resizeLast = () =>
      setItems((current) =>
        current.map((item) =>
          item.id === current.at(-1)?.id ? { ...item, size: 120 } : item,
        ),
      );
    controller = useTRVirtualListController<string>();
    return <List controller={controller} follow="trailing" items={items} />;
  }
  await render(<Harness />);
  await act(async () => controller?.scrollToEdge('trailing'));
  const viewport = document.querySelector<HTMLElement>('.tr-virtual-list-viewport');
  await act(async () => append?.({ id: 'item-30', label: 'Item 30' }));
  await expect.poll(() => document.body.textContent).toContain('Item 30');
  expect((viewport?.scrollHeight ?? 0) - (viewport?.scrollTop ?? 0)).toBeCloseTo(
    viewport?.clientHeight ?? 0,
    0,
  );

  await act(async () => controller?.scrollToKey('item-12'));
  const scrolledUp = viewport?.scrollTop ?? 0;
  await act(async () => append?.({ id: 'item-31', label: 'Item 31' }));
  expect(viewport?.scrollTop).toBeCloseTo(scrolledUp, 0);

  await act(async () => controller?.scrollToEdge('trailing'));
  await expect.poll(() => document.body.textContent).toContain('Item 31');
  const anchorLabel = 'Item 28';
  const anchorTop = Array.from(
    document.querySelectorAll<HTMLElement>('.tr-virtual-list-item'),
  )
    .find((element) => element.textContent === anchorLabel)
    ?.getBoundingClientRect().top as number;
  controller?.holdVisibleAnchorForNextLayout();
  await act(async () => resizeLast?.());
  await expect
    .poll(
      () =>
        Array.from(document.querySelectorAll<HTMLElement>('.tr-virtual-list-item'))
          .find((element) => element.textContent === anchorLabel)
          ?.getBoundingClientRect().top,
    )
    .toBeCloseTo(anchorTop, 0);
  expect(
    (viewport?.scrollHeight ?? 0) -
      (viewport?.scrollTop ?? 0) -
      (viewport?.clientHeight ?? 0),
  ).toBeGreaterThan(40);
});

test('deduplicates independent edge requests by requestKey and renders their slots', async () => {
  const leadingRequest = vi.fn();
  const trailingRequest = vi.fn();
  const items = makeItems(30);
  const view = await render(
    <TRVirtualList<Item, string>
      estimateSize={() => 40}
      itemKey={(item) => item.id}
      items={items}
      leadingEdgeRequest={{
        onRequest: leadingRequest,
        requestKey: 'before-0',
        slot: <span>Loading older</span>,
        triggerExtent: { kind: 'pixels', value: 8 },
      }}
      renderItem={(item) => item.label}
      trailingEdgeRequest={{
        onRequest: trailingRequest,
        requestKey: 'after-29',
        slot: <span>Loading newer</span>,
        triggerExtent: { kind: 'pixels', value: 8 },
      }}
      viewportProps={{ style: { height: 240, width: 320 } }}
    />,
  );
  expect(document.body).toHaveTextContent('Loading older');
  expect(document.body).toHaveTextContent('Loading newer');
  await expect.poll(() => leadingRequest).toHaveBeenCalledTimes(1);
  const viewport = document.querySelector<HTMLElement>('.tr-virtual-list-viewport');
  viewport?.scrollTo({ top: viewport.scrollHeight });
  viewport?.dispatchEvent(new Event('scroll'));
  await expect.poll(() => trailingRequest).toHaveBeenCalledTimes(1);
  viewport?.scrollTo({ top: 0 });
  viewport?.dispatchEvent(new Event('scroll'));
  await new Promise((resolve) => requestAnimationFrame(resolve));
  expect(leadingRequest).toHaveBeenCalledTimes(1);

  await view.rerender(
    <TRVirtualList<Item, string>
      estimateSize={() => 40}
      itemKey={(item) => item.id}
      items={items}
      leadingEdgeRequest={{
        onRequest: leadingRequest,
        requestKey: 'before-1',
        slot: <span>Loading older</span>,
        triggerExtent: { kind: 'pixels', value: 8 },
      }}
      renderItem={(item) => item.label}
      viewportProps={{ style: { height: 240, width: 320 } }}
    />,
  );
  await expect.poll(() => leadingRequest).toHaveBeenCalledTimes(2);
});

test('measures edge slots into the extent and preserves anchors and pinned edges on resize', async () => {
  let resizeLeading: (() => void) | undefined;
  let resizeTrailing: (() => void) | undefined;
  let controller: TRVirtualListController<string> | undefined;
  function Harness() {
    const [leadingSize, setLeadingSize] = useState(48);
    const [trailingSize, setTrailingSize] = useState(32);
    resizeLeading = () => setLeadingSize(88);
    resizeTrailing = () => setTrailingSize(72);
    controller = useTRVirtualListController<string>();
    return (
      <TRVirtualList<Item, string>
        controller={controller}
        estimateSize={() => 40}
        itemKey={(item) => item.id}
        itemProps={() => ({ style: { height: 40 } })}
        items={makeItems(50)}
        leadingEdgeRequest={{
          onRequest: vi.fn(),
          requestKey: 'leading-slot',
          slot: <div data-testid="leading-slot" style={{ height: leadingSize }} />,
        }}
        renderItem={(item) => item.label}
        trailingEdgeRequest={{
          onRequest: vi.fn(),
          requestKey: 'trailing-slot',
          slot: <div data-testid="trailing-slot" style={{ height: trailingSize }} />,
        }}
        viewportProps={{ style: { height: 240, width: 320 } }}
      />
    );
  }
  await render(<Harness />);
  const viewport = document.querySelector<HTMLElement>(
    '.tr-virtual-list-viewport',
  ) as HTMLElement;
  const leadingSlot = document.querySelector<HTMLElement>(
    '.tr-virtual-list-edge-slot[data-edge="leading"]',
  ) as HTMLElement;
  await expect
    .poll(
      () =>
        document
          .querySelector<HTMLElement>('.tr-virtual-list-item')
          ?.getBoundingClientRect().top,
    )
    .toBeCloseTo(leadingSlot.getBoundingClientRect().bottom, 0);

  await act(async () => controller?.scrollToKey('item-20', { alignment: 'leading' }));
  await expect.poll(() => document.body.textContent).toContain('Item 20');
  const item20Top = Array.from(
    document.querySelectorAll<HTMLElement>('.tr-virtual-list-item'),
  )
    .find((element) => element.textContent === 'Item 20')
    ?.getBoundingClientRect().top as number;
  const scrollHeight = viewport.scrollHeight;
  await act(async () => resizeLeading?.());
  await expect.poll(() => viewport.scrollHeight).toBeCloseTo(scrollHeight + 40, 0);
  await expect
    .poll(
      () =>
        Array.from(document.querySelectorAll<HTMLElement>('.tr-virtual-list-item'))
          .find((element) => element.textContent === 'Item 20')
          ?.getBoundingClientRect().top,
    )
    .toBeCloseTo(item20Top, 0);

  await act(async () => controller?.scrollToEdge('trailing'));
  const heightAtTrailing = viewport.scrollHeight;
  await act(async () => resizeTrailing?.());
  await expect.poll(() => viewport.scrollHeight).toBeCloseTo(heightAtTrailing + 40, 0);
  await expect
    .poll(() => viewport.scrollHeight - viewport.scrollTop)
    .toBeCloseTo(viewport.clientHeight, 0);
});

test('uses one viewport as the default edge threshold and does not request an empty list', async () => {
  const leadingRequest = vi.fn();
  const trailingRequest = vi.fn();
  const view = await render(
    <TRVirtualList<Item, string>
      estimateSize={() => 40}
      itemKey={(item) => item.id}
      itemProps={() => ({ style: { height: 40 } })}
      items={makeItems(30)}
      leadingEdgeRequest={{ onRequest: leadingRequest, requestKey: 'before' }}
      renderItem={(item) => item.label}
      trailingEdgeRequest={{ onRequest: trailingRequest, requestKey: 'after' }}
      viewportProps={{ style: { height: 240, width: 320 } }}
    />,
  );
  await expect.poll(() => leadingRequest).toHaveBeenCalledTimes(1);
  expect(trailingRequest).not.toHaveBeenCalled();
  const viewport = document.querySelector<HTMLElement>('.tr-virtual-list-viewport');
  if (viewport) {
    viewport.scrollTop = viewport.scrollHeight - viewport.clientHeight - 200;
    viewport.dispatchEvent(new Event('scroll'));
  }
  await expect.poll(() => trailingRequest).toHaveBeenCalledTimes(1);

  leadingRequest.mockClear();
  trailingRequest.mockClear();
  await view.rerender(
    <TRVirtualList<Item, string>
      estimateSize={() => 40}
      itemKey={(item) => item.id}
      items={[]}
      leadingEdgeRequest={{ onRequest: leadingRequest, requestKey: 'empty-before' }}
      renderItem={(item) => item.label}
      trailingEdgeRequest={{ onRequest: trailingRequest, requestKey: 'empty-after' }}
      viewportProps={{ style: { height: 240, width: 320 } }}
    />,
  );
  await new Promise((resolve) => requestAnimationFrame(resolve));
  expect(leadingRequest).not.toHaveBeenCalled();
  expect(trailingRequest).not.toHaveBeenCalled();
});

test('rejects duplicate stable keys with a clear error', async () => {
  await expect(
    render(
      <TRVirtualList<Item, string>
        estimateSize={() => 40}
        itemKey={(item) => item.id}
        items={[
          { id: 'duplicate', label: 'First' },
          { id: 'duplicate', label: 'Second' },
        ]}
        renderItem={(item) => item.label}
        viewportProps={{ style: { height: 240, width: 320 } }}
      />,
    ),
  ).rejects.toThrow(/TRVirtualList.*duplicate.*itemKey/iu);
});

test('retains a focused item outside the ordinary range and supports horizontal RTL', async () => {
  let controller: TRVirtualListController<string> | undefined;
  function Harness() {
    controller = useTRVirtualListController<string>();
    return (
      <div dir="rtl">
        <List axis="horizontal" controller={controller} items={makeItems(50)} />
      </div>
    );
  }
  await render(<Harness />);
  const firstButton = document.querySelector<HTMLButtonElement>(
    '.tr-virtual-list-item button',
  );
  firstButton?.focus();
  await act(async () => controller?.scrollToKey('item-30'));
  await expect.poll(() => document.body.textContent).toContain('Item 30');
  expect(firstButton?.isConnected).toBe(true);
  expect(document.activeElement).toBe(firstButton);
  const viewport = document.querySelector<HTMLElement>('.tr-virtual-list-viewport');
  expect(viewport?.scrollWidth).toBeGreaterThan(viewport?.clientWidth ?? 0);
  expect(viewport?.scrollHeight).toBeLessThanOrEqual(viewport?.clientHeight ?? 0);
});

test('server-renders an explicit fallback and hydrates without recovery', async () => {
  const fixture = (
    <TRVirtualList<Item, string>
      estimateSize={() => 40}
      itemKey={(item) => item.id}
      items={makeItems(20)}
      renderItem={(item) => item.label}
      ssrFallback={<p data-testid="fallback">Loading event window</p>}
      viewportProps={{ style: { height: 240, width: 320 } }}
    />
  );
  const host = document.createElement('div');
  host.innerHTML = renderToString(fixture);
  expect(host).toHaveTextContent('Loading event window');
  document.body.append(host);
  const hydrationErrors: unknown[] = [];
  const root = hydrateRoot(host, fixture, {
    onRecoverableError(error) {
      hydrationErrors.push(error);
    },
  });
  await act(async () => {});
  expect(hydrationErrors).toEqual([]);
  await expect
    .poll(() => host.querySelectorAll('.tr-virtual-list-item').length)
    .toBeGreaterThan(0);
  expect(host.querySelectorAll('.tr-virtual-list-item').length).toBeLessThan(20);
  await act(async () => root.unmount());
  host.remove();
});
