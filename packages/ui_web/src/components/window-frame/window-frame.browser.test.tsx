import '../../core/core.css';
import './window-frame.css';
import { type CSSProperties, createRef } from 'react';
import { expect, test } from 'vitest';
import { render } from 'vitest-browser-react';
import {
  TRWindowFrame,
  TRWindowFrameAddressBar,
  TRWindowFrameBody,
  TRWindowFrameControl,
  TRWindowFrameControls,
  TRWindowFrameRoot,
  TRWindowFrameTitle,
  TRWindowFrameTitleBar,
} from './index.js';

function trackWidths(element: HTMLElement) {
  return getComputedStyle(element)
    .gridTemplateColumns.split(' ')
    .map((value) => Number.parseFloat(value));
}

test('assembles the semantic window-frame parts', () => {
  expect(TRWindowFrame.Root).toBe(TRWindowFrameRoot);
  expect(TRWindowFrame.TitleBar).toBe(TRWindowFrameTitleBar);
  expect(TRWindowFrame.Controls).toBe(TRWindowFrameControls);
  expect(TRWindowFrame.Control).toBe(TRWindowFrameControl);
  expect(TRWindowFrame.Title).toBe(TRWindowFrameTitle);
  expect(TRWindowFrame.AddressBar).toBe(TRWindowFrameAddressBar);
  expect(TRWindowFrame.Body).toBe(TRWindowFrameBody);
});

test('defaults to the macOS variant and centers the title within the bar', async () => {
  await render(
    <TRWindowFrame.Root data-testid="frame" style={{ width: 480 }}>
      <TRWindowFrame.TitleBar data-testid="bar">
        <TRWindowFrame.Controls />
        <TRWindowFrame.Title>zsh — tinyrack</TRWindowFrame.Title>
      </TRWindowFrame.TitleBar>
      <TRWindowFrame.Body>Body</TRWindowFrame.Body>
    </TRWindowFrame.Root>,
  );

  const root = document.querySelector<HTMLElement>('[data-testid="frame"]');
  expect(root?.dataset['variant']).toBe('macos');
  expect(getComputedStyle(root as HTMLElement).overflow).toBe('hidden');

  // 1fr auto 1fr → the two outer tracks are equal, which centers the title.
  const [left, , right] = trackWidths(
    document.querySelector('[data-testid="bar"]') as HTMLElement,
  );
  expect(left).toBeGreaterThan(0);
  expect(left).toBeCloseTo(right as number, 1);

  const title = document.querySelector('.tr-window-frame-title') as HTMLElement;
  expect(getComputedStyle(title).justifySelf).toBe('center');
});

test('lets the browser variant address bar fill the remaining row', async () => {
  await render(
    <TRWindowFrame.Root data-testid="browser" style={{ width: 480 }} variant="browser">
      <TRWindowFrame.TitleBar data-testid="browser-bar">
        <TRWindowFrame.Controls />
        <TRWindowFrame.AddressBar>
          https://dotweave.tinyrack.net/en/
        </TRWindowFrame.AddressBar>
      </TRWindowFrame.TitleBar>
      <TRWindowFrame.Body padding="none">Body</TRWindowFrame.Body>
    </TRWindowFrame.Root>,
  );

  expect(
    document.querySelector<HTMLElement>('[data-testid="browser"]')?.dataset['variant'],
  ).toBe('browser');

  const tracks = trackWidths(
    document.querySelector('[data-testid="browser-bar"]') as HTMLElement,
  );
  expect(tracks).toHaveLength(2);
  expect(tracks[1]).toBeGreaterThan(tracks[0] as number);
});

test('auto-renders three decorative traffic-light dots by default', async () => {
  await render(<TRWindowFrame.Controls data-testid="controls" />);

  const controls = document.querySelector<HTMLElement>('[data-testid="controls"]');
  expect(controls?.getAttribute('aria-hidden')).toBe('true');

  const dots = controls?.querySelectorAll('.tr-window-frame-control');
  expect(dots).toHaveLength(3);
  expect(Array.from(dots ?? [], (dot) => dot.getAttribute('data-tone'))).toEqual([
    'close',
    'minimize',
    'maximize',
  ]);

  const close = controls?.querySelector('[data-tone="close"]') as HTMLElement;
  const minimize = controls?.querySelector('[data-tone="minimize"]') as HTMLElement;
  const closeStyle = getComputedStyle(close);
  expect(closeStyle.width).toBe(closeStyle.height);
  expect(Number.parseFloat(closeStyle.width)).toBeGreaterThan(0);
  expect(closeStyle.backgroundColor).not.toBe(
    getComputedStyle(minimize).backgroundColor,
  );
});

