import '../../core/core.css';
import './scroll-area.css';
import { act, type CSSProperties, createRef } from 'react';
import { hydrateRoot } from 'react-dom/client';
import { renderToString } from 'react-dom/server.browser';
import { expect, test } from 'vitest';
import { userEvent } from 'vitest/browser';
import { render } from 'vitest-browser-react';
import { TRDirectionProvider } from '../../providers/direction/index.js';
import {
  TRScrollArea,
  TRScrollAreaContent,
  TRScrollAreaCorner,
  TRScrollAreaRoot,
  TRScrollAreaScrollbar,
  TRScrollAreaThumb,
  TRScrollAreaViewport,
} from './index.js';

test('exports its complete anatomy and preserves classes, native props, and refs', async () => {
  expect(TRScrollArea).toEqual({
    Root: TRScrollAreaRoot,
    Viewport: TRScrollAreaViewport,
    Scrollbar: TRScrollAreaScrollbar,
    Content: TRScrollAreaContent,
    Thumb: TRScrollAreaThumb,
    Corner: TRScrollAreaCorner,
  });
  const rootRef = createRef<HTMLDivElement>();
  const viewportRef = createRef<HTMLDivElement>();
  const contentRef = createRef<HTMLDivElement>();
  const verticalScrollbarRef = createRef<HTMLDivElement>();
  const horizontalScrollbarRef = createRef<HTMLDivElement>();
  const verticalThumbRef = createRef<HTMLDivElement>();
  const horizontalThumbRef = createRef<HTMLDivElement>();
  const cornerRef = createRef<HTMLDivElement>();

  await render(
    <TRScrollArea.Root
      className="consumer-root"
      ref={rootRef}
      style={{ height: 160, width: 320 }}
    >
      <TRScrollArea.Viewport
        aria-label="Rack events"
        className="consumer-viewport"
        data-testid="viewport"
        ref={viewportRef}
      >
        <TRScrollArea.Content
          className="consumer-content"
          ref={contentRef}
          style={{ height: 320, width: 640 }}
        >
          Scrollable content
        </TRScrollArea.Content>
      </TRScrollArea.Viewport>
      <TRScrollArea.Scrollbar
        className="consumer-vertical-scrollbar"
        orientation="vertical"
        ref={verticalScrollbarRef}
      >
        <TRScrollArea.Thumb
          className="consumer-vertical-thumb"
          ref={verticalThumbRef}
        />
      </TRScrollArea.Scrollbar>
      <TRScrollArea.Scrollbar
        className="consumer-horizontal-scrollbar"
        orientation="horizontal"
        ref={horizontalScrollbarRef}
      >
        <TRScrollArea.Thumb
          className="consumer-horizontal-thumb"
          ref={horizontalThumbRef}
        />
      </TRScrollArea.Scrollbar>
      <TRScrollArea.Corner className="consumer-corner" ref={cornerRef} />
    </TRScrollArea.Root>,
  );

  await expect.poll(() => cornerRef.current).not.toBeNull();
  expect(rootRef.current).toHaveClass('tr-scroll-area', 'consumer-root');
  expect(rootRef.current).toHaveAttribute('data-variant', 'surface');
  expect(viewportRef.current).toHaveClass(
    'tr-scroll-area-viewport',
    'consumer-viewport',
  );
  expect(viewportRef.current).toHaveAttribute('aria-label', 'Rack events');
  expect(viewportRef.current).toHaveAttribute('data-testid', 'viewport');
  expect(contentRef.current).toHaveClass('tr-scroll-area-content', 'consumer-content');
  expect(verticalScrollbarRef.current).toHaveClass(
    'tr-scroll-area-scrollbar',
    'consumer-vertical-scrollbar',
  );
  expect(horizontalScrollbarRef.current).toHaveAttribute(
    'data-orientation',
    'horizontal',
  );
  expect(verticalThumbRef.current).toHaveClass(
    'tr-scroll-area-thumb',
    'consumer-vertical-thumb',
  );
  expect(horizontalThumbRef.current).toHaveClass(
    'tr-scroll-area-thumb',
    'consumer-horizontal-thumb',
  );
  expect(cornerRef.current).toHaveClass('tr-scroll-area-corner', 'consumer-corner');
});

