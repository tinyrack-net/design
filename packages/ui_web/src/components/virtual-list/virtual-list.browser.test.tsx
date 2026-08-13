import '../../core/core.css';
import './virtual-list.css';
import type { Virtualizer } from '@tanstack/react-virtual';
import { act, type ComponentProps, type ReactNode, useState } from 'react';
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
import { trVirtualListInternals } from './virtual-list.js';
import { attachTRVirtualListController } from './virtual-list-controller.js';

type Item = { id: string; label: string; size?: number };

const makeItems = (count: number, start = 0): Item[] =>
  Array.from({ length: count }, (_, index) => ({
    id: `item-${start + index}`,
    label: `Item ${start + index}`,
  }));

function getViewport() {
  const viewport = document.querySelector<HTMLElement>('.tr-virtual-list-viewport');
  if (viewport === null) throw new Error('TRVirtualList viewport was not rendered.');
  return viewport;
}

function findRenderedItem(label: string) {
  return Array.from(
    document.querySelectorAll<HTMLElement>('.tr-virtual-list-item'),
  ).find((element) => element.textContent === label);
}

function viewportContentInlineEdges(viewport: HTMLElement) {
  const rect = viewport.getBoundingClientRect();
  const left = rect.left + viewport.clientLeft;
  return { left, right: left + viewport.clientWidth };
}

async function waitForRenderedItem(label: string) {
  await expect.poll(() => findRenderedItem(label)).toBeDefined();
  return findRenderedItem(label) as HTMLElement;
}

async function captureSnapshotAroundItem20() {
  const items = makeItems(50);
  let controller: TRVirtualListController<string> | undefined;
  function Source() {
    controller = useTRVirtualListController<string>();
    return <List controller={controller} items={items} overscan={20} />;
  }
  const source = await render(<Source />);
  await act(async () => controller?.scrollToKey('item-20', { alignment: 'leading' }));
  await waitForRenderedItem('Item 20');
  await waitForRenderedItem('Item 30');
  const snapshot = controller?.takeSnapshot() as TRVirtualListSnapshot<string>;
  const data = trVirtualListInternals.readTRVirtualListSnapshot(snapshot);
  if (data === undefined)
    throw new Error('TRVirtualList snapshot data was not captured.');
  const itemTops = new Map(
    data.positionedCandidates.flatMap(({ index, key }) => {
      const item = items[index];
      const element = item === undefined ? undefined : findRenderedItem(item.label);
      return element === undefined ? [] : [[key, element.getBoundingClientRect().top]];
    }),
  );
  await source.unmount();
  return { data, itemTops, snapshot };
}

async function renderMutableListAroundItem20() {
  let controller: TRVirtualListController<string> | undefined;
  let replaceItems: ((items: Item[]) => void) | undefined;
  function MutableList() {
    const [items, setItems] = useState(makeItems(60));
    replaceItems = setItems;
    controller = useTRVirtualListController<string>();
    return <List controller={controller} items={items} />;
  }
  await render(<MutableList />);
  await act(async () => controller?.scrollToKey('item-20', { alignment: 'leading' }));
  await waitForRenderedItem('Item 20');
  const data = trVirtualListInternals.readTRVirtualListSnapshot(
    controller?.takeSnapshot() ?? undefined,
  );
  if (data === undefined) throw new Error('TRVirtualList layout was not captured.');
  return {
    data,
    replaceItems: async (items: Item[]) => act(async () => replaceItems?.(items)),
    viewport: getViewport(),
  };
}

function List({
  controller,
  items,
  axis = 'vertical',
  follow = 'none',
  children,
  rootProps,
  viewportProps,
  ...props
}: {
  controller?: TRVirtualListController<string>;
  items: readonly Item[];
  axis?: 'horizontal' | 'vertical';
  follow?: 'leading' | 'none' | 'trailing';
  children?: ReactNode;
} & Partial<
  Omit<
    ComponentProps<typeof TRVirtualList<Item, string>>,
    | 'axis'
    | 'controller'
    | 'estimateSize'
    | 'follow'
    | 'itemKey'
    | 'items'
    | 'renderItem'
  >
>) {
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
      {...props}
      renderItem={(item) => (
        <button type="button" style={{ blockSize: '100%', inlineSize: '100%' }}>
          {item.label}
        </button>
      )}
      rootProps={{
        ...rootProps,
        'data-testid': rootProps?.['data-testid'] ?? 'root',
      }}
      viewportProps={{
        ...viewportProps,
        'aria-label': viewportProps?.['aria-label'] ?? 'Virtual rack events',
        'data-testid': viewportProps?.['data-testid'] ?? 'viewport',
        style: {
          ...(axis === 'vertical'
            ? { height: 240, width: 320 }
            : { height: 120, width: 320 }),
          ...viewportProps?.style,
        },
      }}
    >
      {children}
    </TRVirtualList>
  );
}

test('virtualizes a 100k item list and preserves native props, classes, and refs', async () => {
  const rootRef = vi.fn((_element: HTMLDivElement | null) => {});
  const viewportRef = vi.fn((_element: HTMLDivElement | null) => {});
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
  const root = document.querySelector('.tr-virtual-list');
  expect(rootRef).toHaveBeenCalledWith(root);
  expect(root).toHaveClass('tr-virtual-list', 'consumer-root');
  expect(root).toHaveClass('tr-scroll-area');
  expect(root).toHaveAttribute('data-variant', 'plain');
  const viewport = document.querySelector('.tr-virtual-list-viewport');
  expect(viewportRef).toHaveBeenCalledWith(viewport);
  const viewportStyle = getComputedStyle(viewport as HTMLDivElement);
  expect(viewportStyle.overflowX).toBe('hidden');
  expect(viewportStyle.overflowY).toBe('auto');
  expect(viewport).toHaveClass('tr-virtual-list-viewport', 'consumer-viewport');
  expect(viewport).toHaveAttribute('aria-label', 'Virtual rack events');
  expect(getComputedStyle(viewport as HTMLDivElement).overflowAnchor).toBe('none');
  expect(renderedItems[0]).toHaveClass('consumer-item');
  expect(renderedItems[0]).toHaveAttribute('aria-label', 'Row Item 0');
  expect(itemProps).toHaveBeenCalled();
  expect(itemRef).toHaveBeenCalledWith(
    expect.any(HTMLDivElement),
    expect.objectContaining({ id: 'item-0' }),
    0,
  );
  expect(document.querySelector('.tr-scroll-area-scrollbar')).toHaveAttribute(
    'data-orientation',
    'vertical',
  );
  expect(document.querySelector('.tr-scroll-area-thumb')).not.toBeNull();
});

