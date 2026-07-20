import '../../core/core.css';
import './scroll-area.css';
import { createRef } from 'react';
import { expect, test } from 'vitest';
import { userEvent } from 'vitest/browser';
import { render } from 'vitest-browser-react';
import { TRScrollArea, TRScrollAreaRoot } from './index.js';

test('renders the Tinyrack TRScrollArea wrapper', async () => {
  expect(TRScrollArea.Root).toBe(TRScrollAreaRoot);
  await render(
    <TRScrollArea.Root>
      <TRScrollArea.Viewport>
        <TRScrollArea.Content>Scrollable content</TRScrollArea.Content>
      </TRScrollArea.Viewport>
      <TRScrollArea.Scrollbar>
        <TRScrollArea.Thumb />
      </TRScrollArea.Scrollbar>
      <TRScrollArea.Corner />
    </TRScrollArea.Root>,
  );
  expect(document.querySelector('.tr-scroll-area')).not.toBeNull();
  expect(document.querySelector('.tr-scroll-area')?.getAttribute('data-variant')).toBe(
    'surface',
  );
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