test('offers a borderless and padding-free plain variant', async () => {
  await render(
    <TRScrollArea.Root variant="plain">
      <TRScrollArea.Viewport>
        <TRScrollArea.Content>Navigation</TRScrollArea.Content>
      </TRScrollArea.Viewport>
    </TRScrollArea.Root>,
  );
  const root = document.querySelector<HTMLElement>('.tr-scroll-area');
  const content = document.querySelector<HTMLElement>('.tr-scroll-area-content');
  expect(root?.dataset['variant']).toBe('plain');
  expect(getComputedStyle(root as HTMLElement).borderTopWidth).toBe('0px');
  expect(getComputedStyle(content as HTMLElement).paddingTop).toBe('0px');
});

test('keeps vertical and horizontal scroll indicators visible', async () => {
  await render(
    <TRScrollArea.Root style={{ height: 160, width: 320 }}>
      <TRScrollArea.Viewport>
        <TRScrollArea.Content style={{ height: 320, width: 640 }}>
          Scrollable content
        </TRScrollArea.Content>
      </TRScrollArea.Viewport>
      <TRScrollArea.Scrollbar orientation="vertical">
        <TRScrollArea.Thumb />
      </TRScrollArea.Scrollbar>
      <TRScrollArea.Scrollbar orientation="horizontal">
        <TRScrollArea.Thumb />
      </TRScrollArea.Scrollbar>
      <TRScrollArea.Corner />
    </TRScrollArea.Root>,
  );

  await expect
    .poll(() => document.querySelectorAll('.tr-scroll-area-thumb').length)
    .toBe(2);

  const verticalThumb = document.querySelector<HTMLElement>(
    '.tr-scroll-area-scrollbar[data-orientation="vertical"] .tr-scroll-area-thumb',
  );
  const horizontalThumb = document.querySelector<HTMLElement>(
    '.tr-scroll-area-scrollbar[data-orientation="horizontal"] .tr-scroll-area-thumb',
  );

  expect(verticalThumb).not.toBeNull();
  expect(horizontalThumb).not.toBeNull();
  expect((verticalThumb as HTMLElement).getBoundingClientRect().width).toBeGreaterThan(
    0,
  );
  expect(
    (horizontalThumb as HTMLElement).getBoundingClientRect().height,
  ).toBeGreaterThan(0);
});

test('keeps scrollbars above positioned content overlays', async () => {
  await render(
    <TRScrollArea.Root style={{ height: 160, width: 320 }}>
      <TRScrollArea.Viewport>
        <TRScrollArea.Content style={{ height: 320, position: 'relative' }}>
          <div
            data-testid="content-overlay"
            style={{ inset: 0, position: 'absolute', zIndex: 2 }}
          />
        </TRScrollArea.Content>
      </TRScrollArea.Viewport>
      <TRScrollArea.Scrollbar orientation="vertical">
        <TRScrollArea.Thumb />
      </TRScrollArea.Scrollbar>
    </TRScrollArea.Root>,
  );

  const scrollbar = document.querySelector<HTMLElement>(
    '.tr-scroll-area-scrollbar[data-orientation="vertical"]',
  );
  await expect
    .poll(() => scrollbar?.getBoundingClientRect().height ?? 0)
    .toBeGreaterThan(0);
  const box = (scrollbar as HTMLElement).getBoundingClientRect();
  const topmostElement = document.elementFromPoint(
    box.left + box.width / 2,
    box.top + box.height / 2,
  );

  expect(topmostElement?.closest('.tr-scroll-area-scrollbar')).toBe(scrollbar);
});

test('keeps horizontal-only overflow on its declared axis and forwards viewport props', async () => {
  const viewportRef = createRef<HTMLDivElement>();

  await render(
    <TRScrollArea.Root style={{ height: 160, width: 320 }}>
      <TRScrollArea.Viewport
        aria-label="Horizontal rack events"
        data-testid="horizontal-viewport"
        ref={viewportRef}
        tabIndex={0}
      >
        <TRScrollArea.Content style={{ height: 40, width: 640 }}>
          Rack event stream
        </TRScrollArea.Content>
      </TRScrollArea.Viewport>
      <TRScrollArea.Scrollbar orientation="horizontal">
        <TRScrollArea.Thumb />
      </TRScrollArea.Scrollbar>
    </TRScrollArea.Root>,
  );

  const viewport = viewportRef.current as HTMLDivElement;
  expect(viewport.getAttribute('aria-label')).toBe('Horizontal rack events');
  expect(viewport.tabIndex).toBe(0);
  expect(viewport.scrollWidth).toBeGreaterThan(viewport.clientWidth);
  expect(viewport.scrollHeight).toBeLessThanOrEqual(viewport.clientHeight);
  expect(
    document.querySelector('.tr-scroll-area-scrollbar[data-orientation="vertical"]'),
  ).toBeNull();

  viewport.scrollLeft = 120;
  viewport.dispatchEvent(new Event('scroll', { bubbles: true }));
  await expect.poll(() => viewport.scrollLeft).toBe(120);
});