test('controller navigates by index, stable key, and edge without leaking TanStack types', async () => {
  let controller: TRVirtualListController<string> | undefined;
  const viewportRef = { current: null as HTMLDivElement | null };
  function Harness() {
    controller = useTRVirtualListController<string>();
    return (
      <List controller={controller} items={makeItems(100)} viewportRef={viewportRef} />
    );
  }
  await render(<Harness />);
  const viewport = getViewport();
  expect(viewportRef.current).toBe(viewport);

  await act(async () => controller?.scrollToIndex(40, { alignment: 'leading' }));
  await expect.poll(() => document.body.textContent).toContain('Item 40');
  const afterIndex = viewport.scrollTop;
  expect(afterIndex).toBeGreaterThan(1_000);

  await act(async () => controller?.scrollToKey('item-60', { alignment: 'center' }));
  await expect.poll(() => document.body.textContent).toContain('Item 60');
  expect(viewport.scrollTop).toBeGreaterThan(afterIndex);
  await act(async () => controller?.scrollToKey('missing'));
  await act(async () =>
    controller?.scrollToIndex(99, { alignment: 'trailing', behavior: 'auto' }),
  );
  await expect.poll(() => document.body.textContent).toContain('Item 99');

  await act(async () => controller?.scrollToEdge('trailing', { behavior: 'auto' }));
  await expect.poll(() => document.body.textContent).toContain('Item 99');
  expect(viewport.scrollHeight - viewport.scrollTop).toBeCloseTo(
    viewport.clientHeight,
    0,
  );

  const snapshot = controller?.takeSnapshot();
  expect(snapshot?.version).toBe(1);
  expect(Object.keys(snapshot ?? {})).toEqual(['version']);
  expect(
    trVirtualListInternals.readTRVirtualListSnapshot(snapshot ?? undefined)
      ?.candidates[0]?.key,
  ).toMatch(/^item-/u);
  await act(async () => controller?.scrollToEdge('leading', { behavior: 'auto' }));
  expect(viewport.scrollTop).toBe(0);
});