test('allows explicit controls to override the auto-rendered dots', async () => {
  await render(
    <TRWindowFrame.Controls data-testid="custom-controls">
      <TRWindowFrame.Control tone="close" />
      <TRWindowFrame.Control tone="maximize" />
    </TRWindowFrame.Controls>,
  );

  const dots = document
    .querySelector('[data-testid="custom-controls"]')
    ?.querySelectorAll('.tr-window-frame-control');
  expect(dots).toHaveLength(2);
  expect(Array.from(dots ?? [], (dot) => dot.getAttribute('data-tone'))).toEqual([
    'close',
    'maximize',
  ]);
});

test('styles every body padding value', async () => {
  await render(
    <div>
      {(['none', 'sm', 'md', 'lg'] as const).map((padding) => (
        <TRWindowFrame.Body
          data-testid={`padding-${padding}`}
          key={padding}
          padding={padding}
        />
      ))}
    </div>,
  );

  const values = (['none', 'sm', 'md', 'lg'] as const).map((padding) => {
    const element = document.querySelector(
      `[data-testid="padding-${padding}"]`,
    ) as HTMLElement;
    expect(element.dataset['padding']).toBe(padding);
    return Number.parseFloat(getComputedStyle(element).paddingTop);
  });
  expect(values[0]).toBe(0);
  expect(values[1]).toBeLessThan(values[2] as number);
  expect(values[2]).toBeLessThan(values[3] as number);
});

test('lets consumers restyle the dots and body through --tr-* custom properties', async () => {
  await render(
    <TRWindowFrame.Root
      style={
        {
          '--tr-window-frame-control-close': 'rgb(1, 2, 3)',
          '--tr-window-frame-body-background': 'rgb(4, 5, 6)',
          '--tr-window-frame-body-color': 'rgb(7, 8, 9)',
        } as CSSProperties
      }
    >
      <TRWindowFrame.TitleBar>
        <TRWindowFrame.Controls />
      </TRWindowFrame.TitleBar>
      <TRWindowFrame.Body data-testid="custom-body">Body</TRWindowFrame.Body>
    </TRWindowFrame.Root>,
  );

  const close = document.querySelector('[data-tone="close"]') as HTMLElement;
  expect(getComputedStyle(close).backgroundColor).toBe('rgb(1, 2, 3)');

  const body = document.querySelector('[data-testid="custom-body"]') as HTMLElement;
  const bodyStyle = getComputedStyle(body);
  expect(bodyStyle.backgroundColor).toBe('rgb(4, 5, 6)');
  expect(bodyStyle.color).toBe('rgb(7, 8, 9)');
});

test('renders a polymorphic root and title without wrapper nodes', async () => {
  await render(
    <TRWindowFrame.Root data-testid="figure" render={<figure />}>
      <TRWindowFrame.TitleBar>
        <TRWindowFrame.Title render={<h2>Preview</h2>} />
      </TRWindowFrame.TitleBar>
    </TRWindowFrame.Root>,
  );

  const root = document.querySelector<HTMLElement>('[data-testid="figure"]');
  expect(root?.tagName).toBe('FIGURE');
  expect(root?.classList.contains('tr-window-frame')).toBe(true);
  expect(root?.querySelector('h2.tr-window-frame-title')?.textContent).toBe('Preview');
});

test('forwards refs, native props, and events from the public parts', async () => {
  const rootRef = createRef<HTMLDivElement>();
  const bodyRef = createRef<HTMLDivElement>();
  let clicks = 0;

  await render(
    <TRWindowFrame.Root
      aria-label="Terminal"
      className="consumer-root"
      onClick={() => clicks++}
      ref={rootRef}
    >
      <TRWindowFrame.TitleBar>
        <TRWindowFrame.Controls />
        <TRWindowFrame.Title>Terminal</TRWindowFrame.Title>
      </TRWindowFrame.TitleBar>
      <TRWindowFrame.Body ref={bodyRef}>Body</TRWindowFrame.Body>
    </TRWindowFrame.Root>,
  );

  rootRef.current?.click();
  expect(clicks).toBe(1);
  expect(rootRef.current).toHaveClass('tr-window-frame', 'consumer-root');
  expect(rootRef.current).toHaveAttribute('aria-label', 'Terminal');
  expect(bodyRef.current).toHaveClass('tr-window-frame-body');
});