test('27 optionally hides scrollbars until hover, focus, or scrolling', async () => {
  await render(
    <TRScrollArea.Root autoHide style={{ height: 120, width: 240 }}>
      <TRScrollArea.Viewport tabIndex={0}>
        <TRScrollArea.Content style={{ height: 360 }}>
          Scrollable content
        </TRScrollArea.Content>
      </TRScrollArea.Viewport>
      <TRScrollArea.Scrollbar orientation="vertical">
        <TRScrollArea.Thumb />
      </TRScrollArea.Scrollbar>
    </TRScrollArea.Root>,
  );

  const root = document.querySelector<HTMLElement>('.tr-scroll-area');
  const viewport = document.querySelector<HTMLElement>('.tr-scroll-area-viewport');
  const scrollbar = document.querySelector<HTMLElement>('.tr-scroll-area-scrollbar');
  expect(root?.dataset['autoHide']).toBe('true');
  await userEvent.unhover(root as HTMLElement);
  await expect.poll(() => getComputedStyle(scrollbar as HTMLElement).opacity).toBe('0');
  await userEvent.hover(root as HTMLElement);
  await expect.poll(() => getComputedStyle(scrollbar as HTMLElement).opacity).toBe('1');
  await userEvent.unhover(root as HTMLElement);
  await expect.poll(() => getComputedStyle(scrollbar as HTMLElement).opacity).toBe('0');
  if (viewport) {
    viewport.scrollTop = 40;
    viewport.dispatchEvent(new Event('scroll', { bubbles: true }));
  }
  await expect.poll(() => getComputedStyle(scrollbar as HTMLElement).opacity).toBe('1');
  viewport?.focus();
  expect(getComputedStyle(scrollbar as HTMLElement).opacity).toBe('1');
});

test('supports native keyboard scrolling and forwards wheel input from each track', async () => {
  await render(
    <TRScrollArea.Root style={{ height: 120, width: 240 }}>
      <TRScrollArea.Viewport aria-label="Scrollable rack matrix">
        <TRScrollArea.Content style={{ height: 480, width: 720 }}>
          Rack matrix
        </TRScrollArea.Content>
      </TRScrollArea.Viewport>
      <TRScrollArea.Scrollbar orientation="vertical">
        <TRScrollArea.Thumb />
      </TRScrollArea.Scrollbar>
      <TRScrollArea.Scrollbar orientation="horizontal">
        <TRScrollArea.Thumb />
      </TRScrollArea.Scrollbar>
      <TRScrollArea.Corner />
    </TRScrollArea.Root>,
  );
  const viewport = document.querySelector<HTMLElement>('.tr-scroll-area-viewport');
  const vertical = document.querySelector<HTMLElement>(
    '.tr-scroll-area-scrollbar[data-orientation="vertical"]',
  );
  const horizontal = document.querySelector<HTMLElement>(
    '.tr-scroll-area-scrollbar[data-orientation="horizontal"]',
  );
  await expect.poll(() => vertical?.offsetHeight ?? 0).toBeGreaterThan(0);

  viewport?.focus();
  await userEvent.keyboard('{ArrowDown}');
  await expect.poll(() => viewport?.scrollTop ?? 0).toBeGreaterThan(0);
  const keyboardScrollTop = viewport?.scrollTop ?? 0;
  vertical?.dispatchEvent(new WheelEvent('wheel', { bubbles: true, deltaY: 60 }));
  await expect.poll(() => viewport?.scrollTop ?? 0).toBeGreaterThan(keyboardScrollTop);
  horizontal?.dispatchEvent(new WheelEvent('wheel', { bubbles: true, deltaX: 80 }));
  await expect.poll(() => viewport?.scrollLeft ?? 0).toBeGreaterThan(0);
});