test('ignores an incompatible snapshot version and applies the initial position', async () => {
  const incompatibleSnapshot = {
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
  const viewport = getViewport();
  await expect
    .poll(() => findRenderedItem('Item 5')?.getBoundingClientRect().top)
    .toBeCloseTo(viewport.getBoundingClientRect().top, 0);
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
  const anchor = await waitForRenderedItem('Item 20');
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
    .poll(() => findRenderedItem('Item 20')?.getBoundingClientRect().top)
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
  const nextItem = await waitForRenderedItem('Item 21');
  const nextItemTop = nextItem.getBoundingClientRect().top;

  await act(async () =>
    setItems?.([
      ...makeItems(50).filter((item) => item.id !== 'item-20'),
      { id: 'item-50', label: 'Item 50' },
    ]),
  );
  await expect
    .poll(() => findRenderedItem('Item 21')?.getBoundingClientRect().top)
    .toBeCloseTo(nextItemTop, 0);
});

test('falls back by old key order when the entire visible range is removed', async () => {
  const { data, replaceItems, viewport } = await renderMutableListAroundItem20();
  const primary = data.candidates[0];
  expect(primary).toBeDefined();
  const removedIds = new Set(data.positionedCandidates.map(({ key }) => key));
  const successorIndex =
    Math.max(...data.positionedCandidates.map(({ index }) => index)) + 1;
  const successorLabel = `Item ${successorIndex}`;
  const expectedTop = viewport.getBoundingClientRect().top - (primary?.offset ?? 0);

  await replaceItems(makeItems(60).filter((item) => !removedIds.has(item.id)));
  await expect
    .poll(() => findRenderedItem(successorLabel)?.getBoundingClientRect().top)
    .toBeCloseTo(expectedTop, 0);
});

test('falls back to an unpositioned predecessor when no old successor survives', async () => {
  const { data, replaceItems, viewport } = await renderMutableListAroundItem20();
  const primary = data.candidates[0];
  expect(primary).toBeDefined();
  const firstPositionedIndex = Math.min(
    ...data.positionedCandidates.map(({ index }) => index),
  );
  const predecessorIndex = firstPositionedIndex - 1;
  const expectedTop = viewport.getBoundingClientRect().top - (primary?.offset ?? 0);

  await replaceItems([
    ...makeItems(firstPositionedIndex),
    ...Array.from({ length: 60 - firstPositionedIndex }, (_, index) => ({
      id: `replacement-${index}`,
      label: `Replacement ${index}`,
    })),
  ]);
  await expect
    .poll(
      () => findRenderedItem(`Item ${predecessorIndex}`)?.getBoundingClientRect().top,
    )
    .toBeCloseTo(expectedTop, 0);
});

test('preserves a predecessor own old viewport coordinate when no successor survives', async () => {
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
  const predecessorTop = (await waitForRenderedItem('Item 19')).getBoundingClientRect()
    .top;

  await act(async () =>
    setItems?.([
      ...makeItems(20),
      ...Array.from({ length: 40 }, (_, index) => ({
        id: `replacement-${index}`,
        label: `Replacement ${index}`,
      })),
    ]),
  );
  await expect
    .poll(() => findRenderedItem('Item 19')?.getBoundingClientRect().top)
    .toBeCloseTo(predecessorTop, 0);
});

test('restores a surviving snapshot successor at its own captured viewport coordinate', async () => {
  const { data, itemTops, snapshot } = await captureSnapshotAroundItem20();
  const lastVisibleIndex = Math.max(...data.candidates.map(({ index }) => index));
  const successor = data.positionedCandidates.find(
    ({ index }) => index > lastVisibleIndex,
  );
  expect(successor).toBeDefined();
  const successorTop = itemTops.get(successor?.key ?? '');
  const removedKeys = new Set(data.candidates.map(({ key }) => key));

  await render(
    <List
      initialSnapshot={snapshot}
      items={makeItems(50).filter((item) => !removedKeys.has(item.id))}
    />,
  );
  await expect
    .poll(
      () => findRenderedItem(`Item ${successor?.index}`)?.getBoundingClientRect().top,
    )
    .toBeCloseTo(successorTop ?? 0, 0);
});

test('restores a positioned snapshot predecessor when no successor survives', async () => {
  const { data, itemTops, snapshot } = await captureSnapshotAroundItem20();
  const firstVisibleIndex = Math.min(...data.candidates.map(({ index }) => index));
  const predecessor = [...data.positionedCandidates]
    .reverse()
    .find(({ index }) => index < firstVisibleIndex);
  expect(predecessor).toBeDefined();
  const predecessorTop = itemTops.get(predecessor?.key ?? '');

  await render(
    <List
      initialSnapshot={snapshot}
      items={[
        ...makeItems(firstVisibleIndex),
        ...Array.from({ length: 50 - firstVisibleIndex }, (_, index) => ({
          id: `replacement-${index}`,
          label: `Replacement ${index}`,
        })),
      ]}
    />,
  );
  await expect
    .poll(
      () => findRenderedItem(`Item ${predecessor?.index}`)?.getBoundingClientRect().top,
    )
    .toBeCloseTo(predecessorTop ?? 0, 0);
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
  const viewport = getViewport();
  await act(async () => append?.({ id: 'item-30', label: 'Item 30' }));
  await expect.poll(() => document.body.textContent).toContain('Item 30');
  expect(viewport.scrollHeight - viewport.scrollTop).toBeCloseTo(
    viewport.clientHeight,
    0,
  );

  await act(async () => controller?.scrollToKey('item-12'));
  const scrolledUp = viewport.scrollTop;
  await act(async () => append?.({ id: 'item-31', label: 'Item 31' }));
  expect(viewport.scrollTop).toBeCloseTo(scrolledUp, 0);

  await act(async () => controller?.scrollToEdge('trailing'));
  await expect.poll(() => document.body.textContent).toContain('Item 31');
  await expect
    .poll(() => viewport.scrollHeight - viewport.scrollTop - viewport.clientHeight)
    .toBeCloseTo(0, 0);
  const anchorLabel = 'Item 28';
  const anchorTop = (await waitForRenderedItem(anchorLabel)).getBoundingClientRect()
    .top;
  const scrollHeightBeforeResize = viewport.scrollHeight;
  controller?.holdVisibleAnchorForNextLayout();
  await act(async () => resizeLast?.());
  await expect
    .poll(() => viewport.scrollHeight)
    .toBeGreaterThan(scrollHeightBeforeResize + 40);
  await expect
    .poll(() => findRenderedItem(anchorLabel)?.getBoundingClientRect().top)
    .toBeCloseTo(anchorTop, 0);
  expect(
    viewport.scrollHeight - viewport.scrollTop - viewport.clientHeight,
  ).toBeGreaterThan(40);
});

test('trailing-aligns an underfilled list and measured slot while following growth', async () => {
  let append: (() => void) | undefined;
  function Harness() {
    const [items, setItems] = useState(makeItems(2));
    append = () =>
      setItems((current) => [
        ...current,
        { id: `item-${current.length}`, label: `Item ${current.length}` },
      ]);
    return (
      <List
        follow="trailing"
        initialPosition={{ edge: 'trailing' }}
        items={items}
        leadingEdgeRequest={{
          onRequest: vi.fn(),
          requestKey: 'short-leading',
          slot: <div data-testid="short-leading-slot" style={{ height: 24 }} />,
        }}
        trailingEdgeRequest={{
          onRequest: vi.fn(),
          requestKey: 'short-trailing',
          slot: <div data-testid="short-trailing-slot" style={{ height: 56 }} />,
        }}
      />
    );
  }
  await render(<Harness />);
  const viewport = getViewport();
  const slot = document.querySelector<HTMLElement>(
    '[data-testid="short-trailing-slot"]',
  ) as HTMLElement;
  const leadingSlot = document.querySelector<HTMLElement>(
    '[data-testid="short-leading-slot"]',
  ) as HTMLElement;
  await expect
    .poll(() => findRenderedItem('Item 0')?.getBoundingClientRect().top)
    .toBeCloseTo(leadingSlot.getBoundingClientRect().bottom, 0);
  await expect
    .poll(() => findRenderedItem('Item 1')?.getBoundingClientRect().bottom)
    .toBeCloseTo(slot.getBoundingClientRect().top, 0);
  expect(slot.getBoundingClientRect().bottom).toBeCloseTo(
    viewport.getBoundingClientRect().bottom,
    0,
  );

  await act(async () => append?.());
  await expect
    .poll(() => findRenderedItem('Item 2')?.getBoundingClientRect().bottom)
    .toBeCloseTo(slot.getBoundingClientRect().top, 0);
});

test('trailing-aligns an underfilled horizontal list to the LTR and RTL logical edge', async () => {
  const trailingRequest = vi.fn();
  const intrinsicOverflow = (
    <style>{`
      .intrinsic-overflow > button {
        inline-size: 44px !important;
        inset-inline-start: 0;
        position: absolute;
      }
    `}</style>
  );
  const leadingEdgeRequest = {
    onRequest: vi.fn(),
    requestKey: 'horizontal-leading',
    slot: <span>Earlier</span>,
  };
  const ltr = await render(
    <List
      axis="horizontal"
      initialPosition={{ edge: 'trailing' }}
      itemProps={(_item, index) => ({
        className: index === 2 ? 'intrinsic-overflow' : undefined,
        style: { width: 40 },
      })}
      items={makeItems(3)}
      leadingEdgeRequest={leadingEdgeRequest}
      trailingEdgeRequest={{
        onRequest: trailingRequest,
        requestKey: 'horizontal-trailing-ltr',
        triggerExtent: { kind: 'pixels', value: 0 },
      }}
    >
      {intrinsicOverflow}
    </List>,
  );
  let viewport = getViewport();
  expect(getComputedStyle(viewport).overflowX).toBe('auto');
  expect(getComputedStyle(viewport).overflowY).toBe('hidden');
  await expect
    .poll(() => {
      const item = findRenderedItem('Item 2');
      return item === undefined
        ? undefined
        : item.getBoundingClientRect().right -
            viewportContentInlineEdges(viewport).right;
    })
    .toBeCloseTo(0, 0);
  expect(viewport.scrollWidth - viewport.clientWidth).toBe(4);
  expect(viewport.scrollLeft).toBe(0);
  await expect.poll(() => trailingRequest).toHaveBeenCalledTimes(1);
  await ltr.unmount();

  await render(
    <div dir="rtl">
      <List
        axis="horizontal"
        initialPosition={{ edge: 'trailing' }}
        itemProps={(_item, index) => ({
          className: index === 2 ? 'intrinsic-overflow' : undefined,
          style: { width: 40 },
        })}
        items={makeItems(3)}
        leadingEdgeRequest={leadingEdgeRequest}
        trailingEdgeRequest={{
          onRequest: trailingRequest,
          requestKey: 'horizontal-trailing-rtl',
          triggerExtent: { kind: 'pixels', value: 0 },
        }}
      >
        {intrinsicOverflow}
      </List>
    </div>,
  );
  viewport = getViewport();
  await expect
    .poll(() => {
      const item = findRenderedItem('Item 2');
      return item === undefined
        ? undefined
        : item.getBoundingClientRect().left - viewportContentInlineEdges(viewport).left;
    })
    .toBeCloseTo(0, 0);
  expect(viewport.scrollWidth - viewport.clientWidth).toBe(4);
  expect(-viewport.scrollLeft).toBeCloseTo(0, 0);
  await expect.poll(() => trailingRequest).toHaveBeenCalledTimes(2);
});

test('keeps underfilled horizontal follow pinned to the nominal list extent', async () => {
  let append: (() => void) | undefined;
  function Harness() {
    const [items, setItems] = useState(makeItems(3));
    append = () =>
      setItems((current) => [
        ...current,
        { id: `item-${current.length}`, label: `Item ${current.length}` },
      ]);
    return (
      <List
        axis="horizontal"
        follow="trailing"
        initialPosition={{ edge: 'trailing' }}
        itemProps={(_item, index) => ({
          className: index === items.length - 1 ? 'intrinsic-overflow' : undefined,
          style: { width: 40 },
        })}
        items={items}
      >
        <style>{`
          .intrinsic-overflow > button {
            inline-size: 44px !important;
            inset-inline-start: 0;
            position: absolute;
          }
        `}</style>
      </List>
    );
  }

  await render(<Harness />);
  const viewport = getViewport();
  await expect
    .poll(() => findRenderedItem('Item 2')?.getBoundingClientRect().right)
    .toBeCloseTo(viewportContentInlineEdges(viewport).right, 0);
  expect(viewport.scrollWidth - viewport.clientWidth).toBe(4);

  await act(async () => viewport.dispatchEvent(new Event('scroll')));
  await act(async () => append?.());

  await expect
    .poll(() => findRenderedItem('Item 3')?.getBoundingClientRect().right)
    .toBeCloseTo(viewportContentInlineEdges(viewport).right, 0);
  expect(viewport.scrollLeft).toBe(0);
});

test('measures the stable inner border box despite a native scrollbar gutter', () => {
  const element = document.createElement('div');
  element.style.border = '2px solid transparent';
  let clientWidth = 316;
  let clientHeight = 236;
  let offsetWidth = 324;
  let offsetHeight = 244;
  Object.defineProperties(element, {
    clientHeight: { configurable: true, get: () => clientHeight },
    clientWidth: { configurable: true, get: () => clientWidth },
    offsetHeight: { configurable: true, get: () => offsetHeight },
    offsetWidth: { configurable: true, get: () => offsetWidth },
  });

  let resizeCallback: ResizeObserverCallback | undefined;
  let observeOptions: ResizeObserverOptions | undefined;
  let animationFrameCallback: FrameRequestCallback | undefined;
  let disconnected = false;
  class ProbeResizeObserver {
    constructor(callback: ResizeObserverCallback) {
      resizeCallback = callback;
    }

    observe(_target: Element, options?: ResizeObserverOptions) {
      observeOptions = options;
    }

    unobserve() {}

    disconnect() {
      disconnected = true;
    }
  }
  const requestAnimationFrame = vi.fn((callback: FrameRequestCallback) => {
    animationFrameCallback = callback;
    return 1;
  });
  const cancelAnimationFrame = vi.fn();
  const targetWindow = {
    ResizeObserver: ProbeResizeObserver,
    cancelAnimationFrame,
    getComputedStyle: () =>
      ({
        borderBottomWidth: '2px',
        borderLeftWidth: '2px',
        borderRightWidth: '2px',
        borderTopWidth: '2px',
      }) as CSSStyleDeclaration,
    requestAnimationFrame,
  } as unknown as Window;
  const instance = {
    options: { useAnimationFrameWithResizeObserver: true },
    scrollElement: element,
    targetWindow,
  } as unknown as Virtualizer<HTMLDivElement, HTMLDivElement>;
  const measurements: { height: number; width: number }[] = [];

  const disconnect = trVirtualListInternals.observeScrollportRect(instance, (rect) => {
    measurements.push(rect);
  });
  expect(observeOptions).toEqual({ box: 'border-box' });
  expect(measurements).toEqual([{ height: 240, width: 320 }]);

  clientWidth = 320;
  clientHeight = 240;
  resizeCallback?.([], {} as ResizeObserver);
  resizeCallback?.([], {} as ResizeObserver);
  expect(requestAnimationFrame).toHaveBeenCalledTimes(1);
  animationFrameCallback?.(0);
  expect(measurements).toEqual([{ height: 240, width: 320 }]);

  clientWidth = 300;
  clientHeight = 220;
  offsetWidth = 308;
  offsetHeight = 228;
  resizeCallback?.([], {} as ResizeObserver);
  resizeCallback?.([], {} as ResizeObserver);
  expect(requestAnimationFrame).toHaveBeenCalledTimes(2);
  animationFrameCallback?.(1);
  expect(measurements).toEqual([
    { height: 240, width: 320 },
    { height: 224, width: 304 },
  ]);

  resizeCallback?.([], {} as ResizeObserver);
  animationFrameCallback?.(2);
  expect(measurements).toHaveLength(2);

  offsetWidth = 292;
  resizeCallback?.([], {} as ResizeObserver);
  disconnect?.();
  expect(disconnected).toBe(true);
  expect(cancelAnimationFrame).toHaveBeenCalledWith(1);
});

test('observes scrollport size without relying on animation frames', () => {
  const element = document.createElement('div');
  element.style.border = '2px solid transparent';
  let offsetWidth = 324;
  Object.defineProperties(element, {
    clientHeight: { configurable: true, value: 236 },
    clientWidth: { configurable: true, value: 316 },
    offsetHeight: { configurable: true, value: 244 },
    offsetWidth: { configurable: true, get: () => offsetWidth },
  });

  let resizeCallback: ResizeObserverCallback | undefined;
  class ProbeResizeObserver {
    constructor(callback: ResizeObserverCallback) {
      resizeCallback = callback;
    }

    observe() {}

    unobserve() {}

    disconnect() {}
  }
  const targetWindow = {
    ResizeObserver: ProbeResizeObserver,
    cancelAnimationFrame: vi.fn(),
    getComputedStyle: () =>
      ({
        borderBottomWidth: '2px',
        borderLeftWidth: '2px',
        borderRightWidth: '2px',
        borderTopWidth: '2px',
      }) as CSSStyleDeclaration,
    requestAnimationFrame: vi.fn(),
  } as unknown as Window;
  const instance = {
    options: { useAnimationFrameWithResizeObserver: false },
    scrollElement: element,
    targetWindow,
  } as unknown as Virtualizer<HTMLDivElement, HTMLDivElement>;
  const measurements: { height: number; width: number }[] = [];

  trVirtualListInternals.observeScrollportRect(instance, (rect) => {
    measurements.push(rect);
  });
  offsetWidth = 308;
  resizeCallback?.([], {} as ResizeObserver);

  expect(measurements).toEqual([
    { height: 240, width: 320 },
    { height: 240, width: 304 },
  ]);
  expect(targetWindow.requestAnimationFrame).not.toHaveBeenCalled();
});

test('reports an initial scrollport size without ResizeObserver support', () => {
  const element = document.createElement('div');
  element.style.border = '2px solid transparent';
  Object.defineProperties(element, {
    clientHeight: { configurable: true, value: 236 },
    clientWidth: { configurable: true, value: 316 },
    offsetHeight: { configurable: true, value: 244 },
    offsetWidth: { configurable: true, value: 324 },
  });
  const targetWindow = {
    getComputedStyle: () =>
      ({
        borderBottomWidth: '2px',
        borderLeftWidth: '2px',
        borderRightWidth: '2px',
        borderTopWidth: '2px',
      }) as CSSStyleDeclaration,
  } as unknown as Window;
  const instance = {
    options: { useAnimationFrameWithResizeObserver: true },
    scrollElement: element,
    targetWindow,
  } as unknown as Virtualizer<HTMLDivElement, HTMLDivElement>;
  const callback = vi.fn();

  expect(
    trVirtualListInternals.observeScrollportRect(instance, callback),
  ).toBeUndefined();
  expect(callback).toHaveBeenCalledWith({ height: 240, width: 320 });

  expect(
    trVirtualListInternals.observeScrollportRect(
      { ...instance, scrollElement: null } as unknown as Virtualizer<
        HTMLDivElement,
        HTMLDivElement
      >,
      callback,
    ),
  ).toBeUndefined();
  expect(
    trVirtualListInternals.observeScrollportRect(
      { ...instance, targetWindow: null } as unknown as Virtualizer<
        HTMLDivElement,
        HTMLDivElement
      >,
      callback,
    ),
  ).toBeUndefined();
});

test('aligns underfilled vertical initial and controller item targets', async () => {
  let controller: TRVirtualListController<string> | undefined;
  function Harness() {
    controller = useTRVirtualListController<string>();
    return (
      <List
        controller={controller}
        initialPosition={{ alignment: 'center', index: 0 }}
        items={makeItems(3)}
      />
    );
  }
  await render(<Harness />);
  const viewport = getViewport();
  await expect
    .poll(() => {
      const item = findRenderedItem('Item 0')?.getBoundingClientRect();
      const frame = viewport.getBoundingClientRect();
      return item === undefined
        ? undefined
        : item.top + item.height / 2 - (frame.top + frame.height / 2);
    })
    .toBeCloseTo(0, 0);

  await act(async () =>
    controller?.scrollToKey('item-1', { alignment: 'trailing', behavior: 'auto' }),
  );
  await expect
    .poll(() => findRenderedItem('Item 1')?.getBoundingClientRect().bottom)
    .toBeCloseTo(viewport.getBoundingClientRect().bottom, 0);
});

test('aligns underfilled horizontal RTL initial and controller item targets', async () => {
  let controller: TRVirtualListController<string> | undefined;
  function Harness() {
    controller = useTRVirtualListController<string>();
    return (
      <div dir="rtl">
        <List
          axis="horizontal"
          controller={controller}
          initialPosition={{ alignment: 'center', key: 'item-0' }}
          items={makeItems(3)}
        />
      </div>
    );
  }
  await render(<Harness />);
  const viewport = getViewport();
  await expect
    .poll(() => {
      const item = findRenderedItem('Item 0')?.getBoundingClientRect();
      const frame = viewport.getBoundingClientRect();
      return item === undefined
        ? undefined
        : item.left + item.width / 2 - (frame.left + frame.width / 2);
    })
    .toBeCloseTo(0, 0);

  await act(async () =>
    controller?.scrollToIndex(1, { alignment: 'trailing', behavior: 'auto' }),
  );
  await expect
    .poll(() => findRenderedItem('Item 1')?.getBoundingClientRect().left)
    .toBeCloseTo(viewport.getBoundingClientRect().left, 0);
});

test('restores the trailing inset from an opaque underfilled snapshot', async () => {
  let controller: TRVirtualListController<string> | undefined;
  function Source() {
    controller = useTRVirtualListController<string>();
    return (
      <List
        controller={controller}
        initialPosition={{ edge: 'trailing' }}
        items={makeItems(3)}
      />
    );
  }
  const source = await render(<Source />);
  await expect.poll(() => document.body.textContent).toContain('Item 2');
  const snapshot = controller?.takeSnapshot() as TRVirtualListSnapshot<string>;
  await source.unmount();

  await render(<List initialSnapshot={snapshot} items={makeItems(3)} />);
  const viewport = getViewport();
  await expect
    .poll(() => findRenderedItem('Item 2')?.getBoundingClientRect().bottom)
    .toBeCloseTo(viewport.getBoundingClientRect().bottom, 0);
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
  const viewport = getViewport();
  viewport.scrollTo({ top: viewport.scrollHeight });
  viewport.dispatchEvent(new Event('scroll'));
  await expect.poll(() => trailingRequest).toHaveBeenCalledTimes(1);
  viewport.scrollTo({ top: 0 });
  viewport.dispatchEvent(new Event('scroll'));
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
  await view.rerender(
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
      viewportProps={{ style: { height: 240, width: 320 } }}
    />,
  );
  await new Promise((resolve) => requestAnimationFrame(resolve));
  expect(leadingRequest).toHaveBeenCalledTimes(2);
});

test('scrolls to the logical leading edge before a measured slot and honors a zero trigger', async () => {
  let controller: TRVirtualListController<string> | undefined;
  const leadingRequest = vi.fn();
  function Harness() {
    controller = useTRVirtualListController<string>();
    return (
      <TRVirtualList<Item, string>
        controller={controller}
        estimateSize={() => 40}
        initialPosition={{ edge: 'trailing' }}
        itemKey={(item) => item.id}
        itemProps={() => ({ style: { height: 40 } })}
        items={makeItems(30)}
        leadingEdgeRequest={{
          onRequest: leadingRequest,
          requestKey: 'zero-leading',
          slot: <div data-testid="zero-leading-slot" style={{ height: 48 }} />,
          triggerExtent: { kind: 'pixels', value: 0 },
        }}
        renderItem={(item) => item.label}
        viewportProps={{ style: { height: 240, width: 320 } }}
      />
    );
  }
  await render(<Harness />);
  const viewport = getViewport();
  await expect.poll(() => viewport.scrollTop).toBeGreaterThan(0);
  leadingRequest.mockClear();

  await act(async () => controller?.scrollToEdge('leading'));

  await expect.poll(() => viewport.scrollTop).toBe(0);
  const leadingSlot = document.querySelector<HTMLElement>(
    '[data-testid="zero-leading-slot"]',
  ) as HTMLElement;
  expect(leadingSlot.getBoundingClientRect().top).toBeCloseTo(
    viewport.getBoundingClientRect().top,
    0,
  );
  await expect.poll(() => leadingRequest).toHaveBeenCalledTimes(1);
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
  const item20Top = (await waitForRenderedItem('Item 20')).getBoundingClientRect().top;
  const scrollHeight = viewport.scrollHeight;
  await act(async () => resizeLeading?.());
  await expect.poll(() => viewport.scrollHeight).toBeCloseTo(scrollHeight + 40, 0);
  await expect
    .poll(() => findRenderedItem('Item 20')?.getBoundingClientRect().top)
    .toBeCloseTo(item20Top, 0);

  await act(async () => controller?.scrollToEdge('trailing'));
  const heightAtTrailing = viewport.scrollHeight;
  await act(async () => resizeTrailing?.());
  await expect.poll(() => viewport.scrollHeight).toBeCloseTo(heightAtTrailing + 40, 0);
  await expect
    .poll(() => viewport.scrollHeight - viewport.scrollTop)
    .toBeCloseTo(viewport.clientHeight, 0);
});

test('measures horizontal edge slots on the logical axis', async () => {
  await render(
    <TRVirtualList<Item, string>
      axis="horizontal"
      estimateSize={() => 40}
      itemKey={(item) => item.id}
      itemProps={() => ({ style: { width: 40 } })}
      items={makeItems(20)}
      leadingEdgeRequest={{
        onRequest: vi.fn(),
        requestKey: 'leading',
        slot: <div data-testid="horizontal-leading" style={{ width: 48 }} />,
      }}
      renderItem={(item) => item.label}
      trailingEdgeRequest={{
        onRequest: vi.fn(),
        requestKey: 'trailing',
        slot: <div data-testid="horizontal-trailing" style={{ width: 32 }} />,
      }}
      viewportProps={{ style: { height: 120, width: 320 } }}
    />,
  );
  const viewport = getViewport();
  await expect.poll(() => viewport.scrollWidth).toBe(880);
  const leading = document.querySelector<HTMLElement>(
    '[data-testid="horizontal-leading"]',
  );
  const first = findRenderedItem('Item 0');
  expect(first?.getBoundingClientRect().left).toBeCloseTo(
    leading?.getBoundingClientRect().right ?? 0,
    0,
  );
});

test('keeps a collection update safe when no old anchor key survives', async () => {
  let replace: (() => void) | undefined;
  let controller: TRVirtualListController<string> | undefined;
  function Harness() {
    const [items, setItems] = useState(makeItems(40));
    replace = () =>
      setItems(
        makeItems(40).map((item, index) => ({
          ...item,
          id: `replacement-${index}`,
        })),
      );
    controller = useTRVirtualListController<string>();
    return <List controller={controller} items={items} />;
  }
  await render(<Harness />);
  await act(async () => controller?.scrollToKey('item-20'));
  await expect.poll(() => document.body.textContent).toContain('Item 20');
  await act(async () => replace?.());
  await expect.poll(() => document.body.textContent).toContain('Item 21');
  expect(getViewport().scrollTop).toBeGreaterThan(0);
});

test('uses default and explicit viewport thresholds without requesting an empty list', async () => {
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
      trailingEdgeRequest={{
        onRequest: trailingRequest,
        requestKey: 'after',
        triggerExtent: { kind: 'viewports', value: 1 },
      }}
      viewportProps={{ style: { height: 240, width: 320 } }}
    />,
  );
  await expect.poll(() => leadingRequest).toHaveBeenCalledTimes(1);
  expect(trailingRequest).not.toHaveBeenCalled();
  const viewport = getViewport();
  viewport.scrollTop = viewport.scrollHeight - viewport.clientHeight - 200;
  viewport.dispatchEvent(new Event('scroll'));
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

test('restores a compatible snapshot measurement cache and exact anchor offset', async () => {
  const snapshot = trVirtualListInternals.createTRVirtualListSnapshot({
    candidates: [{ index: 20, key: 'item-20', offset: 13 }],
    itemSizes: makeItems(50).map((item) => ({ key: item.id, size: 50 })),
    positionedCandidates: [{ index: 20, key: 'item-20', offset: 13 }],
    alignmentTarget: null,
  });
  await render(
    <TRVirtualList<Item, string>
      estimateSize={() => 40}
      initialSnapshot={snapshot}
      itemKey={(item) => item.id}
      itemProps={() => ({ style: { height: 50 } })}
      items={makeItems(50)}
      renderItem={(item) => item.label}
      viewportProps={{ style: { height: 240, width: 320 } }}
    />,
  );
  const item20 = await waitForRenderedItem('Item 20');
  const viewport = getViewport();
  expect(viewport.scrollTop).toBeCloseTo(1_013, 0);
  expect(
    viewport.getBoundingClientRect().top - item20.getBoundingClientRect().top,
  ).toBeCloseTo(13, 0);
});

test('falls back from a compatible snapshot with a missing anchor to initial position', async () => {
  await render(
    <TRVirtualList<Item, string>
      estimateSize={() => 40}
      initialPosition={{ index: 15 }}
      initialSnapshot={trVirtualListInternals.createTRVirtualListSnapshot({
        candidates: [{ index: 0, key: 'missing', offset: 0 }],
        itemSizes: [],
        positionedCandidates: [{ index: 0, key: 'missing', offset: 0 }],
        alignmentTarget: null,
      })}
      itemKey={(item) => item.id}
      itemProps={() => ({ style: { height: 40 } })}
      items={makeItems(50)}
      renderItem={(item) => item.label}
      viewportProps={{ style: { height: 240, width: 320 } }}
    />,
  );
  await expect.poll(() => document.body.textContent).toContain('Item 15');
  expect(getViewport().scrollTop).toBeGreaterThan(0);
});

test('falls back from an opaque snapshot without candidates to initial position', async () => {
  await render(
    <List
      initialPosition={{ alignment: 'leading', key: 'item-10' }}
      initialSnapshot={trVirtualListInternals.createTRVirtualListSnapshot({
        candidates: [],
        itemSizes: [],
        positionedCandidates: [],
        alignmentTarget: null,
      })}
      items={makeItems(30)}
    />,
  );
  const item = await waitForRenderedItem('Item 10');
  expect(item.getBoundingClientRect().top).toBeCloseTo(
    getViewport().getBoundingClientRect().top,
    0,
  );
});

test('keeps invalid alignment and range fallback states inert', () => {
  const items = makeItems(2);
  const itemKey = (item: Item) => item.id;
  const missingTargetSnapshot = trVirtualListInternals.createTRVirtualListSnapshot({
    alignmentTarget: { alignment: 'center', key: 'missing' },
    candidates: [],
    itemSizes: [],
    positionedCandidates: [],
  });
  expect(
    trVirtualListInternals.initialVisualLayout(
      items,
      itemKey,
      { edge: 'trailing' },
      missingTargetSnapshot,
    ),
  ).toBeNull();
  expect(
    trVirtualListInternals.initialVisualLayout(
      [],
      itemKey,
      { alignment: 'center', index: 0 },
      undefined,
    ),
  ).toBeNull();

  const leadingLayout = trVirtualListInternals.initialVisualLayout(
    items,
    itemKey,
    { alignment: 'leading', key: 'item-1' },
    undefined,
  );
  expect(
    trVirtualListInternals.resolveVisualOffset(
      leadingLayout,
      [],
      { leading: 0, trailing: 0 },
      240,
      80,
    ),
  ).toBe(0);
  expect(
    trVirtualListInternals.resolveVisualOffset(
      leadingLayout,
      [
        { key: 'item-0', size: 40, start: 0 },
        { key: 'item-1', size: 40, start: 40 },
      ],
      { leading: 0, trailing: 0 },
      240,
      80,
    ),
  ).toBe(-40);
  expect(
    trVirtualListInternals.resolveVisibleRange(
      [{ end: 40, index: 0, start: 0 }],
      [],
      0,
      240,
      0,
    ),
  ).toBeNull();
  expect(
    trVirtualListInternals.captureVisibleAnchor(
      {
        getTotalSize: () => 40,
        getVirtualItems: () => [{ end: 40, index: 0, start: 0 }],
        scrollElement: { clientHeight: 240, clientWidth: 320 },
        scrollOffset: null,
        scrollRect: { height: 240, width: 320 },
      } as never,
      [],
      'vertical',
    ),
  ).toEqual(expect.objectContaining({ candidates: [], positionedCandidates: [] }));
});

test('uses nearest alignment by default for a keyed initial position', async () => {
  await render(<List initialPosition={{ key: 'item-15' }} items={makeItems(50)} />);
  const item15 = await waitForRenderedItem('Item 15');
  const viewport = getViewport();
  expect(item15.getBoundingClientRect().bottom).toBeLessThanOrEqual(
    viewport.getBoundingClientRect().bottom,
  );
});

test('applies trailing edge and index alignment initial positions', async () => {
  const trailing = await render(
    <List initialPosition={{ edge: 'trailing' }} items={makeItems(30)} />,
  );
  await expect.poll(() => document.body.textContent).toContain('Item 29');
  let viewport = getViewport();
  expect(viewport.scrollHeight - viewport.scrollTop).toBeCloseTo(
    viewport.clientHeight,
    0,
  );
  await trailing.unmount();

  await render(
    <List
      initialPosition={{ alignment: 'trailing', index: 20 }}
      items={makeItems(30)}
    />,
  );
  const item20 = await waitForRenderedItem('Item 20');
  viewport = getViewport();
  expect(item20.getBoundingClientRect().bottom).toBeCloseTo(
    viewport.getBoundingClientRect().bottom,
    0,
  );
});

test('follows leading collection changes only while pinned', async () => {
  let prepend: (() => void) | undefined;
  let controller: TRVirtualListController<string> | undefined;
  function Harness() {
    const [items, setItems] = useState(makeItems(30));
    prepend = () =>
      setItems((current) => [
        { id: `before-${current.length}`, label: 'Before' },
        ...current,
      ]);
    controller = useTRVirtualListController<string>();
    return <List controller={controller} follow="leading" items={items} />;
  }
  await render(<Harness />);
  const viewport = getViewport();
  await act(async () => prepend?.());
  await expect.poll(() => document.body.textContent).toContain('Before');
  expect(viewport.scrollTop).toBe(0);

  await act(async () => controller?.scrollToKey('item-12', { behavior: 'auto' }));
  const item12Top = (await waitForRenderedItem('Item 12')).getBoundingClientRect().top;
  await act(async () => prepend?.());
  await expect
    .poll(() => findRenderedItem('Item 12')?.getBoundingClientRect().top)
    .toBeCloseTo(item12Top, 0);
});

test('reports and deduplicates visible ranges while forwarding native handlers', async () => {
  const onVisibleRangeChanged = vi.fn();
  const onFocusCapture = vi.fn();
  const onBlurCapture = vi.fn();
  const onScroll = vi.fn();
  const fixture = (items: readonly Item[]) => (
    <>
      <TRVirtualList<Item, string>
        estimateSize={() => 40}
        itemKey={(item) => item.id}
        itemProps={() => ({ style: { height: 40 } })}
        items={items}
        onVisibleRangeChanged={onVisibleRangeChanged}
        renderItem={(item) => <button type="button">{item.label}</button>}
        rootProps={{ onBlurCapture, onFocusCapture }}
        viewportProps={{ onScroll, style: { height: 240, width: 320 } }}
      >
        <button data-testid="outside-item" type="button">
          Outside item
        </button>
      </TRVirtualList>
      <button data-testid="outside-root" type="button">
        Outside root
      </button>
    </>
  );
  const view = await render(fixture(makeItems(50)));
  await expect.poll(() => onVisibleRangeChanged).toHaveBeenCalledTimes(1);
  expect(onVisibleRangeChanged.mock.calls[0]?.[0]).toEqual({
    endIndex: 5,
    leadingKey: 'item-0',
    startIndex: 0,
    trailingKey: 'item-5',
  });
  const viewport = document.querySelector<HTMLElement>('.tr-virtual-list-viewport');
  viewport?.dispatchEvent(new Event('scroll'));
  await new Promise((resolve) => requestAnimationFrame(resolve));
  expect(onVisibleRangeChanged).toHaveBeenCalledTimes(1);
  expect(onScroll).toHaveBeenCalledTimes(1);
  await view.rerender(fixture(makeItems(50)));
  await new Promise((resolve) => requestAnimationFrame(resolve));
  expect(onVisibleRangeChanged).toHaveBeenCalledTimes(1);
  viewport?.scrollTo({ top: 800 });
  viewport?.dispatchEvent(new Event('scroll'));
  await expect.poll(() => onVisibleRangeChanged).toHaveBeenCalledTimes(2);

  const visibleButton = document.querySelector<HTMLButtonElement>(
    '.tr-virtual-list-item button',
  );
  visibleButton?.focus();
  expect(onFocusCapture).toHaveBeenCalled();
  document.querySelector<HTMLButtonElement>('[data-testid="outside-item"]')?.focus();
  document.querySelector<HTMLButtonElement>('[data-testid="outside-root"]')?.focus();
  expect(onBlurCapture).toHaveBeenCalled();
});

test('does not report a visible item when a measured leading slot covers the viewport', async () => {
  const onVisibleRangeChanged = vi.fn();
  await render(
    <TRVirtualList<Item, string>
      estimateSize={() => 40}
      itemKey={(item) => item.id}
      itemProps={() => ({ style: { height: 40 } })}
      items={makeItems(3)}
      leadingEdgeRequest={{
        onRequest: vi.fn(),
        requestKey: 'covering-slot',
        slot: <div data-testid="covering-slot" style={{ height: 280 }} />,
      }}
      onVisibleRangeChanged={onVisibleRangeChanged}
      renderItem={(item) => item.label}
      viewportProps={{ style: { height: 240, width: 320 } }}
    />,
  );
  await expect
    .poll(
      () =>
        document
          .querySelector<HTMLElement>('[data-testid="covering-slot"]')
          ?.getBoundingClientRect().height,
    )
    .toBe(280);
  await new Promise((resolve) => requestAnimationFrame(resolve));
  expect(onVisibleRangeChanged).not.toHaveBeenCalled();
});

test('preserves a positioned predecessor when deleting the visible trailing suffix', async () => {
  let controller: TRVirtualListController<string> | undefined;
  let trim: ((length: number) => void) | undefined;
  function Harness() {
    const [items, setItems] = useState(makeItems(40));
    trim = (length) => setItems((current) => current.slice(0, length));
    controller = useTRVirtualListController<string>();
    return <List controller={controller} items={items} overscan={8} />;
  }
  await render(<Harness />);
  await act(async () => controller?.scrollToEdge('trailing'));
  await waitForRenderedItem('Item 39');
  const data = trVirtualListInternals.readTRVirtualListSnapshot(
    controller?.takeSnapshot() ?? undefined,
  );
  expect(data).toBeDefined();
  const firstVisibleIndex = Math.min(
    ...(data?.candidates.map(({ index }) => index) ?? []),
  );
  const predecessor = [...(data?.positionedCandidates ?? [])]
    .reverse()
    .find(({ index }) => index < firstVisibleIndex);
  expect(predecessor).toBeDefined();
  const predecessorTop = findRenderedItem(
    `Item ${predecessor?.index}`,
  )?.getBoundingClientRect().top;

  await act(async () => trim?.(firstVisibleIndex));

  await expect
    .poll(
      () => findRenderedItem(`Item ${predecessor?.index}`)?.getBoundingClientRect().top,
    )
    .toBeCloseTo(predecessorTop ?? 0, 0);
});

test('keeps controller calls inert before binding and after unmount', async () => {
  let controller: TRVirtualListController<string> | undefined;
  function Harness({ mounted }: { mounted: boolean }) {
    controller = useTRVirtualListController<string>();
    if (!mounted) return null;
    return <List controller={controller} items={[]} />;
  }
  const view = await render(<Harness mounted={false} />);
  expect(controller?.takeSnapshot()).toBeNull();
  controller?.holdVisibleAnchorForNextLayout();
  controller?.scrollToEdge('leading');
  controller?.scrollToIndex(0);
  controller?.scrollToKey('missing');
  await view.rerender(<Harness mounted />);
  const emptySnapshot = controller?.takeSnapshot();
  expect(emptySnapshot?.version).toBe(1);
  expect(
    trVirtualListInternals.readTRVirtualListSnapshot(emptySnapshot ?? undefined),
  ).toEqual({
    candidates: [],
    itemSizes: [],
    positionedCandidates: [],
    alignmentTarget: null,
  });
  controller?.scrollToIndex(0);
  await view.rerender(<Harness mounted={false} />);
  expect(controller?.takeSnapshot()).toBeNull();

  const binding = {
    holdVisibleAnchorForNextLayout: vi.fn(),
    scrollToEdge: vi.fn(),
    scrollToIndex: vi.fn(),
    scrollToKey: vi.fn(),
    takeSnapshot: vi.fn(() => null),
  };
  expect(attachTRVirtualListController({} as never, binding)).toBeUndefined();
  const firstCleanup = attachTRVirtualListController(controller, binding);
  const secondCleanup = attachTRVirtualListController(controller, { ...binding });
  firstCleanup?.();
  secondCleanup?.();
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

test('rejects invalid item estimates before they reach the virtualizer', async () => {
  await expect(
    render(
      <TRVirtualList<Item, string>
        estimateSize={() => 0}
        itemKey={(item) => item.id}
        items={makeItems(2)}
        renderItem={(item) => item.label}
        viewportProps={{ style: { height: 240, width: 320 } }}
      />,
    ),
  ).rejects.toThrow(/estimateSize.*greater than zero/iu);
  await expect(
    render(
      <TRVirtualList<Item, string>
        estimateSize={() => Number.POSITIVE_INFINITY}
        itemKey={(item) => item.id}
        items={makeItems(2)}
        renderItem={(item) => item.label}
      />,
    ),
  ).rejects.toThrow(/estimateSize.*finite.*greater than zero/iu);
});

test('rejects negative and non-finite edge trigger extents', async () => {
  const invalidList = (triggerExtent: { kind: 'pixels'; value: number }) => (
    <List
      items={makeItems(2)}
      leadingEdgeRequest={{ onRequest: vi.fn(), requestKey: 'invalid', triggerExtent }}
    />
  );
  await expect(render(invalidList({ kind: 'pixels', value: -1 }))).rejects.toThrow(
    /triggerExtent.*finite.*non-negative/iu,
  );
  await expect(
    render(invalidList({ kind: 'pixels', value: Number.POSITIVE_INFINITY })),
  ).rejects.toThrow(/triggerExtent.*finite.*non-negative/iu);
});

test('supports an empty minimal list without optional DOM props', async () => {
  await render(
    <TRVirtualList<Item, string>
      estimateSize={() => 40}
      itemKey={(item) => item.id}
      items={[]}
      renderItem={(item) => item.label}
    />,
  );
  expect(document.querySelector('.tr-virtual-list')).not.toBeNull();
  expect(document.querySelectorAll('.tr-virtual-list-item')).toHaveLength(0);
});

test('remeasures an edge slot and consumes an empty-list anchor hold safely', async () => {
  let empty: (() => void) | undefined;
  let resize: (() => void) | undefined;
  let controller: TRVirtualListController<string> | undefined;
  function Harness() {
    const [size, setSize] = useState(24);
    const [items, setItems] = useState(makeItems(30));
    empty = () => setItems([]);
    resize = () => setSize(48);
    controller = useTRVirtualListController<string>();
    return (
      <TRVirtualList<Item, string>
        controller={controller}
        estimateSize={() => 40}
        itemKey={(item) => item.id}
        items={items}
        leadingEdgeRequest={{
          onRequest: vi.fn(),
          requestKey: 'empty-slot',
          slot: <div data-testid="empty-edge-slot" style={{ height: size }} />,
        }}
        renderItem={(item) => item.label}
        viewportProps={{ style: { height: 120, width: 320 } }}
      />
    );
  }
  await render(<Harness />);
  const slot = document.querySelector<HTMLElement>('[data-testid="empty-edge-slot"]');
  expect(slot?.getBoundingClientRect().height).toBe(24);
  await act(async () => controller?.scrollToKey('item-15'));
  await expect.poll(() => document.body.textContent).toContain('Item 15');
  await act(async () => empty?.());
  await expect
    .poll(() => document.querySelectorAll('.tr-virtual-list-item'))
    .toHaveLength(0);
  controller?.holdVisibleAnchorForNextLayout();
  await act(async () => resize?.());
  await expect.poll(() => slot?.getBoundingClientRect().height).toBe(48);
  expect(document.querySelectorAll('.tr-virtual-list-item')).toHaveLength(0);
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

test('applies an initial horizontal RTL key position at logical leading', async () => {
  await render(
    <div dir="rtl">
      <TRVirtualList<Item, string>
        axis="horizontal"
        estimateSize={() => 40}
        initialPosition={{ alignment: 'leading', key: 'item-20' }}
        itemKey={(item) => item.id}
        itemProps={() => ({ style: { width: 40 } })}
        items={makeItems(50)}
        renderItem={(item) => item.label}
        viewportProps={{ style: { height: 120, width: 320 } }}
      />
    </div>,
  );
  await expect.poll(() => document.body.textContent).toContain('Item 20');
  const viewport = document.querySelector<HTMLElement>('.tr-virtual-list-viewport');
  const item20 = Array.from(
    document.querySelectorAll<HTMLElement>('.tr-virtual-list-item'),
  ).find((element) => element.textContent === 'Item 20');
  expect(viewport?.scrollLeft).toBeLessThan(0);
  expect(item20?.getBoundingClientRect().right).toBeCloseTo(
    viewport?.getBoundingClientRect().right ?? 0,
    0,
  );
});

test('updates horizontal navigation when inherited direction changes', async () => {
  let setDirection: ((direction: 'ltr' | 'rtl') => void) | undefined;
  let controller: TRVirtualListController<string> | undefined;
  function Harness() {
    const [direction, updateDirection] = useState<'ltr' | 'rtl'>('ltr');
    setDirection = updateDirection;
    controller = useTRVirtualListController<string>();
    return (
      <div dir={direction}>
        <List axis="horizontal" controller={controller} items={makeItems(50)} />
      </div>
    );
  }
  await render(<Harness />);
  await act(async () => controller?.scrollToKey('item-20', { alignment: 'leading' }));
  await expect.poll(() => document.body.textContent).toContain('Item 20');
  await act(async () => setDirection?.('rtl'));
  await act(async () => controller?.scrollToKey('item-30', { alignment: 'leading' }));
  await expect.poll(() => document.body.textContent).toContain('Item 30');
  const viewport = document.querySelector<HTMLElement>('.tr-virtual-list-viewport');
  const item30 = Array.from(
    document.querySelectorAll<HTMLElement>('.tr-virtual-list-item'),
  ).find((element) => element.textContent === 'Item 30');
  expect(viewport?.scrollLeft).toBeLessThan(0);
  expect(item30?.getBoundingClientRect().right).toBeCloseTo(
    viewport?.getBoundingClientRect().right ?? 0,
    0,
  );
});

test('corrects inaccurate horizontal estimates before LTR and RTL controller navigation', async () => {
  let setDirection: ((direction: 'ltr' | 'rtl') => void) | undefined;
  let controller: TRVirtualListController<string> | undefined;
  function Harness() {
    const [direction, updateDirection] = useState<'ltr' | 'rtl'>('ltr');
    setDirection = updateDirection;
    controller = useTRVirtualListController<string>();
    return (
      <div dir={direction}>
        <TRVirtualList<Item, string>
          axis="horizontal"
          controller={controller}
          estimateSize={() => 30}
          itemKey={(item) => item.id}
          itemProps={() => ({ style: { width: 40 } })}
          items={makeItems(30)}
          renderItem={(item) => item.label}
          viewportProps={{ style: { height: 120, width: 320 } }}
        />
      </div>
    );
  }
  await render(<Harness />);
  await expect
    .poll(
      () =>
        trVirtualListInternals.readTRVirtualListSnapshot(
          controller?.takeSnapshot() ?? undefined,
        )?.itemSizes.length ?? 0,
    )
    .toBeGreaterThan(0);
  await act(async () =>
    controller?.scrollToIndex(0, { alignment: 'leading', behavior: 'auto' }),
  );
  expect(
    document.querySelector<HTMLElement>('.tr-virtual-list-viewport')?.scrollLeft,
  ).toBe(0);
  await act(async () => setDirection?.('rtl'));
  await act(async () =>
    controller?.scrollToIndex(0, { alignment: 'leading', behavior: 'auto' }),
  );
  expect(
    document.querySelector<HTMLElement>('.tr-virtual-list-viewport')?.scrollLeft,
  ).toBeLessThanOrEqual(0);
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