test('preserves RTL horizontal scrolling and reports overflow edges', async () => {
  await render(
    <TRDirectionProvider direction="rtl">
      <div dir="rtl">
        <TRScrollArea.Root
          overflowEdgeThreshold={4}
          style={{ height: 100, width: 240 }}
        >
          <TRScrollArea.Viewport aria-label="RTL rack events">
            <TRScrollArea.Content style={{ width: 720 }}>
              Rack events
            </TRScrollArea.Content>
          </TRScrollArea.Viewport>
          <TRScrollArea.Scrollbar orientation="horizontal">
            <TRScrollArea.Thumb />
          </TRScrollArea.Scrollbar>
        </TRScrollArea.Root>
      </div>
    </TRDirectionProvider>,
  );
  const root = document.querySelector<HTMLElement>('.tr-scroll-area');
  const viewport = document.querySelector<HTMLElement>('.tr-scroll-area-viewport');
  const scrollbar = document.querySelector<HTMLElement>('.tr-scroll-area-scrollbar');
  await expect.poll(() => scrollbar?.offsetWidth ?? 0).toBeGreaterThan(0);

  scrollbar?.dispatchEvent(new WheelEvent('wheel', { bubbles: true, deltaX: -80 }));
  await expect.poll(() => viewport?.scrollLeft ?? 0).toBeLessThan(0);
  await expect.poll(() => root?.hasAttribute('data-overflow-x-start')).toBe(true);
  expect(root).toHaveAttribute('data-overflow-x-end');
});

test('keeps non-overflow tracks mounted on request and honors consumer color tokens', async () => {
  await render(
    <TRScrollArea.Root
      style={
        {
          '--tr-scroll-area-color': 'rgb(1, 2, 3)',
          height: 120,
          width: 240,
        } as CSSProperties
      }
    >
      <TRScrollArea.Viewport>
        <TRScrollArea.Content>Short content</TRScrollArea.Content>
      </TRScrollArea.Viewport>
      <TRScrollArea.Scrollbar keepMounted orientation="vertical">
        <TRScrollArea.Thumb />
      </TRScrollArea.Scrollbar>
    </TRScrollArea.Root>,
  );
  const content = document.querySelector<HTMLElement>('.tr-scroll-area-content');
  const scrollbar = document.querySelector<HTMLElement>('.tr-scroll-area-scrollbar');

  expect(scrollbar).not.toBeNull();
  expect(scrollbar).toHaveAttribute('data-orientation', 'vertical');
  expect(getComputedStyle(content as HTMLElement).color).toBe('rgb(1, 2, 3)');
});

test('server-renders and hydrates two-axis overflow without recovery', async () => {
  const fixture = (
    <TRScrollArea.Root autoHide style={{ height: 120, width: 240 }}>
      <TRScrollArea.Viewport aria-label="Hydrated rack events">
        <TRScrollArea.Content style={{ height: 360, width: 480 }}>
          Rack events
        </TRScrollArea.Content>
      </TRScrollArea.Viewport>
      <TRScrollArea.Scrollbar keepMounted orientation="vertical">
        <TRScrollArea.Thumb />
      </TRScrollArea.Scrollbar>
      <TRScrollArea.Scrollbar keepMounted orientation="horizontal">
        <TRScrollArea.Thumb />
      </TRScrollArea.Scrollbar>
      <TRScrollArea.Corner />
    </TRScrollArea.Root>
  );
  const host = document.createElement('div');
  host.innerHTML = renderToString(fixture);
  document.body.append(host);
  const hydrationErrors: unknown[] = [];
  const root = hydrateRoot(host, fixture, {
    onRecoverableError(error) {
      hydrationErrors.push(error);
    },
  });

  await act(async () => {});
  expect(hydrationErrors).toEqual([]);
  expect(host.querySelector('.tr-scroll-area')).toHaveAttribute(
    'data-auto-hide',
    'true',
  );
  expect(host.querySelectorAll('.tr-scroll-area-scrollbar')).toHaveLength(2);

  await act(async () => root.unmount());
  host.remove();
});
